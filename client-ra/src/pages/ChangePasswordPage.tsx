// src/pages/profile/ChangePasswordPage.tsx
import * as React from "react";
import { useState } from "react";
import { useNotify, useRedirect, useDataProvider, Title } from "react-admin";
import {
  Card,
  CardContent,
  CardActions,
  TextField,
  Typography,
  Box,
  Button,
  CircularProgress,
} from "@mui/material";

const ChangePasswordPage = () => {
  const notify = useNotify();
  const redirect = useRedirect();
  const dataProvider = useDataProvider();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      notify("❌ New password and confirmation do not match", { type: "warning" });
      return;
    }

    try {
      setLoading(true);
      await dataProvider.changePassword(currentPassword, newPassword);
      notify("✅ Password updated successfully!", { type: "success" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      redirect("/profile");
    } catch (err: any) {
      notify(err.response?.data?.message || err.message || "Error updating password", {
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center" mt={5}>
      <Card sx={{ width: 400, p: 2 }}>
        <Title title="Change Password" />
        <CardContent>
          <Box textAlign="center" mb={2}>
            <Typography variant="h5" fontWeight="bold">
              🔒 Change Password
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Keep your account secure
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <Box mb={2}>
              <TextField
                fullWidth
                label="Current Password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </Box>

            <Box mb={2}>
              <TextField
                fullWidth
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </Box>

            <Box mb={2}>
              <TextField
                fullWidth
                label="Confirm New Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </Box>

            <CardActions sx={{ justifyContent: "center" }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {loading ? "Changing..." : "Change Password"}
              </Button>
            </CardActions>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ChangePasswordPage;
