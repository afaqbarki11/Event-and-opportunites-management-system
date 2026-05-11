import { Link } from 'react-router-dom';
import { HiCalendar, HiLocationMarker, HiUsers, HiTag } from 'react-icons/hi';

const categoryColors = {
  workshop: 'bg-blue-100 text-blue-700',
  seminar: 'bg-purple-100 text-purple-700',
  conference: 'bg-green-100 text-green-700',
  competition: 'bg-orange-100 text-orange-700',
  cultural: 'bg-pink-100 text-pink-700',
  sports: 'bg-yellow-100 text-yellow-700',
  other: 'bg-gray-100 text-gray-700',
};

const statusColors = {
  upcoming: 'bg-emerald-100 text-emerald-700',
  ongoing: 'bg-blue-100 text-blue-700',
  completed: 'bg-gray-100 text-gray-600',
  cancelled: 'bg-red-100 text-red-700',
};

export default function EventCard({ event }) {
  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <Link to={`/events/${event.id}`} className="block group">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
        <div className="h-44 bg-gradient-to-br from-indigo-500 to-purple-600 relative">
          {event.image && (
            <img src={`/uploads/${event.image}`} alt={event.title} className="w-full h-full object-cover" />
          )}
          <div className="absolute top-3 left-3 flex gap-2">
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${categoryColors[event.category] || categoryColors.other}`}>
              {event.category}
            </span>
          </div>
          <div className="absolute top-3 right-3">
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[event.status]}`}>
              {event.status}
            </span>
          </div>
        </div>

        <div className="p-5">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
            {event.title}
          </h3>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{event.description}</p>

          <div className="mt-4 space-y-2">
            <div className="flex items-center text-sm text-gray-500">
              <HiCalendar className="w-4 h-4 mr-2 text-indigo-500" />
              {formatDate(event.event_date)}
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <HiLocationMarker className="w-4 h-4 mr-2 text-indigo-500" />
              <span className="truncate">{event.venue}</span>
            </div>
            {event.max_participants && (
              <div className="flex items-center text-sm text-gray-500">
                <HiUsers className="w-4 h-4 mr-2 text-indigo-500" />
                {event.registration_count || 0}/{event.max_participants} spots
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
