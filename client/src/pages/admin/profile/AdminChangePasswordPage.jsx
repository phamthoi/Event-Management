import React from "react";
import ChangePasswordForm from "../../../components/common/profile/ChangePasswordForm";
import { profileService } from "../../../services/common/profile/profileService";
import { showErrorAlert } from "../../../utils/errorHandler";

const AdminChangePasswordPage = () => {
  return (
    <div className="p-6">
      <ChangePasswordForm
        updatePasswordService={profileService.updatePassword}
        showErrorAlert={showErrorAlert}
        userType="admin"
      />
    </div>
  );
};

export default AdminChangePasswordPage;
