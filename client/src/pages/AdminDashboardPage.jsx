// client/src/pages/AdminDashboardPage.jsx
import { Navigate, Outlet } from "react-router-dom";
import DashboardLayout from "../components/Dashboard/DashboardLayout";

function AdminDashboardPage() {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  return (
    <DashboardLayout>
      {/* Render các route con */}
      <Outlet />
    </DashboardLayout>
  );
}

export default AdminDashboardPage;
