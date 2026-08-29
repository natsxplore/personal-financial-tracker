import {
    Wallet,
} from "lucide-react";

import Currency from "./Currency";

export default function BudgetOverview({
    budget,
    spent,
}) {
    const remaining = Math.max(
        budget - spent,
        0
    );

    const percentage =
        budget > 0
            ? Math.min(
                  Math.round(
                      (spent / budget) * 100
                  ),
                  100
              )
            : 0;

    return (
        <section className="mx-5 mt-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                        <Wallet size={18} />
                    </div>

                    <div>
                        <h2 className="text-sm font-bold text-slate-900">
                            Spending
                        </h2>

                        <p className="text-[11px] text-slate-400">
                            Monthly expenses
                        </p>
                    </div>
                </div>

                <span className="text-xs font-bold text-slate-600">
                    {percentage}%
                </span>
            </div>

            <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                    className="h-full rounded-full bg-slate-900 transition-all"
                    style={{
                        width: `${percentage}%`,
                    }}
                />
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
                <Stat
                    label="Budget"
                    value={budget}
                />

                <Stat
                    label="Spent"
                    value={spent}
                />

                <Stat
                    label="Remaining"
                    value={remaining}
                    color="text-emerald-600"
                />
            </div>
        </section>
    );
}

function Stat({
    label,
    value,
    color = "text-slate-900",
}) {
    return (
        <div>
            <p className="text-[11px] text-slate-400">
                {label}
            </p>

            <p
                className={`mt-1 text-sm font-bold ${color}`}
            >
                <Currency value={value} />
            </p>
        </div>
    );
}