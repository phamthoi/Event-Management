import api from "../axios";

/*export const getEvents = async (page = 1, limit = 5, filters = {}) => {
  const params = { page, limit, ...filters };

  try {
    const res = await api.get("/admin/events/list", { params });
    return res.data; // { events, total }
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message || "Error loading events");
  }
};
*/

// Lấy events từ localStorage hoặc seed fake data
export const getEvents = () => {
  const fakeEvents = [
  {
    id: 1,
    title: "Event A",
    description: "Tech conference about AI",
    location: "Hotel Saigon",
    minAttendees: 10,
    maxAttendees: 100,
    deposit: 100000,
    startAt: "2025-09-21T12:30:00",
    endAt: "2025-09-21T17:00:00",
    registrationStartAt: "2025-09-10T08:00:00",
    registrationEndAt: "2025-09-20T23:59:59",
  },
  {
    id: 2,
    title: "Event B",
    description: "Workshop về React",
    location: "UIT Campus",
    minAttendees: 5,
    maxAttendees: 50,
    deposit: 50000,
    startAt: "2025-09-22T09:00:00",
    endAt: "2025-09-22T12:00:00",
    registrationStartAt: "2025-09-12T08:00:00",
    registrationEndAt: "2025-09-21T23:59:59",
  },
  {
    id: 3,
    title: "Event C",
    description: "Hackathon 24h",
    location: "Innovation Hub",
    minAttendees: 20,
    maxAttendees: 200,
    deposit: 200000,
    startAt: "2025-09-25T08:00:00",
    endAt: "2025-09-26T08:00:00",
    registrationStartAt: "2025-09-15T08:00:00",
    registrationEndAt: "2025-09-24T23:59:59",
  },
  {
    id: 4,
    title: "Event D",
    description: "Seminar về An ninh mạng",
    location: "UIT Auditorium",
    minAttendees: 15,
    maxAttendees: 150,
    deposit: 80000,
    startAt: "2025-09-27T13:00:00",
    endAt: "2025-09-27T17:30:00",
    registrationStartAt: "2025-09-18T08:00:00",
    registrationEndAt: "2025-09-26T23:59:59",
  },
  {
    id: 5,
    title: "Event E",
    description: "Khóa học Docker cơ bản",
    location: "Online",
    minAttendees: 8,
    maxAttendees: 40,
    deposit: 60000,
    startAt: "2025-09-29T19:00:00",
    endAt: "2025-09-29T21:00:00",
    registrationStartAt: "2025-09-20T08:00:00",
    registrationEndAt: "2025-09-28T23:59:59",
  },
  {
    id: 6,
    title: "Event F",
    description: "Giải bóng đá sinh viên",
    location: "SVĐ Quận 9",
    minAttendees: 22,
    maxAttendees: 100,
    deposit: 120000,
    startAt: "2025-10-02T08:00:00",
    endAt: "2025-10-02T18:00:00",
    registrationStartAt: "2025-09-22T08:00:00",
    registrationEndAt: "2025-10-01T23:59:59",
  },
];

  
  let stored = JSON.parse(localStorage.getItem("events"));
  if (!stored || stored.length === 0) {
    localStorage.setItem("events", JSON.stringify(fakeEvents));
    stored = fakeEvents;
  }
  return stored;
};

const REGISTRATION_KEY = "registrations";

// Quản lý đăng ký member
export const getRegistrations = () => {
  return JSON.parse(localStorage.getItem(REGISTRATION_KEY)) || {};
};


// Lấy danh sách đăng ký của một member cụ thể
export const getMemberRegistrations = (memberId) => {
  const regs = getRegistrations();
  return regs[memberId] || {}; // { eventId: true, ... }
};

// Member đăng ký event
export const registerEvent = (memberId, eventId) => {
  if (!memberId || !eventId) {
    throw new Error("memberId và eventId là bắt buộc");
  }

  const regs = getRegistrations();

  // Đảm bảo luôn là object
  if (typeof regs[memberId] !== "object" || regs[memberId] === null) {
    regs[memberId] = {};
  }

  regs[memberId][eventId] = true;
  localStorage.setItem(REGISTRATION_KEY, JSON.stringify(regs));
  return true;
};

// Member hủy đăng ký
export const cancelRegistration = (memberId, eventId) => {
  const regs = getRegistrations();

  if (typeof regs[memberId] === "object" && regs[memberId] !== null) {
    delete regs[memberId][eventId];
    if (Object.keys(regs[memberId]).length === 0) {
      delete regs[memberId]; // nếu không còn event nào thì xóa luôn
    }
  }

  localStorage.setItem(REGISTRATION_KEY, JSON.stringify(regs));
  return true;
};

export const deleteEvent = async (eventId) => {
  try {
    const res = await api.delete(`/admin/events/${eventId}`);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message || "Delete failed");
  }
};




