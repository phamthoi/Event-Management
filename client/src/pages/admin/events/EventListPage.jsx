import React, { useEffect, useState } from "react";
import EventFilter from "../../../components/admin/EventList/EventFilter";
import EventTable from "../../../components/admin/EventList/EventTable";
import Pagination from "../../../components/admin/EventList/Pagination";
import { getEventStatus } from "../../../utils/getEventStatus";
import { useNavigate } from "react-router-dom";
import { showErrorAlert, showDeleteErrorAlert } from "../../../utils/errorHandler";
import { getEvents, deleteEvent } from "../../../services/admin/event/eventService";
import { PlusIcon, Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";

const EventListPage = () => {
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({});
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const loadEvents = async () => {
    try {
      const response = await getEvents({ page, limit, ...filters });
      const eventsWithStatus = response.events.map((ev) => ({
        ...ev,
        status: getEventStatus(ev),
      }));
      setEvents(eventsWithStatus);
      setTotal(response.total || 0);
      setMsg("");
    } catch (err) {
      showErrorAlert(err);
      setEvents([]);
      setTotal(0);
      setMsg("");
    }
  };

  useEffect(() => {
    loadEvents();
  }, [page, filters]);

  const handleDelete = async (id) => {
    const eventToDelete = events.find((event) => event.id === id);
    if (!eventToDelete) return alert("❌ Event not found!");
    if ((eventToDelete.registeredCount || 0) > 0) {
      return alert(`❌ Cannot delete this event! There are ${eventToDelete.registeredCount} registered members.`);
    }
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      await deleteEvent(id);
      alert("✅ Event deleted successfully!");
      loadEvents();
    } catch (err) {
      console.error(err);
      showDeleteErrorAlert(err, "event");
    }
  };

  const handleFilter = (newFilters) => {
    setPage(1);
    setFilters(newFilters);
  };

  const handlePageChange = (newPage) => setPage(newPage);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            📅 Event Management
          </h1>
          <p className="text-gray-500 mt-1">Manage all your events efficiently</p>
        </div>
        <button
          onClick={() => navigate("/admin/events/create")}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          <PlusIcon className="w-5 h-5" />
          Create Event
        </button>
      </div>

      {/* Filter Section */}
      <div className="bg-white shadow-md rounded-xl p-4 mb-6">
        <EventFilter onFilter={handleFilter} />
      </div>

      {/* Table Section */}
      <div className="bg-white shadow-md rounded-xl overflow-x-auto">
        <EventTable
          events={events}
          onDelete={handleDelete}
          page={page}
          limit={limit}
          onEdit={(id) => navigate(`/admin/events/edit/${id}`)}
        />
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-center">
        <Pagination
          total={total}
          page={page}
          limit={limit}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Status Message */}
      {msg && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg shadow">
          {msg}
        </div>
      )}
    </div>
  );
};

export default EventListPage;
