import { getUserAccounts } from "@/actions/dashboard";
import { defaultCategories } from "@/data/categories";
import { AddTransactionForm } from "../_components/transaction-form";
import { getTransaction } from "@/actions/transaction";
import { ArrowRightLeft } from "lucide-react";

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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
            <div className="flex justify-center md:justify-start mb-8">
                <h1 className="text-5xl sm:text-6xl font-bold tracking-tight gradient-title capitalize flex items-center gap-2">
                    <ArrowRightLeft className="w-7 h-7 text-primary" />
                    Add Transaction
                </h1>
            </div>
            <AddTransactionForm
                accounts={accounts}
                categories={defaultCategories}
                editMode={!!editId}
                initialData={initialData}
            />
        </div>
    );
}
