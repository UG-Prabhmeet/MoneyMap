"use client";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress"; // Reuse your fixed Progress component
import {
    Tooltip,
    TooltipTrigger,
    TooltipContent,
    TooltipProvider,
} from "@/components/ui/tooltip";
import { ArrowUpRight, ArrowDownRight, Info, Activity } from "lucide-react";
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
        <Card className="p-6 space-y-4 bg-white border border-border shadow-md hover:shadow-lg transition-shadow rounded-2xl">
            {/* Header Section */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <Activity className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-bold text-gray-800">Health Score</h3>
                </div>

                <TooltipProvider>
                    <Tooltip delayDuration={0}>
                        <TooltipTrigger asChild>
                            <button className="text-muted-foreground hover:text-primary transition-colors">
                                <Info className="h-4 w-4" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[200px]">
                            <p className="text-xs">
                                A score of <strong>80+</strong> is excellent.
                                Improve it by maintaining a{" "}
                                <strong>Savings Rate &gt; 20%</strong> and{" "}
                                <strong>DTI &lt; 36%</strong>.
                            </p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

            {/* Score Display */}
            <div className="space-y-2">
                <div className="flex items-end justify-between">
                    <div className="flex items-baseline gap-1">
                        <span
                            className={cn(
                                "text-4xl font-black tracking-tighter",
                                getScoreColor(data.score)
                            )}
                        >
                            {data.score}
                        </span>
                        <span className="text-muted-foreground font-medium">
                            / 100
                        </span>
                    </div>
                    <div className="pb-1">{trendIcon}</div>
                </div>

                {/* Visual indicator of health */}
                <Progress
                    value={data.score}
                    className="h-1.5"
                    indicatorClassName={getProgressColor(data.score)}
                />
            </div>

            <hr className="border-muted/50" />

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
        </Card>
    );
}

// Helper component for cleaner code
function MetricItem({ label, value, isPositive, reverseColor }) {
    let statusClass = "text-foreground";

    if (isPositive !== undefined) {
        if (reverseColor) {
            statusClass = isPositive ? "text-green-600" : "text-red-600";
        } else {
            statusClass = isPositive ? "text-green-600" : "text-red-600";
        }
    }

    return (
        <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                {label}
            </p>
            <p className={cn("text-sm font-semibold", statusClass)}>{value}</p>
        </div>
    );
}
