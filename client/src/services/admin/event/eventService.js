import api from "../../axios";

// Lấy danh sách events với filters
export const getEvents = async (filters = {}) => {
  const params = new URLSearchParams();
  
  // Sử dụng page và limit từ filters thay vì hardcode
  params.append('page', filters.page || '1');
  params.append('limit', filters.limit || '10');
  
  // Thêm các filter params khác
  Object.keys(filters).forEach(key => {
    if (filters[key] && key !== 'page' && key !== 'limit') {
      params.append(key, filters[key]);
    }
  });
  
  const res = await api.get(`/admin/events/list?${params.toString()}`);
  console.log('++Get events API response(service fe):', res.data);
  return res.data;
};

export const getEventById = async (id) => {
  const res = await api.get(`/admin/events/detail/${id}`);
  
  console.log(`🪣 [SERVER → CLIENT] Event ID: ${id} | Dữ liệu nhận từ server:`, JSON.stringify({
    startAt: res.data?.event?.startAt,
    endAt: res.data?.event?.endAt,
   
  }, null, 2));
  
  return res.data;
};

// Tạo event mới
export const createEvent = async (event) => {
  const res = await api.post("/admin/events/create", event);
  return res.data;
};

// Cập nhật event
export const updateEvent = async (id, updatedData) => {
  console.log(`🎉 [CLIENT SUBMIT(service)] Event ID: ${id} | Dữ liệu thời gian trước khi gửi lên server:`, JSON.stringify({
    startAt: updatedData.startAt,
    endAt: updatedData.endAt,
  }, null, 2));
  const res = await api.put(`/admin/events/edit/${id}`, updatedData);
  return res.data;
};

// Xóa event
export const deleteEvent = async (id) => {
  const res = await api.delete(`/admin/events/delete/${id}`);
  return res.data;
};

