import React, { useState, useEffect } from 'react';
import { createEvent } from '../../../services/admin/event/eventService';
import { validateEventForm } from '../../../utils/validation';
import { showErrorAlert } from '../../../utils/admin/errorHandler';

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
    status: "DRAFT", 
  });

  const [msg, setMsg] = useState("");

  const updateEventStatus = (formData = null) => {
    const currentForm = formData || form;
    const now = new Date();
    const registrationStart = new Date(currentForm.registrationStartAt);
    const registrationEnd = new Date(currentForm.registrationEndAt);
    const eventStart = new Date(currentForm.startAt);
    const eventEnd = new Date(currentForm.endAt);
    
    if (!currentForm.registrationStartAt || !currentForm.registrationEndAt || 
        !currentForm.startAt || !currentForm.endAt) {
      return;
    }
    
    const oneDayBeforeEvent = new Date(eventStart);
    oneDayBeforeEvent.setDate(oneDayBeforeEvent.getDate() - 1);
    
    let newStatus = "DRAFT"; 
    
    if (now > eventEnd) {
      newStatus = "COMPLETED";
    } else if (now >= eventStart && now <= eventEnd) {
      newStatus = "ONGOING";
    } else if (now >= oneDayBeforeEvent && now < eventStart) {
      newStatus = "READY";
    } else if (now >= registrationStart && now <= registrationEnd) {
      newStatus = "REGISTRATION";
    }
    
    if (newStatus !== currentForm.status) {
      setForm(prevForm => ({
        ...prevForm,
        status: newStatus
      }));
    }
  };
  
  useEffect(() => {
    updateEventStatus();
  }, []);
  
  useEffect(() => {
    if (form.registrationStartAt && form.registrationEndAt && 
        form.startAt && form.endAt) {
      updateEventStatus();
    }
  }, [form.registrationStartAt, form.registrationEndAt, form.startAt, form.endAt]);

  const handleChange = (e) => {
    const updatedForm = { ...form, [e.target.id]: e.target.value };
    setForm(updatedForm);
    
    const timeFields = ['registrationStartAt', 'registrationEndAt', 'startAt', 'endAt'];
    if (timeFields.includes(e.target.id)) {
      updateEventStatus(updatedForm);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    const validationError = validateEventForm(form);
    if (validationError) {
      setMsg(validationError);
      return;
    }

    try {
      const payload = {
        ...form,
        minAttendees: form.minAttendees ? parseInt(form.minAttendees) : null,
        maxAttendees: form.maxAttendees ? parseInt(form.maxAttendees) : null,
        deposit: form.deposit ? parseFloat(form.deposit) : 0.0,
      };

      const data = await createEvent(payload);

      setMsg(`Create event successful: ${data.event.title}`);
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
        status: "DRAFT",
      });
    } catch (err) {
      showErrorAlert(err);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-10 rounded-3xl shadow-2xl w-full max-w-lg">
      <h2 className="text-3xl font-extrabold mb-8 text-center text-blue-900">Create Event</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold mb-2 text-blue-800">Event name</label>
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
          <label className="block text-sm font-semibold mb-2 text-blue-800">Description</label>
          <textarea
            id="description"
            value={form.description}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-3 border border-blue-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-blue-800">Location</label>
          <input
            type="text"
            id="location"
            value={form.location}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-blue-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-blue-800">
            Event Status
            <span className="text-xs text-gray-500 ml-2">
              (Tự động cập nhật dựa trên thời gian)
            </span>
          </label>
          <select
            id="status"
            value={form.status}
            onChange={handleChange}
            disabled={true}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-gray-100 text-gray-600 cursor-not-allowed"
          >
            <option value="DRAFT">Draft</option>
            <option value="REGISTRATION">Registration Open</option>
            <option value="READY">Ready</option>
            <option value="ONGOING">Ongoing</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-blue-800">Min attendees</label>
            <input
              type="number"
              id="minAttendees"
              value={form.minAttendees}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-blue-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-blue-800">Max attendees</label>
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
          <label className="block text-sm font-semibold mb-2 text-blue-800">Deposit (VND)</label>
          <input
            type="number"
            id="deposit"
            value={form.deposit}
            onChange={handleChange}
            step="0.01"
            min="0"
            className="w-full px-4 py-3 border border-blue-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-blue-800">Event start</label>
            <input
              type="datetime-local"
              id="startAt"
              value={form.startAt}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-blue-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-blue-800">Event end</label>
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
            <label className="block text-sm font-semibold mb-2 text-blue-800">Registration start</label>
            <input
              type="datetime-local"
              id="registrationStartAt"
              value={form.registrationStartAt}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-blue-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-blue-800">Registration end</label>
            <input
              type="datetime-local"
              id="registrationEndAt"
              value={form.registrationEndAt}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-blue-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-bold shadow-lg transition transform hover:-translate-y-1"
        >
          Create Event
        </button>
      </form>

      {msg && (
        <div className={`mt-4 text-center font-semibold ${msg.includes('successful') ? 'text-green-700' : 'text-red-600'}`}>
          {msg}
        </div>
      )}
    </div>
  );
};

export default CreateEventForm;
