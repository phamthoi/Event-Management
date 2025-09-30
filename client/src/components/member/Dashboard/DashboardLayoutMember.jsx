import { Outlet } from "react-router-dom";
import Sidebar from "./SidebarMember";
import { useEffect, useState } from "react";

const DashboardLayoutMember = ({ children }) => {
  const [user, setUser] = useState({ fullName: "", avatar: "" });

  useEffect(() => {
    // Giả sử bạn lưu user info vào localStorage khi login
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      setUser({
        fullName: userData.fullName,
        avatar: userData.avatar || `https://ui-avatars.com/api/?name=${userData.fullName}&background=0D8ABC&color=fff`
      });
    }
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main area */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <header className="h-16 bg-white shadow flex items-center justify-between px-6">
          <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">{user.fullName || "Guest"}</span>
            <img
              src={user.avatar || "https://ui-avatars.com/api/?name=Guest&background=0D8ABC&color=fff"}
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

export default DashboardLayoutMember;
