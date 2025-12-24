# 💰 MoneyMap - AI-Powered Finance Tracker

> A sophisticated personal finance management platform that combines modern web technologies with AI-powered insights to help you take control of your financial future.

![MoneyMap Banner](https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=1200)

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748)](https://www.prisma.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6)](https://www.typescriptlang.org/)

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#️-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Features Deep Dive](#-features-deep-dive)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

---

## 🎯 Overview

**MoneyMap** is a full-stack financial management application built with Next.js 15 that empowers users to track income, expenses, and investments across multiple accounts. With AI-powered receipt scanning via Google Gemini, automated budget alerts, and comprehensive analytics dashboards, MoneyMap transforms raw financial data into actionable insights.

### Why MoneyMap?

- 🧠 **AI-First Approach**: Leverage Gemini AI to extract transaction data from receipt images automatically
- 📈 **Data-Driven Insights**: Visualize spending patterns, net worth trends, and cash flow with interactive charts
- 🔄 **Automation Built-In**: Set up recurring transactions and receive intelligent budget notifications
- 🔐 **Security-Focused**: Enterprise-grade authentication with Clerk and rate limiting via Arcjet
- 🎨 **Modern UI/UX**: Beautiful, responsive interface built with Shadcn UI and Tailwind CSS

---

## 🌟 Key Features

### 💳 Multi-Account Management
- Support for multiple bank accounts (Current & Savings)
- Set default accounts for quick transactions
- Real-time balance tracking across all accounts
- Account-specific transaction history

### 🤖 AI Receipt Scanning
- Upload receipt images and extract data automatically using Gemini AI
- Automatically detects: amount, date, merchant, description, and category
- Supports multiple image formats (JPEG, PNG, etc.)
- Retry logic with exponential backoff for reliability

### 📊 Advanced Analytics Dashboard
- **Monthly Spending Trends**: Category-wise breakdown over time
- **Net Worth History**: Track your wealth accumulation
- **Cash Flow Analysis**: Visualize income vs. expenses
- **Budget Insights**: Compare actual spending against budgets
- **Financial Health Score**: Automated scoring based on savings rate and debt-to-income ratio

### 📅 Recurring Transactions
- Set up automatic recurring expenses (subscriptions, rent, etc.)
- Flexible intervals: Daily, Weekly, Monthly, Yearly
- Background job processing via Inngest
- Automatic balance updates

### 🎯 Smart Budgeting
- Set monthly spending limits
- Automated email alerts when approaching budget thresholds
- Real-time budget tracking on dashboard
- Category-level budget insights

### 📄 Export & Reporting
- Generate PDF reports for transactions
- Professional formatting with jsPDF
- Exportable account statements

### 🔒 Security Features
- **Authentication**: Clerk-based secure sign-in/sign-up
- **Rate Limiting**: Arcjet protection against abuse
- **Database Security**: Prisma ORM with parameterized queries
- **Middleware Protection**: Route-level authentication checks

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Component Library**: [Shadcn UI](https://ui.shadcn.com/) (Radix UI primitives)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) validation
- **Charts**: [Recharts](https://recharts.org/)

### Backend & Database
- **ORM**: [Prisma](https://www.prisma.io/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **Server Actions**: Next.js 15 Server Actions for API logic
- **Caching**: Next.js built-in cache with `revalidatePath`

### AI & Integrations
- **AI Model**: [Google Gemini 2.5 Flash](https://deepmind.google/technologies/gemini/)
- **Authentication**: [Clerk](https://clerk.com/)
- **Job Scheduling**: [Inngest](https://www.inngest.com/)
- **Email Service**: [Resend](https://resend.com/) + [React Email](https://react.email/)
- **Security**: [Arcjet](https://arcjet.com/)
- **PDF Generation**: [jsPDF](https://github.com/parallax/jsPDF) + jsPDF-AutoTable

### State Management & Data Fetching
- **Client State**: [SWR](https://swr.vercel.app/) for optimistic UI updates
- **Server State**: React Server Components + Server Actions

---

## 🏗 Architecture

MoneyMap follows a modern **server-first architecture** with Next.js 15:

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│  (React Components, SWR, Forms, Charts, UI Components)      │
└─────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Server Actions Layer                    │
│  (actions/*.js - Business logic, Data validation)            │
└─────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       Middleware Layer                       │
│     (Authentication, Rate Limiting, Route Protection)        │
└─────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Data Access Layer                       │
│            (Prisma ORM ↔ PostgreSQL Database)                │
└─────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    External Services                         │
│  (Clerk, Gemini AI, Resend, Inngest, Arcjet)                │
└─────────────────────────────────────────────────────────────┘
```

### Key Architectural Decisions

1. **Server Actions over API Routes**: Using Next.js 15 Server Actions for type-safe, direct database access
2. **Colocation**: Actions, components, and routes are organized by feature for better maintainability
3. **Optimistic Updates**: SWR provides instant UI feedback while server mutations complete
4. **Background Jobs**: Inngest handles recurring transaction processing and email notifications
5. **Progressive Enhancement**: Core features work without JavaScript, enhanced with client-side interactivity

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js** 18.x or later ([Download](https://nodejs.org/))
- **PostgreSQL** database (Local, [Supabase](https://supabase.com/), or [Neon](https://neon.tech/))
- **npm** or **yarn** package manager

### Required API Keys

You'll need accounts and API keys from:

1. **Clerk** - Authentication ([Sign up](https://clerk.com/))
2. **Google AI Studio** - Gemini API ([Get API Key](https://makersuite.google.com/app/apikey))
3. **Resend** - Email delivery ([Sign up](https://resend.com/))
4. **Arcjet** - Security & rate limiting ([Sign up](https://arcjet.com/))
5. **Inngest** - Background jobs ([Sign up](https://www.inngest.com/))

---

### Installation Steps

#### 1. Clone the Repository

```bash
git clone https://github.com/prabhmeetkira/moneymap.git
cd moneymap
```

#### 2. Install Dependencies

```bash
npm install
```

#### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Database Configuration
DATABASE_URL="postgresql://user:password@localhost:5432/moneymap"
DIRECT_URL="postgresql://user:password@localhost:5432/moneymap"  # Optional, for Prisma migrations

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# AI & Cloud Services
GEMINI_API_KEY="your_gemini_api_key"
RESEND_API_KEY="re_..."
ARCJET_KEY="ajkey_..."

# Inngest (Background Jobs)
INNGEST_EVENT_KEY="your_inngest_event_key"
INNGEST_SIGNING_KEY="signkey-prod-..."
```

#### 4. Set Up Database

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Open Prisma Studio to view database
npx prisma studio
```

#### 5. Seed Sample Data (Optional)

```bash
node actions/seed.js
```

This will create sample accounts, transactions, and budgets for testing.

#### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

#### 7. Start Background Jobs (Optional)

In a separate terminal:

```bash
npx inngest-cli@latest dev
```

This enables recurring transaction processing and budget alert emails.

#### 8. Email Template Development (Optional)

```bash
npm run email
```

Opens React Email development server at [http://localhost:3001](http://localhost:3001).

---

## 📂 Project Structure

```
financetrackerprabhmeet/
├── actions/                    # Server Actions (business logic)
│   ├── account.js             # Account CRUD operations
│   ├── analytics.js           # Analytics & reporting functions
│   ├── budget.js              # Budget management
│   ├── dashboard.js           # Dashboard data aggregation
│   ├── export.js              # PDF export functionality
│   ├── financial-health.js    # Health score calculation
│   ├── seed.js                # Database seeding script
│   ├── send-email.js          # Email sending wrapper
│   └── transaction.js         # Transaction CRUD + AI scanning
│
├── app/                        # Next.js App Router
│   ├── (auth)/                # Authentication routes
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── (main)/                # Protected app routes
│   │   ├── dashboard/         # Main dashboard
│   │   ├── accounts/          # Account listing
│   │   ├── account/[id]/      # Single account view
│   │   ├── transactions/      # Transaction listing
│   │   ├── transaction/[id]/  # Transaction details/edit
│   │   ├── analytics/         # Analytics dashboard
│   │   └── settings/          # User settings
│   ├── api/                   # API routes (Inngest, webhooks)
│   ├── layout.js              # Root layout
│   └── page.js                # Landing page
│
├── components/                 # React components
│   ├── ui/                    # Shadcn UI components
│   ├── app-sidebar.jsx        # App navigation sidebar
│   ├── header.jsx             # Header with user menu
│   ├── hero.jsx               # Landing page hero
│   └── create-account-drawer.jsx
│
├── lib/                        # Utility functions
│   ├── prisma.js              # Prisma client singleton
│   ├── arcjet.js              # Arcjet configuration
│   ├── checkUser.js           # User sync with database
│   ├── getCurrentUser.js      # Get current user helper
│   ├── utils.js               # General utilities
│   └── inngest/               # Inngest functions
│
├── data/                       # Static data
│   └── categories.js          # Transaction categories
│
├── emails/                     # React Email templates
│   └── budget-alert.jsx       # Budget alert email
│
├── prisma/
│   └── schema.prisma          # Database schema
│
├── middleware.js               # Auth & rate limiting middleware
├── next.config.mjs
├── tailwind.config.js
└── package.json
```

---

## 🎨 Features Deep Dive

### 1. AI Receipt Scanning

The receipt scanning feature uses **Google Gemini 2.5 Flash** to extract structured data from images:

**How it works:**
1. User uploads receipt image via file input
2. Image converted to base64 and sent to Gemini API
3. AI extracts: amount, date, merchant, description, category
4. Data auto-fills the transaction form
5. User can review/edit before saving

**Code snippet** (`actions/transaction.js`):
```javascript
export async function scanReceipt(file) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const arrayBuffer = await file.arrayBuffer();
  const base64String = Buffer.from(arrayBuffer).toString("base64");
  
  const result = await model.generateContent([
    { inlineData: { data: base64String, mimeType: file.type } },
    { text: promptTemplate }
  ]);
  
  return parsedData;
}
```

**Features:**
- Retry logic with exponential backoff
- Handles API rate limits gracefully
- Returns structured JSON data

---

### 2. Financial Health Score

MoneyMap calculates a **Financial Health Score (0-100)** based on:

**Metrics:**
- **Savings Rate**: `(Income - Expenses) / Income`
- **Debt-to-Income Ratio**: `Debt Payments / Income`

**Scoring Algorithm:**
```javascript
Base Score: 50
+ Savings Rate >= 30%: +20 points
+ Savings Rate >= 50%: +10 points
+ DTI <= 36%: +10 points
+ DTI <= 50%: +5 points
- DTI > 50%: -10 points
```

**Trend Analysis:**
- Compares current month vs. previous month
- Shows trend direction (improving/declining)

---

### 3. Recurring Transactions

Automated transaction processing powered by **Inngest**:

**Flow:**
1. User marks transaction as recurring with interval (Daily/Weekly/Monthly/Yearly)
2. System calculates `nextRecurringDate`
3. Inngest cron job checks for due recurring transactions
4. Creates new transactions automatically
5. Updates account balances
6. Sends confirmation emails

**Supported Intervals:**
- Daily
- Weekly
- Monthly
- Yearly

---

### 4. Budget Alerts

Automated email notifications when spending approaches limits:

**Trigger Logic:**
1. User sets monthly budget amount
2. Background job runs daily
3. Calculates current month spending
4. If spending > 80% of budget → sends alert email
5. Tracks last alert sent to avoid spam

**Email powered by:**
- **Resend** for delivery
- **React Email** for templates
- **Inngest** for scheduling

---

## 📖 Deployment

### Deploy to Vercel (Recommended)

MoneyMap is optimized for **Vercel** deployment:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/prabhmeetkira/moneymap)

**Steps:**
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on every push to `main`

**Environment Variables to Add:**
- All variables from `.env` file
- Ensure `DATABASE_URL` points to production database
- Use production API keys for Clerk, Gemini, Resend, etc.

### Database Hosting

**Recommended PostgreSQL hosts:**
- [Neon](https://neon.tech/) - Serverless Postgres (Free tier available)
- [Supabase](https://supabase.com/) - Open-source Firebase alternative
- [Railway](https://railway.app/) - Simple deployment platform
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres) - Native Vercel integration

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow existing code style (use Prettier/ESLint)
- Write meaningful commit messages
- Test changes locally before submitting PR
- Update documentation if adding new features

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) team for the amazing framework
- [Shadcn](https://ui.shadcn.com/) for beautiful UI components
- [Clerk](https://clerk.com/) for seamless authentication
- [Google](https://deepmind.google/technologies/gemini/) for Gemini AI
- [Vercel](https://vercel.com/) for hosting and deployment

---

## 📧 Contact & Support

**Built with ❤️ by [Prabhmeet Kira](https://github.com/prabhmeetkira)**

- 🐛 **Report Bugs**: [Open an issue](https://github.com/prabhmeetkira/moneymap/issues)
- 💡 **Feature Requests**: [Submit an idea](https://github.com/prabhmeetkira/moneymap/discussions)
- 📧 **Email**: your-email@example.com

---

<p align="center">
  <strong>⭐️ Star this repo if you find it helpful!</strong>
</p>
