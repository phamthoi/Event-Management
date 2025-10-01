// client/src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";

// Admin
import AdminDashboardPage from "./pages/admin/AdminDashboardPage.jsx";
import AdminProfilePage from "./pages/admin/profile/AdminProfilePage.jsx";
import AdminChangePasswordPage from "./pages/admin/profile/AdminChangePasswordPage.jsx";
import CreateEventPage from "./pages/admin/events/CreateEventPage.jsx";
import EventListPage from "./pages/admin/events/EventListPage.jsx";
import EditEventPage from "./pages/admin/events/EditEventPage.jsx";
import AttendancePage from "./pages/admin/events/AttendancePage.jsx";
import CreateMemberPage from "./pages/admin/members/CreateMemberPage.jsx";
import MemberListPage from "./pages/admin/members/MemberListPage.jsx";
import MemberDetailPage from "./components/admin/MemberList/MemberDetailPage.jsx";
import ResetPasswordPage from "./pages/admin/members/ResetPasswordPage.jsx";


// Member
import MemberDashboardPage from "./pages/member/MemberDashBoardPage.jsx";  
import MemberProfilePage from "./pages/member/profileMember/MemberProfilePage.jsx";
import ChangePasswordPage from "./pages/member/profileMember/ChangePasswordPage.jsx";
import ViewMemberListPage from "./pages/member/memberList/ViewMemberListPage.jsx";
//import UpcomingEventsPage from "./pages/member/event/UpcomingEventPage.jsx";
//import MyEventsPage from "./pages/member/event/MyEventsPage.jsx";
import UpcomingEventsPage from "./pages/common/UpcommingEventsPage.jsx";
import MyEventsPage from "./pages/common/MyEventsPage.jsx";

function App() {
  // 🔹 Gộp ProtectedRoute ngay trong App
  const ProtectedRoute = ({ element, allowedRoles }) => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
      return <Navigate to="/login" />;
    }

    if (!allowedRoles.includes(role)) {
      return <Navigate to="/login" />;
    }

    return element;
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Admin Dashboard */}
        <Route
          path="/admin/*"
          element={
            // ===== TẮT REDIRECT ĐỂ TEST LỖI 401 =====
            // token && role === "admin" ? (
             <ProtectedRoute
              element={<AdminDashboardPage />}
              allowedRoles={["admin"]}
            />
          }
        >
          {/*profile*/}
          <Route path="profile" element={<AdminProfilePage/>}/>
          <Route path="profile/changepass" element={<AdminChangePasswordPage/>}/>

          {/* Event routes */}
          <Route path="events/create" element={<CreateEventPage />} />
          <Route path="events/list" element={<EventListPage />} />
          <Route path="events/attendance" element={<AttendancePage />} />
          <Route path="events/edit/:id" element = {<EditEventPage/>} />
          

          {/* Member routes */}
          <Route path="members/create" element={<CreateMemberPage />} />
          <Route path="members/list" element={<MemberListPage />} />
          <Route path="members/:id" element={<MemberDetailPage />} />
          <Route path="members/:id/reset-password" element={<ResetPasswordPage />} />
          
           {/* 🔹 Admin cũng dùng được UpcomingEvents & MyEvents */}
          <Route path="upcoming-event" element={<UpcomingEventsPage />} />
          <Route path="my-event" element={<MyEventsPage />} />

          {/* Notification */}
          <Route
            path="notifications/send"
            element={<p>Send Notification Page (Coming Soon)</p>}
          />
        </Route>

        {/*member dashboard*/}
        <Route
          path="/member/*"
          element={
            // ===== TẮT REDIRECT ĐỂ TEST LỖI 401 =====
            <ProtectedRoute
              element={<MemberDashboardPage />}
              allowedRoles={["member"]}
            />
          }  
        >

          {/**member profile */}
          <Route path="profile/update" element={<MemberProfilePage />} />
          <Route path="list-member" element={<ViewMemberListPage/>}/>
          <Route path="upcoming-event" element={<UpcomingEventsPage/>}/>
          <Route path="my-event" element={<MyEventsPage/>}/>
          <Route path="profile/change-password" element={<ChangePasswordPage/>}/>
          
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
