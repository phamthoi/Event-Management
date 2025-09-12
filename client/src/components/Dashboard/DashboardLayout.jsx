import React from "react";
import { Link, Outlet } from "react-router-dom";

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-4 flex flex-col">
        <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
        <nav className="flex flex-col gap-2">
          <Link to="/dashboard" className="hover:bg-gray-700 px-3 py-2 rounded">Home</Link>
          <Link to="/dashboard/events/list" className="hover:bg-gray-700 px-3 py-2 rounded">Event List</Link>
          <Link to="/dashboard/events/create" className="hover:bg-gray-700 px-3 py-2 rounded">Create Event</Link>
          <Link to="/dashboard/members/list" className="hover:bg-gray-700 px-3 py-2 rounded">Member List</Link>
          <Link to="/dashboard/notifications/send" className="hover:bg-gray-700 px-3 py-2 rounded">Send Notification</Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-gray-100 p-6">
        {children || <Outlet />}
      </main>
    </div>
  );
};

export default DashboardLayout;
