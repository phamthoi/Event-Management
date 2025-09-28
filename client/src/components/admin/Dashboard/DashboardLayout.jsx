import React from "react";
import { Link, Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const DashboardLayout = ({ children }) => {
  
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 bg-gray-100 p-6">
        {children || <Outlet />}
      </main>
    </div>
  );

};

export default DashboardLayout;
