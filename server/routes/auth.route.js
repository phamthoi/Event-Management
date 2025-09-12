// routes/auth.js

import express from "express";
import { AuthController } from "../controllers/auth.controller.js";

const router = express.Router();

// POST /admin/login
router.post("/login", AuthController.loginAdmin);


export default router;
