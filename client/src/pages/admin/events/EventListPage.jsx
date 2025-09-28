//client/src/pages/events/EventListPage.jsx
import React, { useEffect, useState } from "react";
import EventFilter from "../../../components/admin/EventList/EventFilter";
import EventTable from "../../../components/admin/EventList/EventTable";
import Pagination from "../../../components/admin/EventList/Pagination";
import { getEventStatus } from "../../../utils/getEventStatus";
import { useNavigate } from "react-router-dom";
import { showErrorAlert, showDeleteErrorAlert } from "../../../utils/admin/errorHandler";

import {
  getEvents,
  deleteEvent,
} from "../../../services/admin/event/eventService";

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
      const response = await getEvents({ page: 1, limit: 10, ...filters });


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
    if (!window.confirm("Bạn có chắc muốn xóa event này?")) return;
    try {
      await deleteEvent(id);
      alert("✅ Xóa sự kiện thành công!");
      loadEvents();
    } catch (err) {
      console.error("++Error deleting event:", err);
      showDeleteErrorAlert(err, "sự kiện");
    }
  };

  const handleFilter = (newFilters) => {
    setPage(1);
    setFilters(newFilters);
  };

  const handlePageChange = (newPage) => setPage(newPage);

  const goToEventsTable = () => {
    window.location.hash = "#events-table";
    document
      .getElementById("events-table")
      ?.scrollIntoView({ behavior: "smooth" });
  };



  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Event List</h1>

      <div className="mb-4">
      

        <button
          onClick={goToEventsTable}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Đi đến bảng sự kiện
        </button>
      </div>

      
      <EventFilter onFilter={handleFilter} />
  

      <div id="events-table">
        <EventTable
          events={events}
          onDelete={handleDelete}
          page={page}
          limit={limit}
          onEdit={(id) => navigate(`/admin/events/edit/${id}`)}
        />
      </div>
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
