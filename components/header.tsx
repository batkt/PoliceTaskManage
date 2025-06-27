'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';

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
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/auth-context';
import { logoutAction } from '@/ssr/actions/auth';
import NotificationPopover from './notification/notification-popover';

export function Header() {
  const router = useRouter();
  const { authUser, clearUserData } = useAuth();
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const logout = async () => {
    const res = await logoutAction();
    if (res) {
      clearUserData();
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
            {/* <div className="md:hidden">
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
            </div> */}
            <div></div>
            <div className="flex items-center gap-2">
              <NotificationPopover />
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
                      <AvatarFallback>
                        {authUser?.givenname?.[0]}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {authUser
                          ? `${authUser?.surname?.[0]}. ${authUser?.givenname}`
                          : 'Unknown'}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground truncate">
                        {authUser?.workerId}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      router.push('/dashboard/profile/personal-information');
                    }}
                  >
                    Хувийн мэдээлэл
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
