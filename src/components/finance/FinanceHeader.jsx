import {
    Bell,
    WalletCards,
} from "lucide-react";

export default function FinanceHeader() {

    return (
        <header className="flex h-16 items-center justify-between px-5">
            <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white">
                    <WalletCards size={18} />
                </div>

                <div>
                    <h1 className="text-sm font-bold text-slate-900">
                        Financial Tracker
                    </h1>

                    <p className="text-[11px] text-slate-400">
                        Personal finance
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <button
                    type="button"
                    className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100"
                    aria-label="Notifications"
                >
                    <Bell size={18} />

                    <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-red-500" />
                </button>
            </div>
        </header>
    );
}
