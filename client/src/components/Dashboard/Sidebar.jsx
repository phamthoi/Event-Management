import { Link } from "react-router-dom";

function Sidebar() {
    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login"; // back to login page
    };

    return (
        <div className="w-64 bg-white p-4 shadow-lg flex flex-col gap-2">
      <h2 className="text-xl font-bold mb-4">Admin Dashboard</h2>

      {/* Thông tin user (sẽ lấy từ API sau) */}
      <div className="mb-4 p-2 bg-gray-100 rounded text-sm text-gray-700">
        👤 Loading...
      </div>

      {/* Event */}
      <div>
        <p className="font-semibold">Event ▾</p>
        <div className="ml-3 flex flex-col gap-1">
          <Link to="/dashboard/events/create">Create Event</Link>
          <Link to="/dashboard/events/list">Event List</Link>
          <Link to="/dashboard/events/attendance">Attendance</Link>
        </div>
      </div>

      {/* Member */}
      <div>
        <p className="font-semibold">Member ▾</p>
        <div className="ml-3 flex flex-col gap-1">
          <Link to="/dashboard/members/create">Create Member</Link>
          <Link to="/dashboard/members/list">Member List</Link>
        </div>
      </div>

      {/* Notifications */}
      <div>
        <p className="font-semibold">Notifications ▾</p>
        <div className="ml-3 flex flex-col gap-1">
          <Link to="/dashboard/notifications/send">Send Notification</Link>
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