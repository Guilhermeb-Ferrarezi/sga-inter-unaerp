import { render, act, renderHook } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { ThemeProvider, useTheme } from "./theme";

function wrapper({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}

describe("useTheme", () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.classList.remove("dark");
  });

  it("defaults to system preference", () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    expect(result.current.preference).toBe("system");
    // matchMedia is mocked to matches: false → light
    expect(result.current.theme).toBe("light");
  });

  it("toggles light → dark", () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    act(() => {
      result.current.toggle();
    });
    expect(result.current.theme).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("toggles dark → light", () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    act(() => {
      result.current.setPreference("dark");
    });
    act(() => {
      result.current.toggle();
    });
    expect(result.current.theme).toBe("light");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("persists preference in localStorage", () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    act(() => {
      result.current.setPreference("dark");
    });
    expect(window.localStorage.getItem("inter-unaerp-theme")).toBe("dark");
  });

  it("loads from localStorage on mount", () => {
    window.localStorage.setItem("inter-unaerp-theme", "dark");
    const { result } = renderHook(() => useTheme(), { wrapper });
    expect(result.current.preference).toBe("dark");
    expect(result.current.theme).toBe("dark");
  });

  it("applies theme-color meta tag", () => {
    const meta = document.createElement("meta");
    meta.name = "theme-color";
    meta.content = "#0A1A3D";
    document.head.appendChild(meta);
    const { result } = renderHook(() => useTheme(), { wrapper });
    act(() => {
      result.current.setPreference("dark");
    });
    expect(meta.getAttribute("content")).toBe("#060A1A");
    act(() => {
      result.current.setPreference("light");
    });
    expect(meta.getAttribute("content")).toBe("#0A1A3D");
    meta.remove();
  });
});

describe("ThemeProvider", () => {
  it("renders children", () => {
    const { getByText } = render(
      <ThemeProvider>
        <span>hello</span>
      </ThemeProvider>
    );
    expect(getByText("hello")).toBeInTheDocument();
  });
});
