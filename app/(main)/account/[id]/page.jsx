import { Suspense } from "react";
import { getAccountWithTransactions } from "@/actions/account";
import { BarLoader } from "react-spinners";
import { TransactionTable } from "../_components/transaction-table";
import { notFound } from "next/navigation";
import { AccountChart } from "../_components/account-chart";

// Main server component for the individual account details page
export default async function AccountPage({ params }) {
    // Await the route parameters to get the specific account ID
    const { id: accountID } = await params;
    
    // Fetch account and transaction data from the database using a server action
    const accountData = await getAccountWithTransactions(accountID);

    // If no data is returned, trigger the Next.js 404 error page
    if (!accountData) {
        notFound();
    }

    // Destructure the data: separate the transactions array from the rest of the account info
    const { transactions, ...account } = accountData;

    return (
        <div className="px-4 md:px-6 lg:px-8 py-6 max-w-screen-2xl mx-auto">
            {/* Header section displaying account name, type, and current balance */}
            <div className="flex flex-col sm:flex-row gap-4 sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-5xl sm:text-6xl font-bold tracking-tight gradient-title capitalize">
                        {account.name}
                    </h1>
                    <p className="text-muted-foreground pb-3">
                        {/* Formatting the account type string to capitalize only the first letter */}
                        {account.type.charAt(0) + account.type.slice(1).toLowerCase()} Account
                    </p>
                </div>

                <div className="text-right pb-3">
                    <div className="text-xl sm:text-2xl font-bold">
                        {/* Displaying balance formatted to two decimal places */}
                        ₹{parseFloat(account.balance).toFixed(2)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                        {account._count.transactions} Transactions
                    </p>
                </div>
            </div>

            {/* Suspense for chart section */}
            <Suspense
                fallback={
                    <BarLoader className="mt-4" width={"100%"} color="#9333ea" />
                }
            >
                <AccountChart transactions={transactions} />
            </Suspense>

            {/* Suspense for transactions table */}
            <Suspense
                fallback={
                    <BarLoader className="mt-4" width={"100%"} color="#9333ea" />
                }
            >
                <TransactionTable transactions={transactions} />
            </Suspense>
        </div>
    );
}