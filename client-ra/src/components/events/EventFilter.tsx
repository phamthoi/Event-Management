import * as React from "react";
import { TextInput, SelectInput, Filter } from "react-admin";

const EventFilter = (props: any) => (
  <Filter {...props}>
    <TextInput label="Event Name" source="name" alwaysOn />
    <TextInput label="Location" source="location" />
    <SelectInput
      label="Status"
      source="status"
      choices={[
        { id: "DRAFT", name: "Draft" },
        { id: "REGISTRATION", name: "Registration" },
        { id: "READY", name: "Ready" },
        { id: "ONGOING", name: "Ongoing" },
        { id: "COMPLETED", name: "Completed" },
        { id: "CANCELLED", name: "Cancelled" },
      ]}
    />
  </Filter>
);

export default EventFilter;
