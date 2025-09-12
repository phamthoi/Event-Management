import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import AdminDashboardPage from "./pages/AdminDashboardPage.jsx";
import CreateEventPage from "./pages/events/CreateEventPage.jsx";
import EventListPage from "./pages/events/EventListPage.jsx";
import CreateMemberPage from "./pages/members/CreateMemberPage.jsx";  
import MemberListPage from "./pages/members/MemberListPage.jsx";
import AttendancePage from "./pages/events/AttendancePage.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="admin/dashboard/*" element={<AdminDashboardPage />} />

      </Routes>
    </BrowserRouter>
  );
}
export default App;