//components/LoginForm.jsx
import React, { useState } from 'react';

function LoginForm({ onLogin, onForgot, error }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); 

  // function to handle form submission: call callback onlogin from props
  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(email, password);
  };

   return (
    // ✅ Wrapper ngoài cùng: căn giữa form bằng flexbox + min-h-screen
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      {/* ✅ Container chính của form */}
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        {/* ✅ Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Hiện lỗi nếu có */}
          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          {/* Nút login */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Login
          </button>

          {/* Quên mật khẩu */}
          <p
            className="text-center mt-3 text-sm text-blue-600 hover:underline cursor-pointer"
            onClick={onForgot}
          >
            Forgot Password?
          </p>
        </form>
      </div>
    </div>
  );
}
export default LoginForm;