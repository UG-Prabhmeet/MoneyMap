"use client";

import React from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { categoryColors, defaultCategories } from "@/data/categories";

const expenseCategories = defaultCategories.filter((c) => c.type === "EXPENSE");

export default function SpendingTrendsChart({ data }) {
    return (
        <div className="space-y-2 overflow-x-auto">
            <div className="min-w-[600px] w-full h-[360px] sm:h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={data}
                        margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
                    >
                        <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" />
                        <XAxis
                            dataKey="month"
                            tick={{ fontSize: 11 }}
                            angle={-15}
                            textAnchor="end"
                            height={40}
                        />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "white",
                                borderRadius: "0.5rem",
                                fontSize: "0.875rem",
                            }}
                            labelStyle={{
                                fontWeight: "bold",
                                color: "#0f172a",
                                fontSize: "0.875rem",
                            }}
                        />
                        {expenseCategories.map((category) => (
                            <Line
                                key={category.id}
                                type="monotone"
                                dataKey={category.id}
                                stroke={categoryColors[category.id]}
                                strokeWidth={2.5}
                                dot={false}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Legend placed below for better spacing on small screens */}
            <div className="flex flex-wrap gap-3 text-sm justify-center">
                {expenseCategories.map((category) => (
                    <div key={category.id} className="flex items-center gap-1">
                        <span
                            className="inline-block w-3 h-3 rounded-full"
                            style={{
                                backgroundColor: categoryColors[category.id],
                            }}
                        />
                        {category.name}
                    </div>
                ))}
            </div>
        </div>
    );
}
