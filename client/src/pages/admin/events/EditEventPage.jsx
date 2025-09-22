import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEventById, updateEvent } from '../../../services/admin/event/eventService';
import EditEventForm from '../../../components/admin/EventList/EditEventForm';
import { validateEventForm } from '../../../utils/validation';

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
      // const testTime = new Date("2025-10-05T01:00:00.000Z");
      // console.log("🪣  Test: " + testTime);
      // const formatted = testTime.toLocaleString('sv-SE', { hour12: false }).replace(' ', 'T');
      // console.log("🪣 Test (sau khi toLocaleString): " + formatted);
  
      console.log(`🪣[CLIENT → (page)] Event ID: ${id} | Dữ liệu nhận từ server:`, JSON.stringify({
        startAt: response.event?.startAt,
        endAt: response.event?.endAt,
      }, null, 2));
      
      if (response.success) {
        // Format dates for datetime-local input với đầy đủ giây
        const formatDateTime = (dateString) => {
          if (!dateString) return '';
          const date = new Date(dateString);
          
          // Chuyển về local timezone và format
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
        
        console.log('🪣 Formatted eventData:', eventData);
        setEvent(eventData);
      }
      setLoading(false);
    } catch (err) {
      setMsg('Error loading event: ' + err.message);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setEvent({ ...event, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');

    // Enhanced validation
    if (!event.title?.trim()) {
      setMsg('Tên event là bắt buộc');
      return;
    }

    if (event.startAt && event.endAt && new Date(event.startAt) >= new Date(event.endAt)) {
      setMsg('Thời gian bắt đầu phải trước thời gian kết thúc');
      return;
    }

    if (event.registrationStartAt && event.registrationEndAt && 
        new Date(event.registrationStartAt) >= new Date(event.registrationEndAt)) {
      setMsg('Thời gian bắt đầu đăng ký phải trước thời gian kết thúc đăng ký');
      return;
    }

    if (event.minAttendees && event.maxAttendees && 
        parseInt(event.minAttendees) > parseInt(event.maxAttendees)) {
      setMsg('Số lượng tối thiểu không được lớn hơn số lượng tối đa');
      return;
    }

    try {
      const payload = {
        ...event,
        minAttendees: event.minAttendees ? parseInt(event.minAttendees) : null,
        maxAttendees: event.maxAttendees ? parseInt(event.maxAttendees) : null,
        deposit: event.deposit ? parseFloat(event.deposit) : 0.0,
      };

      console.log(`🎉 [CLIENT SUBMIT(page)] Event ID: ${id} | Dữ liệu thời gian trước khi gửi lên server:`, JSON.stringify({
        startAt: payload.startAt,
        endAt: payload.endAt,
      }, null, 2));

      const response = await updateEvent(id, payload);
      if (response.success) {
        setMsg('Cập nhật event thành công!');
        setTimeout(() => navigate('/admin/events/list'), 2000);
      } else {
        setMsg('Cập nhật thất bại: ' + (response.message || 'Lỗi không xác định'));
      }
    } catch (err) {
      console.error('Error updating event:', err);
      setMsg('Lỗi: ' + (err.response?.data?.message || err.message));
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6">Edit Event</h1>
        
        <EditEventForm 
          event={event}
          onChange={handleChange}
          onSubmit={handleSubmit}
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
