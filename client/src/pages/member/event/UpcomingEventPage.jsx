// client/src/pages/events/UpcomingEventsPage.jsx
import React, { useEffect, useState } from "react";
// import {
//   getEvents,
//   getRegistrations,
//   registerEvent,
//   cancelRegistration,
// } from "../../../services/fakeApi";
import { getEventStatus } from "../../../utils/getEventStatus";
import EventCard from "../../../components/member/EventList/EventCard";

const UpcomingEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState({});
  const [page, setPage] = useState(1);
  const limit = 10; // Thay đổi từ 5 thành 10
  const [total, setTotal] = useState(0);

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const currentMemberId = currentUser?.id || 1;

  const loadEvents = () => {
    const stored = getEvents();
    let filtered = stored
      .map((ev) => ({ ...ev, status: getEventStatus(ev) }))
      .filter((ev) => ev.status === "DRAFT" || ev.status === "REGISTRATION");

    setTotal(filtered.length);

    const start = (page - 1) * limit;
    const end = start + limit;
    setEvents(filtered.slice(start, end));
  };

  const loadRegistrations = () => {
    setRegistrations(getRegistrations());
  };

  useEffect(() => {
    loadEvents();
    loadRegistrations();
  }, [page]);

  const handleToggleRegister = (event) => {
    const memberId = currentMemberId;
    if(event.status === "DRAFT"){
      alert("sự kiện này chưa mở để đăng ký");
      return
    }
    const registered = registrations[memberId]?.[event.id];
    const canCancel = registered && new Date() <= new Date(event.registrationEndAt);

    if (registered && canCancel) {
      cancelRegistration(memberId, event.id);
      alert("Đã hủy đăng ký");
    } else if (!registered) {
      registerEvent(memberId, event.id);
      alert("Đăng ký thành công");
    } else {
      return;
    }
    loadRegistrations();
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Upcoming Events</h1>
      {events.length === 0 ? (
        <div className="text-gray-500">Không có sự kiện sắp tới</div>
      ) : (
        <div className="space-y-4">
          {events.map((ev) => {
            const registered = !!registrations[currentMemberId]?.[ev.id];
            const remaining = ev.maxAttendees - (registered ? 1 : 0);
            const canCancel =
              registered && new Date() <= new Date(ev.registrationEndAt);

            return (
              <EventCard
                key={ev.id}
                event={ev}
                registered={registered}
                remaining={remaining}
                onToggleRegister={handleToggleRegister}
                canCancel={canCancel}
              />
            );
          })}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400 disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {page} / {Math.ceil(total / limit)}
        </span>
        <button
          disabled={page * limit >= total}
          onClick={() => setPage(page + 1)}
          className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UpcomingEventsPage;
