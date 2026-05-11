import { Link } from 'react-router-dom';
import { HiOfficeBuilding, HiLocationMarker, HiClock, HiCurrencyDollar } from 'react-icons/hi';

const typeColors = {
  job: 'bg-green-100 text-green-700',
  internship: 'bg-blue-100 text-blue-700',
  scholarship: 'bg-yellow-100 text-yellow-700',
  fellowship: 'bg-purple-100 text-purple-700',
  other: 'bg-gray-100 text-gray-700',
};

export default function OpportunityCard({ opportunity }) {
  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const isExpired = new Date(opportunity.deadline) < new Date();

  return (
    <Link to={`/opportunities/${opportunity.id}`} className="block group">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
        <div className="p-5">
          <div className="flex items-start justify-between mb-3">
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${typeColors[opportunity.type] || typeColors.other}`}>
              {opportunity.type}
            </span>
            {isExpired ? (
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">Expired</span>
            ) : (
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">Open</span>
            )}
          </div>

          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
            {opportunity.title}
          </h3>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{opportunity.description}</p>

          <div className="mt-4 space-y-2">
            {opportunity.company && (
              <div className="flex items-center text-sm text-gray-500">
                <HiOfficeBuilding className="w-4 h-4 mr-2 text-indigo-500" />
                {opportunity.company}
              </div>
            )}
            {opportunity.location && (
              <div className="flex items-center text-sm text-gray-500">
                <HiLocationMarker className="w-4 h-4 mr-2 text-indigo-500" />
                {opportunity.location}
              </div>
            )}
            {opportunity.salary_range && (
              <div className="flex items-center text-sm text-gray-500">
                <HiCurrencyDollar className="w-4 h-4 mr-2 text-indigo-500" />
                {opportunity.salary_range}
              </div>
            )}
            <div className="flex items-center text-sm text-gray-500">
              <HiClock className="w-4 h-4 mr-2 text-indigo-500" />
              Deadline: {formatDate(opportunity.deadline)}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
