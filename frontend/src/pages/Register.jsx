import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ username:"", email:"", password:"" });
  const [err, setErr] = useState("");

    const handleChange = (e) => {
    setForm({ ...form, [e.target.role]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await register(form);
      nav("/dashboard");
    } catch (e) {
      setErr(e?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-4">Create account</h1>
      {err && <p className="text-red-600 mb-3">{err}</p>}
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full border rounded px-3 py-2" placeholder="Username"
          value={form.username} onChange={e=>setForm({...form, username:e.target.value})}/>
        <input className="w-full border rounded px-3 py-2" placeholder="Email"
          value={form.email} onChange={e=>setForm({...form, email:e.target.value})}/>
        <input className="w-full border rounded px-3 py-2" placeholder="Password" type="password"
          value={form.password} onChange={e=>setForm({...form, password:e.target.value})}/>

          {/* Role Selector */}
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full border rounded p-2"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button className="w-full py-2 rounded bg-blue-600 text-black">Sign up</button>
      </form>
      <p className="text-sm mt-3">Have an account? <Link to="/login" className="text-blue-600">Login</Link></p>
    </div>
  );
}

