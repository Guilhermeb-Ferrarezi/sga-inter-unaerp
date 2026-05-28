import { createContext, useContext, useEffect, useState, useMemo } from "react";

type Theme = "light" | "dark";
type ThemePreference = Theme | "system";

interface ThemeState {
  theme: Theme;
  preference: ThemePreference;
  setPreference: (p: ThemePreference) => void;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeState | null>(null);
const STORAGE_KEY = "inter-unaerp-theme";

function readPreference(): ThemePreference {
  if (typeof window === "undefined") return "system";
  const stored = window.localStorage.getItem(STORAGE_KEY) as
    | ThemePreference
    | null;
  if (stored === "light" || stored === "dark" || stored === "system") {
    return stored;
  }
  return "system";
}

function systemTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", theme === "dark");
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", theme === "dark" ? "#060A1A" : "#0A1A3D");
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>(() =>
    readPreference()
  );
  const [theme, setTheme] = useState<Theme>(() => {
    const pref = readPreference();
    return pref === "system" ? systemTheme() : pref;
  });

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    if (preference === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const update = () => setTheme(mq.matches ? "dark" : "light");
      mq.addEventListener("change", update);
      return () => mq.removeEventListener("change", update);
    }
    return undefined;
  }, [preference]);

  const setPreference = (p: ThemePreference) => {
    setPreferenceState(p);
    window.localStorage.setItem(STORAGE_KEY, p);
    setTheme(p === "system" ? systemTheme() : p);
  };

  const value = useMemo<ThemeState>(
    () => ({
      theme,
      preference,
      setPreference,
      toggle: () => setPreference(theme === "dark" ? "light" : "dark"),
    }),
    [theme, preference]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme precisa estar dentro de ThemeProvider");
  }
  return ctx;
}
