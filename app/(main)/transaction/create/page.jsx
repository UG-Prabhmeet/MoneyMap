import { getUserAccounts } from "@/actions/dashboard";
import { defaultCategories } from "@/data/categories";
import { AddTransactionForm } from "../_components/transaction-form";
import { getTransaction } from "@/actions/transaction";
import { Edit3, PlusCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default async function AddTransactionPage({ searchParams }) {
    const resolvedSearchParams = await searchParams;
    const editId = resolvedSearchParams?.edit;

    const accounts = await getUserAccounts();

    let initialData = null;
    if (editId) {
        const transaction = await getTransaction(editId);
        initialData = transaction;
    }

    return (
        // Added flex flex-col items-center to ensure all children are horizontally centered
        <div className="px-4 md:px-6 lg:px-8 py-6 max-w-screen-2xl mx-auto">
            {/* Dynamic Header - Added text-center and items-center */}
            <div className="flex gap-4 items-end justify-between pb-4">
                <div className="flex items-center justify-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-2xl">
                        {editId ? (
                            <Edit3 className="w-8 h-8 text-primary" />
                        ) : (
                            <PlusCircle className="w-8 h-8 text-primary" />
                        )}
                    </div>
                    <h1 className="text-5xl sm:text-6xl font-bold tracking-tight gradient-title capitalize">
                        {editId ? "Edit Transaction" : "Add Transaction"}
                    </h1>
                </div>
            </div>

            {/* Form Container - w-full ensures it respects the max-w-3xl of the parent */}
            <Card className="w-full border-none shadow-xl shadow-slate-200/50 bg-white/50 backdrop-blur-sm rounded-3xl overflow-hidden">
                <CardContent className="p-6 sm:p-10">
                    <AddTransactionForm
                        accounts={accounts}
                        categories={defaultCategories}
                        editMode={!!editId}
                        initialData={initialData}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
