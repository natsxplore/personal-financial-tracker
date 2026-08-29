import { useState } from "react";
import {
    TrendingUp,
    Pencil,
    X,
    Save,
    Eye,
    EyeOff,
} from "lucide-react";

import { db } from "../../db";
import Currency from "./Currency";
import Modal from "./Modal";
import { usePrivacy } from "../../hooks/usePrivacy";

export default function IncomeSummary({
    monthKey,
    incomeRows,
    cutoff1,
    cutoff2,
}) {
    const [editing, setEditing] = useState(false);
    const [cutoff1Amount, setCutoff1Amount] =
        useState(String(cutoff1));
    const [cutoff2Amount, setCutoff2Amount] =
        useState(String(cutoff2));
    const [saving, setSaving] = useState(false);

    const total = cutoff1 + cutoff2;

    const { hidden, toggleHidden } = usePrivacy();

    function openEditor() {
        setCutoff1Amount(String(cutoff1));
        setCutoff2Amount(String(cutoff2));
        setEditing(true);
    }

    async function handleSave() {
        setSaving(true);

        try {
            await db.transaction(
                "rw",
                db.income,
                async () => {
                    for (const cutoff of [1, 2]) {
                        const amount =
                            cutoff === 1
                                ? Number(
                                      cutoff1Amount
                                  ) || 0
                                : Number(
                                      cutoff2Amount
                                  ) || 0;

                        const row = incomeRows.find(
                            (entry) =>
                                Number(
                                    entry.cutoff
                                ) === cutoff
                        );

                        if (row) {
                            await db.income.update(
                                row.id,
                                { amount }
                            );
                        } else {
                            await db.income.add({
                                month: monthKey,
                                cutoff,
                                amount,
                            });
                        }
                    }
                }
            );

            setEditing(false);
        } catch (error) {
            console.error(error);
            alert("Failed to save income.");
        } finally {
            setSaving(false);
        }
    }

    return (
        <>
            <section className="mx-5 rounded-3xl bg-slate-900 p-5 text-white shadow-sm">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-xs font-medium text-slate-400">
                            Total monthly net
                        </p>

                        <Currency
                            value={total}
                            className="mt-1 block text-3xl font-bold tracking-tight"
                        />

                        {total === 0 && (
                            <p className="mt-2 text-xs text-slate-400">
                                Tap edit to set your
                                salary
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            onClick={toggleHidden}
                            className="flex h-7 w-7 items-center justify-center rounded-xl bg-white/10 transition hover:bg-white/20"
                            aria-label={
                                hidden
                                    ? "Show amounts"
                                    : "Hide amounts"
                            }
                            aria-pressed={hidden}
                        >
                            {hidden ? (
                                <EyeOff size={13} />
                            ) : (
                                <Eye size={13} />
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={openEditor}
                            className="flex h-7 w-7 items-center justify-center rounded-xl bg-white/10 transition hover:bg-white/20"
                            aria-label="Edit income"
                        >
                            <Pencil size={13} />
                        </button>
                    </div>
                </div>

                <div className="mt-5 grid grid-cols-2">
                    <Income
                        label="Cutoff 1"
                        value={cutoff1}
                    />

                    <Income
                        label="Cutoff 2"
                        value={cutoff2}
                        border
                    />
                </div>
            </section>

            {editing && (
                <IncomeEditor
                    cutoff1Amount={cutoff1Amount}
                    cutoff2Amount={cutoff2Amount}
                    saving={saving}
                    onChangeCutoff1={setCutoff1Amount}
                    onChangeCutoff2={setCutoff2Amount}
                    onClose={() => setEditing(false)}
                    onSave={handleSave}
                />
            )}
        </>
    );
}

function Income({
    label,
    value,
    border,
}) {
    return (
        <div
            className={
                border
                    ? "border-l border-white/10 pl-4"
                    : ""
            }
        >
            <p className="text-[11px] text-slate-400">
                {label}
            </p>

            <p className="mt-1 text-sm font-semibold">
                <Currency value={value} />
            </p>
        </div>
    );
}

function IncomeEditor({
    cutoff1Amount,
    cutoff2Amount,
    saving,
    onChangeCutoff1,
    onChangeCutoff2,
    onClose,
    onSave,
}) {
    return (
        <Modal>
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <div>
                    <h2 className="text-sm font-bold text-slate-900">
                        Edit Income
                    </h2>

                    <p className="mt-0.5 text-[11px] text-slate-400">
                        Set net salary per cutoff
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

            <div className="space-y-3 px-4 py-3">
                <IncomeField
                    label="Cutoff 1"
                    value={cutoff1Amount}
                    onChange={onChangeCutoff1}
                />

                <IncomeField
                    label="Cutoff 2"
                    value={cutoff2Amount}
                    onChange={onChangeCutoff2}
                />
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
                    onClick={onSave}
                    disabled={saving}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-slate-900 py-2.5 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                    <Save size={14} />

                    {saving ? "Saving..." : "Save"}
                </button>
            </div>
        </Modal>
    );
}

function IncomeField({
    label,
    value,
    onChange,
}) {
    return (
        <label className="block">
            <span className="text-xs font-semibold text-slate-700">
                {label}
            </span>

            <input
                type="number"
                min="0"
                step="0.01"
                value={value}
                onChange={(event) =>
                    onChange(event.target.value)
                }
                className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold outline-none focus:border-slate-400"
            />
        </label>
    );
}
