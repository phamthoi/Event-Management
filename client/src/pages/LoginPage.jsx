//client/src/pages/LoginPage.jsx
import React, { useState } from "react";
import LoginForm from "../components/Login/LoginForm";
import ForgotPasswordForm from "../components/Login/ForgotPasswordForm";
import { getMembers } from "../services/fakeApi";

const LoginPage = () => {
  const [showForgot, setShowForgot] = useState(false);
  const [error, setError] = useState("");

  // Demo login
   const handleLogin = (email, password) => {
    // 1. Admin mặc định
    if (email === "admin@example.com" && password === "1234") {
      localStorage.setItem("token", "demo-admin-token");
      localStorage.setItem("role", "admin");
      localStorage.setItem(
        "currentUser",
        JSON.stringify({ id: 0, email, fullName: "System Admin", role: "admin" })
      );
      window.location.href = "/admin";
      return;
    }

    // 2. Check member trong localStorage
    const members = getMembers() || [];
    const user = members.find((m) => m.email === email && m.password === password);

    if (!user) {
      setError("Invalid credentials");
      return;
    }

    if (!user.isActive) {
      setError("This account is locked");
      return;
    }
    
    console.log("Members in storage:", members);
    console.log("Login input:", email, password);


    localStorage.setItem("token", "demo-token-" + user.id);
    localStorage.setItem("role", "member");
    localStorage.setItem("currentUser", JSON.stringify(user));
    window.location.href = "/member";
    

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
