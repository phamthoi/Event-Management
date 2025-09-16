// utils/getEventStatus.js
export function getEventStatus(event) {
  const now = new Date();

  const registrationStart = event.registrationStartAt
    ? new Date(event.registrationStartAt)
    : null;
  const registrationEnd = event.registrationEndAt
    ? new Date(event.registrationEndAt)
    : null;
  const start = event.startAt ? new Date(event.startAt) : null;
  const end = event.endAt ? new Date(event.endAt) : null;

  // Nếu backend có sẵn status thì ưu tiên
  if (event.status) return event.status;

  // 1️⃣ Chưa tới lúc mở đăng ký
  if (registrationStart && now < registrationStart) return "DRAFT";

  // 2️⃣ Trong thời gian đăng ký
  if (
    registrationStart &&
    registrationEnd &&
    now >= registrationStart &&
    now < registrationEnd
  ) {
    return "REGISTRATION";
  }

  // 3️⃣ Kết thúc đăng ký -> kiểm tra đủ minAttendees
  if (registrationEnd && now >= registrationEnd && start && now < start) {
    if (event.attendees && event.attendees.length >= (event.minAttendees || 1)) {
      return "READY";
    }
    return "CANCELLED";
  }

  // 4️⃣ Đang diễn ra
  if (start && end && now >= start && now < end) return "ONGOING";

  // 5️⃣ Hoàn tất
  if (end && now >= end) return "COMPLETED";

  return "UNKNOWN";
}
