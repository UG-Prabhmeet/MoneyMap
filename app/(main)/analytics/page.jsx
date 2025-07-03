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
import BudgetCategoryInsights from "./_components/budget-category-insights";

export default async function AnalyticsPage() {
    const [
        trendData,
        savingsSummary,
        netWorthData,
        cashFlowData,
        budgetInsights,
    ] = await Promise.all([
        getMonthlySpendingTrends(),
        getSavingsSummary(),
        getNetWorthHistory(),
        getCashFlowData(),
        getBudgetInsights(),
    ]);

    return (
        <div className="p-6 space-y-8 max-w-6xl mx-auto">
            <section className="space-y-4">
                <h2 className="text-2xl font-bold tracking-tight">
                    Spending Trends
                </h2>
                <div className="bg-background rounded-2xl shadow-md p-4">
                    <SpendingTrendsChart data={trendData} />
                </div>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-bold tracking-tight">
                    Savings Goal Tracker
                </h2>
                <div className="bg-background rounded-2xl shadow-md p-4">
                    <SavingsGoalTracker
                        income={savingsSummary.income}
                        expense={savingsSummary.expense}
                        goal={50000}
                    />
                </div>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-bold tracking-tight">
                    Net Worth Over Time
                </h2>
                <div className="bg-background rounded-2xl shadow-md p-4">
                    <NetWorthChart data={netWorthData} />
                </div>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-bold tracking-tight">
                    Cash Flow Analysis
                </h2>
                <div className="bg-background rounded-2xl shadow-md p-4">
                    <CashFlowChart data={cashFlowData} />
                </div>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-bold tracking-tight">
                    Budget Category Insights
                </h2>
                <BudgetCategoryInsights data={budgetInsights} />
            </section>
        </div>
    );
}
