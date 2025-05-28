import type React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';
import { AuthProvider } from '@/context/auth-context';
import { cookies } from 'next/headers';

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
  const cookie = await cookies();
  const accessToken = cookie.get('accessToken')?.value || '';

  if (!accessToken) {
  }
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider accessToken={accessToken}>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
