import { createContext, useContext, useMemo } from "react";
import { gql, useQuery } from "@apollo/client";

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
  loading: boolean;
  signOut: () => void;
};

const AuthContext = createContext<AuthState | null>(null);

const ME_QUERY = gql`
  query Me {
    me {
      userId
      email
      login
      role
    }
  }
`;

// Role 1 = admin no auth-api da SGA (ADMIN_ROLE constante no platform-user-repository.ts)
const ADMIN_ROLE = 1;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data, loading, refetch } = useQuery<{ me: AuthUser | null }>(
    ME_QUERY,
    {
      fetchPolicy: "cache-and-network",
      errorPolicy: "all",
    }
  );

  const user = data?.me ?? null;

  const value = useMemo<AuthState>(
    () => ({
      user,
      loading,
      isAdmin: !!user && user.role === ADMIN_ROLE,
      isAuthenticated: !!user,
      signOut: () => {
        // Cookie é HttpOnly em .santos-games.com — não dá pra remover via JS.
        // Redirecionar pra um endpoint logout da auth-api seria o correto.
        // Por ora, só refetch (servidor decide se o cookie ainda é válido).
        document.cookie =
          "sga_auth=; Path=/; Domain=.santos-games.com; Expires=Thu, 01 Jan 1970 00:00:01 GMT";
        refetch();
      },
    }),
    [user, loading, refetch]
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
