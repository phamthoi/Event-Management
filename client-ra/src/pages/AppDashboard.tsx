// src/pages/AppDashboard.tsx
import * as React from "react";
import { usePermissions } from "react-admin";
import AdminDashboard from "./AdminDashboard";
import MemberStatsDashboard from "./MemberStatsDashboard";

const AppDashboard: React.FC = () => {
  const { permissions } = usePermissions();

  if (!permissions) return null; // chờ load permissions

  return permissions === "admin" ? <AdminDashboard /> : <MemberStatsDashboard />;
};

export default AppDashboard;
