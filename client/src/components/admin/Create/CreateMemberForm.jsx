import React, { useState } from "react";
import { createMember } from "../../../services/admin/member/memberService";
import { showErrorAlert } from "../../../utils/admin/errorHandler";

const CreateMemberForm = () => {
    const [form, setForm] = useState({
      fullName:"", 
      email:"", 
      password:"",
      confirmPassword: ""
    });
    const [msg, setMsg] = useState({text:"", type:""});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({...form, [e.target.id]: e.target.value});
    };

    const validateForm = () => {
        if (!form.fullName || !form.email || !form.password || !form.confirmPassword) {
            setMsg({text: "Please fill in all required information", type: "error"});
            return false;
        }
        
        if (form.password !== form.confirmPassword) {
            setMsg({text: "Password confirmation does not match", type: "error"});
            return false;
        }
        
        return true;
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        setMsg({text:"", type:""});
        
        if (!validateForm()) {
            return;
        }
        
        setLoading(true);
        
        try{
            const memberData = {
                fullName: form.fullName,
                email: form.email,
                password: form.password
            };
            
            const data = await createMember(memberData);
            setMsg({text: `Member created successfully: ${data.member.email}`, type: "success"});
            setForm({fullName: "", email: "", password:"", confirmPassword: ""});
        } catch(err){
            showErrorAlert(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create New Member</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input
                        type="text"
                        id="fullName"
                        placeholder="Enter full name"
                        value={form.fullName}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Enter email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Enter password"
                        value={form.password}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        placeholder="Re-enter password"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {loading ? "Creating..." : "Create Member"}
                </button>

                {msg.text && (
                    <div
                        className={`mt-3 p-3 rounded-md text-sm ${
                            msg.type === "error" 
                                ? "bg-red-50 text-red-700 border border-red-200" 
                                : "bg-green-50 text-green-700 border border-green-200"
                        }`}
                    >
                        {msg.text}
                    </div>
                )}
            </form>
        </div>
    );
}

export default CreateMemberForm;