// src/components/AdminMenu.tsx
import * as React from "react";
import { useTheme } from "@mui/material/styles";
import { MenuItemLink, DashboardMenuItem } from "react-admin";
import { List, ListSubheader, Divider } from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";

const AdminMenu: React.FC<any> = (props) => {
  const theme = useTheme();

  const renderMenuItem = (to: string, primaryText: string, icon: React.ReactNode) => (
    <MenuItemLink
      to={to}
      primaryText={primaryText}
      leftIcon={icon}
      {...props}
      sx={{
        "&.RaMenuItemLink-root": {
          borderRadius: 1,
          mb: 0.5,
          "&.active": {
            backgroundColor: theme.palette.action.selected,
            fontWeight: "bold",
            color: theme.palette.primary.main,
          },
          "&:hover": {
            backgroundColor: theme.palette.action.hover,
          },
        },
      }}
    />
  );

  return (
    <List sx={{ width: 240, paddingTop: 0 }} component="nav">
      <DashboardMenuItem {...props} />

      <Divider sx={{ my: 1 }} />
      <ListSubheader sx={{ fontWeight: "bold", color: theme.palette.text.primary }}>
        Management
      </ListSubheader>
      {renderMenuItem("/events", "Events", <EventIcon />)}
      {renderMenuItem("/members", "Members", <PeopleIcon />)}

      <Divider sx={{ my: 1 }} />
      <ListSubheader sx={{ fontWeight: "bold", color: theme.palette.text.primary }}>
        Stats
      </ListSubheader>
      {renderMenuItem("/member-stats", "My Dashboard", <BarChartIcon />)}
    </List>
  );
};

export default AdminMenu;
