// routes/auth.js
import express from "express";
import { AuthController } from "../controllers/auth.controller.js";

const router = express.Router();

// POST /auth/login
router.post("/login", AuthController.login); // dùng controller login chung

export default router;
