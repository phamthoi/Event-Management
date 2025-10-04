import * as React from "react";
import { UserMenu, MenuItemLink, useLogout } from "react-admin";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

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
        to="#"
        primaryText="Logout"
        onClick={logout}
      />
    </UserMenu>
  );
};

export default CustomUserMenu;
