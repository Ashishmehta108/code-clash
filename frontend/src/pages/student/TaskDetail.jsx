import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getTaskApi } from "../../api/tasks";
import { createSubmissionApi } from "../../api/submissions";
import { DownloadIcon } from "lucide-react";
export default function TaskDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const [task, setTask] = useState(null);
  const [code, setCode] = useState("");
  const [deployment,setDeployment]=useState("")
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");



  useEffect(() => {
    (async () => {
      try {
        const { data } = await getTaskApi(id);
        setTask(data?.data || null);
      } catch {
        setErr("Failed to load task");
      }
    })();
  }, [id]);

  const submit = async () => {
    setErr("");
    setSubmitting(true);
    try {
      await createSubmissionApi({ task: id, codeLink: code });
      nav(`/task/${id}/submissions`);
    } catch (e) {
      setErr(e?.response?.data?.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (!task) return <div>Loading...</div>;

  const font = {
    fontSize: task.assets?.fontSize || undefined,
    fontFamily: task.assets?.fontFamily || undefined,
  };

  return (
    <div className="space-y-6 container max-w-3xl mx-auto">
      {/* Task Details */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md">
        <div className="flex items-center gap-4">
          {task.assets?.logo && (
            <div className="flex flex-col items-center">
              <img
                src={task.assets.logo}
                alt="logo"
                className="h-16 w-16 object-contain rounded-lg border border-gray-100"
              />
              <a
                href={task.assets.logo}
                download
                className="text-xs hover:underline mt-1"
              >
                <DownloadIcon className="w-4 h-4" />
              </a>
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold">{task.title}</h1>
            <p className="text-sm text-gray-500">
              {task.points ?? 10} pts • {task.difficulty}
            </p>
          </div>
        </div>

        <div className="mt-4 whitespace-pre-wrap text-gray-800" style={font}>
          {task.description}
        </div>

        {Array.isArray(task.dependencies) && task.dependencies.length > 0 && (
          <div className="mt-3">
            <h3 className="text-sm font-semibold">Dependencies</h3>
            <ul className="list-disc list-inside text-sm text-gray-700">
              {task.dependencies.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Images gallery */}
        {Array.isArray(task.assets?.images) && task.assets.images.length > 0 && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
            {task.assets.images.map((img, i) => (
              <div key={i} className="flex flex-col items-center">
                <img
                  src={img}
                  alt={`asset-${i}`}
                  className="w-full h-32 object-contain rounded-lg border border-gray-100"
                />
                <a
                  href={img}
                  download
                  className="text-xs hover:underline mt-1"
                >
                  <DownloadIcon className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submission Section */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Submit your solution</label>
          <Link
            className="text-sm text-blue-600 hover:underline"
            to={`/task/${id}/submissions`}
          >
            View my submissions
          </Link>
        </div>

        <input
          id="code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Paste your GitHub repo link here"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
        />

        {err && <p className="text-red-600 text-sm">{err}</p>}

        <button
          disabled={submitting}
          onClick={submit}
          className="w-full px-4 py-2 rounded-lg bg-blue-600 text-white font-medium disabled:opacity-50 hover:bg-blue-700 transition"
        >
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
}
