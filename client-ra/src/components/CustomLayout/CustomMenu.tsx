import * as React from "react";
import { MenuItemLink, DashboardMenuItem } from "react-admin";
import { Box } from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const CustomMenu = (props: any) => (
  <Box sx={{ width: 240 }}>
    <DashboardMenuItem {...props} />
    
    <MenuItemLink
      to="/events"
      primaryText="Events"
      leftIcon={<EventIcon />}
      {...props}
    />
    <MenuItemLink
      to="/members"
      primaryText="Members"
      leftIcon={<PeopleIcon />}
      {...props}
    />
    <MenuItemLink
      to="/registrations"
      primaryText="Registrations"
      leftIcon={<AssignmentIcon />}
      {...props}
    />

    {/* My Profile link */}
    {/* <MenuItemLink
      to="/admin/profile/show"
      primaryText="My Profile"
      leftIcon={<AccountCircleIcon />}
      {...props}
    /> */}
  </Box>
);

export default CustomMenu;
