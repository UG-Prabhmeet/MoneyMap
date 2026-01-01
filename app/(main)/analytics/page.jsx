import {
    getBudgetInsights,
    getCashFlowData,
    getNetWorthHistory,
    getMonthlySpendingTrends,
} from "@/actions/analytics";
import { getCurrentBudget } from "@/actions/budget";
import { getUserAccounts } from "@/actions/dashboard";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon, TrendingUp } from "lucide-react";

import NetWorthChart from "./_components/net-worth-chart";
import SpendingTrendsChart from "./_components/spending-trends-chart";
import SavingsGoalTracker from "./_components/savings-goal-tracker";
import CashFlowChart from "./_components/cash-flow-chart";

export default async function AnalyticsPage() {
    const accounts = await getUserAccounts();
    const defaultAccount = accounts?.find((a) => a.isDefault) || accounts?.[0];

    const [trendData, budgetInfo, netWorthData, cashFlowData] =
        await Promise.all([
            getMonthlySpendingTrends(defaultAccount?.id),
            getCurrentBudget(defaultAccount?.id),
            getNetWorthHistory(defaultAccount?.id),
            getCashFlowData(defaultAccount?.id),
        ]);

    // Check if we have enough data to show meaningful charts
    const hasData = trendData?.length > 0 || netWorthData?.length > 0;

    return (
        <div className="px-4 md:px-6 lg:px-8 py-6 max-w-screen-2xl mx-auto">
            
            {/* Header Section */}

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-5xl sm:text-6xl font-bold tracking-tight gradient-title capitalize">
                        Financial Analytics
                    </h1>
                    <p className="text-muted-foreground pb-6">
                        Insights for your {defaultAccount?.name || "current account"}. Track your wealth, spending, and cash flow in one place.
                    </p>
                </div>
            </div>

            {!hasData && (
                <Alert className="bg-blue-50 border-blue-200 pb-6">
                    <InfoIcon className="h-4 w-4 text-blue-600" />
                    <AlertTitle className="text-blue-800">
                        New Account
                    </AlertTitle>
                    <AlertDescription className="text-blue-700">
                        Start adding transactions to see your financial trends
                        and insights here.
                    </AlertDescription>
                </Alert>
            )}

            {/* Top Grid: Savings Tracker & Net Worth */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-5">
                <Card className="lg:col-span-4 shadow-sm border-slate-200">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-green-600" />
                            Savings Target
                        </CardTitle>
                        <CardDescription>
                            Track your monthly surplus goals
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <SavingsGoalTracker
                            income={budgetInfo?.budget?.amount || 0}
                            expense={budgetInfo?.currentExpenses || 0}
                            initialGoal={defaultAccount?.savingsGoal || 0}
                            accountId={defaultAccount?.id}
                        />
                    </CardContent>
                </Card>

                <Card className="lg:col-span-8 shadow-sm border-slate-200">
                    <CardHeader>
                        <CardTitle>Net Worth History</CardTitle>
                        <CardDescription>
                            Growth of your total assets over time
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <NetWorthChart data={netWorthData} />
                    </CardContent>
                </Card>
            </div>

            {/* Middle Section: Spending Trends */}
            <Card className="shadow-sm border-slate-200">
                <CardHeader>
                    <CardTitle>Spending Trends</CardTitle>
                    <CardDescription>
                        Category-wise expense distribution by month
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <SpendingTrendsChart data={trendData} />
                </CardContent>
            </Card>

            {/* Bottom Section: Cash Flow */}
            <div className="pt-5">
                <Card className="shadow-sm border-slate-200">
                <CardHeader>
                    <CardTitle>Cash Flow Analysis</CardTitle>
                    <CardDescription>
                        Visualizing Inflow vs Outflow and monthly Net Flow
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <CashFlowChart data={cashFlowData} />
                </CardContent>
            </Card>
            </div>
            
        </div>
    );
}
