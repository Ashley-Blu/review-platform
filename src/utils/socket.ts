import { Server } from "socket.io";

let io: Server | null = null;

export const initSocket = (server: any) => {
  io = new Server(server, { cors: { origin: "*" } });
  io.on("connection", (socket) => {
    console.log("Socket connected", socket.id);
    socket.on("join", (userId) => {
      socket.join(`user_${userId}`);
    });
    socket.on("disconnect", () => {});
  });
  return io;
};

export const emitNotification = (userId: number, payload: any) => {
  if (!io) return;
  io.to(`user_${userId}`).emit("notification", payload);
};
