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

// Create a new blog post
export const createBlog = async (blogData) => {
  try {
    const response = await authAxios.post('/blogs', blogData);
    return response.data;
  } catch (error) {
    console.error('Error creating blog post:', error);
    throw error.response?.data || { message: 'Failed to create blog post' };
  }
};

// Get all blog posts (public)
export const getAllBlogs = async () => {
  try {
    const response = await axios.get(`${API_URL}/blogs`);
    return response.data;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    throw error.response?.data || { message: 'Failed to fetch blog posts' };
  }
};

// Get blog posts for a specific user
export const getUserBlogs = async (userId) => {
  try {
    const response = await authAxios.get(`${API_URL}/blogs/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user blogs:', error);
    throw error.response?.data || { message: 'Failed to fetch user blogs' };
  }
};

// Get a single blog by ID
export const getBlogById = async (blogId) => {
  try {
    const response = await axios.get(`${API_URL}/blogs/${blogId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching blog details:', error);
    throw error.response?.data || { message: 'Failed to fetch blog details' };
  }
};

// Update a blog post
export const updateBlog = async (blogId, blogData) => {
  try {
    const response = await authAxios.put(`${API_URL}/blogs/${blogId}`, blogData);
    return response.data;
  } catch (error) {
    console.error('Error updating blog post:', error);
    throw error.response?.data || { message: 'Failed to update blog post' };
  }
};

// Delete a blog post
export const deleteBlog = async (blogId) => {
  try {
    const response = await authAxios.delete(`${API_URL}/blogs/${blogId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting blog post:', error);
    throw error.response?.data || { message: 'Failed to delete blog post' };
  }
};

// Get blog posts by category
export const getBlogsByCategory = async (category) => {
  try {
    const response = await axios.get(`${API_URL}/blogs/category/${category}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching blogs by category:', error);
    throw error.response?.data || { message: 'Failed to fetch blogs by category' };
  }
};

export default {
  getAllBlogs,
  getUserBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  getBlogsByCategory
};