import { db } from "@/lib/prisma";
import { startOfMonth, subMonths } from "date-fns";
import { DEBT_CATEGORY_IDS } from "@/data/categories";

// get financial health of user
export async function getFinancialHealth(userId, accountId) {
    const now = new Date();
    const start = startOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    // 🚀 FIRE ALL 6 QUERIES SIMULTANEOUSLY IN PARALLEL:
    const [
        incomeTx, expenseTx, debtTx,
        lastIncomeTx, lastExpenseTx, lastDebtTx
    ] = await Promise.all([
        // --- THIS MONTH ---
        db.transaction.aggregate({
            _sum: { amount: true },
            where: {
                userId,
                type: "INCOME",
                date: { gte: start },
                ...(accountId ? { accountId } : {}),
            },
        }),
        db.transaction.aggregate({
            _sum: { amount: true },
            where: {
                userId,
                type: "EXPENSE",
                date: { gte: start },
                ...(accountId ? { accountId } : {}),
            },
        }),
        db.transaction.aggregate({
            _sum: { amount: true },
            where: {
                userId,
                type: "EXPENSE",
                category: { in: DEBT_CATEGORY_IDS },
                date: { gte: start },
                ...(accountId ? { accountId } : {}),
            },
        }),
        // --- LAST MONTH ---
        db.transaction.aggregate({
            _sum: { amount: true },
            where: {
                userId,
                type: "INCOME",
                date: { gte: lastMonthStart, lt: start },
                ...(accountId ? { accountId } : {}),
            },
        }),
        db.transaction.aggregate({
            _sum: { amount: true },
            where: {
                userId,
                type: "EXPENSE",
                date: { gte: lastMonthStart, lt: start },
                ...(accountId ? { accountId } : {}),
            },
        }),
        db.transaction.aggregate({
            _sum: { amount: true },
            where: {
                userId,
                type: "EXPENSE",
                category: { in: DEBT_CATEGORY_IDS },
                date: { gte: lastMonthStart, lt: start },
                ...(accountId ? { accountId } : {}),
            },
        }),
    ]);
    
    const income = Number(incomeTx._sum.amount || 0);
    const expenses = Number(expenseTx._sum.amount || 0);
    const debt = Number(debtTx._sum.amount || 0);
    const savingsRate = income > 0 ? (income - expenses) / income : 0;
    const debtToIncome = income > 0 ? debt / income : 0;
    const score = calculateHealthScore(savingsRate, debtToIncome);
    const lastIncome = Number(lastIncomeTx._sum.amount || 0);
    const lastExpenses = Number(lastExpenseTx._sum.amount || 0);
    const lastDebt = Number(lastDebtTx._sum.amount || 0);
    const lastSavingsRate =
        lastIncome > 0 ? (lastIncome - lastExpenses) / lastIncome : 0;
    const lastDebtToIncome = lastIncome > 0 ? lastDebt / lastIncome : 0;
    const lastScore = calculateHealthScore(lastSavingsRate, lastDebtToIncome);
    const trend = score - lastScore;
    return {
        income,
        expenses,
        debt,
        savingsRate: Number(savingsRate.toFixed(2)),
        debtToIncome: Number(debtToIncome.toFixed(2)),
        score,
        trend,
    };
}

function calculateHealthScore(savingsRate, dti) {
    let score = 50;

    if (savingsRate >= 0.3) score += 20;
    if (savingsRate >= 0.5) score += 10;

    if (dti <= 0.36) score += 10;
    else if (dti <= 0.5) score += 5;
    else score -= 10;

    return Math.max(0, Math.min(100, Math.round(score)));
}
