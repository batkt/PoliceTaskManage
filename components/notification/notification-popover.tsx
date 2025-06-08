'use client';

import React from 'react';
import { Bell, PackageOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useNotifications } from '@/context/notification-context';
import { cn, formatRelativeTime } from '@/lib/utils';
import { useTasks } from '@/context/task-context';

const NotificationPopover = () => {
  const { openTaskDetailModal } = useTasks();
  const { notifications, markAsRead, notSeenCount, markAllAsSeen } =
    useNotifications();

  return (
    <div className="flex items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="relative"
            onClick={() => {
              if (notSeenCount > 0) {
                markAllAsSeen();
              }
            }}
          >
            <Bell className="h-5 w-5" />
            {notSeenCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs text-destructive-foreground">
                {notSeenCount}
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
              {/* <Button size="sm" className="h-auto px-1.5 py-1 text-xs">
            Бүгдийг уншсан болгох
          </Button> */}
            </div>
          </div>
          <div className="max-h-[60vh] overflow-auto">
            {notifications?.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={cn(
                    'flex cursor-pointer gap-3 border-b p-3',
                    notification.read
                      ? 'bg-transparent hover:bg-muted/30'
                      : 'bg-muted/50 hover:bg-muted'
                  )}
                  onClick={() => {
                    markAsRead(notification);
                    if (notification.type === 'task') {
                      openTaskDetailModal(notification.taskId!);
                    }
                  }}
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Bell className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p
                        className={cn(
                          'text-sm truncate',
                          notification.read ? 'font-normal' : 'font-medium'
                        )}
                      >
                        {notification.title}
                      </p>
                      <p className="text-sm text-muted-foreground whitespace-nowrap ml-2">
                        {formatRelativeTime(notification.createdAt)}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {notification?.message}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col gap-4 items-center justify-center py-16 px-10 text-muted-foreground">
                <PackageOpen className="size-16" />
                Танд мэдэгдэл ирээгүй байна.
              </div>
            )}
          </div>
          {notifications.length > 5 ? (
            <div className="p-3 text-center">
              <Button variant="ghost" size="sm" className="w-full">
                Бүх мэдэгдэл харах
              </Button>
            </div>
          ) : null}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default NotificationPopover;
