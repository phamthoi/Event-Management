//client/src/components/CreateEvent/CreateEventForm.jsx
import api from "../axios"; 

//API call to create a new event
export const createEvent = async (payload) => {
    const res = await api.post("/admin/events/create", payload);
    return res.data
};