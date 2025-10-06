import * as React from "react";
import {
  List,
  Datagrid,
  TextField,
  EmailField,
  BooleanField,
  TextInput,
  Filter,
  EditButton,
  ShowButton,
  DeleteButton,
} from "react-admin";

// Bộ lọc
const MemberFilter = [
  <TextInput label="Email" source="email" alwaysOn />,
  <TextInput label="Full Name" source="fullName" />,
  <TextInput label="Status" source="isActive" />, // true / false
];

const MemberList = () => (
  <List
    resource="members"
    filters={MemberFilter}
    sort={{ field: "id", order: "DESC" }}
    perPage={10}
    title="👥 Member Management"
  >
    <Datagrid rowClick="show">
      <TextField source="id" label="ID" />
      <EmailField source="email" />
      <TextField source="fullName" label="Full Name" />
      <TextField source="phoneNumber" label="Phone" />
      <BooleanField source="isActive" label="Active" />

      <ShowButton />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export default MemberList;
