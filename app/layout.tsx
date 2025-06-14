import type React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';
import { AuthProvider } from '@/context/auth-context';
import { isAuthenticated } from '@/ssr/util';
import { Toaster } from '@/components/ui/toaster';
import SocketProvider from '@/context/socket-context';
import { SOCKET_URL } from '@/lib/config';
import { getLoggedUser } from '@/ssr/service/user';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Task Management System',
  description: 'Police Department Task Management System',
  generator: 'T',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = await isAuthenticated();
  const loggedUser = await getLoggedUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider
            isAuthenticated={!!token}
            accessToken={token}
            loggedUser={loggedUser}
          >
            <SocketProvider socketUrl={SOCKET_URL}>
              {children}
              <Toaster />
            </SocketProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
