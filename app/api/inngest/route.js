import { serve } from "inngest/next";

import { inngest } from "@/lib/inngest/client";
import {
    checkBudgetAlerts,
    generateMonthlyReports,
    processRecurringTransaction,
    triggerRecurringTransactions,
} from "@/lib/inngest/function";

// API endpoint that Inngest uses to "reach into" the app and trigger these functions
export const { GET, POST, PUT } = serve({
    client: inngest,
    functions: [
        processRecurringTransaction,   // Background task for recurring transactions
        triggerRecurringTransactions, // Daily cron to find due recurring transactions
        generateMonthlyReports,       // Monthly cron for email reports
        checkBudgetAlerts,            // 6-hour cron for spending alerts
    ],
});
