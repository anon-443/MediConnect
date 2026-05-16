import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../api/axios';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = sessionStorage.getItem('user');
    if (saved) {
      setUser(JSON.parse(saved));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
  try {
    const res = await api.post('/auth/login', {
      email,
      password,
    });

    console.log("LOGIN RESPONSE:", res.data);

    const { access_token } = res.data;

    if (!access_token) {
      throw new Error("No token received from backend");
    }

    // ✅ Save token
    sessionStorage.setItem('token', access_token);

    // 🔥 Fetch logged-in user using token
    const meRes = await api.get('/auth/me', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const user = meRes.data;

    if (!user) {
      throw new Error("Failed to fetch user data");
    }

    // ✅ Save user
    sessionStorage.setItem('user', JSON.stringify(user));
    setUser(user);

  } catch (err) {
    console.log("LOGIN ERROR:", err);
    throw err;
  }
};

  const logout = async () => {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};