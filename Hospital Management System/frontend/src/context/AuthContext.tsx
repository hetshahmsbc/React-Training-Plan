// Tracks the signed-in user (name + role + linked ids) and exposes login/logout.
// Tokens live in the data-layer's token manager; the user object is mirrored in
// sessionStorage so a reload keeps the role.

import { createContext, useContext, useState, type ReactNode } from 'react';
import { saveTokens, clearSession, isLoggedIn, type AuthTokens } from '../lib/dataLayer';

export type Role = 'admin' | 'doctor' | 'patient';

export interface AuthUser {
  name: string;
  email: string;
  role: Role;
  doctorId?: number;
  patientId?: number;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (tokens: AuthTokens, user: AuthUser) => void;
  logout: () => void;
}

const USER_KEY = 'hms-user';

function loadUser(): AuthUser | null {
  try {
    const raw = sessionStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Only restore the user if a token is still present (same tab session).
  const [user, setUser] = useState<AuthUser | null>(() => (isLoggedIn() ? loadUser() : null));

  const login = (tokens: AuthTokens, u: AuthUser) => {
    saveTokens(tokens);
    sessionStorage.setItem(USER_KEY, JSON.stringify(u));
    setUser(u);
  };

  const logout = () => {
    clearSession();
    sessionStorage.removeItem(USER_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: Boolean(user), login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
