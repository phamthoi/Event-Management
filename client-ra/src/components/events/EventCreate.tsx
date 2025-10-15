import * as React from "react";
import {
  Create,
  SimpleForm,
  TextInput,
  NumberInput,
  DateTimeInput,
  required,
  minValue,
  useTranslate,
} from "react-admin";
import { Grid, Typography, Divider } from "@mui/material";

// -----------------------------
// 🔹 Helpers
// -----------------------------
const formatVND = (value?: number) =>
  value == null || isNaN(value) ? "" : value.toLocaleString("vi-VN");

const parseVND = (value?: string) =>
  value ? parseInt(value.replace(/\./g, ""), 10) || undefined : undefined;

const formatUTC = (value?: string) =>
  value ? new Date(value).toISOString().slice(0, 16) : "";

const parseUTC = (value?: string) =>
  value ? new Date(value).toISOString() : undefined;

// -----------------------------
// 🔹 Validation rules
// -----------------------------
const validateRequired = required("⚠️ This field is required.");
const validatePositive = minValue(0, "⚠️ Must be greater than or equal to 0");

// -----------------------------
// 🔹 Main Component
// -----------------------------
const EventCreate: React.FC = () => {
  const translate = useTranslate();

  return (
    <Create
      title={translate("resources.events.createTitle", {
        defaultValue: "Create New Event",
      })}
      mutationMode="pessimistic"
    >
      <SimpleForm>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {/* ==============================
              1️⃣ Thông tin sự kiện
          =============================== */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {translate("resources.events.fields.basicInfo", {
                defaultValue: "Basic Information",
              })}
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextInput
              source="title"
              label={translate("resources.events.fields.title")}
              validate={validateRequired}
              fullWidth
              autoFocus
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextInput
              source="location"
              label={translate("resources.events.fields.location")}
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <TextInput
              source="description"
              label={translate("resources.events.fields.description")}
              multiline
              fullWidth
              minRows={3}
            />
          </Grid>

          {/* ==============================
              2️⃣ Thời gian tổ chức
          =============================== */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ fontWeight: 600, mt: 3 }}>
              {translate("resources.events.fields.time", {
                defaultValue: "Event Time",
              })}
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <DateTimeInput
              source="startAt"
              label={translate("resources.events.fields.startAt")}
              validate={validateRequired}
              format={formatUTC}
              parse={parseUTC}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DateTimeInput
              source="endAt"
              label={translate("resources.events.fields.endAt")}
              validate={validateRequired}
              format={formatUTC}
              parse={parseUTC}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <DateTimeInput
              source="registrationStartAt"
              label={translate("resources.events.fields.registrationStartAt")}
              format={formatUTC}
              parse={parseUTC}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DateTimeInput
              source="registrationEndAt"
              label={translate("resources.events.fields.registrationEndAt")}
              format={formatUTC}
              parse={parseUTC}
              fullWidth
            />
          </Grid>

          {/* ==============================
              3️⃣ Cài đặt & đặt cọc
          =============================== */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ fontWeight: 600, mt: 3 }}>
              {translate("resources.events.fields.setting", {
                defaultValue: "Settings & Deposit",
              })}
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <NumberInput
              source="minAttendees"
              label={translate("resources.events.fields.minAttendees")}
              validate={validatePositive}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <NumberInput
              source="maxAttendees"
              label={translate("resources.events.fields.maxAttendees")}
              validate={validatePositive}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextInput
              source="deposit"
              label={translate("resources.events.fields.deposit")}
              format={formatVND}
              parse={parseVND}
              fullWidth
            />
          </Grid>
        </Grid>
      </SimpleForm>
    </Create>
  );
};

export default EventCreate;
