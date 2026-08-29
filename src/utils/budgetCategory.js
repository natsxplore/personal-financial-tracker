export function createSlug(name) {
    const slug = name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    return slug || "category";
}

export function getBudgetRowId(budget) {
    return budget.id ?? budget.tempId;
}

export function isNewBudget(budget) {
    return !budget.id;
}
