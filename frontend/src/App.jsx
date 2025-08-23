import { BrowserRouter, Routes, Route, Navigate, Outlet, Router } from 'react-router';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Task from './pages/Task';
import SubmitSolution from './pages/SubmitSolution';
import AdminLayout from './components/layout/AdminLayout';
import TaskList from './pages/admin/Tasks';
import SubmissionsList from './pages/admin/Submissions';
import TaskForm from './components/tasks/TaskForm';

// A wrapper for protected routes
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return user ? children : <Navigate to="/login" />;
};

// A wrapper for admin-only routes
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  console.log(user.role)
  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  // return user?.role == 'admin' ? children : <Navigate to="/" />;
};

// Admin layout wrapper
const AdminLayoutWrapper = () => (
  <AdminLayout>
    <Outlet />
  </AdminLayout>
);

function App() {
  return (
    <BrowserRouter >
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected User Routes */}
          <Route element={<PrivateRoute><Outlet /></PrivateRoute>}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/task/:id" element={<Task />} />
            <Route path="/task/:id/submit" element={<SubmitSolution />} />
          </Route>

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              // <PrivateRoute>
              <AdminRoute>
                <AdminLayoutWrapper />
              </AdminRoute>
              // </PrivateRoute>
            }
          >
            <Route index element={<Navigate to="tasks" replace />} />
            <Route path="tasks" element={<TaskList />} />
            <Route path="tasks/new" element={<TaskForm />} />
            <Route path="tasks/:id/edit" element={<TaskForm />} />
            <Route path="submissions" element={<SubmissionsList />} />
          </Route>

          {/* Catch all other routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>

  );
}

export default App;
