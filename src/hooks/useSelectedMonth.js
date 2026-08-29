import { useMemo, useState } from "react";

import {
    formatMonthKey,
    getCurrentMonthKey,
    shiftMonthKey,
} from "../utils/month";

export function useSelectedMonth(initialMonthKey) {
    const [monthKey, setMonthKey] = useState(
        initialMonthKey || getCurrentMonthKey()
    );

    const formattedMonth = useMemo(
        () => formatMonthKey(monthKey),
        [monthKey]
    );

    function goToPrevMonth() {
        setMonthKey((current) =>
            shiftMonthKey(current, -1)
        );
    }

    function goToNextMonth() {
        setMonthKey((current) =>
            shiftMonthKey(current, 1)
        );
    }

    return {
        monthKey,
        setMonthKey,
        formattedMonth,
        goToPrevMonth,
        goToNextMonth,
    };
}
