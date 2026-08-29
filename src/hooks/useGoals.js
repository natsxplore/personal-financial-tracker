import { useLiveQuery } from "dexie-react-hooks";

import { db } from "../db";
import { getGoalProgress } from "../utils/calculations";

export function useGoals() {
    const goals = useLiveQuery(
        () => db.goals.toArray(),
        []
    );

    const loading = goals === undefined;

    const enrichedGoals = (goals || []).map(
        (goal) => ({
            ...goal,
            progress: getGoalProgress(goal),
        })
    );

    return {
        loading,
        goals: enrichedGoals,
    };
}
