// client/src/services/member/memberService.js
import api from "../axios";

export const getProfile = async () => {
  const res = await api.get("/member/profile");
  return res.data;
};

export const updateProfile = async (payload) => {
  const res = await api.put("/member/profile", payload);
  return res.data;
};