import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getTask, getSubmission } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { ArrowUpRight, Code, Clock } from 'lucide-react';

export default function Task() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [userSubmissions, setUserSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTaskAndSubmissions = async () => {
      try {
        const [taskRes, submissionsRes] = await Promise.all([
          getTask(id),
          getSubmission(id)
        ]);

        setTask(taskRes.data);
        setUserSubmissions(submissionsRes.data);

        // Set initial code from the last submission or use the starter code
        if (submissionsRes.data.length > 0) {
          const lastSubmission = submissionsRes.data[0];
          setCode(lastSubmission.code);
          setLanguage(lastSubmission.language);
        } else if (taskRes.data.starterCode) {
          setCode(taskRes.data.starterCode[language] || '');
        }
      } catch (error) {
        console.error('Error fetching task:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTaskAndSubmissions();
  }, [id, language]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmissionStatus({ type: 'info', message: 'Submitting your solution...' });

      const submission = {
        task: id,
        code,
        language,
      };

      await submissions.create(submission);
      setSubmissionStatus({ type: 'success', message: 'Solution submitted successfully!' });

      // Refresh submissions
      const { data } = await submissions.getByTask(id);
      setUserSubmissions(data);
    } catch (error) {
      console.error('Submission failed:', error);
      setSubmissionStatus({
        type: 'error',
        message: error.response?.data?.message || 'Failed to submit solution',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Task not found</h2>
        <p className="text-gray-600 mb-6">The requested task could not be found or you don't have permission to view it.</p>
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center text-sm text-indigo-600 hover:text-indigo-900"
        >
          ← Back to challenges
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{task.title}</h1>
            <div className="flex items-center mt-2 text-sm text-gray-500">
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${task.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                task.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                {task.difficulty}
              </span>
              <span className="mx-2">•</span>
              <span className="flex items-center">
                <Code className="h-4 w-4 mr-1" />
                {task.points} points
              </span>
              {task.timeLimit && (
                <>
                  <span className="mx-2">•</span>
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {task.timeLimit} min
                  </span>
                </>
              )}
            </div>
          </div>
          <Link
            to={`/task/${id}/submit`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <ArrowUpRight className="-ml-1 mr-2 h-5 w-5" />
            Submit Solution
          </Link>
        </div>

        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: task.description }} />
        </div>

        {/* Code Editor */}
        <div className="border-t border-gray-200">
          <div className="px-4 py-5 sm:px-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Code Editor</h3>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="mt-1 block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
              </select>
            </div>

            <div className="mt-2">
              <textarea
                className="w-full h-96 font-mono text-sm p-4 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck="false"
                placeholder="Write your solution here..."
              />
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={handleSubmit}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Run Code
              </button>
            </div>
          </div>
        </div>

        {submissionStatus && (
          <div className={`p-4 mx-4 mb-4 rounded-md ${submissionStatus.type === 'error' ? 'bg-red-50 text-red-700' :
              submissionStatus.type === 'success' ? 'bg-green-50 text-green-700' :
                'bg-blue-50 text-blue-700'
            }`}>
            {submissionStatus.message}
          </div>
        )}

        {/* Submissions History */}
        {userSubmissions.length > 0 && (
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Your Submissions</h3>
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Language
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Score
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {userSubmissions.map((submission) => (
                    <tr key={submission._id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setCode(submission.code)}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(submission.submittedAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {submission.language}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${submission.status === 'accepted' ? 'bg-green-100 text-green-800' :
                            submission.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                          }`}>
                          {submission.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {submission.score || 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div >
    </div >
  );
}
