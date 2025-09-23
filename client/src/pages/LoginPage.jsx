//client/src/pages/LoginPage.jsx
import React, { useState } from "react";
import LoginForm from "../components/Login/LoginForm";
import ForgotPasswordForm from "../components/Login/ForgotPasswordForm";
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
        const user = response.data.user;

        //check status of user. 
        if(user.isActive === false || user.status === "LOCKED"){
          setError("Your account have been locked!");
          return; // dừng không login được. 
        }

        // save info
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.data.user.role.toLowerCase());
        localStorage.setItem("currentUser", JSON.stringify(response.data.user));
        
        
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
  
  /*
  // ======= Fake Login =======
  const handleLogin = async (email, password) => {
    setLoading(true);
    setError("");

    // Fake delay để giống call API
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Fake account
    const fakeUser = {
      email: "member@example.com",
      password: "123",
      role: "MEMBER",
    };
    const fakeAdmin = {
      email: "admin@example.com",
      password: "123",
      role: "ADMIN",
    };

    if (
      (email === fakeUser.email && password === fakeUser.password) ||
      (email === fakeAdmin.email && password === fakeAdmin.password)
    ) {
      const user = email === fakeUser.email ? fakeUser : fakeAdmin;

      // Fake token + user info
      localStorage.setItem("token", "fake-token-123");
      localStorage.setItem("role", user.role.toLowerCase());
      localStorage.setItem("currentUser", JSON.stringify(user));

      if (user.role === "ADMIN") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/member";
      }
    } else {
      setError("Sai email hoặc mật khẩu");
    }

    setLoading(false);
  };
  // ======= End Fake Login =======
*/
  const handleForgot = () => {
    setError("");
    setShowForgot(true);
  };

  const handleBackToLogin = () => {
    setError("");
    setShowForgot(false);
  };
  // step 1: send code
  const handleSendCode = async (email) => {
    try{
      const res = await api.post("/auth/forgot-password", {email});
      alert("A verification code has been sent to your email!");
      return true;
    } catch(err){
      console.error("Send code error:", err);
      setError(err.response?.data?.error || "Không gửi được code!");
      return false;
    }
  };

  //step 2: verify code
  const handleVerifyCode = async (email, code) => {
    try {
      const res = await api.post("/auth/verify-code", {email, code});
      return res.data.ok;
    }catch(err){
      console.error("Verify error:", err);
      setError(err.response?.data?.error || "Code không hợp lệ!");
      return false;
    }
  }

  // Step 3: reset password
  const handleResetPassword = async (email, code, newPassword) => {
    try {
      await api.post("/auth/reset-password", {
        email,
        code,
        newPassword,
      });
      alert("Đặt lại mật khẩu thành công!");
      setShowForgot(false); // quay về login
    } catch (err) {
      console.error("Reset error:", err);
      setError(err.response?.data?.error || "Không thể đặt lại mật khẩu!");
    }
  };

  return showForgot ? (
    <ForgotPasswordForm
      onSendCode={handleSendCode}
      onVerifyCode={handleVerifyCode}
      onResetPassword={handleResetPassword}
      onBack={handleBackToLogin}
      error={error}
    />
  ) : (
    <LoginForm onLogin={handleLogin} onForgot={handleForgot} error={error} />
  );
};

export default LoginPage;
