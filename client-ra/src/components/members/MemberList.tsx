// src/components/members/MemberList.tsx

import * as React from "react";
import {
  List,
  Datagrid,
  TextField,
  EmailField,
  TextInput,
  ShowButton,
  useRecordContext,
  useNotify,
  useRefresh,
  Filter,
  // Import FieldProps để định nghĩa kiểu cho Custom Field
  FieldProps,
} from "react-admin";
import { Button, Chip, Box } from "@mui/material"; 
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { useNavigate } from "react-router-dom";
import api from "../../services/axios";

// Định nghĩa kiểu dữ liệu cho bản ghi (record) để TypeScript dễ hiểu hơn
interface MemberRecord {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    isActive: boolean;
    // Thêm các thuộc tính khác nếu cần
}

// --- 1. CUSTOM FIELDS & ACTIONS ---

/**
 * Tùy chỉnh hiển thị trường isActive bằng Chip
 * Kế thừa FieldProps từ react-admin để nhận props 'source' và 'label'
 */
const ActiveField = (props: FieldProps<MemberRecord>) => {
    // Lấy bản ghi mà không cần dùng props.source
    const record = useRecordContext(props);
    if (!record) return null;

    return (
        <Chip
            label={record.isActive ? "Active" : "Locked"}
            color={record.isActive ? "success" : "error"}
            size="small"
        />
    );
};

// Nút Reset Password
const ResetPasswordButton = () => {
  const record = useRecordContext<MemberRecord>();
  const navigate = useNavigate();
  if (!record) return null;

  const handleClick = (event: React.MouseEvent) => {
    // Ngăn chặn sự kiện click lan truyền lên hàng (dù đã bỏ rowClick, nhưng đây là best practice)
    event.stopPropagation(); 
    navigate(`/admin/members/${record.id}/reset-password`);
  };

  return (
    <Button
      size="small"
      color="warning"
      onClick={handleClick}
      startIcon={<VpnKeyIcon />}
      sx={{ mr: 1 }}
    >
      Reset Pass
    </Button>
  );
};

// Nút Lock / Unlock
const LockUnlockButton = () => {
  const record = useRecordContext<MemberRecord>();
  const notify = useNotify();
  const refresh = useRefresh();

  if (!record) return null;

  const handleToggle = async (event: React.MouseEvent) => {
    // Ngăn chặn sự kiện click lan truyền lên hàng
    event.stopPropagation(); 
    
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
      sx={{ mr: 1 }}
    >
      {record.isActive ? "Lock" : "Unlock"}
    </Button>
  );
};

// --- 2. FILTERS ---

const MemberFilter = (props: any) => (
  <Filter {...props}>
    <TextInput label="Email" source="email" alwaysOn />
    <TextInput label="Full Name" source="fullName" />
    {/* Dùng SelectInput cho Status thay vì TextInput để chuẩn hóa input */}
    <TextInput label="Status (0/1)" source="isActive" />
  </Filter>
);


// --- 3. MEMBER LIST ---

const MemberList = () => (
  <List
    resource="members"
    filters={<MemberFilter />}
    sort={{ field: "id", order: "DESC" }}
    perPage={10}
    title="👥 Member Management"
  >
    {/* rowClick đã được loại bỏ */}
    <Datagrid>
      <TextField source="id" label="ID" />
      <EmailField source="email" />
      <TextField source="fullName" label="Full Name" />
      <TextField source="phoneNumber" label="Phone" />
      
      {/* 🟢 KHẮC PHỤC LỖI TẠI ĐÂY: ActiveField đã được định nghĩa để nhận props source/label */}
      <ActiveField source="isActive" label="Status" /> 

      {/* Cột hành động chứa tất cả các nút */}
      {/* Box dùng để căn chỉnh và bọc các nút hành động */}
      <Box component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <ShowButton />
        <LockUnlockButton />
        <ResetPasswordButton />
      </Box>
    </Datagrid>
  </List>
);

export default MemberList;