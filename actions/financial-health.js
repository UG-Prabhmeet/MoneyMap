import { db } from "@/lib/prisma";
import { startOfMonth, subMonths } from "date-fns";
import { DEBT_CATEGORY_IDS } from "@/data/categories";

export async function getFinancialHealth(userId) {
    const now = new Date();
    const start = startOfMonth(now);

    // this month's stats
    const [incomeTx, expenseTx, debtTx] = await Promise.all([
        db.transaction.aggregate({
            _sum: { amount: true },
            where: {
                userId,
                type: "INCOME",
                date: { gte: start },
            },
        }),
        db.transaction.aggregate({
            _sum: { amount: true },
            where: {
                userId,
                type: "EXPENSE",
                date: { gte: start },
            },
        }),
        db.transaction.aggregate({
            _sum: { amount: true },
            where: {
                userId,
                type: "EXPENSE",
                category: { in: DEBT_CATEGORY_IDS },
                date: { gte: start },
            },
        }),
    ]);

    const income = Number(incomeTx._sum.amount || 0);
    const expenses = Number(expenseTx._sum.amount || 0);
    const debt = Number(debtTx._sum.amount || 0);

    const savingsRate = income > 0 ? (income - expenses) / income : 0;
    const debtToIncome = income > 0 ? debt / income : 0;

    const score = calculateHealthScore(savingsRate, debtToIncome);

    // last month's score for trend comparison
    const lastMonthStart = startOfMonth(subMonths(new Date(), 1));

    const [lastIncomeTx, lastExpenseTx, lastDebtTx] = await Promise.all([
        db.transaction.aggregate({
            _sum: { amount: true },
            where: {
                userId,
                type: "INCOME",
                date: { gte: lastMonthStart, lt: start },
            },
        }),
        db.transaction.aggregate({
            _sum: { amount: true },
            where: {
                userId,
                type: "EXPENSE",
                date: { gte: lastMonthStart, lt: start },
            },
        }),
        db.transaction.aggregate({
            _sum: { amount: true },
            where: {
                userId,
                type: "EXPENSE",
                category: { in: DEBT_CATEGORY_IDS },
                date: { gte: lastMonthStart, lt: start },
            },
        }),
    ]);

    const lastIncome = Number(lastIncomeTx._sum.amount || 0);
    const lastExpenses = Number(lastExpenseTx._sum.amount || 0);
    const lastDebt = Number(lastDebtTx._sum.amount || 0);

    const lastSavingsRate =
        lastIncome > 0 ? (lastIncome - lastExpenses) / lastIncome : 0;
    const lastDebtToIncome = lastIncome > 0 ? lastDebt / lastIncome : 0;

    const lastScore = calculateHealthScore(lastSavingsRate, lastDebtToIncome);

    // Trend = difference between this month and last
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
