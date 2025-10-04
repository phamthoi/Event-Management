import * as React from "react";
import { List, Datagrid, TextField, DateField, EditButton, DeleteButton } from "react-admin";
import EventFilter from "./EventFilter";

const EventList = () => (
  <List
    resource="events"
    filters={<EventFilter />}
    perPage={10}
    title="Event Management"
    sort={{ field: "startAt", order: "DESC" }}
  >
    <Datagrid rowClick="edit">
      <TextField source="title" label="Name" />
      <TextField source="location" label="Location" />
      <DateField source="startAt" label="Start" showTime />
      <DateField source="endAt" label="End" showTime />
      <TextField source="status" label="Status" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export default EventList;
