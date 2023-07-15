import { createContext, useContext } from "react";
import { io } from "socket.io-client";
import { type IUseSocketContext, type IUseSocketProvider } from "./useSocket.types";

const SocketContext = createContext<IUseSocketContext | undefined>(undefined);

const socket = io({
  path: "/api/socket/",
  autoConnect: true,
  closeOnBeforeunload: false
})

const SocketProvider: React.FC<IUseSocketProvider> = ({ children }) => {


  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

const useSocket = () => {
  const context = useContext(SocketContext);

  if (context === undefined) {
    throw Error("useSocket must be used within SocketProvider");
  }
  return context;
};

export { SocketProvider, useSocket, socket };

