import React from "react";
import { Button } from "./ui/button";
import { PenBox, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";

const Header = () => {
    return (
        <header className="fixed top-0 w-full z-50 bg-background/70 backdrop-blur border-b border-border transition-colors duration-300">
            <nav className="container mx-auto flex items-center justify-between py-2 px-2">
                {/* Logo */}
                <div className="flex items-center">
                    <Link href="/">
                        <span className="flex items-center gap-2">
                            <div className="block dark:hidden">
                                <Image
                                    src="/light_logo.png"
                                    alt="MoneyMap Logo Light"
                                    width={220}
                                    height={66}
                                    className="h-16 w-auto object-contain"
                                    priority
                                />
                            </div>
                        </span>
                    </Link>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-4">
                    <SignedIn>
                        <Link href="/dashboard">
                            <Button
                                variant="outline"
                                className="flex items-center gap-2"
                            >
                                <LayoutDashboard size={18} />
                                <span className="hidden md:inline">
                                    Dashboard
                                </span>
                            </Button>
                        </Link>
                        <Link href="/transaction/create">
                            <Button className="flex items-center gap-2">
                                <PenBox size={18} />
                                <span className="hidden md:inline">
                                    Add Transaction
                                </span>
                            </Button>
                        </Link>
                    </SignedIn>

                    <SignedOut>
                        <SignInButton forceRedirectUrl="/dashboard">
                            <Button variant="outline">Login</Button>
                        </SignInButton>
                    </SignedOut>

                    <SignedIn>
                        <UserButton
                            appearance={{
                                elements: {
                                    avatarBox: "w-10 h-10",
                                },
                            }}
                        />
                    </SignedIn>
                </div>
            </nav>
        </header>
    );
};

export default Header;
