import React, { useState } from "react";

function ForgotPasswordForm({ onSendCode, onResetPassword, onBack, error }) {
  const [forgotEmail, setForgotEmail] = useState("");
  const [showResetSection, setShowResetSection] = useState(false);
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSendCode = async () => {
    if (!forgotEmail) return alert("Please enter your email");
    await onSendCode(forgotEmail);
    setShowResetSection(true);
  };

  const handleResetPassword = async () => {
    if (!resetCode || !newPassword) return alert("Please enter all fields");
    await onResetPassword(forgotEmail, resetCode, newPassword);
    setShowResetSection(false);
    setForgotEmail("");
    setResetCode("");
    setNewPassword("");
  };

  return (
    <div className="space-y-4">
      <p className="text-gray-700 text-center">Enter your email to reset password</p>
      <input
        type="email"
        placeholder="Email"
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={forgotEmail}
        onChange={(e) => setForgotEmail(e.target.value)}
        required
      />
      <button
        type="button"
        onClick={handleSendCode}
        className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold"
      >
        Send Code
      </button>
      {showResetSection && (
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Enter code"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={resetCode}
            onChange={(e) => setResetCode(e.target.value)}
          />
          <input
            type="password"
            placeholder="New Password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={handleResetPassword}
            className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors font-semibold"
          >
            Reset Password
          </button>
        </div>
      )}
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      <p
        className="text-center text-sm text-gray-500 mt-2 cursor-pointer hover:underline"
        onClick={onBack}
      >
        Back to Login
      </p>
    </div>
  );
}

export default ForgotPasswordForm;
