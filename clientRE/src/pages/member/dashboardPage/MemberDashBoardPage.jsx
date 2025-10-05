import { Navigate, Outlet } from "react-router-dom";
import DashboardLayoutMember from "../../../components/member/dashboard/DashboardLayoutMember"; 

function MemberDashboardPage(){
  const token = localStorage.getItem("token");

   if (!token) {
    return <Navigate to="/login" />;
  }

  return (
    <DashboardLayoutMember>
      <Outlet />
    </DashboardLayoutMember>
  );
}

export default MemberDashboardPage;
