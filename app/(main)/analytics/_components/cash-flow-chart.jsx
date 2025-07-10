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
} from "recharts";

export default function CashFlowChart({ data }) {
    return (
        <div className="space-y-4 overflow-x-auto">
            <div className="min-w-[500px] w-full h-[320px] sm:h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                        barGap={4}
                    >
                        <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" />
                        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                        <YAxis
                            tick={{ fontSize: 12 }}
                            tickFormatter={(value) =>
                                `₹${value.toLocaleString()}`
                            }
                        />
                        <Tooltip
                            formatter={(value) =>
                                `₹${parseFloat(value).toLocaleString()}`
                            }
                            labelStyle={{
                                fontWeight: "bold",
                                color: "#0f172a",
                            }}
                            contentStyle={{
                                backgroundColor: "#fff",
                                borderRadius: "0.5rem",
                            }}
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

            {/* Legend manually rendered below for responsiveness */}
            <div className="flex flex-wrap justify-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-green-500" />{" "}
                    Inflow
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500" /> Outflow
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-sky-500" /> Net
                    Flow
                </div>
            </div>
        </div>
    );
}
