"use client"; // needed for the SignIn and SignUp components from Clerk because they rely on client-side logic
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'; // Correct import
import { LayoutDashboard, PenBox } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import { Button } from './ui/button';

const Header = () => {
  return (
    <div className="fixed top-0 w-full h-16 bg-white/80 backdrop-blur-md z-50 border-b flex">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-around">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="Logo"
            width={225}
            height={60}
            className="h-14 w-auto object-contain" 
          />
        </Link>

        <div className="flex items-center space-x-4">
          <SignedIn>
            <Link
              href="/dashboard"
              className="text-gray-600 hover:text-blue-600 flex items-center gap-2"
            >
              <Button variant="outline">
                <LayoutDashboard size={18} />
                <span className="hidden md:inline">Dashboard</span>
              </Button>
            </Link>

            <Link href="/transaction/create">
              <Button className="flex items-center gap-2">
                <PenBox size={18} />
                <span className="hidden md:inline">Add Transaction</span>
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
    </div>
  );
};

export default Header;