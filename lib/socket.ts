import { io, Socket } from 'socket.io-client';

let socket: Socket;

const getSocketInstanse = (url: string) => {
  if (!socket) {
    socket = io(url, {
      autoConnect: false,
    });
  }
  return socket;
};

export { getSocketInstanse };
