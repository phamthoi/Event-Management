//client/src/pages/LoginPage.jsx
import React, { useState } from "react";
import LoginForm from "../components/Login/LoginForm";
import ForgotPasswordForm from "../components/Login/ForgotPasswordForm";

const LoginPage = () => {
  const [showForgot, setShowForgot] = useState(false);
  const [error, setError] = useState("");

  // Demo login
  const handleLogin = (email, password) => {
    if (email === "admin@example.com" && password === "1234") {
      localStorage.setItem("token", "demo-admin-token");
      localStorage.setItem("role", "admin")
      window.location.href = "/admin";
    } else if(email === "member@example.com" && password === "1234"){
      localStorage.setItem("token", "demo-member-token");
      localStorage.setItem("role", "member");
      window.location.href="/member";
    }else{
      setError("Invalid credentials");
  }      
  }

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
