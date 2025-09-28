export function calculateEventStatus(event) {
  const now = new Date();

  const registrationStart = event.registrationStartAt
    ? new Date(event.registrationStartAt)
    : null;
  const registrationEnd = event.registrationEndAt
    ? new Date(event.registrationEndAt)
    : null;
  const start = event.startAt ? new Date(event.startAt) : null;
  const end = event.endAt ? new Date(event.endAt) : null;
  const attendees = event.attendees || [];
  const minAttendees = event.minAttendees || 1;

  // 1️⃣ Chưa tới lúc mở đăng ký
  if (registrationStart && now < registrationStart) return "DRAFT";

  // 2️⃣ Trong thời gian đăng ký
  if (registrationStart && registrationEnd && now >= registrationStart && now < registrationEnd) {
    return "REGISTRATION";
  }

  // 3️⃣ Hết hạn đăng ký, chưa đến thời gian bắt đầu
  if (registrationEnd && now >= registrationEnd && start && now < start) {
    return attendees.length >= minAttendees ? "READY" : "CANCELLED";
  }

  // 4️⃣ Đang diễn ra
  if (start && end && now >= start && now < end) return "ONGOING";

  // 5️⃣ Hoàn tất
  if (end && now >= end) return "COMPLETED";

  // 6️⃣ Nếu chưa có thông tin thời gian, giữ trạng thái DRAFT
  return "DRAFT";
}
