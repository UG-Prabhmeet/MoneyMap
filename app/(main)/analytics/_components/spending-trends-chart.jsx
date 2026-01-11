"use client";

import React from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { categoryColors, defaultCategories } from "@/data/categories";

const expenseCategories = defaultCategories.filter((c) => c.type === "EXPENSE");

export default function SpendingTrendsChart({ data }) {
    return (
        <div className="w-full space-y-6 p-4 bg-white rounded-2xl">
            <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                        <defs>
                            {expenseCategories.map((category) => (
                                <linearGradient
                                    key={`gradient-${category.id}`}
                                    id={`color-${category.id}`}
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="5%"
                                        stopColor={categoryColors[category.id]}
                                        stopOpacity={0.1}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor={categoryColors[category.id]}
                                        stopOpacity={0}
                                    />
                                </linearGradient>
                            ))}
                        </defs>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="#f1f5f9"
                        />
                        <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: "#64748b" }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: "#64748b" }}
                            tickFormatter={(value) =>
                                `₹${value.toLocaleString()}`
                            }
                        />
                        <Tooltip
                            contentStyle={{
                                borderRadius: "12px",
                                border: "none",
                                boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                                padding: "12px",
                            }}
                            itemSorter={(item) => -item.value} // Sort tooltip by highest spend
                        />
                        {expenseCategories.map((category) => (
                            <Area
                                key={category.id}
                                type="monotone"
                                dataKey={category.id}
                                stackId="1" // Stacking makes the "total" spending visible
                                stroke={categoryColors[category.id]}
                                strokeWidth={2}
                                fillOpacity={1}
                                fill={`url(#color-${category.id})`}
                                animationDuration={1200}
                            />
                        ))}
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Clean Legend Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 pt-4 border-t border-slate-100">
                {expenseCategories.map((category) => (
                    <div
                        key={category.id}
                        className="flex items-center gap-2 group cursor-pointer"
                    >
                        <span
                            className="w-2 h-2 rounded-full transition-transform group-hover:scale-125"
                            style={{
                                backgroundColor: categoryColors[category.id],
                            }}
                        />
                        <span className="text-[11px] font-medium text-slate-600 group-hover:text-slate-900 transition-colors truncate">
                            {category.name}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
