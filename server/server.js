import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

import authRoutes from "./routes/common/auth.route.js";
import adminRoutes from "./routes/admin/admin.route.js";
import memberRoutes from "./routes/member/member.route.js";
import commonProfileRoutes from "./routes/common/profile.route.js";
import commonEventRoutes from "./routes/common/event.route.js";

const app = express();
const PORT = process.env.PORT;

app.set('etag', false);


app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:5000"],
  // credentials: true
}));


app.use((req, res, next) => {
  res.set({
    // 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    // 'Pragma': 'no-cache',
    // 'Expires': '0',
    // 'Surrogate-Control': 'no-store'
    'Content-Type': 'application/json'
  });
  next();
});

app.use(express.json());


app.use("/auth", authRoutes); 
app.use("/admin", adminRoutes); 
app.use("/member", memberRoutes);
app.use("/profile", commonProfileRoutes);
app.use("/event", commonEventRoutes);




app.get("/", (req, res) => {
  res.json({ message: "Event Management API Server is running!", port: PORT });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend API Server running at http://localhost:${PORT}`);
  
});
