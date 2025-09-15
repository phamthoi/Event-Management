function EventSelect({ events, selectedEvent, onChange }) {
  return (
    <div className="mb-4">
      <label className="block mb-2 font-medium">Choose Event:</label>
      <select
        value={selectedEvent}
        onChange={onChange}
        className="w-full border px-3 py-2 rounded"
      >
        <option value="">-- Choose event --</option>
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
