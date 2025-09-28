import api from "../../axios";

export const getProfile = async () => {
  const res = await api.get("/member/profile");
  return res.data;
};

export const updateProfile = async (updatedData) => {
  const res = await api.put("/member/profile", updatedData);
  return res.data;
};

export const updateMemberPassword = async (currentPassword, newPassword) => {
  const res = await api.put("/member/profile/password", {
    currentPassword,
    newPassword,
  });
  return res.data;
};
