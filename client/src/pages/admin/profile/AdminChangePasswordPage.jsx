// src/pages/admin/profile/AdminChangePasswordPage.jsx
import React, { useState } from "react";
import { updateAdminPassword } from "../../../services/admin/profile/adminProfileService";
import { showErrorAlert } from "../../../utils/admin/errorHandler";
import * as Toast from "@radix-ui/react-toast";

const AdminChangePasswordPage = () => {
  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, message: "", type: "success" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (newPass !== confirm) {
      setToast({
        open: true,
        message: "❌ New password and confirm password do not match",
        type: "error",
      });
      setLoading(false);
      return;
    }

    try {
      await updateAdminPassword(current, newPass);
      setToast({
        open: true,
        message: "✅ Password updated successfully!",
        type: "success",
      });
      setCurrent("");
      setNewPass("");
      setConfirm("");
    } catch (err) {
      showErrorAlert(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="
                flex
                bg-gradient-to-br from-primary-500 via-white to-accent-300 
                dark:from-secondary-400 dark:via-secondary-600 dark:to-secondary-900 
                items-center justify-center p-6 transition-all duration-300
    ">
      <div className="w-full max-w-md card p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
            🔒
          </div>
          <h2 className="mt-4 text-2xl font-bold text-blue-900 dark:text-blue-100 text-center">
            Update Admin Password
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-center mt-1">
            Keep your account secure
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label">Current Password</label>
            <input
              type="password"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              placeholder="Enter current password"
              className="form-input"
              required
            />
          </div>
          <div>
            <label className="form-label">New Password</label>
            <input
              type="password"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              placeholder="Enter new password"
              className="form-input"
              required
            />
          </div>
          <div>
            <label className="form-label">Confirm New Password</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Re-enter new password"
              className="form-input"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>

      {/* Radix Toast */}
      <Toast.Provider swipeDirection="right">
        <Toast.Root
          open={toast.open}
          onOpenChange={(open) => setToast({ ...toast, open })}
          className={`fixed bottom-6 right-6 p-4 rounded-lg shadow-md border ${
            toast.type === "success"
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-red-50 text-red-700 border-red-200"
          }`}
        >
          <Toast.Title className="font-bold">{toast.message}</Toast.Title>
          <Toast.Close className="absolute top-2 right-2 text-gray-500 cursor-pointer">
            ✕
          </Toast.Close>
        </Toast.Root>
        <Toast.Viewport />
      </Toast.Provider>
    </div>
  );
};

export default AdminChangePasswordPage;
