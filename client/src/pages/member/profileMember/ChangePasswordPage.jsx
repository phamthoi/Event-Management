import React from "react";
import ChangePasswordForm from "../../../components/common/profile/ChangePasswordForm";
import { profileService } from "../../../services/common/profile/profileService";
import { showErrorAlert } from "../../../utils/errorHandler";

const ChangePasswordPage = () => {
  return (
    <div className="p-6">
      <ChangePasswordForm
        updatePasswordService={profileService.updatePassword}
        showErrorAlert={showErrorAlert}
        userType="member"
      />
    </div>
  );
};

export default ChangePasswordPage;
