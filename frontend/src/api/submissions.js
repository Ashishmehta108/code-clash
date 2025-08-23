import API from "./axios";

export const createSubmissionApi = (payload) => API.post("/submissions", payload);
export const getAllSubmissionsApi = () => API.get("/submissions"); // admin
export const getSubmissionApi = (id) => API.get(`/submissions/${id}`);
export const updateSubmissionApi = (id, payload) => API.put(`/submissions/${id}`, payload);
export const deleteSubmissionApi = (id) => API.delete(`/submissions/${id}`);
export const getSubmissionsForTaskApi = (taskId) => API.get(`/submissions/task/${taskId}`);

