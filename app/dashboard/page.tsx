import type { Metadata } from 'next';
import Dashboard from '@/components/dashboard';

export const metadata: Metadata = {
  title: 'Dashboard - Task Management System',
  description: 'Police Department Task Management System Dashboard',
};

export default async function DashboardPage() {
  // const res = await getTaskCounts();
  // const taskCounts = res.code === 200 ? res.data : null;

  return (
    <Dashboard />
  );
}
