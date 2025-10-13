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
import { useTranslate } from "react-admin";

const ProfileActions = () => {
  const redirect = useRedirect();
  const translate = useTranslate();
  return (
    <TopToolbar>
      <Button
        variant="contained"
        onClick={() => redirect("/profile/edit")}
      >
        {translate("custom.profile.edit")}
      </Button>
    </TopToolbar>
  );
};

const ProfileView = () => {
  const translate = useTranslate();
  return (
    <Show resource="profile" id={1} actions={<ProfileActions />}>
      <SimpleShowLayout>
        <TextField source="fullName" label={translate("custom.profile.fullName")} />
        <TextField source="email" label="Email" />
        <TextField source="phoneNumber" label={translate("custom.profile.phoneNumber")} />
      </SimpleShowLayout>
    </Show>
  );
};

export default ProfileView;
