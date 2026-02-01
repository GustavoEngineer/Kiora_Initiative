import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// TASKS
export const getTasks = async () => {
    const response = await api.get('/tasks');
    return response.data;
};

export const getTaskById = async (id) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
};

export const createTask = async (datos) => {
    const response = await api.post('/tasks', datos);
    return response.data;
};

export const updateTask = async (id, datos) => {
    const response = await api.put(`/tasks/${id}`, datos);
    return response.data;
};

export const deleteTask = async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
};

// BLOCS
export const getBlocs = async () => {
    const response = await api.get('/blocs');
    return response.data;
};

export const getBlocById = async (id) => {
    const response = await api.get(`/blocs/${id}`);
    return response.data;
};

export const createBloc = async (datos) => {
    const response = await api.post('/blocs', datos);
    return response.data;
};

export const updateBloc = async (id, datos) => {
    const response = await api.put(`/blocs/${id}`, datos);
    return response.data;
};

export const deleteBloc = async (id) => {
    const response = await api.delete(`/blocs/${id}`);
    return response.data;
};

// TAGS
export const getTags = async () => {
    const response = await api.get('/tags');
    return response.data;
};

export const getTagById = async (id) => {
    const response = await api.get(`/tags/${id}`);
    return response.data;
};

export const createTag = async (datos) => {
    const response = await api.post('/tags', datos);
    return response.data;
};

export const updateTag = async (id, datos) => {
    const response = await api.put(`/tags/${id}`, datos);
    return response.data;
};

export const deleteTag = async (id) => {
    const response = await api.delete(`/tags/${id}`);
    return response.data;
};

// WORK DAYS
export const getWorkDays = async () => {
    const response = await api.get('/workdays');
    return response.data;
};

export const getWorkDayById = async (id) => {
    const response = await api.get(`/workdays/${id}`);
    return response.data;
};

export const createWorkDay = async (datos) => {
    const response = await api.post('/workdays', datos);
    return response.data;
};

export const updateWorkDay = async (id, datos) => {
    const response = await api.put(`/workdays/${id}`, datos);
    return response.data;
};

export const deleteWorkDay = async (id) => {
    const response = await api.delete(`/workdays/${id}`);
    return response.data;
};

export default api;