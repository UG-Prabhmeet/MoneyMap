import { CreateAccountDrawer } from "@/components/create-account-drawer";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Wallet } from "lucide-react";
import { AccountCard } from "../dashboard/_components/account-card";
import { getDashboardData, getUserAccounts } from "@/actions/dashboard";

export default async function AccountsPage() {
    const [accounts] = await Promise.all([
        getUserAccounts(),
        getDashboardData(),
    ]);

    return (
        <div className="px-4 md:px-6 lg:px-8 py-6 max-w-screen-2xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-5xl sm:text-6xl font-bold tracking-tight gradient-title capitalize">
                        Your Accounts
                    </h1>
                    <p className="text-muted-foreground pb-6">
                        View, manage, and track your accounts in one place.
                    </p>
                </div>
            </div>

            {/* Accounts Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <CreateAccountDrawer>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer border-dashed h-full">
                        <CardContent className="flex flex-col items-center justify-center text-muted-foreground h-full py-10">
                            <Plus className="h-10 w-10 mb-2" />
                            <p className="text-sm font-medium">
                                Add New Account
                            </p>
                        </CardContent>
                    </Card>
                </CreateAccountDrawer>

                {accounts?.length > 0 ? (
                    accounts.map((account) => (
                        <AccountCard key={account.id} account={account} />
                    ))
                ) : (
                    <div className="col-span-full text-center text-muted-foreground py-10">
                        You don’t have any accounts yet.
                    </div>
                )}
            </div>
        </div>
    );
}
