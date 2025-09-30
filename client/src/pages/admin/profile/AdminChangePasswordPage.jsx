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
      setToast({ open: true, message: "❌ New password and confirm password do not match", type: "error" });
      setLoading(false);
      return;
    }

    try {
      await updateAdminPassword(current, newPass);
      setToast({ open: true, message: "✅ Password updated successfully!", type: "success" });
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 space-y-6">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
            🔒
          </div>
          <h2 className="mt-4 text-2xl font-bold text-blue-900 text-center">
            Update Admin Password
          </h2>
          <p className="text-gray-600 text-center mt-1">
            Keep your account secure
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            placeholder="Current password"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
            placeholder="New password"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Confirm new password"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-2xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
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
          <Toast.Close className="absolute top-2 right-2 text-gray-500 cursor-pointer">✕</Toast.Close>
        </Toast.Root>
        <Toast.Viewport />
      </Toast.Provider>
    </div>
  );
};

export default AdminChangePasswordPage;
