// src/components/events/EventActions.tsx
import * as React from "react";
import { useRecordContext, useDelete, useRefresh, useNotify, useGetIdentity } from "react-admin";
import { useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const EventActions = () => {
  const record = useRecordContext();
  const navigate = useNavigate();
  const notify = useNotify();
  const refresh = useRefresh();
  const [deleteOne] = useDelete();
  const { identity, isLoading } = useGetIdentity();

  if (!record || isLoading) return null;

  console.log("Current identity:", identity); // log để kiểm tra role

  const handleEdit = () => {
    navigate(`/events/${record.id}/edit`);
  };

  const handleDelete = () => {
    if (!identity || identity.role !== "ADMIN") {
      notify("You are not allowed to delete this event", { type: "warning" });
      return;
    }

    if (window.confirm("Are you sure you want to delete this event?")) {
      deleteOne(
        "events",
        { id: record.id, previousData: record },
        {
          onSuccess: () => {
            notify("Event deleted successfully", { type: "success" });
            refresh();
          },
          onError: (error: any) => {
            console.error("Delete error:", error); // log lỗi backend
            notify(`Error: ${error.message || error}`, { type: "error" });
          },
        }
      );
    }
  };

  return (
    <div style={{ display: "flex", gap: "0.5rem" }}>
      <IconButton color="primary" onClick={handleEdit} title="Edit">
        <EditIcon />
      </IconButton>
      {identity?.role === "ADMIN" && (
        <IconButton color="error" onClick={handleDelete} title="Delete">
          <DeleteIcon />
        </IconButton>
      )}
    </div>
  );
};

export default EventActions;
