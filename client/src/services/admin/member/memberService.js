import api from "./axios";

// Tạo member mới
export const createMember = async (memberData) => {
  const res = await api.post("/admin/members/create", memberData);
  return res.data;
};

// Lấy danh sách member
export const getMembers = async () => {
  const res = await api.get("/admin/members/list");
  return res.data;
};

// Khóa / mở khóa member
export const toggleMemberLock = async (id) => {
  const res = await api.put(`/admin/members/${id}/lock`);
  return res.data;
};

export const MemberLock = async (id) => {
  const res = await api.put(`/admin/members/${id}/lock`);
  return res.data;
};

export const MemberUnlock = async (id) => {
  const res = await api.put(`/admin/members/${id}/unlock`);
  return res.data;
};

// Reset password member
export const resetMemberPassword = async (id) => {
  const res = await api.put(`/admin/members/${id}/reset-password`);
  return res.data;
};
