// src/components/CustomAppBar.tsx
import * as React from "react";
import { AppBar, usePermissions } from "react-admin";
import { Box, Typography } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CustomUserMenu from "./CustomUserMenu";

const CustomAppBar: React.FC<any> = (props) => {
  const { permissions } = usePermissions(); // "admin" hoặc "member"
  const title =
    permissions === "admin" ? "Admin Dashboard" : "Member Dashboard";

  return (
    <AppBar {...props} userMenu={<CustomUserMenu />}>
      <Box sx={{ flex: 1 }}>
        <Typography variant="h6" component="div">
          {title}
        </Typography>
      </Box>
      <NotificationsIcon />
    </AppBar>
  );
};

export default CustomAppBar;
