//client/src/components/CreateEvent/CreateEventForm.jsx
import React, {useState} from 'react';
import { createEvent } from '../../../services/admin/event/eventService';
import { validateEventForm } from '../../../utils/validation';
import "./CreateEventForm.css" 
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

    //add state for msg
    const [msg, setMsg] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.id]: e.target.value});
    };

    const handleSubmit = async (e) =>{
        e.preventDefault();
        setMsg("");


        //function to handle time, min and max attendees
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
            });
        } catch(err){
            setMsg(`${err.response?.data?.message || err.message}`);
        }
    };
    return (
    <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Create Event</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">Event name</label>
          <input
            type="text"
            id="title"
            value={form.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            id="description"
            value={form.description}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <input
            type="text"
            id="location"
            value={form.location}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Min attendees</label>
            <input
              type="number"
              id="minAttendees"
              value={form.minAttendees}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Max attendees</label>
            <input
              type="number"
              id="maxAttendees"
              value={form.maxAttendees}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Deposit (VND)</label>
          <input
            type="number"
            id="deposit"
            value={form.deposit}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            step="0.01"
            min="0"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Event start</label>
            <input
              type="datetime-local"
              id="startAt"
              value={form.startAt}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Event end</label>
            <input
              type="datetime-local"
              id="endAt"
              value={form.endAt}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Registration start</label>
            <input
              type="datetime-local"
              id="registrationStartAt"
              value={form.registrationStartAt}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Registration end</label>
            <input
              type="datetime-local"
              id="registrationEndAt"
              value={form.registrationEndAt}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-semibold transition"
        >
          Create Event
        </button>
      </form>

      {msg && <div className="mt-2 text-sm text-center">{msg}</div>}
    </div>
  );
};

export default CreateEventForm;