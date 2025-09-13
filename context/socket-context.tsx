'use client';

import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './auth-context';
import { BASE_URL } from '@/lib/config';

interface ISocketContextData {
  isConnected: boolean;
  socket: Socket | null;
}

export const SocketContext = createContext<ISocketContextData>({
  isConnected: false,
  socket: null,
});

const SocketProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { accessToken } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!accessToken) {
      socket?.disconnect();
      setSocket(null);
      setIsConnected(false);
      return;
    }

    // Хуучин socket байвал disconnect
    if (socket) {
      socket.disconnect();
    }

    console.log("connect socket... ", BASE_URL);
    const socketInstance = io(BASE_URL, {
      transports: ['websocket'],
      withCredentials: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
      timeout: 10000,
      auth: {
        token: accessToken,
      },
    });

    socketInstance.on('connect', () => {
      console.log('✅ Socket connected');
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('❌ Socket disconnected');
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
      setSocket(null);
    };
  }, [accessToken]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;

export const useSocket = () => {
  const ctx = useContext(SocketContext);

  if (!ctx) {
    throw new Error('⚠️ useSocket must be used within a <SocketProvider>');
  }

  return ctx;
};
