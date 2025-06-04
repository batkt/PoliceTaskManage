import { io, Socket } from 'socket.io-client';

let socket: Socket;

const getSocketInstanse = (url: string) => {
  if (!socket) {
    socket = io(url, {
      autoConnect: false,
      withCredentials: true,
    });
  }
  return socket;
};

export { getSocketInstanse };
