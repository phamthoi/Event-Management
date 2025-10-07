import React from "react";
import { Select, MenuItem, InputLabel, FormControl } from "@mui/material";

interface EventSelectProps {
  events: { id: number; title: string }[];
  selectedEvent: number | null;
  onChange: (value: number) => void;
}

const EventSelect: React.FC<EventSelectProps> = ({
  events,
  selectedEvent,
  onChange,
}) => (
  <FormControl fullWidth>
    <InputLabel id="event-select-label">Chọn sự kiện</InputLabel>
    <Select
      labelId="event-select-label"
      value={selectedEvent ?? ""}
      onChange={(e) => onChange(Number(e.target.value))}
      label="Chọn sự kiện"
    >
      {events.map((ev) => (
        <MenuItem key={ev.id} value={ev.id}>
          {ev.title}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

export default EventSelect;
