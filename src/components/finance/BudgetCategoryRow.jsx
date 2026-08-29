import { Trash2 } from "lucide-react";

import {
    budgetColors,
    budgetIcons,
    budgetTypes,
} from "../../data/budgetOptions";
import { getBudgetTheme } from "../../utils/budgetIcons";
import BudgetIcon from "./BudgetIcon";
import { getBudgetRowId } from "../../utils/budgetCategory";

export default function BudgetCategoryRow({
    budget,
    onChange,
    onDelete,
}) {
    const rowId = getBudgetRowId(budget);
    const theme = getBudgetTheme(budget.color);

    function update(fields) {
        onChange(rowId, fields);
    }

    return (
        <div className="rounded-xl border border-slate-200 p-3">
            <div className="flex items-start gap-2">
                <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${theme.icon}`}
                >
                    <BudgetIcon
                        icon={budget.icon}
                        size={15}
                    />
                </div>

                <div className="min-w-0 flex-1 space-y-2">
                    <input
                        type="text"
                        value={budget.name}
                        onChange={(event) =>
                            update({
                                name: event.target.value,
                            })
                        }
                        placeholder="Category name"
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold outline-none focus:border-slate-400"
                    />

                    <div className="flex gap-2">
                        <select
                            value={budget.type}
                            onChange={(event) =>
                                update({
                                    type: event.target.value,
                                })
                            }
                            className="flex-1 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-[11px] font-medium outline-none focus:border-slate-400"
                        >
                            {budgetTypes.map((type) => (
                                <option
                                    key={type.value}
                                    value={type.value}
                                >
                                    {type.label}
                                </option>
                            ))}
                        </select>

                        <div className="flex items-center gap-1">
                            <input
                                type="number"
                                min="0"
                                max="100"
                                value={budget.percentage}
                                onChange={(event) =>
                                    update({
                                        percentage:
                                            event.target
                                                .value,
                                    })
                                }
                                className="w-14 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-right text-xs font-semibold outline-none focus:border-slate-400"
                            />
                            <span className="text-[11px] font-semibold text-slate-400">
                                %
                            </span>
                        </div>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => onDelete(rowId)}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                    aria-label={`Delete ${budget.name}`}
                >
                    <Trash2 size={14} />
                </button>
            </div>

            <div className="mt-2.5 flex flex-wrap gap-1.5">
                {budgetColors.map((color) => (
                    <button
                        key={color}
                        type="button"
                        onClick={() => update({ color })}
                        className={`h-5 w-5 rounded-full border-2 ${
                            budget.color === color
                                ? "border-slate-900"
                                : "border-transparent"
                        } ${getBudgetTheme(color).bar}`}
                        aria-label={`${color} color`}
                    />
                ))}
            </div>

            <div className="mt-2 flex flex-wrap gap-1">
                {budgetIcons.map((icon) => {
                    const selected = budget.icon === icon;

                    return (
                        <button
                            key={icon}
                            type="button"
                            onClick={() => update({ icon })}
                            className={`flex h-7 w-7 items-center justify-center rounded-lg border transition ${
                                selected
                                    ? "border-slate-900 bg-slate-100 text-slate-900"
                                    : "border-slate-200 text-slate-400 hover:bg-slate-50"
                            }`}
                            aria-label={`${icon} icon`}
                        >
                            <BudgetIcon icon={icon} size={13} />
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
