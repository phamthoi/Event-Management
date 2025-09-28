import express from "express";
import memberRoutes from "./member.route.js";
import eventRoutes from "./event.route.js";
import notificationRoutes from "../notification.route.js";
import dashboardRoutes from "../dashboard.route.js";
import profileRoutes from "./profile.route.js";

const router = express.Router();

router.use("/members", memberRoutes); 
router.use("/events", eventRoutes); 
router.use("/notifications", notificationRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/profile", profileRoutes); 

export default router;
