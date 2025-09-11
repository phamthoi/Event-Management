import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/axios";
import LoginForm from "../components/LoginForm";
import ForgotPasswordForm from "../components/ForgotPasswordForm";

function LoginPage() {
  const navigate = useNavigate();
  const [isForgot, setIsForgot] = useState(false);
  const [error, setError] = useState("");

  // Handle login
  const handleLogin = async (email, password) => {
    setError(""); //clear lỗi cũ
    try {
      const res = await api.post("/auth/login", { email, password });
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        navigate("/dashboard");
      } else {
        setError(res.data.message || "Login failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    }
  };

  // Send reset code
  const handleSendCode = async (forgotEmail) => {
    // TODO: call API to send reset code
    alert("Code sent to " + forgotEmail);
  };

  // Reset password
  const handleResetPassword = async (forgotEmail, resetCode, newPassword) => {
    // TODO: call API to reset password
    alert("Password reset successfully");
    setIsForgot(false);
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Admin Login
        </h1>
        {!isForgot ? (
          <LoginForm
            onLogin={handleLogin}
            onForgot={() => {
              setError("");
              setIsForgot(true);
            }}
            error={error}
          />
        ) : (
          <ForgotPasswordForm
            onSendCode={handleSendCode}
            onResetPassword={handleResetPassword}
            onBack={() => {
              setError("");
              setIsForgot(false);
            }}
            error={error}
          />
        )}
      </div>
    </div>
  );
}

export default LoginPage;