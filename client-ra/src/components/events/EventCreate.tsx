import * as React from "react";
import {
  Create,
  SimpleForm,
  TextInput,
  NumberInput,
  DateTimeInput,
  required,
  useTranslate,
} from "react-admin";

const formatVND = (value?: number) => (value == null || isNaN(value)) ? "" : value.toLocaleString("vi-VN");
const parseVND = (value?: string) => value ? parseInt(value.replace(/\./g, ""), 10) || undefined : undefined;

const formatUTC = (value?: string) => value ? new Date(value).toISOString().slice(0, 16) : "";
const parseUTC = (value?: string) => value ? new Date(value).toISOString() : undefined;

const EventCreate = () => {
  const translate = useTranslate();

  return (
    <Create resource="events" mutationMode="pessimistic">
      <SimpleForm>
        <TextInput source="title" label={translate("resources.events.fields.title")} validate={required()} />
        <TextInput source="location" label={translate("resources.events.fields.location")} />

        <DateTimeInput
          source="startAt"
          label={translate("resources.events.fields.startAt")}
          validate={required()}
          format={formatUTC}
          parse={parseUTC}
        />
        <DateTimeInput
          source="endAt"
          label={translate("resources.events.fields.endAt")}
          validate={required()}
          format={formatUTC}
          parse={parseUTC}
        />
        <DateTimeInput
          source="registrationStartAt"
          label={translate("resources.events.fields.registrationStartAt")}
          format={formatUTC}
          parse={parseUTC}
        />
        <DateTimeInput
          source="registrationEndAt"
          label={translate("resources.events.fields.registrationEndAt")}
          format={formatUTC}
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

        <TextInput source="description" label={translate("resources.events.fields.description")} multiline />
      </SimpleForm>
    </Create>
  );
};

export default EventCreate;
