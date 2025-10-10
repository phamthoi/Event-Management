import * as React from "react";
import { Filter, TextInput, SelectInput, DateInput } from "react-admin";

const EventFilter = (props: any) => (
  <Filter {...props}>
    <TextInput label="Event Name" source="name" alwaysOn />
    <TextInput label="Location" source="location" alwaysOn />
    
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
      alwaysOn
    />
  </Filter>
);

export default EventFilter;
