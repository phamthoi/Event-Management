import React, { useEffect, useState } from "react";
import EventFilter from "../../components/EventList/EventFilter";
import EventTable from "../../components/EventList/EventTable";
import Pagination from "../../components/EventList/Pagination";
import { getEvents, deleteEvent } from "../../services/EventService";

const EventListPage = () => {
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({});
  const [msg, setMsg] = useState("");

  useEffect(() => {
    loadEvents(page, filters);
  }, [page, filters]);

  const loadEvents = async (page, appliedFilters) => {
    try {
      const data = await getEvents(page, limit, appliedFilters);
      setEvents(data.events || []);
      setTotal(data.total || 0);
      setMsg("");
    } catch (err) {
      setMsg("Error: " + err.message);
      setEvents([]);
      setTotal(0);
    }
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm("Bạn có chắc muốn xóa event này?")) return;
    try {
      await deleteEvent(eventId);
      alert("Event deleted successfully");
      loadEvents(page, filters);
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleFilter = (newFilters) => {
    setPage(1);
    setFilters(newFilters);
  };

  const handlePageChange = (newPage) => setPage(newPage);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Event List</h1>
      <EventFilter onFilter={handleFilter} />
      <EventTable events={events} onDelete={handleDelete} page={page} limit={limit} />
      <Pagination total={total} page={page} limit={limit} onPageChange={handlePageChange} />
      {msg && <div className="mt-2 text-red-500">{msg}</div>}
    </div>
  );
};

export default EventListPage;
