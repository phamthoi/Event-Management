// client/src/pages/events/MyEventsPage.jsx
import React, { useEffect, useState } from "react";
// import { getEvents, getRegistrations, cancelRegistration } from "../../../services/fakeApi";
import { getEventStatus } from "../../../utils/getEventStatus";
import EventCard from "../../../components/member/EventList/EventCard";

const MyEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState({});

  const loadEvents = () => {
    const allEvents = getEvents();
    const regs = getRegistrations();

    // Lọc ra chỉ những event đã đăng ký
    const myEvents = allEvents
      .map((ev) => ({ ...ev, status: getEventStatus(ev) }))
      .filter((ev) => regs[ev.id]); // chỉ lấy event đã đăng ký

    setEvents(myEvents);
    setRegistrations(regs);
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleCancel = (event) => {
    const canCancel = new Date() <= new Date(event.registrationEndAt);
    if (!canCancel) {
      alert("Sự kiện này đã đóng đăng ký, không thể hủy.");
      return;
    }
    cancelRegistration(event.id);
    alert("Đã hủy đăng ký");
    loadEvents();
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">My Events</h1>
      {events.length === 0 ? (
        <div className="text-gray-500">Bạn chưa đăng ký sự kiện nào</div>
      ) : (
        <div className="space-y-4">
          {events.map((ev) => {
            const canCancel = ev.status === "REGISTRATION" && new Date() <= new Date(ev.registrationEndAt);
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
