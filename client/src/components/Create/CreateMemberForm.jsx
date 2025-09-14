import React, { useState } from "react";
import { CreateMember } from "../../services/admin/CreateMemberService";

const CreateMemberForm = () => {
    const [form, setForm] = useState({
      fullName:"", 
      email:"", 
      password:"",
    });
    const [msg, setMsg] = useState({text:"", type:""});

    const handleChange = (e) => {
        setForm({...form, [e.target.id]: e.target.value});
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        setMsg({text:"", type:""});
        try{
            const data = await CreateMember(form);
            setMsg({text: `create member successful: ${data.email}`, type: "success"});
            setForm({fullName: "", email: "", password:""});
        } catch(err){
            setMsg({text: err.response?.data?.message || err.message, type: "error"});
        }
    };

    return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        id="fullName"
        placeholder="Full Name"
        value={form.fullName}
        onChange={handleChange}
        className="w-full px-3 py-2 border rounded"
        required
      />
      <input
        type="email"
        id="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        className="w-full px-3 py-2 border rounded"
        required
      />
      <input
        type="password"
        id="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        className="w-full px-3 py-2 border rounded"
        required
      />
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Create Member
      </button>

      {msg.text && (
        <p
          className={`mt-2 text-sm ${
            msg.type === "error" ? "text-red-500" : "text-green-500"
          }`}
        >
          {msg.text}
        </p>
      )}
    </form>
  );
}

export default CreateMemberForm;