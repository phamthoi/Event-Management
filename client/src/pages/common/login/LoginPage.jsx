//client/src/pages/LoginPage.jsx
import React, { useState } from "react";
import LoginForm from "../../../components/common/login/LoginForm";
import ForgotPasswordForm from "../../../components/common/login/ForgotPasswordForm";
import { 
  loginUser, 
  sendResetCode, 
  resetPassword, 
  handleLoginSuccess, 
  handleApiError 
} from "../../../services/common/login/login";

const LoginPage = () => {
  const [showForgot, setShowForgot] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Login handler using service
  const handleLogin = async (email, password) => {
    setLoading(true);
    setError("");
    
    try {
      const response = await loginUser(email, password);

      if (response.success) {
        handleLoginSuccess(response);
      }
    } catch (error) {
      const errorMessage = handleApiError(error);
      setError(errorMessage);
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

  // Send reset code handler using service
  const handleSendCode = async (email) => {
    try {
      await sendResetCode(email);
      alert(`Mã reset đã được gửi đến ${email}`);
    } catch (error) {
      const errorMessage = handleApiError(error);
      setError(errorMessage);
    }
  };

  // Reset password handler using service
  const handleResetPassword = async (email, code, newPassword) => {
    try {
      await resetPassword(email, code, newPassword);
      alert("Mật khẩu đã được reset thành công!");
      setShowForgot(false);
    } catch (error) {
      const errorMessage = handleApiError(error);
      setError(errorMessage);
    }
  };

  return showForgot ? (
    <ForgotPasswordForm
      onSendCode={handleSendCode}
      onResetPassword={handleResetPassword}
      onBack={handleBackToLogin}
      error={error}
    />
  ) : (
    <LoginForm onLogin={handleLogin} onForgot={handleForgot} error={error} loading={loading} />
  );
};

export default LoginPage;
