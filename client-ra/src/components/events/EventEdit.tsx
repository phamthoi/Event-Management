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

// === Format tiền Việt Nam ===
const formatVND = (value?: number) => {
  if (value == null || isNaN(value)) return "";
  return value.toLocaleString("vi-VN");
};

const parseVND = (value?: string) => {
  if (!value) return undefined;
  const number = parseInt(value.replace(/\./g, ""), 10);
  return isNaN(number) ? undefined : number;
};

// === Convert UTC ↔ local time cho datetime-local input ===
const formatLocal = (value?: string) => {
  if (!value) return "";
  const date = new Date(value);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`; // local time
};

const parseUTC = (value?: string) => {
  if (!value) return undefined;
  const date = new Date(value);
  return date.toISOString(); // gửi UTC về backend
};

// === Gộp dữ liệu khi edit ===
const transformData = (data: any, { previousData }: any) => {
  const merged = { ...previousData, ...data };

  // Nếu input rỗng → null
  Object.keys(merged).forEach((key) => {
    if (merged[key] === "") merged[key] = null;
  });

  return merged;
};

const EventEdit = () => {
  return (
    <Edit
      resource="events"
      mutationMode="pessimistic"
      transform={transformData}
      redirect="list"
    >
      <SimpleForm>
        <TextInput source="title" label="Event Name" validate={required()} />
        <TextInput source="location" label="Location" />

        {/* ✅ Hiển thị giờ local, gửi UTC */}
        <DateTimeInput
          source="startAt"
          label="Event Start"
          format={formatLocal}
          parse={parseUTC}
          validate={required()}
        />
        <DateTimeInput
          source="endAt"
          label="Event End"
          format={formatLocal}
          parse={parseUTC}
          validate={required()}
        />
        <DateTimeInput
          source="registrationStartAt"
          label="Registration Start"
          format={formatLocal}
          parse={parseUTC}
        />
        <DateTimeInput
          source="registrationEndAt"
          label="Registration End"
          format={formatLocal}
          parse={parseUTC}
        />

        <NumberInput source="minAttendees" label="Min Attendees" />
        <NumberInput source="maxAttendees" label="Max Attendees" />

        {/* ✅ Format tiền Việt Nam */}
        <TextInput
          source="deposit"
          label="Deposit (VND)"
          format={formatVND}
          parse={parseVND}
        />

        <NumberInput source="registeredCount" label="Registered Users" disabled />
        <TextInput source="description" label="Description" multiline />
      </SimpleForm>
    </Edit>
  );
};

export default EventEdit;
