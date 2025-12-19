"use client";

import React from "react";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Cell,
} from "recharts";

export default function CashFlowChart({ data }) {
    return (
        <div className="space-y-6 w-full h-[400px] p-4 bg-white rounded-2xl">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                    barSize={32}
                >
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
                        cursor={{ fill: "#f8fafc" }}
                        contentStyle={{
                            borderRadius: "12px",
                            border: "none",
                            boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                        }}
                        formatter={(value, name) => [
                            <span className="font-bold text-slate-900">
                                ₹{parseFloat(value).toLocaleString()}
                            </span>,
                            name,
                        ]}
                    />

                    {/* Inflow Bar */}
                    <Bar
                        dataKey="inflow"
                        fill="#22c55e"
                        name="Total Inflow"
                        radius={[6, 6, 0, 0]}
                    />

                    {/* Outflow Bar */}
                    <Bar
                        dataKey="outflow"
                        fill="#ef4444"
                        name="Total Outflow"
                        radius={[6, 6, 0, 0]}
                    />

                    {/* Net Flow Bar with Dynamic Coloring */}
                    <Bar dataKey="net" name="Net Flow" radius={[6, 6, 0, 0]}>
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={entry.net >= 0 ? "#0ea5e9" : "#f43f5e"}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>

            {/* Custom Legend */}
            <div className="flex flex-wrap justify-center gap-6 text-xs font-bold uppercase tracking-wider text-slate-500">
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-green-500" />{" "}
                    Inflow
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500" /> Outflow
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-sky-500" /> Net
                    (Pos)
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500" /> Net
                    (Neg)
                </div>
            </div>
        </div>
    );
}
