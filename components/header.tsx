'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Search, X } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { SearchNav } from '@/components/search-nav';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';
import { logoutAction } from '@/ssr/actions/auth';

export function Header() {
  const router = useRouter();
  const { authUser, clearUserData } = useAuth();
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Шинэ даалгавар',
      description: 'Танд шинэ даалгавар оноогдлоо',
      time: '10 минутын өмнө',
      read: false,
    },
    {
      id: 2,
      title: 'Тайлангийн хугацаа',
      description: 'Сарын тайлан илгээх хугацаа дөхөж байна',
      time: '1 цагийн өмнө',
      read: false,
    },
    {
      id: 3,
      title: 'Хурлын мэдэгдэл',
      description: 'Маргааш 10:00 цагт хэлтсийн хурал болно',
      time: '3 цагийн өмнө',
      read: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const logout = async () => {
    const res = await logoutAction();
    if (res) {
      router.replace('/');
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between bg-background px-4 shadow-sm md:px-6">
      <div className="flex flex-1 items-center justify-between md:ml-64">
        {showMobileSearch ? (
          <div className="flex w-full items-center md:hidden">
            <Input
              placeholder="Хайх..."
              className="mr-2"
              autoFocus
              onBlur={() => setShowMobileSearch(false)}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowMobileSearch(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        ) : (
          <>
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowMobileSearch(true)}
              >
                <Search className="h-5 w-5" />
              </Button>
            </div>
            <div className="hidden md:block">
              <SearchNav />
            </div>
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs text-destructive-foreground">
                        {unreadCount}
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-[calc(100vw-2rem)] max-w-sm p-0"
                  align="end"
                >
                  <div className="border-b p-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">Мэдэгдэл</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 text-xs"
                      >
                        Бүгдийг уншсан болгох
                      </Button>
                    </div>
                  </div>
                  <div className="max-h-[60vh] overflow-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={cn(
                          'flex cursor-pointer gap-3 border-b p-3 hover:bg-muted',
                          !notification.read && 'bg-muted/50'
                        )}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <Bell className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium truncate">
                              {notification.title}
                            </p>
                            <p className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                              {notification.time}
                            </p>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {notification.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 text-center">
                    <Button variant="ghost" size="sm" className="w-full">
                      Бүх мэдэгдэл харах
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src="/placeholder.svg?height=32&width=32"
                        alt="@user"
                      />
                      <AvatarFallback>ЦЕГ</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {authUser
                          ? `${authUser?.surname[0]}. ${authUser?.givenname}`
                          : 'Unknown'}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground truncate">
                        {authUser?.workerId}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => router.push('/dashboard/profile')}
                  >
                    Профайл
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push('/dashboard/settings')}
                  >
                    Тохиргоо
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => logout()}>
                    Гарах
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
