/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { apiRequest, ApiError } from "../data/api";

export type AuthUser = {
  email: string;
};

type StoredSession = {
  token: string;
  user: AuthUser;
};

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const STORAGE_KEY = "chazu_admin_session";
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readStoredSession() {
  if (typeof window === "undefined") return null;
  const stored = window.localStorage.getItem(STORAGE_KEY);

  if (!stored) return null;

  try {
    return JSON.parse(stored) as StoredSession;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<StoredSession | null>(() => readStoredSession());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = readStoredSession();

    if (!stored?.token) {
      setIsLoading(false);
      return;
    }

    apiRequest<{ user: AuthUser }>("/auth/session", {
      token: stored.token,
    })
      .then((response) => {
        const nextSession = { token: stored.token, user: response.user };
        setSession(nextSession);
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSession));
      })
      .catch(() => {
        setSession(null);
        window.localStorage.removeItem(STORAGE_KEY);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      token: session?.token ?? null,
      isLoading,
      login: async (email, password) => {
        const response = await apiRequest<{ token: string; user: AuthUser }>(
          "/auth/login",
          {
            method: "POST",
            body: { email, password },
          },
        );

        const nextSession = {
          token: response.token,
          user: response.user,
        };

        setSession(nextSession);
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSession));
      },
      logout: async () => {
        const token = session?.token ?? readStoredSession()?.token ?? null;

        try {
          await apiRequest("/auth/logout", {
            method: "POST",
            token,
            body: token ? { token } : {},
          });
        } catch (error) {
          if (!(error instanceof ApiError)) {
            throw error;
          }
        } finally {
          setSession(null);
          window.localStorage.removeItem(STORAGE_KEY);
        }
      },
    }),
    [isLoading, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
