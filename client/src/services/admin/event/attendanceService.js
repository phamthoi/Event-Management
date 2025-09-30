import api from "../../axios";


export const getOngoingEvents = async () => {
  const res = await api.get('/admin/events/ongoing');
  return res.data;
};


export const getRegistrations = async (eventId) => {
  const res = await api.get(`/admin/events/registrations/${eventId}`);
  return res.data;
};


// export const updateAttendance = async (updates) => {
//   const res = await api.put(`/admin/events/attendance`, { updates });
  
//   return res.data;
// };

export const updateRegistrationStatus = async (updates) => {
  // updates là array: [{ registrationId, depositPaid, attended }]
  const res = await api.put(`/admin/events/registrations/update-status`, { updates });
  return res.data;
};


export const getMemberRegistrations = async (memberId) => {
  const res = await api.get(`/admin/member/registrations/${memberId}`);
  return res.data; 
};


export const registerEvent = async (memberId, eventId) => {
  const res = await api.post(`/admin/member/registrations/${memberId}/${eventId}`);
  return res.data;
};


export const cancelRegistration = async (memberId, eventId) => {
  const res = await api.delete(`/admin/member/registrations/${memberId}/${eventId}`);
  return res.data;
};
