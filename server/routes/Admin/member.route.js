import express from "express";
import { authMiddleware } from "../../middleware/auth.js";
import { MemberController } from "../../controllers/Admin/member.controller.js";

const router = express.Router();


router.get("/list", authMiddleware, MemberController.getMembersList);


router.get("/:id", authMiddleware, MemberController.getMemberById);


router.post("/create", authMiddleware, MemberController.createMember);


router.put("/:id/lock", authMiddleware, MemberController.lockMember);


router.put("/:id/unlock", authMiddleware, MemberController.unlockMember);


router.put("/:id/reset-password", authMiddleware, MemberController.resetPassword);

export default router;
