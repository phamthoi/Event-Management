import api from "../../axios";

// Lấy danh sách events đã đăng ký của member
export const getMemberRegistrations = async () => {
  const res = await api.get('/member/events');
  return res.data;
};

// Lấy upcoming events
export const getUpcomingEvents = async (page = 1, limit = 10) => {
  const res = await api.get(`/member/events/upcoming?page=${page}&limit=${limit}`);
  return res.data;
};

// Member đăng ký 1 event
export const registerEvent = async (eventId) => {
  const res = await api.post(`/member/events/${eventId}/register`);
  return res.data;
};

// Member hủy đăng ký 1 event
export const cancelRegistration = async (eventId) => {
  const res = await api.delete(`/member/events/${eventId}/register`);
  return res.data;
};

// Lấy danh sách members cùng organization - moved to memberService
// export const getMembers = async () => {
//   const res = await api.get('/member/members');
//   return res.data;
// };

// Đổi mật khẩu - moved to profileService
// export const updateMemberPassword = async (currentPassword, newPassword) => {
//   const res = await api.put('/member/profile/password', {
//     currentPassword,
//     newPassword
//   });
//   return res.data;
// };