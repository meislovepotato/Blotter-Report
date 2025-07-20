import { io } from "socket.io-client";

const createSocketClient = () => {
  const host =
    typeof window !== "undefined" ? window.location.hostname : "localhost";
  return io(`http://${host}:3001`, {
    transports: ["websocket"],
  });
};

export default createSocketClient;
