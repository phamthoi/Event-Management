//client/src/pages/LoginPage.jsx
import React, { useState } from "react";
import LoginForm from "../components/Login/LoginForm";
import ForgotPasswordForm from "../components/Login/ForgotPasswordForm";
import api from "../services/axios";
import { useNavigate } from "react-router-dom";

const LoginPage = ({ setToken, setRole}) => {
  const navigate = useNavigate();
  const [showForgot, setShowForgot] = useState(false);
  const [error, setError] = useState("");


  const handleLogin = async (email, password) => {
    try {
      // gọi API backend
      const res = await api.post("/auth/login", { email, password });

      const { token, user } = res.data;
      const role = user.role;

      // lưu thông tin vào localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("currentUser", JSON.stringify(user));

      //update state app.jsx
      setToken(token);
      setRole(role);
      
      // redirect theo role
      if (role === "ADMIN") navigate("/admin");
      else if(role === "MEMBER") navigate("/member");
      else setError("Role không hợp lệ");

    } catch (err) {
      console.error("login error:", err.response?.data);
      setError(err.response?.data?.message || "Login failed");
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
