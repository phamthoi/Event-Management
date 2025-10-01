// src/components/admin/member/CreateMemberForm.jsx
import React, { useState } from "react";
import * as Toast from "@radix-ui/react-toast";
import { createMember } from "../../../services/admin/member/memberService";
import { showErrorAlert } from "../../../utils/admin/errorHandler";

const CreateMemberForm = () => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastSuccess, setToastSuccess] = useState(true);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const validateForm = () => {
    if (!form.fullName || !form.email || !form.password || !form.confirmPassword) {
      setToastSuccess(false);
      setToastMsg("Please fill in all required information");
      setToastOpen(true);
      return false;
    }
    if (form.password !== form.confirmPassword) {
      setToastSuccess(false);
      setToastMsg("Password confirmation does not match");
      setToastOpen(true);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const memberData = {
        fullName: form.fullName,
        email: form.email,
        password: form.password
      };
      const data = await createMember(memberData);
      setToastSuccess(true);
      setToastMsg(`Member created successfully: ${data.member.email}`);
      setToastOpen(true);
      setForm({ fullName: "", email: "", password: "", confirmPassword: "" });
    } catch (err) {
      showErrorAlert(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-3xl shadow-2xl">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Create New Member
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {["fullName", "email", "password", "confirmPassword"].map((field, idx) => (
          <div key={idx}>
            <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
              {field.replace("fullName", "Full Name").replace("confirmPassword", "Confirm Password")} *
            </label>
            <input
              type={field.includes("password") ? "password" : field === "email" ? "email" : "text"}
              id={field}
              placeholder={`Enter ${field === "confirmPassword" ? "password again" : field}`}
              value={form[field]}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-xl font-semibold text-white shadow-lg transition transform hover:-translate-y-0.5 ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Creating..." : "Create Member"}
        </button>
      </form>

      {/* Radix Toast */}
      <Toast.Provider swipeDirection="right">
        <Toast.Root
          open={toastOpen}
          onOpenChange={setToastOpen}
          className={`bg-white rounded-xl shadow-lg p-4 border-l-4 ${
            toastSuccess ? "border-green-500" : "border-red-500"
          }`}
        >
          <Toast.Title className="font-semibold">{toastMsg}</Toast.Title>
        </Toast.Root>
        <Toast.Viewport className="fixed bottom-4 right-4 w-96" />
      </Toast.Provider>
    </div>
  );
};

export default CreateMemberForm;
