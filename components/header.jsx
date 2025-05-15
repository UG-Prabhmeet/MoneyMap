import React from 'react';
import { Button } from './ui/button';
import { PenBox, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import { checkUser } from '@/lib/checkUser';

const Header = async () => {
	await checkUser(); // This runs server-side

	return (
		<div className='fixed top-0 w-full h-16 bg-white/80 backdrop-blur-md z-50 border-b flex'>
			<nav className='container mx-auto px-4 py-4 flex items-center justify-between'>
				{/* Logo */}
				<Link href='/'>
					<Image src='/logo.png' alt='Logo' width={225} height={60} className='h-14 w-auto object-contain' />
				</Link>

				{/* Nav Buttons */}
				<div className='flex items-center space-x-4'>
					<SignedIn>
						<Link href='/dashboard' className='flex items-center gap-2'>
							<Button variant='outline'>
								<LayoutDashboard size={18} />
								<span className='hidden md:inline'>Dashboard</span>
							</Button>
						</Link>

						<Link href='/transaction/create'>
							<Button className='flex items-center gap-2'>
								<PenBox size={18} />
								<span className='hidden md:inline'>Add Transaction</span>
							</Button>
						</Link>
					</SignedIn>

					<SignedOut>
						<SignInButton forceRedirectUrl='/dashboard'>
							<Button variant='outline'>Login</Button>
						</SignInButton>
					</SignedOut>

					<SignedIn>
						<UserButton
							appearance={{
								elements: {
									avatarBox: 'w-10 h-10',
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
