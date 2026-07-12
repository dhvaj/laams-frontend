import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, UserRole } from '../types';
import { authService } from '../services/auth.service';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => Promise<any>;
  setupPassword: (userId: string, password?: string) => Promise<void>;
  register: (userData: Omit<User, 'id'> & { password?: string }) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getCachedUser = (): User | null => {
  const cachedUser = localStorage.getItem('laams_user_data');
  if (!cachedUser) {
    return null;
  }

  try {
    return JSON.parse(cachedUser);
  } catch (e) {
    console.error("Cached user data is invalid", e);
    localStorage.removeItem('laams_user_data');
    return null;
  }
};

const clearStoredSession = () => {
  localStorage.removeItem('laams_jwt_token');
  localStorage.removeItem('laams_user_data');
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const checkAuth = async () => {
      const token = localStorage.getItem('laams_jwt_token');
      if (token) {
        try {
          const currentUser = await authService.getCurrentUser(token);
          if (currentUser) {
            setUser(currentUser);
            localStorage.setItem('laams_user_data', JSON.stringify(currentUser));
          } else {
            const cachedUser = getCachedUser();
            if (cachedUser) {
              setUser(cachedUser);
            } else {
              clearStoredSession();
            }
          }
        } catch (e) {
          console.error("Session restored failed", e);
          const cachedUser = getCachedUser();
          if (cachedUser) {
            setUser(cachedUser);
          } else {
            clearStoredSession();
          }
        }
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email: string, password?: string) => {
    const res = await authService.login(email, password);
    if (res.requirePasswordSetup) {
      return res;
    }
    if (res.user && res.token) {
      setUser(res.user);
      localStorage.setItem('laams_jwt_token', res.token);
      localStorage.setItem('laams_user_data', JSON.stringify(res.user));
    }
    return res;
  };

  const setupPassword = async (userId: string, password?: string) => {
    try {
      const { user: newUser, token } = await authService.setupPassword(userId, password);
      setUser(newUser);
      localStorage.setItem('laams_jwt_token', token);
      localStorage.setItem('laams_user_data', JSON.stringify(newUser));
    } catch (error) {
      throw error;
    }
  };

  const registerUser = async (userData: Omit<User, 'id'> & { password?: string }) => {
    try {
      const { user: newUser, token } = await authService.register(userData);
      setUser(newUser);
      localStorage.setItem('laams_jwt_token', token);
      localStorage.setItem('laams_user_data', JSON.stringify(newUser));
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    clearStoredSession();
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      role: user?.role || null, 
      isAuthenticated: !!user, 
      login, 
      setupPassword,
      register: registerUser,
      logout,
      isLoading
    }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
