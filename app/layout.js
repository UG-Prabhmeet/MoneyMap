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
  description: "Created By Prabhmeet Singh",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Header/>

        <main className="min-h-screen"> {children}</main>

        <footer className="bg-black text-white py-10 text-center relative">
          <div className="container mx-auto px-4">
            <h1 className="text-6xl font-extrabold uppercase tracking-wide">MoneyMap</h1>
            <p className="text-lg mt-2">©2025 All rights reserved.</p>
            <p className="text-lg">Site by Scout.</p>
            
            {/* for email support */}

            {/* <div className="mt-6 text-center">
              <p className="text-xl font-medium">Need help managing your finances?</p>
              <a href="mailto:support@financetracker.com" className="text-4xl font-bold underline">
                support@financetracker.com
              </a>
            </div> */}
            <div className="absolute top-4 right-4 text-2xl">
              ©
            </div>
          </div>
        </footer>

      </body>
    </html>
    </ClerkProvider>
  );
}
