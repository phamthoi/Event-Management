// client/src/pages/member/memberProfilePage.jsx
import React, { useEffect, useState } from "react";
import ProfileView from "../../../components/member/profile/ProfileView";
import ProfileForm from "../../../components/member/profile/ProfileForm";
import {getProfile, updateProfile} from "../../../services/member/profileService"

/*
//===========Fake API=========== 
const fakeProfile = {
  id: 1,
  fullName: "Nguyen Van A",
  email: "member@test.com",
  phoneNumber: "0123456789",
  role: "MEMBER",
  organizationId: 123,
};

const getProfile = async () => {
  // Fake delay như call API
  await new Promise((resolve) => setTimeout(resolve, 500));
  return fakeProfile;
};

const updateProfile = async (updatedData) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  // Merge dữ liệu fake
  Object.assign(fakeProfile, updatedData);
  return fakeProfile;
};
//==========end fake API========== 
*/


const MemberProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must login first");
      window.location.href = "/login";
      return;
    }

    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        if (data) {
          setProfile(data);
        } else {
          alert("Failed to load profile");
        }
      } catch (err) {
        console.error("fetchProfile error:", err);
        alert("Error loading profile");
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async (updatedData) => {
    try {
      const data = await updateProfile(updatedData);
      if (data) {
        alert("Profile updated successfully");
        setProfile(data);
        setIsEditing(false);
      } else {
        alert("Failed to update profile");
      }
    } catch (err) {
      alert("Error updating profile");
    }
  };

  if (!profile) return <p className="text-center mt-10">Loading...</p>;

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

export default MemberProfilePage;
