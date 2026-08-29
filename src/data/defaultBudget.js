import { createSlug } from "../utils/budgetCategory";
import {
    DEFAULT_BUDGET_COLOR,
    DEFAULT_BUDGET_ICON,
} from "./budgetOptions";

export const defaultBudgets = [
    {
        name: "Needs",
        slug: "needs",
        type: "expense",
        percentage: 50,
        color: "blue",
        icon: "shopping-bag",
    },
    {
        name: "Emergency Fund",
        slug: "emergency",
        type: "saving",
        percentage: 20,
        color: "green",
        icon: "shield",
    },
    {
        name: "Personal",
        slug: "personal",
        type: "expense",
        percentage: 30,
        color: "cyan",
        icon: "gamepad",
    },
];

export function createEmptyBudgetCategory(existingSlugs = []) {
    const name = "New Category";
    let slug = createSlug(name);
    let suffix = 1;

    while (existingSlugs.includes(slug)) {
        slug = `${createSlug(name)}-${suffix}`;
        suffix += 1;
    }

    return {
        tempId: `new-${Date.now()}`,
        name,
        slug,
        type: "expense",
        percentage: 0,
        color: DEFAULT_BUDGET_COLOR,
        icon: DEFAULT_BUDGET_ICON,
    };
}
