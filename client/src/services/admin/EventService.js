import api from "../axios";

export const getEvents = async (page = 1, limit = 5, filters = {}) => {
  const params = { page, limit, ...filters };

  try {
    const res = await api.get("/admin/events/list", { params });
    return res.data; // { events, total }
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message || "Error loading events");
  }
};

export const deleteEvent = async (eventId) => {
  try {
    const res = await api.delete(`/admin/events/${eventId}`);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message || "Delete failed");
  }
};




