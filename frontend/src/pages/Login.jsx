import { useState, useLayoutEffect } from "react";
import { Navigate, useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { Mail, Lock, CheckCircle, CircleX, CheckCircle2 } from "lucide-react"; // optional icons
import { z } from "zod";
import { toast } from "sonner";
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const [error, setError] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();
  useLayoutEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const validatedData = loginSchema.safeParse({
        email: email,
        password: password,
      });

      if (!validatedData.success) {
        const parsedErrors = validatedData.error.errors.map((err) => {
          toast(
            <span className="flex items-center">
              <CircleX size={24} className="text-white fill-red-500" />
              <span className="ml-2">{err.path} error {err.message}</span>
            </span>
          );
          return err;
        });

        setError(parsedErrors.map(err => err.message).join(", "));
        return;
      }

      // Wait for login to complete and get the response
      const response = await login(validatedData.data.email, validatedData.data.password);

      if (response?.token) {
        toast(
          <span className="flex items-center">
            <CheckCircle2 size={24} className="text-white fill-green-500" />
            <span className="ml-2">Logged in successfully</span>
          </span>
        );
        // Navigate after state is updated
        window.location.href = '/';
      }
    } catch (err) {
      const errorMsg = err.message || "Something went wrong";
      toast(
        <span className="flex items-center">
          <CircleX size={24} className="text-white fill-red-500" />
          <span className="ml-2">{errorMsg}</span>
        </span>
      );
    }
  };




  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 container max-w-7xl mx-auto">
      <div className="max-w-md w-full bg-white rounded-2xl border border-zinc-200 p-8 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p className="mt-2 text-sm text-gray-500">
            Sign in to access your dashboard
          </p>
        </div>

        {/* Error */}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <div className="mt-1 relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                id="email"
                type="text"
                required
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="mt-1 relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                id="password"
                type="password"
                required
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
          >
            Sign In
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500">
          Don’t have an account?{" "}
          <a href="/signup" className="text-indigo-600 hover:underline font-medium">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
