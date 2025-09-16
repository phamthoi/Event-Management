import api from "../../axios";

// Lấy danh sách events
export const getEvents = async () => {
  const res = await api.get("/admin/events/list");
  return res.data.events;
};

// Lấy chi tiết event
export const getEventById = async (id) => {
  const res = await api.get(`/admin/events/detail/${id}`);
  return res.data.event;
};

// Tạo event mới
export const createEvent = async (event) => {
  const res = await api.post("/admin/events/create", event);
  return res.data;
};

// Cập nhật event
export const updateEvent = async (id, updatedData) => {
  const res = await api.put(`/admin/events/${id}`, updatedData);
  return res.data;
};

// Xóa event
export const deleteEvent = async (id) => {
  const res = await api.delete(`/admin/events/${id}`);
  return res.data;
};

