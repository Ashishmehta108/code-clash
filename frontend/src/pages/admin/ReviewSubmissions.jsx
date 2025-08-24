import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getSubmissionsForTaskApi,
  updateSubmissionApi,
  deleteSubmissionApi,
} from "../../api/submissions";

export default function ReviewSubmissions() {
  const { id } = useParams(); // taskId
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const load = async () => {
    try {
      const { data } = await getSubmissionsForTaskApi(id);
      setSubs(data?.data || []);
    } catch (e) {
      setErr("Failed to load submissions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const save = async (sid, patch) => {
    await updateSubmissionApi(sid, patch);
    await load();
  };

  const remove = async (sid) => {
    if (!confirm("Delete this submission?")) return;
    await deleteSubmissionApi(sid);
    await load();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-3 text-black">
      <h1 className="text-2xl font-bold">Review Submissions</h1>
      {err && <p className="text-red-600">{err}</p>}

      {subs.length === 0 && (
        <div className="text-gray-600">No submissions yet.</div>
      )}

      <ul className="space-y-4">
        {subs.map((s) => (
          <li key={s._id} className="bg-white border rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <div>
                  <span className="font-semibold">User:</span>{" "}
                  {s.user?.username || s.user?.name || "N/A"} ({s.user?.email})
                </div>
                               <div>
                  <span className="font-semibold">code:</span> {s.codeLink}
                </div>
                               <div>
                  <span className="font-semibold">deployment Link:</span> {s.deploymentLink}
                </div>
                <div>
                  <span className="font-semibold">Status:</span> {s.status}
                </div>
                <div>
                  <span className="font-semibold">Score:</span> {s.score}
                </div>
                        <div>
                  <span className="font-semibold">feedback:</span> {s.feedback}
                </div>
                {s.executionTime != null && (
                  <div>
                    <span className="font-semibold">Time:</span>{" "}
                    {s.executionTime} ms
                  </div>
                )}
                <div className="text-xs text-gray-500">
                  Submitted: {new Date(s.createdAt).toLocaleString()}
                </div>
              </div>
              {/* <button
                className="text-red-600"
                onClick={() => remove(s._id)}
              >
                Delete
              </button> */}
            </div>

            <div className="grid md:grid-cols-3 gap-3 mt-3">
              <select
                className="border rounded px-2 py-1"
                value={s.status}
                onChange={(e) => save(s._id, { status: e.target.value })}
              >
                <option value="pending">pending</option>
                <option value="evaluating">evaluating</option>
                <option value="passed">passed</option>
                <option value="failed">failed</option>
              </select>
<label htmlFor="score">score</label>
              <input
                className="border rounded px-2 py-1"
                id="score"
                placeholder="Score (0-100)"
                type="number"
                value={s.score}
                onChange={(e) => save(s._id, { score: Number(e.target.value) })}
              />


            </div>

            <textarea
              className="w-full border rounded px-3 py-2 mt-3"
              rows="3"
              placeholder="Feedback"
              value={s.feedback || ""}
              onChange={(e) => save(s._id, { feedback: e.target.value })}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
