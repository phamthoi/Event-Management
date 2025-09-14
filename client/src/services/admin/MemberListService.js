// client/src/services/memberService.js

import api from "../axios"; 

// Lấy danh sách member (có filter + pagination)
export const fetchMembers = async ({ page, limit, email, fullName, isActive }) => {
  const params = new URLSearchParams({ page, limit });
  if (email) params.append("email", email);
  if (fullName) params.append("fullName", fullName);
  if (isActive) params.append("isActive", isActive);

  const res = await api.get(`/admin/members/list?${params.toString()}`);
  return res.data;
};

// Khóa / mở khóa member
export const toggleMemberLock = async (id, isActive) => {
  const res = await api.post(`/admin/members/${id}/${isActive ? "lock" : "unlock"}`);
  return res.data;
};

// Reset password
export const resetMemberPassword = async (id) => {
  const res = await api.post(`/admin/members/${id}/reset-password`);
  return res.data;
};
