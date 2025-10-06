// src/components/events/EventEdit.tsx
import * as React from "react";
import {
  Edit,
  SimpleForm,
  TextInput,
  NumberInput,
  DateTimeInput,
  required,
} from "react-admin";

const EventEdit = () => {
  return (
    <Edit resource="events" mutationMode="pessimistic">
      <SimpleForm>
        <TextInput source="title" label="Event Name" validate={required()} />
        <TextInput source="location" label="Location" />
        <DateTimeInput source="startAt" label="Event Start" />
        <DateTimeInput source="endAt" label="Event End" />
        <DateTimeInput source="registrationStartAt" label="Registration Start" />
        <DateTimeInput source="registrationEndAt" label="Registration End" />
        <NumberInput source="minAttendees" label="Min Attendees" />
        <NumberInput source="maxAttendees" label="Max Attendees" />
        <NumberInput source="deposit" label="Deposit (VND)" />
        <NumberInput source="registeredCount" label="Registered Users" disabled />
        <TextInput source="description" label="Description" />
      </SimpleForm>
    </Edit>
  );
};

export default EventEdit;
