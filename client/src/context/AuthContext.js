// client/src/context/AuthContext.js
import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on page load
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('userToken');
        
        if (!token) {
          setIsLoading(false);
          return;
        }
        
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };
        
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/auth/me`, config);
        setUser(data);
        setIsLoading(false);
      } catch (error) {
        localStorage.removeItem('userToken');
        setError(error.response?.data?.message || 'Error fetching user data');
        setIsLoading(false);
      }
    };
    
    fetchUser();
  }, []);

  // Register user
  const register = async (userData) => {
    try {
      setIsLoading(true);
      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`, userData);
      
      if (data.token) {
        localStorage.setItem('userToken', data.token);
        setUser(data);
      }
      
      setIsLoading(false);
      return { success: true };
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
      setIsLoading(false);
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      };
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      setIsLoading(true);
      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, {
        email,
        password
      });
      
      if (data.token) {
        localStorage.setItem('userToken', data.token);
        setUser(data);
      }
      
      setIsLoading(false);
      return { success: true };
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
      setIsLoading(false);
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('userToken');
    setUser(null);
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      setIsLoading(true);
      
      const token = localStorage.getItem('userToken');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      
      const { data } = await axios.put(
        `${process.env.REACT_APP_API_URL}/auth/profile`,
        userData,
        config
      );
      
      setUser(data);
      
      if (data.token) {
        localStorage.setItem('userToken', data.token);
      }
      
      setIsLoading(false);
      return { success: true };
    } catch (error) {
      setError(error.response?.data?.message || 'Profile update failed');
      setIsLoading(false);
      return {
        success: false,
        message: error.response?.data?.message || 'Profile update failed'
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        register,
        login,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;