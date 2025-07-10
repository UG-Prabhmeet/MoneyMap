import Header from "@/components/header";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/next";

import { Poppins, Playfair_Display } from "next/font/google";
const poppins = Poppins({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    variable: "--font-poppins",
});

const playfair = Playfair_Display({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800", "900"],
    variable: "--font-playfair",
});

export const metadata = {
    title: "MoneyMap | Finance Tracker",
    description:
        "MoneyMap is a modern finance tracker that helps you manage expenses, track budgets, and visualize your financial health.",
};

export default function RootLayout({ children }) {
    return (
        <ClerkProvider>
            <html
                lang="en"
                className={`${poppins.variable} ${playfair.variable}`}
            >
                <body
                    className={`antialiased ${poppins.variable} ${playfair.variable}`}
                >
                    <Header />
                    <main className="min-h-screen mt-20">{children}</main>
                    <Analytics />
                </body>
            </html>
        </ClerkProvider>
    );
}
