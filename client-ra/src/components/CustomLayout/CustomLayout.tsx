// src/components/CustomLayout.tsx
import * as React from "react";
import { Layout, usePermissions } from "react-admin";
import CustomMenu from "./CustomMenu";
import CustomAppBar from "./CustomAppBar";

const CustomLayout: React.FC<any> = (props) => {
  const { permissions } = usePermissions();
  if (!permissions) return null;

  const MenuWithRole = (menuProps: any) => <CustomMenu {...menuProps} role={permissions} />;

  return <Layout {...props} menu={MenuWithRole} appBar={CustomAppBar} />;
};

export default CustomLayout;
