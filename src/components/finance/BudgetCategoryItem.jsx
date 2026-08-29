import { ChevronRight } from "lucide-react";

import Currency from "./Currency";
import { getBudgetTheme } from "../../utils/budgetIcons";
import BudgetIcon from "./BudgetIcon";

export default function BudgetCategoryItem({
    category,
}) {
    const theme = getBudgetTheme(category.color);

    const remaining = Math.max(
        category.budget - category.spent,
        0
    );

    const percentage =
        category.budget > 0
            ? Math.min(
                  Math.round(
                      (category.spent /
                          category.budget) *
                          100
                  ),
                  100
              )
            : 0;

    const isSaving = category.type === "saving";

    return (
        <button
            type="button"
            className="w-full border-t border-slate-100 px-5 py-4 text-left transition hover:bg-slate-50 active:bg-slate-100"
        >
            <div className="flex items-center gap-3">
                <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${theme.icon}`}
                >
                    <BudgetIcon
                        icon={category.icon}
                        size={19}
                    />
                </div>

                <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-800">
                        {category.name}
                    </p>

                    <p className="mt-0.5 text-[11px] text-slate-400">
                        {category.percentage}% allocation
                        {" · "}
                        {isSaving ? "Saving" : "Expense"}
                    </p>
                </div>

                <div className="text-right">
                    <p className="text-[10px] text-slate-400">
                        Budget
                    </p>

                    <p className="text-xs font-semibold text-slate-700">
                        <Currency value={category.budget} />
                    </p>
                </div>

                <ChevronRight
                    size={16}
                    className="text-slate-300"
                />
            </div>

            <div className="ml-[52px] mt-3">
                <div className="flex items-center justify-between">
                    <p className="text-[11px] text-slate-400">
                        {isSaving ? "Saved" : "Spent"}{" "}
                        <span className="font-semibold text-slate-600">
                            <Currency value={category.spent} />
                        </span>
                    </p>

                    <p className="text-[11px] font-semibold text-emerald-600">
                        <Currency value={remaining} />{" "}
                        {isSaving ? "to go" : "left"}
                    </p>
                </div>

                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                        className={`h-full rounded-full ${theme.bar}`}
                        style={{
                            width: `${percentage}%`,
                        }}
                    />
                </div>
            </div>
        </button>
    );
}
