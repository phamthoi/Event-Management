//client/src/pages/events/EditEventPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EditEventForm from "../../components/EventList/EditEventForm";

const EditEventPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("events")) || [];
    const found = stored.find((e) => e.id === parseInt(id));
    if (found) {
      setEvent(found);
    } else {
      setError("❌ Event not found");
    }
  }, [id]);

  const handleChange = (e) => {
    setEvent({ ...event, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMsg("");
    setError("");
    try {
      const stored = JSON.parse(localStorage.getItem("events")) || [];
      const updated = stored.map((ev) =>
        ev.id === parseInt(id) ? { ...event } : ev
      );
      localStorage.setItem("events", JSON.stringify(updated));
      setMsg("✅ Event updated successfully!");
    } catch (err) {
      setError("❌ " + err.message);
    }
  };

  if (!event) return <div className="p-6">Loading...</div>;

  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Edit Event</h2>

        <EditEventForm event={event} onChange={handleChange} onSubmit={handleSubmit} />

        {msg && <div className="mt-2 text-green-500 text-sm">{msg}</div>}
        {error && <div className="mt-2 text-red-500 text-sm">{error}</div>}

        <div className="mt-4 text-center">
          <button
            onClick={() => navigate("/admin/events/list")}
            className="text-blue-600 hover:underline"
          >
            ← Back to Event List
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditEventPage;
