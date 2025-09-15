// client/src/services/MemberListService.js

import api from "../axios"; 

const MEMBER_KEY = "members";

const fakeMembers = [
  { id: 1, email: "alice@example.com", fullName: "Alice Nguyen", phoneNumber: "0901234567", isActive: true, password: "1234" },
  { id: 2, email: "bob@example.com", fullName: "Bob Tran", phoneNumber: "0912345678", isActive: false, password: "1234" },
  { id: 3, email: "charlie@example.com", fullName: "Charlie Pham", phoneNumber: "0987654321", isActive: true, password: "1234" },
  { id: 4, email: "david@example.com", fullName: "David Le", phoneNumber: "0934567890", isActive: true, password: "1234" },
  { id: 5, email: "eva@example.com", fullName: "Eva Hoang", phoneNumber: "0971234567", isActive: false, password: "1234" },
  { id: 6, email: "frank@example.com", fullName: "Frank Vu", phoneNumber: "0956781234", isActive: true, password: "1234" },
];

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

export const saveMembers = (members) => {
  localStorage.setItem(MEMBER_KEY, JSON.stringify(members));
};

export const toggleMemberLock = (id) => {
  const members = getMembers();
  const updated = members.map((m) => (m.id === id ? { ...m, isActive: !m.isActive } : m));
  saveMembers(updated);
  return updated.find((m) => m.id === id);
};

export const resetMemberPassword = (id) => {
  const members = getMembers();
  const updated = members.map((m) => (m.id === id ? { ...m, password: "Member@123" } : m));
  saveMembers(updated);
  return updated.find((m) => m.id === id);
};
