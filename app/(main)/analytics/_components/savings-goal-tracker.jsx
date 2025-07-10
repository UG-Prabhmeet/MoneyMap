"use client";

import React from "react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export default function SavingsGoalTracker({
    income = 0,
    expense = 0,
    goal = 50000,
}) {
    const savings = income - expense;
    const percentage = Math.min((savings / goal) * 100, 100);
    const remaining = goal - savings;
    const estimatedMonths =
        savings > 0 ? Math.ceil(remaining / (savings / 3 || 1)) : "∞";

    return (
        <div className="space-y-4 text-sm">
            <div className="text-muted-foreground space-y-1">
                <p>
                    Goal:{" "}
                    <span className="font-medium text-foreground">
                        ₹{goal.toLocaleString()}
                    </span>
                </p>
                <p>
                    Current Savings:{" "}
                    <span className="font-medium text-foreground">
                        ₹{savings.toLocaleString()} ({percentage.toFixed(1)}%)
                    </span>
                </p>
            </div>

            <Progress
                value={percentage}
                className={cn("h-3", percentage >= 100 && "bg-green-500")}
            />

            <p className="text-muted-foreground">
                Estimated time to goal:{" "}
                <span className="font-medium text-foreground">
                    {isNaN(estimatedMonths)
                        ? "N/A"
                        : `${estimatedMonths} month(s)`}
                </span>
            </p>
        </div>
    );
}
