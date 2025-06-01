import type React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';
import { AuthProvider } from '@/context/auth-context';
import UserProvider from '@/context/user-context';
import { isAuthenticated } from '@/ssr/util';
import { getAllUsers } from '@/ssr/service/user';

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
  const usersRes = await getAllUsers();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider isAuthenticated={!!token} accessToken={token}>
            <UserProvider data={usersRes.code === 200 ? usersRes.data : []}>
              {children}
            </UserProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
