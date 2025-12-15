import type React from 'react';
import type { Metadata } from 'next';
import { SidebarNavigation } from '@/components/sidebar-navigation';
import { Header } from '@/components/header';
import { NotificationProvider } from '@/context/notification-context';
import UserProvider from '@/context/user-context';

export const metadata: Metadata = {
  title: 'Dashboard - Task Management System',
  description: 'Police Department Task Management System Dashboard',
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <NotificationProvider>
        <div className="flex min-h-screen flex-col">
          <SidebarNavigation />
          <div className="flex-1 md:ml-64">
            <Header />
            <main className="flex-1 px-4 py-6 md:p-6">{children}</main>
          </div>
        </div>
      </NotificationProvider>
    </UserProvider>
  );
}
