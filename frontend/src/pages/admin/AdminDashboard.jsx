import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getTasksApi, deleteTaskApi } from "../../api/tasks";

export default function AdminDashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  const load = async () => {
    const { data } = await getTasksApi();
    setTasks(data?.data || []);
    setLoading(false);
  };

  useEffect(()=> { load(); }, []);

  const del = async (id) => {
    if (!confirm("Delete this task (and related submissions)?")) return;
    await deleteTaskApi(id);
    await load();
  };

  if (loading) return <div>Loading...</div>;

  return (
  

    <div>

      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button onClick={() => nav("/admin/task/create")}
          className="px-4 py-2 rounded bg-blue-600 text-black"
        >
          Create Task
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {tasks.map(t => (
          <div key={t._id} className="bg-white border rounded-xl p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{t.title}</h2>
              <span className="text-xs text-gray-500">{t.points ?? 10} pts</span>
            </div>
            <p className="text-sm text-gray-600 mt-2 line-clamp-3">{t.description}</p>
            <div className="mt-4 flex items-center gap-3">
              <Link className="text-blue-600" to={`/admin/task/${t._id}/review`}>Review submissions</Link>
              <button onClick={() => del(t._id)} className="text-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>
    
</div>
  );
}

