// client/src/components/admin/Dashboard/DashboardLayout.jsx
import React from "react";
import Sidebar from "./Sidebar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main area */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <header className="h-16 bg-white shadow flex items-center justify-between px-6">
          <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Hello, Admin</span>
            <img
              src="https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff"
              alt="avatar"
              className="w-10 h-10 rounded-full border"
            />
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
