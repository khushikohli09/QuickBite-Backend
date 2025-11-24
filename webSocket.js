const { Server } = require("socket.io");
const prisma = require("./prisma/client");

let io;

const initWebSocket = (server) => {
  if (io) return io;

  io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] },
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("register", ({ userId, role }) => {
      if (!userId || !role) return;

      if (role.toUpperCase() === "VENDOR") {
        socket.join(`vendor_${userId}`);
      } else if (role.toUpperCase() === "USER") {
        socket.join(`user_${userId}`);
      }

      console.log(`User ${userId} registered as ${role}, socket: ${socket.id}`);
    });

    socket.on("place-order", async (order) => {
      try {
        const restaurant = await prisma.restaurant.findUnique({
          where: { id: order.restaurantId },
        });
        if (!restaurant) return;

        const ownerId = restaurant.ownerId;
        io.to(`vendor_${ownerId}`).emit("order-received", { ...order, status: "Pending" });
      } catch (err) {
        console.error(err);
      }
    });

    socket.on("update-order-status", async ({ orderId, userId, status, total, restaurantOwnerId }) => {
      try {
        await prisma.order.update({
          where: { id: orderId },
          data: { status },
        });

        if (status === "Confirmed") {
          io.to(`user_${userId}`).emit("order-created", { orderId, status, total });
        } else if (status === "Ready to Deliver") {
          io.to(`user_${userId}`).emit("order-ready", { orderId, status });
          if (restaurantOwnerId) {
            io.to(`vendor_${restaurantOwnerId}`).emit("remove-notification", { orderId });
          }
        }
      } catch (err) {
        console.error(err);
      }
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  console.log("✅ WebSocket initialized");
  return io;
};

// ✅ Helper to broadcast updates to all clients
const broadcastUpdate = (type, data) => {
  if (!io) return;
  io.emit(`${type}-updated`, data); // e.g., "restaurant-updated" or "category-updated"
};

module.exports = { initWebSocket, broadcastUpdate };