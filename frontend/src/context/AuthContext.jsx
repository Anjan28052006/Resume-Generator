import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/auth.api';
import {
  getStoredToken,
  setStoredToken,
  getStoredUser,
  setStoredUser,
  clearAuthStorage,
} from '../utils/storage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => getStoredToken());
  const [user, setUser] = useState(() => getStoredUser());
  const [loading, setLoading] = useState(true);

  // Sync token state changes with storage and verify session if needed
  useEffect(() => {
    const handleAuthExpired = () => {
      setToken(null);
      setUser(null);
      clearAuthStorage();
    };

    window.addEventListener('auth:expired', handleAuthExpired);
    setLoading(false);

    return () => {
      window.removeEventListener('auth:expired', handleAuthExpired);
    };
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await authApi.login({ email, password });
    const { accessToken, user: userData } = data;
    
    setStoredToken(accessToken);
    setStoredUser(userData);
    setToken(accessToken);
    setUser(userData);
    
    return userData;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const data = await authApi.register({ name, email, password });
    // After successful registration, auto-login
    try {
      const loginData = await authApi.login({ email, password });
      const { accessToken, user: userData } = loginData;
      setStoredToken(accessToken);
      setStoredUser(userData);
      setToken(accessToken);
      setUser(userData);
      return userData;
    } catch {
      return data.user;
    }
  }, []);

  const logout = useCallback(() => {
    clearAuthStorage();
    setToken(null);
    setUser(null);
  }, []);

  const value = {
    token,
    user,
    loading,
    isAuthenticated: !!token,
    login,
    register,
    logout,
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
