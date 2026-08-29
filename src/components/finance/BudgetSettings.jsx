import { useState } from "react";
import { Plus, Save, X } from "lucide-react";

import { db } from "../../db";
import { syncBudgetTemplates } from "../../db/seed";
import {
    createEmptyBudgetCategory,
} from "../../data/defaultBudget";
import { calculateTotalPercentage } from "../../utils/budget";
import {
    createSlug,
    getBudgetRowId,
    isNewBudget,
} from "../../utils/budgetCategory";
import BudgetCategoryRow from "./BudgetCategoryRow";
import Modal from "./Modal";

export default function BudgetSettings({
    monthKey,
    initialBudgets,
    formattedMonth,
    onClose,
    onSaved,
}) {
    const [budgets, setBudgets] = useState(() =>
        initialBudgets.map((budget) => ({ ...budget }))
    );
    const [saving, setSaving] = useState(false);

    function updateBudget(rowId, fields) {
        setBudgets((current) =>
            current.map((budget) => {
                if (getBudgetRowId(budget) !== rowId) {
                    return budget;
                }

                const next = { ...budget, ...fields };

                if (fields.name && isNewBudget(budget)) {
                    next.slug = createSlug(fields.name);
                }

                return next;
            })
        );
    }

    function addCategory() {
        const existingSlugs = budgets.map(
            (budget) => budget.slug
        );

        setBudgets((current) => [
            ...current,
            createEmptyBudgetCategory(existingSlugs),
        ]);
    }

    function removeCategory(rowId) {
        setBudgets((current) =>
            current.filter(
                (budget) =>
                    getBudgetRowId(budget) !== rowId
            )
        );
    }

    async function handleSave() {
        const trimmed = budgets.map((budget) => ({
            ...budget,
            name: budget.name.trim(),
        }));

        if (trimmed.some((budget) => !budget.name)) {
            alert("Every category needs a name.");
            return;
        }

        const slugs = trimmed.map((budget) => budget.slug);
        const uniqueSlugs = new Set(slugs);

        if (uniqueSlugs.size !== slugs.length) {
            alert("Category slugs must be unique.");
            return;
        }

        const total = calculateTotalPercentage(trimmed);

        if (total !== 100) {
            alert(
                `Percentage must equal 100%. Current total: ${total}%`
            );
            return;
        }

        setSaving(true);

        try {
            await db.transaction(
                "rw",
                [db.budgets, db.budgetTemplates, db.transactions],
                async () => {
                    const existing = await db.budgets
                        .where("month")
                        .equals(monthKey)
                        .toArray();
                    const nextIds = new Set(
                        trimmed
                            .filter((budget) => budget.id)
                            .map((budget) => budget.id)
                    );

                    for (const budget of existing) {
                        if (!nextIds.has(budget.id)) {
                            const txCount =
                                await db.transactions
                                    .where("category")
                                    .equals(budget.slug)
                                    .count();

                            if (txCount > 0) {
                                throw new Error(
                                    `Cannot delete "${budget.name}" because it has transactions.`
                                );
                            }

                            await db.budgets.delete(
                                budget.id
                            );
                        }
                    }

                    for (const budget of trimmed) {
                        const payload = {
                            month: monthKey,
                            name: budget.name,
                            slug: budget.slug,
                            type: budget.type,
                            percentage: Number(
                                budget.percentage
                            ),
                            color: budget.color,
                            icon: budget.icon,
                        };

                        if (budget.id) {
                            const previous =
                                existing.find(
                                    (entry) =>
                                        entry.id ===
                                        budget.id
                                );

                            if (
                                previous &&
                                previous.slug !==
                                    budget.slug
                            ) {
                                await db.transactions
                                    .where("category")
                                    .equals(
                                        previous.slug
                                    )
                                    .modify({
                                        category:
                                            budget.slug,
                                    });
                            }

                            await db.budgets.update(
                                budget.id,
                                payload
                            );
                        } else {
                            await db.budgets.add(payload);
                        }
                    }

                    await syncBudgetTemplates(trimmed);
                }
            );

            onSaved();
            onClose();
        } catch (error) {
            console.error(error);
            alert(
                error.message ||
                    "Failed to save budget categories."
            );
        } finally {
            setSaving(false);
        }
    }

    const total = calculateTotalPercentage(budgets);

    return (
        <Modal wide>
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <div>
                    <h2 className="text-sm font-bold text-slate-900">
                        Budget Settings
                    </h2>
                    <p className="mt-0.5 text-[11px] text-slate-400">
                        {formattedMonth}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={onClose}
                    className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-slate-100"
                >
                    <X size={16} />
                </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
                <div className="space-y-2">
                    {budgets.map((budget) => (
                        <BudgetCategoryRow
                            key={getBudgetRowId(budget)}
                            budget={budget}
                            onChange={updateBudget}
                            onDelete={removeCategory}
                        />
                    ))}
                </div>

                <button
                    type="button"
                    onClick={addCategory}
                    className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-slate-300 py-2.5 text-xs font-semibold text-slate-600 transition hover:border-slate-400 hover:bg-slate-50"
                >
                    <Plus size={14} />
                    Add Category
                </button>

                <div
                    className={`mt-3 rounded-xl p-3 ${
                        total === 100
                            ? "bg-emerald-50"
                            : "bg-red-50"
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold">
                            Total
                        </span>
                        <span
                            className={`text-xs font-bold ${
                                total === 100
                                    ? "text-emerald-600"
                                    : "text-red-600"
                            }`}
                        >
                            {total}%
                        </span>
                    </div>

                    {total !== 100 && (
                        <p className="mt-1 text-[11px] text-red-500">
                            Your allocation must equal 100%.
                        </p>
                    )}
                </div>
            </div>

            <div className="flex gap-2 border-t border-slate-100 p-4">
                <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-600"
                >
                    Cancel
                </button>

                <button
                    type="button"
                    onClick={handleSave}
                    disabled={
                        saving ||
                        total !== 100 ||
                        budgets.length === 0
                    }
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-slate-900 py-2.5 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                    <Save size={14} />
                    {saving ? "Saving..." : "Save"}
                </button>
            </div>
        </Modal>
    );
}
