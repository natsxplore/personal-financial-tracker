import { useLiveQuery } from "dexie-react-hooks";

import { db } from "../db";
import { getAccountBalance } from "../utils/calculations";

export function useAccounts() {
    const accounts = useLiveQuery(
        () => db.accounts.toArray(),
        []
    );

    const transactions = useLiveQuery(
        () => db.transactions.toArray(),
        []
    );

    const loading =
        accounts === undefined ||
        transactions === undefined;

    const enrichedAccounts = (accounts || []).map(
        (account) => ({
            ...account,
            balance: getAccountBalance(
                account.id,
                transactions || [],
                Number(account.balance || 0)
            ),
        })
    );

    return {
        loading,
        accounts: enrichedAccounts,
    };
}
