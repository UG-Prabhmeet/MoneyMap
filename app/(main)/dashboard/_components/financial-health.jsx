"use client";

import { Card } from "@/components/ui/card";
import {
    Tooltip,
    TooltipTrigger,
    TooltipContent,
} from "@/components/ui/tooltip";
import { ArrowUpRight, ArrowDownRight, ArrowRight, Info } from "lucide-react";

export default function FinancialHealthScore({ data, trend }) {
    if (!data) return <Card className="p-4">Unable to load health score</Card>;

    const trendIcon =
        trend > 0 ? (
            <ArrowUpRight className="text-green-500" />
        ) : trend < 0 ? (
            <ArrowDownRight className="text-red-500" />
        ) : (
            <span className="text-muted-foreground">↔</span> // clean and semantically correct
        );

    return (
        <Card className="p-4 space-y-1">
            <div className="flex items-center gap-2 mb-2">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    📊 Financial Health
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

            <hr className="my-2" />

            <div className="grid grid-cols-2 md:grid-cols-3 text-sm text-muted-foreground gap-y-1">
                <div>
                    <p>Income</p>
                    <p className="text-black">₹{data.income}</p>
                </div>
                <div>
                    <p>Expenses</p>
                    <p className="text-black">₹{data.expenses}</p>
                </div>
                <div>
                    <p>Debt</p>
                    <p className="text-black">₹{data.debt}</p>
                </div>
                <div>
                    <p>Savings Rate</p>
                    <p className="text-black">
                        {(data.savingsRate * 100).toFixed(1)}%
                    </p>
                </div>
                <div>
                    <p>Debt-to-Income</p>
                    <p className="text-black">
                        {(data.debtToIncome * 100).toFixed(1)}%
                    </p>
                </div>
            </div>
        </Card>
    );
}
