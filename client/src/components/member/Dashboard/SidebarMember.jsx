import { Link } from "react-router-dom";

function Sidebar(){
    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href="/login"; // back to login
    };

    return (
      <div className="w-64 bg-gray-800 p-4 text-white shadow-lg flex flex-col gap-2">
      <h2 className="text-2xl font-bold mb-6">Member Dashboard</h2>

      {/* Thông tin user (sẽ lấy từ API sau) */}
      <div className="mb-4 p-2 bg-gray-100 rounded text-sm text-gray-700">
        👤 Loading...
      </div>

      {/* Profile */}
      <div>
        <p className="font-semibold">Profile ▾</p>
        <div className="ml-3 flex flex-col gap-1">
          <Link to="/member/profile/update">Update Infomation</Link>
          <Link to="/member/profile/change-password">Change Password</Link>
        </div>
      </div>

      {/* Member */}
      <div>
        <p className="font-semibold">Member ▾</p>
        <div className="ml-3 flex flex-col gap-1">
          <Link to="/member/list-member">View Member</Link>
        </div>
      </div>

      {/**Event */}
      <div>
        <p className="font-semibold">Event ▾</p>
        <div className="ml-3 flex flex-col gap-1">
          <Link to="/member/upcoming-event">Upcoming Event</Link>
          <Link to="/member/my-event">My Event</Link>
        </div>
      </div>

      {/* Notifications */}
      <div>
        <p className="font-semibold">Notifications ▾</p>
        <div className="ml-3 flex flex-col gap-1">
          <Link to="/member/notifications">Get Notification</Link>
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