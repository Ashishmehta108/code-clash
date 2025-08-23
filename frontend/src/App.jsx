import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";

import StudentDashboard from "./pages/student/StudentDashboard";
import TaskDetail from "./pages/student/TaskDetail";
import MyTaskSubmissions from "./pages/student/MyTaskSubmissions";

import AdminDashboard from "./pages/admin/AdminDashboard";
import CreateTask from "./pages/admin/CreateTask";
import ReviewSubmissions from "./pages/admin/ReviewSubmissions";

import { Protected } from "./components/Protected";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-6">
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Student (role 'user') */}
          <Route element={<Protected roles={["user"]} />}>
            <Route path="/dashboard" element={<StudentDashboard />} />
            <Route path="/task/:id" element={<TaskDetail />} />
            <Route path="/task/:id/submissions" element={<MyTaskSubmissions />} />
          </Route>

          {/* Admin */}
          <Route element={<Protected roles={["admin"]} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/task/create" element={<CreateTask />} />
            <Route path="/admin/task/:id/review" element={<ReviewSubmissions />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

