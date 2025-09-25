//client/src/pages/events/EventListPage.jsx
import React, { useEffect, useState } from "react";
import EventFilter from "../../../components/admin/EventList/EventFilter";
import EventTable from "../../../components/admin/EventList/EventTable";
import Pagination from "../../../components/admin/EventList/Pagination";
import { getEventStatus } from "../../../utils/getEventStatus";
import { useNavigate } from "react-router-dom";

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
      const response = await getEvents({ page, limit, ...filters });

      // const response = await getEvents({
      //   page: "zys",
      //   limit: "abc",
      //   ...filters,
      // });

      const eventsWithStatus = response.events.map((ev) => ({
        ...ev,
        status: getEventStatus(ev),
      }));

      setEvents(eventsWithStatus);
      setTotal(response.total || 0);
      setMsg("");
    } catch (err) {
      let errorMessage = "";
      let statusCode = "";

      if (err.response) {
        statusCode = err.response.status;
        const serverMessage = err.response.data?.message || "";

        switch (statusCode) {
          case 400:
            errorMessage = `❌ Lỗi dữ liệu không hợp lệ (${statusCode})\n\nVui lòng kiểm tra lại thông tin và thử lại.`;
            break;
          case 401:
            errorMessage = `🔐 Phiên đăng nhập hết hạn (${statusCode})\n\nVui lòng đăng nhập lại để tiếp tục.`;
            break;
          case 403:
            errorMessage = `🚫 Không có quyền truy cập (${statusCode})\n\nBạn không có quyền xem danh sách sự kiện này.`;
            break;
          case 404:
            errorMessage = `🔍 Không tìm thấy dữ liệu (${statusCode})\n\nDanh sách sự kiện không tồn tại hoặc đã bị xóa.`;
            break;
          case 500:
            errorMessage = `⚠️ Lỗi hệ thống (${statusCode})\n\nHệ thống đang gặp sự cố. Vui lòng thử lại sau ít phút.`;
            break;
          default:
            errorMessage = `❗ Có lỗi xảy ra (${statusCode})\n\n${
              serverMessage || "Vui lòng thử lại sau."
            }`;
        }
      } else if (err.request) {
        errorMessage = `🌐 Lỗi kết nối mạng\n\nKhông thể kết nối đến server. Vui lòng kiểm tra kết nối internet.`;
      } else {
        errorMessage = `❓ Lỗi không xác định\n\n${err.message}`;
      }

      alert(errorMessage);

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

      // Xử lý lỗi delete với thông báo thân thiện
      let errorMessage = "";
      let statusCode = "";

      if (err.response) {
        statusCode = err.response.status;
        const serverMessage = err.response.data?.message || "";

        switch (statusCode) {
          case 400:
            errorMessage = `❌ Không thể xóa sự kiện (${statusCode})\n\n${
              serverMessage || "Dữ liệu không hợp lệ."
            }`;
            break;
          case 401:
            errorMessage = `🔐 Phiên đăng nhập hết hạn (${statusCode})\n\nVui lòng đăng nhập lại để tiếp tục.`;
            break;
          case 403:
            errorMessage = `🚫 Không có quyền xóa (${statusCode})\n\nBạn không có quyền xóa sự kiện này.`;
            break;
          case 404:
            errorMessage = `🔍 Sự kiện không tồn tại (${statusCode})\n\nSự kiện có thể đã bị xóa trước đó.`;
            break;
          case 500:
            errorMessage = `⚠️ Lỗi hệ thống (${statusCode})\n\nKhông thể xóa sự kiện. Vui lòng thử lại sau.`;
            break;
          default:
            errorMessage = `❗ Lỗi xóa sự kiện (${statusCode})\n\n${
              serverMessage || "Vui lòng thử lại."
            }`;
        }
      } else if (err.request) {
        errorMessage = `🌐 Lỗi kết nối\n\nKhông thể kết nối đến server để xóa sự kiện.`;
      } else {
        errorMessage = `❓ Lỗi không xác định\n\n${err.message}`;
      }

      alert(errorMessage);
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
