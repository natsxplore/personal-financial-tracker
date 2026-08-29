import Dexie from 'dexie';

export const db = new Dexie('FinancialTracker');

db.version(1).stores({
    transactions: '++id, date, type, amount, category, note'
});