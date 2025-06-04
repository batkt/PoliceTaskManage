'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { getSocketInstanse } from '@/lib/socket';
import { useAuth } from './auth-context';
import { getNotifications, getUnseenCount } from '@/lib/service/notification';
import { Notification } from '@/lib/types/notification.types';
import { allNotifSeen, notifRead } from '@/ssr/actions/notification';
import { List } from '@/lib/types/global.types';
import { useRouter } from 'next/navigation';

type NotificationContextType = {
  notifications: Notification[];
  fetchNotifications: () => Promise<void>;
  markAllAsSeen: () => Promise<void>;
  markAsRead: (notif: Notification) => Promise<void>;
  unseenCount: number;
  //   sendNotification: (userId: string, message: string) => Promise<void>;
  //   sendToMultiple: (userIds: string[], message: string) => Promise<void>;
  //   broadcastNotification: (message: string) => Promise<void>;
};

const NotificationContext = createContext<NotificationContextType | null>(null);

export const NotificationProvider = ({
  children,
  baseUrl,
}: {
  children: React.ReactNode;
  baseUrl: string;
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unseenCount, setUnseenCount] = useState(0);
  const { authUser, accessToken } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log('baseUrl ', baseUrl);
    const socket = getSocketInstanse(baseUrl);
    socket.connect();

    if (authUser?._id) {
      socket.emit('register', authUser._id);

      socket.on('notification', (data) => {
        const notification: Notification = {
          _id: Date.now()?.toString(),
          createdAt: new Date().toISOString(),
          seen: false,
          read: false,
          ...data,
        };
        setNotifications((prev) => [notification, ...prev]);
        setUnseenCount((prev) => prev + 1);
      });

      socket.on('notifications', (data: List<Notification>) => {
        console.log('init ', data);
        setNotifications(data.rows);
      });

      socket.on('unseenCount', (data: number) => {
        console.log('init unseenCount ', data, 'sdfsd');
        setUnseenCount(data);
      });
    }

    return () => {
      socket.disconnect();
    };
  }, [authUser]);

  const fetchNotifications = useCallback(async () => {
    const res = await getNotifications(accessToken);
    if (res.code === 200) {
      setNotifications(res.data?.rows);
    }
  }, []);

  //   const getUnseenNotificationsCount = useCallback(async () => {
  //     const res = await getUnseenCount(accessToken);
  //     if (res.code === 200) {
  //       setUnseenCount(res?.data || 0);
  //     }
  //   }, []);

  //   useEffect(() => {
  //     fetchNotifications();
  //     getUnseenNotificationsCount();
  //   }, [fetchNotifications, getUnseenNotificationsCount]);

  const markAllAsSeen = async () => {
    const res = await allNotifSeen();
    if (res.code === 200) {
      setNotifications((prev) => prev.map((n) => ({ ...n, seen: true })));
      setUnseenCount(0);
    }
  };

  const markAsRead = async (notif: Notification) => {
    await notifRead({ id: notif._id });
    setNotifications((prev) =>
      prev.map((n) => (n._id === notif._id ? { ...n, read: true } : n))
    );
    if (notif?.taskId) {
      router.push('/dashboard/my-tasks');
    }
  };

  //   const sendNotification = async (userId: string, message: string) => {
  //     await axios.post('/api/notify', { userId, message });
  //   };

  //   const sendToMultiple = async (userIds: string[], message: string) => {
  //     await axios.post('/api/notify/multiple', { userIds, message });
  //   };

  //   const broadcastNotification = async (message: string) => {
  //     await axios.post('/api/notify/broadcast', { message });
  //   };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        fetchNotifications,
        markAllAsSeen,
        markAsRead,
        unseenCount,
        // sendNotification,
        // sendToMultiple,
        // broadcastNotification,
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
