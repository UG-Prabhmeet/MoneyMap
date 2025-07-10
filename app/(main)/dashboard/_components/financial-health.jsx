"use client";

import { Card } from "@/components/ui/card";
import {
    Tooltip,
    TooltipTrigger,
    TooltipContent,
} from "@/components/ui/tooltip";
import { ArrowUpRight, ArrowDownRight, Info, Activity } from "lucide-react";

export default function FinancialHealthScore({ data, trend }) {
    if (!data)
        return (
            <Card className="p-4 bg-background text-foreground border-border">
                Unable to load health score
            </Card>
        );

    const trendIcon =
        trend > 0 ? (
            <ArrowUpRight className="text-green-500" />
        ) : trend < 0 ? (
            <ArrowDownRight className="text-red-500" />
        ) : (
            <span className="text-muted-foreground">↔</span>
        );

    return (
        <Card className="p-6 space-y-3 bg-white border border-border shadow-md hover:shadow-lg transition-shadow rounded-2xl">
            <div className="flex items-center gap-2 mb-2">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Tooltip>
                        <TooltipTrigger>
                            <span className="text-muted-foreground text-sm">
                                <Info />
                            </span>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>
                                A score of <strong>80+</strong> is considered
                                financially healthy. Improve it by saving more
                                and reducing debt.
                            </p>
                        </TooltipContent>
                    </Tooltip>
                </h2>
            </div>

            <div className="flex items-center gap-2 text-md font-medium">
                <span>
                    Score:{" "}
                    <span className="text-yellow-600">{data.score} / 100</span>
                </span>
                {trendIcon}
            </div>

            <hr className="my-2 border-muted" />

            <div className="grid grid-cols-2 md:grid-cols-3 text-sm text-muted-foreground gap-y-1">
                <div>
                    <p>Income</p>
                    <p className="text-foreground font-medium">
                        ₹{data.income}
                    </p>
                </div>
                <div>
                    <p>Expenses</p>
                    <p className="text-foreground font-medium">
                        ₹{data.expenses}
                    </p>
                </div>
                <div>
                    <p>Debt</p>
                    <p className="text-foreground font-medium">₹{data.debt}</p>
                </div>
                <div>
                    <p>Savings Rate</p>
                    <p className="text-foreground font-medium">
                        {(data.savingsRate * 100).toFixed(1)}%
                    </p>
                </div>
                <div>
                    <p>Debt-to-Income</p>
                    <p className="text-foreground font-medium">
                        {(data.debtToIncome * 100).toFixed(1)}%
                    </p>
                </div>
            </div>
        </Card>
    );
}
