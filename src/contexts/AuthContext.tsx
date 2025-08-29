import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on mount
    const token = localStorage.getItem('admin_token');
    if (token) {
      verifyToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async (token: string) => {
    try {
      const response = await fetch(
        'https://wpbbuquuujspvajuhwqq.supabase.co/functions/v1/5f006418-903e-450a-a1b2-bc137fc37e35',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ action: 'verify', token })
        }
      );

      const data = await response.json();
      if (data.success) {
        setUser(data.user);
      } else {
        localStorage.removeItem('admin_token');
      }
    } catch (error) {
      localStorage.removeItem('admin_token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(
        'https://wpbbuquuujspvajuhwqq.supabase.co/functions/v1/5f006418-903e-450a-a1b2-bc137fc37e35',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ action: 'login', email, password })
        }
      );

      const data = await response.json();
      if (data.success) {
        localStorage.setItem('admin_token', data.token);
        setUser(data.user);
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
