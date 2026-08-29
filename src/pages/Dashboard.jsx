import { useState } from "react";

import MonthSelector from "../components/finance/MonthSelector";
import IncomeSummary from "../components/finance/IncomeSummary";
import BudgetOverview from "../components/finance/BudgetOverview";
import CutoffCard from "../components/finance/CutoffCard";
import BudgetCategoryList from "../components/finance/BudgetCategoryList";
import BudgetSettings from "../components/finance/BudgetSettings";

import { useMonthFinance } from "../hooks/useMonthFinance";

export default function Dashboard({
    monthKey,
    formattedMonth,
    onPrevMonth,
    onNextMonth,
}) {
    const [showSettings, setShowSettings] =
        useState(false);

    const {
        loading,
        income,
        budgets,
        cutoff1Income,
        cutoff2Income,
        categories,
        expenseOverview,
        cutoffStats,
    } = useMonthFinance(monthKey);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 pb-24">
                <MonthSelector
                    month={formattedMonth}
                    onPrevMonth={onPrevMonth}
                    onNextMonth={onNextMonth}
                    onOpenSettings={() =>
                        setShowSettings(true)
                    }
                />

                <div className="px-5 py-12 text-center text-sm text-slate-500">
                    Loading your finances...
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-24">
            <MonthSelector
                month={formattedMonth}
                onPrevMonth={onPrevMonth}
                onNextMonth={onNextMonth}
                onOpenSettings={() =>
                    setShowSettings(true)
                }
            />

            <IncomeSummary
                monthKey={monthKey}
                incomeRows={income}
                cutoff1={cutoff1Income}
                cutoff2={cutoff2Income}
            />

            <BudgetOverview
                budget={expenseOverview.budget}
                spent={expenseOverview.spent}
            />

            <section className="mx-5 mt-6">
                <div className="mb-3">
                    <h2 className="text-sm font-bold text-slate-900">
                        Budget per Cutoff
                    </h2>

                    <p className="mt-1 text-[11px] text-slate-400">
                        Track your monthly spending
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <CutoffCard
                        title="Cutoff 1"
                        budget={
                            cutoffStats.cutoff1.budget
                        }
                        spent={
                            cutoffStats.cutoff1.spent
                        }
                    />

                    <CutoffCard
                        title="Cutoff 2"
                        budget={
                            cutoffStats.cutoff2.budget
                        }
                        spent={
                            cutoffStats.cutoff2.spent
                        }
                    />
                </div>
            </section>

            <BudgetCategoryList
                categories={categories}
            />

            {showSettings && (
                <BudgetSettings
                    key={monthKey}
                    monthKey={monthKey}
                    initialBudgets={budgets}
                    formattedMonth={formattedMonth}
                    onClose={() =>
                        setShowSettings(false)
                    }
                    onSaved={() =>
                        setShowSettings(false)
                    }
                />
            )}
        </div>
    );
}
