import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { useDataProvider, useNotify } from "react-admin";
import { Registration } from "../../types";
import EventSelect from "./EventSelect";
import MemberTable from "./MemberTable";
import AttendanceToolbar from "./AttendanceToolbar";

const AttendancePage: React.FC = () => {
  const dataProvider = useDataProvider();
  const notify = useNotify();

  const [events, setEvents] = useState<{ id: number; title: string; status: string }[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [currentEventStatus, setCurrentEventStatus] = useState<string>("");

  // Load danh sách sự kiện
  useEffect(() => {
    (async () => {
      try {
        const { data } = await dataProvider.getList("attendance-events", {
          pagination: { page: 1, perPage: 100 },
          sort: { field: "id", order: "DESC" },
          filter: {},
        });
        setEvents(data);
      } catch (error) {
        console.error(error);
        notify("❌ Lỗi khi tải danh sách sự kiện", { type: "error" });
      }
    })();
  }, [dataProvider, notify]);

  // Load danh sách đăng ký khi chọn sự kiện
  useEffect(() => {
    if (!selectedEvent) return;
    (async () => {
      try {
        const { data } = await dataProvider.getList("registrations", {
          pagination: { page: 1, perPage: 100 },
          sort: { field: "id", order: "ASC" },
          filter: { eventId: selectedEvent },
        });
        setRegistrations(data);
        const event = events.find((e) => e.id === selectedEvent);
        setCurrentEventStatus(event?.status ?? "");
      } catch (error) {
        console.error(error);
        notify("❌ Lỗi khi tải danh sách đăng ký", { type: "error" });
      }
    })();
  }, [selectedEvent, dataProvider, notify, events]);

  // Toggle từng checkbox
  const handleToggle = async (regId: number, field: "depositPaid" | "attended") => {
    const target = registrations.find((r) => r.id === regId);
    if (!target) return;

    const updated = { ...target, [field]: !target[field] };
    setRegistrations((prev) => prev.map((r) => (r.id === regId ? updated : r)));

    try {
      await dataProvider.update("registrations", {
        id: regId,
        data: { [field]: updated[field] },
        previousData: target,
      });
    } catch (error) {
      console.error(error);
      notify("❌ Lỗi khi cập nhật trạng thái", { type: "error" });
    }
  };

  const refresh = () => {
    if (selectedEvent) setSelectedEvent(selectedEvent); // trigger reload useEffect
  };

  return (
    <Card sx={{ maxWidth: 1200, m: "auto", mt: 5 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Điểm danh sự kiện
        </Typography>

        <EventSelect
          events={events}
          selectedEvent={selectedEvent}
          onChange={setSelectedEvent}
        />

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
