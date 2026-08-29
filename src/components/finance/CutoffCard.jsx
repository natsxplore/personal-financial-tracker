import Currency from "./Currency";

export default function CutoffCard({
    title,
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
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-800">
                    {title}
                </h3>

                <span className="text-[11px] font-semibold text-slate-400">
                    {percentage}%
                </span>
            </div>

            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div
                    className="h-full rounded-full bg-slate-800"
                    style={{
                        width: `${percentage}%`,
                    }}
                />
            </div>

            <div className="mt-4 space-y-2">
                <Row
                    label="Budget"
                    value={budget}
                />

                <Row
                    label="Spent"
                    value={spent}
                />

                <Row
                    label="Remaining"
                    value={remaining}
                    color="text-emerald-600"
                />
            </div>
        </div>
    );
}

function Row({
    label,
    value,
    color = "text-slate-700",
}) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
                {label}
            </span>

            <span
                className={`text-[11px] font-semibold ${color}`}
            >
                <Currency value={value} />
            </span>
        </div>
    );
}