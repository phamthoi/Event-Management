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
            setMsg({text: "Vui lòng điền đầy đủ thông tin", type: "error"});
            return false;
        }
        
        if (form.password !== form.confirmPassword) {
            setMsg({text: "Mật khẩu xác nhận không khớp", type: "error"});
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
            setMsg({text: `Tạo thành viên thành công: ${data.member.email}`, type: "success"});
            setForm({fullName: "", email: "", password:"", confirmPassword: ""});
        } catch(err){
            showErrorAlert(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Tạo Thành Viên Mới</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên *</label>
                    <input
                        type="text"
                        id="fullName"
                        placeholder="Nhập họ và tên"
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
                        placeholder="Nhập email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu *</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Nhập mật khẩu"
                        value={form.password}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu *</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        placeholder="Nhập lại mật khẩu"
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
                    {loading ? "Đang tạo..." : "Tạo Thành Viên"}
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