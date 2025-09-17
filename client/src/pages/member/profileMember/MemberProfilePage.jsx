// client/src/pages/member/memberProfilePage.jsx
import React, { useEffect, useState } from "react";
import ProfileView from "../../../components/member/profile/ProfileView";
import ProfileForm from "../../../components/member/profile/ProfileForm";
// import { getProfile, updateProfile } from "../../../services/fakeApi";

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
    <div className="bg-gray-100 flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4">Member Profile</h1>
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
