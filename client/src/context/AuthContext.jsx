import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Load current user from token on initial app mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const data = await authService.getMe();
          if (data?.user) {
            setUser(data.user);
          } else {
            localStorage.removeItem('token');
            setToken(null);
          }
        } catch (err) {
          console.warn('Session expired or invalid token:', err.message);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // Login handler
  const login = async (email, password) => {
    const data = await authService.login({ email, password });
    if (data.token) {
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);
    }
    return data;
  };

  // Signup handler
  const signup = async (userData) => {
    const data = await authService.signup(userData);
    if (data.token) {
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);
    }
    return data;
  };

  // Logout handler
  const logout = async () => {
    try {
      await authService.logout();
    } catch (e) {
      // ignore server logout error
    } finally {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    }
  };

  // Update local user state
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  // Refresh user data
  const refreshUser = async () => {
    try {
      const data = await authService.getMe();
      if (data?.user) {
        setUser(data.user);
      }
    } catch (err) {
      console.error('Failed to refresh user:', err);
    }
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    loading,
    login,
    signup,
    logout,
    updateUser,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
