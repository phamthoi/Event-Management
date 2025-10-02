// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// export class NotificationService {
//   static async sendNotificationAdmin(notificationData) {
//     const { recipientId, title, message, type } = notificationData;
//     let notifications = [];

//     if (recipientId) {
//       // Gửi cho 1 member cụ thể
//       const notification = await prisma.notification.create({
//         data: {
//           title,
//           message,
//           type,
//           recipientId,
//         },
//       });
//       notifications.push(notification);
//     } else {
//       // Gửi cho toàn bộ member trong hệ thống
//       const members = await prisma.user.findMany({
//         where: { role: "MEMBER", isActive: true },
//         select: { id: true },
//       });

//       notifications = await Promise.all(
//         members.map((member) =>
//           prisma.notification.create({
//             data: {
//               title,
//               message,
//               type,
//               recipientId: member.id,
//             },
//           })
//         )
//       );
//     }

//     return {
//       notifications,
//       count: notifications.length
//     };
//   }







  
//   // Thêm method lấy thông báo
//   static async getNotifications({ userId, page = 1, limit = 10, isRead }) {
//     const skip = (page - 1) * limit;
    
//     const where = {
//       recipientId: userId
//     };
    
//     if (isRead !== undefined) {
//       where.isRead = isRead;
//     }
    
//     const [notifications, total] = await Promise.all([
//       prisma.notification.findMany({
//         where,
//         orderBy: {
//           createdAt: 'desc'
//         },
//         skip,
//         take: limit,
//         select: {
//           id: true,
//           title: true,
//           message: true,
//           type: true,
//           isRead: true,
//           createdAt: true
//         }
//       }),
//       prisma.notification.count({ where })
//     ]);
    
//     return {
//       notifications,
//       total
//     };
//   }

//   // Đánh dấu thông báo đã đọc
//   static async markAsRead(notificationId, userId) {
//     const notification = await prisma.notification.findFirst({
//       where: {
//         id: notificationId,
//         recipientId: userId
//       }
//     });
    
//     if (!notification) {
//       throw new Error("Không tìm thấy thông báo hoặc bạn không có quyền truy cập");
//     }
    
//     return await prisma.notification.update({
//       where: { id: notificationId },
//       data: { isRead: true }
//     });
//   }
// }