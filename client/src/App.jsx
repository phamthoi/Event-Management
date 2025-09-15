// client/src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";

// Admin
import AdminDashboardPage from "./pages/AdminDashboardPage.jsx";
import CreateEventPage from "./pages/events/CreateEventPage.jsx";
import EventListPage from "./pages/events/EventListPage.jsx";
import EditEventPage from "./pages/events/EditEventPage.jsx";
import AttendancePage from "./pages/events/AttendancePage.jsx";
import CreateMemberPage from "./pages/members/CreateMemberPage.jsx";
import MemberListPage from "./pages/members/MemberListPage.jsx";


// Member
import MemberDashboardPage from "./pages/MemberDashboardPage.jsx";  
import MemberProfilePage from "./pages/member/MemberProfilePage.jsx";
import ViewMemberListPage from "./pages/member/ViewMemberListPage.jsx";
import UpcomingEventsPage from "./pages/member/UpcomingEventPage.jsx";
import MyEventsPage from "./pages/member/MyEventsPage.jsx";
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

          {/* Event routes */}
          <Route path="events/create" element={<CreateEventPage />} />
          <Route path="events/list" element={<EventListPage />} />
          <Route path="events/attendance" element={<AttendancePage />} />
          <Route path="events/edit/:id" element = {<EditEventPage/>} />
          

          {/* Member routes */}
          <Route path="members/create" element={<CreateMemberPage />} />
          <Route path="members/list" element={<MemberListPage />} />

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
            token && role === "member" ? (
              <MemberDashboardPage />
            ) : (
              <Navigate to="/login" />
            )
          }  
        >
          {/* Nested routes */}
          <Route index element={<p>Welcome to member Dashboard</p>} />

          {/**member profile */}
          <Route path="profile/update" element={<MemberProfilePage />} />
          <Route path="list-member" element={<ViewMemberListPage/>}/>
          <Route path="upcoming-event" element={<UpcomingEventsPage/>}/>
          <Route path="my-event" element={<MyEventsPage/>}/>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
