// routes/auth.js

import express from "express";
import { AuthController, forgotPasswordController,verifyCodeController ,resetPasswordController } from "../controllers/auth.controller.js";

const router = express.Router();

// POST /auth/login
router.post("/login", AuthController.login);

// POST /forgot-password and rese-password
router.post("/forgot-password", forgotPasswordController);
router.post("/verify-code", verifyCodeController);
router.post("/reset-password", resetPasswordController);

export default router;
