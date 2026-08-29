import {
    LayoutDashboard,
    ArrowLeftRight,
    Landmark,
    Target,
    MoreHorizontal,
} from "lucide-react";

const navigation = [
    {
        label: "Home",
        icon: LayoutDashboard,
    },

    {
        label: "Transactions",
        icon: ArrowLeftRight,
    },

    {
        label: "Accounts",
        icon: Landmark,
    },

    {
        label: "Goals",
        icon: Target,
    },

    {
        label: "More",
        icon: MoreHorizontal,
    },
];

export default function BottomNavigation({
    active,
    onNavigate,
}) {
    return (
        <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] pt-1.5 backdrop-blur">
            <div className="mx-auto flex w-full max-w-md">
                {navigation.map((item) => {
                    const Icon = item.icon;

                    const selected =
                        active === item.label;

                    return (
                        <button
                            key={item.label}
                            type="button"
                            onClick={() =>
                                onNavigate(
                                    item.label
                                )
                            }
                            className={`flex min-h-14 flex-1 flex-col items-center justify-center gap-1 transition ${
                                selected
                                    ? "text-slate-900"
                                    : "text-slate-400"
                            }`}
                        >
                            <div
                                className={`flex h-7 w-10 items-center justify-center rounded-full transition ${
                                    selected
                                        ? "bg-slate-100"
                                        : ""
                                }`}
                            >
                                <Icon
                                    size={19}
                                    strokeWidth={
                                        selected
                                            ? 2.5
                                            : 2
                                    }
                                />
                            </div>

                            <span
                                className={`text-[9px] ${
                                    selected
                                        ? "font-bold"
                                        : "font-medium"
                                }`}
                            >
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}