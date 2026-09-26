import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Restore authenticated session on application load
  const loadUser = useCallback(async () => {
    const savedToken = localStorage.getItem('token');
    if (!savedToken) {
      setLoading(false);
      return;
    }

    try {
      const response = await authService.getMe();
      if (response?.data) {
        setUser(response.data);
      } else {
        throw new Error('Invalid user payload');
      }
    } catch (error) {
      console.warn('Session expired or invalid token. Logging out.');
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // Log in user and persist token
  const login = async (email, password) => {
    const response = await authService.login(email, password);
    const { token: receivedToken, user: receivedUser } = response.data;

    localStorage.setItem('token', receivedToken);
    setToken(receivedToken);
    setUser(receivedUser);

    return receivedUser;
  };

  // Register standard user and optionally log them in
  const register = async (name, email, password) => {
    const response = await authService.register(name, email, password);
    const { token: receivedToken, user: receivedUser } = response.data;

    localStorage.setItem('token', receivedToken);
    setToken(receivedToken);
    setUser(receivedUser);

    return receivedUser;
  };

  // Clear authentication state and remove token
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        reloadUser: loadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
