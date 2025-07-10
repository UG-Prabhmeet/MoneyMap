"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { defaultCategories } from "@/data/categories";

export async function getMonthlySpendingTrends() {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    const transactions = await db.transaction.findMany({
        where: {
            userId: user.id,
            type: "EXPENSE",
        },
        orderBy: {
            date: "asc",
        },
    });

    // Filter only expense categories
    const expenseCategories = defaultCategories.filter(
        (c) => c.type === "EXPENSE"
    );

    // Build monthly grouped data
    const monthlyMap = {};

    for (const tx of transactions) {
        const date = new Date(tx.date);
        const month = date.toLocaleString("default", {
            month: "short",
            year: "numeric",
        });

        if (!monthlyMap[month]) {
            monthlyMap[month] = { month };
            expenseCategories.forEach((cat) => {
                monthlyMap[month][cat.id] = 0;
            });
        }

        if (monthlyMap[month][tx.category] !== undefined) {
            monthlyMap[month][tx.category] += Number(tx.amount);
        }
    }

    // Convert to array sorted by month
    const monthlyData = Object.values(monthlyMap);

    return monthlyData;
}

export async function getSavingsSummary() {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    const fromDate = new Date();
    fromDate.setMonth(fromDate.getMonth() - 3); // last 3 months

    const incomeTxs = await db.transaction.aggregate({
        where: {
            userId: user.id,
            type: "INCOME",
            date: { gte: fromDate },
        },
        _sum: { amount: true },
    });

    const expenseTxs = await db.transaction.aggregate({
        where: {
            userId: user.id,
            type: "EXPENSE",
            date: { gte: fromDate },
        },
        _sum: { amount: true },
    });

    return {
        income: incomeTxs._sum.amount?.toNumber() || 0,
        expense: expenseTxs._sum.amount?.toNumber() || 0,
    };
}

export async function getNetWorthHistory() {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    const transactions = await db.transaction.findMany({
        where: { userId: user.id },
        orderBy: { date: "asc" },
    });

    const monthlyNetWorth = {};
    let runningNetWorth = 0;

    for (const tx of transactions) {
        const month = new Date(tx.date).toLocaleString("default", {
            month: "short",
            year: "numeric",
        });

        if (!monthlyNetWorth[month]) {
            monthlyNetWorth[month] = { month, netWorth: runningNetWorth };
        }

        const amt = Number(tx.amount);
        runningNetWorth += tx.type === "INCOME" ? amt : -amt;
        monthlyNetWorth[month].netWorth = runningNetWorth;
    }

    return Object.values(monthlyNetWorth);
}

export async function getCashFlowData() {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    const transactions = await db.transaction.findMany({
        where: { userId: user.id },
        orderBy: { date: "asc" },
    });

    const flowByMonth = {};

    for (const tx of transactions) {
        const month = new Date(tx.date).toLocaleString("default", {
            month: "short",
            year: "numeric",
        });

        if (!flowByMonth[month]) {
            flowByMonth[month] = {
                month,
                inflow: 0,
                outflow: 0,
            };
        }

        const amt = Number(tx.amount);
        if (tx.type === "INCOME") {
            flowByMonth[month].inflow += amt;
        } else {
            flowByMonth[month].outflow += amt;
        }
    }

    // Add net flow
    const result = Object.values(flowByMonth).map((entry) => ({
        ...entry,
        net: entry.inflow - entry.outflow,
    }));

    return result;
}

export async function getBudgetInsights() {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    const currentDate = new Date();
    const startOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
    );
    const endOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
    );

    const categories = defaultCategories.filter((c) => c.type === "EXPENSE");

    const transactions = await db.transaction.groupBy({
        by: ["category"],
        where: {
            userId: user.id,
            type: "EXPENSE",
            date: {
                gte: startOfMonth,
                lte: endOfMonth,
            },
        },
        _sum: {
            amount: true,
        },
    });

    // Default budget per category
    const defaultBudgetPerCategory = 5000;

    const insights = categories.map((cat) => {
        const actualTx = transactions.find((tx) => tx.category === cat.id);
        const actual = actualTx?._sum?.amount?.toNumber() || 0;

        return {
            category: cat.name,
            actual,
            budget: defaultBudgetPerCategory,
        };
    });

    return insights;
}
