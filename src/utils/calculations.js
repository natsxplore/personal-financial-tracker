import { calculateBudget } from "./budget";

/**
 * Transaction types:
 * - expense: spending (Needs, Fun)
 * - saving: allocation to savings categories
 * - transfer: between accounts (account -> toAccount)
 * - income: salary/deposits (separate from planned salary in income table)
 */

export function getTotalIncome(incomeRows) {
    return incomeRows.reduce(
        (total, row) => total + Number(row.amount || 0),
        0
    );
}

export function getIncomeByCutoff(incomeRows, cutoff) {
    const row = incomeRows.find(
        (entry) => Number(entry.cutoff) === cutoff
    );

    return Number(row?.amount || 0);
}

export function getCategoryBudget(totalIncome, percentage) {
    return calculateBudget(totalIncome, percentage);
}

export function getCategorySpent(transactions, slug, type) {
    const txType = type === "expense" ? "expense" : "saving";

    return transactions
        .filter(
            (tx) =>
                tx.category === slug &&
                tx.type === txType
        )
        .reduce(
            (total, tx) => total + Number(tx.amount || 0),
            0
        );
}

export function getCutoffStats(incomeAmount, transactions, cutoff) {
    const budget = incomeAmount;

    const spent = transactions
        .filter(
            (tx) =>
                Number(tx.cutoff) === cutoff &&
                tx.type === "expense"
        )
        .reduce(
            (total, tx) => total + Number(tx.amount || 0),
            0
        );

    return {
        budget,
        spent,
        remaining: Math.max(budget - spent, 0),
    };
}

export function enrichBudgetCategories(
    budgets,
    transactions,
    totalIncome
) {
    return budgets.map((budget) => {
        const budgetAmount = getCategoryBudget(
            totalIncome,
            budget.percentage
        );

        const spent = getCategorySpent(
            transactions,
            budget.slug,
            budget.type
        );

        return {
            id: budget.id,
            name: budget.name,
            slug: budget.slug,
            type: budget.type,
            percentage: budget.percentage,
            budget: budgetAmount,
            spent,
            remaining: Math.max(budgetAmount - spent, 0),
            color: budget.color,
            icon: budget.icon,
        };
    });
}

export function getExpenseOverview(
    budgets,
    transactions,
    totalIncome
) {
    const expenseBudgets = budgets.filter(
        (budget) => budget.type === "expense"
    );

    const budget = expenseBudgets.reduce(
        (total, entry) =>
            total +
            getCategoryBudget(
                totalIncome,
                entry.percentage
            ),
        0
    );

    const spent = expenseBudgets.reduce(
        (total, entry) =>
            total +
            getCategorySpent(
                transactions,
                entry.slug,
                entry.type
            ),
        0
    );

    return {
        budget,
        spent,
        remaining: Math.max(budget - spent, 0),
    };
}

export function getAccountBalance(
    accountId,
    transactions,
    initialBalance = 0
) {
    return transactions.reduce((balance, tx) => {
        const amount = Number(tx.amount || 0);

        if (tx.type === "income" && tx.account === accountId) {
            return balance + amount;
        }

        if (
            (tx.type === "expense" || tx.type === "saving") &&
            tx.account === accountId
        ) {
            return balance - amount;
        }

        if (tx.type === "transfer") {
            if (tx.account === accountId) {
                return balance - amount;
            }

            if (tx.toAccount === accountId) {
                return balance + amount;
            }
        }

        return balance;
    }, initialBalance);
}

export function getGoalProgress(goal) {
    const current = Number(goal.current || 0);
    const target = Number(goal.target || 0);

    return {
        current,
        target,
        percent:
            target > 0
                ? Math.min(
                      Math.round(
                          (current / target) * 100
                      ),
                      100
                  )
                : 0,
    };
}
