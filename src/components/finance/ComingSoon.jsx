import {
    Construction,
} from "lucide-react";

export default function ComingSoon({
    title = "Coming Soon",
}) {
    return (
        <div className="flex min-h-[calc(100vh-4rem)] flex-col pb-24">
            <main className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-100 text-slate-500">
                    <Construction size={32} />
                </div>

                <h2 className="mt-6 text-xl font-bold text-slate-900">
                    {title}
                </h2>

                <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">
                    This section is currently under
                    development. It will be available
                    in a future update.
                </p>

                <div className="mt-6 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                    <p className="text-xs font-medium text-slate-500">
                        We're building this feature
                        step by step.
                    </p>
                </div>
            </main>
        </div>
    );
}
