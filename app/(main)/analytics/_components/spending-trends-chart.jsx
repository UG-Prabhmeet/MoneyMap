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
        <div className="p-6 bg-background rounded-2xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
                📈 Spending Trends Over Time
            </h2>
            <ResponsiveContainer width="100%" height={400}>
                <LineChart
                    data={data}
                    margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
                >
                    <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "white",
                            borderRadius: "0.5rem",
                        }}
                        labelStyle={{ fontWeight: "bold", color: "#0f172a" }}
                    />
                    <Legend
                        verticalAlign="top"
                        height={36}
                        iconType="circle"
                        wrapperStyle={{ paddingBottom: "1rem" }}
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
    );
}
