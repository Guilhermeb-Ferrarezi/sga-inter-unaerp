import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { AuthProvider, useAuth } from "./auth";

function wrapper({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}

// HS256 token cuja payload é { userId: 7, email: 'a@b.c', login: 'guilherme', role: 99, exp: <futuro> }
// Para teste só precisamos do formato de 3 partes — a verificação criptográfica
// é feita no backend; o cliente só lê os claims.
function makeToken(payload: Record<string, unknown>) {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
  const body = btoa(JSON.stringify(payload))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
  return `${header}.${body}.fakesignature`;
}

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${value}; Path=/`;
}

function clearCookie(name: string) {
  document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT`;
}

describe("useAuth", () => {
  beforeEach(() => {
    clearCookie("sga_auth");
  });

  it("starts unauthenticated when no cookie", () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isAdmin).toBe(false);
  });

  it("decodes valid JWT from cookie", () => {
    const token = makeToken({
      userId: 7,
      email: "guilherme@example.com",
      login: "guilherme",
      role: 99,
      exp: Math.floor(Date.now() / 1000) + 3600,
    });
    setCookie("sga_auth", token);
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.user?.userId).toBe(7);
    expect(result.current.user?.login).toBe("guilherme");
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.isAdmin).toBe(true); // role 99 > threshold 50
  });

  it("treats expired token as unauthenticated", () => {
    const token = makeToken({
      userId: 7,
      email: "g@e.com",
      login: "g",
      role: 99,
      exp: Math.floor(Date.now() / 1000) - 100,
    });
    setCookie("sga_auth", token);
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.isAuthenticated).toBe(false);
  });

  it("non-admin role is authenticated but not admin", () => {
    const token = makeToken({
      userId: 1,
      email: "user@x.com",
      login: "user",
      role: 10,
      exp: Math.floor(Date.now() / 1000) + 3600,
    });
    setCookie("sga_auth", token);
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.isAdmin).toBe(false);
  });

  it("signOut clears cookie and user", () => {
    const token = makeToken({
      userId: 1,
      email: "x@y.z",
      login: "u",
      role: 99,
      exp: Math.floor(Date.now() / 1000) + 3600,
    });
    setCookie("sga_auth", token);
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.isAuthenticated).toBe(true);
    act(() => {
      result.current.signOut();
    });
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it("malformed token treated as no auth", () => {
    setCookie("sga_auth", "garbage");
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.user).toBeNull();
  });
});
