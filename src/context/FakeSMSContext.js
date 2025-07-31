"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { useSocket } from "./SocketContext";

const FakeSMSContext = createContext();

export function useFakeSMS() {
  return useContext(FakeSMSContext);
}

export function FakeSMSProvider({ children }) {
  const [messages, setMessages] = useState([]);
  const socket = useSocket();

  const sendFakeSMS = useCallback(
    ({ type, recipient, content, meta }) => {
      const message = {
        id: Date.now() + Math.random(),
        type,
        recipient,
        content,
        meta: meta || {},
        timestamp: new Date().toISOString(),
      };

      // Emit to socket server
      socket?.emit("fake-sms", message);

      // Add locally
      setMessages((prev) => [message, ...prev]);

      console.log("📨 Fake SMS sent:", message);
    },
    [socket]
  );

  const clearFakeSMS = useCallback(() => setMessages([]), []);

  // Listen for incoming SMS from other tabs/devices
  useEffect(() => {
    if (!socket) return;

    const handleIncoming = (message) => {
      console.log("📥 Incoming fake SMS from socket:", message);
      setMessages((prev) => [message, ...prev]);
    };

    socket.on("fake-sms", handleIncoming);

    return () => {
      socket.off("fake-sms", handleIncoming);
    };
  }, [socket]);

  return (
    <FakeSMSContext.Provider value={{ messages, sendFakeSMS, clearFakeSMS }}>
      {children}
    </FakeSMSContext.Provider>
  );
}
