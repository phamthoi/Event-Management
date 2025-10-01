// client/src/components/member/Dashboard/DashboardLayoutMember.jsx
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Sidebar from "./SidebarMember";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { BellIcon } from "@radix-ui/react-icons";

const DashboardLayoutMember = ({ children }) => {
  const location = useLocation();
  const [user, setUser] = useState({ fullName: "", avatar: "" });
  const [stats, setStats] = useState({
    events: 0,
    registrations: 0,
    upcoming: 0,
  });

  useEffect(() => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      if (userData) {
        setUser({
          fullName: userData.fullName || "",
          avatar:
            userData.avatar ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              userData.fullName || "Guest"
            )}&background=0D8ABC&color=fff`,
        });
      }
    } catch (err) {
      console.error("Invalid user in localStorage", err);
    }

    // Optional: lấy stats từ API (bỏ comment và chỉnh endpoint nếu bạn có)
    /*
    fetch("/api/member/stats")
      .then(res => res.json())
      .then(data => {
        setStats({
          events: data.totalEvents || 0,
          registrations: data.myRegistrations || 0,
          upcoming: data.upcoming || 0,
        });
      })
      .catch(err => console.log(err));
    */
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  // Chỉ hiện Welcome khi đang ở /member (root của member dashboard)
  const isMemberHome =
    location.pathname === "/member" || location.pathname === "/member/";

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex flex-col flex-1">
        {/* Header */}
        <header className="h-16 bg-white shadow flex items-center justify-between px-6">
          <h1 className="text-xl font-bold text-gray-800">Member Dashboard</h1>

          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-full hover:bg-gray-200">
              <BellIcon className="w-6 h-6 text-gray-600" />
              <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                2
              </span>
            </button>

            <DropdownMenu.Root>
              <DropdownMenu.Trigger className="flex items-center gap-2 cursor-pointer">
                <img
                  src={
                    user.avatar ||
                    `https://ui-avatars.com/api/?name=Guest&background=0D8ABC&color=fff`
                  }
                  alt="avatar"
                  className="w-10 h-10 rounded-full border"
                />
                <span className="text-gray-600 hidden md:inline">
                  {user.fullName ? `Hello, ${user.fullName}` : "Hello, Guest"}
                </span>
              </DropdownMenu.Trigger>

              <DropdownMenu.Content className="bg-white rounded-md shadow-md py-2 w-48">
                <DropdownMenu.Item asChild>
                  <Link
                    to="/member/profile/update"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  onClick={handleLogout}
                  className="px-4 py-2 hover:bg-gray-100"
                >
                  Logout
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </div>
        </header>

        {/* Welcome chỉ hiện ở trang /member */}
        {isMemberHome && (
          <section className="p-6">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-lg shadow-md mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">
                  Welcome Back,{" "}
                  {user.fullName ? user.fullName.split(" ")[0] : "Member"}!
                </h2>
                <p className="mt-1">Check your upcoming events and registrations.</p>
              </div>
              <img
                src="https://cdn-icons-png.flaticon.com/512/4128/4128150.png"
                alt="illustration"
                className="w-20 h-20"
              />
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white shadow rounded-lg p-4">
                <h3 className="text-gray-500 text-sm">Total Events</h3>
                <p className="text-2xl font-bold">{stats.events}</p>
              </div>

              <div className="bg-white shadow rounded-lg p-4">
                <h3 className="text-gray-500 text-sm">My Registrations</h3>
                <p className="text-2xl font-bold">{stats.registrations}</p>
              </div>

              <div className="bg-white shadow rounded-lg p-4">
                <h3 className="text-gray-500 text-sm">Upcoming</h3>
                <p className="text-2xl font-bold">{stats.upcoming}</p>
              </div>
            </div>
          </section>
        )}

        {/* Main content */}
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayoutMember;
