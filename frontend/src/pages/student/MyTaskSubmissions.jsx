import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSubmissionsForTaskApi } from "../../api/submissions";
import { useAuth } from "../../context/AuthContext";

export default function MyTaskSubmissions() {
  const { id } = useParams(); // taskId
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=> {
    (async () => {
      const { data } = await getSubmissionsForTaskApi(id);
      const all = data?.data || [];
      // Backend returns all submissions for task (not user-filtered)
      const mine = all.filter(s => (s.user?._id || s.user) === (user?._id || user?.id));
      setItems(mine);
      setLoading(false);
    })();
  }, [id, user]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-3">
      <h1 className="text-xl font-bold">My submissions</h1>
      {items.length === 0 && <div className="text-gray-600">No submissions yet.</div>}
      <ul className="space-y-3">
        {items.map(s => (
          <li key={s._id} className="bg-white border rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <div>
                  <p>code</p>
                  <p>{s.codeLink}</p>
                  <p>deployment</p>
                  <p>{s.deploymentLink}</p>
                </div>
                <div><span className="font-semibold">Status:</span> {s.status}</div>
                {"score" in s && <div><span className="font-semibold">Score:</span> {s.score}</div>}
                {/* {s.executionTime!=null && <div><span className="font-semibold">Time:</span> {s.executionTime} ms</div>} */}
                <div className="text-xs text-gray-500">Submitted: {new Date(s.createdAt).toLocaleString()}</div>
              </div>
            </div>
            {s.feedback && <div className="mt-2 text-sm text-gray-800"><span className="font-semibold">Feedback:</span> {s.feedback}</div>}
          </li>
        ))}
      </ul>
    </div>
  );
}

