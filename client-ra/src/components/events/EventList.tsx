import * as React from "react";
import { 
          List, 
          Datagrid, 
          TextField, 
          DateField,
          TopToolbar,
          CreateButton,
        } from "react-admin";
import EventFilter from "./EventFilter";
import EventActions from "./EventActions";

// Tạo custom actions cho List
const EventListActions = () => (
  <TopToolbar>
    <CreateButton label="Create Event" />
  </TopToolbar>
);

const EventList = () => (
  <List
    resource="events"
    filters={<EventFilter />}
    perPage={10}
    title="Event Management"
    sort={{ field: "startAt", order: "DESC" }}
    actions={<EventListActions />} // Thêm custom actions vào List
  >
    <Datagrid>
      <TextField source="title" label="Name" />
      <TextField source="location" label="Location" />
      <DateField source="startAt" label="Start" showTime />
      <DateField source="endAt" label="End" showTime />
      <TextField source="status" label="Status" />
      <EventActions/>
    </Datagrid>
  </List>
);

export default EventList;
