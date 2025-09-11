import express from "express";
import { authMiddleware, requireRole } from "../middleware/auth.js";

const router = express.Router();

// GET /admin/dashboard
router.get("/", authMiddleware, requireRole("ADMIN"), async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user // user đã được decode từ token trong middleware
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
