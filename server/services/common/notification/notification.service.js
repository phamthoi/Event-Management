import { PrismaClient } from "@prisma/client";
import { SocketService } from "../socket/socket.service.js";

const prisma = new PrismaClient();

export class NotificationService {
  /**
   * Tạo notification cho một user cụ thể
   */
  // static async createNotification({ title, message, type = "GENERAL", recipientId }) {
  //   try {
  //     const notification = await prisma.notification.create({
  //       data: {
  //         title,
  //         message,
  //         type,
  //         recipientId,
  //       },
  //     });

  //     // Emit real-time notification to user
  //     SocketService.emitToUser(recipientId, 'new-notification', {
  //       notification,
  //       unreadCount: await this.getUnreadCount(recipientId)
  //     });

  //     return notification;
  //   } catch (error) {
  //     console.error("Error creating notification:", error);
  //     throw error;
  //   }
  // }

  /**
   * Tạo notification cho tất cả user trong organization
   */
  static async createNotificationForOrganization({ title, message, type = "GENERAL", organizationId, excludeUserId = null }) {
    try {
      const members = await prisma.user.findMany({
        where: {
          organizationId,
          role: {
            in: ["MEMBER", "ADMIN"]
          },
          isActive: true,
          ...(excludeUserId && { id: { not: excludeUserId } }),
        },
        select: {
          id: true,
        },
      });

 

      const notifications = await Promise.all(
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

      
    //   for (const member of members) {
    //     const unreadCount = await this.getUnreadCount(member.id);
    //     SocketService.emitToUser(member.id, 'new-notification', {
    //       notification: notifications.find(n => n.recipientId === member.id),
    //       unreadCount
    //     });
    //   }

      
      SocketService.emitToOrganization(organizationId, 'organization-notification', {
        title,
        message,
        type,
        memberCount: members.length
      });
      

      return notifications;
    } catch (error) {
      console.error("Error creating notifications for organization:", error);
      throw error;
    }
  }

  /**
   * Tạo notification về event mới cho tất cả user trong organization (func đầu tiên dc gọi trong file này)
   */
  static async createEventNotification(event) {
    try {
      const { title, description, location, startAt, endAt, registrationStartAt, registrationEndAt, organizationId } = event;

  
      const formatDate = (date) => {
        if (!date) return "Chưa xác định";
        return new Date(date).toLocaleString("vi-VN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        });
      };

    
      const notificationTitle = `🌈 Sự kiện mới: ${title}`;
      
      let notificationMessage = `Có sự kiện mới được tạo!\n\n`;
      notificationMessage += `📅 Sự kiện: ${title}\n`;
      
      if (description) {
        notificationMessage += `📝 Mô tả: ${description}\n`;
      }
      
      if (location) {
        notificationMessage += `📍 Địa điểm: ${location}\n`;
      }
      
      notificationMessage += `\n⏰ Thời gian:\n`;
      notificationMessage += `• Bắt đầu: ${formatDate(startAt)}\n`;
      notificationMessage += `• Kết thúc: ${formatDate(endAt)}\n`;
      
      notificationMessage += `\n📝 Đăng ký:\n`;
      notificationMessage += `• Mở đăng ký: ${formatDate(registrationStartAt)}\n`;
      notificationMessage += `• Đóng đăng ký: ${formatDate(registrationEndAt)}\n`;
      
      notificationMessage += `\n🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia cùng các Nexer nhé!`;

      
      const notifications = await this.createNotificationForOrganization({
        title: notificationTitle,
        message: notificationMessage,
        type: "EVENT",
        organizationId,
      });

      
      return notifications;
    } catch (error) {
      console.error("Error creating event notifications:", error);
      throw error;
    }
  }





  /**
   * Lấy notifications của user
   */
  static async getUserNotifications(userId, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;

      const notifications = await prisma.notification.findMany({
        where: {
          recipientId: userId,
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      });

      const total = await prisma.notification.count({
        where: {
          recipientId: userId,
        },
      });

      return {
        notifications,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      console.error("Error getting user notifications:", error);
      throw error;
    }
  }








  /**
   * Đánh dấu notification đã đọc 1 thông báo cụ thể
   */
  static async markAsRead(notificationId, userId) {
    try {
      const notification = await prisma.notification.update({
        where: {
          id: notificationId,
          recipientId: userId, 
        },
        data: {
          isRead: true,
        },
      });

    
      const unreadCount = await this.getUnreadCount(userId);
      SocketService.emitToUser(userId, 'notification-read', {
        notificationId,
        unreadCount
      });

      return notification;
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  }





  /**
   * Đánh dấu tất cả notifications của user đã đọc
   */
  static async markAllAsRead(userId) {
    try {
      const result = await prisma.notification.updateMany({
        where: {
          recipientId: userId,
          isRead: false,
        },
        data: {
          isRead: true,
        },
      });

   
      SocketService.emitToUser(userId, 'all-notifications-read', {
        unreadCount: 0
      });

      return result;
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      throw error;
    }
  }






  /**
   * Lấy số lượng notifications chưa đọc
   */
  static async getUnreadCount(userId) {
    try {
      const count = await prisma.notification.count({
        where: {
          recipientId: userId,
          isRead: false,
        },
      });

      return count;
    } catch (error) {
      console.error("Error getting unread count:", error);
      throw error;
    }
  }
}