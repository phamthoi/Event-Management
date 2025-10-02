import React from "react";
import ProfilePage from "../../common/profile/ProfilePage";
import { profileService } from "../../../services/common/profile/profileService";

const AdminProfilePage = () => {
  return (
    <ProfilePage
      getProfileService={profileService.getProfile}
      updateProfileService={profileService.updateProfile}
      showErrorAlert={showErrorAlert}
      userType="admin"
    />
  );
};

export default AdminProfilePage;
