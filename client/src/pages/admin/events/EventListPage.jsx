//client/src/pages/events/EventListPage.jsx
/*
import React, { useEffect, useState } from "react";
import EventFilter from "../../components/EventList/EventFilter";
import EventTable from "../../components/EventList/EventTable";
import Pagination from "../../components/EventList/Pagination";
import { getEvents, deleteEvent } from "../../services/admin/EventService";

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

  const loadEvents = async (page, filtered) => {
    try {
      const data = await getEvents(page, limit, filtered);
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
*/
//client/src/pages/events/EventListPage.jsx
import React, { useEffect, useState } from "react";
import EventFilter from "../../../components/admin/EventList/EventFilter";
import EventTable from "../../../components/admin/EventList/EventTable";
import Pagination from "../../../components/admin/EventList/Pagination";
import { getEventStatus } from "../../../utils/getEventStatus";
import { useNavigate } from "react-router-dom";
//import { getEvents, deleteEvent } from "../../services/admin/eventService";
import { getEvents, deleteEvent } from "../../../services/fakeApi";
const EventListPage = () => {
// import { getEvents, deleteEvent } from "../../services/admin/EventService"; // Tạm thời bỏ API

  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({});
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  
  const loadEvents = async() => {
    try {
      // luôn lấy dữ liệu từ localStoreage
      let stored = getEvents(); //lấy từ service
       
      // thêm status động
      let filtered = stored.map((ev) =>({
        ...ev,
        status: getEventStatus(ev), 
      }));


      //lọc theo tên 
      if (filters.name){
        filtered = filtered.filter(ev =>
          ev.title.toLowerCase().includes(filters.name.toLowerCase())
        );
      }

      //lọc theo location
      if(filters.location){
        filtered = filtered.filter(ev =>
          ev.location.toLowerCase().includes(filters.location.toLowerCase())
        );
      }
      // lọc theo status 
      if (filters.status) {
        filtered = filtered.filter(ev =>
          ev.status.toLowerCase().includes(filters.status.toLowerCase())
        );
      }
      // Lọc theo khoảng ngày (startAt nằm trong range)
      if (filters.startDate) {
        filtered = filtered.filter(ev =>
          new Date(ev.startAt) >= new Date(filters.startDate)
        );
      }
      if (filters.endDate) {
        filtered = filtered.filter(ev =>
          new Date(ev.endAt) <= new Date(filters.endDate)
      );
      }
      // Tính toán phân trang trên fake data
      const start = (page - 1) * limit;
      const end = start + limit;
      const pagedEvents = filtered.slice(start, end);

      setEvents(pagedEvents);
      setTotal(filtered.length);
      setMsg("");


    } catch (err) {
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
      await deleteEvent(id); // service xử lý delete (API hoặc localStorage)
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
      <h1 className="text-2xl font-bold mb-4">Event List (Fake Data)</h1>
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
