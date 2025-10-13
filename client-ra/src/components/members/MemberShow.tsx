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
import { useTranslate } from 'react-admin';

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
  const translate = useTranslate();
  const record = useRecordContext();
  if (!record) return null;
  return (
    <Chip
      label={record.isActive ? translate("resources.members.fields.active") : translate("resources.members.fields.locked")}
      color={record.isActive ? "success" : "error"}
      size="medium"
    />
  );
};

// --- HEADER COMPONENT ---
const MemberShowHeader = () => {
  const { record } = useShowController();
  const translate = useTranslate();
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
          <Labeled label={translate("resources.members.fields.role")}>
            <RoleField />
          </Labeled>
          <Labeled label={translate("resources.members.fields.status")}>
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
const MemberShow = () => {
  const translate = useTranslate();
  return (
  <Show title="member detail">
    {/* Custom Header */}
    <MemberShowHeader />

    <TabbedShowLayout>
      <Tab label={translate("resources.members.fields.info")} path="details" icon={<PersonIcon />}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Card variant="outlined" sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  {translate("resources.members.fields.personalInfo")}
                </Typography>
                <Stack spacing={1}>
                  <TextField source="fullName" label="Full name" />
                  <EmailField source="email" />
                  <TextField source="phoneNumber" label="Phone number" />
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Card variant="outlined" sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  {translate("resources.members.fields.organizationInfo")}
                </Typography>
                <Stack spacing={1}>
                  <TextField source="organization.name" label="Organization name" />
                  <TextField source="organizationId" label="Organization ID" />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Tab>

      <Tab label={translate("resources.members.fields.systemInfo")} path="system" icon={<SettingsIcon />}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Card variant="outlined" sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="secondary">
                  {translate("resources.members.fields.timestamps")}
                </Typography>
                <Stack spacing={1}>
                  <DateField
                    source="createdAt"
                    showTime
                    label="Created At"
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
                    label="Updated At"
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
                  {translate("resources.members.fields.otherInfo")}
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
};

export default MemberShow;
