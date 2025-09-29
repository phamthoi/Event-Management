import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEventById, updateEvent } from '../../../services/admin/event/eventService';
import EditEventForm from '../../../components/admin/EventList/EditEventForm';
import { validateEventForm } from '../../../utils/validation';
import { showErrorAlert } from '../../../utils/admin/errorHandler';

const EditEventPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState({});
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    loadEvent();
  }, [id]);

  const loadEvent = async () => {
    try {
      const response = await getEventById(id);

      if (response.success) {
        const formatDateTime = (dateString) => {
          if (!dateString) return '';
          const date = new Date(dateString);
          
          const localISOTime = new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
            .toISOString()
            .slice(0, 19);
          
          return localISOTime;
        };
        
        const eventData = {
          ...response.event,
          startAt: formatDateTime(response.event.startAt),
          endAt: formatDateTime(response.event.endAt),
          registrationStartAt: formatDateTime(response.event.registrationStartAt),
          registrationEndAt: formatDateTime(response.event.registrationEndAt),
        };
        

        setEvent(eventData);
      }
      setLoading(false);
    } catch (err) {
      showErrorAlert(err);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setEvent({ ...event, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');

    if (!event.title?.trim()) {
      setMsg('Event title is required');
      return;
    }

    if (event.startAt && event.endAt && new Date(event.startAt) >= new Date(event.endAt)) {
      setMsg('Start time must be before end time');
      return;
    }

    if (event.registrationStartAt && event.registrationEndAt && 
        new Date(event.registrationStartAt) >= new Date(event.registrationEndAt)) {
      setMsg('Registration start time must be before registration end time');
      return;
    }

    if (event.minAttendees && event.maxAttendees && 
        parseInt(event.minAttendees) > parseInt(event.maxAttendees)) {
      setMsg('Minimum attendees cannot be greater than maximum attendees');
      return;
    }

    try {
      const payload = {
        ...event,
        minAttendees: event.minAttendees ? parseInt(event.minAttendees) : null,
        maxAttendees: event.maxAttendees ? parseInt(event.maxAttendees) : null,
        deposit: event.deposit ? parseFloat(event.deposit) : 0.0,

        registrationStartAt: event.registrationStartAt ? new Date(event.registrationStartAt).toISOString() : null,
        registrationEndAt: event.registrationEndAt ? new Date(event.registrationEndAt).toISOString() : null,
        startAt: event.startAt ? new Date(event.startAt).toISOString(): null,
        endAt: event.endAt ? new Date(event.endAt).toISOString() : null
      };

      const response = await updateEvent(id, payload);
      if (response.success) {
        setMsg('Event updated successfully!');
        setTimeout(() => navigate('/admin/events/list'), 2000);
      } else {
        setMsg('Update failed: ' + (response.message || 'Unknown error'));
      }
    } catch (err) {
      console.error('Error updating event:', err);
      showErrorAlert(err);
    }
  };

  const handleCancel = async () => {
    if (window.confirm('Are you sure you want to cancel this event? This action cannot be undone.')) {
      try {
        const payload = {
          ...event,
          status: 'CANCELLED'
        };

        const response = await updateEvent(id, payload);
        if (response.success) {
          setMsg('Event cancelled successfully!');
          setEvent({ ...event, status: 'CANCELLED' });
        } else {
          setMsg('Cancel failed: ' + (response.message || 'Unknown error'));
        }
      } catch (err) {
        console.error('Error cancelling event:', err);
        showErrorAlert(err);
      }
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6">Edit Event</h1>
        
        <EditEventForm 
          event={event}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
        
        {msg && (
          <div className={`mt-4 text-center font-semibold ${
            msg.includes('successfully') ? 'text-green-700' : 'text-red-600'
          }`}>
            {msg}
          </div>
        )}
        
        <button
          onClick={() => navigate('/admin/events/list')}
          className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Back to Event List
        </button>
      </div>
    </div>
  );
};

export default EditEventPage;
