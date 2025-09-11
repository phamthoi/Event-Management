import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Cấu hình đọc .env từ thư mục gốc
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";
import memberRoutes from "./routes/member.js";

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware cấu hình CORS - cho phép frontend từ port 3000
app.use(cors({
  origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
  credentials: true
}));
app.use(express.json());

// API routes
app.use("/auth", authRoutes); // login chung
app.use("/admin", adminRoutes); // admin route (bảo vệ bằng role ADMIN)
app.use("/member", memberRoutes); // member route (bảo vệ bằng role MEMBER)

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ message: "Event Management API Server is running!", port: PORT });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend API Server running at http://localhost:${PORT}`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}`);
});
