import { getUserAccounts, getDashboardData } from "@/actions/dashboard";
import { getCurrentBudget } from "@/actions/budget";
import { AccountCard } from "./_components/account-card";
import { CreateAccountDrawer } from "@/components/create-account-drawer";
import { BudgetProgress } from "./_components/budget-progress";
import { Card, CardContent } from "@/components/ui/card";
import {
    Activity,
    Briefcase,
    Plus,
    TrendingUp,
    LayoutDashboard,
} from "lucide-react";
import { DashboardOverview } from "./_components/transaction-overview";
import FinancialHealthScore from "./_components/financial-health";
import { getFinancialHealth } from "@/actions/financial-health";
import { checkUser } from "@/lib/checkUser";

export default async function DashboardPage() {
    // FORCE the user sync to finish first
    const user = await checkUser();

    // Only now, proceed with other database calls
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
        <div className="max-w-7xl mx-auto space-y-10 px-4 py-8 bg-slate-50/50 min-h-screen">
            {/* Hero Stats: Budget & Health */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7">
                    <BudgetProgress
                        initialBudget={budgetData?.budget}
                        currentExpenses={budgetData?.currentExpenses || 0}
                    />
                </div>
                <div className="lg:col-span-5">
                    {financialHealth && (
                        <FinancialHealthScore
                            data={financialHealth}
                            trend={financialHealth.trend}
                        />
                    )}
                </div>
            </div>

            {/* Main Overview: Transactions & Charts */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 px-1">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-bold text-slate-800">
                        Financial Overview
                    </h2>
                </div>
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                    <DashboardOverview
                        accounts={accounts}
                        transactions={transactions || []}
                    />
                </div>
            </section>

            {/* Your Accounts Grid */}
            <section className="space-y-6">
                <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-primary" />
                        <h2 className="text-xl font-bold text-slate-800">
                            Your Accounts
                        </h2>
                    </div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        {accounts.length} Total
                    </span>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <CreateAccountDrawer>
                        <Card className="group hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer border-dashed border-2 h-full flex items-center justify-center min-h-[160px] rounded-2xl">
                            <CardContent className="flex flex-col items-center justify-center text-muted-foreground p-6">
                                <div className="h-12 w-12 rounded-full bg-slate-100 group-hover:bg-primary/10 flex items-center justify-center transition-colors mb-3">
                                    <Plus className="h-6 w-6 text-slate-400 group-hover:text-primary" />
                                </div>
                                <p className="text-sm font-semibold group-hover:text-primary transition-colors">
                                    Create New Account
                                </p>
                            </CardContent>
                        </Card>
                    </CreateAccountDrawer>

                    {accounts.length > 0 &&
                        accounts.map((account) => (
                            <div
                                key={account.id}
                                className="hover:scale-[1.02] transition-transform"
                            >
                                <AccountCard account={account} />
                            </div>
                        ))}
                </div>
            </section>
        </div>
    );
}
