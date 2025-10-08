// src/components/members/MemberShow.tsx
import * as React from "react";
import {
  Show,
  TabbedShowLayout, // SỬ DỤNG TabbedShowLayout
  Tab, // Component Tab
  TextField,
  EmailField,
  DateField,
  useRecordContext,
  Labeled,
  useShowController, // Dùng để lấy title cho header
} from "react-admin";
import {
  Chip,
  Grid,
  Card,
  CardContent,
  Typography,
  Box, // Thay thế cho Grid container/item khi chỉ cần căn chỉnh/khoảng cách
  Stack, // Dùng để căn chỉnh các field dọc theo chiều dọc
  Divider, // Dùng để ngăn cách các phần
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";

// --- CUSTOM FIELDS VẪN GIỮ NGUYÊN ---
const RoleField = () => {
  const record = useRecordContext();
  if (!record) return null;

  return (
    <Chip
      label={record.role}
      color={record.role === "ADMIN" ? "secondary" : "primary"}
      size="medium" // Tăng kích thước chip
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
      size="medium" // Tăng kích thước chip
    />
  );
};

// --- HEADER COMPONENT (MỚI) ---
const MemberShowHeader = () => {
  const record = useRecordContext();
  if (!record) return null;

  return (
    <Card sx={{ marginBottom: 2, padding: 2, bgcolor: 'background.paper' }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        spacing={2}
        divider={<Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />}
      >
        <Typography variant="h4" component="div" fontWeight="bold">
          {record.fullName}
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <Labeled label="Vai trò">
            <RoleField />
          </Labeled>
          <Labeled label="Trạng thái">
            <StatusField />
          </Labeled>
        </Stack>
      </Stack>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 0.5 }}>
        ID: {record.id}
      </Typography>
    </Card>
  );
};

// --- COMPONENT MEMBER SHOW CHUYÊN NGHIỆP ---
const MemberShow = () => (
  // Dùng useShowController để custom title trên trang Show
  <Show
    title="Chi tiết Thành viên"
    // Thêm custom header vào top của Show
    component={MemberShowHeader}
  >
    {/* TabbedShowLayout tổ chức thông tin thành các Tab */}
    <TabbedShowLayout>

      {/* -------------------------------------- */}
      {/* TAB 1: THÔNG TIN CÁ NHÂN CƠ BẢN */}
      {/* -------------------------------------- */}
      <Tab label="Thông tin Cơ bản" path="details" icon={<PersonIcon />}>
        <Grid container spacing={3}>
          {/* Cột 1: Thông tin Liên hệ */}
          <Grid item xs={12} sm={6}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">Thông tin Liên hệ</Typography>
                <Stack spacing={1}>
                  <TextField source="fullName" label="Họ và Tên" />
                  <EmailField source="email" />
                  <TextField source="phoneNumber" label="Điện thoại" />
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Cột 2: Thông tin Tổ chức */}
          <Grid item xs={12} sm={6}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">Thông tin Tổ chức</Typography>
                <Stack spacing={1}>
                  {/* Sử dụng TextField cho ID và name của tổ chức */}
                  <TextField source="organization.name" label="Tên Tổ chức" />
                  <TextField source="organizationId" label="ID Tổ chức" />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Tab>

      {/* -------------------------------------- */}
      {/* TAB 2: THÔNG TIN HỆ THỐNG VÀ METADATA */}
      {/* -------------------------------------- */}
      <Tab label="Thông tin Hệ thống" path="system" icon={<SettingsIcon />}>
        <Grid container spacing={3}>
          {/* Cột 1: Audit Fields */}
          <Grid item xs={12} sm={6}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="secondary">Dữ liệu Hệ thống (Audit)</Typography>
                <Stack spacing={1}>
                  <DateField
                    source="createdAt"
                    showTime
                    label="Ngày Tạo"
                    options={{ year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" }}
                  />
                  <DateField
                    source="updatedAt"
                    showTime
                    label="Cập nhật Lần cuối"
                    options={{ year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" }}
                  />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Cột 2: Dữ liệu Khác (Có thể mở rộng thêm) */}
          <Grid item xs={12} sm={6}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="secondary">Cấu hình Khác</Typography>
                <Stack spacing={1}>
                  <TextField source="lastLoginIp" label="IP Đăng nhập Cuối" />
                  {/* Thêm các field metadata khác nếu có */}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Tab>
    </TabbedShowLayout>
  </Show>
);

export default MemberShow;