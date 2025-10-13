// src/components/CustomMenu.tsx
import * as React from "react";
import { useTheme } from "@mui/material/styles";
import { MenuItemLink, DashboardMenuItem } from "react-admin";
import { List, Divider, Box, Typography } from "@mui/material"; // Loại bỏ ListSubheader
import EventIcon from "@mui/icons-material/Event";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn"; // 💡 Icon mới cho Attendance
import ProfileIcon from "@mui/icons-material/AccountCircle"; // Icon cho Profile/Account
import { useTranslate } from 'react-admin';

interface CustomMenuProps {
   role: string;
}

const CustomMenu: React.FC<CustomMenuProps> = ({ role, ...props }) => {
   const theme = useTheme();
   const translate = useTranslate();

   // Màu nền tinh tế hơn cho active state
   const activeBgColor = theme.palette.mode === 'light' 
    ? theme.palette.primary.main + '15' // Primary với opacity thấp
    : theme.palette.primary.dark + '20';

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
          // 💡 Áp dụng phong cách hiện đại, tinh tế
          "&.RaMenuItemLink-root": {
             borderRadius: 1.5,
             mb: 0.5,
             paddingY: 1,
             // Trạng thái Active
             "&.active": {
               backgroundColor: activeBgColor,
               fontWeight: "fontWeightBold",
               color: theme.palette.primary.main,
             // Đảm bảo icon cũng dùng màu primary
            "& .MuiSvgIcon-root": {
                color: theme.palette.primary.main,
            }
             },
             // Trạng thái Hover
             "&:hover": {
               backgroundColor: theme.palette.action.hover,
             },
             // Màu icon mặc định (tối hơn hoặc phụ)
           "& .MuiSvgIcon-root": {
                color: theme.palette.text.secondary, 
            }
          },
        }}
     />
   );

   return (
     <List sx={{ width: 240, paddingTop: 0, px: 1 }} component="nav"> {/* 💡 Thêm padding ngang */}
        
        {/* 💡 Header/Logo Placeholder */}
        {/* <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography 
                variant="h5" 
                sx={{ 
                    fontWeight: 'bold', 
                    color: theme.palette.primary.main, // Dùng màu primary cho tên ứng dụng
                }}
            >
                Nexpando Admin
            </Typography>
        </Box>
        <Divider sx={{ mb: 1.5 }} /> */}

        {/* 1. Dashboard */}
        <DashboardMenuItem 
            {...props} 
            sx={{ 
                "&.RaMenuItemLink-root": { mb: 1.5 }, // Tạo khoảng cách nhóm
            }}
        />

        {role === "admin" && (
          <>
             {/* 2. Nhóm Quản lý (Management) */}
             {/* 💡 Không dùng ListSubheader. Dùng Divider để phân nhóm */}
             <Divider sx={{ my: 1 }} />
             {renderMenuItem("/events", translate("custom.menu.events"), <EventIcon />)}
             {renderMenuItem("/members", translate("custom.menu.members"), <PeopleIcon />)}

             {/* 3. Nhóm Đăng ký & Điểm danh */}
             <Divider sx={{ my: 1 }} />
             {renderMenuItem("/upcoming-events", translate("custom.menu.upcoming"), <AssignmentIcon />)}
             {renderMenuItem("/member-events", translate("custom.menu.myEvents"), <EventIcon />)}

             {/* 💡 Mục Attendance làm riêng biệt */}
             <Divider sx={{ my: 1 }} />
             {renderMenuItem("/registrations", translate("custom.menu.attendance"), <AssignmentTurnedInIcon />)}

          </>
        )}

        {role === "member" && (
          <>
             {/* 2. Nhóm Đăng ký */}
             <Divider sx={{ my: 1 }} />
             {renderMenuItem("/upcoming-events", translate("custom.menu.upcoming"), <AssignmentIcon />)}
             {renderMenuItem("/member-events", translate("custom.menu.myEvents"), <EventIcon />)}

             {/* 3. Nhóm Thành viên */}
             <Divider sx={{ my: 1 }} />
             {renderMenuItem("/membersPublic", translate("custom.menu.directory"), <PeopleIcon />)}

          </>
        )}
     </List>
   );
};

export default CustomMenu;