import { NotificationService } from '../services/notification.service.js';

export class NotificationController {
  static async sendNotificationAdmin(req, res) {
    try {
      if (req.user.role !== "ADMIN") {
        return res.status(403).json({ 
          success: false, 
          message: "Chỉ admin mới có quyền gửi thông báo" 
        });
      }

      const { recipientId, title, message, type } = req.body;

      if (!title || !message) {
        return res.status(400).json({ 
          success: false, 
          message: "Thiếu tiêu đề hoặc nội dung thông báo" 
        });
      }

      const notificationData = {
        recipientId: recipientId ? parseInt(recipientId) : null,
        title,
        message,
        type: type || "GENERAL"
      };

      const result = await NotificationService.sendNotificationAdmin(notificationData);
      
      res.json({
        success: true,
        message: "Thông báo đã được gửi",
        count: result.count
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }




  // method chung
  static async getNotifications(req, res) {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 10, isRead } = req.query;
      
      const result = await NotificationService.getNotifications({
        userId,
        page: parseInt(page),
        limit: parseInt(limit),
        isRead: isRead !== undefined ? isRead === 'true' : undefined
      });
      
      res.json({
        success: true,
        data: result.notifications,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: result.total,
          totalPages: Math.ceil(result.total / parseInt(limit))
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Đánh dấu thông báo đã đọc
  static async markAsRead(req, res) {
    try {
      const userId = req.user.id;
      const { notificationId } = req.params;
      
      await NotificationService.markAsRead(parseInt(notificationId), userId);
      
      res.json({
        success: true,
        message: "Đã đánh dấu thông báo là đã đọc"
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}