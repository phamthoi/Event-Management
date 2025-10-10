import React, { useEffect, useState, useCallback } from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { useDataProvider, useNotify } from "react-admin";
import { Registration } from "../../types";
import EventSelect from "./EventSelect";
import MemberTable from "./MemberTable";
import AttendanceToolbar from "./AttendanceToolbar";
import api from "../../services/axios";

// Typing chuẩn cho event
interface Event {
  id: number;
  title: string;
  status: string;
}

const AttendancePage: React.FC = () => {
  const dataProvider = useDataProvider();
  const notify = useNotify();

  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [currentEventStatus, setCurrentEventStatus] = useState<string>("");

  // ================= Load Events =================
  const loadEvents = useCallback(async () => {
    try {
      const { data } = await dataProvider.getList<Event>("ongoing-events", {
        pagination: { page: 1, perPage: 100 },
        sort: { field: "id", order: "DESC" },
        filter: {},
      });
      setEvents(data);
    } catch (error) {
      console.error("Error loading events:", error);
      notify("❌ Lỗi khi tải danh sách sự kiện", { type: "error" });
    }
  }, [dataProvider, notify]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  // ================= Load Registrations =================
  const loadRegistrations = useCallback(
    async (eventId: number) => {
      try {
        const res = await api.get(`/admin/events/registrations/${eventId}`);
        const list: Registration[] = res.data.data || res.data.registrations || res.data;
        setRegistrations(list);

        const event = events.find((e) => e.id === eventId);
        setCurrentEventStatus(event?.status || "");
      } catch (error) {
        console.error("Error loading registrations:", error);
        notify("❌ Lỗi khi tải danh sách đăng ký", { type: "error" });
      }
    },
    [events, notify]
  );

  useEffect(() => {
    if (selectedEvent !== null) {
      loadRegistrations(selectedEvent);
    }
  }, [selectedEvent, loadRegistrations]);

  // ================= Toggle Attendance / Deposit =================
  const handleToggle = useCallback(
    async (regId: number, field: "depositPaid" | "attended") => {
      const target = registrations.find((r) => r.id === regId);
      if (!target) return;

      const updated = { ...target, [field]: !target[field] };
      setRegistrations((prev) => prev.map((r) => (r.id === regId ? updated : r)));

      try {
        const payload = {
          updates: [
            {
              registrationId: regId,
              depositPaid: updated.depositPaid,
              attended: updated.attended,
            },
          ],
        };

        console.log("Sending payload:", payload);
        await api.put(`/admin/events/registrations/update-status`, payload);
        notify("✅ Cập nhật thành công", { type: "success" });
      } catch (error) {
        console.error("Error updating registration:", error);
        notify("❌ Lỗi khi cập nhật trạng thái", { type: "error" });
      }
    },
    [registrations, notify]
  );

  // ================= Refresh =================
  const refresh = useCallback(async () => {
    if (selectedEvent !== null) {
      await loadRegistrations(selectedEvent);
    }
  }, [selectedEvent, loadRegistrations]);

  // ================= Render =================
  return (
    <Card sx={{ maxWidth: 1200, m: "auto", mt: 5 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Điểm danh sự kiện
        </Typography>

        <EventSelect events={events} selectedEvent={selectedEvent} onChange={setSelectedEvent} />

        <MemberTable
          registrations={registrations}
          onToggle={handleToggle}
          currentEventStatus={currentEventStatus}
        />

        <AttendanceToolbar
          eventId={selectedEvent}
          registrations={registrations}
          setRegistrations={setRegistrations}
          refresh={refresh}
        />
      </CardContent>
    </Card>
  );
};

export default AttendancePage;
