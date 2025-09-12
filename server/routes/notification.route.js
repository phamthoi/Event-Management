import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { NotificationController } from "../controllers/notification.controller.js";

const router = express.Router();


//Phần ADMIN
// POST /notifications/send - Gửi thông báo (chỉ admin)
router.post("/send", authMiddleware, NotificationController.sendNotificationAdmin);



//Phần chung admin và member
// GET /notifications - Lấy danh sách thông báo của user hiện tại
router.get("/", authMiddleware, NotificationController.getNotifications);

// PUT /notifications/:notificationId/read - Đánh dấu thông báo đã đọc
router.put("/:notificationId/read", authMiddleware, NotificationController.markAsRead);

export default router;
