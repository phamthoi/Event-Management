import api from "../axios";

export const eventService = {
  
  getMyEvents: async () => {
    const res = await api.get(`/event`);
    return res.data;
  },

  
  getUpcomingEvents: async (page = 1, limit = 10) => {
    const res = await api.get(`/event/upcoming?page=${page}&limit=${limit}`);
    return res.data;
  },

  
  registerEvent: async (eventId) => {
    const res = await api.post(`/event/${eventId}/register`);
    return res.data;
  },

  
  cancelRegistration: async (eventId) => {
    const res = await api.delete(`/event/${eventId}/register`);
    return res.data;
  }
};
