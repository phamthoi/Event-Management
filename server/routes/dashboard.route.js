import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { DashboardController } from "../controllers/dashboard.controller.js";

const router = express.Router();

// GET /dashboard - Lấy thông tin dashboard
router.get("/", authMiddleware, DashboardController.getDashboard);

export default router;
