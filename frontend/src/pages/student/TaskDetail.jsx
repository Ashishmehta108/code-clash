import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getTaskApi } from "../../api/tasks";
import { createSubmissionApi } from "../../api/submissions";
import Editor from "@monaco-editor/react";
import { LiveProvider, LiveEditor, LivePreview } from "react-live";
import React from 'react'

export default function TaskDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const [task, setTask] = useState(null);
  const [language, setLanguage] = useState("javascript");
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
      console.log("code",code)
      await createSubmissionApi({ task: id, codeLink:code,deploymentLink:deployment });
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
            <img className="h-40" src={task.uiImage} alt="task_image"/>
        <div className="flex items-center gap-4">

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
{/* Download Section */}
<div className="mt-4">
  <h2 className="text-sm font-medium mb-2">Download Files</h2>

  {/* Logo */}
  {task.assets?.logo && (
    <a
      href={task.assets.logo.replace("/upload/", "/upload/fl_attachment/")}
      className="block text-blue-600 underline"
    >
      Download Logo
    </a>
  )}

  {/* Images */}
  {Array.isArray(task.assets?.images) && task.assets.images.length > 0 && (
    <div className="space-y-1">
      {task.assets.images.map((img, idx) => (
        <a
          key={idx}
          href={img.replace("/upload/", "/upload/fl_attachment/")}
          className="block text-blue-600 underline"
        >
          Download Image {idx + 1}
        </a>
      ))}
    </div>
  )}
</div>

      </div>

      <div className="bg-white border rounded-xl p-5 space-y-3">
        <div className="flex items-center gap-3">
          <label className="text-sm">solve</label>

          <Link className="ml-auto text-sm text-blue-600" to={`/task/${id}/submissions`}>View my submissions</Link>
        </div>

        {/* Simple textarea editor (swap with Monaco if you like) */}
  
<label for="code">github repo link here</label>
          <input className="border border-black" id="code" value={code} onChange={e=>setCode(e.target.value)}></input>

          <label for="deployment">deployment link here</label>
          <input className="border border-black" id="deployment" value={deployment} onChange={e=>setDeployment(e.target.value)}></input>










  

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
