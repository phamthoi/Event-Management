import * as React from "react";
import {
  Edit,
  SimpleForm,
  TextInput,
  NumberInput,
  DateTimeInput,
  required,
  useTranslate,
} from "react-admin";

const formatVND = (value?: number) => (value == null || isNaN(value)) ? "" : value.toLocaleString("vi-VN");
const parseVND = (value?: string) => value ? parseInt(value.replace(/\./g, ""), 10) || undefined : undefined;

const formatLocal = (value?: string) => {
  if (!value) return "";
  const date = new Date(value);
  return date.toISOString().slice(0, 16);
};

const parseUTC = (value?: string) => value ? new Date(value).toISOString() : undefined;

const transformData = (data: any, { previousData }: any) => {
  const merged = { ...previousData, ...data };
  Object.keys(merged).forEach((key) => {
    if (merged[key] === "") merged[key] = null;
  });
  return merged;
};

const EventEdit = () => {
  const translate = useTranslate();

  return (
    <Edit resource="events" mutationMode="pessimistic" transform={transformData} redirect="list">
      <SimpleForm>
        <TextInput source="title" label={translate("resources.events.fields.title")} validate={required()} />
        <TextInput source="location" label={translate("resources.events.fields.location")} />

        <DateTimeInput
          source="startAt"
          label={translate("resources.events.fields.startAt")}
          format={formatLocal}
          parse={parseUTC}
          validate={required()}
        />
        <DateTimeInput
          source="endAt"
          label={translate("resources.events.fields.endAt")}
          format={formatLocal}
          parse={parseUTC}
          validate={required()}
        />
        <DateTimeInput
          source="registrationStartAt"
          label={translate("resources.events.fields.registrationStartAt")}
          format={formatLocal}
          parse={parseUTC}
        />
        <DateTimeInput
          source="registrationEndAt"
          label={translate("resources.events.fields.registrationEndAt")}
          format={formatLocal}
          parse={parseUTC}
        />

        <NumberInput source="minAttendees" label={translate("resources.events.fields.minAttendees")} />
        <NumberInput source="maxAttendees" label={translate("resources.events.fields.maxAttendees")} />
        <TextInput
          source="deposit"
          label={translate("resources.events.fields.deposit")}
          format={formatVND}
          parse={parseVND}
        />
        <NumberInput source="registeredCount" label={translate("resources.events.fields.registeredCount")} disabled />
        <TextInput source="description" label={translate("resources.events.fields.description")} multiline />
      </SimpleForm>
    </Edit>
  );
};

export default EventEdit;
