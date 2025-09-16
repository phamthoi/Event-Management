import express from "express";
import { authMiddleware } from "../../middleware/auth.js";
import { MemberController } from "../../controllers/Admin/member.controller.js";

const router = express.Router();

// GET /members - Lấy danh sách members (chỉ admin)
router.get("/", authMiddleware, MemberController.getMembersList);

// POST /members - Tạo member mới (chỉ admin)
router.post("/", authMiddleware, MemberController.createMember);

// PUT /members/:id/lock - Khóa member (chỉ admin)
router.put("/:id/lock", authMiddleware, MemberController.lockMember);

// PUT /members/:id/unlock - Mở khóa member (chỉ admin)
router.put("/:id/unlock", authMiddleware, MemberController.unlockMember);

// PUT /members/:id/reset-password - Reset password member (chỉ admin)
router.put("/:id/reset-password", authMiddleware, MemberController.resetPassword);

export default router;
