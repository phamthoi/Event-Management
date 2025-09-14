export const getEventById = async (id) => {
  const res = await api.get(`/admin/events/${id}`);
  return res.data;
};

export const updateEvent = async (id, payload) => {
  const res = await api.put(`/admin/edit-event/${id}`, payload);
  return res.data;
};
