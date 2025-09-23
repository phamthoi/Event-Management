// AdminProfilePage.jsx
import React, { useEffect, useState } from "react";
import ProfileView from "../../../components/profile/ProfileView";
import ProfileForm from "../../../components/profile/ProfileForm";
import { getAdminProfile, updateAdminProfile } from "../../../services/admin/profile/adminProfileService";

/*
//===========Fake API=========== 
const fakeProfile = {
  id: 1,
  fullName: "Nguyen Van A",
  email: "admin@test.com",
  phoneNumber: "0123456789",
  role: "ADMIN",
  organizationId: 123,
};

const getProfile = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500)); // fake delay
  return fakeProfile;
};

const updateProfile = async (updatedData) => {
  await new Promise((resolve) => setTimeout(resolve, 500)); // fake delay
  Object.assign(fakeProfile, updatedData); // merge dữ liệu
  return fakeProfile;
};
//==========end fake API========== 
*/

const AdminProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // useEffect kiểm tra token trong localstorage. nếu không có token, báo login và redirect sang /login.
    const token = localStorage.getItem("token");  
    if (!token) {
      alert("You must login first");
      window.location.href = "/login";
      return;
    }

    // nếu token, gọi hàm fetchProfile() để gọi API lấy dữ liệu admin profile.
    // setProfile(data) -> cập nhật state profile, khiến component re-render để hiển thị dữ liệu. 
    const fetchProfile = async () => {
      try {
        const data = await getAdminProfile(); // là service API thật để gọi HTTP
        setProfile(data); // thành công trả về profile JSON
      } catch (err) {
        console.error("Error fetching admin profile:", err);
        alert("Failed to fetch profile.");
      }
    };
    fetchProfile();
  }, []);
  // useEffect(..., []) [] => chỉ chạy 1 lần khi component được mount(khi adminProfilePage render lần đầu). 
  // useEffect thực hiện side effect: 
  // useEffect ở đây dùng để đảm bảo việc gọi API chỉ diễn ra sau khi component mount và không lặp lại liên tục.
  const handleSave = async (updatedData) => {
    try {
      const data = await updateAdminProfile(updatedData); // sử dụng API thật
      setProfile(data);
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating admin profile:", err);
      alert("Failed to update profile.");
    }
  };

  if (!profile) return <p className="text-center mt-10">Loading profile...</p>;

    return (
    <div className="min-h-screen bg-gray-100 flex items-start justify-center py-8">
      <div className="w-full max-w-3xl">
        {!isEditing ? (
          <ProfileView profile={profile} onEdit={() => setIsEditing(true)} />
        ) : (
          <ProfileForm
            profile={profile}
            onCancel={() => setIsEditing(false)}
            onSave={handleSave}
          />
        )}
      </div>
    </div>
  );
};

export default AdminProfilePage;