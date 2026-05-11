import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { HiCalendar, HiLocationMarker, HiUsers, HiClock, HiArrowLeft } from 'react-icons/hi';

export default function EventDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registered, setRegistered] = useState(false);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await API.get(`/events/${id}`);
        setEvent(res.data.event);

        if (user) {
          const regRes = await API.get(`/registrations/check/${id}`);
          setRegistered(regRes.data.registered);
        }
      } catch (err) {
        toast.error('Event not found.');
        navigate('/events');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id, user]);

  const handleRegister = async () => {
    if (!user) {
      toast.error('Please login to register.');
      navigate('/login');
      return;
    }
    setRegistering(true);
    try {
      const res = await API.post('/registrations', { event_id: parseInt(id) });
      toast.success(res.data.message);
      setRegistered(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed.');
    } finally {
      setRegistering(false);
    }
  };

  const handleCancel = async () => {
    setRegistering(true);
    try {
      await API.delete(`/registrations/${id}`);
      toast.success('Registration cancelled.');
      setRegistered(false);
    } catch (err) {
      toast.error('Failed to cancel registration.');
    } finally {
      setRegistering(false);
    }
  };

  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  const formatTime = (time) => {
    const [h, m] = time.split(':');
    const hour = parseInt(h);
    return `${hour > 12 ? hour - 12 : hour}:${m} ${hour >= 12 ? 'PM' : 'AM'}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!event) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={() => navigate('/events')} className="flex items-center text-gray-500 hover:text-gray-700 mb-6">
          <HiArrowLeft className="w-5 h-5 mr-1" /> Back to Events
        </button>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="h-64 bg-gradient-to-br from-indigo-500 to-purple-600 relative">
            {event.image && (
              <img src={`/uploads/${event.image}`} alt={event.title} className="w-full h-full object-cover" />
            )}
          </div>

          <div className="p-8">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-700 capitalize">
                {event.category}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                event.status === 'upcoming' ? 'bg-green-100 text-green-700' :
                event.status === 'ongoing' ? 'bg-blue-100 text-blue-700' :
                event.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {event.status}
              </span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.title}</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center text-gray-600">
                <HiCalendar className="w-5 h-5 mr-3 text-indigo-500" />
                <div>
                  <p className="font-medium">{formatDate(event.event_date)}</p>
                  {event.end_date && event.end_date !== event.event_date && (
                    <p className="text-sm text-gray-500">to {formatDate(event.end_date)}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center text-gray-600">
                <HiClock className="w-5 h-5 mr-3 text-indigo-500" />
                <p className="font-medium">
                  {formatTime(event.event_time)}
                  {event.end_time && ` - ${formatTime(event.end_time)}`}
                </p>
              </div>
              <div className="flex items-center text-gray-600">
                <HiLocationMarker className="w-5 h-5 mr-3 text-indigo-500" />
                <p className="font-medium">{event.venue}</p>
              </div>
              {event.max_participants && (
                <div className="flex items-center text-gray-600">
                  <HiUsers className="w-5 h-5 mr-3 text-indigo-500" />
                  <p className="font-medium">{event.registration_count}/{event.max_participants} registered</p>
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 pt-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">About this Event</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{event.description}</p>
            </div>

            {event.organizer_name && (
              <p className="text-sm text-gray-500 mb-6">Organized by: <span className="font-medium text-gray-700">{event.organizer_name}</span></p>
            )}

            {event.status === 'upcoming' && (
              <div className="flex gap-4">
                {registered ? (
                  <button
                    onClick={handleCancel}
                    disabled={registering}
                    className="px-6 py-3 bg-red-100 text-red-700 font-semibold rounded-xl hover:bg-red-200 transition-colors disabled:opacity-50"
                  >
                    {registering ? 'Processing...' : 'Cancel Registration'}
                  </button>
                ) : (
                  <button
                    onClick={handleRegister}
                    disabled={registering}
                    className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50"
                  >
                    {registering ? 'Processing...' : 'Register Now'}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
