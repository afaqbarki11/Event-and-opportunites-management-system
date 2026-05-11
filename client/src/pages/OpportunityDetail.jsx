import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { HiOfficeBuilding, HiLocationMarker, HiClock, HiCurrencyDollar, HiMail, HiExternalLink, HiArrowLeft } from 'react-icons/hi';

export default function OpportunityDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applied, setApplied] = useState(false);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [cvFile, setCvFile] = useState(null);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get(`/opportunities/${id}`);
        setOpportunity(res.data.opportunity);

        if (user) {
          const appRes = await API.get(`/applications/check/${id}`);
          setApplied(appRes.data.applied);
        }
      } catch (err) {
        toast.error('Opportunity not found.');
        navigate('/opportunities');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, user]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to apply.');
      navigate('/login');
      return;
    }
    setApplying(true);
    try {
      const formData = new FormData();
      formData.append('opportunity_id', id);
      if (coverLetter) formData.append('cover_letter', coverLetter);
      if (cvFile) formData.append('cv', cvFile);

      await API.post('/applications', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Application submitted successfully!');
      setApplied(true);
      setShowApplyForm(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Application failed.');
    } finally {
      setApplying(false);
    }
  };

  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!opportunity) return null;

  const isExpired = new Date(opportunity.deadline) < new Date();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={() => navigate('/opportunities')} className="flex items-center text-gray-500 hover:text-gray-700 mb-6">
          <HiArrowLeft className="w-5 h-5 mr-1" /> Back to Opportunities
        </button>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-8">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-700 capitalize">{opportunity.type}</span>
              {isExpired ? (
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700">Expired</span>
              ) : (
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">Open</span>
              )}
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-6">{opportunity.title}</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {opportunity.company && (
                <div className="flex items-center text-gray-600">
                  <HiOfficeBuilding className="w-5 h-5 mr-3 text-indigo-500" />
                  <p className="font-medium">{opportunity.company}</p>
                </div>
              )}
              {opportunity.location && (
                <div className="flex items-center text-gray-600">
                  <HiLocationMarker className="w-5 h-5 mr-3 text-indigo-500" />
                  <p className="font-medium">{opportunity.location}</p>
                </div>
              )}
              {opportunity.salary_range && (
                <div className="flex items-center text-gray-600">
                  <HiCurrencyDollar className="w-5 h-5 mr-3 text-indigo-500" />
                  <p className="font-medium">{opportunity.salary_range}</p>
                </div>
              )}
              <div className="flex items-center text-gray-600">
                <HiClock className="w-5 h-5 mr-3 text-indigo-500" />
                <p className="font-medium">Deadline: {formatDate(opportunity.deadline)}</p>
              </div>
              {opportunity.contact_email && (
                <div className="flex items-center text-gray-600">
                  <HiMail className="w-5 h-5 mr-3 text-indigo-500" />
                  <a href={`mailto:${opportunity.contact_email}`} className="font-medium text-indigo-600 hover:underline">{opportunity.contact_email}</a>
                </div>
              )}
              {opportunity.link && (
                <div className="flex items-center text-gray-600">
                  <HiExternalLink className="w-5 h-5 mr-3 text-indigo-500" />
                  <a href={opportunity.link} target="_blank" rel="noopener noreferrer" className="font-medium text-indigo-600 hover:underline">External Link</a>
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 pt-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{opportunity.description}</p>
            </div>

            {opportunity.requirements && (
              <div className="border-t border-gray-200 pt-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Requirements</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{opportunity.requirements}</p>
              </div>
            )}

            {!isExpired && opportunity.status === 'open' && (
              <div className="border-t border-gray-200 pt-6">
                {applied ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-700 font-medium">You have already applied for this opportunity.</p>
                  </div>
                ) : showApplyForm ? (
                  <form onSubmit={handleApply} className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Apply Now</h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Cover Letter</label>
                      <textarea
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                        rows={4}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        placeholder="Tell us why you're a great fit..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Upload CV (PDF, DOC, DOCX)</label>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => setCvFile(e.target.files[0])}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={applying}
                        className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50"
                      >
                        {applying ? 'Submitting...' : 'Submit Application'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowApplyForm(false)}
                        className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <button
                    onClick={() => { if (!user) { toast.error('Please login to apply.'); navigate('/login'); } else { setShowApplyForm(true); }}}
                    className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
                  >
                    Apply Now
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
