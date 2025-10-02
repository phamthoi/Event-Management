import React, { useEffect, useState } from "react";
import { getMemberRegistrations, cancelRegistration } from "../../services/common/event.js";
import { showErrorAlert } from "../../utils/member/errorHandler";

const MyEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const myEvents = await getMemberRegistrations();
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
      await cancelRegistration(event.id);
      alert("Registration cancelled successfully");
      loadEvents();
    } catch (err) {
      console.error("Cancel registration error:", err);
      showErrorAlert(err);
    }
  };

  if (loading)
    return (
      <p className="text-center mt-20 text-gray-500 dark:text-gray-400 text-lg">
        Loading your events...
      </p>
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-secondary-900 p-6">
      {/* chỉnh màu text cho dark mode */}
      <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-8 text-center">
        My Events
      </h1>

      {events.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400 mt-10">
          You haven't registered for any events yet.
        </div>
      ) : (
        <div className="flex flex-wrap gap-6 justify-center">
          {events.map((ev) => {
            const canCancel =
              ev.status === "REGISTRATION" &&
              new Date() <= new Date(ev.registrationEndAt);

            return (
              <div
                key={ev.id}
                className="bg-white dark:bg-secondary-800 w-full sm:w-[350px] md:w-[400px] lg:w-[450px] 
                           rounded-2xl shadow-lg p-6 flex flex-col justify-between relative 
                           border border-gray-200 dark:border-secondary-700"
              >
                {/* Status Badge */}
                <span
                  className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold ${
                    ev.status === "CANCELLED"
                      ? "bg-red-500 dark:bg-red-600 text-white"
                      : "bg-green-500 dark:bg-green-600 text-white"
                  }`}
                >
                  {ev.status === "CANCELLED" ? "Cancelled" : "Registered"}
                </span>

                <div>
                  {/* chỉnh text cho dark mode */}
                  <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                    {ev.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm line-clamp-4">
                    {ev.description}
                  </p>

                  <div className="mt-3 text-gray-700 dark:text-gray-300 text-sm space-y-1">
                    <p>
                      <strong>Location:</strong> {ev.location}
                    </p>
                    <p>
                      <strong>Event Time:</strong>{" "}
                      {new Date(ev.startAt).toLocaleString()} -{" "}
                      {new Date(ev.endAt).toLocaleString()}
                    </p>
                    <p>
                      <strong>Registrations:</strong> {ev.registeredCount} / {ev.maxAttendees}{" "}
                      {ev.maxAttendees - ev.registeredCount > 0 && (
                        <span className="text-green-600 dark:text-green-400">
                          ({ev.maxAttendees - ev.registeredCount} slots left)
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleCancel(ev)}
                  disabled={!canCancel}
                  className={`mt-5 py-2 rounded-xl font-semibold transition-colors ${
                    canCancel
                      ? "bg-red-500 hover:bg-red-600 text-white"
                      : "bg-gray-300 dark:bg-secondary-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Cancel Registration
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyEventsPage;
