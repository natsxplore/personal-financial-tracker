import { db } from "../db";
import {
    defaultBudgets,
} from "../data/defaultBudget";

async function copyBudgetsToMonth(sourceBudgets, monthKey) {
    await db.budgets.bulkAdd(
        sourceBudgets.map((budget) => ({
            month: monthKey,
            name: budget.name,
            slug: budget.slug,
            type: budget.type,
            percentage: budget.percentage,
            color: budget.color,
            icon: budget.icon,
        }))
    );
}

async function seedTemplatesFromDefaults() {
    const existing = await db.budgetTemplates.count();

    if (existing > 0) {
        return;
    }

    const monthKeys = await db.budgets
        .orderBy("month")
        .uniqueKeys();

    if (monthKeys.length > 0) {
        const latestMonth = monthKeys.sort().at(-1);
        const budgets = await db.budgets
            .where("month")
            .equals(latestMonth)
            .toArray();

        if (budgets.length > 0) {
            await db.budgetTemplates.bulkAdd(
                budgets.map((budget, index) => ({
                    name: budget.name,
                    slug: budget.slug,
                    type: budget.type,
                    percentage: budget.percentage,
                    color: budget.color,
                    icon: budget.icon,
                    sortOrder: index,
                }))
            );

            return;
        }
    }

    await db.budgetTemplates.bulkAdd(
        defaultBudgets.map((budget, index) => ({
            ...budget,
            sortOrder: index,
        }))
    );
}

export async function ensureMonthData(monthKey) {
    const existingBudgets = await db.budgets
        .where("month")
        .equals(monthKey)
        .count();

    if (existingBudgets === 0) {
        const templates = await db.budgetTemplates
            .orderBy("sortOrder")
            .toArray();

        if (templates.length > 0) {
            await copyBudgetsToMonth(templates, monthKey);
        } else {
            const monthKeys = await db.budgets
                .orderBy("month")
                .uniqueKeys();
            const previousMonth = monthKeys
                .filter((key) => key !== monthKey)
                .sort()
                .at(-1);

            if (previousMonth) {
                const previousBudgets = await db.budgets
                    .where("month")
                    .equals(previousMonth)
                    .toArray();

                await copyBudgetsToMonth(
                    previousBudgets,
                    monthKey
                );
            } else {
                await copyBudgetsToMonth(
                    defaultBudgets,
                    monthKey
                );
                await seedTemplatesFromDefaults();
            }
        }
    }

    await seedTemplatesFromDefaults();

    for (const cutoff of [1, 2]) {
        const existingIncome = await db.income
            .where("[month+cutoff]")
            .equals([monthKey, cutoff])
            .first();

        if (!existingIncome) {
            await db.income.add({
                month: monthKey,
                cutoff,
                amount: 0,
            });
        }
    }
}

export async function syncBudgetTemplates(budgets) {
    await db.budgetTemplates.clear();

    await db.budgetTemplates.bulkAdd(
        budgets.map((budget, index) => ({
            name: budget.name.trim(),
            slug: budget.slug,
            type: budget.type,
            percentage: Number(budget.percentage || 0),
            color: budget.color,
            icon: budget.icon,
            sortOrder: index,
        }))
    );
}
