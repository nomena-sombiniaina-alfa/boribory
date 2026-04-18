import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { api, tokenStore } from "../api/client";
import type { User } from "../types";

interface AuthPayload extends User {
  token: string;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUsername: (username: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tokenStore.get()) {
      setLoading(false);
      return;
    }
    api<User>("/auth/me/")
      .then(setUser)
      .catch(() => tokenStore.clear())
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      async login(username, password) {
        const r = await api<AuthPayload>("/auth/login/", {
          method: "POST",
          body: JSON.stringify({ username, password }),
        });
        tokenStore.set(r.token);
        setUser({ id: r.id, username: r.username });
      },
      async register(username, password) {
        const r = await api<AuthPayload>("/auth/register/", {
          method: "POST",
          body: JSON.stringify({ username, password }),
        });
        tokenStore.set(r.token);
        setUser({ id: r.id, username: r.username });
      },
      async logout() {
        try {
          await api("/auth/logout/", { method: "POST" });
        } finally {
          tokenStore.clear();
          setUser(null);
        }
      },
      async updateUsername(username) {
        const r = await api<User>("/auth/me/", {
          method: "PATCH",
          body: JSON.stringify({ username }),
        });
        setUser({ id: r.id, username: r.username });
      },
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
