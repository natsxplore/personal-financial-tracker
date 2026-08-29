export function formatCurrency(value) {
    return new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
        minimumFractionDigits: 2,
    }).format(value);
}

export const HIDDEN_CURRENCY = "₱ ••••••";

export function formatCurrencySafe(value, hidden) {
    if (hidden) {
        return HIDDEN_CURRENCY;
    }

    return formatCurrency(value);
}