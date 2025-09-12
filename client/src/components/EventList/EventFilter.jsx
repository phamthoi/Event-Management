// client/src/components/EventList/EventFilter.jsx
import React, { useState } from "react";

const EventFilter = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    name: "",
    location: "",
    status: "",
    startDate: "",
    endDate: ""
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFilters(prev => ({ ...prev, [id]: value }));
  };

  const applyFilter = () => onFilter(filters);

  return (
    <div className="mb-4 flex flex-wrap gap-2">
      <input type="text" id="name" placeholder="Event name" value={filters.name} onChange={handleChange} className="border px-3 py-1 rounded"/>
      <input type="text" id="location" placeholder="Location" value={filters.location} onChange={handleChange} className="border px-3 py-1 rounded"/>
      <select id="status" value={filters.status} onChange={handleChange} className="border px-3 py-1 rounded">
        <option value="">Status</option>
        <option value="DRAFT">DRAFT</option>
        <option value="REGISTRATION">REGISTRATION</option>
        <option value="READY">READY</option>
        <option value="ONGOING">ONGOING</option>
        <option value="COMPLETED">COMPLETED</option>
        <option value="CANCELLED">CANCELLED</option>
      </select>
      <input type="date" id="startDate" value={filters.startDate} onChange={handleChange} className="border px-3 py-1 rounded"/>
      <input type="date" id="endDate" value={filters.endDate} onChange={handleChange} className="border px-3 py-1 rounded"/>
      <button onClick={applyFilter} className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700">Filter</button>
    </div>
  );
};

export default EventFilter;
