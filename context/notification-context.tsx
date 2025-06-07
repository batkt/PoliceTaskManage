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
import { List } from '@/lib/types/global.types';
import { useRouter } from 'next/navigation';
import { useSocket } from './socket-context';

type NotificationContextType = {
  notifications: Notification[];
  fetchNotifications: () => Promise<void>;
  markAllAsSeen: () => Promise<void>;
  markAsRead: (notif: Notification) => Promise<void>;
  notSeenCount: number;
  //   sendNotification: (userId: string, message: string) => Promise<void>;
  //   sendToMultiple: (userIds: string[], message: string) => Promise<void>;
  //   broadcastNotification: (message: string) => Promise<void>;
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
  const { socket } = useSocket();
  const router = useRouter();

  useEffect(() => {
    if (!authUser?._id) {
      return;
    }

    if (!socket) {
      return;
    }

    socket.on('notification', (data) => {
      setNotifications((prev) => [data, ...prev]);
      setNotseenCount((prev) => prev + 1);
    });

    socket.on('notifications', (data: List<Notification>) => {
      setNotifications(data.rows);
    });

    socket.on('notSeenCount', (data: number) => {
      setNotseenCount(data);
    });
  }, [authUser, socket]);

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
      setNotseenCount(0);
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
        notSeenCount,
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
