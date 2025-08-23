import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="text-center py-20">
      <h1 className="text-4xl font-bold">Welcome to CodeClash</h1>
      <p className="mt-3 text-gray-600">Practice UI tasks and submit your solutions.</p>
      <div className="mt-6 flex justify-center gap-3">
        <Link className="px-4 py-2 rounded bg-blue-600 text-white" to="/register">Get Started</Link>
        <Link className="px-4 py-2 rounded border" to="/login">Login</Link>
      </div>
    </div>
  );
}

