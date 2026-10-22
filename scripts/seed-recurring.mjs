import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

// Load .env variables
const envPath = path.resolve(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, "utf-8");
    envConfig.split("\n").forEach((line) => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith("#")) {
            const [key, ...values] = trimmed.split("=");
            const val = values.join("=").replace(/^["']|["']$/g, "");
            if (key && !process.env[key]) {
                process.env[key] = val;
            }
        }
    });
}

const prisma = new PrismaClient();
const TARGET_CLERK_USER_ID = process.argv[2] || "user_3KyHvuph8lt5ppczAy9QEmvgOTf";

async function main() {
    console.log("\n🌱 Seeding Due Recurring Transactions for Inngest testing...\n");

    const user = await prisma.user.findUnique({
        where: { clerkUserId: TARGET_CLERK_USER_ID },
    });

    if (!user) {
        console.error(`❌ User not found with clerkUserId: ${TARGET_CLERK_USER_ID}`);
        process.exit(1);
    }

    const account = await prisma.account.findFirst({
        where: { userId: user.id },
    });

    if (!account) {
        console.error(`❌ No account found for user: ${user.name}`);
        process.exit(1);
    }

    console.log(`👤 Target User: ${user.name} (${user.clerkUserId})`);
    console.log(`💳 Target Account: ${account.name} (Current Balance: ₹${account.balance})`);

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const recurringSeedData = [
        {
            description: "Netflix Premium Subscription",
            amount: 649,
            type: "EXPENSE",
            category: "entertainment",
            isRecurring: true,
            recurringInterval: "MONTHLY",
            nextRecurringDate: yesterday,
            lastProcessed: null,
            status: "COMPLETED",
            userId: user.id,
            accountId: account.id,
            date: yesterday,
        },
        {
            description: "Cult.fit Gym Membership",
            amount: 1500,
            type: "EXPENSE",
            category: "healthcare",
            isRecurring: true,
            recurringInterval: "MONTHLY",
            nextRecurringDate: yesterday,
            lastProcessed: null,
            status: "COMPLETED",
            userId: user.id,
            accountId: account.id,
            date: yesterday,
        },
        {
            description: "High-Speed Fiber Internet",
            amount: 999,
            type: "EXPENSE",
            category: "utilities",
            isRecurring: true,
            recurringInterval: "MONTHLY",
            nextRecurringDate: yesterday,
            lastProcessed: null,
            status: "COMPLETED",
            userId: user.id,
            accountId: account.id,
            date: yesterday,
        },
        {
            description: "Spotify Premium Family",
            amount: 179,
            type: "EXPENSE",
            category: "entertainment",
            isRecurring: true,
            recurringInterval: "MONTHLY",
            nextRecurringDate: yesterday,
            lastProcessed: null,
            status: "COMPLETED",
            userId: user.id,
            accountId: account.id,
            date: yesterday,
        },
        {
            description: "Apartment Society Maintenance",
            amount: 2500,
            type: "EXPENSE",
            category: "housing",
            isRecurring: true,
            recurringInterval: "MONTHLY",
            nextRecurringDate: yesterday,
            lastProcessed: null,
            status: "COMPLETED",
            userId: user.id,
            accountId: account.id,
            date: yesterday,
        },
    ];

    const result = await prisma.transaction.createMany({
        data: recurringSeedData,
    });

    console.log("\n================ [RECURRING SEED COMPLETED] ================");
    console.log(`✅ Seeded ${result.count} Due Recurring Transactions!`);
    console.log("📅 All 5 have nextRecurringDate set to yesterday (READY FOR INNGEST)");
    console.log("👉 Now go to Inngest Dev Server (http://localhost:8288)");
    console.log("👉 Trigger 'Trigger Recurring Transactions' to watch them process live!");
    console.log("============================================================\n");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
