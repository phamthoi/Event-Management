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


// Middleware cấu hình CORS
app.use(cors({
  origin: "*"
}));
app.use(express.json());

// API routes
app.use("/auth", authRoutes); //login chung
app.use("/admin", adminRoutes); //admin route (bảo về bằng role ADMIN)
app.use("/member", memberRoutes); //member route (bảo về bằng role MEMBER)



//đường dẫn tới folder chứa file tĩnh
const clientPublicPath = path.join(__dirname, "../client/public");
const clientPagesPath = path.join(__dirname, "../client/pages");

//Static files
app.use(express.static(clientPublicPath));
// Phục vụ trang HTML trong /pages mà không cần token
app.use('/pages', express.static(clientPagesPath)); //pagse tĩnh không cần token



app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`login page: http://localhost:${PORT}/login.html`);
});
