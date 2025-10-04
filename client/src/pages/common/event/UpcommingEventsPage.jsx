import React, { useState, useEffect } from "react";
import EventCard from "../../../components/common/eventList/EventCard";
import { eventService } from "../../../services/common/event/eventService.js";
import { showErrorAlert } from "../../../utils/errorHandler";
import { getEventStatus } from "../../../utils/getEventStatus";
import * as Toast from "@radix-ui/react-toast";

const UpcomingEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState({});
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: "", type: "success" });
  const limit = 10;

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const currentMemberId = currentUser?.id;

  const loadData = async () => {
    try {
      setLoading(true);
      const [eventsRes, regsRes] = await Promise.all([
        eventService.getUpcomingEvents(page, limit),
        eventService.getMyEvents()
      ]);

      const filteredEvents = eventsRes.events.map(ev => ({ ...ev, status: getEventStatus(ev) }));
      setEvents(filteredEvents);

      const regMap = regsRes.reduce((acc, r) => {
        acc[r.eventId] = true;
        return acc;
      }, {});
      setRegistrations(regMap);

      setTotal(eventsRes.total);
    } catch (err) {
      showErrorAlert(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page]);

  const handleToggleRegister = async (event) => {
    if (!currentMemberId) {
      setToast({ open: true, message: "You are not logged in", type: "error" });
      return;
    }

    const registered = registrations[event.id];
    const canCancel = registered && new Date() <= new Date(event.registrationEndAt);

    try {
      if (registered && canCancel) {
        await eventService.cancelRegistration(event.id);
        setToast({ open: true, message: "Registration cancelled", type: "success" });
      } else if (!registered) {
        if (event.status === "DRAFT") {
          setToast({ open: true, message: "Event registration not open", type: "error" });
          return;
        }
        await eventService.registerEvent(event.id);
        setToast({ open: true, message: "Registration successful", type: "success" });
      } else {
        setToast({ open: true, message: "Cannot cancel this event", type: "error" });
        return;
      }
      await loadData();
    } catch (err) {
      showErrorAlert(err);
    }
  };

  if (loading) return <div className="flex justify-center items-center mt-10 text-gray-500">Loading events...</div>;

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <h1 className="text-3xl font-bold text-blue-900 mb-6 text-center">Upcoming Events</h1>

      {events.length === 0 ? (
        <div className="text-gray-500 text-center">No upcoming events</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(ev => (
            <EventCard
              key={ev.id}
              event={ev}
              registered={!!registrations[ev.id]}
              remaining={ev.registeredCount}
              onToggleRegister={handleToggleRegister}
              canCancel={!!registrations[ev.id] && new Date() <= new Date(ev.registrationEndAt)}
              pageType="upcoming"
            />
          ))}
        </div>
      )}

      <div className="flex justify-center items-center mt-8 gap-4">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
        >
          Previous
        </button>
        <span>Page {page} / {totalPages}</span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      <Toast.Provider swipeDirection="right">
        <Toast.Root
          open={toast.open}
          onOpenChange={(open) => setToast({ ...toast, open })}
          className={`fixed bottom-6 right-6 p-4 rounded-lg shadow-md border ${
            toast.type === "success" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"
          }`}
        >
          <Toast.Title className="font-bold">{toast.message}</Toast.Title>
          <Toast.Close className="absolute top-2 right-2 text-gray-500 cursor-pointer">✕</Toast.Close>
        </Toast.Root>
        <Toast.Viewport />
      </Toast.Provider>
    </div>
  );
};

export default UpcomingEventsPage;
