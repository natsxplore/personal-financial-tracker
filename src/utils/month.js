export function getCurrentMonthKey(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");

    return `${year}-${month}`;
}

export function formatMonthKey(monthKey) {
    const [year, month] = monthKey.split("-").map(Number);
    const date = new Date(year, month - 1, 1);

    return date.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
    });
}

export function shiftMonthKey(monthKey, delta) {
    const [year, month] = monthKey.split("-").map(Number);
    const date = new Date(year, month - 1 + delta, 1);

    return getCurrentMonthKey(date);
}
