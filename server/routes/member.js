// routes/user.js
import express from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware, requireRole } from "../middleware/auth.js";
import bcrypt from "bcryptjs";

const router = express.Router();
const prisma = new PrismaClient();

// =======================
// View profile MEMBER
// =======================

router.get("/profile", authMiddleware, requireRole("MEMBER"), async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: { id: true, fullName: true, email: true, phoneNumber:true, role: true, organizationId: true }
        });
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({ success: true, user });
    }catch (err) {
        console.error("Get profile error: ", err);
        res.status(500).json({ message: "Server error" });
    }
});

// =======================
// update profile MEMBER
// =======================

router.put("/edit/profile", authMiddleware, requireRole("MEMBER"), async (req, res) => {
   try {
        const { fullName, phoneNumber } = req.body;

        const updated = await prisma.user.update({
            where: { id: req.user.id },
            data: { fullName, phoneNumber },
            select: { id: true, fullName: true, email: true, phoneNumber:true }
        });

        res.json({ message: "Profile updated successfully", user: updated });
   } catch (error) {
        console.error("Update profile error: ", error);
        res.status(500).json({ message: "Server error" });
   } 
});

// =======================
// Change password MEMBER
// =======================
router.put("/change-password", authMiddleware, requireRole("MEMBER"), async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: "Current and new passwords are required" });
        }

        //get user from db
        const user = await prisma.user.findUnique({ where: { id: req.user.id } });
        if (!user) return res.status(404).json({ message: "User not found" });

        //check current password
        const valid = await bcrypt.compare(currentPassword , user.passwordHash);
        if (!valid) return res.status(400).json({ message: "Current password is incorrect" });

        // hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        //update password in db
        await prisma.user.update({
            where: { id: req.user.id },
            data: { passwordHash: hashedPassword }
        });
    } catch (error) {
        console.error("Change password error: ", error);
        res.status(500).json({ message: "Server error" });
    }
});

// =======================
// register event for member
// =======================
router.post("/events/:id/register", authMiddleware, requireRole("MEMBER"), async (req, res) => {
    try {
        
    } catch (error) {
        
    }
});

// chỉ MEMBER mới được truy cập. 
router.get("/dashboard", authMiddleware, requireRole("MEMBER"), async (req, res) => {
  try {
    res.json({
      success: true,
      message: "Welcome to the member dashboard",
      user: req.user // req.user được gán trong authMiddleware
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  } 
});

export default router;

