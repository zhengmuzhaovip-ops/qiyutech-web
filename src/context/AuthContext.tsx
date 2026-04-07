import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { AuthUser } from '../types';
import { fetchCurrentTradeUser } from '../lib/auth';

interface AuthContextValue {
  token: string | null;
  user: AuthUser | null;
  isLoggedIn: boolean;
  login: (tokenValue: string, userValue: AuthUser) => void;
  updateUser: (userValue: AuthUser) => void;
  logout: () => void;
}

const STORAGE_KEY_TOKEN = 'qiyutech_token';
const STORAGE_KEY_USER = 'qiyutech_user';

const AuthContext = createContext<AuthContextValue | null>(null);

function readStoredUser(): AuthUser | null {
  const value = localStorage.getItem(STORAGE_KEY_USER);
  if (!value) return null;

  try {
    return JSON.parse(value) as AuthUser;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(STORAGE_KEY_TOKEN));
  const [user, setUser] = useState<AuthUser | null>(() => readStoredUser());

  useEffect(() => {
    if (!token) {
      return;
    }

    let isActive = true;

    fetchCurrentTradeUser(token)
      .then((nextUser) => {
        if (!isActive) return;
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(nextUser));
        setUser(nextUser);
      })
      .catch(() => {
        if (!isActive) return;
        localStorage.removeItem(STORAGE_KEY_TOKEN);
        localStorage.removeItem(STORAGE_KEY_USER);
        setToken(null);
        setUser(null);
      });

    return () => {
      isActive = false;
    };
  }, [token]);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      isLoggedIn: Boolean(token && user),
      login: (tokenValue, userValue) => {
        localStorage.setItem(STORAGE_KEY_TOKEN, tokenValue);
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(userValue));
        setToken(tokenValue);
        setUser(userValue);
      },
      updateUser: (userValue) => {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(userValue));
        setUser(userValue);
      },
      logout: () => {
        localStorage.removeItem(STORAGE_KEY_TOKEN);
        localStorage.removeItem(STORAGE_KEY_USER);
        setToken(null);
        setUser(null);
      },
    }),
    [token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
