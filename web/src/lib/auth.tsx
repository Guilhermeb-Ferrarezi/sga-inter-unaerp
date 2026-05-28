import { createContext, useContext, useMemo, useEffect, useState } from "react";

export type AuthUser = {
  userId: number;
  email: string;
  login: string;
  role: number;
};

type AuthState = {
  user: AuthUser | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
  signOut: () => void;
};

const AuthContext = createContext<AuthState | null>(null);

// JWT shape do infra/auth-api: HS256 com { userId, email, login, role, exp }
function decodeJwt(token: string): AuthUser | null {
  try {
    const [, payload] = token.split(".");
    if (!payload) return null;
    const padded = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(padded + "==".slice(0, (4 - (padded.length % 4)) % 4));
    const parsed = JSON.parse(json);
    if (typeof parsed.exp === "number" && parsed.exp * 1000 < Date.now()) {
      return null;
    }
    if (
      typeof parsed.userId !== "number" ||
      typeof parsed.email !== "string" ||
      typeof parsed.login !== "string" ||
      typeof parsed.role !== "number"
    ) {
      return null;
    }
    return {
      userId: parsed.userId,
      email: parsed.email,
      login: parsed.login,
      role: parsed.role,
    };
  } catch {
    return null;
  }
}

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp("(?:^|; )" + name + "=([^;]*)")
  );
  return match ? decodeURIComponent(match[1]) : null;
}

const ADMIN_ROLE_THRESHOLD = 50; // ajustar quando o spec de roles for definido

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const token = readCookie("sga_auth");
    return token ? decodeJwt(token) : null;
  });

  useEffect(() => {
    // re-check periodically caso o cookie expire ou seja revalidado
    const interval = setInterval(() => {
      const token = readCookie("sga_auth");
      const next = token ? decodeJwt(token) : null;
      setUser((prev) => {
        if (!prev && !next) return prev;
        if (prev && next && prev.userId === next.userId) return prev;
        return next;
      });
    }, 30_000);
    return () => clearInterval(interval);
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      user,
      isAdmin: !!user && user.role >= ADMIN_ROLE_THRESHOLD,
      isAuthenticated: !!user,
      signOut: () => {
        document.cookie =
          "sga_auth=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT";
        setUser(null);
      },
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth precisa estar dentro de AuthProvider");
  }
  return ctx;
}
