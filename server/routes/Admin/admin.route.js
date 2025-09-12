// routes/admin.js
import express from "express";
import memberRoutes from "./member.route.js";
import eventRoutes from "./event.route.js";
import notificationRoutes from "../notification.route.js";
import dashboardRoutes from "../dashboard.route.js";

const router = express.Router();

router.use("/members", memberRoutes); //checked
router.use("/events", eventRoutes); //checked
router.use("/notifications", notificationRoutes);
router.use("/dashboard", dashboardRoutes);

export default router;
