'use client';
import { createContext, useContext, useState, useCallback } from "react";

const FakeSMSContext = createContext();

export function useFakeSMS() {
  return useContext(FakeSMSContext);
}

export function FakeSMSProvider({ children }) {
  const [messages, setMessages] = useState([]);

  // type: 'complainant' | 'admin', recipient: phone or 'admin', content: string
  const sendFakeSMS = useCallback(({ type, recipient, content, meta }) => {
    setMessages((prev) => [
      {
        id: Date.now() + Math.random(),
        type,
        recipient,
        content,
        meta: meta || {},
        timestamp: new Date().toISOString(),
      },
      ...prev,
    ]);
  }, []);

  const clearFakeSMS = useCallback(() => setMessages([]), []);

  return (
    <FakeSMSContext.Provider value={{ messages, sendFakeSMS, clearFakeSMS }}>
      {children}
    </FakeSMSContext.Provider>
  );
}
