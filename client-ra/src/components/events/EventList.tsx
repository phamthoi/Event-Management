import * as React from "react";
import { 
  List, 
  Datagrid, 
  TextField, 
  DateField,
  TopToolbar,
  CreateButton,
  FunctionField,
  EditButton, // Import EditButton
  DeleteButton, // Import DeleteButton
  useGetIdentity // Import useGetIdentity
} from "react-admin";
import EventFilter from "./EventFilter";
// import EventActions from "./EventActions"; // Bỏ import EventActions

// Custom actions cho List
const EventListActions = () => (
  <TopToolbar>
    <CreateButton label="Create Event" />
  </TopToolbar>
);

// Component chứa nút Edit và Delete có kiểm tra quyền
const EventRowActions = () => {
    const { identity, isLoading } = useGetIdentity();

    if (isLoading) return null;

    return (
        <div style={{ display: "flex", gap: "0.5rem" }}>
            {/* Nút Edit luôn có */}
            <EditButton /> 
            
            {/* Nút Delete chỉ hiển thị cho ADMIN */}
            {identity?.role === "ADMIN" && (
                <DeleteButton />
            )}
        </div>
    );
};

const EventList = () => (
  <List
    resource="events"
    filters={<EventFilter />}
    perPage={10}
    title="Event Management"
    sort={{ field: "startAt", order: "DESC" }}
    actions={<EventListActions />}
  >
    <Datagrid>
      <TextField source="title" label="Name" />
      <TextField source="location" label="Location" />
      <DateField source="startAt" label="Start" showTime />
      <DateField source="endAt" label="End" showTime />

      {/* Registered / Max */}
      <FunctionField
        label="Registered"
        render={(record: any) => `${record.registeredCount || 0} / ${record.maxAttendees || 0}`}
      />

      <TextField source="status" label="Status" />

      {/* Deposit */}
      <FunctionField
      label="Deposit"
      render={(record: any) => {
        const amount = Number(record.deposit) || 0; // ép kiểu number
        return amount.toLocaleString("vi-VN"); // 10.000 ₫
      }}
      />

      {/* Thay thế EventActions bằng Component mới */}
      <EventRowActions/> 
    </Datagrid>
  </List>
);

export default EventList;