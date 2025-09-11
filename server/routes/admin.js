// routes/admin.js
import express from "express";
import memberRoutes from "./member.routes.js";
import eventRoutes from "./event.routes.js";
import notificationRoutes from "./notification.routes.js";
import dashboardRoutes from "./dashboard.routes.js";

const router = express.Router();

router.use("/members", memberRoutes);
router.use("/events", eventRoutes);
router.use("/notifications", notificationRoutes);
router.use("/dashboard", dashboardRoutes);

export default router;
