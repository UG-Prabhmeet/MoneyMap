"use client";

import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/nextjs";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@radix-ui/react-accordion";
import Image from "next/image";
import Link from "next/link";
import AnimatedText from "./animatedText";

const HeroSectionPage = () => {
    const faqs = [
        {
            question: "What is MoneyMap?",
            answer: "MoneyMap is your personal finance assistant — helping you track expenses, monitor budgets, analyze cash flow, and achieve savings goals. Built with privacy-first principles and powerful AI tools.",
        },
        {
            question: "Can I track multiple bank accounts?",
            answer: "Yes! You can create and manage multiple financial accounts and switch between them seamlessly.",
        },
        {
            question: "How does the AI receipt scanner work?",
            answer: "Upload your receipt and let Google Gemini-powered AI extract transaction data automatically — no typing needed!",
        },
        {
            question: "What is Financial Health Score?",
            answer: "MoneyMap calculates your score based on your savings rate, debt-to-income ratio, expenses, and more — giving you insights on where you stand.",
        },
        {
            question: "Can I track recurring bills and income?",
            answer: "Absolutely. MoneyMap supports recurring transactions, so your rent, subscriptions, or monthly salary are always recorded.",
        },
    ];

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Hero */}
            <main className="flex flex-col items-center justify-center text-center px-4 pt-20 pb-0">
                <h1 className="font-serif text-4xl md:text-6xl mb-6">
                    <AnimatedText text="Track your money." />
                    <br />
                    <AnimatedText text="Take control of your finances." />
                </h1>
                <p className="text-lg md:text-2xl text-gray-500 mb-8 max-w-xl mx-auto">
                    Visualize your budgets, scan receipts with AI, and stay on
                    top of your savings goals — all from one smart dashboard.
                </p>
                <div className="flex flex-col md:flex-row gap-4 justify-center mb-2">
                    <SignInButton forceRedirectUrl="/dashboard">
                        <Button
                            className="bg-[#26391B] text-white hover:bg-[#1b2713]"
                            size="lg"
                        >
                            Get Started
                        </Button>
                    </SignInButton>
                    <Button size="lg" variant="outline" asChild>
                        <Link href="#features">Explore Features</Link>
                    </Button>
                </div>
            </main>
            {/* Image Banner */}
            <div className="w-full flex justify-center mt-8 px-4">
                <div className="w-full max-w-6xl relative aspect-[3/1] rounded-lg overflow-hidden">
                    <Image
                        src="/banner.jpg"
                        alt="MoneyMap dashboard"
                        fill
                        className="object-cover rounded-lg"
                        priority
                    />
                </div>
            </div>

            {/* Quick Start Steps */}
            <section className="w-full py-24 bg-white flex flex-col items-center">
                <h2 className="font-serif text-4xl md:text-5xl text-center mb-4">
                    <AnimatedText text="Start managing money in minutes." />
                </h2>
                <p className="text-lg text-gray-400 text-center mb-12 max-w-2xl">
                    <AnimatedText
                        text="Just a few clicks and you're ready to track every rupee you
                    spend and save."
                    />
                </p>

                <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-4 gap-6 px-4 mb-10">
                    <QuickStep
                        time="00:00"
                        title="Create an account"
                        desc="Sign up securely with Clerk."
                    />
                    <QuickStep
                        time="00:14"
                        title="Add your first account"
                        desc="Set up savings or checking accounts."
                    />
                    <QuickStep
                        time="00:42"
                        title="Log a transaction"
                        desc="Scan a receipt or add manually."
                    />
                    <QuickStep
                        time="01:26"
                        title="Visualize your finances"
                        desc="See trends, budgets, and insights."
                    />
                </div>
                <SignInButton forceRedirectUrl="/dashboard">
                    <Button className="bg-[#26391B] text-white px-8 py-3 rounded hover:bg-[#1b2713] mb-2">
                        Start Now
                    </Button>
                </SignInButton>
            </section>
            {/* Features Section */}
            <section
                id="features"
                className="w-full py-24 bg-white flex flex-col items-center"
            >
                <div className="w-full max-w-6xl px-4">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
                        <h2 className="font-serif text-4xl md:text-5xl font-normal mb-2 text-left">
                            <AnimatedText text="Everything you need" />
                            <br />
                            <AnimatedText text="to master your money." />
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-4">
                        <FeatureCard
                            title="Secure Authentication with Clerk"
                            desc="Sign in with confidence using Clerk's secure auth — privacy-first and reliable."
                            img="/clerk_auth.png"
                        />
                        <FeatureCard
                            title="Smart Budget Dashboard"
                            desc="Track expenses, balances, and your financial health — all in one intelligent view."
                            img="/dashboard_view.png"
                        />
                        <FeatureCard
                            title="AI-Powered Receipt Scanner"
                            desc="Snap a photo of your bill and let Google Gemini auto-fill your transaction data."
                            img="/add_transaction_view.png"
                        />
                        <FeatureCard
                            title="Detailed Transaction Reports"
                            desc="Export transactions as CSV or PDF and stay audit-ready at any time."
                            img="/transactions_view.png"
                        />
                        <FeatureCard
                            title="Insightful Analytics & Visuals"
                            desc="Understand your spending patterns with pie charts, trends, and financial health cards — designed to guide better decisions."
                            img="/analytics_view.png"
                        />
                        <FeatureCard
                            title="Accounts Overview"
                            desc="View and manage all your accounts in one unified place — always up to date."
                            img="/account_view.png"
                        />
                        <FeatureCard
                            title="Bot Detection & Rate Limiting"
                            desc="Arcjet ensures only humans interact with your data — protecting your app from abuse."
                        />
                        <FeatureCard
                            title="Email Reports with Resend"
                            desc="Receive smart financial reports directly in your inbox — powered by Resend."
                        />
                        <FeatureCard
                            title="Recurring Transactions"
                            desc="Automate your monthly bills or income to be logged without manual effort."
                        />
                    </div>
                </div>
            </section>
            {/* FAQ Section */}
            <section className="w-full py-24 bg-white flex flex-col items-center">
                <div className="w-full max-w-6xl px-4 grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div>
                        <h2 className="font-serif text-4xl md:text-5xl text-left">
                            <AnimatedText text="Frequently asked" />
                            <br />
                            <AnimatedText text="questions." />
                        </h2>
                    </div>
                    <div>
                        <Accordion
                            type="single"
                            collapsible
                            defaultValue="item-0"
                            className="flex flex-col gap-2"
                        >
                            {faqs.map((faq, idx) => (
                                <AccordionItem
                                    key={faq.question}
                                    value={`item-${idx}`}
                                    className="bg-gray-50 rounded mb-2"
                                >
                                    <AccordionTrigger className="px-6 py-4 text-left font-medium text-base">
                                        {faq.question}
                                    </AccordionTrigger>
                                    <AccordionContent className="px-6 pb-4 text-gray-500 text-base">
                                        {faq.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </div>
            </section>
            <footer className="bg-gradient-to-r from-black to-neutral-900 text-white py-12 px-6 mt-16">
                <div className="max-w-6xl mx-auto grid-cols-1">
                    {/* Left: Branding & Tagline */}
                    <div>
                        <h2 className="text-3xl font-semibold leading-tight">
                            MoneyMap
                            <br />
                            <span className="text-xl font-normal text-gray-300">
                                Finance made simple.
                            </span>
                        </h2>
                        <p className="mt-4 text-sm text-gray-400 max-w-md pb-4">
                            Track, plan, and grow your money — powered by AI and
                            built for modern personal finance.
                        </p>
                        <Link
                            href="https://linkedin.com/in/prabhmeet-singh-742189319"
                            aria-label="LinkedIn"
                            className="hover:text-gray-300 transition-colors"
                            target="_blank" // optional, opens in new tab
                            rel="noopener noreferrer" // for security
                        >
                            in
                        </Link>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 border-t border-white/10 pt-6 text-sm text-gray-500 text-center">
                    © {2025} MoneyMap. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

const FeatureCard = ({ title, desc, img }) => (
    <div className="bg-gray-50 rounded-lg p-8 flex flex-col items-start">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-500 mb-4">{desc}</p>
        {img && (
            <Image
                src={img}
                alt={title}
                width={320}
                height={120}
                className="rounded-md object-cover"
            />
        )}
    </div>
);

const QuickStep = ({ time, title, desc }) => (
    <div className="bg-gray-50 rounded-lg p-8 flex flex-col h-full">
        <div className="text-4xl text-gray-300 font-serif mb-6">{time}</div>
        <div className="font-semibold mb-1">{title}</div>
        <div className="text-gray-400 text-base">{desc}</div>
    </div>
);

export default HeroSectionPage;
