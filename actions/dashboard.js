"use server";

import aj from "@/lib/arcjet";
import { db } from "@/lib/prisma";
import { request } from "@arcjet/next";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

// serialize decimal to number
const serializeTransaction = (obj) => {
    const serialized = { ...obj };
    if (obj.balance) {
        serialized.balance = obj.balance.toNumber();
    }
    if (obj.amount) {
        serialized.amount = obj.amount.toNumber();
    }
    if (obj.savingsGoal) {
        serialized.savingsGoal = obj.savingsGoal.toNumber();
    }
    if (obj.income && typeof obj.income === "object") {
        serialized.income = obj.income.toNumber();
    }
    if (obj.expense && typeof obj.expense === "object") {
        serialized.expense = obj.expense.toNumber();
    }
    return serialized;
};

// get all accounts of user
export async function getUserAccounts() {
    const { userId } = await auth(); // fetches clerk userId
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    try {
        // all accounts
        const accounts = await db.account.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: "desc" },
            include: {
                _count: {
                    select: {
                        transactions: true,
                    },
                },
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

        // Fetch income and expenses for all accounts for the current month in a single query
        const stats = await db.transaction.groupBy({
            by: ["accountId", "type"],
            where: {
                userId: user.id,
                date: {
                    gte: startOfMonth,
                    lte: endOfMonth,
                },
            },
            _sum: {
                amount: true,
            },
        });

        // Map stats to accounts
        const accountsWithStats = accounts.map((account) => {
            const accountStats = stats.filter((s) => s.accountId === account.id);
            const income =
                accountStats
                    .find((s) => s.type === "INCOME")
                    ?._sum.amount?.toNumber() || 0;
            const expense =
                accountStats
                    .find((s) => s.type === "EXPENSE")
                    ?._sum.amount?.toNumber() || 0;

            return {
                ...account,
                income,
                expense,
            };
        });

        // serialize accounts before sending to client
        const serializedAccounts = accountsWithStats.map(serializeTransaction);

        return serializedAccounts;
    } catch (error) {
        console.error(error.message);
    }
}

// create account
export async function createAccount(data) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        // initialize Arcjet request tracking
        const req = await request();

        // rate limiting
        const decision = await aj.protect(req, {
            userId,
            requested: 1, // consume 1 token
        });

        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                const { remaining, reset } = decision.reason;
                console.error({
                    code: "RATE_LIMIT_EXCEEDED",
                    details: {
                        remaining,
                        resetInSeconds: reset,
                    },
                });

                throw new Error("Too many requests. Please try again later.");
            }

            throw new Error("Request blocked");
        }

        // if arcjet approved the request
        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
        });

        if (!user) {
            throw new Error("User not found");
        }

        // convert balance to float before saving
        const balanceFloat = parseFloat(data.balance);
        if (isNaN(balanceFloat)) {
            throw new Error("Invalid balance amount");
        }

        // check if this is the user's first account
        const existingAccounts = await db.account.findMany({
            where: { userId: user.id },
        });

        // if it's the first account, make it default regardless of user input
        // if not, use the user's preference
        const shouldBeDefault =
            existingAccounts.length === 0 ? true : data.isDefault;

        // if this account should be default, unset other default accounts
        if (shouldBeDefault) {
            await db.account.updateMany({
                where: { userId: user.id, isDefault: true },
                data: { isDefault: false },
            });
        }

        // create new account
        const account = await db.account.create({
            data: {
                ...data,
                balance: balanceFloat,
                userId: user.id,
                isDefault: shouldBeDefault, // override the isDefault based on our logic
            },
        });

        // serialize the account before returning
        const serializedAccount = serializeTransaction(account);

        revalidatePath("/dashboard");
        return { success: true, data: serializedAccount };
    } catch (error) {
        throw new Error(error.message);
    }
}

// getting all transactions for current view of dashboard
export async function getDashboardData() {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    // get all user transactions
    const transactions = await db.transaction.findMany({
        where: { userId: user.id },
        orderBy: { date: "desc" },
    });

    return transactions.map(serializeTransaction);
}
