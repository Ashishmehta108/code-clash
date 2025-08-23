import { createContext, useContext, useEffect, useState } from "react";
import { loginApi, registerApi, meApi } from "../api/auth";

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("cc_token") || "");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!token);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const { data } = await meApi();
        // backend: { success, data: user }
        setUser(data?.data || null);
      } catch {
        localStorage.removeItem("cc_token");
        setToken("");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchMe();
    else setLoading(false);
  }, [token]);

  const login = async ({ email, password }) => {
    const { data } = await loginApi({ email, password });
    localStorage.setItem("cc_token", data.token);
    setToken(data.token);
    const me = await meApi();
    setUser(me.data?.data || null);
  };

  const register = async ({ username, email, password,role }) => {
    const { data } = await registerApi({ username, email, password,role });
    localStorage.setItem("cc_token", data.token);
    setToken(data.token);
    const me = await meApi();
    setUser(me.data?.data || null);
  };

  const logout = () => {
    localStorage.removeItem("cc_token");
    setToken("");
    setUser(null);
  };

  return (
    <AuthCtx.Provider value={{ token, user, loading, login, register, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

