import React from "react";

const EventCard = ({
  event,
  registered,
  remaining,
  onToggleRegister,
  canCancel,
  pageType,
}) => {
  const isUpcomingPage = pageType === "upcoming";

  return (
    <div className="bg-white p-4 rounded shadow space-y-2 border relative">
      {event.attendance && (
        <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">
          ✓ Present
        </div>
      )}
      {event.status === 'CANCELLED' && (
        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
          😢 Will be refunded later
        </div>
      )}

      <h2 className="text-xl font-semibold">{event.title}</h2>
      <p>{event.description}</p>
      <p>
        <strong>Location:</strong> {event.location}
      </p>

      {event.registrationStartAt && event.registrationEndAt && (
        <p>
          <strong>Registration Time:</strong>{" "}
          {new Date(event.registrationStartAt).toLocaleString()} -{" "}
          {new Date(event.registrationEndAt).toLocaleString()}
        </p>
      )}

      <p>
        <strong>Event Time:</strong> {new Date(event.startAt).toLocaleString()}{" "}
        - {new Date(event.endAt).toLocaleString()}
      </p>

      <p>
        <strong>Status:</strong> {event.status}
      </p>
      <p>
        <strong>Registrations:</strong> {event.registeredCount || 0} /{" "}
        {event.maxAttendees}
        {(event.remainingSlots ||
          event.maxAttendees - (event.registeredCount || 0)) > 0 && (
          <span className="text-green-600">
            {" "}
            (
            {event.remainingSlots ||
              event.maxAttendees - (event.registeredCount || 0)}{" "}
            slots remaining)
          </span>
        )}
      </p>
      <button
        onClick={() => onToggleRegister(event)}
        className={`px-4 py-1 rounded ${
          registered
            ? isUpcomingPage
              ? "bg-gray-400 text-white cursor-not-allowed"
              : canCancel
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-gray-400 text-white cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
        disabled={isUpcomingPage ? registered : registered && !canCancel}
      >
        {registered
          ? isUpcomingPage
            ? "Registered"
            : canCancel
            ? "Cancel Registration"
            : "Registered"
          : "Register"}
      </button>
    </div>
  );
};

export default EventCard;
