import type React from 'react';
import type { Metadata } from 'next';
import { SidebarNavigation } from '@/components/sidebar-navigation';
import { Header } from '@/components/header';
import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/ssr/util';
import { NotificationProvider } from '@/context/notification-context';
import UserProvider from '@/context/user-context';
import { getAllUsers } from '@/ssr/service/user';
import { getAllBranches } from '@/ssr/service/branch';
import TaskProvider from '@/context/task-context';

export const metadata: Metadata = {
  title: 'Dashboard - Task Management System',
  description: 'Police Department Task Management System Dashboard',
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = await isAuthenticated();
  if (!token) {
    redirect('/');
  }

  const usersRes = await getAllUsers();
  const branchRes = await getAllBranches();

  return (
    <TaskProvider>
      <NotificationProvider>
        <UserProvider
          data={usersRes.code === 200 ? usersRes.data : []}
          branchData={branchRes.code === 200 ? branchRes.data : []}
        >
          <div className="flex min-h-screen flex-col">
            <SidebarNavigation />
            <div className="flex-1 md:ml-64">
              <Header />
              <main className="flex-1 px-4 py-6 md:p-6">{children}</main>
            </div>
          </div>
        </UserProvider>
      </NotificationProvider>
    </TaskProvider>
  );
}
