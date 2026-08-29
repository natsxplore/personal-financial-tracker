import { useEffect, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";

import { db } from "../db";
import { ensureMonthData } from "../db/seed";
import {
    enrichBudgetCategories,
    getCutoffStats,
    getExpenseOverview,
    getIncomeByCutoff,
    getTotalIncome,
} from "../utils/calculations";

export function useMonthFinance(monthKey) {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        let active = true;

        ensureMonthData(monthKey).then(() => {
            if (active) {
                setReady(true);
            }
        });

        return () => {
            active = false;
        };
    }, [monthKey]);

    const incomeRows = useLiveQuery(
        () =>
            db.income
                .where("month")
                .equals(monthKey)
                .toArray(),
        [monthKey]
    );

    const budgets = useLiveQuery(
        () =>
            db.budgets
                .where("month")
                .equals(monthKey)
                .toArray(),
        [monthKey]
    );

    const transactions = useLiveQuery(
        () =>
            db.transactions
                .where("month")
                .equals(monthKey)
                .toArray(),
        [monthKey]
    );

    const loading =
        !ready ||
        incomeRows === undefined ||
        budgets === undefined ||
        transactions === undefined;

    const income = incomeRows || [];
    const budgetRows = budgets || [];
    const monthTransactions = transactions || [];

    const totalIncome = getTotalIncome(income);
    const cutoff1Income = getIncomeByCutoff(income, 1);
    const cutoff2Income = getIncomeByCutoff(income, 2);

    const categories = enrichBudgetCategories(
        budgetRows,
        monthTransactions,
        totalIncome
    );

    const expenseOverview = getExpenseOverview(
        budgetRows,
        monthTransactions,
        totalIncome
    );

    const cutoffStats = {
        cutoff1: getCutoffStats(
            cutoff1Income,
            monthTransactions,
            1
        ),
        cutoff2: getCutoffStats(
            cutoff2Income,
            monthTransactions,
            2
        ),
    };

    return {
        loading,
        income,
        budgets: budgetRows,
        transactions: monthTransactions,
        totalIncome,
        cutoff1Income,
        cutoff2Income,
        categories,
        expenseOverview,
        cutoffStats,
    };
}
