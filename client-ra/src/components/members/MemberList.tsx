// src/components/members/MemberList.tsx
import * as React from "react";
import {
  List,
  Datagrid,
  TextField,
  EmailField,
  BooleanField,
  TextInput,
  ShowButton,
  useRecordContext,
  useNotify,
  useRefresh,
} from "react-admin";
import { Button } from "@mui/material";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { useNavigate } from "react-router-dom";
import api from "../../services/axios";

// Nút Reset Password
const ResetPasswordButton = () => {
  const record = useRecordContext();
  const navigate = useNavigate();
  if (!record) return null;

  const handleClick = () => {
    navigate(`/admin/members/${record.id}/reset-password`);
  };

  return (
    <Button
      size="small"
      color="warning"
      onClick={handleClick}
      startIcon={<VpnKeyIcon />}
    >
      Reset Password
    </Button>
  );
};

// Nút Lock / Unlock
const LockUnlockButton = () => {
  const record = useRecordContext();
  const notify = useNotify();
  const refresh = useRefresh();

  if (!record) return null;

  const handleToggle = async () => {
    try {
      if (record.isActive) {
        await api.put(`/admin/members/${record.id}/lock`);
        notify(`🔒 Member ${record.fullName} locked`, { type: "success" });
      } else {
        await api.put(`/admin/members/${record.id}/unlock`);
        notify(`🔓 Member ${record.fullName} unlocked`, { type: "success" });
      }
      refresh(); // reload lại list
    } catch (err: any) {
      notify(err.response?.data?.message || "Error", { type: "error" });
    }
  };

  return (
    <Button
      size="small"
      color={record.isActive ? "error" : "success"}
      onClick={handleToggle}
      startIcon={record.isActive ? <LockIcon /> : <LockOpenIcon />}
    >
      {record.isActive ? "Lock" : "Unlock"}
    </Button>
  );
};

// Bộ lọc
const MemberFilter = [
  <TextInput label="Email" source="email" alwaysOn key="email" />,
  <TextInput label="Full Name" source="fullName" key="fullName" />,
  <TextInput label="Status" source="isActive" key="status" />,
];

const MemberList = () => (
  <List
    resource="members"
    filters={MemberFilter}
    sort={{ field: "id", order: "DESC" }}
    perPage={10}
    title="👥 Member Management"
  >
    <Datagrid rowClick="show">
      <TextField source="id" label="ID" />
      <EmailField source="email" />
      <TextField source="fullName" label="Full Name" />
      <TextField source="phoneNumber" label="Phone" />
      <BooleanField source="isActive" label="Active" />

      <ShowButton />
      <LockUnlockButton /> {/* Thay EditButton bằng Lock/Unlock */}
      <ResetPasswordButton />
    </Datagrid>
  </List>
);

export default MemberList;
