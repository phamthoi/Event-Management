import * as React from "react";
import { Create, SimpleForm, TextInput } from "react-admin";

const MemberCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="email" label="Email" />
      <TextInput source="fullName" label="Full Name" />
      <TextInput source="phoneNumber" label="Phone" />
      <TextInput source="password" label="Password" type="password" />
    </SimpleForm>
  </Create>
);

export default MemberCreate;
