import React, { useEffect, useState } from "react";
import ProfileView from "../../../components/profile/ProfileView";
import ProfileForm from "../../../components/profile/ProfileForm";
import {getProfile, updateProfile} from "../../../services/member/profile/profileService";
import { showErrorAlert } from "../../../utils/member/errorHandler";

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
        showErrorAlert(err);
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
      showErrorAlert(err);
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
