"use client";

import React from "react";
import {
    ResponsiveContainer,
    AreaChart, // Changed to AreaChart for better visual "volume"
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ReferenceLine,
} from "recharts";

export default function NetWorthChart({ data }) {
    // Filter out historical data points with 0 or flat value if they distort the chart
    // Or keep them but ensure the chart scales properly

    return (
        <div className="w-full h-[360px] p-4 bg-white rounded-2xl">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={data}
                    margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                >
                    <defs>
                        <linearGradient
                            id="colorNetWorth"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                        >
                            <stop
                                offset="5%"
                                stopColor="#22c55e"
                                stopOpacity={0.3}
                            />
                            <stop
                                offset="95%"
                                stopColor="#22c55e"
                                stopOpacity={0}
                            />
                        </linearGradient>
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
                        minTickGap={30}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fill: "#64748b" }}
                        tickFormatter={(value) =>
                            `₹${(value / 1000).toFixed(0)}k`
                        }
                    />
                    <Tooltip
                        cursor={{ stroke: "#22c55e", strokeWidth: 2 }}
                        contentStyle={{
                            borderRadius: "12px",
                            border: "none",
                            boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                        }}
                        formatter={(value) => [
                            <span className="font-bold text-slate-900">
                                ₹{parseFloat(value).toLocaleString()}
                            </span>,
                            "Net Worth",
                        ]}
                    />
                    {/* Zero line to clearly show when net worth was negative/neutral */}
                    <ReferenceLine y={0} stroke="#cbd5e1" strokeWidth={1} />
                    <Area
                        type="monotone"
                        dataKey="netWorth"
                        stroke="#22c55e"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorNetWorth)"
                        animationDuration={1500}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
