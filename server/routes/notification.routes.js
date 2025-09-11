import express from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();
const prisma = new PrismaClient();

// POST /admin/notifications/send
router.post("/send", authMiddleware, async (req, res) => {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ success: false, message: "Chỉ admin mới có quyền gửi thông báo" });
  }

  const { recipientId, title, message, type } = req.body;

  if (!title || !message) {
    return res.status(400).json({ success: false, message: "Thiếu tiêu đề hoặc nội dung thông báo" });
  }

  try {
    // Nếu có recipientId -> gửi cho 1 member
    // Nếu không có recipientId -> gửi cho toàn bộ member
    let notifications = [];

    if (recipientId) {
      const notification = await prisma.notification.create({
        data: {
          title,
          message,
          type: type || "GENERAL",
          recipientId: parseInt(recipientId),
        },
      });
      notifications.push(notification);
    } else {
      // Gửi cho toàn bộ member trong hệ thống
      const members = await prisma.user.findMany({
        where: { role: "MEMBER", isActive: true },
        select: { id: true },
      });

      notifications = await Promise.all(
        members.map((member) =>
          prisma.notification.create({
            data: {
              title,
              message,
              type: type || "GENERAL",
              recipientId: member.id,
            },
          })
        )
      );
    }

    res.json({
      success: true,
      message: "Thông báo đã được gửi",
      count: notifications.length,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
