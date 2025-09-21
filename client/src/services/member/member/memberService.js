import api from "../../axios";

// Lấy danh sách members cùng organization
export const getMembers = async (params = {}) => {
  const { page = 1, limit = 10, email = '', fullName = '' } = params;
  
  // Tạo query string từ params
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(email && { email }),
    ...(fullName && { fullName })
  });
  
  const res = await api.get(`/member/members?${queryParams}`);
  return res.data;
};