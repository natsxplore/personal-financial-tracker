import BudgetCategoryItem from "./BudgetCategoryItem";

export default function BudgetCategoryList({
    categories,
}) {
    return (
        <section className="mx-5 mt-5 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="px-5 py-4">
                <h2 className="text-sm font-bold text-slate-900">
                    Budget Categories
                </h2>

                <p className="mt-1 text-[11px] text-slate-400">
                    Monthly allocation
                </p>
            </div>
            

            {categories.map((category) => (
                <BudgetCategoryItem
                    key={category.id}
                    category={category}
                />
            ))}
        </section>
    );
}