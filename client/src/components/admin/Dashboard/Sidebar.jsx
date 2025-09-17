import { Link } from "react-router-dom";

function Sidebar() {
    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login"; // back to login page
    };

    return (
      <div className="w-64 bg-gray-800 p-4 text-white shadow-lg flex flex-col gap-2">
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>


      {/* Event */}
      <div>
        <p className="font-semibold">Event ▾</p>
        <div className="ml-3 flex flex-col gap-1">
          <Link to="/admin/events/create">Create Event</Link>
          <Link to="/admin/events/list">Event List</Link>
          <Link to="/admin/events/attendance">Attendance</Link>
        </div>
      </div>

      {/* Member */}
      <div>
        <p className="font-semibold">Member ▾</p>
        <div className="ml-3 flex flex-col gap-1">
          <Link to="/admin/members/create">Create Member</Link>
          <Link to="/admin/members/list">Member List</Link>
        </div>
      </div>

      {/* Notifications */}
      <div>
        <p className="font-semibold">Notifications ▾</p>
        <div className="ml-3 flex flex-col gap-1">
          <Link to="/admin/notifications/send">Send Notification</Link>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="mt-auto text-red-600 font-semibold"
      >
        Logout
      </button>
    </div>
    );
}

export default Sidebar;