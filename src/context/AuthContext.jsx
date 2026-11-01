import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';
import { TOKEN_KEYS, ROLE_HIERARCHY } from '../constants';
import { mockUsers } from '../services/mock/mockData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize — load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem(TOKEN_KEYS.USER);
    const accessToken = localStorage.getItem(TOKEN_KEYS.ACCESS);
    if (storedUser && accessToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem(TOKEN_KEYS.USER);
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    setError(null);
    try {
      const response = await authAPI.login({ email, password });
      const { accessToken, refreshToken, user: userData } = response.data.data;
      localStorage.setItem(TOKEN_KEYS.ACCESS, accessToken);
      localStorage.setItem(TOKEN_KEYS.REFRESH, refreshToken);
      localStorage.setItem(TOKEN_KEYS.USER, JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (apiErr) {
      // Graceful offline fallback for development testing when backend is not listening
      const isNetworkIssue = !apiErr.response || apiErr.code === 'ERR_NETWORK' || apiErr.message?.includes('Network Error');
      if (isNetworkIssue) {
        const found = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
        if (found) {
          const fakeToken = `demo-token-${found.id}`;
          localStorage.setItem(TOKEN_KEYS.ACCESS, fakeToken);
          localStorage.setItem(TOKEN_KEYS.REFRESH, `demo-refresh-${found.id}`);
          localStorage.setItem(TOKEN_KEYS.USER, JSON.stringify(found));
          setUser(found);
          return found;
        }
      }
      throw apiErr;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authAPI.logout();
    } catch {
      // Always clear local state even if API call fails
    } finally {
      localStorage.removeItem(TOKEN_KEYS.ACCESS);
      localStorage.removeItem(TOKEN_KEYS.REFRESH);
      localStorage.removeItem(TOKEN_KEYS.USER);
      setUser(null);
    }
  }, []);

  const register = useCallback(async (data) => {
    setError(null);
    const response = await authAPI.register(data);
    return response.data;
  }, []);

  const updateUser = useCallback((updatedUser) => {
    setUser((prev) => {
      const merged = { ...prev, ...updatedUser };
      localStorage.setItem(TOKEN_KEYS.USER, JSON.stringify(merged));
      return merged;
    });
  }, []);

  const hasRole = useCallback(
    (minRole) => {
      if (!user) return false;
      const userLevel = ROLE_HIERARCHY.indexOf(user.role);
      const minLevel = ROLE_HIERARCHY.indexOf(minRole);
      return userLevel >= minLevel;
    },
    [user]
  );

  const isAuthenticated = Boolean(user);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        isAuthenticated,
        login,
        logout,
        register,
        updateUser,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
