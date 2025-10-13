import * as React from "react";
import { UserMenu, MenuItemLink, useLogout } from "react-admin";
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LockResetIcon from '@mui/icons-material/LockReset';
import LogoutIcon from "@mui/icons-material/Logout";
import { useTranslate } from "react-admin";

const CustomUserMenu = (props: any) => {
  // 1. Lấy hook useLogout
  const logout = useLogout(); 
  const translate = useTranslate();

  // 2. Hàm xử lý đăng xuất an toàn
  const handleLogout = () => {
    logout().then(() => {
      // Xóa sạch token
      localStorage.removeItem("token");
      localStorage.removeItem("currentUser");
      localStorage.removeItem("role");
      localStorage.removeItem("expiryTime");

      // Chuyển hướng về trang đăng nhập sau khi đăng xuất
      window.location.href = '/login';
    });
  };

  return (
    <UserMenu {...props}>
      {/* Link tới Profile - Vẫn dùng MenuItemLink chuẩn */}
      <MenuItemLink
        to="/profile"
        primaryText={translate("custom.menu.profile")}
        leftIcon={<AccountCircleIcon />}
      />

      {/* Trang đổi mật khẩu */}
      <MenuItemLink
        to="/change-password"
        primaryText={translate("custom.menu.changePassword")}
        leftIcon={<LockResetIcon />}
      />
      
      {/* Nút Logout: Sử dụng MenuItem của MUI thay vì MenuItemLink của react-admin */}
      <MenuItem
        onClick={handleLogout}
        sx={{ 
          // Thêm một chút style để nó giống với các item khác
          color: 'text.secondary', 
          fontSize: '0.875rem',
          padding: '6px 16px'
        }}
      >
        <ListItemIcon sx={{ minWidth: '36px' }}>
          <LogoutIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>{translate("custom.menu.logout")}</ListItemText>
      </MenuItem>
    </UserMenu>
  );
};

export default CustomUserMenu;