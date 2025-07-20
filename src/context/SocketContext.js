"use client";

import createSocketClient from "@/lib/createSocketClient";
import { createContext, useContext, useEffect, useRef, useState } from "react";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const isConnected = useRef(false);

  useEffect(() => {
    if (!isConnected.current) {
      const socketIo = createSocketClient();

      socketIo.on("connect", () => {
        console.log("Connected to socket:", socketIo.id);
        isConnected.current = true;
      });

      setSocket(socketIo);

      return () => {
        socketIo.disconnect();
        console.log("Socket disconnected");
      };
    }
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
