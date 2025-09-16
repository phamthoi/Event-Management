import api from "./axios";

// Lấy profile member hiện tại
export const getProfile = async () => {
  const res = await api.get("/member/profile");
  return res.data;
};

// Cập nhật profile
export const updateProfile = async (updatedData) => {
  const res = await api.put("/member/profile", updatedData);
  return res.data;
};

// Cập nhật password cho member
export const updateMemberPassword = async (currentPassword, newPassword) => {
  const res = await api.put("/member/profile/password", {
    currentPassword,
    newPassword,
  });
  return res.data;
};
