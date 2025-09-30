// src/components/admin/EventList/EventFilter.jsx
import React, { useState } from "react";
import { MagnifyingGlassIcon, Cross2Icon } from "@radix-ui/react-icons";

const EventFilter = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    name: "",
    location: "",
    status: "",
    startDate: "",
    endDate: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFilters((prev) => ({ ...prev, [id]: value }));
  };

  const applyFilter = () => onFilter(filters);

  const clearFilters = () => {
    const emptyFilters = { name: "", location: "", status: "", startDate: "", endDate: "" };
    setFilters(emptyFilters);
    onFilter(emptyFilters);
  };

  return (
    <div className="mb-6 p-6 bg-white border border-gray-200 rounded-2xl shadow-lg">
      <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-5">
        🔍 Filter Events
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
        {/* Event Name */}
        <div className="flex flex-col">
          <label htmlFor="name" className="text-sm text-gray-500 mb-1">Event Name</label>
          <input
            type="text"
            id="name"
            placeholder="Enter event name..."
            value={filters.name}
            onChange={handleChange}
            className="border rounded-xl px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Location */}
        <div className="flex flex-col">
          <label htmlFor="location" className="text-sm text-gray-500 mb-1">Location</label>
          <input
            type="text"
            id="location"
            placeholder="Enter location..."
            value={filters.location}
            onChange={handleChange}
            className="border rounded-xl px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Status */}
        <div className="flex flex-col">
          <label htmlFor="status" className="text-sm text-gray-500 mb-1">Status</label>
          <select
            id="status"
            value={filters.status}
            onChange={handleChange}
            className="border rounded-xl px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All</option>
            <option value="DRAFT">Draft</option>
            <option value="REGISTRATION">Registration</option>
            <option value="READY">Ready</option>
            <option value="ONGOING">Ongoing</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        {/* Start Date */}
        <div className="flex flex-col">
          <label htmlFor="startDate" className="text-sm text-gray-500 mb-1">Start Date</label>
          <input
            type="date"
            id="startDate"
            value={filters.startDate}
            onChange={handleChange}
            className="border rounded-xl px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* End Date */}
        <div className="flex flex-col">
          <label htmlFor="endDate" className="text-sm text-gray-500 mb-1">End Date</label>
          <input
            type="date"
            id="endDate"
            value={filters.endDate}
            onChange={handleChange}
            className="border rounded-xl px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-5 flex gap-3 flex-wrap">
        <button
          onClick={applyFilter}
          className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-xl shadow hover:from-blue-700 hover:to-blue-600 transition"
        >
          <MagnifyingGlassIcon className="w-5 h-5" />
          Apply
        </button>

        <button
          onClick={clearFilters}
          className="flex items-center gap-2 px-5 py-2 bg-gray-200 text-gray-700 font-semibold rounded-xl shadow hover:bg-gray-300 transition"
        >
          <Cross2Icon className="w-5 h-5" />
          Clear
        </button>
      </div>
    </div>
  );
};

export default EventFilter;
