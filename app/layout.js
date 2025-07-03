import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata = {
    title: "MoneyMap",
    description:
        "MoneyMap is a modern finance tracker that helps you manage expenses, track budgets, and visualize your financial health.",
};

export default function RootLayout({ children }) {
    return (
        <ClerkProvider>
            <html lang="en">
                <body
                    className={`${geistSans.variable} ${geistMono.variable} antialiased`}
                >
                    <Header />
                    <main className="min-h-screen mt-20"> {children}</main>
                </body>
            </html>
        </ClerkProvider>
    );
}
