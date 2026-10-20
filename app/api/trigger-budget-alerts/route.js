import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import EmailTemplate from "@/emails/template";
import { sendEmail } from "@/actions/send-email";
import { GoogleGenerativeAI } from "@google/generative-ai";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isNewMonth(lastAlertDate, currentDate) {
    return (
        lastAlertDate.getMonth() !== currentDate.getMonth() ||
        lastAlertDate.getFullYear() !== currentDate.getFullYear()
    );
}

async function getMonthlyStats(userId, month) {
    const startDate = new Date(month.getFullYear(), month.getMonth(), 1);
    const endDate = new Date(month.getFullYear(), month.getMonth() + 1, 0);

    const transactions = await db.transaction.findMany({
        where: {
            userId,
            date: { gte: startDate, lte: endDate },
        },
    });

    return transactions.reduce(
        (stats, t) => {
            const amount = t.amount.toNumber();
            if (t.type === "EXPENSE") {
                stats.totalExpenses += amount;
                stats.byCategory[t.category] = (stats.byCategory[t.category] || 0) + amount;
            } else {
                stats.totalIncome += amount;
            }
            return stats;
        },
        { totalExpenses: 0, totalIncome: 0, byCategory: {}, transactionCount: transactions.length }
    );
}

async function generateFinancialInsights(stats, month) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
    Analyze this financial data and provide 3 concise, actionable insights.
    Focus on spending patterns and practical advice.
    Keep it friendly and conversational.

    Financial Data for ${month}:
    - Total Income: ₹ ${stats.totalIncome}
    - Total Expenses: ₹ ${stats.totalExpenses}
    - Net Income: ₹ ${stats.totalIncome - stats.totalExpenses}
    - Expense Categories: ${Object.entries(stats.byCategory)
        .map(([category, amount]) => `${category}: ₹ ${amount}`)
        .join(", ")}

    Format the response as a JSON array of strings, like this:
    ["insight 1", "insight 2", "insight 3"]
  `;

    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
        return JSON.parse(cleanedText);
    } catch (error) {
        console.error("Error generating insights:", error);
        return [
            "Your highest expense category this month might need attention.",
            "Consider setting up a budget for better financial management.",
            "Track your recurring expenses to identify potential savings.",
        ];
    }
}

// ─── Budget Alert Trigger ─────────────────────────────────────────────────────

async function triggerBudgetAlerts(force, overrideTo) {
    const budgets = await db.budget.findMany({
        include: {
            user: {
                include: { accounts: { where: { isDefault: true } } },
            },
        },
    });

    if (budgets.length === 0) {
        return { budgetsChecked: 0, message: "No budgets found. Create a budget in the app first.", results: [] };
    }

    const results = [];

    for (const budget of budgets) {
        const defaultAccount = budget.user.accounts[0];
        if (!defaultAccount) {
            results.push({ budgetId: budget.id, user: budget.user.email, status: "skipped", reason: "no default account" });
            continue;
        }

        const startDate = new Date();
        startDate.setDate(1);

        const expenses = await db.transaction.aggregate({
            where: {
                userId: budget.userId,
                accountId: defaultAccount.id,
                type: "EXPENSE",
                date: { gte: startDate },
            },
            _sum: { amount: true },
        });

        const totalExpenses = expenses._sum.amount?.toNumber() || 0;
        const budgetAmount = Number(budget.amount);
        const percentageUsed = budgetAmount > 0 ? (totalExpenses / budgetAmount) * 100 : 0;

        const shouldSend =
            force ||
            (percentageUsed >= 80 &&
                (!budget.lastAlertSent || isNewMonth(new Date(budget.lastAlertSent), new Date())));

        if (shouldSend) {
            const recipient = overrideTo || budget.user.email;
            const emailResult = await sendEmail({
                to: recipient,
                subject: `Budget Alert for ${defaultAccount.name}`,
                react: EmailTemplate({
                    userName: budget.user.name,
                    type: "budget-alert",
                    data: {
                        percentageUsed,
                        budgetAmount: parseInt(budgetAmount).toFixed(1),
                        totalExpenses: parseInt(totalExpenses).toFixed(1),
                        accountName: defaultAccount.name,
                    },
                }),
            });

            console.log("[Budget Alert] Resend result:", JSON.stringify(emailResult));

            if (emailResult.success) {
                await db.budget.update({ where: { id: budget.id }, data: { lastAlertSent: new Date() } });
            }

            results.push({
                budgetId: budget.id,
                user: budget.user.email,
                sentTo: recipient,
                account: defaultAccount.name,
                percentageUsed: percentageUsed.toFixed(1) + "%",
                status: emailResult.success ? "email_sent" : "email_failed",
                resendId: emailResult.data?.id || null,
                error: emailResult.success ? undefined : String(emailResult.error),
            });
        } else {
            results.push({
                budgetId: budget.id,
                user: budget.user.email,
                account: defaultAccount.name,
                percentageUsed: percentageUsed.toFixed(1) + "%",
                status: "skipped",
                reason: percentageUsed < 80 ? "below 80% threshold (use ?force=true)" : "alert already sent this month",
            });
        }
    }

    return { budgetsChecked: budgets.length, results };
}

// ─── Monthly Report Trigger ───────────────────────────────────────────────────

async function triggerMonthlyReports(overrideTo) {
    const users = await db.user.findMany({ include: { accounts: true } });

    if (users.length === 0) {
        return { usersProcessed: 0, message: "No users found.", results: [] };
    }

    const results = [];
    // Use last month for stats (same as the cron job does)
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const monthName = lastMonth.toLocaleString("default", { month: "long", year: "numeric" });

    for (const user of users) {
        const stats = await getMonthlyStats(user.id, lastMonth);
        const insights = await generateFinancialInsights(stats, monthName);
        const recipient = overrideTo || user.email;

        const emailResult = await sendEmail({
            to: recipient,
            subject: `Your Monthly Financial Report - ${monthName}`,
            react: EmailTemplate({
                userName: user.name,
                type: "monthly-report",
                data: { stats, month: monthName, insights },
            }),
        });

        console.log("[Monthly Report] Resend result:", JSON.stringify(emailResult));

        results.push({
            userId: user.id,
            user: user.email,
            sentTo: recipient,
            month: monthName,
            transactionCount: stats.transactionCount,
            status: emailResult.success ? "email_sent" : "email_failed",
            resendId: emailResult.data?.id || null,
            error: emailResult.success ? undefined : String(emailResult.error),
        });
    }

    return { usersProcessed: users.length, results };
}

// ─── Route Handler ────────────────────────────────────────────────────────────

export async function GET(request) {
    if (process.env.NODE_ENV === "production") {
        return NextResponse.json({ error: "Not available in production" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "budget";      // "budget" or "monthly"
    const force = searchParams.get("force") === "true";     // bypass threshold
    const overrideTo = searchParams.get("to") || null;      // override recipient email

    try {
        let result;

        if (type === "monthly") {
            result = await triggerMonthlyReports(overrideTo);
        } else {
            result = await triggerBudgetAlerts(force, overrideTo);
        }

        return NextResponse.json({ success: true, type, ...result });
    } catch (error) {
        console.error("[Trigger Email] Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
