import React, { useState } from "react";
import { updateMemberPassword } from "../../../services/member/profile/profileService";
import { showErrorAlert } from "../../../utils/member/errorHandler";

//===========Fake API=========== 
// const updateMemberPassword = async (currentPassword, newPassword) => {
//   // Fake delay như call API
//   await new Promise((resolve) => setTimeout(resolve, 500));
//   
//   // Fake validation - giả sử mật khẩu hiện tại là "123456"
//   if (currentPassword !== "123456") {
//     throw new Error("Mật khẩu hiện tại không đúng");
//   }
//   
//   return { message: "Đổi mật khẩu thành công" };
// };
//==========end fake API==========

const ChangePasswordPage = () => {
  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPass !== confirm) {
      setError("❌ New password and confirm password do not match");
      return;
    }

    try {
      await updateMemberPassword(current, newPass);
      setSuccess("✅ Password updated successfully!");
      setCurrent("");
      setNewPass("");
      setConfirm("");
    } catch (err) {
      showErrorAlert(err);
      setError("❌ " + (err.response?.data?.message || err.message || err.toString()));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md space-y-6">
        {/* Header */}
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
            🔒
          </div>
          <h1 className="mt-4 text-2xl font-bold text-gray-800 text-center">Change Password</h1>
        </div>

        {/* Feedback Messages */}
        {error && (
          <div className="flex items-center bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="flex items-center bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-lg">
            {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-gray-700">Current Password</label>
            <input
              type="password"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter current password"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">New Password</label>
            <input
              type="password"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter new password"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">Confirm New Password</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Confirm new password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition duration-200"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
