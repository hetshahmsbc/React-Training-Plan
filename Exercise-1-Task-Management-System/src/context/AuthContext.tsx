import { createContext, useContext, useState, type ReactNode } from "react";
import type { User } from "../types/user";

/** The Values every component can read/use from the auth context */
interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

// The context itself. `undefined` default lets us detect misuse (see useAuth).
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// key used to remember the user in the browser, so a refresh keeps you logged in.
const STORAGE_KEY = "tms.currentUser";

/** Wraps the app and provides auth state to everything inside it. */
export function AuthProvider({ children }: { children: ReactNode }) {
  // Lazy initial state: read any previously saved user once, on first render.
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved) as User) : null;
  });

  function login(username: string, password: string): boolean {
    // Dummy auth: accept any non empty username & password.
    if (username.trim() === "" || password.trim() === "") {
      return false;
    }

    const loggedInUser: User = { username };
    setUser(loggedInUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(loggedInUser));
    return true;
  }

  function logout() {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  const value: AuthContextValue = {
    user,
    isAuthenticated: user !== null,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/** Custom hook so componenets read auth with `useAuth()` instead of `useContext`. */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }
  return context;
}
