import {
    ChevronLeft,
    ChevronRight,
    Settings2,
} from "lucide-react";

export default function MonthSelector({
    month,
    onPrevMonth,
    onNextMonth,
    onOpenSettings,
}) {
    return (
        <div className="flex items-center justify-between px-5 pb-4">
            <div className="flex items-center gap-1">
                <button
                    type="button"
                    onClick={onPrevMonth}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-100"
                    aria-label="Previous month"
                >
                    <ChevronLeft size={17} />
                </button>

                <button
                    type="button"
                    onClick={onNextMonth}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-100"
                    aria-label="Next month"
                >
                    <ChevronRight size={17} />
                </button>

                <p className="ml-2 text-sm font-semibold text-slate-800">
                    {month}
                </p>
            </div>

            <button
                type="button"
                onClick={onOpenSettings}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-100"
                aria-label="Budget settings"
            >
                <Settings2 size={17} />
            </button>
        </div>
    );
}
