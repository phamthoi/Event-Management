import api from "../../axios";

// Lấy danh sách đăng ký của event
export const getRegistrations = async (eventId) => {
  const res = await api.get(`/admin/events/registrations/${eventId}`);
  
  return res.data;
};

// Cập nhật điểm danh
export const updateAttendance = async (updates) => {
  const res = await api.put(`/admin/events/attendance`, { updates });
  
  return res.data;
};












// Lấy danh sách đăng ký của 1 member
export const getMemberRegistrations = async (memberId) => {
  const res = await api.get(`/admin/member/registrations/${memberId}`);
  return res.data; // { eventId: true, ... } hoặc danh sách registration
};

// Member đăng ký 1 event
export const registerEvent = async (memberId, eventId) => {
  const res = await api.post(`/admin/member/registrations/${memberId}/${eventId}`);
  return res.data;
};

// Member hủy đăng ký 1 event
export const cancelRegistration = async (memberId, eventId) => {
  const res = await api.delete(`/admin/member/registrations/${memberId}/${eventId}`);
  return res.data;
};
