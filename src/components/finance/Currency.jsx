import { formatCurrencySafe } from "../../utils/currency";
import { usePrivacy } from "../../hooks/usePrivacy";

export default function Currency({
    value,
    className,
}) {
    const { hidden } = usePrivacy();

    return (
        <span className={className}>
            {formatCurrencySafe(value, hidden)}
        </span>
    );
}
