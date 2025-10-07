// src/pages/admin/MyEventsList.tsx
import * as React from 'react';
import { 
  List, 
  Datagrid, 
  TextField, 
  DateField, 
  NumberField, 
  FunctionField, 
  Button, 
  useRefresh, 
  useRecordContext,
  useDataProvider
} from 'react-admin';

// Custom button an toàn

const CancelRegistrationButton = () => {
  const record = useRecordContext();
  const refresh = useRefresh();
  const dataProvider = useDataProvider();

  if (!record) return null;

  const handleClick = () => {
    if (record.status !== 'REGISTRATION' || new Date(record.registrationEndAt) < new Date()) {
      alert("Cannot cancel registration, registration closed.");
      return;
    }
    if (window.confirm("Are you sure you want to cancel this registration?")) {
      dataProvider
        .delete('event-register', { id: record.id })
        .then(() => {
          alert("Registration cancelled successfully");
          refresh();
        })
        .catch(err => {
          console.error(err);
          alert("Error cancelling registration");
        });
    }
  };

  return (
    <Button
      label="Cancel"
      onClick={handleClick}
      disabled={record.status !== 'REGISTRATION' || new Date(record.registrationEndAt) < new Date()}
    />
  );
};

const MyEventsList = () => (
  <List perPage={4}>
    <Datagrid>
      <TextField source="title" label="Title" />
      <TextField source="location" label="Location" />
      <DateField source="startAt" label="Start Time" showTime />
      <DateField source="endAt" label="End Time" showTime />
      <NumberField source="registeredCount" label="Registered" />
      <FunctionField
        label="Status"
        render={record =>
          record.status === 'CANCELLED'
            ? 'Cancelled'
            : record.status === 'COMPLETED'
            ? 'Completed'
            : record.status === 'ONGOING'
            ? 'Ongoing'
            : 'Registered'
        }
      />
      <CancelRegistrationButton />
    </Datagrid>
  </List>
);

export default MyEventsList;
