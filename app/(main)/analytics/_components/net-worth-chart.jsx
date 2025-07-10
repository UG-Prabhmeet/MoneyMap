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
        <ResponsiveContainer width="100%" height={360}>
            <LineChart
                data={data}
                margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            >
                <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" />
                <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11 }}
                    angle={-15}
                    textAnchor="end"
                    height={40}
                />
                <YAxis
                    tick={{ fontSize: 11 }}
                    tickFormatter={(value) => `₹${value.toLocaleString()}`}
                />
                <Tooltip
                    formatter={(value) =>
                        `₹${parseFloat(value).toLocaleString()}`
                    }
                    labelStyle={{
                        fontWeight: "bold",
                        color: "#0f172a",
                        fontSize: "0.875rem",
                    }}
                    contentStyle={{
                        backgroundColor: "#fff",
                        borderRadius: "0.5rem",
                        fontSize: "0.875rem",
                    }}
                />
                <Line
                    type="monotone"
                    dataKey="netWorth"
                    stroke="#22c55e"
                    strokeWidth={3}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
}
