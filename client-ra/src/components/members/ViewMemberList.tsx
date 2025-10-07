import * as React from "react";
import {
  List,
  Datagrid,
  TextField,
  TextInput,
  Filter,
  Pagination,
  FunctionField,
  useListContext,
} from "react-admin";

// Filter component
const MemberFilter = (props: any) => (
  <Filter {...props}>
    <TextInput label="Email" source="email" alwaysOn />
    <TextInput label="Full Name" source="fullName" />
  </Filter>
);

// Custom pagination
const MemberPagination = (props: any) => <Pagination rowsPerPageOptions={[5]} {...props} />;

const ViewMemberList = () => {
  return (
    <List
      resource="membersPublic"
      filters={<MemberFilter />}
      pagination={<MemberPagination />}
      perPage={5}
      sort={{ field: "id", order: "ASC" }}
      actions={false} // tắt toolbar
    >
      <Datagrid rowClick="show" bulkActionButtons={false}>
        {/* Số thứ tự # */}
        <FunctionField
          label="#"
          render={(_record, _recordIndex) => {
            const { page, perPage } = useListContext();
            const index = Number(_recordIndex ?? 0); // ép kiểu number
            return (page - 1) * perPage + index + 1;
          }}
        />
        <TextField source="email" />
        <TextField source="fullName" label="Full Name" />
        <TextField source="phoneNumber" label="Phone" />
      </Datagrid>
    </List>
  );
};

export default ViewMemberList;
