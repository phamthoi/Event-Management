// components/LoginForm.jsx
import React, { useState } from "react";
import * as Label from "@radix-ui/react-label";
import { HiOutlineMail, HiOutlineLockClosed } from "react-icons/hi";

function LoginForm({ onLogin, onForgot, error }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-indigo-100 px-4">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Welcome Back
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Email */}
          {/* Email */}
          <div className="relative">
            <input
              type="email"
              id="email"
              placeholder=" "
              className="peer w-full pl-10 pr-4 pt-5 pb-2 border border-gray-300 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <Label.Root
              htmlFor="email"
              className="absolute left-10 top-2 text-gray-500 text-sm transition-all
                         peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2
                         peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base
                         peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-600 bg-white px-1"
            >
              Email
              </Label.Root>
            </div>

          {/* Password */}
          <div className="relative">
            <input
              type="password"
              id="password"
              placeholder=" "
              className="peer w-full pl-10 pr-4 pt-5 pb-2 border border-gray-300 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <Label.Root
              htmlFor="password"
              className="absolute left-10 top-2 text-gray-500 text-sm transition-all
                         peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2
                         peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base
                         peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-600 bg-white px-1"
            >
              Password
              </Label.Root>
          </div>

          {/* Error */}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          {/* Login button */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            Login
          </button>

          {/* Forgot password */}
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
