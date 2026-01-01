"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

// serializing decimal to number
const serializeDecimal = (obj) => {
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
    return serialized;
};

// get account with transactions
export async function getAccountWithTransactions(accountId) {
    const { userId } = await auth(); // only fetches clerk userId
    if (!userId) throw new Error("Unauthorized");

    // fetches user with all accounts, tx, budgets from db
    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    // fetches the account with transactions
    // if no accountId is provided, fetch the default account
    const account = await db.account.findFirst({
        where: {
            userId: user.id,
            ...(accountId ? { id: accountId } : { isDefault: true }),
        },
        include: {
            transactions: {
                orderBy: { date: "desc" },
            },
            _count: {
                select: { transactions: true },
            },
        },
    });

    if (!account) return null;

    return {
        ...serializeDecimal(account),
        transactions: account.transactions.map(serializeDecimal),
    };
}

export async function bulkDeleteTransactions(transactionIds) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
        });

        if (!user) throw new Error("User not found");

        // Get transactions to calculate balance changes
        const transactions = await db.transaction.findMany({
            where: {
                id: { in: transactionIds },
                userId: user.id,
            },
        });

        // Group transactions by account to update balances
        const accountBalanceChanges = transactions.reduce(
            (acc, transaction) => {
                const change =
                    transaction.type === "EXPENSE"
                        ? transaction.amount
                        : -transaction.amount;
                acc[transaction.accountId] =
                    (acc[transaction.accountId] || 0) + change;
                return acc;
            },
            {}
        );

        // Delete transactions and update account balances in a transaction
        // $transaction is used to run multiple db operations in a single transaction
        // with atomicity
        await db.$transaction(async (tx) => {
            // Delete transactions
            await tx.transaction.deleteMany({
                where: {
                    id: { in: transactionIds },
                    userId: user.id,
                },
            });

            // update account balances
            for (const [accountId, balanceChange] of Object.entries(
                accountBalanceChanges
            )) {
                await tx.account.update({
                    where: { id: accountId },
                    data: {
                        balance: {
                            increment: balanceChange,
                        },
                    },
                });
            }
        });

        // revalidatePath = remove cache of page and fetch new data
        revalidatePath("/dashboard"); 
        revalidatePath("/account/[id]");

        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// update default account
export async function updateDefaultAccount(accountId) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
        });

        if (!user) {
            throw new Error("User not found");
        }

        // first, unsetting any existing default accounts
        await db.account.updateMany({
            where: {
                userId: user.id,
                isDefault: true,
            },
            data: { isDefault: false },
        });

        // then set the new default account
        const account = await db.account.update({
            where: {
                id: accountId,
                userId: user.id,
            },
            data: { isDefault: true },
        });

        revalidatePath("/dashboard");
        return { success: true, data: serializeDecimal(account) };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function updateSavingsGoal(accountId, savingsGoal) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
        });

        if (!user) {
            throw new Error("User not found");
        }

        const goalAmount = parseFloat(savingsGoal);
        if (isNaN(goalAmount) || goalAmount < 0) {
            throw new Error("Invalid savings goal amount. Goal must be non-negative.");
        }

        const account = await db.account.update({
            where: {
                id: accountId,
                userId: user.id,
            },
            data: {
                savingsGoal: goalAmount,
            },
        });

        revalidatePath("/dashboard");
        revalidatePath("/analytics");
        return { success: true, data: serializeDecimal(account) };
    } catch (error) {
        return { success: false, error: error.message };
    }
}
