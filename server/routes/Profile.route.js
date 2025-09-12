// routes/member.js
import express from "express";
import { authMiddleware, requireRole } from "../middleware/auth.js";
import { MemberController } from "../controllers/Admin/member.controller.js";

const router = express.Router();

// =======================
// View profile MEMBER
// =======================

router.get("/profile", authMiddleware, requireRole("MEMBER"), MemberController.getProfileMember);

// =======================
// update profile MEMBER
// =======================

router.put("/edit/profile", authMiddleware, requireRole("MEMBER"), MemberController.updateProfileMember);

// =======================
// Change password MEMBER
// =======================
router.put("/change-password", authMiddleware, requireRole("MEMBER"), MemberController.changePasswordMember);

// =======================
// register event for member
// =======================
router.post("/events/:id/register", authMiddleware, requireRole("MEMBER"), MemberController.registerEventMember);

// chỉ MEMBER mới được truy cập. 
router.get("/dashboard", authMiddleware, requireRole("MEMBER"), MemberController.getDashboardMember);

export default router;

