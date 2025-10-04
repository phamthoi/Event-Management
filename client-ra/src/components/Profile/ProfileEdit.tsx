// client/src/components/Profile/ProfileEdit.tsx
import * as React from "react";
import {
  Edit,
  SimpleForm,
  TextInput,
  useNotify,
  useRedirect,
} from "react-admin";

const ProfileEdit = () => {
  const notify = useNotify();
  const redirect = useRedirect();

  const handleSuccess = (data: any) => {
    notify("Profile updated successfully", { type: "success" });
    localStorage.setItem("currentUser", JSON.stringify(data));
    redirect("/profile/view"); // quay về view sau khi lưu
  };

  return (
    <Edit
      resource="admin"
      id="profile"
      mutationMode="pessimistic"
      mutationOptions={{ onSuccess: handleSuccess }}
    >
      <SimpleForm>
        <TextInput source="fullName" label="Full Name" fullWidth />
        <TextInput source="email" label="Email" fullWidth disabled />
        <TextInput source="phoneNumber" label="Phone Number" fullWidth />
      </SimpleForm>
    </Edit>
  );
};

export default ProfileEdit;
