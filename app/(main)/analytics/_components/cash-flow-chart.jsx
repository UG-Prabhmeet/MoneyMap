"use client";

import React from "react";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    CartesianGrid,
} from "recharts";

export default function CashFlowChart({ data }) {
    return (
        <div className="p-6 bg-background rounded-2xl shadow-lg space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">
                🔄 Cash Flow Analysis
            </h2>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart
                    data={data}
                    margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                    barGap={4}
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
                    <Legend
                        verticalAlign="top"
                        iconType="circle"
                        wrapperStyle={{ paddingBottom: "1rem" }}
                    />
                    <Bar
                        dataKey="inflow"
                        fill="#22c55e"
                        name="Inflow"
                        radius={[4, 4, 0, 0]}
                    />
                    <Bar
                        dataKey="outflow"
                        fill="#ef4444"
                        name="Outflow"
                        radius={[4, 4, 0, 0]}
                    />
                    <Bar
                        dataKey="net"
                        fill="#0ea5e9"
                        name="Net Flow"
                        radius={[4, 4, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
