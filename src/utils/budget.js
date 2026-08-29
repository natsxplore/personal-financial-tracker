export function calculateBudget(
    income,
    percentage
) {
    return income * (percentage / 100);
}

export function calculateTotalPercentage(
    budgets
) {
    return budgets.reduce(
        (total, budget) =>
            total + Number(budget.percentage || 0),
        0
    );
}