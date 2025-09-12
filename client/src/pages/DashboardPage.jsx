import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "../components/Dashboard/DashboardLayout";

import EventList from "./events/EventListPage";
import EventListPage from "./events/EventListPage";
//import CreateEvent from "./events/CreateEvent";
//import Attendance from "./events/Attendance";
//import MemberList from "./members/MemberList";
//import CreateMember from "./members/CreateMember";
//import SendNotification from "./notifications/SendNotification";

function DashboardPage() {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" />;
  }

  return (
    /*
    <DashboardLayout>
      <Routes>
        <Route index element={<p>Welcome to Admin Dashboard</p>} />
        <Route path="events/create" element={<CreateEvent />} />
        <Route path="events/list" element={<EventList />} />
        <Route path="events/attendance" element={<Attendance />} />

        <Route path="members/create" element={<CreateMember />} />
        <Route path="members/list" element={<MemberList />} />

        <Route path="notifications/send" element={<SendNotification />} />
      </Routes>
    </DashboardLayout>
    */
    <DashboardLayout>
      <Routes>
        <Route index element={<p>Welcome to Admin Dashboard</p>} />
        <Route path="events/create" element={<p>Create Event Page (Coming Soon)</p>} />
        <Route path="events/list" element={<EventListPage />} />
        <Route path="events/attendance" element={<p>Attendance Page (Coming Soon)</p>} />
        <Route path="members/create" element={<p>Create Member Page (Coming Soon)</p>} />
        <Route path="members/list" element={<p>Member List Page (Coming Soon)</p>} />
        <Route path="notifications/send" element={<p>Send Notification Page (Coming Soon)</p>} />
      </Routes>
    </DashboardLayout>
  );
}

export default DashboardPage;
