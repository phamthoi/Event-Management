import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";
import { Server } from "socket.io";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

import authRoutes from "./routes/common/auth.route.js";
import adminRoutes from "./routes/admin/admin.route.js";
import memberRoutes from "./routes/member/member.route.js";
import commonProfileRoutes from "./routes/common/profile.route.js";
import commonEventRoutes from "./routes/common/event.route.js";
import notificationRoutes from "./routes/common/notification.route.js";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: [process.env.CLIENT_URL],
    methods: ["GET", "POST"],
    // credentials: true,
  },
});

const PORT = process.env.PORT;

app.set("etag", false);

app.use(
  cors({
    origin: [process.env.CLIENT_URL],
    // credentials: true,
  })
);

app.use((req, res, next) => {
  res.set({
    // 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    // 'Pragma': 'no-cache',
    // 'Expires': '0',
    // 'Surrogate-Control': 'no-store'
    "Content-Type": "application/json",
  });
  next();
});

app.use(express.json());

// Make io accessible to routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/member", memberRoutes);
app.use("/profile", commonProfileRoutes);
app.use("/event", commonEventRoutes);
app.use("/notifications", notificationRoutes);





app.get("/", (req, res) => {
  res.json({ message: "Event Management API is running!" });
});






io.on("connection", (socket) => {
  console.log("💖 User connected:", socket.id);



  socket.on("join-user", (userId) => {
    socket.join(`user-${userId}`);


    console.log(`🚖 User ${socket.id} joined personal room ${userId}`);
    console.log("🏠 ALL ROOMS (after user):");
    io.sockets.adapter.rooms.forEach((sockets, roomName) => {
      console.log(
        `  +   Room "${roomName}": ${sockets.size} users - [${Array.from(
          sockets
        ).join(", ")}]`
      );
    });
  });


  socket.on("join-organization", (organizationId) => {
    socket.join(`org-${organizationId}`);


    console.log(`🚐 User ${socket.id} joined organization ${organizationId}`);
    console.log("🏠 ALL ROOMS (after org):");
    io.sockets.adapter.rooms.forEach((sockets, roomName) => {
      console.log(
        `  +   Room "${roomName}": ${sockets.size} users - [${Array.from(
          sockets
        ).join(", ")}]`
      );
    });
  });



  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// Export io for use in other modules
export { io };

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
