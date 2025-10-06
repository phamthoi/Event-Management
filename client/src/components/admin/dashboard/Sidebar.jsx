// src/components/admin/Dashboard/Sidebar.jsx
import * as Accordion from "@radix-ui/react-accordion";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  FiUser,
  FiUsers,
  FiCalendar,
  FiClipboard,
  FiBell,
  FiLogOut,
  FiChevronDown,
  FiChevronRight,
  FiMenu,
  FiX,
} from "react-icons/fi";

const menuItems = [
  // {
  //   name: "Profile",
  //   icon: FiUser,
  //   links: [
  //     { name: "View & Update", path: "/admin/profile" },
  //     { name: "Change Password", path: "/admin/profile/change-password" },
  //   ],
  // },
  {
    name: "Events Management",
    icon: FiCalendar,
    links: [
      { name: "Event List", path: "/admin/events/list" },
      { name: "Attendance", path: "/admin/events/attendance" },
    ],
  },
  {
    name: "Members Management",
    icon: FiUsers,
    links: [{ name: "Member List", path: "/admin/members/list" }],
  },
  {
    name: "Events Registration",
    icon: FiClipboard,
    links: [
      { name: "Upcoming Event", path: "/admin/upcoming-event" },
      { name: "My Event", path: "/admin/my-event" },
    ],
  },
  {
    name: "Notifications",
    icon: FiBell,
    links: [
      {
        name: "Send Notification",
        path: "/admin/notifications/send",
        badge: 3,
      },
    ],
  },
];

function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [openItems, setOpenItems] = useState([]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    window.location.href = "/login";
  };

  const isActive = (path) => location.pathname === path;

  const toggleItem = (itemName) => {
    setOpenItems((prev) =>
      prev.includes(itemName)
        ? prev.filter((name) => name !== itemName)
        : [...prev, itemName]
    );
  };

  return (
    <div
      className={`flex flex-col h-screen transition-all duration-300 ${
        collapsed ? "w-20" : "w-72"
      } bg-gray-200 dark:bg-secondary-800 border-r border-secondary-200 dark:border-secondary-700 shadow-large`}
    >
      <div className="flex items-center justify-between p-6 border-b border-secondary-100 dark:border-secondary-700">
        <Link
          to="/admin"
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
            <FiCalendar className="w-6 h-6 text-black dark:text-white " />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-xl font-display font-bold text-secondary-900 dark:text-secondary-100">
                NEXPANDO
              </h1>
              <p className="text-xs text-secondary-7600 dark:text-secondary-200">
                Event Management
              </p>
            </div>
          )}
        </Link>
        <button
          className="p-2 text-secondary-400 dark:text-secondary-500 hover:text-secondary-600 dark:hover:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded-lg transition-all duration-200"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <FiMenu className="w-5 h-5" />
          ) : (
            <FiX className="w-5 h-5" />
          )}
        </button>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isOpen = openItems.includes(item.name);
          const hasActiveChild = item.links.some((link) => isActive(link.path));

          return (
            <div key={item.name} className="space-y-1">
              <button
                onClick={() => toggleItem(item.name)}
                className={`w-full flex items-center gap-3 px-4 py-3 transition-all duration-200 group 
                  focus:outline-none focus:ring-0
                  ${
                    hasActiveChild
                      ? "bg-primary-50 dark:bg-primary-900/10 text-primary-700 dark:text-primary-400"
                      : "text-secondary-600 dark:text-secondary-400 dark:hover:text-secondary-100"
                  }`}
              >
                <Icon
                  className={`w-5 h-5 ${
                    hasActiveChild
                      ? "text-primary-600 dark:text-primary-400"
                      : "text-secondary-400 dark:text-secondary-500 group-hover:text-secondary-600 dark:group-hover:text-secondary-300"
                  }`}
                />
                {!collapsed && (
                  <>
                    <span className="flex-1 text-left font-medium">
                      {item.name}
                    </span>
                    {item.links[0].badge && (
                      <span className="bg-danger-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                        {item.links[0].badge}
                      </span>
                    )}
                    {isOpen ? (
                      <FiChevronDown className="w-4 h-4 text-secondary-400 dark:text-secondary-500" />
                    ) : (
                      <FiChevronRight className="w-4 h-4 text-secondary-400 dark:text-secondary-500" />
                    )}
                  </>
                )}
              </button>

              {!collapsed && isOpen && (
                <div className="ml-8 space-y-1 animate-fade-in">
                  {item.links.map((link) => (
                    <Link
                      key={link.name}
                      to={link.path}
                      className={`block px-4 py-2 text-sm transition-all duration-200 ${
                        isActive(link.path)
                          ? "bg-primary-50 dark:bg-primary-900/10 text-primary-700 dark:text-primary-400 font-medium border-l-2 border-primary-600 dark:border-primary-400"
                          : "text-secondary-500 dark:text-secondary-400 hover:text-secondary-700 dark:hover:text-secondary-200"
                      }`}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-4 border-t border-secondary-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-danger-600 hover:text-danger-700 hover:bg-danger-50 rounded-xl transition-all duration-200 group"
        >
          <FiLogOut className="w-5 h-5" />
          {!collapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
