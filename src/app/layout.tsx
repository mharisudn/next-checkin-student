'use client';

import '@/src/styles/globals.css';
import { Inter } from 'next/font/google';
import { SessionProvider, useSession, signOut } from 'next-auth/react';
import { Toaster } from '@/src/components/ui/sonner';
import { Button } from '@/src/components/ui/button';
import { LogOut } from 'lucide-react';

const inter = Inter({ subsets: ['latin'] });

function SignOutHeader() {
  const { data: session, status } = useSession();

  if (status !== 'authenticated') return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="flex items-center gap-2 bg-white shadow px-4 py-2 rounded-md border">
        <span className="text-sm text-gray-700">{session.user?.name}</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => signOut({ callbackUrl: '/auth/signin' })}
          className="flex items-center gap-1"
        >
          <LogOut className="w-4 h-4" />
          Keluar
        </Button>
      </div>
    </div>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Sistem Check-In Pesantren</title>
        <meta
          name="description"
          content="Sistem manajemen check-in untuk santri baru pesantren"
        />
      </head>
      <body className={inter.className}>
        <SessionProvider>
          <SignOutHeader />
          {children}
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
