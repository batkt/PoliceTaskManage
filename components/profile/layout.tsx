import { cn } from '@/lib/utils';
import Link from 'next/link';
import React, { ReactNode } from 'react';

const ProfileLayout = ({
  children,
  active = 'personal-information',
}: {
  children: ReactNode;
  active?: string;
}) => {
  const menuData = [
    {
      key: 'personal-information',
      name: 'Хувийн мэдээлэл',
      link: '/dashboard/profile/personal-information',
    },
    {
      key: 'change-password',
      name: 'Нууц үг солих',
      link: '/dashboard/profile/change-password',
    },
    {
      key: 'notification',
      name: 'Мэдэгдэл',
      link: '/dashboard/profile/notifications',
    },
    // {
    //   key: 'login-history',
    //   name: 'Нэвтэрсэн түүх',
    //   link: '/dashboard/profile/login-history',
    // },
  ];
  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <aside className="lg:w-1/5">
          <nav className="flex space-x-2 max-lg:flex-wrap lg:flex-col lg:space-x-0 lg:space-y-1">
            {menuData.map((menu) => {
              return (
                <Link
                  key={menu.key}
                  href={menu.link}
                  className={cn(
                    'inline-flex items-center rounded-md px-3 py-2 text-sm font-medium',
                    active === menu.key
                      ? 'bg-muted'
                      : 'hover:bg-muted hover:text-foreground'
                  )}
                >
                  {menu.name}
                </Link>
              );
            })}
          </nav>
        </aside>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
};

export default ProfileLayout;
