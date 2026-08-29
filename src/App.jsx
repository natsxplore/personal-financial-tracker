import { useState } from "react";

import Dashboard from "./pages/Dashboard";
import ComingSoon from "./components/finance/ComingSoon";
import BottomNavigation from "./components/finance/BottomNavigation";
import FinanceHeader from "./components/finance/FinanceHeader";
import { useSelectedMonth } from "./hooks/useSelectedMonth";

const pages = {
    Home: {
        title: "Dashboard",
        component: Dashboard,
    },

    Transactions: {
        title: "Transactions",
        component: ComingSoon,
    },

    Accounts: {
        title: "Accounts",
        component: ComingSoon,
    },

    Goals: {
        title: "Savings Goals",
        component: ComingSoon,
    },

    More: {
        title: "More",
        component: ComingSoon,
    },
};

function App() {
    const [activePage, setActivePage] =
        useState("Home");

    const monthState = useSelectedMonth();
    const Page = pages[activePage].component;

    return (
        <div className="min-h-screen bg-slate-50">
            <main className="mx-auto min-h-screen w-full max-w-md">
                <FinanceHeader />

                <Page
                    title={
                        pages[activePage].title
                    }
                    monthKey={
                        monthState.monthKey
                    }
                    formattedMonth={
                        monthState.formattedMonth
                    }
                    onPrevMonth={
                        monthState.goToPrevMonth
                    }
                    onNextMonth={
                        monthState.goToNextMonth
                    }
                />
            </main>

            <BottomNavigation
                active={activePage}
                onNavigate={setActivePage}
            />
        </div>
    );
}

export default App;
