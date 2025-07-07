"use client";

import { Button } from "@/components/ui/button";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@radix-ui/react-accordion";
import Image from "next/image";

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
                    Track your money.
                    <br />
                    Take control of your finances.
                </h1>
                <p className="text-lg md:text-2xl text-gray-500 mb-8 max-w-xl mx-auto">
                    Visualize your budgets, scan receipts with AI, and stay on
                    top of your savings goals — all from one smart dashboard.
                </p>
                <div className="flex flex-col md:flex-row gap-4 justify-center mb-2">
                    <Button
                        className="bg-[#26391B] text-white hover:bg-[#1b2713]"
                        size="lg"
                    >
                        Get Started
                    </Button>
                    <Button size="lg" variant="outline">
                        See Dashboard Demo
                    </Button>
                </div>
                <span className="text-xs text-gray-400 mt-2">
                    No credit card required
                </span>
            </main>

            {/* Image Banner */}
            <div className="w-full flex justify-center mt-8">
                <Image
                    src="/banner.jpg"
                    width={1440}
                    height={500}
                    alt="MoneyMap dashboard"
                    className="w-full max-w-6xl object-cover rounded-lg"
                    priority
                />
            </div>

            {/* Features Section */}
            <section className="w-full py-24 bg-white flex flex-col items-center">
                <div className="w-full max-w-6xl px-4">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
                        <h2 className="font-serif text-4xl md:text-5xl font-normal mb-2 text-left">
                            Everything you need
                            <br />
                            to master your money.
                        </h2>
                        <div className="flex flex-col items-center md:items-end">
                            <Button
                                className="bg-[#26391B] text-white hover:bg-[#1b2713] mb-2"
                                size="lg"
                            >
                                Start Tracking
                            </Button>
                            <span className="text-xs text-gray-400">
                                No credit card required
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-4">
                        <FeatureCard
                            title="AI-Powered Receipt Scanner"
                            desc="Scan your bills and let AI auto-fill transaction details for you."
                            img="/feature-scan.png"
                        />
                        <FeatureCard
                            title="Smart Budget Dashboard"
                            desc="Track expenses, balances, and health metrics — all in one view."
                            img="/feature-dashboard.png"
                        />
                        <FeatureCard
                            title="Recurring Transactions"
                            desc="Set up monthly expenses and incomes to auto-log every cycle."
                            img="/feature-recurring.png"
                        />
                    </div>
                </div>
            </section>

            {/* Quick Start Steps */}
            <section className="w-full py-24 bg-white flex flex-col items-center">
                <h2 className="font-serif text-4xl md:text-5xl text-center mb-4">
                    Start managing money in minutes.
                </h2>
                <p className="text-lg text-gray-400 text-center mb-12 max-w-2xl">
                    Just a few clicks and you're ready to track every rupee you
                    spend and save.
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

                <Button className="bg-[#26391B] text-white px-8 py-3 rounded hover:bg-[#1b2713] mb-2">
                    Start Now
                </Button>
                <span className="text-xs text-gray-400">
                    No credit card required
                </span>
            </section>

            {/* FAQ Section */}
            <section className="w-full py-24 bg-white flex flex-col items-center">
                <div className="w-full max-w-6xl px-4 grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div>
                        <h2 className="font-serif text-4xl md:text-5xl text-left">
                            Frequently asked
                            <br />
                            questions.
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
            <footer className="bg-gradient-to-r from-black to-neutral-900 text-white py-12 px-4 mt-16">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* About / Tagline */}
                    <div>
                        <span className="text-3xl font-semibold leading-tight">
                            MoneyMap
                            <br />
                            Finance made simple.
                        </span>
                        <p className="mt-4 text-sm text-gray-400">
                            Track, plan, and grow your money — powered by AI and
                            built for modern personal finance.
                        </p>
                    </div>

                    {/* Product Links */}
                    <div>
                        <div className="font-semibold mb-2">Product</div>
                        <ul className="space-y-2 text-sm text-gray-300">
                            <li>
                                <a
                                    href="/dashboard"
                                    className="hover:underline"
                                >
                                    Dashboard
                                </a>
                            </li>
                            <li>
                                <a href="/add" className="hover:underline">
                                    Add Transaction
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/analytics"
                                    className="hover:underline"
                                >
                                    Analytics
                                </a>
                            </li>
                            <li>
                                <a href="/account" className="hover:underline">
                                    My Accounts
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <div className="font-semibold mb-2">Resources</div>
                        <ul className="space-y-2 text-sm text-gray-300">
                            <li>
                                <a href="#" className="hover:underline">
                                    Help Center
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:underline">
                                    Privacy Policy
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:underline">
                                    Terms of Service
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:underline">
                                    Security
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter + Social */}
                    <div>
                        <div className="font-semibold mb-2">Stay Updated</div>
                        <p className="text-sm text-gray-400 mb-3">
                            Subscribe for product updates and finance tips.
                        </p>
                        <form className="flex flex-col sm:flex-row gap-2">
                            <input
                                type="email"
                                placeholder="you@example.com"
                                className="px-3 py-2 rounded-md text-black w-full sm:w-auto"
                            />
                            <button
                                type="submit"
                                className="bg-white text-black px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200"
                            >
                                Subscribe
                            </button>
                        </form>

                        <div className="mt-6">
                            <div className="font-semibold mb-2">Follow Us</div>
                            <div className="flex items-center gap-4 text-xl">
                                <a
                                    href="#"
                                    aria-label="Twitter"
                                    className="hover:text-gray-300"
                                >
                                    X
                                </a>
                                <a
                                    href="#"
                                    aria-label="Instagram"
                                    className="hover:text-gray-300"
                                >
                                    IG
                                </a>
                                <a
                                    href="#"
                                    aria-label="LinkedIn"
                                    className="hover:text-gray-300"
                                >
                                    in
                                </a>
                                <a
                                    href="#"
                                    aria-label="GitHub"
                                    className="hover:text-gray-300"
                                >
                                    GH
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer bottom line */}
                <div className="mt-12 border-t border-white/10 pt-6 text-sm text-gray-500 text-center">
                    © {new Date().getFullYear()} MoneyMap. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

const FeatureCard = ({ title, desc, img }) => (
    <div className="bg-gray-50 rounded-lg p-8 flex flex-col items-start">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-500 mb-4">{desc}</p>
        <Image
            src={img}
            alt={title}
            width={320}
            height={120}
            className="rounded-md object-cover"
        />
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
