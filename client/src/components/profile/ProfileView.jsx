import React from "react";

const ProfileView = ({ profile, onEdit }) => {
  const getRoleBadge = (role) => (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
      {role}
    </span>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Personal Information</h2>
        <button
          onClick={onEdit}
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
        >
          Edit Profile
        </button>
      </div>

      <div className="bg-white shadow rounded-lg p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {profile.fullName ? profile.fullName.charAt(0).toUpperCase() : "U"}
            </div>
            <div>
              <h3 className="text-lg font-semibold">{profile.fullName || "-"}</h3>
              <p className="text-gray-600">{profile.email}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            {getRoleBadge(profile.role)}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p><strong>Phone:</strong> {profile.phoneNumber || "-"}</p>
            <p><strong>Organization ID:</strong> {profile.organizationId || "-"}</p>
            {profile.organization && (
              <p><strong>Organization Name:</strong> {profile.organization.name}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
