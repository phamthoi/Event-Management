import React from "react";
import {Link} from "react-router-dom"
const EventTable = ({ events, onDelete, page, limit }) => {
  return (
    <table className="w-full border-collapse border border-gray-300">
      <thead>
        <tr className="bg-gray-200">
          <th className="border px-3 py-2">#</th>
          <th className="border px-3 py-2">Name</th>
          <th className="border px-3 py-2">Location</th>
          <th className="border px-3 py-2">Time</th>
          <th className="border px-3 py-2">Registered</th>
          <th className="border px-3 py-2">Deposit (VND)</th>
          <th className="border px-3 py-2">Status</th>
          <th className="border px-3 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {events.length === 0 ? (
          <tr>
            <td colSpan="8" className="text-center p-3 text-gray-500">No events</td>
          </tr>
        ) : (
          events.map((ev, idx) => {
            const startStr = ev.startAt ? new Date(ev.startAt).toLocaleString() : "-";
            const endStr = ev.endAt ? new Date(ev.endAt).toLocaleString() : "-";
            const depositStr = ev.deposit != null ? Number(ev.deposit).toLocaleString("vi-VN") : "0 VND";
            const registeredCount = ev.registeredCount || 0;
            return (
              <tr key={ev.id}>
                <td className="border px-3 py-2">{(page - 1) * limit + idx + 1}</td>
                <td className="border px-3 py-2">{ev.title}</td>
                <td className="border px-3 py-2">{ev.location || "-"}</td>
                <td className="border px-3 py-2">{startStr} - {endStr}</td>
                <td className="border px-3 py-2 text-center">{registeredCount}</td>
                <td className="border px-3 py-2 text-right">{depositStr}</td>
                <td className="border px-3 py-2">{ev.status}</td>
                <td className="border px-3 py-2">

                  <Link to={`/admin/events/edit/${ev.id}`} className="text-blue-600 hover:underline mr-2">Update</Link>
                  <button onClick={() => onDelete(ev.id)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors">Delete</button>
                </td>
              </tr>
            )
          })
        )}
      </tbody>
    </table>
  );
};

export default EventTable;
