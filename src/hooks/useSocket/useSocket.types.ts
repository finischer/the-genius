import { type Socket } from "socket.io-client";

export interface IUseSocketProvider {
  children: React.ReactNode;
}

export interface IUseSocketContext {
  socket: Socket;
}

// export interface ServerToClientEvents {}

// export interface ClientToServerEvents {}

// export interface InterServerEvents {}
