import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTaskApi } from "../../api/tasks";

export default function CreateTask() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    difficulty: "medium",
    points: 10,
    dependencies: "",
    logo: "",
    image: "",
    fontSize: "16px",
    fontFamily: "Arial, sans-serif",
  });
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const payload = {
        title: form.title,
        description: form.description,
        difficulty: form.difficulty,
        points: Number(form.points) || 10,
        dependencies: form.dependencies
          ? form.dependencies.split(",").map(s => s.trim()).filter(Boolean)
          : [],
        assets: {
          logo: form.logo || "",
          image: form.image || "",
          fontSize: form.fontSize || "16px",
          fontFamily: form.fontFamily || "Arial, sans-serif",
        },
      };
      await createTaskApi(payload);
      nav("/admin/dashboard");
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to create task");
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-4">Create Task</h1>
      {err && <p className="text-red-600 mb-3">{err}</p>}
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full border rounded px-3 py-2" placeholder="Title"
          value={form.title} onChange={e=>setForm({...form, title:e.target.value})}/>
        <textarea className="w-full border rounded px-3 py-2" rows="6" placeholder="Description"
          value={form.description} onChange={e=>setForm({...form, description:e.target.value})}/>
        <div className="grid grid-cols-2 gap-3">
          <select className="border rounded px-3 py-2"
            value={form.difficulty} onChange={e=>setForm({...form, difficulty:e.target.value})}>
            <option value="easy">easy</option>
            <option value="medium">medium</option>
            <option value="hard">hard</option>
          </select>
          <input className="border rounded px-3 py-2" placeholder="Points" type="number"
            value={form.points} onChange={e=>setForm({...form, points:e.target.value})}/>
        </div>
        <input className="w-full border rounded px-3 py-2" placeholder="Dependencies (comma-separated)"
          value={form.dependencies} onChange={e=>setForm({...form, dependencies:e.target.value})}/>
        <div className="grid grid-cols-2 gap-3">
          <input className="border rounded px-3 py-2" placeholder="Logo URL"
            value={form.logo} onChange={e=>setForm({...form, logo:e.target.value})}/>
          <input className="border rounded px-3 py-2" placeholder="Image URL"
            value={form.image} onChange={e=>setForm({...form, image:e.target.value})}/>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <input className="border rounded px-3 py-2" placeholder="Font Size (e.g., 16px)"
            value={form.fontSize} onChange={e=>setForm({...form, fontSize:e.target.value})}/>
          <input className="border rounded px-3 py-2" placeholder="Font Family"
            value={form.fontFamily} onChange={e=>setForm({...form, fontFamily:e.target.value})}/>
        </div>
        <button className="px-4 py-2 rounded bg-blue-600 text-black">Create</button>
      </form>
    </div>
  );
}

