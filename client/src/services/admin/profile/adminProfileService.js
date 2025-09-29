import api from "../../axios";


export const getAdminProfile = async () => {
  const res = await api.get("/admin/profile");
  return res.data;
};


export const updateAdminProfile = async (updatedData) => {
  const res = await api.put("/admin/profile", updatedData);
  return res.data;
};


export const updateAdminPassword = async (currentPassword, newPassword) => {
  const res = await api.put("/admin/profile/password", {
    currentPassword,
    newPassword,
  });
  return res.data;
};
