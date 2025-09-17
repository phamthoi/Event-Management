//client/src/pages/LoginPage.jsx
import React, { useState } from "react";
import LoginForm from "../components/Login/LoginForm";
import ForgotPasswordForm from "../components/Login/ForgotPasswordForm";
// import { getMembers } from "../services/fakeApi";
import api from "../services/axios";

const LoginPage = () => {
  const [showForgot, setShowForgot] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Real API login thay vì demo login
  const handleLogin = async (email, password) => {
    setLoading(true);
    setError("");
    
    try {
      const response = await api.post("/auth/login", {
        email,
        password
      });

      if (response.data.success) {
        // Lưu token và user info
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.data.user.role.toLowerCase());
        localStorage.setItem("currentUser", JSON.stringify(response.data.user));
        
        // Redirect dựa trên role
        if (response.data.user.role === "ADMIN") {
          window.location.href = "/admin";
        } else {
          window.location.href = "/member";
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Đăng nhập thất bại. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = () => {
    setError("");
    setShowForgot(true);
  };

  const handleBackToLogin = () => {
    setError("");
    setShowForgot(false);
  };

  const handleSendCode = async (email) => {
    alert(`Send reset code to ${email} (demo)`);
  };

  const handleResetPassword = async (email, code, newPassword) => {
    alert(`Reset password for ${email} with code ${code} (demo)`);
  };

  return showForgot ? (
    <ForgotPasswordForm
      onSendCode={handleSendCode}
      onResetPassword={handleResetPassword}
      onBack={handleBackToLogin}
      error={error}
    />
  ) : (
    <LoginForm onLogin={handleLogin} onForgot={handleForgot} error={error} />
  );
};

export default LoginPage;
