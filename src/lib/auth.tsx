'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  isLoggedIn: boolean;
  username: string;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false, username: '', login: () => false, logout: () => {},
});

export function useAuth() { return useContext(AuthContext); }

const ACCOUNTS: Record<string, string> = {
  admin: 'admin123',
  test: 'test123',
};

const AUTH_KEY = 'factoring_auth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [checked, setChecked] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const saved = localStorage.getItem(AUTH_KEY);
    if (saved) {
      try {
        const { user } = JSON.parse(saved);
        setIsLoggedIn(true);
        setUsername(user);
      } catch { /* ignore */ }
    }
    setChecked(true);
  }, []);

  useEffect(() => {
    if (!checked) return;
    if (!isLoggedIn && pathname !== '/login') {
      router.replace('/login');
    }
    if (isLoggedIn && pathname === '/login') {
      router.replace('/supplier/dashboard');
    }
  }, [isLoggedIn, pathname, checked, router]);

  const login = (user: string, pass: string): boolean => {
    if (ACCOUNTS[user] && ACCOUNTS[user] === pass) {
      setIsLoggedIn(true);
      setUsername(user);
      localStorage.setItem(AUTH_KEY, JSON.stringify({ user }));
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUsername('');
    localStorage.removeItem(AUTH_KEY);
    router.replace('/login');
  };

  if (!checked) return null;

  return (
    <AuthContext.Provider value={{ isLoggedIn, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
