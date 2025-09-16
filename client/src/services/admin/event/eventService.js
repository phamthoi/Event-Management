import api from "../../axios";

// Lấy danh sách events với filters
export const getEvents = async (filters = {}) => {
  const params = new URLSearchParams();
  
  // Thêm các filter params
  Object.keys(filters).forEach(key => {
    if (filters[key]) {
      params.append(key, filters[key]);
    }
  });
  
  const res = await api.get(`/admin/events/list?${params.toString()}`);
  return res.data;
};

export const getEventById = async (id) => {
  const res = await api.get(`/admin/events/detail/${id}`);
  return res.data;
};

// Tạo event mới
export const createEvent = async (event) => {
  const res = await api.post("/admin/events/create", event);
  return res.data;
};

// Cập nhật event
export const updateEvent = async (id, updatedData) => {
  const res = await api.put(`/admin/events/edit/${id}`, updatedData);
  return res.data;
};

// Xóa event
export const deleteEvent = async (id) => {
  const res = await api.delete(`/admin/events/delete/${id}`);
  return res.data;
};

