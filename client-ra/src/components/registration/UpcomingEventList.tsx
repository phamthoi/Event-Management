// src/admin/events/UpcomingEventsList.tsx
import React from "react";
import {
  List,
  Datagrid,
  TextField,
  DateField,
  FunctionField,
  useDataProvider,
  useNotify,
  useRefresh,
  BooleanField,
} from "react-admin";
import { Button } from "@mui/material";

const statusColors: Record<string, string> = {
  UPCOMING: "bg-blue-100 text-blue-800",
  ONGOING: "bg-green-100 text-green-800",
  COMPLETED: "bg-gray-200 text-gray-800",
  CANCELLED: "bg-red-100 text-red-800",
};

const RegisterButton = ({ record }: { record: any }) => {
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const refresh = useRefresh();

  const handleClick = async () => {
    try {
      if (!record.registered) {
        await dataProvider.create("event-register", { data: { eventId: record.id } });
        notify("Registered successfully", { type: "success" });
      } else {
        await dataProvider.delete("event-register", { id: record.id });
        notify("Registration cancelled", { type: "success" });
      }
      refresh();
    } catch (err: any) {
      notify(err.message || "Error", { type: "error" });
    }
  };

  return (
    <Button
      variant="contained"
      color={record.registered ? "error" : "primary"}
      onClick={handleClick}
      disabled={record.status === "CANCELLED"}
    >
      {record.registered ? "❌ Cancel" : "🚀 Register"}
    </Button>
  );
};

const UpcomingEventsList = () => {
  return (
    <List
      resource="upcoming-events"
      perPage={4}
      sort={{ field: "startAt", order: "ASC" }}
    >
      <Datagrid rowClick="show">
        <TextField source="title" label="Event Title" />
        <TextField source="location" label="Location" />
        <DateField source="startAt" label="Start Time" showTime />
        <DateField source="endAt" label="End Time" showTime />
        <FunctionField
          label="Status"
          render={(record: any) => (
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                statusColors[record.status] || "bg-gray-100 text-gray-800"
              }`}
            >
              {record.status}
            </span>
          )}
        />
        <FunctionField
          label="Slots"
          render={(record: any) =>
            `${record.registeredCount || 0} / ${record.maxAttendees} ${
              record.maxAttendees - (record.registeredCount || 0) > 0
                ? `(${record.maxAttendees - (record.registeredCount || 0)} left)`
                : "(Full)"
            }`
          }
        />
        <FunctionField
          label="Action"
          render={(record: any) => <RegisterButton record={record} />}
        />
      </Datagrid>
    </List>
  );
};

export default UpcomingEventsList;
