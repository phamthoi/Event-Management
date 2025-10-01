import React from "react";
import { Pencil1Icon } from "@radix-ui/react-icons";

const ProfileView = ({ profile, onEdit }) => {
  const getRoleBadge = (role) => {
    const colors = {
      admin: "from-red-400 to-red-600",
      member: "from-blue-400 to-blue-600",
      moderator: "from-green-400 to-green-600",
    };

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${
          colors[role?.toLowerCase()] || "from-gray-400 to-gray-600"
        }`}
      >
        {role || "-"}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Personal Information</h2>
        <button
          onClick={onEdit}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow"
        >
          <Pencil1Icon className="w-4 h-4" />
          Edit Profile
        </button>
      </div>

      {/* Card */}
      <div className="bg-white shadow-lg rounded-2xl p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Avatar & Name */}
        <div className="flex flex-col items-center md:items-start space-y-3">
          <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold text-white 
                          bg-gradient-to-r from-blue-400 to-purple-500 shadow-lg 
                          transform transition-transform hover:scale-110">
            {profile.fullName ? profile.fullName.charAt(0).toUpperCase() : "U"}
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-xl font-semibold text-gray-800">{profile.fullName || "-"}</h3>
            <p className="text-gray-500">{profile.email || "-"}</p>
          </div>
          {getRoleBadge(profile.role)}
        </div>

        {/* Contact & Organization Info */}
        <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-xl p-4 shadow-inner hover:shadow-md transition transform hover:-translate-y-1">
            <p className="text-gray-500 text-sm">Phone</p>
            <p className="font-medium text-gray-800">{profile.phoneNumber || "-"}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 shadow-inner hover:shadow-md transition transform hover:-translate-y-1">
            <p className="text-gray-500 text-sm">Organization ID</p>
            <p className="font-medium text-gray-800">{profile.organizationId || "-"}</p>
          </div>
          {profile.organization && (
            <div className="bg-gray-50 rounded-xl p-4 shadow-inner hover:shadow-md transition transform hover:-translate-y-1 md:col-span-2">
              <p className="text-gray-500 text-sm">Organization Name</p>
              <p className="font-medium text-gray-800">{profile.organization.name}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
