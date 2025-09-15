// Fake data ban đầu
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


const fakeMembers = [
  {
    id: 1,
    email: "alice@example.com",
    fullName: "Alice Nguyen",
    phoneNumber: "0901234567",
    isActive: true,
    password: "1234",
  },
  {
    id: 2,
    email: "bob@example.com",
    fullName: "Bob Tran",
    phoneNumber: "0912345678",
    isActive: false,
    password: "1234",
  },
  {
    id: 3,
    email: "charlie@example.com",
    fullName: "Charlie Pham",
    phoneNumber: "0987654321",
    isActive: true,
    password: "1234",
  },
  {
    id: 4,
    email: "david@example.com",
    fullName: "David Le",
    phoneNumber: "0934567890",
    isActive: true,
    password: "1234",
  },
  {
    id: 5,
    email: "eva@example.com",
    fullName: "Eva Hoang",
    phoneNumber: "0971234567",
    isActive: false,
    password: "1234",
  },
  {
    id: 6,
    email: "frank@example.com",
    fullName: "Frank Vu",
    phoneNumber: "0956781234",
    isActive: true,
    password: "1234",
  },
];




// ----------- FAKE EVENT API ------------
const MEMBER_KEY = "members";
//get member
export const getMembers = () => {
  let stored = JSON.parse(localStorage.getItem(MEMBER_KEY));
  if (!stored || stored.length === 0) {
    localStorage.setItem(MEMBER_KEY, JSON.stringify(fakeMembers));
    stored = fakeMembers;
  }
  // Ensure every member has a password (useful nếu trước đó bị ghi đè)
  const fixed = stored.map(m => ({ ...m, password: m.password ?? "1234" }));
  localStorage.setItem(MEMBER_KEY, JSON.stringify(fixed));
  return fixed;
};

export const toggleMemberLock = (id) => {
  const members = getMembers();
  const updated = members.map((m) => (m.id === id ? { ...m, isActive: !m.isActive } : m));
  saveMembers(updated);
  return updated.find((m) => m.id === id);
};

export const saveMembers = (members) => {
  localStorage.setItem(MEMBER_KEY, JSON.stringify(members));
};

export const resetMemberPassword = (id) => {
  const members = getMembers();
  const updated = members.map((m) => (m.id === id ? { ...m, password: "Member@123" } : m));
  saveMembers(updated);
  return updated.find((m) => m.id === id);
};

export function getEventById(id) {
  const events = JSON.parse(localStorage.getItem(EVENTS_KEY)) || [];
  const event = events.find((e) => e.id === Number(id));
  return Promise.resolve(event || null);
}

export function addEvent(event) {
  const events = JSON.parse(localStorage.getItem(EVENTS_KEY)) || [];
  const newEvent = { ...event, id: Date.now() };
  events.push(newEvent);
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  return Promise.resolve(newEvent);
}

export function updateEvent(id, updatedData) {
  const events = JSON.parse(localStorage.getItem(EVENTS_KEY)) || [];
  const idx = events.findIndex((e) => e.id === Number(id));
  if (idx !== -1) {
    events[idx] = { ...events[idx], ...updatedData };
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
    return Promise.resolve(events[idx]);
  }
  return Promise.reject("Event not found");
}

export function deleteEvent(id) {
  let events = JSON.parse(localStorage.getItem(EVENTS_KEY)) || [];
  events = events.filter((e) => e.id !== Number(id));
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  return Promise.resolve(true);
}

// ----------- FAKE MEMBER API ------------

export function getProfile() {
  const token = localStorage.getItem("token");
  if (!token) return Promise.reject("Not authenticated");

  const id = parseInt(token.split("-").pop());
  const members = JSON.parse(localStorage.getItem(MEMBER_KEY)) || [];
  const user = members.find((m) => m.id === id);
  return Promise.resolve(user || null);
}

export function updateProfile(updatedData) {
  const token = localStorage.getItem("token");
  if (!token) return Promise.reject("Not authenticated");

  const id = parseInt(token.split("-").pop()); // lấy id từ token
  let members = JSON.parse(localStorage.getItem(MEMBER_KEY)) || [];
  const idx = members.findIndex((m) => m.id === id);

  if (idx !== -1) {
    members[idx] = { ...members[idx], ...updatedData };
    localStorage.setItem(MEMBER_KEY, JSON.stringify(members)); // lưu lại
    return Promise.resolve(members[idx]);
  }
  return Promise.reject("User not found");
}

// Cập nhật password cho member
export function updateMemberPassword(currentPassword, newPassword) {
  const token = localStorage.getItem("token");
  if (!token) return Promise.reject("Not authenticated");

  const id = parseInt(token.split("-").pop());
  let members = JSON.parse(localStorage.getItem(MEMBER_KEY)) || [];
  const idx = members.findIndex((m) => m.id === id);

  if (idx === -1) return Promise.reject("User not found");
  if (members[idx].password !== currentPassword) return Promise.reject("Current password is incorrect");

  members[idx].password = newPassword;
  localStorage.setItem(MEMBER_KEY, JSON.stringify(members));
  return Promise.resolve(true);
}


{/*đăng ký sự kiện  */}

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
