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

// === Convert local time ↔ UTC ===
const formatUTC = (value?: string) => {
  if (!value) return "";
  // Hiển thị lại theo local (giúp user thấy đúng giờ VN)
  const date = new Date(value);
  return date.toISOString().slice(0, 16); // format "YYYY-MM-DDTHH:mm"
};

const parseUTC = (value?: string) => {
  if (!value) return undefined;
  // Người nhập local time (ví dụ GMT+7), ta convert về UTC
  const date = new Date(value);
  return date.toISOString(); // backend sẽ nhận UTC chuẩn ISO
};

const EventCreate = () => {
  return (
    <Create resource="events" mutationMode="pessimistic">
      <SimpleForm>
        <TextInput source="title" label="Event Name" validate={required()} />
        <TextInput source="location" label="Location" />

        {/* ✅ Convert về UTC khi gửi */}
        <DateTimeInput
          source="startAt"
          label="Event Start"
          validate={required()}
          format={formatUTC}
          parse={parseUTC}
        />
        <DateTimeInput
          source="endAt"
          label="Event End"
          validate={required()}
          format={formatUTC}
          parse={parseUTC}
        />
        <DateTimeInput
          source="registrationStartAt"
          label="Registration Start"
          format={formatUTC}
          parse={parseUTC}
        />
        <DateTimeInput
          source="registrationEndAt"
          label="Registration End"
          format={formatUTC}
          parse={parseUTC}
        />

        <NumberInput source="minAttendees" label="Min Attendees" />
        <NumberInput source="maxAttendees" label="Max Attendees" />

        {/* ✅ Định dạng tiền Việt Nam, không dùng thư viện */}
        <TextInput
          source="deposit"
          label="Deposit (VND)"
          format={formatVND}
          parse={parseVND}
        />

        <TextInput source="description" label="Description" multiline />
      </SimpleForm>
    </Create>
  );
};

export default EventCreate;
