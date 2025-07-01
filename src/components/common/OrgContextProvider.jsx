import React, { createContext, useContext, useEffect, useState } from 'react';
import { orgContextManager } from '../../utils/orgContext';
import api from '../../services/api';

const OrgContext = createContext();

/**
 * Provider for org context throughout the app
 */
export const OrgContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadUserContext();
  }, []);

  const loadUserContext = async () => {
    try {
      setLoading(true);
      
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await api.get('/auth/me');
      const userData = response.data;

      // Validate user data
      if (!userData.id) {
        throw new Error('Invalid user data received');
      }

      // Set user context
      setUser(userData);
      orgContextManager.setUser(userData);

      // Defensive check for org users
      if (userData.role === 'org_user' && !userData.org_id) {
        console.error('Org user without org_id:', userData);
        throw new Error('Org user must have org_id');
      }

    } catch (error) {
      console.error('Failed to load user context:', error);
      setError(error.message);
      
      // Clear invalid token
      localStorage.removeItem('auth_token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      const { token, user: userData } = response.data;

      localStorage.setItem('auth_token', token);
      setUser(userData);
      orgContextManager.setUser(userData);

      return userData;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
    orgContextManager.setUser(null);
    window.location.href = '/login';
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user,
    isProductAdmin: user?.role === 'product_admin',
    currentOrgId: user?.org_id
  };

  return <OrgContext.Provider value={value}>{children}</OrgContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(OrgContext);
  if (!context) {
    throw new Error('useAuth must be used within OrgContextProvider');
  }
  return context;
};