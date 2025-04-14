import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Get token from local storage
const getAuthToken = () => {
  const token = localStorage.getItem('token');
  return token ? `Bearer ${token}` : '';
};

// Configure axios with auth headers
const authAxios = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests when available
authAxios.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Create a new project
export const createProject = async (projectData) => {
  try {
    const response = await authAxios.post('/projects', projectData);
    return response.data;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error.response?.data || { message: 'Failed to create project' };
  }
};

// Get all projects (public)
export const getAllProjects = async () => {
  try {
    const response = await axios.get(`${API_URL}/projects`);
    return response.data;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error.response?.data || { message: 'Failed to fetch projects' };
  }
};

// Get projects for a specific user
export const getUserProjects = async (userId) => {
  try {
    const response = await authAxios.get(`${API_URL}/projects/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user projects:', error);
    throw error.response?.data || { message: 'Failed to fetch user projects' };
  }
};

// Get a single project by ID
export const getProjectById = async (projectId) => {
  try {
    const response = await axios.get(`${API_URL}/projects/${projectId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching project details:', error);
    throw error.response?.data || { message: 'Failed to fetch project details' };
  }
};

// Update a project
export const updateProject = async (projectId, projectData) => {
  try {
    const response = await authAxios.put(`${API_URL}/projects/${projectId}`, projectData);
    return response.data;
  } catch (error) {
    console.error('Error updating project:', error);
    throw error.response?.data || { message: 'Failed to update project' };
  }
};

// Delete a project
export const deleteProject = async (projectId) => {
  try {
    const response = await authAxios.delete(`${API_URL}/projects/${projectId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error.response?.data || { message: 'Failed to delete project' };
  }
};

export default {
  getAllProjects,
  getUserProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
};