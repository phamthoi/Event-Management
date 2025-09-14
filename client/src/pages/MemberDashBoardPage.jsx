// client/src/pages/member/MemberDashboard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const MemberDashboardPage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Member Dashboard</h1>
      <p className="mb-6">Chào mừng bạn đến trang thành viên 🎉</p>
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
};

export default MemberDashboardPage;
