const { Server } = require("socket.io");

const io = new Server(3001, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

console.log("Socket.IO server running on port 3001");

io.on("connection", (socket) => {
  console.log("🔥 Client connected:", socket.id);

  socket.on("complaint-created", (data) => {
    console.log("📩 Received complaint-created:", data);

    socket.broadcast.emit("complaint-created", data);
  });
  socket.on("complaint-updated", (data) => {
    console.log("📩 Received complaint-updated:", data);

    io.emit("complaint-updated", data);
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

module.exports = io;
