import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

// 1. Manually load .env variables if not already set in process.env
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

const CATEGORIES = {
    INCOME: [
        { category: "salary", description: "Monthly Salary Deposit", min: 35000, max: 75000 },
        { category: "freelance", description: "Freelance Project Payment", min: 5000, max: 20000 },
        { category: "investments", description: "Stock Dividend / Mutual Fund", min: 1000, max: 8000 },
        { category: "other-income", description: "Cashback & Reimbursements", min: 200, max: 1500 },
    ],
    EXPENSE: [
        { category: "groceries", description: "Supermarket & Groceries", min: 400, max: 4500 },
        { category: "food", description: "Restaurant / Cafe / Swiggy", min: 150, max: 1800 },
        { category: "shopping", description: "Amazon / Retail Shopping", min: 500, max: 6000 },
        { category: "transportation", description: "Uber / Fuel / Metro", min: 100, max: 1500 },
        { category: "utilities", description: "Electricity / Water / Internet", min: 800, max: 3200 },
        { category: "entertainment", description: "Movies / Netflix / Events", min: 250, max: 1500 },
        { category: "housing", description: "Apartment Rent / Maintenance", min: 12000, max: 25000 },
        { category: "healthcare", description: "Pharmacy / Doctor Consultation", min: 300, max: 2500 },
    ],
};

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomDate(startDate, endDate) {
    const start = startDate.getTime();
    const end = endDate.getTime();
    return new Date(start + Math.random() * (end - start));
}

// 💡 Paste your clerkUserId here (or pass it via: npm run seed -- your_clerk_id)
const TARGET_CLERK_USER_ID = process.argv[2] || "";

async function main() {
    console.log("\n🌱 Starting transaction seed script for MoneyMap...\n");
    const startTime = performance.now();

    // 1. Find the target user
    let user = null;

    if (TARGET_CLERK_USER_ID) {
        user = await prisma.user.findUnique({
            where: { clerkUserId: TARGET_CLERK_USER_ID },
        });

        if (!user) {
            console.error(`❌ No user found matching clerkUserId: "${TARGET_CLERK_USER_ID}"\n`);
        }
    }

    if (!user) {
        // Fetch all users to display available options
        const allUsers = await prisma.user.findMany({
            include: { accounts: true },
        });

        if (allUsers.length === 0) {
            console.error("❌ No users found in database. Please log into the app once first!");
            process.exit(1);
        }

        if (TARGET_CLERK_USER_ID) {
            console.log("📋 Here are the available users in your database:");
            allUsers.forEach((u) => {
                console.log(`  - Name: ${u.name || "N/A"} | Email: ${u.email} | clerkUserId: ${u.clerkUserId}`);
                console.log(`    Accounts: ${u.accounts.map((a) => `${a.name} (${a.id})`).join(", ") || "None"}`);
            });
            process.exit(1);
        }

        // Default to first user if none specified
        user = allUsers[0];
    }

    console.log(`👤 Target User: ${user.name || user.email}`);
    console.log(`🔑 clerkUserId: ${user.clerkUserId}`);

    // 2. Find the target account (prefer default account)
    let account = await prisma.account.findFirst({
        where: { userId: user.id, isDefault: true },
    });

    if (!account) {
        account = await prisma.account.findFirst({
            where: { userId: user.id },
        });
    }

    if (!account) {
        console.error(`❌ No accounts found for user ${user.name || user.email}. Please create an account in the UI first!`);
        process.exit(1);
    }
    console.log(`💳 Target Account: ${account.name} (Current Balance: ₹${account.balance})`);

    // 3. Generate 500 transactions distributed over the last 6 months (180 days)
    const TOTAL_TRANSACTIONS = 500;
    const now = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setDate(now.getDate() - 180);

    const transactionsData = [];
    let netBalanceImpact = 0;

    for (let i = 0; i < TOTAL_TRANSACTIONS; i++) {
        // ~85% expenses, ~15% income for realistic personal finance tracking
        const isIncome = Math.random() < 0.15;
        const type = isIncome ? "INCOME" : "EXPENSE";
        const pool = isIncome ? CATEGORIES.INCOME : CATEGORIES.EXPENSE;
        const item = pool[Math.floor(Math.random() * pool.length)];

        const amount = getRandomNumber(item.min, item.max);
        const date = getRandomDate(sixMonthsAgo, now);

        if (type === "INCOME") {
            netBalanceImpact += amount;
        } else {
            netBalanceImpact -= amount;
        }

        transactionsData.push({
            type,
            amount,
            description: `${item.description} #${getRandomNumber(100, 999)}`,
            date,
            category: item.category,
            userId: user.id,
            accountId: account.id,
            status: "COMPLETED",
            isRecurring: false,
        });
    }

    // Sort chronologically
    transactionsData.sort((a, b) => a.date - b.date);

    console.log(`📦 Generated ${transactionsData.length} realistic transactions.`);
    console.log(`⏳ Inserting into PostgreSQL database in a single batch...`);

    // 4. Batch insert all 500 transactions at once
    const insertResult = await prisma.transaction.createMany({
        data: transactionsData,
    });

    // 5. Update the account balance so finances stay in sync
    const updatedAccount = await prisma.account.update({
        where: { id: account.id },
        data: {
            balance: {
                increment: netBalanceImpact,
            },
        },
    });

    const duration = Math.round(performance.now() - startTime);

    console.log("\n================ [SEEDING COMPLETED] ================");
    console.log(`✅ Records Inserted: ${insertResult.count} transactions`);
    console.log(`⏱️ Total Execution Time: ${duration} ms (${(duration / 1000).toFixed(2)}s)`);
    console.log(`⚡ Insert Throughput: ${Math.round((insertResult.count / (duration / 1000)))} records/sec`);
    console.log(`💰 Previous Balance: ₹${account.balance}`);
    console.log(`💰 Updated Balance: ₹${updatedAccount.balance}`);
    console.log("=====================================================\n");
}

main()
    .catch((e) => {
        console.error("❌ Seeding Error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
