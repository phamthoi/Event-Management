// src/components/members/MemberShow.tsx
import * as React from "react";
import {
  Show,
  SimpleShowLayout,
  TextField,
  EmailField,
  DateField,
  BooleanField,
  useRecordContext,
} from "react-admin";
import { Chip } from "@mui/material";

const RoleField = () => {
  const record = useRecordContext();
  if (!record) return null;

  return (
    <Chip
      label={record.role}
      color={record.role === "ADMIN" ? "secondary" : "primary"}
      size="small"
    />
  );
};

const StatusField = () => {
  const record = useRecordContext();
  if (!record) return null;

  return (
    <Chip
      label={record.isActive ? "Active" : "Locked"}
      color={record.isActive ? "success" : "error"}
      size="small"
    />
  );
};

const MemberShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="fullName" label="Full Name" />
      <EmailField source="email" />
      <TextField source="phoneNumber" label="Phone" />
      <RoleField />
      <StatusField />
      <TextField source="organizationId" />
      <TextField source="organization.name" label="Organization Name" />
      <DateField source="createdAt" showTime />
      <DateField source="updatedAt" showTime />
    </SimpleShowLayout>
  </Show>
);

export default MemberShow;
