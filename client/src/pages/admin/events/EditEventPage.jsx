// src/pages/admin/events/EditEventPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEventById, updateEvent } from "../../../services/admin/event/eventService";
import EditEventForm from "../../../components/admin/EventList/EditEventForm";
import { showErrorAlert } from "../../../utils/admin/errorHandler";

// Radix UI imports
import * as Toast from "@radix-ui/react-toast";
import * as Dialog from "@radix-ui/react-dialog";

const EditEventPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState({});
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: "", type: "success" });
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  useEffect(() => {
    loadEvent();
  }, [id]);

  const loadEvent = async () => {
    try {
      const response = await getEventById(id);
      if (response.success) {
        const formatDateTime = (dateString) => {
          if (!dateString) return "";
          const date = new Date(dateString);
          return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
            .toISOString()
            .slice(0, 19);
        };

        setEvent({
          ...response.event,
          startAt: formatDateTime(response.event.startAt),
          endAt: formatDateTime(response.event.endAt),
          registrationStartAt: formatDateTime(response.event.registrationStartAt),
          registrationEndAt: formatDateTime(response.event.registrationEndAt),
        });
      }
    } catch (err) {
      showErrorAlert(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === "deposit") {
      const raw = value.replace(/\D/g, "");
      value = raw ? parseInt(raw) : "";
    }
    setEvent({ ...event, [name]: value });
  };

  const formatDeposit = (value) => {
    if (!value) return "";
    return new Intl.NumberFormat("vi-VN").format(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!event.title?.trim()) {
      setToast({ open: true, message: "Event title is required", type: "error" });
      return;
    }

    if (event.startAt && event.endAt && new Date(event.startAt) >= new Date(event.endAt)) {
      setToast({ open: true, message: "Start time must be before end time", type: "error" });
      return;
    }

    if (event.registrationStartAt && event.registrationEndAt &&
        new Date(event.registrationStartAt) >= new Date(event.registrationEndAt)) {
      setToast({ open: true, message: "Registration start must be before registration end", type: "error" });
      return;
    }

    try {
      const payload = {
        ...event,
        minAttendees: event.minAttendees ? parseInt(event.minAttendees) : null,
        maxAttendees: event.maxAttendees ? parseInt(event.maxAttendees) : null,
        deposit: event.deposit ? parseFloat(event.deposit) : 0.0,
        startAt: event.startAt ? new Date(event.startAt).toISOString() : null,
        endAt: event.endAt ? new Date(event.endAt).toISOString() : null,
        registrationStartAt: event.registrationStartAt ? new Date(event.registrationStartAt).toISOString() : null,
        registrationEndAt: event.registrationEndAt ? new Date(event.registrationEndAt).toISOString() : null,
      };

      const response = await updateEvent(id, payload);
      if (response.success) {
        setToast({ open: true, message: "Event updated successfully!", type: "success" });
        setTimeout(() => navigate("/admin/events/list"), 1200);
      } else {
        setToast({ open: true, message: `Update failed: ${response.message || "Unknown error"}`, type: "error" });
      }
    } catch (err) {
      showErrorAlert(err);
    }
  };

  const handleCancelEvent = async () => {
    try {
      const payload = { ...event, status: "CANCELLED" };
      const response = await updateEvent(id, payload);
      if (response.success) {
        setEvent({ ...event, status: "CANCELLED" });
        setToast({ open: true, message: "Event cancelled successfully!", type: "success" });
      } else {
        setToast({ open: true, message: `Cancel failed: ${response.message || "Unknown error"}`, type: "error" });
      }
    } catch (err) {
      showErrorAlert(err);
    } finally {
      setCancelDialogOpen(false);
    }
  };

  if (loading) return <div className="text-center p-8 text-gray-500">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center pt-12 px-4">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-8">
        <h1 className="text-3xl font-extrabold text-blue-900 mb-6 text-center">
          Edit Event
        </h1>

        <EditEventForm
          event={{ ...event, deposit: formatDeposit(event.deposit) }}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={() => setCancelDialogOpen(true)}
        />

        <div className="mt-6 flex gap-4">
          <button
            onClick={() => navigate("/admin/events/list")}
            className="flex-1 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition"
          >
            Back to Event List
          </button>
        </div>
      </div>

      {/* Radix Toast */}
      <Toast.Provider swipeDirection="right">
        <Toast.Root
          open={toast.open}
          onOpenChange={(open) => setToast({ ...toast, open })}
          className={`fixed bottom-6 right-6 p-4 rounded-lg shadow-md border ${
            toast.type === "success"
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-red-50 text-red-700 border-red-200"
          }`}
        >
          <Toast.Title className="font-bold">{toast.message}</Toast.Title>
          <Toast.Close className="absolute top-2 right-2 text-gray-500 cursor-pointer">✕</Toast.Close>
        </Toast.Root>
        <Toast.Viewport />
      </Toast.Provider>

      {/* Radix Dialog for cancel */}
      <Dialog.Root open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <Dialog.Overlay className="fixed inset-0 bg-black/30" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-xl shadow-lg w-96">
          <Dialog.Title className="text-xl font-bold mb-4">Cancel Event?</Dialog.Title>
          <Dialog.Description className="mb-6">This action cannot be undone. Are you sure?</Dialog.Description>
          <div className="flex justify-end gap-4">
            <button
              onClick={() => setCancelDialogOpen(false)}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            >
              No
            </button>
            <button
              onClick={handleCancelEvent}
              className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
            >
              Yes, Cancel
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  );
};

export default EditEventPage;
