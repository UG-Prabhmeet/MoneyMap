import { getUserAccounts, getDashboardData } from "@/actions/dashboard";
import { getCurrentBudget } from "@/actions/budget";
import { AccountCard } from "./_components/account-card";
import { CreateAccountDrawer } from "@/components/create-account-drawer";
import { BudgetProgress } from "./_components/budget-progress";
import { Card, CardContent } from "@/components/ui/card";
import { Activity, Briefcase, Plus } from "lucide-react";
import { DashboardOverview } from "./_components/transaction-overview";
import FinancialHealthScore from "./_components/financial-health";
import { getFinancialHealth } from "@/actions/financial-health";
import { checkUser } from "@/lib/checkUser";

export default async function DashboardPage() {
    await checkUser();
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
        <div className="space-y-8 px-4 py-6">
            {/* Responsive Grid for Top Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Budget Progress */}
                <section className="bg-background border rounded-xl shadow-sm p-4">
                    <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-primary" />
                        Monthly Budget
                    </h2>
                    <BudgetProgress
                        initialBudget={budgetData?.budget}
                        currentExpenses={budgetData?.currentExpenses || 0}
                    />
                </section>

                {/* Financial Health Score */}
                {financialHealth && (
                    <section className="bg-background border rounded-xl shadow-sm p-4">
                        <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                            <Activity className="h-5 w-5 text-primary" />
                            Financial Health
                        </h2>
                        <FinancialHealthScore
                            data={financialHealth}
                            trend={financialHealth.trend}
                        />
                    </section>
                )}
            </div>

            {/* Dashboard Overview */}
            <section className="bg-background border rounded-xl shadow-sm p-4">
                <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-primary" />
                    Overview
                </h2>
                <DashboardOverview
                    accounts={accounts}
                    transactions={transactions || []}
                />
            </section>

            {/* Accounts Grid */}
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <Briefcase className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-semibold text-foreground">
                        Your Accounts
                    </h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <CreateAccountDrawer>
                        <Card className="hover:shadow-md transition-shadow cursor-pointer border-dashed border-2 h-full">
                            <CardContent className="flex flex-col items-center justify-center text-muted-foreground h-full py-8">
                                <Plus className="h-8 w-8 mb-2 text-primary" />
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
