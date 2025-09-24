import React, { useState, useEffect } from "react";

function ForgotPasswordForm({ onSendCode, onVerifyCode, onResetPassword, onBack, error }) {
  // ===== State =====
  const [forgotEmail, setForgotEmail] = useState(""); // email user nhập
  const [resetCode, setResetCode] = useState("");     // code user nhập
  const [newPassword, setNewPassword] = useState(""); // mật khẩu mới
  const [step, setStep] = useState(1);               // 1: email, 2: code, 3: new password
  const [codeSent, setCodeSent] = useState(false);   // đánh dấu code đã gửi
  const [resendLoading, setResendLoading] = useState(false);

  // ===== useEffect kiểm tra localStorage xem đã gửi code chưa =====
  useEffect(() => {
    const savedEmail = localStorage.getItem("forgotEmail");
    if (savedEmail) {
      setForgotEmail(savedEmail);
      setStep(2);     // tự động chuyển sang bước nhập code
      setCodeSent(true);
    }
  }, []);

  // ===== Step 1: gửi code =====
  const handleSendCode = async () => {
    if (!forgotEmail) return alert("Please enter your email");

    const ok = await onSendCode(forgotEmail);
    if (ok) {
      alert("A verification code has been sent to your email!");
      localStorage.setItem("forgotEmail", forgotEmail); // lưu email
      setStep(2);
      setCodeSent(true);
    }
  };

  // ===== Step 2: xác minh code =====
  const handleVerifyCode = async () => {
    if (!resetCode) return alert("Please enter the code");

    const ok = await onVerifyCode(forgotEmail, resetCode);
    if (ok) {
      setStep(3); // chuyển sang nhập mật khẩu mới
    } else {
      alert("Invalid or expired code. You can resend code.");
      localStorage.removeItem("forgotEmail");
    }
  };

  // ===== Step 2b: resend code =====
  const handleResendCode = async () => {
    if (!forgotEmail) return alert("Email not found");

    setResendLoading(true);
    const ok = await onSendCode(forgotEmail);
    setResendLoading(false);

    if (ok) {
      alert("New verification code has been sent!");
    } else {
      alert("Cannot resend code. Try again later.");
    }
  };

  // ===== Step 3: reset password =====
  const handleResetPassword = async () => {
    if (!newPassword) return alert("Please enter a new password");

    await onResetPassword(forgotEmail, resetCode, newPassword);

    // reset state sau khi thành công
    setStep(1);
    setForgotEmail("");
    setResetCode("");
    setNewPassword("");
    setCodeSent(false);
    localStorage.removeItem("forgotEmail");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Forgot Password
        </h2>

        {/* ===== Step 1: Nhập email ===== */}
        {step === 1 && (
          <>
            <p className="text-gray-600 text-center text-sm">
              Enter your email to reset your password
            </p>
            <input
              type="email"
              placeholder="Email address"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={handleSendCode}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              Send Code
            </button>
          </>
        )}

        {/* ===== Step 2: Nhập code ===== */}
        {step === 2 && (
          <>
            <p className="text-gray-600 text-center text-sm">
              Check your email and enter the verification code
            </p>
            <input
              type="text"
              placeholder="Verification code"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={resetCode}
              onChange={(e) => setResetCode(e.target.value)}
            />
            <button
              type="button"
              onClick={handleVerifyCode}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Verify Code
            </button>

            {/* Nút Resend code */}
            <button
              type="button"
              onClick={handleResendCode}
              disabled={resendLoading}
              className="w-full mt-2 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors font-semibold"
            >
              {resendLoading ? "Sending..." : "Resend Code"}
            </button>
          </>
        )}

        {/* ===== Step 3: Nhập mật khẩu mới ===== */}
        {step === 3 && (
          <>
            <p className="text-gray-600 text-center text-sm">
              Enter your new password
            </p>
            <input
              type="password"
              placeholder="New password"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={handleResetPassword}
              className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors font-semibold"
            >
              Reset Password
            </button>
          </>
        )}

        {/* ===== Hiển thị lỗi ===== */}
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        {/* ===== Back to login ===== */}
        <p
          className="text-center text-sm text-gray-500 mt-2 cursor-pointer hover:underline"
          onClick={onBack}
        >
          Back to Login
        </p>
      </div>
    </div>
  );
}

export default ForgotPasswordForm;
