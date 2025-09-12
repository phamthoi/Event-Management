import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class NotificationService {
  static async sendNotificationAdmin(notificationData) {
    const { recipientId, title, message, type } = notificationData;
    let notifications = [];

    if (recipientId) {
      // Gửi cho 1 member cụ thể
      const notification = await prisma.notification.create({
        data: {
          title,
          message,
          type,
          recipientId,
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
              type,
              recipientId: member.id,
            },
          })
        )
      );
    }

    return {
      notifications,
      count: notifications.length
    };
  }
}