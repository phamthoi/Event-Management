import * as React from "react";
import { Filter, TextInput, SelectInput, useTranslate } from "react-admin";

const EventFilter = (props: any) => {
  const translate = useTranslate();
  return (
    <Filter {...props}>
      <TextInput label={translate("resources.events.fields.title")} source="name" alwaysOn />
      <TextInput label={translate("resources.events.fields.location")} source="location" alwaysOn />

      <SelectInput
        label={translate("resources.events.fields.status")}
        source="status"
        choices={[
          { id: "DRAFT", name: translate("resources.events.status.DRAFT") },
          { id: "REGISTRATION", name: translate("resources.events.status.REGISTRATION") },
          { id: "READY", name: translate("resources.events.status.READY") },
          { id: "ONGOING", name: translate("resources.events.status.ONGOING") },
          { id: "COMPLETED", name: translate("resources.events.status.COMPLETED") },
          { id: "CANCELLED", name: translate("resources.events.status.CANCELLED") },
        ]}
        alwaysOn
      />
    </Filter>
  );
};

export default EventFilter;
