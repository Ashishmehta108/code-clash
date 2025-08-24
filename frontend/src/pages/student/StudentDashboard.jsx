import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTasksApi } from "../../api/tasks";

const badge = (d) => ({
  easy: "bg-green-100 text-green-700",
  medium: "bg-yellow-100 text-yellow-700",
  hard: "bg-red-100 text-red-700",
}[d] || "bg-gray-100 text-gray-700");

export default function StudentDashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=> {
    (async () => {
      const { data } = await getTasksApi();
      setTasks(data?.data || []);
      setLoading(false);
    })();
  }, []);

  if (loading) return <div>Loading tasks...</div>;

  return (
<div>
  <h1 className="text-2xl font-bold mb-4">All Tasks</h1>
  <div className="grid md:grid-cols-2 gap-4">
    {tasks.map(t => (
      <Link
        to={`/task/${t._id}`}
        key={t._id}
        className="block bg-white border rounded-xl p-5 hover:shadow"
      >
    <img className="h-40" src={t.uiImage} alt="task_image"/>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{t.title}</h2>
          <span
            className={`text-xs px-2 py-1 rounded ${badge(t.difficulty)}`}
          >
            {t.difficulty}
          </span>
        </div>

        <p className="text-sm text-gray-600 mt-2 line-clamp-3">
          {t.description}
        </p>
        <div className="text-xs text-gray-500 mt-3">{t.points ?? 10} pts</div>


      </Link>
    ))}
  </div>
</div>

  );
}

