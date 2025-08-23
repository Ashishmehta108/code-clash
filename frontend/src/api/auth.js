import API from "./axios";

export const registerApi = (payload) => API.post("/auth/register", payload);
export const loginApi = (payload) => API.post("/auth/login", payload);
export const meApi = () => API.get("/auth/me");

