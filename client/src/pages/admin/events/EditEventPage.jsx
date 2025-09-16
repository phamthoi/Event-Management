// client/src/pages/admin/events/EditEventPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EditEventForm from "../../../components/admin/EventList/EditEventForm";
import { getEventById, updateEvent } from "../../../services/admin/event/eventService";

const EditEventPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  // chuyển ISO (hoặc bất kỳ format backend trả) -> value cho <input type="datetime-local">
  const toLocalInput = (dateStr) => {
    if (!dateStr) return "";
    // nếu đã là dạng 'YYYY-MM-DDTHH:mm' thì giữ nguyên
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(dateStr)) return dateStr;
    try {
      return new Date(dateStr).toISOString().slice(0, 16);
    } catch {
      return "";
    }
  };

  // chuyển ngược lại (datetime-local -> ISO) để gửi backend
  const toISOStringFromLocal = (localStr) => {
    if (!localStr) return null;
    try {
      return new Date(localStr).toISOString();
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const raw = await getEventById(id);
        console.debug("getEventById raw:", raw);

        // Map/normalize field names (nếu backend đặt tên khác bạn có thể thêm map ở đây)
        const normalized = {
          title: raw.title ?? raw.name ?? "",
          description: raw.description ?? raw.desc ?? "",
          location: raw.location ?? raw.venue ?? "",
          minAttendees: raw.minAttendees ?? raw.min_attendees ?? raw.min ?? "",
          maxAttendees: raw.maxAttendees ?? raw.max_attendees ?? raw.max ?? "",
          startAt: toLocalInput(raw.startAt ?? raw.start_at ?? raw.start),
          endAt: toLocalInput(raw.endAt ?? raw.end_at ?? raw.end),
          registrationStartAt: toLocalInput(raw.registrationStartAt ?? raw.registration_start_at),
          registrationEndAt: toLocalInput(raw.registrationEndAt ?? raw.registration_end_at),
          deposit: raw.deposit ?? 0,
        };

        console.debug("normalized event for form:", normalized);
        setEvent(normalized);
      } catch (err) {
        console.error("Fetch event error:", err);
        setError("❌ Không tìm thấy event hoặc lỗi server");
      }
    };
    fetchEvent();
  }, [id]);

  // Xử lý thay đổi input: giữ kiểu số cho number fields
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setEvent((prev) => ({
      ...prev,
      [name]:
        type === "number"
          ? (value === "" ? "" : Number(value))
          : value,
    }));
  };

  // Submit update: convert các ngày về ISO trước khi gửi
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");
    try {
      const payload = {
        title: event.title,
        description: event.description,
        location: event.location,
        minAttendees: event.minAttendees === "" ? null : Number(event.minAttendees),
        maxAttendees: event.maxAttendees === "" ? null : Number(event.maxAttendees),
        startAt: toISOStringFromLocal(event.startAt),
        endAt: toISOStringFromLocal(event.endAt),
        registrationStartAt: toISOStringFromLocal(event.registrationStartAt),
        registrationEndAt: toISOStringFromLocal(event.registrationEndAt),
        deposit: event.deposit === "" ? 0 : Number(event.deposit),
      };

      console.debug("sending update payload:", payload);
      await updateEvent(id, payload);
      setMsg("✅ Event updated successfully!");
      // tuỳ bạn: tự redirect về list
      // setTimeout(() => navigate("/admin/events/list"), 1000);
    } catch (err) {
      console.error("Update event error:", err);
      setError("❌ Lỗi khi update event: " + (err.response?.data?.message || err.message));
    }
  };

  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!event) return <div className="p-6">Loading...</div>;

  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Edit Event</h2>

        <EditEventForm event={event} onChange={handleChange} onSubmit={handleSubmit} />

        {msg && <div className="mt-2 text-green-500 text-sm">{msg}</div>}
        {error && <div className="mt-2 text-red-500 text-sm">{error}</div>}

        <div className="mt-4 text-center">
          <button onClick={() => navigate("/admin/events/list")} className="text-blue-600 hover:underline">
            ← Back to Event List
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditEventPage;
