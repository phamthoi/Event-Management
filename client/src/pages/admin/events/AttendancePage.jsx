// client/src/pages/events/AttendancePage.jsx
import React, { useEffect, useState } from "react";
import EventSelect from "../../../components/admin/attendance/EventSelect";
import MemberTable from "../../../components/admin/attendance/MemberTable";
import { getOngoingEvents, getRegistrations, updateRegistrationStatus } from "../../../services/admin/event/attendanceService";
import { showErrorAlert } from "../../../utils/admin/errorHandler";

function AttendancePage() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await getOngoingEvents();
        if (response.success) setEvents(response.events);
      } catch (error) {
        console.error("Error fetching ongoing events:", error);
        showErrorAlert(error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    const fetchRegistrations = async () => {
      if (!selectedEvent) {
        setRegistrations([]);
        return;
      }
      try {
        setLoading(true);
        const response = await getRegistrations(selectedEvent);
        const formattedRegs = response.registrations.map((reg) => ({
          id: reg.id,
          user: reg.user,
          attended: reg.attendance || false,
          depositPaid: reg.depositPaid || false,
        }));
        setRegistrations(formattedRegs);
      } catch (error) {
        console.error("Error fetching registrations:", error);
        showErrorAlert(error);
      } finally {
        setLoading(false);
      }
    };
    fetchRegistrations();
  }, [selectedEvent]);

  const handleToggle = (regId, type) => {
    setRegistrations((prev) =>
      prev.map((reg) => {
        if (reg.id !== regId) return reg;
        if (type === "attended") return { ...reg, attended: !reg.attended };
        if (type === "depositPaid") return { ...reg, depositPaid: !reg.depositPaid };
        return reg;
      })
    );
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const updates = registrations.map((reg) => ({
        registrationId: reg.id,
        attended: reg.attended,
        depositPaid: reg.depositPaid,
      }));
      await updateRegistrationStatus(updates);
      alert("Updates saved successfully!");
    } catch (error) {
      console.error("Error saving updates:", error);
      showErrorAlert(error);
    } finally {
      setSaving(false);
    }
  };

  // Lấy status của event hiện tại để quyết định checkbox
  const currentEventStatus = events.find(ev => ev.id === Number(selectedEvent))?.status || "";

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
        Attendance & Deposit
      </h1>

      {events.length === 0 ? (
        <div className="text-center text-gray-500 py-12 bg-white shadow rounded-lg">
          No ongoing events available
        </div>
      ) : (
        <>
          {/* Event Selector */}
          <EventSelect
            events={events}
            selectedEvent={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
          />

          {/* Member Table */}
          <div className="mt-4 overflow-x-auto bg-white shadow rounded-lg p-4">
            <MemberTable
              registrations={registrations}
              //isOngoing={true}
              isOngoing={currentEventStatus === "ONGOING"} // only enable attended if ongoing
              onToggle={handleToggle}
            />
          </div>

          {/* Save Button */}
          {selectedEvent && (
            <div className="flex justify-end mt-6">
              <button
                onClick={handleSave}
                disabled={saving}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg ${
                  saving
                    ? "bg-gray-400 cursor-not-allowed text-gray-200"
                    : "bg-blue-600 hover:bg-blue-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                }`}
              >
                {saving && (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                )}
                {saving ? "Saving..." : "Save Updates"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AttendancePage;
