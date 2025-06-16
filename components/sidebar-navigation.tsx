'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  BarChart3,
  ClipboardList,
  FileText,
  Home,
  LogOut,
  Menu,
  Settings,
  Shield,
  Users,
  X,
  Briefcase,
  CheckSquare,
  ClipboardType,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useAuth } from '@/context/auth-context';
import { logoutAction } from '@/ssr/actions/auth';

interface NavItem {
  title: string;
  allowRoles?: string[];
  href: string;
  icon: React.ReactNode;
  submenu?: { title: string; href: string }[];
}

export function SidebarNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { authUser } = useAuth();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');

  const toggleSubmenu = (title: string) => {
    setOpenSubmenu(openSubmenu === title ? null : title);
  };

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobile && isOpen) {
        const sidebar = document.getElementById('sidebar-navigation');
        const toggleButton = document.getElementById('sidebar-toggle');

        if (
          sidebar &&
          !sidebar.contains(event.target as Node) &&
          toggleButton &&
          !toggleButton.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, isOpen]);

  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [pathname, isMobile]);

  const logout = async () => {
    const res = await logoutAction();
    if (res) {
      router.replace('/');
    }
  };

  const navItems: NavItem[] = [
    {
      title: 'Хянах самбар',
      href: '/dashboard',
      icon: <Home className="h-5 w-5" />,
    },
    {
      title: 'Ажлын жагсаалт',
      allowRoles: ['super-admin', 'admin'],
      href: '/dashboard/tasks',
      icon: <ClipboardList className="h-5 w-5" />,
      // submenu: [
      //   { title: "Бүх даалгавар", href: "/dashboard/tasks" },
      //   { title: "Шинэ даалгавар", href: "/dashboard/tasks/new" },
      //   { title: "Даалгаврын тайлан", href: "/dashboard/tasks/reports" },
      // ],
    },
    {
      title: 'Миний даалгавар',
      href: '/dashboard/my-tasks',
      icon: <CheckSquare className="h-5 w-5" />,
      // submenu: [
      //   { title: "Бүгд", href: "/dashboard/my-tasks" },
      //   { title: "Эхлээгүй", href: "/dashboard/my-tasks?status=planned" },
      //   { title: "Хуваарилагдсан", href: "/dashboard/my-tasks?status=assigned" },
      //   { title: "Шалгах", href: "/dashboard/my-tasks?status=checking" },
      //   { title: "Дууссан", href: "/dashboard/my-tasks?status=completed" },
      // ],
    },
    // {
    //   title: "Тайлангууд",
    //   href: "/dashboard/reports",
    //   icon: <FileText className="h-5 w-5" />,
    //   submenu: [
    //     { title: "Сарын тайлан", href: "/dashboard/reports?type=monthly" },
    //     { title: "Улирлын тайлан", href: "/dashboard/reports?type=quarterly" },
    //     { title: "Жилийн тайлан", href: "/dashboard/reports?type=yearly" },
    //   ],
    // },
    // {
    //   title: "Дэд удирдлага",
    //   href: "/dashboard/deputies",
    //   icon: <Users className="h-5 w-5" />,
    // },
    {
      title: 'Алба хаагчид',
      href: '/dashboard/officers',
      icon: <Shield className="h-5 w-5" />,
      // submenu: [
      //   { title: "Бүх ажилтан", href: "/dashboard/officers" },
      //   { title: "Шинэ ажилтан", href: "/dashboard/officers/new" },
      //   { title: "Ажилтны тайлан", href: "/dashboard/officers/reports" },
      // ],
    },
    // {
    //   title: "Ажлын хяналт",
    //   href: "/dashboard/jobs",
    //   icon: <Briefcase className="h-5 w-5" />,
    //   submenu: [
    //     { title: "Эхлээгүй", href: "/dashboard/jobs?status=planned" },
    //     { title: "Хуваарилагдсан", href: "/dashboard/jobs?status=assigned" },
    //     { title: "Шалгах", href: "/dashboard/jobs?status=checking" },
    //     { title: "Дууссан", href: "/dashboard/jobs?status=completed" },
    //   ],
    // },
    // {
    //   title: "Статистик",
    //   href: "/dashboard/statistics",
    //   icon: <BarChart3 className="h-5 w-5" />,
    // },
    // {
    //   title: "Тохиргоо",
    //   href: "/dashboard/settings",
    //   icon: <Settings className="h-5 w-5" />,
    // },
    {
      title: 'Даалгаврын төрөл',
      href: '/dashboard/task-type',
      allowRoles: ['super-admin'],
      icon: <ClipboardType className="!size-5" />,
      submenu: [
        {
          title: 'Шинээр үүсгэх',
          href: '/dashboard/task-type/create',
        },
        { title: 'Жагсаалт', href: '/dashboard/task-type' },
      ],
    },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <Button
        id="sidebar-toggle"
        variant="outline"
        size="icon"
        className="fixed left-4 top-4 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Sidebar */}
      <div
        id="sidebar-navigation"
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 transform bg-primary text-primary-foreground transition-transform duration-300 ease-in-out md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-center border-b border-primary-foreground/10">
            <img
              src="/tsagda.png"
              alt="Logo"
              className="h-10 w-10 mr-3 object-contain"
            />
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {navItems.map((item) => {
                if (
                  !item?.allowRoles ||
                  (item?.allowRoles?.length > 0 &&
                    item.allowRoles.includes(authUser?.role || ''))
                ) {
                  return (
                    <li key={item.title} className="rounded-md">
                      {item.submenu ? (
                        <div className="space-y-1">
                          <Button
                            variant="ghost"
                            className={cn(
                              'flex w-full items-center justify-between px-3 py-2 text-left hover:bg-primary-foreground/10 font-normal text-base hover:text-white',
                              pathname === item.href &&
                                'bg-primary-foreground/20'
                            )}
                            onClick={() => toggleSubmenu(item.title)}
                          >
                            <div className="flex items-center">
                              {item.icon}
                              <span className="ml-3">{item.title}</span>
                            </div>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className={cn(
                                'h-4 w-4 transition-transform',
                                openSubmenu === item.title && 'rotate-180'
                              )}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </Button>
                          {openSubmenu === item.title && (
                            <ul className="ml-6 space-y-1 border-l border-primary-foreground/10 pl-2">
                              {item.submenu.map((subItem) => (
                                <li key={subItem.title}>
                                  <Link
                                    href={subItem.href}
                                    className={cn(
                                      'block rounded-md px-3 py-2 text-sm hover:bg-primary-foreground/10',
                                      pathname === subItem.href &&
                                        'bg-primary-foreground/20'
                                    )}
                                  >
                                    {subItem.title}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ) : (
                        <Link
                          href={item.href}
                          className={cn(
                            'flex items-center rounded-md px-3 py-2 hover:bg-primary-foreground/10',
                            pathname === item.href && 'bg-primary-foreground/20'
                          )}
                        >
                          {item.icon}
                          <span className="ml-3">{item.title}</span>
                        </Link>
                      )}
                    </li>
                  );
                }
                return null;
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="border-t border-primary-foreground/10 p-4">
            <div className="flex items-center justify-between">
              <ThemeToggle />
              <Button variant="ghost" size="icon" onClick={logout}>
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Гарах</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
