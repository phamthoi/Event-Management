// client/src/components/member/profile/ProfileForm.jsx
import React, { useState, useEffect } from "react";

const ProfileForm = ({ profile, onCancel, onSave }) => {
  const [fullName, setFullName] = useState(profile.fullName || "");
  const [phoneNumber, setPhoneNumber] = useState(profile.phoneNumber || "");

  useEffect(() => {
    setFullName(profile.fullName || "");
    setPhoneNumber(profile.phoneNumber || "");
  }, [profile]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ fullName, phoneNumber });
  };

  return (
    <div className="max-w-md mx-auto w-full">
      <div className="bg-white shadow-lg rounded-xl p-6">
        {/* Avatar */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
            {fullName ? fullName.charAt(0).toUpperCase() : "U"}
          </div>
          <h2 className="mt-3 text-xl font-semibold text-gray-800">{fullName || "User"}</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">Phone Number</label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-between gap-2">
            <button
              type="submit"
              className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition duration-200"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500 transition duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileForm;
