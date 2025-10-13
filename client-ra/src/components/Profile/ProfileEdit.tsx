// client/src/components/Profile/ProfileEdit.tsx
import * as React from "react";
import {
  Edit,
  SimpleForm,
  TextInput,
  useNotify,
  useRedirect,
} from "react-admin";
import { useTranslate } from "react-admin";

const ProfileEdit = () => {
  const notify = useNotify();
  const redirect = useRedirect();
  const translate = useTranslate();

  const handleSuccess = (data: any) => {
    notify("Profile updated successfully", { type: "success" });
    localStorage.setItem("currentUser", JSON.stringify(data));
    redirect("/profile"); // quay về view sau khi lưu
  };

  return (
    <Edit
      resource="profile"
      id={1}
      mutationMode="pessimistic"
      mutationOptions={{ onSuccess: handleSuccess }}
    >
      <SimpleForm>
        <TextInput source="fullName" label={translate("custom.profile.fullName")} fullWidth />
        <TextInput source="email" label="Email" fullWidth disabled />
        <TextInput source="phoneNumber" label={translate("custom.profile.phoneNumber")} fullWidth />
      </SimpleForm>
    </Edit>
  );
};

export default ProfileEdit;
