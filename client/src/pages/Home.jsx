import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';
import EventCard from '../components/EventCard';
import OpportunityCard from '../components/OpportunityCard';
import { HiCalendar, HiBriefcase, HiUserGroup, HiArrowRight } from 'react-icons/hi';

export default function Home() {
  const [stats, setStats] = useState(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [recentOpps, setRecentOpps] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsRes, oppsRes] = await Promise.all([
          API.get('/events?limit=3'),
          API.get('/opportunities?limit=3'),
        ]);
        setUpcomingEvents(eventsRes.data.events);
        setRecentOpps(oppsRes.data.opportunities);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Events & Opportunities
              <span className="block text-indigo-200 mt-2">Management System</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-indigo-100 leading-relaxed">
              Your university hub for discovering events, internships, scholarships, and career opportunities.
              Stay connected, stay ahead.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/events" className="px-8 py-3 bg-white text-indigo-700 font-semibold rounded-xl hover:bg-indigo-50 transition-colors shadow-lg">
                Browse Events
              </Link>
              <Link to="/opportunities" className="px-8 py-3 bg-indigo-500 text-white font-semibold rounded-xl hover:bg-indigo-400 transition-colors border border-indigo-400">
                View Opportunities
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6 flex items-start space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
              <HiCalendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Campus Events</h3>
              <p className="text-sm text-gray-500 mt-1">Workshops, seminars, conferences, and more. Never miss what matters.</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 flex items-start space-x-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
              <HiBriefcase className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Career Opportunities</h3>
              <p className="text-sm text-gray-500 mt-1">Jobs, internships, scholarships, and fellowships all in one place.</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 flex items-start space-x-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center shrink-0">
              <HiUserGroup className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Easy Registration</h3>
              <p className="text-sm text-gray-500 mt-1">Register for events and apply to opportunities with just a click.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Upcoming Events</h2>
          <Link to="/events" className="flex items-center text-indigo-600 hover:text-indigo-700 font-medium text-sm">
            View All <HiArrowRight className="ml-1 w-4 h-4" />
          </Link>
        </div>
        {upcomingEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-12">No upcoming events at the moment.</p>
        )}
      </section>

      {/* Recent Opportunities */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Latest Opportunities</h2>
          <Link to="/opportunities" className="flex items-center text-indigo-600 hover:text-indigo-700 font-medium text-sm">
            View All <HiArrowRight className="ml-1 w-4 h-4" />
          </Link>
        </div>
        {recentOpps.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentOpps.map((opp) => (
              <OpportunityCard key={opp.id} opportunity={opp} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-12">No opportunities available at the moment.</p>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm">&copy; 2026 EOMS - Events & Opportunities Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
