import api from "./axios";

// Lấy danh sách đăng ký của event
export const getRegistrations = async (eventId) => {
  const res = await api.get(`/admin/events/${eventId}/registrations`);
  return res.data;
};

// Cập nhật điểm danh
export const updateAttendance = async (updates) => {
  const res = await api.put("/admin/registrations/attendance", { updates });
  return res.data;
};
