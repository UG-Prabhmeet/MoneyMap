# MoneyMap — AI-Powered Personal Finance Tracker

A modern personal finance management platform combining Next.js 15, Google Gemini AI, and automated background jobs to help you track spending, scan receipts, and optimize your budget with ease.



---

## ✨ Key Features

- **🤖 AI Receipt Scanner**  
  Upload receipt images to automatically extract the amount, merchant, date, and category using Google Gemini AI.

- **💳 Multi-Account Management**  
  Create and manage multiple accounts (Current, Savings) with real-time balance tracking and transaction histories.

- **📊 Visual Analytics & Reports**  
  Interactive charts powered by Recharts for monthly cash flow, category breakdowns, and net worth trends.

- **🩺 Financial Health Score**  
  Automatic assessment (0–100) analyzing your savings rate and debt-to-income metrics over time.

- **🎯 Smart Budgeting & Alerts**  
  Set monthly budget limits with automated email notifications (via Resend) when spending approaches the threshold.

- **🔄 Automated Recurring Transactions**  
  Schedule repeating expenses or income (daily, weekly, monthly, yearly) processed reliably in the background via Inngest.

- **📄 PDF Export**  
  Download formatted account statements and transaction histories in PDF format.

- **🛡️ Security & Protection**  
  User authentication powered by Clerk and bot/rate-limit defense powered by Arcjet.

---

## 🛠️ Tech Stack

| Category | Technologies |
| :--- | :--- |
| **Framework & UI** | [Next.js 15](https://nextjs.org/), [React 19](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/), [Framer Motion](https://www.framer.com/motion/) |
| **Backend & ORM** | Next.js Server Actions, [Prisma ORM](https://www.prisma.io/), [PostgreSQL](https://www.postgresql.org/) |
| **AI Integration** | [Google Gemini AI](https://deepmind.google/technologies/gemini/) (`@google/generative-ai`) |
| **Auth & Security** | [Clerk](https://clerk.com/), [Arcjet](https://arcjet.com/) |
| **Automation & Email** | [Inngest](https://www.inngest.com/), [Resend](https://resend.com/), [React Email](https://react.email/) |
| **Data & Charts** | [Recharts](https://recharts.org/), [SWR](https://swr.vercel.app/), [Zod](https://zod.dev/), [React Hook Form](https://react-hook-form.com/) |

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/UG-Prabhmeet/MoneyMap.git
cd MoneyMap
npm install
```

### 2. Environment Variables

Create a `.env` file in the project root:

```env
# Database (PostgreSQL / Neon / Supabase)
DATABASE_URL="postgresql://user:password@localhost:5432/moneymap"
DIRECT_URL="postgresql://user:password@localhost:5432/moneymap"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# AI & Third-Party APIs
GEMINI_API_KEY="your_gemini_api_key"
RESEND_API_KEY="re_..."
ARCJET_KEY="ajkey_..."

# Inngest Background Jobs
INNGEST_EVENT_KEY="your_inngest_event_key"
INNGEST_SIGNING_KEY="signkey-prod-..."
```

### 3. Initialize Database

```bash
npx prisma db push
```

*(Optional) Seed sample data:*
```bash
node actions/seed.js
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

*(Optional) In a separate terminal, run Inngest dev server for background jobs:*
```bash
npx inngest-cli@latest dev
```



---

**Built with ⚡ by [Prabhmeet Singh](https://github.com/UG-Prabhmeet)**
