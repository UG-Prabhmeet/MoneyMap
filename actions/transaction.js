"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { GoogleGenerativeAI } from "@google/generative-ai";
import aj from "@/lib/arcjet";
import { request } from "@arcjet/next";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const serializeAmount = (obj) => ({
    ...obj,
    amount: obj.amount.toNumber(),
});

/**
 * Calculates the next recurring date based on the start date and interval.
 * @param {Date} startDate
 * @param {string} interval - "DAILY", "WEEKLY", "MONTHLY", or "YEARLY"
 * @returns {Date} The next calculated date
 */
function calculateNextRecurringDate(startDate, interval) {
    const date = new Date(startDate);

    switch (interval) {
        case "DAILY":
            date.setDate(date.getDate() + 1);
            break;
        case "WEEKLY":
            date.setDate(date.getDate() + 7);
            break;
        case "MONTHLY":
            date.setMonth(date.getMonth() + 1);
            break;
        case "YEARLY":
            date.setFullYear(date.getFullYear() + 1);
            break;
    }

    return date;
}

// Create Transaction
export async function createTransaction(data) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        // Get request data for ArcJet
        const req = await request();

        // Check rate limit
        const decision = await aj.protect(req, {
            userId,
            requested: 1,
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

        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
        });

        if (!user) {
            throw new Error("User not found");
        }

        const account = await db.account.findUnique({
            where: {
                id: data.accountId,
                userId: user.id,
            },
        });

        if (!account) {
            throw new Error("Account not found");
        }

        // Calculate new balance
        const balanceChange =
            data.type === "EXPENSE" ? -data.amount : data.amount;
        const newBalance = account.balance.toNumber() + balanceChange;

        // Create transaction and update account balance
        const transaction = await db.$transaction(async (tx) => {
            const newTransaction = await tx.transaction.create({
                data: {
                    ...data,
                    userId: user.id,
                    nextRecurringDate:
                        data.isRecurring && data.recurringInterval
                            ? calculateNextRecurringDate(
                                  data.date,
                                  data.recurringInterval
                              )
                            : null,
                },
            });

            await tx.account.update({
                where: { id: data.accountId },
                data: { balance: newBalance },
            });

            return newTransaction;
        });

        revalidatePath("/dashboard");
        revalidatePath(`/account/${transaction.accountId}`);

        return { success: true, data: serializeAmount(transaction) };
    } catch (error) {
        throw new Error(error.message);
    }
}

export async function getTransaction(id) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    const transaction = await db.transaction.findUnique({
        where: {
            id,
            userId: user.id,
        },
    });

    if (!transaction) throw new Error("Transaction not found");

    return serializeAmount(transaction);
}

export async function updateTransaction(id, data) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
        });

        if (!user) throw new Error("User not found");

        // Get original transaction to calculate balance change
        const originalTransaction = await db.transaction.findUnique({
            where: {
                id,
                userId: user.id,
            },
            include: {
                account: true,
            },
        });

        if (!originalTransaction) throw new Error("Transaction not found");

        // Calculate balance changes
        const oldBalanceChange =
            originalTransaction.type === "EXPENSE"
                ? -originalTransaction.amount.toNumber()
                : originalTransaction.amount.toNumber();

        const newBalanceChange =
            data.type === "EXPENSE" ? -data.amount : data.amount;

        const netBalanceChange = newBalanceChange - oldBalanceChange;

        // Update transaction and account balance in a transaction
        const transaction = await db.$transaction(async (tx) => {
            const updated = await tx.transaction.update({
                where: {
                    id,
                    userId: user.id,
                },
                data: {
                    ...data,
                    nextRecurringDate:
                        data.isRecurring && data.recurringInterval
                            ? calculateNextRecurringDate(
                                  data.date,
                                  data.recurringInterval
                              )
                            : null,
                },
            });

            // Update account balance
            await tx.account.update({
                where: { id: data.accountId },
                data: {
                    balance: {
                        increment: netBalanceChange,
                    },
                },
            });

            return updated;
        });

        revalidatePath("/dashboard");
        revalidatePath(`/account/${data.accountId}`);

        return { success: true, data: serializeAmount(transaction) };
    } catch (error) {
        throw new Error(error.message);
    }
}

// Get User Transactions
export async function getUserTransactions(query = {}) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
        });

        if (!user) {
            throw new Error("User not found");
        }

        const transactions = await db.transaction.findMany({
            where: {
                userId: user.id,
                ...query,
            },
            include: {
                account: true,
            },
            orderBy: {
                date: "desc",
            },
        });

        return { success: true, data: transactions };
    } catch (error) {
        throw new Error(error.message);
    }
}

// Scan Receipt
export async function scanReceipt(file) {
    const MAX_RETRIES = 3; // Retry up to 3 times
    let lastError = null;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        try {
            const model = genAI.getGenerativeModel({
                model: "gemini-2.5-flash", // Use the latest stable 2.5 series
            });

            const arrayBuffer = await file.arrayBuffer();
            const base64String = Buffer.from(arrayBuffer).toString("base64");

            const prompt = `
            Analyze this receipt image and extract the following information in JSON format:
            - Total amount (just the number)
            - Date (in ISO format)
            - Description or items purchased (brief summary)
            - Merchant/store name
            - Suggested category (one of: housing,transportation,groceries,utilities,entertainment,food,shopping,healthcare,education,personal,travel,insurance,gifts,bills,other-expense)
            
            Only respond with valid JSON in this exact format:
            {
              "amount": number,
              "date": "ISO date string",
              "description": "string",
              "merchantName": "string",
              "category": "string"
            }

            If it's not a receipt, return an empty object {}.
            `;

            // Wait with exponential backoff before retrying (skip on first attempt)
            if (attempt > 0) {
                // Wait for 2^attempt * 1000 milliseconds (2s, 4s)
                const delay = Math.pow(2, attempt) * 1000;
                console.log(
                    `Retrying receipt scan in ${delay / 1000}s... (Attempt ${attempt + 1}/${MAX_RETRIES})`
                );
                await new Promise((resolve) => setTimeout(resolve, delay));
            }

            // Updated content array for 2.5 series SDK compatibility
            const result = await model.generateContent([
                {
                    inlineData: {
                        data: base64String,
                        mimeType: file.type || "image/jpeg",
                    },
                },
                { text: prompt },
            ]);

            const response = await result.response;
            const text = await response.text();

            // Improved cleaning: removing markdown and potential whitespace
            const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

            try {
                const data = JSON.parse(cleanedText);

                // Check if data is empty (user uploaded non-receipt)
                if (Object.keys(data).length === 0) {
                    throw new Error("No receipt data found in image");
                }

                return {
                    amount: parseFloat(data.amount),
                    date: new Date(data.date),
                    description: data.description,
                    category: data.category,
                    merchantName: data.merchantName,
                };
            } catch (parseError) {
                console.error("Gemini Raw Response:", text);
                throw new Error(
                    "Failed to parse receipt data. Please try a clearer photo."
                );
            }
        } catch (error) {
            lastError = error;
            console.error(
                `Error scanning receipt on attempt ${attempt + 1}:`,
                error
            );

            // Check if the error is a transient 503 Service Unavailable or model overloaded
            // We only retry on these specific external API issues.
            const isTransientError =
                error.message.includes("503 Service Unavailable") ||
                error.message.includes("The model is overloaded");

            // If it's a non-transient error (like 400 Bad Request, 401 Unauthorized, etc.) or rate limit,
            // we re-throw immediately.
            if (!isTransientError) {
                // Specifically handle the 429 error for the user
                if (error.message.includes("429")) {
                    throw new Error(
                        "Daily free limit reached for receipt scanning."
                    );
                }
                throw new Error(error.message || "Failed to scan receipt");
            }

            // If it IS a transient error (503), the loop will continue to the next attempt.
            if (attempt === MAX_RETRIES - 1) {
                // If this was the last attempt, re-throw the last error message
                throw new Error(
                    lastError.message ||
                        "Failed to scan receipt after multiple retries"
                );
            }
        }
    }
}
