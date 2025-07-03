"use client";

import React from "react";
import { Progress } from "@/components/ui/progress";
import { defaultCategories, categoryColors } from "@/data/categories";

export default function BudgetCategoryInsights({ data }) {
    return (
        <div className="p-6 bg-background rounded-2xl shadow-lg space-y-6">
            <h2 className="text-2xl font-semibold text-foreground">
                📊 Budget Category Insights
            </h2>
            <div className="space-y-5">
                {data.map((item) => {
                    const isOver = item.actual > item.budget;
                    const percent = Math.min(
                        (item.actual / item.budget) * 100,
                        100
                    );

                    const categoryColor =
                        categoryColors[item.category?.toLowerCase()] ||
                        "#64748b";

                    return (
                        <div key={item.category} className="space-y-1">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <span
                                        className="h-3 w-3 rounded-full"
                                        style={{
                                            backgroundColor: categoryColor,
                                        }}
                                    />
                                    <span className="font-medium capitalize">
                                        {item.category}
                                    </span>
                                </div>
                                <span className="text-sm text-muted-foreground">
                                    ₹{item.actual.toLocaleString()} / ₹
                                    {item.budget.toLocaleString()}
                                </span>
                            </div>
                            <Progress value={percent} className="h-2" />
                            {isOver && (
                                <p className="text-xs text-red-500 mt-1">
                                    ⚠️ Over budget
                                </p>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
