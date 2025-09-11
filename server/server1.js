import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";
import memberRoutes from "./routes/member.js";

const app = express();
const PORT = process.env.PORT || 4000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Middleware cấu hình CORS
//app.use(cors({
//  origin: "http://localhost:5173",
//  credentials: true
//}));
//app.use(express.json());

app.use(cors({
  origin: "*"
}));
app.use(express.json());

// API routes
app.use("/auth", authRoutes); //login chung
app.use("/admin", adminRoutes); //admin route (bảo về bằng role ADMIN)
app.use("/member", memberRoutes); //member route (bảo về bằng role MEMBER)

//test route
app.get("/test", (req, res) => {
  res.json({ message: "Backend is running!" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});