// src/resources/events/EventList.tsx
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
import { Flex, Badge, Box, Text } from "@radix-ui/themes";
import EventFilter from "./EventFilter";

const EventListActions = () => {
  const translate = useTranslate();
  return (
    <TopToolbar>
      <Flex justify="end" p="2">
        <CreateButton label={translate("ra.action.create")} />
      </Flex>
    </TopToolbar>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const colorMap: Record<string, "green" | "amber" | "red" | "gray"> = {
    OPEN: "green",
    UPCOMING: "amber",
    CLOSED: "red",
  };

  const color = colorMap[status?.toUpperCase()] || "gray";
  return (
    <Badge color={color} variant="soft" radius="full">
      {status}
    </Badge>
  );
};

const EventRowActions = () => {
  const { identity, isLoading } = useGetIdentity();
  if (isLoading) return null;

  return (
    <Flex gap="2" justify="end" align="center">
      <EditButton />
      {identity?.role === "ADMIN" && <DeleteButton />}
    </Flex>
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
      <Datagrid
        rowClick="show"
        bulkActionButtons={false}
        sx={{
          "& .column-title": { fontWeight: 600 },
          "& .column-deposit, & .column-actions": {
            textAlign: "right",
            justifyContent: "flex-end",
          },
          "& .RaDatagrid-row": {
            verticalAlign: "middle",
          },
        }}
      >
        <TextField
          source="title"
          label={translate("resources.events.fields.title")}
          className="column-title"
        />
        <TextField
          source="location"
          label={translate("resources.events.fields.location")}
        />
        <DateField
          source="startAt"
          label={translate("resources.events.fields.startAt")}
          showTime
        />
        <DateField
          source="endAt"
          label={translate("resources.events.fields.endAt")}
          showTime
        />

        <FunctionField
          label={translate("resources.events.fields.registeredCount")}
          render={(record: any) =>
            `${record.registeredCount || 0} / ${record.maxAttendees || 0}`
          }
        />

        <FunctionField
          source="status"
          label={translate("resources.events.fields.status")}
          render={(record: any) => <StatusBadge status={record.status} />}
        />

        <FunctionField
          source="deposit"
          label={translate("resources.events.fields.deposit")}
          render={(record: any) => (
            <Box style={{ textAlign: "right" }}>
              <Text weight="medium">
                {(Number(record.deposit) || 0).toLocaleString("vi-VN")}
              </Text>
            </Box>
          )}
          className="column-deposit"
        />

        <FunctionField
          label={translate("resources.upcoming.fields.actions")}
          render={() => <EventRowActions />}
          className="column-actions"
        />
      </Datagrid>
    </List>
  );
};

export default EventList;
