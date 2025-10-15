import * as React from "react";
import {
  List,
  Datagrid,
  TextField,
  TextInput,
  Filter,
  Pagination,
} from "react-admin";
import { useTranslate } from "react-admin";

// 🔍 Bộ lọc
const MemberFilter = (props: any) => {
  const translate = useTranslate();
  return (
    <Filter {...props}>
      <TextInput label="Email" source="email" alwaysOn />
      <TextInput
        label={translate("resources.members.fields.name")}
        source="fullName"
      />
    </Filter>
  );
};

// 🔢 Phân trang
const MemberPagination = (props: any) => (
  <Pagination rowsPerPageOptions={[5]} {...props} />
);

// 🧾 Danh sách thành viên
const ViewMemberList = () => {
  const translate = useTranslate();
  return (
    <List
      resource="member-members"
      filters={<MemberFilter />}
      pagination={<MemberPagination />}
      perPage={5}
      actions={false}
    >
      <Datagrid rowClick="show" bulkActionButtons={false}>
        <TextField source="email" label="Email" />
        <TextField
          source="fullName"
          label={translate("resources.members.fields.name")}
        />
        <TextField
          source="phoneNumber"
          label={translate("resources.members.fields.phonenumber")}
        />
      </Datagrid>
    </List>
  );
};

export default ViewMemberList;
