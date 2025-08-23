import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Tasks', href: '/admin/tasks', icon: BookOpen },
  { name: 'Submissions', href: '/admin/submissions', icon: FileText },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile menu button */}
      <div className="lg:hidden bg-gray-800 p-4 flex justify-between items-center">
        <div className="flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-300 hover:text-white focus:outline-none"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <span className="ml-4 text-white font-semibold">Admin Panel</span>
        </div>
      </div>

      {/* Sidebar */}
      <div className="flex">
        <div
          className={`${mobileMenuOpen ? 'block' : 'hidden'} lg:block fixed inset-y-0 left-0 w-64 bg-gray-800 overflow-y-auto`}
        >
          <div className="flex items-center justify-center h-16 bg-gray-900">
            <h1 className="text-white text-xl font-bold">CodeClash Admin</h1>
          </div>
          <nav className="mt-5 px-2 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`${isActive(item.href)} group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon className="mr-3 flex-shrink-0 h-6 w-6" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col lg:pl-64">
          {/* Top navigation */}
          <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                {navigation.find((item) => item.href === location.pathname)?.name || 'Dashboard'}
              </h1>
              <div className="flex items-center">
                <div className="relative inline-block text-left">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700">
                      {user?.name || 'Admin'}
                    </span>
                    <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold">
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
