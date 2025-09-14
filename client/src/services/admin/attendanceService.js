//client/src/services/AttendanceService.js
import api from "../axios";

// Lấy danh sách sự kiện
export const getEvents = () => api.get("/admin/events/list");

// Lấy danh sách đăng ký (registrations) theo eventId
export const getRegistrations = (eventId) =>
  api.get(`/admin/events/${eventId}/registrations`);

// Cập nhật điểm danh
export const updateAttendance = (updates) =>
  api.put("/admin/registrations/attendance", { updates });
