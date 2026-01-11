"use client";

import React, { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Target,
    TrendingUp,
    Clock,
    AlertCircle,
    Edit2,
    Check,
    X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateSavingsGoal } from "@/actions/account";
import { toast } from "sonner";

export default function SavingsGoalTracker({
    income = 0,
    expense = 0,
    initialGoal = 50000,
    accountId,
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [goal, setGoal] = useState(initialGoal);
    const [editValue, setEditValue] = useState(initialGoal.toString());
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setGoal(initialGoal);
        setEditValue(initialGoal.toString());
    }, [initialGoal]);

    const savings = income - expense;
    // Ensure percentage doesn't go below 0 for the progress bar UI
    const percentage = Math.max(0, Math.min((savings / goal) * 100, 100));
    const remaining = goal - savings;

    // Logic for estimated time
    let estimatedTimeMsg = "N/A";
    if (savings <= 0) {
        estimatedTimeMsg = "No active savings";
    } else {
        const months = Math.ceil(remaining / savings);
        estimatedTimeMsg =
            months > 0
                ? `${months} month${months > 1 ? "s" : ""}`
                : "Goal reached!";
    }

    const handleSave = async () => {
        const newGoal = parseFloat(editValue);
        if (isNaN(newGoal) || newGoal < 0) {
            toast.error("Please enter a valid savings goal (0 or more)");
            return;
        }

        setIsLoading(true);
        try {
            const result = await updateSavingsGoal(accountId, newGoal);
            if (result.success) {
                setGoal(newGoal);
                setIsEditing(false);
                toast.success("Savings goal updated successfully");
            } else {
                toast.error(result.error || "Failed to update savings goal");
            }
        } catch (error) {
            toast.error("An error occurred while updating the savings goal");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="border-none shadow-none bg-transparent">
            <CardHeader className="p-0 pb-4">
                <CardTitle className="text-lg font-bold flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-primary" />
                        Savings Goal Tracker
                    </div>
                    {accountId && !isEditing && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setIsEditing(true)}
                        >
                            <Edit2 className="h-4 w-4" />
                        </Button>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                            Goal Target
                        </p>
                        {isEditing ? (
                            <div className="flex items-center gap-2">
                                <Input
                                    type="number"
                                    value={editValue}
                                    onChange={(e) =>
                                        setEditValue(e.target.value)
                                    }
                                    className="h-8 w-24"
                                    disabled={isLoading}
                                    min="0"
                                />
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-green-600"
                                    onClick={handleSave}
                                    disabled={isLoading}
                                >
                                    <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-red-600"
                                    onClick={() => {
                                        setIsEditing(false);
                                        setEditValue(goal.toString());
                                    }}
                                    disabled={isLoading}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ) : (
                            <p className="text-xl font-bold">
                                ₹{goal.toLocaleString()}
                            </p>
                        )}
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                            Current Savings
                        </p>
                        <p
                            className={cn(
                                "text-xl font-bold",
                                savings < 0 ? "text-red-500" : "text-green-600"
                            )}
                        >
                            ₹{savings.toLocaleString()}
                        </p>
                    </div>
                </div>

                {/* Progress Visual */}
                <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium">
                        <span className="text-muted-foreground">
                            {percentage.toFixed(1)}% complete
                        </span>
                        {savings < 0 && (
                            <span className="text-red-500 flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" /> Overspent
                            </span>
                        )}
                    </div>
                    <Progress
                        value={percentage}
                        className="h-3"
                        indicatorClassName={cn(
                            percentage >= 100
                                ? "bg-green-500"
                                : percentage > 50
                                  ? "bg-primary"
                                  : "bg-yellow-500"
                        )}
                    />
                </div>

                {/* Insight Footer */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <Clock className="h-4 w-4 text-blue-500" />
                        <div>
                            <p className="text-[10px] text-muted-foreground font-bold uppercase">
                                Estimated Time
                            </p>
                            <p className="text-sm font-semibold">
                                {estimatedTimeMsg}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <div>
                            <p className="text-[10px] text-muted-foreground font-bold uppercase">
                                Remaining
                            </p>
                            <p className="text-sm font-semibold">
                                {remaining > 0
                                    ? `₹${remaining.toLocaleString()}`
                                    : "Goal Met"}
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
