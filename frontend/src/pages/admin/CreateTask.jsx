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
    fontSize: "16px",
    fontFamily: "Arial, sans-serif",
  });

  const [uiImage, setUiImage] = useState(null); // required UI image
  const [logo, setLogo] = useState(null); // optional logo
  const [images, setImages] = useState([]); // optional multiple images
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setErr("");


    if (!uiImage) {
      setErr("UI Image is required");
      return;
    }




    try {
      console.log("submit button hit")
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("difficulty", form.difficulty);
      formData.append("points", form.points);
  
      formData.append("fontSize", form.fontSize);
      formData.append("fontFamily", form.fontFamily);

      if (form.dependencies) {
      const depsArray = form.dependencies
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      depsArray.forEach((dep) => formData.append("dependencies[]", dep));
    }

      // Append files
      formData.append("uiImage", uiImage);
      if (logo) formData.append("logo", logo);
     
      images.forEach((img) => formData.append("images", img));

    for (let [key, value] of formData.entries()) {
  console.log(key, value);
}




      await createTaskApi(formData, true); // true = FormData

      nav("/admin/dashboard");
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to create task");
    }
  };

  return (
 <div className="space-y-3">
  <div>
    <label className="block font-semibold mb-1">Title</label>
    <input
      className="w-full border rounded px-3 py-2"
      placeholder="Enter task title"
      value={form.title}
      onChange={(e) => setForm({ ...form, title: e.target.value })}
    />
  </div>

  <div>
    <label className="block font-semibold mb-1">Description</label>
    <textarea
      className="w-full border rounded px-3 py-2"
      rows="6"
      placeholder="Enter task description"
      value={form.description}
      onChange={(e) => setForm({ ...form, description: e.target.value })}
    />
  </div>

  <div className="grid grid-cols-2 gap-3">
    <div>
      <label className="block font-semibold mb-1">Difficulty</label>
      <select
        className="border rounded px-3 py-2 w-full"
        value={form.difficulty}
        onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
      >
        <option value="easy">easy</option>
        <option value="medium">medium</option>
        <option value="hard">hard</option>
      </select>
    </div>

    <div>
      <label className="block font-semibold mb-1">Points</label>
      <input
        className="border rounded px-3 py-2 w-full"
        placeholder="10"
        type="number"
        value={form.points}
        onChange={(e) => setForm({ ...form, points: e.target.value })}
      />
    </div>
  </div>

  <div>
    <label className="block font-semibold mb-1">Dependencies</label>
    <input
      className="w-full border rounded px-3 py-2"
      placeholder="Comma-separated task IDs"
      value={form.dependencies}
      onChange={(e) => setForm({ ...form, dependencies: e.target.value })}
    />
  </div>

  <div>
    <label className="block font-semibold mb-1">UI Image</label>
    <input
      type="file"
      accept="image/*"
      onChange={(e) => setUiImage(e.target.files[0])}
    />
  </div>

  <div>
    <label className="block font-semibold mb-1">Logo (optional)</label>
    <input
      type="file"
      accept="image/*"
      onChange={(e) => setLogo(e.target.files[0])}
    />
  </div>

  <div>
    <label className="block font-semibold mb-1">Additional Images (optional)</label>
    <input
      type="file"
      accept="image/*"
      multiple
      onChange={(e) => setImages(Array.from(e.target.files))}

    />
  </div>

  <div className="grid grid-cols-2 gap-3">
    <div>
      <label className="block font-semibold mb-1">Font Size</label>
      <input
        className="border rounded px-3 py-2 w-full"
        placeholder="16px"
        value={form.fontSize}
        onChange={(e) => setForm({ ...form, fontSize: e.target.value })}
      />
    </div>

    <div>
      <label className="block font-semibold mb-1">Font Family</label>
      <input
        className="border rounded px-3 py-2 w-full"
        placeholder="Arial, sans-serif"
        value={form.fontFamily}
        onChange={(e) => setForm({ ...form, fontFamily: e.target.value })}
      />
    </div>
  </div>

  <button onClick={submit} className="px-4 py-2 rounded bg-blue-600 text-black">Create</button>
</div>

  );
}
