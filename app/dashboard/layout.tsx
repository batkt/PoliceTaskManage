import type React from 'react';
import type { Metadata } from 'next';
import { SidebarNavigation } from '@/components/sidebar-navigation';
import { Header } from '@/components/header';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Dashboard - Task Management System',
  description: 'Police Department Task Management System Dashboard',
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookie = await cookies();
  const accessToken = cookie.get('accessToken')?.value || '';

  if (!accessToken) {
    redirect('/');
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SidebarNavigation />
      <div className="flex-1 md:ml-64">
        <Header />
        <main className="flex-1 p-2 md:p-6">{children}</main>
      </div>
    </div>
  );
}
