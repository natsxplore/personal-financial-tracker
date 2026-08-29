import Dexie from "dexie";

export const db = new Dexie("FinancialTracker");

db.version(1).stores({
    transactions:
        "++id, date, type, amount, category, note, account, cutoff, month",

    budgets:
        "++id, month, name, percentage, budgetAmount, color, icon",

    accounts:
        "++id, name, type, balance, color",

    goals:
        "++id, name, current, target, color, icon",

    income:
        "++id, month, cutoff, amount",
});

db.version(2)
    .stores({
        transactions:
            "++id, date, type, amount, category, note, account, toAccount, cutoff, month",

        budgets:
            "++id, month, name, slug, type, percentage, color, icon",

        accounts:
            "++id, name, type, balance, color",

        goals:
            "++id, name, current, target, color, icon",

        income:
            "++id, month, cutoff, [month+cutoff], amount",
    })
    .upgrade(async (tx) => {
        const slugMap = {
            Needs: "needs",
            "Emergency Fund": "emergency",
            "House & Lot": "house",
            "Marriage Fund": "marriage",
            "Business/Career": "business",
            Fun: "fun",
        };

        const typeMap = {
            Needs: "expense",
            Fun: "expense",
        };

        await tx
            .table("budgets")
            .toCollection()
            .modify((budget) => {
                budget.slug =
                    budget.slug ||
                    slugMap[budget.name] ||
                    budget.name
                        .toLowerCase()
                        .replace(/\s+/g, "-");

                budget.type =
                    budget.type ||
                    typeMap[budget.name] ||
                    "saving";
            });
    });

db.version(3).stores({
    transactions:
        "++id, date, type, amount, category, note, account, toAccount, cutoff, month",

    budgets:
        "++id, month, name, slug, type, percentage, color, icon",

    budgetTemplates:
        "++id, slug, name, type, percentage, color, icon, sortOrder",

    accounts:
        "++id, name, type, balance, color",

    goals:
        "++id, name, current, target, color, icon",

    income:
        "++id, month, cutoff, [month+cutoff], amount",
});
