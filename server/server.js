import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Cấu hình đọc .env từ thư mục server hiện tại
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

import authRoutes from "./routes/auth.route.js";
import adminRoutes from "./routes/Admin/admin.route.js";
import memberRoutes from "./routes/Admin/member.route.js";

import eventRoutes from "./routes/Admin/event.route.js";
import notificationRoutes from "./routes/notification.route.js";

const app = express();
// const PORT = process.env.PORT || 4000;
const PORT = 4000;

// Middleware cấu hình CORS - cho phép frontend từ port 3000
app.use(cors({
  origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
  credentials: true
}));

// Middleware disable cache - ngăn browser cache responses
app.use((req, res, next) => {
  res.set({
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
    'Surrogate-Control': 'no-store'
  });
  next();
});

app.use(express.json());

// API routes
app.use("/auth", authRoutes); // login chung
app.use("/admin", adminRoutes); // admin route (bảo vệ bằng role ADMIN)
// app.use("/member", memberRoutes); // member route (bảo vệ bằng role MEMBER)
// app.use("/membersManage", memberManageRoutes); // admin manage members 
app.use("/events", eventRoutes); // event routes
// app.use("/notifications", notificationRoutes); // notification routes



// Health check endpoint
app.get("/", (req, res) => {
  res.json({ message: "Event Management API Server is running!", port: PORT });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend API Server running at http://localhost:${PORT}`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}`);
});
