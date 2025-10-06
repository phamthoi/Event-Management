// src/components/events/EventCreate.tsx
import * as React from "react";
import {
  Create,
  SimpleForm,
  TextInput,
  NumberInput,
  DateTimeInput,
  required,
} from "react-admin";

const EventCreate = () => {
  return (
    <Create resource="events" mutationMode="pessimistic">
      <SimpleForm>
        <TextInput source="title" label="Event Name" validate={required()} />
        <TextInput source="location" label="Location" />
        <DateTimeInput source="startAt" label="Event Start" validate={required()} />
        <DateTimeInput source="endAt" label="Event End" validate={required()} />
        <DateTimeInput source="registrationStartAt" label="Registration Start" />
        <DateTimeInput source="registrationEndAt" label="Registration End" />
        <NumberInput source="minAttendees" label="Min Attendees" />
        <NumberInput source="maxAttendees" label="Max Attendees" />
        <NumberInput source="deposit" label="Deposit (VND)" />
        <TextInput source="description" label="Description" multiline />
      </SimpleForm>
    </Create>
  );
};

export default EventCreate;
