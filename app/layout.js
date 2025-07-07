import "./globals.css";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";

import { Poppins, Playfair_Display } from "next/font/google";
const poppins = Poppins({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    variable: "--font-poppins", // Use variable for CSS custom properties
});

const playfair = Playfair_Display({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800", "900"],
    variable: "--font-playfair", // Use variable for CSS custom properties
});

export const metadata = {
    title: "MoneyMap",
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
                </body>
            </html>
        </ClerkProvider>
    );
}
