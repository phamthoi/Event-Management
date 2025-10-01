import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { BellIcon } from "@radix-ui/react-icons";
import { Link, useLocation } from "react-router-dom";
import { getAdminProfile } from "../../../services/admin/profile/adminProfileService";

const DashboardLayout = ({ children }) => {
  const location = useLocation();
  const [admin, setAdmin] = useState({ fullName: "", avatarUrl: "" });

  useEffect(() => {
    const loadAdminProfile = async () => {
      try {
        
        const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
        console.log("+Current user from localStorage:", currentUser); // Debug log

        if (currentUser.fullName && currentUser.role === "ADMIN") {
          setAdmin({
            fullName: currentUser.fullName || "",
            avatarUrl: currentUser.avatarUrl ? `/images/${currentUser.avatarUrl}` : "",
          });
        } else {
          
          const response = await getAdminProfile();
          
          if (response) {
            const profileData = response;
            setAdmin({
              fullName: profileData.fullName || "",
              avatarUrl: profileData.avatarUrl ? `/images/${profileData.avatarUrl}` : "",
            });
          
            const updatedUser = { ...currentUser, ...profileData };
            localStorage.setItem("currentUser", JSON.stringify(updatedUser));
          }
        }
      } catch (err) {
        console.error("Error loading admin profile:", err);
        
        setAdmin({
          fullName: "Admin",
          avatarUrl: "",
        });
      }
    };

    loadAdminProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    window.location.href = "/login";
  };

  // Kiểm tra nếu đang ở trang /admin thì mới show Welcome
  const isDashboardHome = location.pathname === "/admin";

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main area */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <header className="h-16 bg-white shadow flex items-center justify-between px-6">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            {/* Notification */}
            <button className="relative p-2 rounded-full hover:bg-yellow-100 bg-yellow-400">
              <BellIcon className="w-6 h-6 text-black" />
              <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                3
              </span>
            </button>

            {/* Profile dropdown */}
            <DropdownMenu.Root>
                <DropdownMenu.Trigger className="flex items-center gap-2 cursor-pointer bg-yellow-400 hover:bg-yellow-500 px-3 py-2 rounded-lg transition">
                {admin.avatarUrl ? (
                  <img
                    src={admin.avatarUrl}
                    alt="avatar"
                    className="w-10 h-10 rounded-full border object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full border bg-blue-500 flex items-center justify-center text-white font-bold">
                    {admin.fullName ? admin.fullName.charAt(0).toUpperCase() : "A"}
                  </div>
                )}
                <span className="text-gray-600 hidden md:inline">
                  Hello, {admin.fullName || "Admin"}
                </span>
              </DropdownMenu.Trigger>

              <DropdownMenu.Content className="bg-white rounded-md shadow-md py-2 w-48">
                <DropdownMenu.Item asChild>
                  <Link to="/admin/profile" className="block px-4 py-2 hover:bg-gray-100">
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

        {/* Welcome section chỉ hiện khi ở trang /admin */}
        {isDashboardHome && (
          <section className="p-6">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-lg shadow-md mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">
                  Welcome Back, {admin.fullName ? admin.fullName.split(" ")[0] : "Admin"}!
                </h2>
                <p className="mt-1">Here's a summary of your dashboard.</p>
              </div>
              <img
                src="https://cdn-icons-png.flaticon.com/512/2922/2922510.png"
                alt="illustration"
                className="w-20 h-20"
              />
            </div>
          </section>
        )}

        {/* Main content */}
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
