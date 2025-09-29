import React, { useEffect, useState } from "react";
import { getUpcomingEvents, registerEvent, cancelRegistration, getMemberRegistrations } from "../../../services/event/activeOfMemberService";
import { getEventStatus } from "../../../utils/getEventStatus";
import EventCard from "../../../components/member/EventList/EventCard";
import { showErrorAlert } from "../../../utils/member/errorHandler";

const UpcomingEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState({});
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const limit = 10;

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const currentMemberId = currentUser?.id;

  const loadEvents = async () => {
    try {
      setLoading(true);
      const res = await getUpcomingEvents(page, limit);
      const filteredEvents = res.events.map(ev => ({ ...ev, status: getEventStatus(ev) }));
      setEvents(filteredEvents);
      setTotal(res.total);
    } catch (err) {
      console.error("Error loading events:", err);
      showErrorAlert(err);
    } finally {
      setLoading(false);
    }
  };

  const loadRegistrations = async () => {
    try {
      const res = await getMemberRegistrations();
      const regMap = res.reduce((acc, r) => {
        acc[r.eventId] = true;
        return acc;
      }, {});
      setRegistrations({ [currentMemberId]: regMap });
    } catch (err) {
      console.error("Error loading registrations:", err);
      showErrorAlert(err);
    }
  };
 
  useEffect(() => {
    loadEvents();
    loadRegistrations();
  }, [page]);
  
  const handleToggleRegister = async (event) => {
    if (!currentMemberId) {
      alert("You are not logged in");
      return;
    }

    const registered = registrations[currentMemberId]?.[event.id];
    const canCancel = registered && new Date() <= new Date(event.registrationEndAt);

    try {
      if (registered && canCancel) {
        await cancelRegistration(event.id);
        alert("Registration cancelled");
      } else if (!registered) {
        if (event.status === "DRAFT") {
          alert("Event registration is not open yet");
          return;
        }
        await registerEvent(event.id);
        alert("Registration successful");
      } else {
        alert("Cannot cancel this event");
        return;
      }
      
      await loadEvents();
      await loadRegistrations();
    } catch (err) {
      console.error("Registration error:", err);
      showErrorAlert(err);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Upcoming Events</h1>
      {events.length === 0 ? (
        <div className="text-gray-500">No upcoming events</div>
      ) : (
        <div className="space-y-4">
          {events.map((ev) => {
            const registered = !!registrations[currentMemberId]?.[ev.id];
            const canCancel =
              registered && new Date() <= new Date(ev.registrationEndAt);

            return (
              <EventCard
                key={ev.id}
                event={ev}
                registered={registered}
                remaining={ev.registeredCount}
                onToggleRegister={handleToggleRegister}
                canCancel={canCancel}
                pageType="upcoming"
              />
            );
          })}
        </div>
      )}

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
