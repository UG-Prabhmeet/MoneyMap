import { Suspense } from "react";
import { BarLoader } from "react-spinners";
import { TransactionTable } from "../account/_components/transaction-table";
import { getAccountWithTransactions } from "@/actions/account";

export default async function TransactionPage() {
    const accountData = await getAccountWithTransactions();

    if (!accountData) {
        notFound();
    }

    const { transactions, ...account } = accountData;

    return (
        <div className="px-4 md:px-6 lg:px-8 py-6 max-w-screen-2xl mx-auto">
            <div className="flex gap-4 items-end justify-between">
                <div>
                    <h1 className="text-5xl sm:text-6xl font-bold tracking-tight gradient-title capitalize">
                        {account.name}
                    </h1>
                    <p className="text-muted-foreground pb-3">
                        {account.type.charAt(0) +
                            account.type.slice(1).toLowerCase()}{" "}
                        Account
                    </p>
                </div>

                <div className="text-right pb-3">
                    <div className="text-xl sm:text-2xl font-bold">
                        ₹{parseFloat(account.balance).toFixed(2)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                        {account._count.transactions} Transactions
                    </p>
                </div>
            </div>

            {/* Transactions Table */}
            <Suspense
                fallback={
                    <BarLoader
                        className="mt-4"
                        width={"100%"}
                        color="#9333ea"
                    />
                }
            >
                <TransactionTable transactions={transactions} />
            </Suspense>
        </div>
    );
}
