'use client';

import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useSocket } from './socket-context';
import { StatsCount } from '@/lib/types/dashboard.types';

const default_stats = {
  active: 0,
  completed: 0,
  in_progress: 0,
  onlineUsers: 0,
  overdue: 0,
  pending: 0,
  total: 0,
  totalUsers: 0,
};

const DashboardContext = createContext<{
  statsCount: StatsCount;
}>({
  statsCount: default_stats,
});

const DashboardProvider = ({
  stats,
  children,
}: {
  stats: StatsCount | null;
  children: ReactNode;
}) => {
  const [statsCount, setStatsCount] = useState<StatsCount>(
    stats || default_stats
  );
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleConnect = () => {
      socket.emit('dashboard:subscribe');
    };

    const handleUpdate = (data: StatsCount) => {
      setStatsCount(data);
    };

    socket.off('connect', handleConnect);
    socket.on('connect', handleConnect);

    socket.off('dashboard:update', handleUpdate);
    socket.on('dashboard:update', handleUpdate);

    // Хэрвээ аль хэдийн холбогдсон бол шууд subscribe хийх
    if (socket.connected) {
      handleConnect();
    }

    return () => {
      socket.emit('dashboard:unsubscribe');
      socket.off('connect', handleConnect);
      socket.off('dashboard:update', handleUpdate);
    };
  }, [socket, isConnected]);

  return (
    <DashboardContext.Provider
      value={{
        statsCount,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export default DashboardProvider;

export const useDashboard = () => {
  const ctx = useContext(DashboardContext);
  if (!ctx)
    throw new Error('useDashboard must be used within DashboardProvider');
  return ctx;
};
