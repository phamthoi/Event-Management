// routes/auth.js

import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// =======================
// Route LOGIN cho Admin
// =======================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(400).json({ message: "Sai email hoặc mật khẩu" });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(400).json({ message: "Sai email hoặc mật khẩu" });
    }

    //if (user.role !== "ADMIN") {
    //  return res.status(403).json({ message: "Chỉ admin mới có quyền login" });
    //}

    const token = jwt.sign(
      { id: user.id, 
        role: user.role, 
        email: user.email, 
        organizationId: user.organizationId 
      },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

// Xuất router này để dùng trong server.js
// → server.js sẽ gọi app.use("/auth", authRoutes)
// → tức là endpoint thật sự sẽ là /auth/login
export default router;
