'use client';

import Link from 'next/link';
import Logo from '@/components/logo';
import { Button } from './ui/button';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { getAuth, signOut } from 'firebase/auth';

export default function Header() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const auth = getAuth();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Logo />
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
             <Link
              href="/"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Home
            </Link>
            <Link
              href="/dashboard"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Dashboard
            </Link>
             <Link
              href="/chatbot"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Chatbot
            </Link>
             <Link
              href="/contact"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Contact Us
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          {isUserLoading ? (
            <Button variant="ghost" size="sm" disabled>
              Loading...
            </Button>
          ) : user ? (
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              Sign Out
            </Button>
          ) : (
            <Button size="sm" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
