//client/src/pages/events/AttendancePage.jsx
/*
import { useEffect, useState } from "react";
//import {
//  getEvents,
//  getRegistrations,
//  updateAttendance,
//} from "../../services/admin/attendanceService";

import EventSelect from "../../components/attendance/EventSelect";
import MemberTable from "../../components/attendance/MemberTable";
import SaveButton from "../../components/attendance/SaveButton";

function AttendancePage() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [registrations, setRegistrations] = useState([]);
  const [message, setMessage] = useState("");
  const [isOngoing, setIsOngoing] = useState(false);

  
  // Load events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await getEvents();
        setEvents(res.data.events || []);
      } catch {
        setMessage("Không lấy được danh sách sự kiện");
      }
    };
    fetchEvents();
  }, []);

  // Khi chọn event
  const handleEventChange = async (e) => {
    const eventId = e.target.value;
    setSelectedEvent(eventId);
    setRegistrations([]);
    setMessage("");

    if (!eventId) return;

    const selected = events.find((ev) => ev.id === parseInt(eventId));
    const now = new Date();
    const start = new Date(selected.startAt);
    const end = new Date(selected.endAt);

    setIsOngoing(now >= start && now <= end);

    try {
      const res = await getRegistrations(eventId);
      setRegistrations(res.data.registrations || []);
    } catch {
      setMessage("Không lấy được danh sách thành viên");
    }
  };

  // Toggle attendance
  const handleToggle = (id) => {
    setRegistrations((prev) =>
      prev.map((reg) =>
        reg.id === id ? { ...reg, attended: !reg.attended } : reg
      )
    );
  };

  // Save attendance
  const handleSave = async () => {
    const updates = registrations
      .filter(() => isOngoing)
      .map((r) => ({ id: r.id, attended: r.attended }));

    if (updates.length === 0) {
      setMessage("Không có thay đổi nào để lưu");
      return;
    }

    try {
      await updateAttendance(updates);
      setMessage("✅ Cập nhật điểm danh thành công");
    } catch {
      setMessage("❌ Lỗi cập nhật điểm danh");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">Attende Member</h1>

      <EventSelect
        events={events}
        selectedEvent={selectedEvent}
        onChange={handleEventChange}
      />

      <MemberTable
        registrations={registrations}
        isOngoing={isOngoing}
        onToggle={handleToggle}
      />

      <SaveButton onClick={handleSave} />

      <div className="mt-2 text-red-500">{message}</div>
    </div>
  );
}

export default AttendancePage;
*/

// client/src/pages/events/AttendancePage.jsx
import React, { useEffect, useState } from "react";
import EventSelect from "../../components/attendance/EventSelect";
import MemberTable from "../../components/attendance/MemberTable";
import SaveButton from "../../components/attendance/SaveButton";

function AttendancePage() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [registrations, setRegistrations] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("events")) || [];
    setEvents(stored);
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      const allRegs = JSON.parse(localStorage.getItem("registrations")) || {};
      const members = JSON.parse(localStorage.getItem("members")) || [];

      // Tìm member nào đăng ký event này
      const regsForEvent = Object.entries(allRegs)
        .filter(([memberId, events]) => events[selectedEvent]) // chỉ lấy member có đăng ký event
        .map(([memberId]) => {
          const user = members.find((m) => m.id === parseInt(memberId));
          return {
            id: parseInt(memberId),
            user,
            attended: false, // mặc định false khi mới load
          };
        });

      setRegistrations(regsForEvent);
    } else {
      setRegistrations([]);
    }
  }, [selectedEvent]);

  const handleToggle = (regId) => {
    const updated = registrations.map((reg) =>
      reg.id === regId ? { ...reg, attended: !reg.attended } : reg
    );
    setRegistrations(updated);
  };

  const handleSave = () => {
    // lưu riêng vào attendance_{eventId}
    localStorage.setItem(
      `attendance_${selectedEvent}`,
      JSON.stringify(registrations)
    );
    alert("Saved!");
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Attendance</h1>

      <EventSelect
        events={events}
        selectedEvent={selectedEvent}
        onChange={(e) => setSelectedEvent(e.target.value)}
      />

      <MemberTable
        registrations={registrations}
        isOngoing={true}
        onToggle={handleToggle}
      />

      <SaveButton onClick={handleSave} />
    </div>
  );
}

export default AttendancePage;
