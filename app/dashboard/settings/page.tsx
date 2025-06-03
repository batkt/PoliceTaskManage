import type { Metadata } from 'next';
import { Separator } from '@/components/ui/separator';
import { ProfileForm } from '@/components/profile-form';

export const metadata: Metadata = {
  title: 'Settings - Task Management System',
  description: 'Police Department Task Management System Settings',
};

export default function SettingsPage() {
  return (
    <div className="space-y-6 p-4 pt-6 md:p-8">
      <div>
        <h3 className="text-lg font-medium">Тохиргоо</h3>
        <p className="text-sm text-muted-foreground">
          Хэрэглэгчийн профайл болон системийн тохиргоог өөрчлөх
        </p>
      </div>
      <Separator />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 lg:w-1/5">
          <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
            <a
              href="#"
              className="inline-flex items-center rounded-md bg-muted px-3 py-2 text-sm font-medium"
            >
              Профайл
            </a>
            <a
              href="#"
              className="inline-flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-muted hover:text-foreground"
            >
              Мэдэгдэл
            </a>
            <a
              href="#"
              className="inline-flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-muted hover:text-foreground"
            >
              Нууцлал
            </a>
            <a
              href="#"
              className="inline-flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-muted hover:text-foreground"
            >
              Хэл
            </a>
          </nav>
        </aside>
        {/* <div className="flex-1">
          <ProfileForm />
        </div> */}
      </div>
    </div>
  );
}
