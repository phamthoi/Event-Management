import React, { useState } from "react";
import * as Toast from "@radix-ui/react-toast";

const ChangePasswordPage = ({ 
  updatePasswordService, 
  showErrorAlert, 
  userType = "member" 
}) => {
  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, message: "", type: "success" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (newPass !== confirm) {
      const message = "❌ New password and confirm password do not match";
      if (userType === "admin") {
        setToast({ open: true, message, type: "error" });
      } else {
        setError(message);
      }
      setLoading(false);
      return;
    }

    try {
      await updatePasswordService(current, newPass);
      const successMessage = "✅ Password updated successfully!";
      
      if (userType === "admin") {
        setToast({ open: true, message: successMessage, type: "success" });
      } else {
        setSuccess(successMessage);
      }
      
      setCurrent("");
      setNewPass("");
      setConfirm("");
    } catch (err) {
      showErrorAlert(err);
      if (userType === "member") {
        setError("❌ " + (err.response?.data?.message || err.message || err.toString()));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 ${
      userType === "admin" 
        ? "bg-gradient-to-br from-blue-50 to-blue-100 py-12" 
        : "bg-gray-100"
    }`}>
      <div className={`bg-white rounded-3xl p-8 space-y-6 w-full max-w-md ${
        userType === "admin" ? "shadow-2xl" : "rounded-2xl shadow-xl"
      }`}>
        <div className="flex flex-col items-center">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center text-white font-bold ${
            userType === "admin" 
              ? "bg-blue-600 text-4xl" 
              : "bg-blue-500 text-3xl"
          }`}>
            🔒
          </div>
          <h2 className={`mt-4 text-2xl font-bold text-center ${
            userType === "admin" ? "text-blue-900" : "text-gray-800"
          }`}>
            {userType === "admin" ? "Update Admin Password" : "Change Password"}
          </h2>
          {userType === "admin" && (
            <p className="text-gray-600 text-center mt-1">
              Keep your account secure
            </p>
          )}
        </div>

        {/* Error/Success messages for Member */}
        {userType === "member" && error && (
          <div className="flex items-center bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg">
            {error}
          </div>
        )}
        {userType === "member" && success && (
          <div className="flex items-center bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-lg">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <input
              type="password"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter current password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter new password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Confirm new password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            }`}
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>

      {/* Toast for Admin only */}
      {userType === "admin" && (
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
      )}
    </div>
  );
};

export default ChangePasswordPage;