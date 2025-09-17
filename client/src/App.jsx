// client/src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import LoginPage from "./pages/LoginPage.jsx";

// Admin
import AdminDashboardPage from "./pages/admin/AdminDashboardPage.jsx";
import CreateEventPage from "./pages/admin/events/CreateEventPage.jsx";
import EventListPage from "./pages/admin/events/EventListPage.jsx";
import EditEventPage from "./pages/admin/events/EditEventPage.jsx";
import AttendancePage from "./pages/admin/events/AttendancePage.jsx";
import CreateMemberPage from "./pages/admin/members/CreateMemberPage.jsx";
import MemberListPage from "./pages/admin/members/MemberListPage.jsx";

// Member
import MemberDashboardPage from "./pages/member/MemberDashBoardPage.jsx";  
import MemberProfilePage from "./pages/member/profileMember/MemberProfilePage.jsx";
import ChangePasswordPage from "./pages/member/profileMember/ChangePasswordPage.jsx";
import ViewMemberListPage from "./pages/member/memberList/ViewMemberListPage.jsx";
import UpcomingEventsPage from "./pages/member/event/UpcomingEventPage.jsx";
import MyEventsPage from "./pages/member/event/MyEventsPage.jsx";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));

  // đồng bộ nếu localStorage thay đổi
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
      setRole(localStorage.getItem("role"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route path="/login" element={<LoginPage setToken={setToken} setRole={setRole} />} />

        {/* Admin Dashboard */}
        <Route
          path="/admin/*"
          element={
            token && role === "ADMIN" ? (
              <AdminDashboardPage />
            ) : (
              <Navigate to="/login" />
            )
          }
        >
          <Route index element={<p>Welcome to Admin Dashboard</p>} />
          <Route path="events/create" element={<CreateEventPage />} />
          <Route path="events/list" element={<EventListPage />} />
          <Route path="events/attendance" element={<AttendancePage />} />
          <Route path="events/detail/:id" element={<EditEventPage />} />
          <Route path="members/create" element={<CreateMemberPage />} />
          <Route path="members/list" element={<MemberListPage />} />
          <Route path="notifications/send" element={<p>Send Notification Page (Coming Soon)</p>} />
        </Route>

        {/* Member Dashboard */}
        <Route
          path="/member/*"
          element={
            token && role === "MEMBER" ? (
              <MemberDashboardPage />
            ) : (
              <Navigate to="/login" />
            )
          }
        >
          <Route index element={<p>Welcome to Member Dashboard</p>} />
          <Route path="profile/update" element={<MemberProfilePage />} />
          <Route path="profile/change-password" element={<ChangePasswordPage />} />
          <Route path="list-member" element={<ViewMemberListPage />} />
          <Route path="upcoming-event" element={<UpcomingEventsPage />} />
          <Route path="my-event" element={<MyEventsPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
