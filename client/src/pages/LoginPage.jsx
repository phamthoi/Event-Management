import React, { useState } from "react";
import LoginForm from "../components/Login/LoginForm";
import ForgotPasswordForm from "../components/Login/ForgotPasswordForm";

const LoginPage = () => {
  const [showForgot, setShowForgot] = useState(false);
  const [error, setError] = useState("");

  // Demo login
  const handleLogin = (email, password) => {
    if (email === "admin@example.com" && password === "123456") {
      localStorage.setItem("token", "demo-token");
      window.location.href = "/dashboard";
    } else {
      setError("Invalid credentials");
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
    <LoginForm
      onLogin={handleLogin}
      onForgot={handleForgot}
      error={error}
    />
  );
};

export default LoginPage;
