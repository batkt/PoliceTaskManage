import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Profile - Task Management System',
  description: 'Police Department Task Management System Settings',
};

export default function SettingsPage() {
  redirect('/dashboard/profile/personal-information');
}
