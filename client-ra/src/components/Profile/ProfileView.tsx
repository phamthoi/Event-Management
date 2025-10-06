// client/src/components/Profile/ProfileView.tsx
import * as React from "react";
import {
  Show,
  SimpleShowLayout,
  TextField,
  TopToolbar,
} from "react-admin";
import { Button } from "@mui/material";
import { useRedirect } from "react-admin";

const ProfileActions = () => {
  const redirect = useRedirect();
  return (
    <TopToolbar>
      <Button
        variant="contained"
        onClick={() => redirect("/profile/edit")}
      >
        Edit Profile
      </Button>
    </TopToolbar>
  );
};

const ProfileView = () => {
  return (
    <Show resource="admin" id="profile" actions={<ProfileActions />}>
      <SimpleShowLayout>
        <TextField source="fullName" label="Full Name" />
        <TextField source="email" label="Email" />
        <TextField source="phoneNumber" label="Phone Number" />
      </SimpleShowLayout>
    </Show>
  );
};

export default ProfileView;
