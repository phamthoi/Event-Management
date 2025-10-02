import React from "react";

const EventCard = ({ event, registered, onToggleRegister, canCancel, pageType }) => {
  const isUpcomingPage = pageType === "upcoming";

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 w-full sm:w-[350px] md:w-[400px] lg:w-[450px] flex flex-col justify-between relative">
      {/* Badge trạng thái */}
      {event.attendance && (
        <span className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
          ✓ Present
        </span>
      )}
      {event.status === "CANCELLED" && (
        <span className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
          😢 Cancelled
        </span>
      )}

      {/* Thông tin event */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-800">{event.title}</h2>
        <p className="text-gray-600 mt-2 text-sm line-clamp-4">{event.description}</p>

        <div className="mt-3 text-gray-700 text-sm space-y-1">
          <p>
            <strong>Location:</strong> {event.location}
          </p>
          {event.registrationStartAt && event.registrationEndAt && (
            <p>
              <strong>Registration:</strong>{" "}
              {new Date(event.registrationStartAt).toLocaleString()} -{" "}
              {new Date(event.registrationEndAt).toLocaleString()}
            </p>
          )}
          <p>
            <strong>Event Time:</strong>{" "}
            {new Date(event.startAt).toLocaleString()} - {new Date(event.endAt).toLocaleString()}
          </p>
          <p>
            <strong>Status:</strong> {event.status}
          </p>
          <p>
            <strong>Registrations:</strong> {event.registeredCount || 0} / {event.maxAttendees}{" "}
            {event.maxAttendees - (event.registeredCount || 0) > 0 && (
              <span className="text-green-600">
                ({event.maxAttendees - (event.registeredCount || 0)} slots left)
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Button đăng ký / hủy */}
      <button
        onClick={() => onToggleRegister(event)}
        disabled={isUpcomingPage ? registered : registered && !canCancel}
        className={`mt-5 py-2 rounded-xl font-semibold w-full transition-colors ${
          registered
            ? isUpcomingPage
              ? "bg-gray-400 text-white cursor-not-allowed"
              : canCancel
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-gray-400 text-white cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
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
