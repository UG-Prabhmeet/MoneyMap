import { Suspense } from "react";
import { getUserAccounts } from "@/actions/dashboard";
import { getDashboardData } from "@/actions/dashboard";
import { getCurrentBudget } from "@/actions/budget";
import { AccountCard } from "./_components/account-card";
import { CreateAccountDrawer } from "@/components/create-account-drawer";
import { BudgetProgress } from "./_components/budget-progress";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, Plus } from "lucide-react";
import { DashboardOverview } from "./_components/transaction-overview";
import FinancialHealthScore from "./_components/financial-health";
import { getFinancialHealth } from "@/actions/financial-health";

export default async function DashboardPage() {
    const [accounts, transactions] = await Promise.all([
        getUserAccounts(),
        getDashboardData(),
    ]);

    const defaultAccount = accounts?.find((account) => account.isDefault);

    let budgetData = null;
    let financialHealth = null;

    if (defaultAccount) {
        budgetData = await getCurrentBudget(defaultAccount.id);
        financialHealth = await getFinancialHealth(defaultAccount.userId);
    }

    return (
        <div className="space-y-10">
            {/* Budget Progress */}
            <section>
                <BudgetProgress
                    initialBudget={budgetData?.budget}
                    currentExpenses={budgetData?.currentExpenses || 0}
                />
            </section>

            {/* Financial Health Score */}
            <section>
                <FinancialHealthScore
                    data={financialHealth}
                    trend={financialHealth.trend}
                />
            </section>

            {/* Dashboard Overview */}
            <section>
                <DashboardOverview
                    accounts={accounts}
                    transactions={transactions || []}
                />
            </section>

            {/* Accounts Grid */}
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <Briefcase className="h-5 w-5 text-foreground" />
                    <h2 className="text-xl font-semibold text-foreground">
                        Your Accounts
                    </h2>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <CreateAccountDrawer>
                        <Card className="hover:shadow-md transition-shadow cursor-pointer border-dashed h-full">
                            <CardContent className="flex flex-col items-center justify-center text-muted-foreground h-full py-10">
                                <Plus className="h-10 w-10 mb-2 text-primary" />
                                <p className="text-sm font-medium">
                                    Add New Account
                                </p>
                            </CardContent>
                        </Card>
                    </CreateAccountDrawer>
                    {accounts.length > 0 &&
                        accounts.map((account) => (
                            <AccountCard key={account.id} account={account} />
                        ))}
                </div>
            </section>
        </div>
    );
}
