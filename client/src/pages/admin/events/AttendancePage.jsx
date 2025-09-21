// client/src/pages/events/AttendancePage.jsx
import React, { useEffect, useState } from "react";
import EventSelect from "../../../components/admin/attendance/EventSelect";
import MemberTable from "../../../components/admin/attendance/MemberTable";
import SaveButton from "../../../components/admin/attendance/SaveButton";
import { getEvents } from "../../../services/admin/event/eventService";
import { getRegistrations, updateAttendance } from "../../../services/admin/event/attendanceService";

function AttendancePage() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);

  // Lấy danh sách events từ API và filter chỉ lấy ONGOING
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await getEvents({ limit: 1000 }); // Hoặc số lượng đủ lớn
        console.log('++++++ events:', response.events);
        const allEvents = response.events || response;
        console.log('++++++ allEvents:', allEvents);
        if (allEvents && Array.isArray(allEvents)) {
         
         
          const ongoingEvents = allEvents.filter(event => {
            const isOngoing = event.status === 'ONGOING';
            return isOngoing;
          });
          
      
          setEvents(ongoingEvents);
        } else {
          console.error('❌ allEvents is not an array:', allEvents);
          setEvents([]);
        }
      } catch (error) {
        console.error('❌ Error fetching events:', error);
        alert('Lỗi khi tải danh sách events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Lấy danh sách đăng ký khi chọn event
  useEffect(() => {
    const fetchRegistrations = async () => {
      if (selectedEvent) {
        try {
          setLoading(true);
          const response = await getRegistrations(selectedEvent);
          // Chuyển đổi format để phù hợp với component
          const formattedRegs = response.registrations.map(reg => ({
            id: reg.id,
            user: reg.user,
            attended: reg.attendance || false  // Sử dụng reg.attendance từ database
          }));
          setRegistrations(formattedRegs);
        } catch (error) {
          console.error('Error fetching registrations:', error);
          alert('Lỗi khi tải danh sách đăng ký');
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
      // Chuẩn bị dữ liệu để gửi lên server
      const updates = registrations.map(reg => ({
        registrationId: reg.id,
        attended: reg.attended
      }));
      
      await updateAttendance(updates);  // Không cần truyền eventId
      alert('Đã lưu điểm danh thành công!');
    } catch (error) {
      console.error('Error saving attendance:', error);
      alert('Lỗi khi lưu điểm danh');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Attendance</h1>

      {events.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          Không có event nào đang diễn ra (ONGOING)
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
