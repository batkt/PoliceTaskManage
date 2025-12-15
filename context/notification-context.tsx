'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useAuth } from './auth-context';
import { getNotifications } from '@/lib/service/notification';
import { Notification } from '@/lib/types/notification.types';
import { allNotifSeen, notifRead } from '@/ssr/actions/notification';
import { useSocket } from './socket-context';

type NotificationContextType = {
  notifications: Notification[];
  markAllAsSeen: () => Promise<void>;
  markAsRead: (notif: Notification, pathname?: string) => Promise<void>;
  notSeenCount: number;
};

const NotificationContext = createContext<NotificationContextType | null>(null);

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notSeenCount, setNotseenCount] = useState(0);
  const { authUser, accessToken } = useAuth();
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (!authUser?._id) {
      return;
    }

    if (!socket || !isConnected) return;

    const handleListenNewNotification = (data: Notification) => {
      setNotifications((prev) => [data, ...prev]);
      setNotseenCount((prev) => prev + 1);
    };

    const handleGetNotSeenCount = (data: number) => {
      setNotseenCount(data);
    };

    socket.off('notification', handleListenNewNotification);
    socket.on('notification', handleListenNewNotification);

    socket.off('notSeenCount', handleGetNotSeenCount);
    socket.on('notSeenCount', handleGetNotSeenCount);

    return () => {
      socket.off('notification', handleListenNewNotification);
      socket.off('notSeenCount', handleGetNotSeenCount);
    };
  }, [authUser, socket]);

  const fetchNotifications = useCallback(async () => {
    const res = await getNotifications(accessToken);
    if (res.isOk) {
      setNotifications((prev) => {
        if (!prev || prev?.length === 0) {
          return res.data?.rows;
        }
        const ids = prev.map((n) => n._id);
        const newNotifications: Notification[] = [];
        res.data?.rows?.map((n) => {
          if (!ids.includes(n._id)) {
            newNotifications.push(n);
          }
        });
        return [...prev, ...newNotifications];
      });
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAllAsSeen = async () => {
    const res = await allNotifSeen(accessToken);
    if (res.isOk) {
      setNotifications((prev) => prev.map((n) => ({ ...n, seen: true })));
      setNotseenCount(0);
    }
  };

  const markAsRead = async (notif: Notification, path?: string) => {
    await notifRead({ notificationId: notif._id }, path, accessToken);
    setNotifications((prev) =>
      prev.map((n) => (n._id === notif._id ? { ...n, read: true } : n))
    );
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        markAllAsSeen,
        markAsRead,
        notSeenCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx)
    throw new Error(
      'useNotifications must be used within NotificationProvider'
    );
  return ctx;
};
