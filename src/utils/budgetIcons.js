export const budgetThemes = {
    blue: {
        icon: "bg-blue-50 text-blue-600",
        bar: "bg-blue-600",
    },
    green: {
        icon: "bg-emerald-50 text-emerald-600",
        bar: "bg-emerald-500",
    },
    orange: {
        icon: "bg-orange-50 text-orange-600",
        bar: "bg-orange-500",
    },
    pink: {
        icon: "bg-pink-50 text-pink-600",
        bar: "bg-pink-500",
    },
    purple: {
        icon: "bg-purple-50 text-purple-600",
        bar: "bg-purple-500",
    },
    cyan: {
        icon: "bg-cyan-50 text-cyan-600",
        bar: "bg-cyan-500",
    },
    red: {
        icon: "bg-red-50 text-red-600",
        bar: "bg-red-500",
    },
    amber: {
        icon: "bg-amber-50 text-amber-600",
        bar: "bg-amber-500",
    },
    slate: {
        icon: "bg-slate-100 text-slate-600",
        bar: "bg-slate-600",
    },
};

const fallbackTheme = budgetThemes.slate;

export function getBudgetTheme(colorKey) {
    return budgetThemes[colorKey] || fallbackTheme;
}
