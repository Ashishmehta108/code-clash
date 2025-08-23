import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSubmissions } from '../../services/api';
import { 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  Filter, 
  ChevronDown, 
  ExternalLink,
  Image as ImageIcon
} from 'lucide-react';
import { format } from 'date-fns';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

const statusIcons = {
  pending: <Clock className="h-4 w-4" />,
  approved: <CheckCircle2 className="h-4 w-4" />,
  rejected: <XCircle className="h-4 w-4" />,
};

export default function Submissions() {
  const [submissionList, setSubmissionList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
  });
  const [imagePreview, setImagePreview] = useState({
    url: null,
    isOpen: false,
  });

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await getSubmissions();
      setSubmissionList(response.data);
    } catch (err) {
      console.error('Error fetching submissions:', err);
      setError('Failed to fetch submissions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (submissionId, newStatus) => {
    try {
      await submissions.updateStatus(submissionId, { status: newStatus });
      setSubmissionList(submissionList.map(sub => 
        sub._id === submissionId ? { ...sub, status: newStatus } : sub
      ));
    } catch (err) {
      console.error('Error updating status:', err);
      setError('Failed to update submission status');
    }
  };

  const filteredSubmissions = submissionList.filter(submission => {
    const matchesStatus = filters.status === 'all' || submission.status === filters.status;
    const matchesSearch = submission.user?.username?.toLowerCase().includes(filters.search.toLowerCase()) ||
                         submission.task?.title?.toLowerCase().includes(filters.search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const openImagePreview = (url) => {
    setImagePreview({ url, isOpen: true });
  };

  const closeImagePreview = () => {
    setImagePreview({ url: null, isOpen: false });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin h-8 w-8 text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Submissions</h1>
        
        <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-3">
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by user or task..."
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
          
          <div className="relative">
            <select
              className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <XCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Task
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Submitted
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredSubmissions.length > 0 ? (
              filteredSubmissions.map((submission) => (
                <tr key={submission._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-600 font-medium">
                          {submission.user?.username?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {submission.user?.username || 'Unknown User'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {submission.user?.email || ''}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{submission.task?.title || 'Task Deleted'}</div>
                    <div className="text-sm text-gray-500">
                      {submission.task?.difficulty ? 
                        submission.task.difficulty.charAt(0).toUpperCase() + submission.task.difficulty.slice(1) : 
                        'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {submission.submittedAt ? format(new Date(submission.submittedAt), 'MMM d, yyyy HH:mm') : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[submission.status] || 'bg-gray-100 text-gray-800'}`}>
                      {statusIcons[submission.status] || <span className="h-4 w-4" />}
                      <span className="ml-1">
                        {submission.status ? submission.status.charAt(0).toUpperCase() + submission.status.slice(1) : 'Unknown'}
                      </span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => {
                          // Open a modal or expandable section with submission details
                          console.log('View submission:', submission);
                        }}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="View Details"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      
                      {submission.githubUrl && (
                        <a
                          href={submission.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-gray-900"
                          title="View on GitHub"
                        >
                          <ExternalLink className="h-5 w-5" />
                        </a>
                      )}
                      
                      {submission.screenshot && (
                        <button
                          onClick={() => openImagePreview(submission.screenshot)}
                          className="text-gray-600 hover:text-gray-900"
                          title="View Screenshot"
                        >
                          <ImageIcon className="h-5 w-5" />
                        </button>
                      )}
                      
                      <div className="relative inline-block text-left">
                        <select
                          className="appearance-none bg-white border border-gray-300 rounded-md pl-2 pr-6 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                          value={submission.status}
                          onChange={(e) => handleStatusUpdate(submission._id, e.target.value)}
                        >
                          <option value="pending">Pending</option>
                          <option value="approved">Approve</option>
                          <option value="rejected">Reject</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-gray-700">
                          <ChevronDown className="h-3 w-3" />
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                  No submissions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Image Preview Modal */}
      {imagePreview.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
          <div className="relative max-w-4xl max-h-[90vh] bg-white rounded-lg overflow-hidden">
            <button
              onClick={closeImagePreview}
              className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 focus:outline-none"
            >
              <XCircle className="h-6 w-6 text-gray-700" />
            </button>
            <img 
              src={imagePreview.url} 
              alt="Submission screenshot" 
              className="max-w-full max-h-[80vh] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
