import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getTaskApi } from "../../api/tasks";
import { createSubmissionApi } from "../../api/submissions";
// import Editor from "@monaco-editor/react"; // optional

export default function TaskDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const [task, setTask] = useState(null);
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
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
      console.log("code",code)
      await createSubmissionApi({ task: id, codeLink:code });
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
    <div className="space-y-5">
      <div className="bg-white border rounded-xl p-5">
        <div className="flex items-center gap-4">
          {task.assets?.image && (
            <img src={task.assets.image} className="h-16 w-16 object-cover rounded-lg" />
          )}
          <div>
            <h1 className="text-2xl font-bold">{task.title}</h1>
            <p className="text-sm text-gray-500">{task.points ?? 10} pts • {task.difficulty}</p>
          </div>
        </div>
        <div className="mt-4 whitespace-pre-wrap text-gray-800" style={font}>
          {task.description}
        </div>
        {Array.isArray(task.dependencies) && task.dependencies.length > 0 && (
          <div className="mt-3">
            <h3 className="text-sm font-semibold">Dependencies</h3>
            <ul className="list-disc list-inside text-sm text-gray-700">
              {task.dependencies.map((d,i)=><li key={i}>{d}</li>)}
            </ul>
          </div>
        )}
      </div>

      <div className="bg-white border rounded-xl p-5 space-y-3">
        <div className="flex items-center gap-3">
          <label className="text-sm">solve</label>
          {/* <select value={language} onChange={e=>setLanguage(e.target.value)}
            className="border rounded px-2 py-1">
            <option>javascript</option>
            <option>python</option>
            <option>cpp</option>
            <option>java</option>
          </select> */}
          <Link className="ml-auto text-sm text-blue-600" to={`/task/${id}/submissions`}>View my submissions</Link>
        </div>

        {/* Simple textarea editor (swap with Monaco if you like) */}
        {/* <textarea value={code} onChange={e=>setCode(e.target.value)}
          placeholder="// write your solution here"
          className="w-full h-64 border rounded-lg p-3 font-mono text-sm"></textarea> */}
<label for="code">github repo link here</label>
          <input className="border border-black" id="code" value={code} onChange={e=>setCode(e.target.value)}></input>

        {/* Monaco version:
        <Editor height="350px" language={language === 'cpp' ? 'cpp' : language}
          value={code} onChange={(v)=>setCode(v ?? '')} />
        */}

        {err && <p className="text-red-600 text-sm">{err}</p>}
        <button disabled={submitting}
          onClick={submit}
          className="px-4 py-2 rounded bg-blue-600 text-black disabled:opacity-50">
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
}

