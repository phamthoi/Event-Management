import React from "react";
import { Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import { useTranslate } from 'react-admin';

interface EventSelectProps {
  events: { id: number; title: string }[];
  selectedEvent: number | null;
  onChange: (value: number) => void;
}

const EventSelect: React.FC<EventSelectProps> = ({
  events,
  selectedEvent,
  onChange,
}) => {
  const translate = useTranslate();
  return (
  <FormControl fullWidth>
    <InputLabel id="event-select-label">{translate("custom.attendance.chooseEvent")}</InputLabel>
    <Select
      labelId="event-select-label"
      value={selectedEvent ?? ""}
      onChange={(e) => onChange(Number(e.target.value))}
      label={translate("custom.attendance.chooseEvent")}
    >
      {events.map((ev) => (
        <MenuItem key={ev.id} value={ev.id}>
          {ev.title}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
  );
};

export default EventSelect;
