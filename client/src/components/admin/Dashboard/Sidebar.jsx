// client/src/components/admin/Dashboard/Sidebar.jsx
import * as Accordion from "@radix-ui/react-accordion";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { name: "Profile", icon: "👤", links: [
      { name: "View & Update", path: "/admin/profile" },
      { name: "Change Password", path: "/admin/profile/changepass" }
    ]},
    { name: "Events Management", icon: "📅", links: [
      { name: "Event List", path: "/admin/events/list" },
      { name: "Attendance", path: "/admin/events/attendance" }
    ]},
    { name: "Members Management", icon: "👥", links: [
      { name: "Member List", path: "/admin/members/list" }
    ]},
    { name: "Events Registration", icon: "📝", links: [
      { name: "Upcoming Event", path: "/admin/upcoming-event" },
      { name: "My Event", path: "/admin/my-event" }
    ]},
    { name: "Notifications", icon: "🔔", links: [
      { name: "Send Notification", path: "/admin/notifications/send", badge: 3 }
    ]},
  ];

  return (
    <div className={`flex flex-col bg-gray-900 text-white shadow-lg h-screen transition-all duration-300 ${collapsed ? "w-20" : "w-64"}`}>
      {/* Logo */}
      <div className="p-6 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          🌟
          {!collapsed && <span className="text-2xl font-bold">NEXPANDO</span>}
        </div>
        <button
          className="text-gray-400 hover:text-white transition"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? "➡️" : "⬅️"}
        </button>
      </div>

      {/* Menu */}
      <Accordion.Root type="multiple" className="flex flex-col p-2 gap-1 flex-1 overflow-auto">
        {menuItems.map((item) => (
          <Accordion.Item key={item.name} value={item.name.toLowerCase()}>
            <Accordion.Header>
              <Accordion.Trigger className={`flex items-center gap-3 w-full text-left px-3 py-2 rounded transition 
                hover:bg-gray-800 ${isActive(item.links[0].path) ? "bg-gradient-to-r from-blue-500 to-blue-600" : ""}`}>
                <span className="text-xl">{item.icon}</span>
                {!collapsed && <span className="font-semibold flex-1">{item.name}</span>}
                {!collapsed && item.badge && (
                  <span className="ml-auto bg-red-500 text-xs font-bold px-2 py-0.5 rounded-full">{item.badge}</span>
                )}
              </Accordion.Trigger>
            </Accordion.Header>
            {!collapsed && (
              <Accordion.Content className="ml-10 flex flex-col gap-1 mt-1 text-sm">
                {item.links.map((link) => (
                  <Link 
                    key={link.name} 
                    to={link.path} 
                    className={`px-2 py-1 rounded hover:bg-gray-800 transition ${isActive(link.path) ? "bg-gray-700 text-blue-400" : ""}`}
                  >
                    {link.name}
                  </Link>
                ))}
              </Accordion.Content>
            )}
          </Accordion.Item>
        ))}
      </Accordion.Root>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="m-4 p-2 text-red-500 font-semibold border border-red-500 rounded hover:bg-red-500 hover:text-white transition"
      >
        {!collapsed ? "Logout" : "⏏️"}
      </button>
    </div>
  );
}

export default Sidebar;
