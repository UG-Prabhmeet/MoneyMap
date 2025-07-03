"use client";

import React from "react";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";

export default function NetWorthChart({ data }) {
    return (
        <div className="p-6 bg-background rounded-2xl shadow-lg space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">
                💰 Net Worth Over Time
            </h2>
            <ResponsiveContainer width="100%" height={400}>
                <LineChart
                    data={data}
                    margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                >
                    <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => `₹${value.toLocaleString()}`}
                    />
                    <Tooltip
                        formatter={(value) =>
                            `₹${parseFloat(value).toLocaleString()}`
                        }
                        labelStyle={{ fontWeight: "bold", color: "#0f172a" }}
                        contentStyle={{
                            backgroundColor: "#fff",
                            borderRadius: "0.5rem",
                        }}
                    />
                    <Line
                        type="monotone"
                        dataKey="netWorth"
                        stroke="#22c55e"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
