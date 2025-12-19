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
        <div className="container max-w-3xl py-10 px-4 sm:px-6 lg:px-8 flex flex-col items-center space-y-10 mx-auto">
            {/* Dynamic Header - Added text-center and items-center */}
            <div className="flex flex-col items-center text-center gap-4 w-full">
                <div className="flex items-center justify-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-2xl">
                        {editId ? (
                            <Edit3 className="w-8 h-8 text-primary" />
                        ) : (
                            <PlusCircle className="w-8 h-8 text-primary" />
                        )}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight gradient-title">
                        {editId ? "Edit Transaction" : "Add Transaction"}
                    </h1>
                </div>
                <p className="text-slate-500 text-lg max-w-lg">
                    {editId
                        ? "Update the details of your existing record."
                        : "Record a new expense, income, or transfer to keep your data current."}
                </p>
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

            {/* Subtle Helper Text */}
            <p className="text-sm text-slate-400 italic">
                Tip: You can use the AI receipt scanner to fill this form
                automatically.
            </p>
        </div>
    );
}
