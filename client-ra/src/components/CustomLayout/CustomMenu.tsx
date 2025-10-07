// src/components/CustomMenu.tsx
import * as React from "react";
import { useTheme } from "@mui/material/styles";
import { MenuItemLink, DashboardMenuItem } from "react-admin";
import { List, ListSubheader, Divider } from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";
import AssignmentIcon from "@mui/icons-material/Assignment";

interface CustomMenuProps {
  role: string;
}

const CustomMenu: React.FC<CustomMenuProps> = ({ role, ...props }) => {
  const theme = useTheme();

  const renderMenuItem = (
    to: string,
    primaryText: string,
    icon?: React.ReactElement
  ) => (
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

      {role === "admin" && (
        <>
          <Divider sx={{ my: 1 }} />
          <ListSubheader
            sx={{ fontWeight: "bold", color: theme.palette.text.primary }}
          >
            Management
          </ListSubheader>
          {renderMenuItem("/events", "Events", <EventIcon />)}
          {renderMenuItem("/members", "Members", <PeopleIcon />)}

          <Divider sx={{ my: 1 }} />
          <ListSubheader
            sx={{ fontWeight: "bold", color: theme.palette.text.primary }}
          >
            Registrations
          </ListSubheader>
          {renderMenuItem("/upcoming-events", "Upcoming Events", <AssignmentIcon />)}
          {renderMenuItem("/member-events", "My Events", <EventIcon />)}
          
          {/* ✅ Thêm menu Attendance cho admin */}
          {renderMenuItem("/registrations", "Attendance", <BarChartIcon />)}
        </>
      )}

      {role === "member" && (
        <>
          <Divider sx={{ my: 1 }} />
          <ListSubheader
            sx={{ fontWeight: "bold", color: theme.palette.text.primary }}
          >
            Registrations
          </ListSubheader>
          {renderMenuItem("/upcoming-events", "Upcoming Events", <AssignmentIcon />)}
          {renderMenuItem("/member-events", "My Events", <EventIcon />)}

          <Divider sx={{ my: 1 }} />
          <ListSubheader
            sx={{ fontWeight: "bold", color: theme.palette.text.primary }}
          >
            Members
          </ListSubheader>
          {renderMenuItem("/membersPublic", "Members", <PeopleIcon />)}
        </>
      )}
    </List>
  );
};

export default CustomMenu;
