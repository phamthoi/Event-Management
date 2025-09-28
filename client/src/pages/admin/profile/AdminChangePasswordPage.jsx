import React, { useState } from "react";
import { updateAdminPassword } from "../../../services/admin/profile/adminProfileService";
import { useNavigate } from "react-router-dom";
import { showErrorAlert } from "../../../utils/admin/errorHandler";

const AdminChangePasswordPage = () => {
  const navigate = useNavigate();
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
      await updateAdminPassword(current, newPass);
      setSuccess("✅ Password updated successfully!");
      setCurrent("");
      setNewPass("");
      setConfirm("");
    } catch (err) {
      showErrorAlert(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 px-4 py-8">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-md p-8 space-y-6">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
            🔒
          </div>
          <p className="mt-4 text-lg text-gray-700 text-center">
            Update admin password securely
          </p>
        </div>

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
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminChangePasswordPage;
