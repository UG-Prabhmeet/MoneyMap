"use client";

import { useState, useEffect } from "react";
import { Pencil, Check, X } from "lucide-react";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateBudget } from "@/actions/budget";

export function BudgetProgress({
    initialBudget,
    currentExpenses = 0,
    accountId,
    period,
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [newBudget, setNewBudget] = useState(
        initialBudget?.amount?.toString() || ""
    );

    const {
        loading: isLoading,
        fn: updateBudgetFn,
        data: updatedBudget,
        error,
    } = useFetch(updateBudget);

    // if no budget exists, use 0 to avoid division by zero
    const budgetAmount = initialBudget?.amount ?? 0;
    const percentUsed =
        budgetAmount > 0 ? (currentExpenses / budgetAmount) * 100 : 0;

    const handleUpdateBudget = async () => {
        const amount = parseFloat(newBudget);

        if (isNaN(amount) || amount <= 0) {
            toast.error("Please enter a valid amount");
            return;
        }

        await updateBudgetFn(amount, accountId);
    };

    const handleCancel = () => {
        setNewBudget(initialBudget?.amount?.toString() || "");
        setIsEditing(false);
    };

    useEffect(() => {
        if (updatedBudget?.success) {
            setIsEditing(false);
            toast.success("Budget updated successfully");
        }
    }, [updatedBudget]);

    useEffect(() => {
        if (error) {
            toast.error(error.message || "Failed to update budget");
        }
    }, [error]);

    const monthName = period
        ? new Date(period.year, period.month - 1).toLocaleString("default", {
              month: "long",
          })
        : "Current Month";

    return (
        <Card className="p-6 bg-white rounded-2xl border border-border shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex-1">
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                        {monthName} Budget{" "}
                        <span className="text-xs text-muted-foreground">
                            (Default Account)
                        </span>
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                        {isEditing ? (
                            <div className="flex items-center gap-2">
                                <Input
                                    type="number"
                                    value={newBudget}
                                    onChange={(e) =>
                                        setNewBudget(e.target.value)
                                    }
                                    className="w-32"
                                    placeholder="Enter amount"
                                    autoFocus
                                    disabled={isLoading}
                                />
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleUpdateBudget}
                                    disabled={isLoading}
                                >
                                    <Check className="h-4 w-4 text-green-500" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleCancel}
                                    disabled={isLoading}
                                >
                                    <X className="h-4 w-4 text-red-500" />
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between w-full">
                                <div className="space-y-1">
                                    <CardDescription className="text-sm text-muted-foreground">
                                        ₹{currentExpenses.toFixed(2)} of ₹
                                        {(initialBudget?.amount ?? 0).toFixed(
                                            2
                                        )}{" "}
                                        spent
                                    </CardDescription>
                                    <p className="text-[10px] text-muted-foreground italic">
                                        *Tracks monthly expenses from default
                                        account
                                    </p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsEditing(true)}
                                    className="h-6 w-6"
                                >
                                    <Pencil className="h-4 w-4 text-muted-foreground" />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {/* Always show the bar, but it will be empty if initialBudget is null */}
                <div className="space-y-2">
                    <Progress
                        value={percentUsed}
                        className="rounded-full h-4"
                        indicatorClassName={
                            percentUsed >= 75
                                ? "bg-red-500"
                                : percentUsed <= 30
                                  ? "bg-green-500"
                                  : "bg-yellow-500"
                        }
                    />
                    <div className="flex justify-between items-center mt-1">
                        {!initialBudget && (
                            <p className="text-[10px] text-amber-600 font-medium">
                                Set a budget to track progress
                            </p>
                        )}
                        <p className="text-xs text-muted-foreground ml-auto">
                            {percentUsed.toFixed(1)}% used
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
