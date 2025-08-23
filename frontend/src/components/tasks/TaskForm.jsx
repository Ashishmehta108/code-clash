import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createTask, getTask, updateTask } from '../../services/api';
import { Loader2, Save, X } from 'lucide-react';

export default function TaskForm() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 'medium',
    points: 100,
    timeLimit: 5,
    memoryLimit: 128,
    testCases: [{ input: '', output: '' }],
    starterCode: {
      javascript: 'function solution(input) {\n  // Your code here\n  return input;\n}',
      python: 'def solution(input):\n    # Your code here\n    return input',
      java: 'public class Solution {\n    public static Object solution(Object input) {\n        // Your code here\n        return input;\n    }\n}'
    },
    solution: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditMode) {
      fetchTask();
    }
  }, [id]);

  const fetchTask = async () => {
    try {
      setLoading(true);
      const response = await getTask(id);
      setFormData(prev => ({
        ...response.data,
        testCases: response.data.testCases?.length ? response.data.testCases : [{ input: '', output: '' }]
      }));
    } catch (err) {
      setError('Failed to fetch task');
      console.error('Error fetching task:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTestCaseChange = (index, field, value) => {
    const newTestCases = [...formData.testCases];
    newTestCases[index][field] = value;
    setFormData(prev => ({
      ...prev,
      testCases: newTestCases
    }));
  };

  const addTestCase = () => {
    setFormData(prev => ({
      ...prev,
      testCases: [...prev.testCases, { input: '', output: '' }]
    }));
  };

  const removeTestCase = (index) => {
    if (formData.testCases.length > 1) {
      const newTestCases = formData.testCases.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        testCases: newTestCases
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isEditMode) {
        await updateTask(id, formData);
      } else {
        await createTask(formData);
      }
      navigate('/admin/tasks');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save task');
      console.error('Error saving task:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin h-8 w-8 text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {isEditMode ? 'Edit Task' : 'Create New Task'}
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          {isEditMode ? 'Update the task details below.' : 'Fill in the details to create a new task.'}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 001.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">
              Difficulty <span className="text-red-500">*</span>
            </label>
            <select
              id="difficulty"
              name="difficulty"
              required
              value={formData.difficulty}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 bg-white rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div>
            <label htmlFor="points" className="block text-sm font-medium text-gray-700">
              Points
            </label>
            <input
              type="number"
              id="points"
              name="points"
              min="1"
              value={formData.points}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="timeLimit" className="block text-sm font-medium text-gray-700">
              Time Limit (seconds)
            </label>
            <input
              type="number"
              id="timeLimit"
              name="timeLimit"
              min="1"
              value={formData.timeLimit}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description <span className="text-red-500">*</span>
          </label>
          <div className="mt-1">
            <textarea
              id="description"
              name="description"
              rows={4}
              required
              value={formData.description}
              onChange={handleChange}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full border border-gray-300 rounded-md sm:text-sm"
              placeholder="Provide a clear description of the task..."
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Test Cases</h3>
            <button
              type="button"
              onClick={addTestCase}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Test Case
            </button>
          </div>
          <div className="mt-4 space-y-4">
            {formData.testCases.map((testCase, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-md">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Input {index + 1}
                  </label>
                  <textarea
                    value={testCase.input}
                    onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full border border-gray-300 rounded-md sm:text-sm"
                    rows={2}
                    placeholder="Test input"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Expected Output {index + 1}
                    </label>
                    {formData.testCases.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTestCase(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <textarea
                    value={testCase.output}
                    onChange={(e) => handleTestCaseChange(index, 'output', e.target.value)}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full border border-gray-300 rounded-md sm:text-sm"
                    rows={2}
                    placeholder="Expected output"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Starter Code</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">JavaScript</label>
              <textarea
                value={formData.starterCode.javascript}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  starterCode: { ...prev.starterCode, javascript: e.target.value }
                }))}
                className="font-mono text-sm shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full border border-gray-300 rounded-md p-2"
                rows={8}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Python</label>
              <textarea
                value={formData.starterCode.python}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  starterCode: { ...prev.starterCode, python: e.target.value }
                }))}
                className="font-mono text-sm shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full border border-gray-300 rounded-md p-2"
                rows={8}
              />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="solution" className="block text-sm font-medium text-gray-700">
            Solution
          </label>
          <div className="mt-1">
            <textarea
              id="solution"
              name="solution"
              rows={6}
              value={formData.solution}
              onChange={handleChange}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full border border-gray-300 rounded-md sm:text-sm"
              placeholder="Provide a solution explanation..."
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={() => navigate('/admin/tasks')}
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                Saving...
              </>
            ) : (
              <>
                <Save className="-ml-1 mr-2 h-4 w-4" />
                {isEditMode ? 'Update Task' : 'Create Task'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
