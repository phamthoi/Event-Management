import React, { useState } from "react";
import { updateMemberPassword } from "../../../services/member/profile/profileService";
import { showErrorAlert } from "../../../utils/member/errorHandler";

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
    <div className="
                  flex
                  bg-gradient-to-br from-primary-500 via-white to-accent-300 
                  dark:from-secondary-400 dark:via-secondary-600 dark:to-secondary-900 
                  items-center justify-center p-6 transition-all duration-300
            ">
      {/* Container chính */}
      <div className="card p-8 rounded-3xl shadow-2xl w-full max-w-md space-y-6 transition-colors">
        {/* Header với icon */}
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg">
            🔒
          </div>
          <h1 className="mt-4 text-2xl font-bold text-gray-800 dark:text-gray-100 text-center">
            Change Password
          </h1>
        </div>

        {/* Error & Success messages */}
        {error && (
          <div className="flex items-center bg-red-100 dark:bg-red-200 border border-red-400 text-red-700 px-4 py-2 rounded-xl transition">
            {error}
          </div>
        )}
        {success && (
          <div className="flex items-center bg-green-100 dark:bg-green-200 border border-green-400 text-green-700 px-4 py-2 rounded-xl transition">
            {success}
          </div>
        )}

        {/* Form input */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Current Password */}
          <div>
            <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">Current Password</label>
            <input
              type="password"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              className="form-input w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white focus:outline-none transition"
              placeholder="Enter current password"
              required
            />
          </div>

          {/* New Password */}
          <div>
            <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">New Password</label>
            <input
              type="password"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              className="form-input w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white focus:outline-none transition"
              placeholder="Enter new password"
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">Confirm New Password</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="form-input w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white focus:outline-none transition"
              placeholder="Confirm new password"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
