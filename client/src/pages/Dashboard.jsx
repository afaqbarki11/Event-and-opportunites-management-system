import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { HiCalendar, HiBriefcase, HiUsers, HiDocumentText, HiPlus, HiPencil, HiTrash } from 'react-icons/hi';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [myRegistrations, setMyRegistrations] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [tab, setTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  // Admin form states
  const [showEventForm, setShowEventForm] = useState(false);
  const [showOppForm, setShowOppForm] = useState(false);
  const [eventForm, setEventForm] = useState({ title: '', description: '', category: 'workshop', event_date: '', event_time: '', end_date: '', end_time: '', venue: '', max_participants: '' });
  const [oppForm, setOppForm] = useState({ title: '', description: '', type: 'internship', company: '', location: '', salary_range: '', deadline: '', requirements: '', contact_email: '', link: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dashRes = await API.get('/notifications/dashboard');
        setStats(dashRes.data.stats);

        if (user?.role === 'student') {
          const [regRes, appRes] = await Promise.all([
            API.get('/registrations/my'),
            API.get('/applications/my'),
          ]);
          setMyRegistrations(regRes.data.registrations);
          setMyApplications(appRes.data.applications);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      await API.post('/events', eventForm);
      toast.success('Event created!');
      setShowEventForm(false);
      setEventForm({ title: '', description: '', category: 'workshop', event_date: '', event_time: '', end_date: '', end_time: '', venue: '', max_participants: '' });
      const dashRes = await API.get('/notifications/dashboard');
      setStats(dashRes.data.stats);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create event.');
    }
  };

  const handleCreateOpp = async (e) => {
    e.preventDefault();
    try {
      await API.post('/opportunities', oppForm);
      toast.success('Opportunity created!');
      setShowOppForm(false);
      setOppForm({ title: '', description: '', type: 'internship', company: '', location: '', salary_range: '', deadline: '', requirements: '', contact_email: '', link: '' });
      const dashRes = await API.get('/notifications/dashboard');
      setStats(dashRes.data.stats);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create opportunity.');
    }
  };

  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const statusBadge = (status) => {
    const colors = {
      registered: 'bg-green-100 text-green-700',
      waitlisted: 'bg-yellow-100 text-yellow-700',
      cancelled: 'bg-red-100 text-red-700',
      attended: 'bg-blue-100 text-blue-700',
      pending: 'bg-yellow-100 text-yellow-700',
      reviewed: 'bg-blue-100 text-blue-700',
      shortlisted: 'bg-purple-100 text-purple-700',
      accepted: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${colors[status] || 'bg-gray-100 text-gray-700'}`}>
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {user?.role === 'admin' ? 'Admin Dashboard' : 'My Dashboard'}
          </h1>
          <p className="text-gray-500 mt-1">Welcome back, {user?.full_name}</p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Events</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total_events}</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <HiCalendar className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Opportunities</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total_opportunities}</p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <HiBriefcase className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Registrations</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total_registrations}</p>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <HiUsers className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Applications</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total_applications}</p>
                </div>
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <HiDocumentText className="w-5 h-5 text-orange-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Admin Section */}
        {user?.role === 'admin' && (
          <div className="space-y-6">
            <div className="flex gap-4">
              <button onClick={() => { setShowEventForm(!showEventForm); setShowOppForm(false); }}
                className="flex items-center px-4 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors">
                <HiPlus className="w-4 h-4 mr-2" /> Create Event
              </button>
              <button onClick={() => { setShowOppForm(!showOppForm); setShowEventForm(false); }}
                className="flex items-center px-4 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors">
                <HiPlus className="w-4 h-4 mr-2" /> Create Opportunity
              </button>
            </div>

            {showEventForm && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Event</h3>
                <form onSubmit={handleCreateEvent} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                    <input type="text" required value={eventForm.title} onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                    <textarea required rows={3} value={eventForm.description} onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select value={eventForm.category} onChange={(e) => setEventForm({...eventForm, category: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white">
                      <option value="workshop">Workshop</option>
                      <option value="seminar">Seminar</option>
                      <option value="conference">Conference</option>
                      <option value="competition">Competition</option>
                      <option value="cultural">Cultural</option>
                      <option value="sports">Sports</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Venue *</label>
                    <input type="text" required value={eventForm.venue} onChange={(e) => setEventForm({...eventForm, venue: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                    <input type="date" required value={eventForm.event_date} onChange={(e) => setEventForm({...eventForm, event_date: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Time *</label>
                    <input type="time" required value={eventForm.event_time} onChange={(e) => setEventForm({...eventForm, event_time: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input type="date" value={eventForm.end_date} onChange={(e) => setEventForm({...eventForm, end_date: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                    <input type="time" value={eventForm.end_time} onChange={(e) => setEventForm({...eventForm, end_time: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Participants</label>
                    <input type="number" value={eventForm.max_participants} onChange={(e) => setEventForm({...eventForm, max_participants: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" />
                  </div>
                  <div className="md:col-span-2 flex gap-3">
                    <button type="submit" className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors">Create Event</button>
                    <button type="button" onClick={() => setShowEventForm(false)} className="px-6 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors">Cancel</button>
                  </div>
                </form>
              </div>
            )}

            {showOppForm && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Opportunity</h3>
                <form onSubmit={handleCreateOpp} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                    <input type="text" required value={oppForm.title} onChange={(e) => setOppForm({...oppForm, title: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                    <textarea required rows={3} value={oppForm.description} onChange={(e) => setOppForm({...oppForm, description: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select value={oppForm.type} onChange={(e) => setOppForm({...oppForm, type: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white">
                      <option value="job">Job</option>
                      <option value="internship">Internship</option>
                      <option value="scholarship">Scholarship</option>
                      <option value="fellowship">Fellowship</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                    <input type="text" value={oppForm.company} onChange={(e) => setOppForm({...oppForm, company: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input type="text" value={oppForm.location} onChange={(e) => setOppForm({...oppForm, location: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Salary Range</label>
                    <input type="text" value={oppForm.salary_range} onChange={(e) => setOppForm({...oppForm, salary_range: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Deadline *</label>
                    <input type="date" required value={oppForm.deadline} onChange={(e) => setOppForm({...oppForm, deadline: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                    <input type="email" value={oppForm.contact_email} onChange={(e) => setOppForm({...oppForm, contact_email: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Requirements</label>
                    <textarea rows={3} value={oppForm.requirements} onChange={(e) => setOppForm({...oppForm, requirements: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" />
                  </div>
                  <div className="md:col-span-2 flex gap-3">
                    <button type="submit" className="px-6 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors">Create Opportunity</button>
                    <button type="button" onClick={() => setShowOppForm(false)} className="px-6 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors">Cancel</button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* Student Section */}
        {user?.role === 'student' && (
          <div>
            <div className="flex gap-2 mb-6">
              <button onClick={() => setTab('overview')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === 'overview' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}>
                Overview
              </button>
              <button onClick={() => setTab('registrations')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === 'registrations' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}>
                My Registrations
              </button>
              <button onClick={() => setTab('applications')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === 'applications' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}>
                My Applications
              </button>
            </div>

            {tab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Registrations</h3>
                  {myRegistrations.length > 0 ? (
                    <div className="space-y-3">
                      {myRegistrations.slice(0, 5).map((reg) => (
                        <Link key={reg.id} to={`/events/${reg.event_id}`} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{reg.title}</p>
                            <p className="text-xs text-gray-500">{formatDate(reg.event_date)}</p>
                          </div>
                          {statusBadge(reg.status)}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No registrations yet.</p>
                  )}
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Applications</h3>
                  {myApplications.length > 0 ? (
                    <div className="space-y-3">
                      {myApplications.slice(0, 5).map((app) => (
                        <Link key={app.id} to={`/opportunities/${app.opportunity_id}`} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{app.title}</p>
                            <p className="text-xs text-gray-500">{app.company}</p>
                          </div>
                          {statusBadge(app.status)}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No applications yet.</p>
                  )}
                </div>
              </div>
            )}

            {tab === 'registrations' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {myRegistrations.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Event</th>
                          <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Date</th>
                          <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Venue</th>
                          <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {myRegistrations.map((reg) => (
                          <tr key={reg.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <Link to={`/events/${reg.event_id}`} className="text-sm font-medium text-indigo-600 hover:underline">{reg.title}</Link>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">{formatDate(reg.event_date)}</td>
                            <td className="px-6 py-4 text-sm text-gray-500">{reg.venue}</td>
                            <td className="px-6 py-4">{statusBadge(reg.status)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No registrations yet.</p>
                    <Link to="/events" className="text-indigo-600 hover:underline text-sm mt-2 inline-block">Browse events</Link>
                  </div>
                )}
              </div>
            )}

            {tab === 'applications' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {myApplications.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Opportunity</th>
                          <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Company</th>
                          <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Type</th>
                          <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {myApplications.map((app) => (
                          <tr key={app.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <Link to={`/opportunities/${app.opportunity_id}`} className="text-sm font-medium text-indigo-600 hover:underline">{app.title}</Link>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">{app.company || '-'}</td>
                            <td className="px-6 py-4 text-sm text-gray-500 capitalize">{app.type}</td>
                            <td className="px-6 py-4">{statusBadge(app.status)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No applications yet.</p>
                    <Link to="/opportunities" className="text-indigo-600 hover:underline text-sm mt-2 inline-block">Browse opportunities</Link>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
