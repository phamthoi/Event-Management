import * as React from "react";
import {
  List,
  Datagrid,
  TextField,
  DateField,
  TopToolbar,
  CreateButton,
  FunctionField,
  EditButton,
  DeleteButton,
  useGetIdentity,
  useTranslate,
} from "react-admin";
import EventFilter from "./EventFilter";

const EventListActions = () => {
  const translate = useTranslate();
  return (
    <TopToolbar>
      <CreateButton label={translate("ra.action.create")} />
    </TopToolbar>
  );
};

const EventRowActions = () => {
  const { identity, isLoading } = useGetIdentity();
  if (isLoading) return null;

  return (
    <div style={{ display: "flex", gap: "0.5rem" }}>
      <EditButton />
      {identity?.role === "ADMIN" && <DeleteButton />}
    </div>
  );
};

const EventList = () => {
  const translate = useTranslate();

  return (
    <List
      resource="events"
      filters={<EventFilter />}
      perPage={10}
      title={translate("custom.menu.events")}
      sort={{ field: "startAt", order: "DESC" }}
      actions={<EventListActions />}
    >
      <Datagrid>
        <TextField source="title" label={translate("resources.events.fields.title")} />
        <TextField source="location" label={translate("resources.events.fields.location")} />
        <DateField source="startAt" label={translate("resources.events.fields.startAt")} showTime />
        <DateField source="endAt" label={translate("resources.events.fields.endAt")} showTime />

        <FunctionField
          label={translate("resources.events.fields.registeredCount")}
          render={(record: any) => `${record.registeredCount || 0} / ${record.maxAttendees || 0}`}
        />

        <TextField source="status" label={translate("resources.events.fields.status")} />

        <FunctionField
          label={translate("resources.events.fields.deposit")}
          render={(record: any) => (Number(record.deposit) || 0).toLocaleString("vi-VN")}
        />

        <EventRowActions />
      </Datagrid>
    </List>
  );
};

export default EventList;
