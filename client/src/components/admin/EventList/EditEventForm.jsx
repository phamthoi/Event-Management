// components/EventList/EditEventForm.jsx
import React, { useEffect } from "react";

// Utility function to format datetime for datetime-local input
const formatDateTimeLocal = (dateString) => {
  if (!dateString) return "";
  
  // Tạo Date object từ database string
  const date = new Date(dateString);
  
  // Chuyển đổi sang local timezone và format cho datetime-local
  // Sử dụng toLocaleString để lấy thời gian local, sau đó format lại
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

// Utility function to convert datetime-local value back to ISO string
const formatDateTimeForSubmit = (dateTimeLocalValue) => {
  if (!dateTimeLocalValue) return "";
  
  // Tạo Date object từ datetime-local input
  const date = new Date(dateTimeLocalValue);
  return date.toISOString();
};

const EditEventForm = ({ event = {}, onChange, onSubmit }) => {
  // Enhanced onChange handler to handle datetime conversion
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Convert datetime-local values back to ISO format for database
    if (['startAt', 'endAt', 'registrationStartAt', 'registrationEndAt'].includes(name)) {
      const isoValue = formatDateTimeForSubmit(value);
      onChange({
        target: {
          name,
          value: isoValue
        }
      });
    } else {
      onChange(e);
    }
  };

  // Function to automatically update event status based on current time
  const updateEventStatus = () => {
    const now = new Date();
    const registrationStart = new Date(event.registrationStartAt);
    const registrationEnd = new Date(event.registrationEndAt);
    const eventStart = new Date(event.startAt);
    const eventEnd = new Date(event.endAt);
    
    // Calculate one day before event start
    const oneDayBeforeEvent = new Date(eventStart);
    oneDayBeforeEvent.setDate(oneDayBeforeEvent.getDate() - 1);
    
    let newStatus = event.status;
    
    if (now >= registrationStart && now <= registrationEnd) {
      // During registration period
      newStatus = "REGISTRATION";
    } else if (now >= eventStart && now <= eventEnd) {
      // During event period
      newStatus = "ONGOING";
    } else if (now >= oneDayBeforeEvent && now < eventStart) {
      // One day before event start
      newStatus = "READY";
    } else if (now > eventEnd) {
      // After event ends
      newStatus = "COMPLETED";
    }
    
    // Update status if it has changed
    if (newStatus !== event.status) {
      onChange({
        target: {
          name: 'status',
          value: newStatus
        }
      });
    }
  };
  
  // Auto-update status when event times change
  useEffect(() => {
    if (event.registrationStartAt && event.registrationEndAt && 
        event.startAt && event.endAt) {
      updateEventStatus();
    }
  }, [event.registrationStartAt, event.registrationEndAt, event.startAt, event.endAt]);

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Event name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Event name
        </label>
        <input
          type="text"
          name="title"
          value={event.title || ""}
          onChange={handleInputChange}
          placeholder="Enter event name"
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={event.description || ""}
          onChange={handleInputChange}
          rows="3"
          placeholder="Enter event description"
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Location
        </label>
        <input
          type="text"
          name="location"
          value={event.location || ""}
          onChange={handleInputChange}
          placeholder="Enter event location"
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Event Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Event Status
          <span className="text-xs text-gray-500 ml-2">
            (Tự động cập nhật dựa trên thời gian)
          </span>
        </label>
        <select
          name="status"
          value={event.status || "DRAFT"}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="DRAFT">Draft</option>
          <option value="REGISTRATION">Registration Open</option>
          <option value="READY">Ready</option>
          <option value="ONGOING">Ongoing</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {/* Min & Max attendees */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Min attendees
          </label>
          <input
            type="number"
            name="minAttendees"
            value={event.minAttendees || ""}
            onChange={handleInputChange}
            placeholder="0"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Max attendees
          </label>
          <input
            type="number"
            name="maxAttendees"
            value={event.maxAttendees || ""}
            onChange={handleInputChange}
            placeholder="100"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Event start & end */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Event start time
          </label>
          <input
            type="datetime-local"
            name="startAt"
            value={formatDateTimeLocal(event.startAt)}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Event end time
          </label>
          <input
            type="datetime-local"
            name="endAt"
            value={formatDateTimeLocal(event.endAt)}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Registration start & end */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Registration start
          </label>
          <input
            type="datetime-local"
            name="registrationStartAt"
            value={formatDateTimeLocal(event.registrationStartAt)}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Registration end
          </label>
          <input
            type="datetime-local"
            name="registrationEndAt"
            value={formatDateTimeLocal(event.registrationEndAt)}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Deposit */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Deposit (VND)
        </label>
        <input
          type="number"
          name="deposit"
          value={event.deposit || ""}
          onChange={handleInputChange}
          placeholder="0"
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          step="0.01"
          min="0"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-semibold transition"
      >
        Update Event
      </button>
    </form>
  );
};

export default EditEventForm;
