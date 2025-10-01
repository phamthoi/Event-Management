function EventSelect({ events, selectedEvent, onChange }) {
  return (
    <div className="mb-4">
      <label className="block mb-2 font-medium text-gray-700">Choose Event:</label>
      <select
        value={selectedEvent}
        onChange={onChange}
        className="w-full border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="" disabled className="text-gray-400">
          -- Choose event --
        </option>
        {events.map((ev) => (
          <option key={ev.id} value={ev.id}>
            {ev.title}
          </option>
        ))}
      </select>
    </div>
  );
}

export default EventSelect;
