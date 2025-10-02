import api from "../axios";

export const eventService = {
  
  getMyEvents: async () => {
    const res = await api.get(`/events`);
    return res.data;
  },

  
  getUpcomingEvents: async (page = 1, limit = 10) => {
    const res = await api.get(`/events/upcoming?page=${page}&limit=${limit}`);
    return res.data;
  },

  
  registerEvent: async (eventId) => {
    const res = await api.post(`/events/${eventId}/register`);
    return res.data;
  },

  
  cancelRegistration: async (eventId) => {
    const res = await api.delete(`/events/${eventId}/register`);
    return res.data;
  }
};
