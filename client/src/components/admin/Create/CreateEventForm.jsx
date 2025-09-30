// src/components/admin/events/CreateEventForm.jsx
import React, { useState } from "react";
import * as Select from "@radix-ui/react-select";
import * as Toast from "@radix-ui/react-toast";
import { createEvent } from "../../../services/admin/event/eventService";
import { validateEventForm } from "../../../utils/validation";
import { showErrorAlert } from "../../../utils/admin/errorHandler";
import { CheckIcon, ChevronDownIcon } from "@radix-ui/react-icons";

const CreateEventForm = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    minAttendees: "",
    maxAttendees: "",
    deposit: "",
    startAt: "",
    endAt: "",
    registrationStartAt: "",
    registrationEndAt: "",
  });
  const [loading, setLoading] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastSuccess, setToastSuccess] = useState(true);

  const formatCurrency = (value) => {
    if (!value) return "";
    return new Intl.NumberFormat("vi-VN").format(value);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleDepositChange = (e) => {
    const raw = e.target.value.replace(/\D/g, "");
    setForm({ ...form, deposit: raw ? parseInt(raw) : "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const validationError = validateEventForm(form);
    if (validationError) {
      setToastSuccess(false);
      setToastMsg(validationError);
      setToastOpen(true);
      setLoading(false);
      return;
    }

    try {
      const payload = {
        ...form,
        minAttendees: form.minAttendees ? parseInt(form.minAttendees) : null,
        maxAttendees: form.maxAttendees ? parseInt(form.maxAttendees) : null,
        deposit: form.deposit ? parseFloat(form.deposit) : 0.0,
        registrationStartAt: form.registrationStartAt
          ? new Date(form.registrationStartAt).toISOString()
          : null,
        registrationEndAt: form.registrationEndAt
          ? new Date(form.registrationEndAt).toISOString()
          : null,
        startAt: form.startAt ? new Date(form.startAt).toISOString() : null,
        endAt: form.endAt ? new Date(form.endAt).toISOString() : null,
      };

      const data = await createEvent(payload);
      setToastSuccess(true);
      setToastMsg(`Create event successful: ${data.event.title}`);
      setToastOpen(true);

      setForm({
        title: "",
        description: "",
        location: "",
        minAttendees: "",
        maxAttendees: "",
        deposit: "",
        startAt: "",
        endAt: "",
        registrationStartAt: "",
        registrationEndAt: "",
      });
    } catch (err) {
      showErrorAlert(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-gradient-to-r from-blue-50 to-blue-100 rounded-3xl shadow-2xl">
      <h2 className="text-3xl font-extrabold text-center text-blue-900 mb-8">
        Create Event
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold mb-2 text-blue-800">
            Event Name
          </label>
          <input
            type="text"
            id="title"
            value={form.title}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-blue-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-blue-800">
            Location
          </label>
          <input
            type="text"
            id="location"
            value={form.location}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-blue-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          />
        </div>

        {/* Date/Time */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-blue-800">
              Event Start
            </label>
            <input
              type="datetime-local"
              id="startAt"
              value={form.startAt}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-blue-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-blue-800">
              Event End
            </label>
            <input
              type="datetime-local"
              id="endAt"
              value={form.endAt}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-blue-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-blue-800">
              Registration Start
            </label>
            <input
              type="datetime-local"
              id="registrationStartAt"
              value={form.registrationStartAt}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-blue-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-blue-800">
              Registration End
            </label>
            <input
              type="datetime-local"
              id="registrationEndAt"
              value={form.registrationEndAt}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-blue-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            />
          </div>
        </div>

        {/* Attendees */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-blue-800">
              Min Attendees
            </label>
            <input
              type="number"
              id="minAttendees"
              value={form.minAttendees}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-blue-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-blue-800">
              Max Attendees
            </label>
            <input
              type="number"
              id="maxAttendees"
              value={form.maxAttendees}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-blue-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-blue-800">
            Deposit (VND)
          </label>
          <input
            type="text"
            id="deposit"
            value={formatCurrency(form.deposit)}
            onChange={handleDepositChange}
            className="w-full px-4 py-3 border border-blue-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-blue-800">
            Description
          </label>
          <textarea
            id="description"
            value={form.description}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-3 border border-blue-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-2xl font-bold shadow-lg transition transform hover:-translate-y-1 flex justify-center items-center ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {loading ? "Creating..." : "Create Event"}
        </button>
      </form>

      {/* Toast */}
      <Toast.Provider swipeDirection="right">
        <Toast.Root
          open={toastOpen}
          onOpenChange={setToastOpen}
          className={`bg-white rounded-xl shadow-lg p-4 border-l-4 ${
            toastSuccess ? "border-green-500" : "border-red-500"
          }`}
        >
          <Toast.Title className="font-semibold">{toastMsg}</Toast.Title>
        </Toast.Root>
        <Toast.Viewport className="fixed bottom-4 right-4 w-96" />
      </Toast.Provider>
    </div>
  );
};

export default CreateEventForm;
