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

// 🔍 Bộ lọc
const MemberFilter = (props: any) => (
  <Filter {...props}>
    <TextInput label="Email" source="email" alwaysOn />
    <TextInput label="Full Name" source="fullName" />
  </Filter>
);

// 🔢 Phân trang (chỉ hiển thị 5 dòng/trang)
const MemberPagination = (props: any) => (
  <Pagination rowsPerPageOptions={[5]} {...props} />
);

// 🔢 Component riêng để hiển thị số thứ tự dòng
const RowNumberField = ({ index }: { index: number }) => {
  const { page, perPage } = useListContext(); // ✅ Hook này chỉ được gọi trong component
  const rowNumber = (page - 1) * perPage + (Number(index) || 0) + 1;
  return <span>{rowNumber}</span>;
};

// 🧾 Trang danh sách thành viên
const ViewMemberList = () => {
  return (
    <List
      resource="member-members"
      filters={<MemberFilter />}
      pagination={<MemberPagination />}
      perPage={5}
      sort={{ field: "id", order: "ASC" }}
      actions={false} // tắt toolbar mặc định
    >
      <Datagrid rowClick="show" bulkActionButtons={false}>
        {/* # Cột số thứ tự */}
        <FunctionField
          label="#"
          render={(_record, index) => <RowNumberField index={Number(index ?? 0)} />}
        />

        {/* Các cột thông tin */}
        <TextField source="email" />
        <TextField source="fullName" label="Full Name" />
        <TextField source="phoneNumber" label="Phone" />
      </Datagrid>
    </List>
  );
};

export default ViewMemberList;
