import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();
const prisma = new PrismaClient();

// GET /admin/members/list
router.get("/list", authMiddleware, async (req, res) => {
   try {
    if (req.user.role !== "ADMIN")
      return res.status(403).json({ message: "Chỉ admin mới truy cập" });

    const { email, fullName, isActive, page = 1, limit = 10 } = req.query;
    const where = { organizationId: req.user.organizationId, role: "MEMBER" };

    if (email) where.email = { contains: email, mode: "insensitive" };
    if (fullName) where.fullName = { contains: fullName, mode: "insensitive" };
    if (isActive !== undefined) where.isActive = isActive === "true";

    const members = await prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" }, 
      skip: (parseInt(page) - 1) * parseInt(limit),
      take: parseInt(limit),
      select:{
        id: true,
        fullName: true,
        email: true,
        phoneNumber: true,
        isActive: true,
        createdAt: true
      }
    });

    const total = await prisma.user.count({ where });

    res.json({ members, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /admin/members/create
router.post("/create", authMiddleware, async (req, res) => {
  console.log("req.user:", req.user);
    if (req.user.role !== "ADMIN")
      return res.status(403).json({ message: "Chỉ admin mới tạo member" });
  
    const { fullName, email, password } = req.body;
  
    if (!fullName || !email || !password) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }
    
    try {
      // 📌 check email trùng
      const exists = await prisma.user.findUnique({ where: { email } });
      if (exists) return res.status(400).json({ message: "Email đã tồn tại" });
  
      const passwordHash = await bcrypt.hash(password, 10);
  
      const member = await prisma.user.create({
        data: {
          fullName,
          email,
          passwordHash,
          role: "MEMBER",
          isActive: true,
          organizationId: req.user.organizationId, // ✅ ép theo tổ chức của admin
        },
      });
      res.json({success: true, member});
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
});

// POST /admin/members/:id/lock
router.post("/:id/lock", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "ADMIN")
      return res.status(403).json({ message: "Chỉ admin mới truy cập" });

    const member = await prisma.user.update({
      where: { id: parseInt(req.params.id) }, // ✅ convert id
      data: { isActive: false },
    });

    res.json({ message: "Member đã bị khóa", member });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /admin/members/:id/unlock
router.post("/:id/unlock", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "ADMIN")
      return res.status(403).json({ message: "Chỉ admin mới truy cập" });

    const member = await prisma.user.update({
      where: { id: parseInt(req.params.id) }, // ✅ convert id
      data: { isActive: true },
    });

    res.json({ message: "Member đã được mở khóa", member });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /admin/members/:id/reset-password
router.post("/:id/reset-password", authMiddleware, async (req, res) => {
  try {
      if (req.user.role !== "ADMIN")
        return res.status(403).json({ message: "Chỉ admin mới reset password" });
  
      const newPassword = "Member@123";
      const passwordHash = await bcrypt.hash(newPassword, 10);
  
      await prisma.user.update({
        where: { id: parseInt(req.params.id) }, // ✅ convert id
        data: { passwordHash },
      });
  
      res.json({ message: "Password đã reset về 'Member@123'" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
});

export default router;
