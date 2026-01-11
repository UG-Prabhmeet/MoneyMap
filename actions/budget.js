"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

// get current budget for an account
export async function getCurrentBudget(accountId) {
    try {
        const { userId } = await auth(); // clerk userId
        if (!userId) throw new Error("Unauthorized");

        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
        });

        if (!user) throw new Error("User not found");

        const budget = await db.budget.findFirst({
            where: {
                accountId: accountId,
            },
        });

        // get current month's expenses (India Standard Time - IST)
        const currentDate = new Date();
        const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC + 5:30
        const istDate = new Date(currentDate.getTime() + istOffset);

        const year = istDate.getUTCFullYear();
        const month = istDate.getUTCMonth();

        // Calculate start and end of the month in IST, then convert to UTC for DB query
        const startOfMonth = new Date(Date.UTC(year, month, 1) - istOffset);
        const endOfMonth = new Date(
            Date.UTC(year, month + 1, 0, 23, 59, 59, 999) - istOffset
        );

        const expenses = await db.transaction.aggregate({
            where: {
                userId: user.id,
                type: "EXPENSE",
                date: {
                    gte: startOfMonth, // greater than or equal to
                    lte: endOfMonth, // less than or equal to
                },
                accountId: accountId,
            },
            _sum: {
                amount: true,
            },
        });

        return {
            budget: budget
                ? { ...budget, amount: budget.amount.toNumber() }
                : null,
            currentExpenses: expenses._sum.amount
                ? expenses._sum.amount.toNumber()
                : 0,
            period: {
                month: month + 1,
                year: year,
            },
        };
    } catch (error) {
        console.error("Error fetching budget:", error);
        throw error;
    }
}

// update budget
export async function updateBudget(amount, accountId) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");
        if (!accountId) throw new Error("Account ID is required");

        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
        });

        if (!user) throw new Error("User not found");

        // update or create budget
        const budget = await db.budget.upsert({
            where: {
                accountId: accountId,
            },
            update: {
                amount,
            },
            create: {
                userId: user.id,
                accountId: accountId,
                amount,
            },
        });

        revalidatePath("/dashboard");
        revalidatePath(`/account/${accountId}`);
        return {
            success: true,
            data: { ...budget, amount: budget.amount.toNumber() },
        };
    } catch (error) {
        console.error("Error updating budget:", error);
        return { success: false, error: error.message };
    }
}
