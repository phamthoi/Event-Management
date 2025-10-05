import express from "express";
import memberRoutes from "./member.route.js";
import eventRoutes from "./event.route.js";
import { authMiddleware, requireRole } from "../../middleware/auth.js";
import dashboardRoutes from "../dashboard.route.js";


const router = express.Router();

router.use(authMiddleware);
router.use(requireRole('ADMIN'));

router.use("/members", memberRoutes); 
router.use("/events", eventRoutes); 
router.use("/dashboard", dashboardRoutes); 



export default router;
