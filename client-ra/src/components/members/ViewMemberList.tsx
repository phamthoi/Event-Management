import * as React from "react";
import {
  List,
  Datagrid,
  TextField,
  TextInput,
  Pagination,
  FilterForm,
  useTranslate,
} from "react-admin";
import * as ScrollArea from "@radix-ui/react-scroll-area";

const MemberFilters = [
  <TextInput source="email" label="Email" alwaysOn key="email" />,
  <TextInput
    source="fullName"
    label="resources.members.fields.name"
    alwaysOn
    key="fullName"
  />,
];

const MemberPagination = (props) => (
  <Pagination rowsPerPageOptions={[5, 10, 25]} className="mt-4 flex justify-end pr-4" {...props} />
);

const ViewMemberList: React.FC = () => {
  const t = useTranslate();

  return (
    <List
      resource="member-members"
      filters={<FilterForm filters={MemberFilters} />}
      pagination={<MemberPagination />}
      perPage={10}
      actions={false}
      sort={{ field: "id", order: "DESC" }}
    >
      <ScrollArea.Root className="h-[500px] w-full rounded-md border border-gray-200 shadow-sm">
        <ScrollArea.Viewport className="w-full h-full">
          <Datagrid
            rowClick="show"
            bulkActionButtons={false}
            sx={{
              "& .RaDatagrid-headerCell": {
                backgroundColor: "#f9fafb",
                fontWeight: 600,
                color: "#374151",
                fontSize: "0.875rem",
              },
              "& .RaDatagrid-row:hover": {
                backgroundColor: "#f3f4f6",
                cursor: "pointer",
              },
              "& .RaDatagrid-cell": {
                fontSize: "0.875rem",
              },
            }}
          >
            <TextField source="email" label="Email" />
            <TextField source="fullName" label={t("resources.members.fields.name")} />
            <TextField source="phoneNumber" label={t("resources.members.fields.phonenumber")} />
          </Datagrid>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar
          orientation="vertical"
          className="flex select-none touch-none p-0.5 bg-gray-100 rounded-md"
        >
          <ScrollArea.Thumb className="flex-1 bg-gray-400 rounded-md" />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
    </List>
  );
};

export default ViewMemberList;
