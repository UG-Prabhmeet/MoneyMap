import {
    getBudgetInsights,
    getCashFlowData,
    getNetWorthHistory,
    getMonthlySpendingTrends,
    getSavingsSummary,
} from "@/actions/analytics";

import NetWorthChart from "./_components/net-worth-chart";
import SpendingTrendsChart from "./_components/spending-trends-chart";
import SavingsGoalTracker from "./_components/savings-goal-tracker";
import CashFlowChart from "./_components/cash-flow-chart";
import { getCurrentBudget } from "@/actions/budget";

export default async function AnalyticsPage() {
    const [trendData, budgetInfo, netWorthData, cashFlowData, budgetInsights] =
        await Promise.all([
            getMonthlySpendingTrends(),
            getCurrentBudget(),
            getNetWorthHistory(),
            getCashFlowData(),
            getBudgetInsights(),
        ]);

    return (
        <div className="px-4 md:px-6 lg:px-8 py-6 max-w-screen-2xl mx-auto">
            {/* Page Header */}
            <div className="mb-10">
                <h1 className="text-5xl sm:text-6xl font-bold tracking-tight gradient-title tracking-tight mb-2">
                    Analytics
                </h1>
                <p className="text-muted-foreground text-lg">
                    Track your financial health over time.
                </p>
            </div>

            {/* Sections */}
            <div className="space-y-10">
                {/* Spending Trends */}
                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-foreground">
                        Spending Trends
                    </h2>
                    <div className="bg-background rounded-2xl shadow-md p-6">
                        <SpendingTrendsChart data={trendData} />
                    </div>
                </section>

                {/* Savings Goal Tracker */}
                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-foreground">
                        Savings Goal Tracker
                    </h2>
                    <div className="bg-background rounded-2xl shadow-md p-6">
                        <SavingsGoalTracker
                            income={budgetInfo.budget?.amount || 0}
                            expense={budgetInfo.currentExpenses || 0}
                            goal={budgetInfo.budget?.amount || 0}
                        />
                    </div>
                </section>

                {/* Net Worth */}
                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-foreground">
                        Net Worth Over Time
                    </h2>
                    <div className="bg-background rounded-2xl shadow-md p-6">
                        <NetWorthChart data={netWorthData} />
                    </div>
                </section>

                {/* Cash Flow */}
                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-foreground">
                        Cash Flow Analysis
                    </h2>
                    <div className="bg-background rounded-2xl shadow-md p-6">
                        <CashFlowChart data={cashFlowData} />
                    </div>
                </section>
            </div>
        </div>
    );
}
