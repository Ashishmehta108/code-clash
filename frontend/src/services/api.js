import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const auth = {
    register: (userData) => api.post('/auth/register', userData),
    login: (credentials) => api.post('/auth/login', credentials),
    getMe: () => api.get('/auth/me'),
};

export const getTasks = async () => {
  const response = await api.get('/tasks');
  return response.data;
};

export const getTask = async (id) => {
  const response = await api.get(`/tasks/${id}`);
  return response.data;
};

export const createTask = async (taskData) => {
  // Transform subTasks array to the expected format
  const formattedTask = {
    ...taskData,
    subTasks: taskData.subTasks.map((subTask, index) => ({
      ...subTask,
      order: index + 1
    }))
  };
  const response = await api.post('/tasks', formattedTask);
  return response.data;
};

export const updateTask = async (id, taskData) => {
  // Transform subTasks array to the expected format
  const formattedTask = {
    ...taskData,
    subTasks: taskData.subTasks.map((subTask, index) => ({
      ...subTask,
      order: index + 1
    }))
  };
  const response = await api.put(`/tasks/${id}`, formattedTask);
  return response.data;
};

export const deleteTask = async (id) => {
  await api.delete(`/tasks/${id}`);
  return id;
};

// Create a separate axios instance for file uploads
const apiMultipart = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
  withCredentials: true,
});

apiMultipart.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getSubmissions = async () => {
  const response = await api.get('/submissions');
  return response.data;
};

export const getMySubmissions = async () => {
  const response = await api.get('/submissions/me');
  return response.data;
};

export const getSubmission = async (id) => {
  const response = await api.get(`/submissions/${id}`);
  return response.data;
};

export const createSubmission = async (submissionData) => {
  // Handle both direct code and codeUrl/imageUrl submissions
  const submissionPayload = {
    taskId: submissionData.taskId,
    language: submissionData.language,
    ...(submissionData.code && { code: submissionData.code }),
    ...(submissionData.codeUrl && { codeUrl: submissionData.codeUrl }),
    ...(submissionData.imageUrl && { imageUrl: submissionData.imageUrl })
  };
  
  const response = await api.post('/submissions', submissionPayload);
  return response.data;
};

export const updateSubmission = async (id, submissionData) => {
  const response = await api.put(`/submissions/${id}`, submissionData);
  return response.data;
};

export const deleteSubmission = async (id) => {
  await api.delete(`/submissions/${id}`);
  return id;
};

export default api;
