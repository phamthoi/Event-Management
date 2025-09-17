//client/src/pages/events/EventListPage.jsx
import React, { useEffect, useState } from "react";
import EventFilter from "../../../components/admin/EventList/EventFilter";
import EventTable from "../../../components/admin/EventList/EventTable";
import Pagination from "../../../components/admin/EventList/Pagination";
import { getEventStatus } from "../../../utils/getEventStatus";
import { useNavigate } from "react-router-dom";
// Thay đổi import từ fakeApi sang eventService
import { getEvents, deleteEvent } from "../../../services/admin/event/eventService";

const EventListPage = () => {

  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10); // Thay đổi từ 5 thành 10
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({});
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  // Sửa loadEvents để gọi API backend
  const loadEvents = async() => {
    try {
      // Gọi API backend thay vì localStorage
      const response = await getEvents({ page, limit, ...filters });
      
      // Thêm console.log để debug
      console.log('++Events API response:', response);
      console.log('++Total events:', response.total);
      console.log('++Current page:', page);
      console.log('++Limit per page:', limit);
      
      // Thêm status động như cũ
      const eventsWithStatus = response.events.map((ev) => ({
        ...ev,
        status: getEventStatus(ev), 
      }));
  
      setEvents(eventsWithStatus);
      setTotal(response.total || 0);
      setMsg("");
    } catch (err) {
      console.error('++Error loading events:', err);
      setMsg("Error: " + err.message);
      setEvents([]);
      setTotal(0);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [page, filters]);

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa event này?")) return;
    try {
      await deleteEvent(id);
      alert("Deleted successfully");
      loadEvents();
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
      <EventTable
        events={events}
        onDelete={handleDelete}
        page={page}
        limit={limit}
        onEdit={(id) => navigate(`/admin/events/edit/${id}`)}
      />
      <Pagination
        total={total}
        page={page}
        limit={limit}
        onPageChange={handlePageChange}
      />
      {msg && <div className="mt-2 text-red-500">{msg}</div>}
    </div>
  );
};

export default EventListPage;
