import api from "../../axios";

// Lấy profile member hiện tại
export const getAdminProfile = async () => {
  const res = await api.get("/admin/profile");
  return res.data;
};

// Cập nhật profile
export const updateAdminProfile = async (updatedData) => {
  const res = await api.put("/admin/profile", updatedData);
  return res.data;
};

// Cập nhật password cho member
export const updateAdminPassword = async (currentPassword, newPassword) => {
  const res = await api.put("/admin/profile/password", {
    currentPassword,
    newPassword,
  });
  return res.data;
};
