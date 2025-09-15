//client/src/components/member/profile/profileForm.jsx
import React, { useState, useEffect } from "react";

const ProfileForm = ({ profile, onCancel, onSave }) => {
  const [name, setName] = useState(profile.name || "");
  const [phone, setPhone] = useState(profile.phone || "");

  useEffect(() => {
    setName(profile.name || "");
    setPhone(profile.phone || "");
  }, [profile]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ name, phone });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div>
        <label className="block mb-1">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block mb-1">Phone</label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
      >
        Save Changes
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="w-full bg-gray-400 text-white py-2 rounded-lg mt-2"
      >
        Cancel
      </button>
    </form>
  );
};

export default ProfileForm;