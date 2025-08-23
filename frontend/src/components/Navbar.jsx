import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, token, logout } = useAuth();
  const nav = useNavigate();
  const isAdmin = user?.role === "admin";

  return (
    <header className="bg-white border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-bold text-xl">CodeClash</Link>
        <nav className="flex items-center gap-4">
          {token ? (
            <>
              {!isAdmin && <Link to="/dashboard">Dashboard</Link>}
              {isAdmin && <Link to="/admin/dashboard">Admin</Link>}
              <span className="text-sm text-gray-600">Hi, {user?.username}</span>
              <button onClick={() => { logout(); nav("/login"); }}
                className="px-3 py-1 rounded bg-gray-900 text-white hover:opacity-90"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

