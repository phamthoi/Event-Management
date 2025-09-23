// client/services/notification.service.js
import api from "./axios";

/**
 * Lấy danh sách notifications của user hiện tại
 * @param {Object} params - page, limit, isRead
 * @returns {Object} { success, data, pagination }
 */
export const getNotifications = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams(params).toString();
    const res = await api.get(`/notifications?${queryParams}`);
    return res.data; // { success, data, pagination }
  } catch (error) {
    console.error("Error fetching notifications:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Gửi notification (chỉ admin)
 * @param {Object} notificationData - { recipientId?, title, message, type? }
 * @returns {Object} { success, message, count }
 */
export const sendNotification = async (notificationData) => {
  try {
    const res = await api.post("/notifications/send", notificationData);
    return res.data;
  } catch (error) {
    console.error("Error sending notification:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Đánh dấu notification đã đọc
 * @param {number} notificationId
 * @returns {Object} { success, message }
 */
export const markAsRead = async (notificationId) => {
  try {
    const res = await api.put(`/notifications/${notificationId}/read`);
    return res.data;
  } catch (error) {
    console.error("Error marking notification as read:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Lấy danh sách users để chọn recipient (chỉ admin)
 * @returns {Array} members
 */
export const fetchUsers = async () => {
  try {
    const res = await api.get("/admin/members/list");
    return res.data.members || []; // Lấy đúng mảng members
  } catch (error) {
    console.error("Error fetching users:", error.response?.data || error.message);
    throw error;
  }
};
