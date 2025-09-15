// client/src/pages/member/MemberDashboard.jsx
import { Navigate, Outlet } from "react-router-dom";
import DashboardLayoutMember from "../../components/member/Dashboard/DashboardLayoutMember"; 

function MemberDashboardPage(){
  const token = localStorage.getItem("token");

   if (!token) {
    return <Navigate to="/login" />;
  }

  return (
    <DashboardLayoutMember>
      {/* Render các route con */}
      <Outlet />
    </DashboardLayoutMember>
  );
}

export default MemberDashboardPage;
