"use client";

import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
    Tooltip,
    TooltipTrigger,
    TooltipContent,
    TooltipProvider,
} from "@/components/ui/tooltip";
import { ArrowUpRight, ArrowDownRight, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export default function FinancialHealthScore({ data, trend }) {
    if (!data)
        return (
            <Card className="p-4 bg-background text-foreground border-border">
                Unable to load health score
            </Card>
        );

    // Dynamic color logic for the score
    const getScoreColor = (score) => {
        if (score >= 80) return "text-green-600";
        if (score >= 50) return "text-yellow-600";
        return "text-red-600";
    };

    const getProgressColor = (score) => {
        if (score >= 80) return "bg-green-500";
        if (score >= 50) return "bg-yellow-500";
        return "bg-red-500";
    };

    const trendIcon =
        trend > 0 ? (
            <div className="flex items-center text-green-500 text-xs font-bold">
                <ArrowUpRight className="h-4 w-4" /> {trend}%
            </div>
        ) : trend < 0 ? (
            <div className="flex items-center text-red-500 text-xs font-bold">
                <ArrowDownRight className="h-4 w-4" /> {Math.abs(trend)}%
            </div>
        ) : (
            <span className="text-muted-foreground text-xs">Stable</span>
        );

    return (
        <Card className="p-6 bg-white rounded-2xl border border-border shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex-1">
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                        Financial Health{" "}
                        <span className="text-xs text-muted-foreground">
                            (Default Account)
                        </span>
                    </CardTitle>
                    <div className="flex items-center justify-between w-full mt-1">
                        <div className="space-y-1">
                            <CardDescription className="text-sm text-muted-foreground">
                                Score:{" "}
                                <span
                                    className={cn(
                                        "font-bold",
                                        getScoreColor(data.score)
                                    )}
                                >
                                    {data.score}
                                </span>{" "}
                                / 100
                            </CardDescription>
                            <p className="text-[10px] text-muted-foreground italic">
                                *Metrics calculated based on recent transactions
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            {trendIcon}
                            <TooltipProvider>
                                <Tooltip delayDuration={0}>
                                    <TooltipTrigger asChild>
                                        <button className="text-muted-foreground hover:text-primary transition-colors">
                                            <Info className="h-4 w-4" />
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-[200px]">
                                        <p className="text-xs">
                                            A score of <strong>80+</strong> is
                                            excellent. Improve it by maintaining
                                            a{" "}
                                            <strong>
                                                Savings Rate &gt; 20%
                                            </strong>{" "}
                                            and <strong>DTI &lt; 36%</strong>.
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <div className="space-y-6">
                    {/* Progress Bar Section */}
                    <div className="space-y-2">
                        <Progress
                            value={data.score}
                            className="rounded-full h-4"
                            indicatorClassName={getProgressColor(data.score)}
                        />
                        <div className="flex justify-between items-center mt-1">
                            <p className="text-xs text-muted-foreground ml-auto">
                                Overall Status
                            </p>
                        </div>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-4 pt-2">
                        <MetricItem
                            label="Income"
                            value={`₹${data.income.toLocaleString()}`}
                        />
                        <MetricItem
                            label="Expenses"
                            value={`₹${data.expenses.toLocaleString()}`}
                        />
                        <MetricItem
                            label="Debt"
                            value={`₹${data.debt.toLocaleString()}`}
                        />
                        <MetricItem
                            label="Savings Rate"
                            value={`${(data.savingsRate * 100).toFixed(1)}%`}
                            isPositive={data.savingsRate >= 0.2}
                        />
                        <MetricItem
                            label="DTI Ratio"
                            value={`${(data.debtToIncome * 100).toFixed(1)}%`}
                            isPositive={data.debtToIncome <= 0.36}
                            reverseColor
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// Helper component for cleaner code
function MetricItem({ label, value, isPositive, reverseColor }) {
    let statusClass = "text-foreground";

    if (isPositive !== undefined) {
        statusClass = isPositive ? "text-green-600" : "text-red-600";
    }

    return (
        <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold leading-none">
                {label}
            </p>
            <p className={cn("text-sm font-semibold", statusClass)}>{value}</p>
        </div>
    );
}
