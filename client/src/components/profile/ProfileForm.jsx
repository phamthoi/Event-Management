import React, { useState, useEffect } from "react";
import { CheckIcon, Cross2Icon, CameraIcon } from "@radix-ui/react-icons";

const ProfileForm = ({ profile, onCancel, onSave }) => {
  const [fullName, setFullName] = useState(profile.fullName || "");
  const [phoneNumber, setPhoneNumber] = useState(profile.phoneNumber || "");
  const [avatar, setAvatar] = useState(profile.avatar || null);
  const [preview, setPreview] = useState(profile.avatar || null);

  useEffect(() => {
    setFullName(profile.fullName || "");
    setPhoneNumber(profile.phoneNumber || "");
    setAvatar(profile.avatar || null);
    setPreview(profile.avatar || null);
  }, [profile]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ fullName, phoneNumber, avatar });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-md mx-auto w-full">
      <div className="bg-white shadow-lg rounded-2xl p-6 transition hover:shadow-xl">
        {/* Avatar */}
        <div className="flex flex-col items-center mb-6 relative">
          <div className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-r from-blue-400 to-purple-500 shadow-lg">
            {preview ? (
              <img src={preview} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-white text-4xl font-bold">
                {fullName ? fullName.charAt(0).toUpperCase() : "U"}
              </span>
            )}
          </div>
          {/* Upload button */}
          <label className="absolute bottom-0 right-0 bg-gray-800 text-white rounded-full p-1 cursor-pointer hover:bg-gray-700 transition">
            <CameraIcon className="w-5 h-5" />
            <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </label>
          <h2 className="mt-3 text-xl font-semibold text-gray-800">{fullName || "User"}</h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">Phone Number</label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between gap-3 mt-4">
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 shadow-md transition"
            >
              <CheckIcon className="w-4 h-4" />
              Save
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 flex items-center justify-center gap-2 bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500 shadow-md transition"
            >
              <Cross2Icon className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileForm;
