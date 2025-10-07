import * as React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TextInput, SimpleForm, SaveButton, Toolbar } from "react-admin";
import { Box, Typography } from "@mui/material";
import api from "../../services/axios"; // axios wrapper

// Custom toolbar: chỉ có SaveButton (không còn DeleteButton)
const ResetToolbar = () => (
  <Toolbar>
    <SaveButton label="Reset" />
  </Toolbar>
);

const ResetPassword = () => {
  const { id } = useParams(); // lấy memberId từ URL
  const navigate = useNavigate();

  const handleSubmit = async (values: any) => {
    try {
      await api.put(`/admin/members/${id}/reset-password`, {
        newPassword: values.password,
      });
      alert("Password reset successful!");
      navigate("/members");
    } catch (error) {
      console.error(error);
      alert("Error resetting password!");
    }
  };

  return (
    <Box m={2}>
      <Typography variant="h5" gutterBottom>
        Reset Password for Member #{id}
      </Typography>
      <SimpleForm onSubmit={handleSubmit} toolbar={<ResetToolbar />}>
        <TextInput
          source="password"
          type="password"
          label="New Password"
          fullWidth
        />
      </SimpleForm>
    </Box>
  );
};

export default ResetPassword;
