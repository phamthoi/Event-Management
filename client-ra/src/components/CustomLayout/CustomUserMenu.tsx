import * as React from "react";
import { UserMenu, MenuItemLink, useLogout } from "react-admin";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
const CustomUserMenu = (props: any) => {
  const logout = useLogout();

  return (
    <UserMenu {...props}>
      {/* Link tới Profile */}
      <MenuItemLink
        to="/profile"
        primaryText="My Profile"
        leftIcon={<AccountCircleIcon />}
      />
      {/* Logout */}
      <MenuItemLink
        to="/logout"
        primaryText="Logout"
        onClick={() => logout()}
        leftIcon={<LogoutIcon />}
      />
    </UserMenu>
  );
};

export default CustomUserMenu;
