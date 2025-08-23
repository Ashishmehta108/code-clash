import API from "./axios";

export const getTasksApi = () => API.get("/tasks");
export const getTaskApi = (id) => API.get(`/tasks/${id}`);
export const createTaskApi = (payload) => API.post("/tasks", payload);
export const updateTaskApi = (id, payload) => API.put(`/tasks/${id}`, payload);
export const deleteTaskApi = (id) => API.delete(`/tasks/${id}`);

