import * as React from "react";
import { Edit, SimpleForm, TextInput, BooleanInput } from "react-admin";

const MemberEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="email" disabled />
      <TextInput source="fullName" />
      <TextInput source="phoneNumber" />
      <BooleanInput source="isActive" label="Active" />
    </SimpleForm>
  </Edit>
);

export default MemberEdit;
