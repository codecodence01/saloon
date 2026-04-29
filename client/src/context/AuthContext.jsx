import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Rehydrate from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('salon_token');
    const storedUser = localStorage.getItem('salon_user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password, isAdmin = false) => {
    const endpoint = isAdmin ? '/auth/admin/login' : '/auth/login';
    const { data } = await api.post(endpoint, { email, password });
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('salon_token', data.token);
    localStorage.setItem('salon_user', JSON.stringify(data.user));
    return data.user;
  };

  const register = async (name, email, phone, password) => {
    const { data } = await api.post('/auth/register', { name, email, phone, password });
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('salon_token', data.token);
    localStorage.setItem('salon_user', JSON.stringify(data.user));
    return data.user;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('salon_token');
    localStorage.removeItem('salon_user');
    api.post('/auth/logout').catch(() => {});
  };

  const isAdmin = user?.role === 'admin';
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAdmin, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export default AuthContext;
