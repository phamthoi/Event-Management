// client/src/pages/events/AttendancePage.jsx
import React, { useEffect, useState } from "react";
import EventSelect from "../../../components/admin/attendance/EventSelect";
import MemberTable from "../../../components/admin/attendance/MemberTable";
import SaveButton from "../../../components/admin/attendance/SaveButton";
import { getOngoingEvents } from "../../../services/admin/event/attendanceService";
import { getRegistrations, updateAttendance } from "../../../services/admin/event/attendanceService";
import { showErrorAlert } from "../../../utils/admin/errorHandler";

function AttendancePage() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await getOngoingEvents();
        
        if (response.success) {
          setEvents(response.events);
        }
      } catch (error) {
        console.error('Error fetching ongoing events:', error);
        showErrorAlert(error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const fetchRegistrations = async () => {
      if (selectedEvent) {
        try {
          setLoading(true);
          const response = await getRegistrations(selectedEvent);
          const formattedRegs = response.registrations.map(reg => ({
            id: reg.id,
            user: reg.user,
            attended: reg.attendance || false
          }));
          setRegistrations(formattedRegs);
        } catch (error) {
          console.error('Error fetching registrations:', error);
          showErrorAlert(error);
        } finally {
          setLoading(false);
        }
      } else {
        setRegistrations([]);
      }
    };

    fetchRegistrations();
  }, [selectedEvent]);

  const handleToggle = (regId) => {
    const updated = registrations.map((reg) =>
      reg.id === regId ? { ...reg, attended: !reg.attended } : reg
    );
    setRegistrations(updated);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const updates = registrations.map(reg => ({
        registrationId: reg.id,
        attended: reg.attended
      }));
      
      await updateAttendance(updates);
      alert('Attendance saved successfully!');
    } catch (error) {
      console.error('Error saving attendance:', error);
      showErrorAlert(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Attendance</h1>

      {events.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No ongoing events available
        </div>
      ) : (
        <>
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

          {selectedEvent && (
            <SaveButton onClick={handleSave} disabled={loading} />
          )}
        </>
      )}
    </div>
  );
}

export default AttendancePage;
