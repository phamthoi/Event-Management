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
*/
//client/src/pages/events/EventListPage.jsx
import React, { useEffect, useState } from "react";
import EventFilter from "../../components/EventList/EventFilter";
import EventTable from "../../components/EventList/EventTable";
import Pagination from "../../components/EventList/Pagination";
import { getEventStatus } from "../../utils/getEventStatus";
import { useNavigate } from "react-router-dom";
// import { getEvents, deleteEvent } from "../../services/admin/EventService"; // Tạm thời bỏ API

const EventListPage = () => {
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({});
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  // Fake data
const fakeEvents = [
  {
    id: 1,
    title: "Event A",
    description: "Tech conference about AI",
    location: "Hotel Saigon",
    minAttendees: 10,
    maxAttendees: 100,
    deposit: 100000,
    startAt: "2025-09-21T12:30:00",
    endAt: "2025-09-21T17:00:00",
    registrationStartAt: "2025-09-10T08:00:00",
    registrationEndAt: "2025-09-20T23:59:59",
  },
  {
    id: 2,
    title: "Event B",
    description: "Workshop về React",
    location: "UIT Campus",
    minAttendees: 5,
    maxAttendees: 50,
    deposit: 50000,
    startAt: "2025-09-22T09:00:00",
    endAt: "2025-09-22T12:00:00",
    registrationStartAt: "2025-09-12T08:00:00",
    registrationEndAt: "2025-09-21T23:59:59",
  },
  {
    id: 3,
    title: "Event C",
    description: "Hackathon 24h",
    location: "Innovation Hub",
    minAttendees: 20,
    maxAttendees: 200,
    deposit: 200000,
    startAt: "2025-09-25T08:00:00",
    endAt: "2025-09-26T08:00:00",
    registrationStartAt: "2025-09-15T08:00:00",
    registrationEndAt: "2025-09-24T23:59:59",
  },
  {
    id: 4,
    title: "Event D",
    description: "Seminar về An ninh mạng",
    location: "UIT Auditorium",
    minAttendees: 15,
    maxAttendees: 150,
    deposit: 80000,
    startAt: "2025-09-27T13:00:00",
    endAt: "2025-09-27T17:30:00",
    registrationStartAt: "2025-09-18T08:00:00",
    registrationEndAt: "2025-09-26T23:59:59",
  },
  {
    id: 5,
    title: "Event E",
    description: "Khóa học Docker cơ bản",
    location: "Online",
    minAttendees: 8,
    maxAttendees: 40,
    deposit: 60000,
    startAt: "2025-09-29T19:00:00",
    endAt: "2025-09-29T21:00:00",
    registrationStartAt: "2025-09-20T08:00:00",
    registrationEndAt: "2025-09-28T23:59:59",
  },
  {
    id: 6,
    title: "Event F",
    description: "Giải bóng đá sinh viên",
    location: "SVĐ Quận 9",
    minAttendees: 22,
    maxAttendees: 100,
    deposit: 120000,
    startAt: "2025-10-02T08:00:00",
    endAt: "2025-10-02T18:00:00",
    registrationStartAt: "2025-09-22T08:00:00",
    registrationEndAt: "2025-10-01T23:59:59",
  },
];

  useEffect(() => {
    //seed fake data nếu localStorege rỗng. 
    const stored = JSON.parse(localStorage.getItem("events")) || fakeEvents;
    if(!stored || stored.length === 0){
      localStorage.setItem("events", JSON.stringify(fakeEvents));
    }
    loadEvents(page, filters);
  }, [page, filters]);

  const loadEvents = (page, appliedFilters) => {
    try {
      // luôn lấy dữ liệu từ localStoreage
      let stored = JSON.parse(localStorage.getItem("events")) || [];
       
      // thêm status động
      let filtered = stored.map(ev =>({
        ...ev,
        status: getEventStatus(ev), 
      }));


      //lọc theo tên 
      if (appliedFilters.name){
        filtered = filtered.filter(ev =>
          ev.title.toLowerCase().includes(appliedFilters.name.toLowerCase())
        );
      }

      //lọc theo location
      if(appliedFilters.location){
        filtered = filtered.filter(ev =>
          ev.location.toLowerCase().includes(appliedFilters.location.toLowerCase())
        );
      }

       // Lọc theo khoảng ngày (startAt nằm trong range)
      if (appliedFilters.startDate) {
        filtered = filtered.filter(ev =>
          new Date(ev.startAt) >= new Date(appliedFilters.startDate)
        );
      }
      if (appliedFilters.endDate) {
        filtered = filtered.filter(ev =>
          new Date(ev.endAt) <= new Date(appliedFilters.endDate)
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

  const handleDelete = async (eventId) => {
    if (!window.confirm("Bạn có chắc muốn xóa event này?")) return;
    try {
      // Fake xóa: filter bỏ event ra khỏi danh sách
      const updated = events.filter((e) => e.id !== eventId);
      localStorage.setItem("events", JSON.stringify(updated));

      //reload lại list
      loadEvents(page, filters);

      alert("Event deleted successfully (fake)");
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
      <EventTable events={events} onDelete={handleDelete} page={page} limit={limit} />
      <Pagination total={total} page={page} limit={limit} onPageChange={handlePageChange} />
      {msg && <div className="mt-2 text-red-500">{msg}</div>}
    </div>
  ); return (
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
