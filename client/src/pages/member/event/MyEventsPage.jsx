// client/src/pages/events/MyEventsPage.jsx
import React, { useEffect, useState } from "react";
// import { getEvents } from "../../../services/admin/event/eventService";
// import { getMemberRegistrations, cancelRegistration } from "../../../services/member/activeOfMember";
import { getEventStatus } from "../../../utils/getEventStatus";
import EventCard from "../../../components/member/EventList/EventCard";

// ============= Fake =================
// Fake data
const fakeEvents = Array.from({ length: 10 }, (_, i) => {
  const status = i % 3 === 0 ? "DRAFT" : "REGISTRATION"; // 1/3 draft, còn lại open
  const now = new Date();
  const regEnd = new Date(now);
  regEnd.setDate(now.getDate() + (i % 5)); // registrationEndAt vài ngày nữa
  return {
    id: i + 1,
    name: `Event ${i + 1}`,
    description: `Description for Event ${i + 1}`,
    maxAttendees: 10 + i,
    registrationEndAt: regEnd.toISOString(),
    status,
  };
});

// Fake member registrations
let fakeRegs = {
  1: [2, 3, 5], // memberId = 1 đã đăng ký eventId 2,3,5
};
// ================ END ==========

const MyEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fake member Id = 1
  const currentMemberId = 1;

  const loadEvents = async () => {
    try {
      setLoading(true);

      // ======= API thật =======
      // const allEvents = await getEvents();
      // const regs = await getMemberRegistrations();

      // ======= Thay bằng fake =======
      const allEvents = fakeEvents;
      const regs = fakeRegs[currentMemberId] || [];

      // Lọc ra chỉ những event đã đăng ký
      const myEvents = allEvents
        .map((ev) => ({ ...ev, status: getEventStatus(ev) }))
        .filter((ev) => regs.includes(ev.id)); // chỉ lấy event user đã đăng ký

      setEvents(myEvents);
    } catch (err) {
      console.error("Load events error:", err);
      alert("Không thể tải sự kiện của bạn");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleCancel = async (event) => {
    const canCancel =
      event.status === "REGISTRATION" &&
      new Date() <= new Date(event.registrationEndAt);

    if (!canCancel) {
      alert("Sự kiện này đã đóng đăng ký, không thể hủy.");
      return;
    }

    try {
      // =======  API thật =======
      // await cancelRegistration(event.id);

      // ======= Thay bằng fake =======
      const newRegs = (fakeRegs[currentMemberId] || []).filter(
        (id) => id !== event.id
      );
      fakeRegs[currentMemberId] = newRegs;

      alert("Đã hủy đăng ký thành công");
      loadEvents(); // reload lại danh sách
    } catch (err) {
      console.error("Cancel registration error:", err);
      alert("Hủy đăng ký thất bại");
    }
  };

  if (loading) return <p className="text-center mt-10">Đang tải...</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">My Events</h1>
      {events.length === 0 ? (
        <div className="text-gray-500">Bạn chưa đăng ký sự kiện nào</div>
      ) : (
        <div className="space-y-4">
          {events.map((ev) => {
            const canCancel =
              ev.status === "REGISTRATION" &&
              new Date() <= new Date(ev.registrationEndAt);

            return (
              <EventCard
                key={ev.id}
                event={ev}
                registered={true}
                remaining={ev.maxAttendees - 1}
                onToggleRegister={() => handleCancel(ev)}
                canCancel={canCancel}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyEventsPage;