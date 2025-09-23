// client/src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";

// Admin Pages
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
import NotificationsPage from "./pages/admin/notifications/NotificationsPage.jsx";

// Member Pages
import MemberDashboardPage from "./pages/member/MemberDashBoardPage.jsx";  
import MemberProfilePage from "./pages/member/profileMember/MemberProfilePage.jsx";
import ChangePasswordPage from "./pages/member/profileMember/ChangePasswordPage.jsx";
import ViewMemberListPage from "./pages/member/memberList/ViewMemberListPage.jsx";
import UpcomingEventsPage from "./pages/member/event/UpcomingEventPage.jsx";
import MyEventsPage from "./pages/member/event/MyEventsPage.jsx";
import MemberNotificationsPage from "./pages/member/Notification/MemberNotificationPage.jsx";
function App() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  return (
    <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Admin Dashboard */}
        <Route
          path="/admin/*"
          element={
            token && role === "admin" ? (
              <AdminDashboardPage />
            ) : (
              <Navigate to="/login" />
            )
          }
        >
          {/* Nested routes */}
          <Route index element={<p>Welcome to Admin Dashboard</p>} />

          {/* Profile */}
          <Route path="profile" element={<AdminProfilePage />} />
          <Route path="profile/changepass" element={<AdminChangePasswordPage />} />

          {/* Event routes */}
          <Route path="events/create" element={<CreateEventPage />} />
          <Route path="events/list" element={<EventListPage />} />
          <Route path="events/attendance" element={<AttendancePage />} />
          <Route path="events/edit/:id" element={<EditEventPage />} />

          {/* Member routes */}
          <Route path="members/create" element={<CreateMemberPage />} />
          <Route path="members/list" element={<MemberListPage />} />
          <Route path="members/:id" element={<MemberDetailPage />} />
          <Route path="members/:id/reset-password" element={<ResetPasswordPage />} />

          {/* Notification */}
          <Route path="notifications" element={<NotificationsPage />} />
        </Route>

        {/* Member Dashboard */}
        <Route
          path="/member/*"
          element={
            token && role === "member" ? (
              <MemberDashboardPage />
            ) : (
              <Navigate to="/login" />
            )
          }
        >
          {/* Nested routes */}
          <Route index element={<p>Welcome to Member Dashboard</p>} />

          {/* Profile */}
          <Route path="profile/update" element={<MemberProfilePage />} />
          <Route path="profile/change-password" element={<ChangePasswordPage />} />

          {/* Member list & events */}
          <Route path="list-member" element={<ViewMemberListPage />} />
          <Route path="upcoming-event" element={<UpcomingEventsPage />} />
          <Route path="my-event" element={<MyEventsPage />} />
          
          {/* Notifications (member xem) */}
          <Route path="notifications" element={<MemberNotificationsPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
