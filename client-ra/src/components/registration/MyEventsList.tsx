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
import { useTranslate } from 'react-admin';

// Custom button an toàn

const CancelRegistrationButton = () => {
  const record = useRecordContext();
  const refresh = useRefresh();
  const dataProvider = useDataProvider();
  const translate = useTranslate();

  if (!record) return null;

  const handleClick = () => {
    if (record.status !== 'REGISTRATION' || new Date(record.registrationEndAt) < new Date()) {
      alert("Cannot cancel registration, registration closed.");
      return;
    }
    if (window.confirm("Are you sure you want to cancel this registration?")) {
      dataProvider
        .delete('event', { id: record.id })
        .then(() => {
          // alert("Registration cancelled successfully");
          refresh();
        })
        .catch(err => {
          console.error(err);
          // alert("Error cancelling registration");
        });
    }
  };

  return (
    <Button
      label={translate("resources.upcoming.fields.CancelButton")}
      onClick={handleClick}
      disabled={record.status !== 'REGISTRATION' || new Date(record.registrationEndAt) < new Date()}
    />
  );
};

const MyEventsList = () => {
  const translate = useTranslate();
  return(
  <List resource="event" perPage={4}>
    <Datagrid>
      <TextField source="title" label={translate("resources.myEvents.fields.title")} />
      <TextField source="location" label={translate("resources.myEvents.fields.location")} />
      <DateField source="startAt" label={translate("resources.myEvents.fields.startAt")} showTime />
      <DateField source="endAt" label={translate("resources.myEvents.fields.endAt")} showTime />
      <NumberField source="registeredCount" label={translate("resources.myEvents.fields.registered")} />
      <FunctionField
        label={translate("resources.myEvents.fields.status")}
        render={record =>
          record.status === 'CANCELLED'
            ? translate("resources.myEvents.status.CANCELLED")
            : record.status === 'COMPLETED'
            ? translate("resources.myEvents.status.COMPLETED")
            : record.status === 'ONGOING'
            ? translate("resources.myEvents.status.ONGOING")
            : record.status === 'READY'
            ? translate("resources.myEvents.status.READY")
            : translate("resources.myEvents.status.REGISTRATION")
        }
      />
      <CancelRegistrationButton />
    </Datagrid>
  </List>
);
};

export default MyEventsList;
