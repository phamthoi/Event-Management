import api from "../axios";

// Lấy danh sách đăng ký của 1 member
export const getMemberRegistrations = async (memberId) => {
  const res = await api.get(`/member/${memberId}/registrations`);
  return res.data; // { eventId: true, ... } hoặc danh sách registration
};

// Member đăng ký 1 event
export const registerEvent = async (eventId) => {
  const res = await api.post(`/member/register/${eventId}`);
  return res.data;
};

// Member hủy đăng ký 1 event
export const cancelRegistration = async (eventId) => {
  const res = await api.delete(`/member/unregister/${eventId}`);
  return res.data;
};