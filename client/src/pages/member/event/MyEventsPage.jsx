import React, { useEffect, useState } from "react";
import { eventService } from "../../../services/common/event/event.js";
import { showErrorAlert } from "../../../utils/errorHandler";
import { getEventStatus } from "../../../utils/getEventStatus";
import EventCard from "../../../components/common/eventList/EventCard";

const MyEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const myEvents = await eventService.getMyEvents();
      setEvents(myEvents);
    } catch (err) {
      console.error("Load events error:", err);
      showErrorAlert(err);
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
      alert("This event registration is closed, cannot cancel.");
      return;
    }

    try {
      await eventService.cancelRegistration(event.id);
      alert("Registration cancelled successfully");
      loadEvents();
    } catch (err) {
      console.error("Cancel registration error:", err);
      showErrorAlert(err);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">My Events</h1>
      {events.length === 0 ? (
        <div className="text-gray-500">You haven't registered for any events yet</div>
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
                remaining={ev.registeredCount}
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