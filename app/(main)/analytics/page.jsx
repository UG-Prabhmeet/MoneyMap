import {
    getBudgetInsights,
    getCashFlowData,
    getNetWorthHistory,
    getMonthlySpendingTrends,
} from "@/actions/analytics";
import { getCurrentBudget } from "@/actions/budget";
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
    const [trendData, budgetInfo, netWorthData, cashFlowData] =
        await Promise.all([
            getMonthlySpendingTrends(),
            getCurrentBudget(),
            getNetWorthHistory(),
            getCashFlowData(),
        ]);

    // Check if we have enough data to show meaningful charts
    const hasData = trendData?.length > 0 || netWorthData?.length > 0;

    return (
        <div className="container px-4 md:px-6 py-10 max-w-7xl mx-auto space-y-8">
            {/* Header Section */}
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight gradient-title">
                    Financial Analytics
                </h1>
                <p className="text-slate-500 text-lg">
                    Comprehensive insights into your wealth, spending, and cash
                    flow.
                </p>
            </div>

            {!hasData && (
                <Alert className="bg-blue-50 border-blue-200">
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
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
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
    );
}
