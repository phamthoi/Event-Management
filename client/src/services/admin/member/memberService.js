import api from "../../axios";

// Tạo member mới
export const createMember = async (memberData) => {
  const res = await api.post("/admin/members/create", memberData);
  return res.data;
};

// Lấy danh sách member với filters và pagination
export const getMembers = async (params = {}) => {
  const queryParams = new URLSearchParams();
  
  // Thêm các params vào query string
  Object.keys(params).forEach(key => {
    if (params[key] !== "" && params[key] !== null && params[key] !== undefined) {
      queryParams.append(key, params[key]);
    }
  });
  
  const res = await api.get(`/admin/members/list?${queryParams.toString()}`);
  return res.data;
};

// Lấy thông tin chi tiết member theo ID
export const getMemberById = async (id) => {
  const res = await api.get(`/admin/members/${id}`);
  return res.data;
};

// Khóa member
export const MemberLock = async (id) => {
  const res = await api.put(`/admin/members/${id}/lock`);
  return res.data;
};

// Mở khóa member
export const MemberUnlock = async (id) => {
  const res = await api.put(`/admin/members/${id}/unlock`);
  return res.data;
};

// Reset password member
export const resetMemberPassword = async (id) => {
  const res = await api.put(`/admin/members/${id}/reset-password`);
  return res.data;
};


