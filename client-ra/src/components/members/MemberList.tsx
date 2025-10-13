// src/components/members/MemberList.tsx
import * as React from "react";
import {
  List,
  Datagrid,
  TextField,
  EmailField,
  TextInput,
  useRecordContext,
  useNotify,
  useRefresh,
  Filter,
  FieldProps,
  ShowButton,
  SelectInput,
} from "react-admin";
import { Button, Chip, Box } from "@mui/material";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { useNavigate } from "react-router-dom";
import api from "../../services/axios";
import { useTranslate } from 'react-admin';

interface MemberRecord {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  isActive: boolean;
}

/* ✅ Custom field hiển thị trạng thái */
const ActiveField = (props: FieldProps<MemberRecord>) => {
  const translate = useTranslate();
  const record = useRecordContext<MemberRecord>(props);
  if (!record) return null;

  return (
    <Chip
      label={record.isActive ?  translate("resources.members.fields.active") : translate("resources.members.fields.locked")}
      color={record.isActive ? "success" : "error"}
      size="small"
    />
  );
};

/* ✅ Nút Reset Password (gọi route riêng) */
const ResetPasswordButton = () => {
  const translate = useTranslate();
  const record = useRecordContext<MemberRecord>();
  const navigate = useNavigate();
  if (!record) return null;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/admin/members/${record.id}/reset-password`);
  };

  return (
    <Button
      size="small"
      color="warning"
      onClick={handleClick}
      startIcon={<VpnKeyIcon />}
    >
      {translate('resources.members.fields.ResetPassword')}
    </Button>
  );
};

/* ✅ Nút Lock / Unlock Member */
const LockUnlockButton = () => {
  const translate = useTranslate();
  const record = useRecordContext<MemberRecord>();
  const notify = useNotify();
  const refresh = useRefresh();
  if (!record) return null;

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (record.isActive) {
        await api.put(`/admin/members/${record.id}/lock`);
        notify(`🔒 Member ${record.fullName} locked`, { type: "success" });
      } else {
        await api.put(`/admin/members/${record.id}/unlock`);
        notify(`🔓 Member ${record.fullName} unlocked`, { type: "success" });
      }
      refresh();
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
      {record.isActive ? translate("resources.members.fields.lock") : translate("resources.members.fields.unlock")}
    </Button>
  );
};

/* ✅ Bộ lọc Member */
const MemberFilter = (props: any) => {
  const translate = useTranslate();
  return (
  <Filter {...props}>
    <TextInput label="Email" source="email" alwaysOn />
    <TextInput label={translate("resources.members.fields.name")} source="fullName" alwaysOn/>
    <SelectInput
      label={translate("resources.members.fields.status")}
      source="isActive"
      choices={[
        { id: true, name: translate("resources.members.status.ACTIVE") },
        { id: false, name: translate("resources.members.status.LOCKED") },
      ]}
      alwaysOn
    />
  </Filter>
);
};

/* ✅ Danh sách Member */
const MemberList = () => {
  const translate = useTranslate();
  return (
  <List
    resource="members"
    filters={<MemberFilter />}
    sort={{ field: "id", order: "DESC" }}
    perPage={10}
    title="👥 Member Management"
  >
    <Datagrid bulkActionButtons={false}>
      <TextField source="id" label="ID" />
      <EmailField source="email" />
      <TextField source="fullName" label={translate("resources.members.fields.name")} />
      <TextField source="phoneNumber" label={translate("resources.members.fields.phonenumber")} />
      <ActiveField source="isActive" label={translate("resources.members.fields.status")} />

      {/* ✅ Cột hành động */}
      <Box
        component="div"
        sx={{ display: "flex", alignItems: "center", gap: 1 }}
      >
        <ShowButton />
        <LockUnlockButton />
        <ResetPasswordButton />
      </Box>
    </Datagrid>
  </List>
);
};  

export default MemberList;
