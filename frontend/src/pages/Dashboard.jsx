import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { getTasks, getMySubmissions } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export default function Dashboard() {
    const [taskList, setTaskList] = useState([]);
    const [userSubmissions, setUserSubmissions] = useState({});
    const [loading, setLoading] = useState(true);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const tasksRes = await getTasks();
                setTaskList(tasksRes.data);

                // Only fetch submissions if user is logged in
                if (user) {
                    try {
                        const submissionsRes = await getMySubmissions();
                        // Group submissions by task ID
                        const submissionsByTask = submissionsRes.data.reduce((acc, submission) => {
                            acc[submission.task] = acc[submission.task] || [];
                            acc[submission.task].push(submission);
                            return acc;
                        }, {});
                        setUserSubmissions(submissionsByTask);
                    } catch (error) {
                        console.error('Error fetching user submissions:', error);

                        setUserSubmissions({});
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleTaskClick = (taskId) => {
        navigate(`/task/${taskId}`);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (loading) {
        return <div className="text-center py-10">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <h1 className="text-xl font-bold text-indigo-600">CodeClash</h1>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <span className="text-sm text-gray-700 mr-4">
                                Welcome, {user?.name || 'User'}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="text-sm text-gray-500 hover:text-gray-700"
                            >
                                Sign out
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="py-10">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="px-4 py-6 sm:px-0">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Coding Challenges</h2>

                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {taskList.length > 0 && taskList.map((task) => (
                                <div
                                    key={task._id}
                                    className="bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:shadow-md transition-shadow"
                                    onClick={() => handleTaskClick(task._id)}
                                >
                                    <div className="px-4 py-5 sm:p-6">
                                        <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
                                        <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                                            {task.description}
                                        </p>
                                        <div className="mt-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                                {task.difficulty}
                                            </span>
                                            {userSubmissions[task._id] && (
                                                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    Submitted: {userSubmissions[task._id].length} time(s)
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
