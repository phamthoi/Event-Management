import * as React from "react";
import { AppBar } from "react-admin";
import { Box, Typography } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CustomUserMenu from "./CustomUserMenu";

const CustomAppBar = (props: any) => {
  return (
    <AppBar {...props} userMenu={<CustomUserMenu />}>
      <Box sx={{ flex: 1 }}>
        <Typography variant="h6" component="div">
          Admin Dashboard
        </Typography>
      </Box>

      {/* Notifications */}
      <NotificationsIcon />
    </AppBar>
  );
};

export default CustomAppBar;
