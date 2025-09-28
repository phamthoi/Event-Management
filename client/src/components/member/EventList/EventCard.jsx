// client/src/components/Member/EventList/EventCard.jsx
import React from "react";

const EventCard = ({ event, registered, remaining, onToggleRegister, canCancel, pageType }) => {
  // Logic cho trang upcoming: button disabled hoàn toàn khi đã đăng ký
  const isUpcomingPage = pageType === 'upcoming';
  
  return (
    <div className="bg-white p-4 rounded shadow space-y-2 border">
      <h2 className="text-xl font-semibold">{event.title}</h2>
      <p>{event.description}</p>
      <p>
        <strong>Location:</strong> {event.location}
      </p>
      <p>
        <strong>Time:</strong>{" "}
        {new Date(event.startAt).toLocaleString()} -{" "}
        {new Date(event.endAt).toLocaleString()}
      </p>
      <p>
        <strong>Status:</strong> {event.status}
      </p>
      <p>
        <strong>Slot còn lại:</strong> {event.maxAttendees - remaining} / {event.maxAttendees}
        
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
        disabled={isUpcomingPage ? registered : (registered && !canCancel)}
      >
        {registered 
          ? isUpcomingPage 
            ? "Đã đăng ký" 
            : (canCancel ? "Hủy đăng ký" : "Đã đăng ký")
          : "Đăng ký"
        }
      </button>
    </div>
  );
};

export default EventCard;
