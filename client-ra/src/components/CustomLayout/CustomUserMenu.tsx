import * as React from "react";
import { UserMenu, MenuItemLink, useLogout } from "react-admin";
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LockResetIcon from '@mui/icons-material/LockReset';
import LogoutIcon from "@mui/icons-material/Logout";

const CustomUserMenu = (props: any) => {
  // 1. Lấy hook useLogout
  const logout = useLogout(); 

  // 2. Hàm xử lý đăng xuất an toàn
  const handleLogout = () => {
    // Gọi hàm logout của React-Admin. 
    // Hàm này sẽ gọi authProvider.logout() và TỰ ĐỘNG chuyển hướng.
    logout(); 
  };

  return (
    <UserMenu {...props}>
      {/* Link tới Profile - Vẫn dùng MenuItemLink chuẩn */}
      <MenuItemLink
        to="/profile"
        primaryText="My Profile"
        leftIcon={<AccountCircleIcon />}
      />

      {/* Trang đổi mật khẩu */}
      <MenuItemLink
        to="/change-password"
        primaryText="Change Password"
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
        <ListItemText>{'Logout'}</ListItemText>
      </MenuItem>
    </UserMenu>
  );
};

export default CustomUserMenu;