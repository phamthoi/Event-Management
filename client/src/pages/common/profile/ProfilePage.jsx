import React, { useEffect, useState } from "react";
import ProfileView from "../../../components/common/profile/ProfileView";
import ProfileForm from "../../../components/common/profile/ProfileForm";
import * as Toast from "@radix-ui/react-toast";

const ProfilePage = ({ 
  getProfileService, 
  updateProfileService, 
  showErrorAlert, 
  userType = "member" 
}) => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    type: "success",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      const message = "You must login first";
      if (userType === "admin") {
        setToast({ open: true, message, type: "error" });
        setTimeout(() => (window.location.href = "/login"), 1000);
      } else {
        alert(message);
        window.location.href = "/login";
      }
      return;
    }

    const fetchProfile = async () => {
      try {
        const data = await getProfileService();
        if (data) {
          setProfile(data);
        } else if (userType === "member") {
          alert("Failed to load profile");
        }
      } catch (err) {
        showErrorAlert(err);
        if (userType === "member") {
          alert("Error loading profile");
        }
      }
    };

    fetchProfile();
  }, [getProfileService, showErrorAlert, userType]);

  const handleSave = async (updatedProfile) => {
    try {
      let profileData = {
        fullName: updatedProfile.fullName,
        phoneNumber: updatedProfile.phoneNumber,
      };

      if (updatedProfile.avatar && updatedProfile.avatar instanceof File) {
        profileData.avatarUrl = updatedProfile.avatar.name;
      }

      const data = await updateProfileService(profileData);
      setProfile(data);
      setIsEditing(false);

      // Update localStorage
      const currentUser = JSON.parse(
        localStorage.getItem("currentUser") || "{}"
      );
      const updatedUser = { ...currentUser, ...data };
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));

      // Show success message
      if (userType === "admin") {
        setToast({
          open: true,
          message: "Profile updated successfully!",
          type: "success",
        });
      } else {
        alert("Profile updated successfully");
      }

      // Reload page
      window.location.reload();
    } catch (err) {
      showErrorAlert(err);
      if (userType === "member") {
        alert("Error updating profile");
      }
    }
  };

  if (!profile) {
    if (userType === "admin") {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="loader rounded-full border-4 border-blue-300 border-t-blue-600 w-16 h-16 animate-spin"></div>
        </div>
      );
    } else {
      return <p className="text-center mt-10">Loading...</p>;
    }
  }

  return (
    <div className={`min-h-screen bg-gray-100 flex ${userType === "admin" ? "flex-col items-center py-12" : "items-start justify-center py-8"} px-4`}>
      <div className={`w-full max-w-3xl ${userType === "admin" ? "bg-white rounded-2xl shadow-lg p-6" : ""}`}>
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

      {/* Toast for Admin only */}
      {userType === "admin" && (
        <Toast.Provider swipeDirection="right">
          <Toast.Root
            open={toast.open}
            onOpenChange={(open) => setToast({ ...toast, open })}
            className={`fixed bottom-6 right-6 p-4 rounded-lg shadow-md border ${
              toast.type === "success"
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-red-50 text-red-700 border-red-200"
            }`}
          >
            <Toast.Title className="font-bold">{toast.message}</Toast.Title>
            <Toast.Close className="absolute top-2 right-2 text-gray-500 cursor-pointer">
              ✕
            </Toast.Close>
          </Toast.Root>
          <Toast.Viewport />
        </Toast.Provider>
      )}
    </div>
  );
};

export default ProfilePage;