// client/src/pages/events/AttendancePage.jsx
import React, { useEffect, useState } from "react";
import EventSelect from "../../../components/admin/attendance/EventSelect";
import MemberTable from "../../../components/admin/attendance/MemberTable";
import SaveButton from "../../../components/admin/attendance/SaveButton";

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
