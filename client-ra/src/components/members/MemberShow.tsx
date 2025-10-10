// src/components/members/MemberShow.tsx
import * as React from "react";
import {
  Show,
  TabbedShowLayout,
  Tab,
  TextField,
  EmailField,
  DateField,
  useRecordContext,
  Labeled,
  useShowController,
} from "react-admin";
import {
  Chip,
  Grid,
  Card,
  CardContent,
  Typography,
  Stack,
  Divider,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";

// --- CUSTOM FIELDS ---
const RoleField = () => {
  const record = useRecordContext();
  if (!record) return null;
  return (
    <Chip
      label={record.role}
      color={record.role === "ADMIN" ? "secondary" : "primary"}
      size="medium"
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
      size="medium"
    />
  );
};

// --- HEADER COMPONENT ---
const MemberShowHeader = () => {
  const { record } = useShowController();
  if (!record) return null;

  return (
    <Card sx={{ marginBottom: 2, padding: 2, bgcolor: "background.paper" }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
        divider={
          <Divider
            orientation="vertical"
            flexItem
            sx={{ display: { xs: "none", sm: "block" } }}
          />
        }
      >
        <Typography variant="h4" fontWeight="bold">
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

// --- MEMBER SHOW ---
const MemberShow = () => (
  <Show title="Chi tiết Thành viên">
    {/* Custom Header */}
    <MemberShowHeader />

    <TabbedShowLayout>
      <Tab label="Thông tin Cơ bản" path="details" icon={<PersonIcon />}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Card variant="outlined" sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  Thông tin Liên hệ
                </Typography>
                <Stack spacing={1}>
                  <TextField source="fullName" label="Họ và Tên" />
                  <EmailField source="email" />
                  <TextField source="phoneNumber" label="Điện thoại" />
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Card variant="outlined" sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  Thông tin Tổ chức
                </Typography>
                <Stack spacing={1}>
                  <TextField source="organization.name" label="Tên Tổ chức" />
                  <TextField source="organizationId" label="ID Tổ chức" />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Tab>

      <Tab label="Thông tin Hệ thống" path="system" icon={<SettingsIcon />}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Card variant="outlined" sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="secondary">
                  Dữ liệu Hệ thống (Audit)
                </Typography>
                <Stack spacing={1}>
                  <DateField
                    source="createdAt"
                    showTime
                    label="Ngày Tạo"
                    options={{
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }}
                  />
                  <DateField
                    source="updatedAt"
                    showTime
                    label="Cập nhật Lần cuối"
                    options={{
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }}
                  />
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Card variant="outlined" sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="secondary">
                  Cấu hình Khác
                </Typography>
                <Stack spacing={1}>
                  <TextField source="lastLoginIp" label="IP Đăng nhập Cuối" />
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
