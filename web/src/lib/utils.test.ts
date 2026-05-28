import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("cn (className merger)", () => {
  it("joins classes", () => {
    expect(cn("a", "b", "c")).toBe("a b c");
  });

  it("dedupes conflicting tailwind utilities (last wins)", () => {
    expect(cn("p-4", "p-8")).toBe("p-8");
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
  });

  it("handles conditional classes", () => {
    expect(cn("a", false && "b", "c", undefined, null)).toBe("a c");
  });

  it("handles object syntax", () => {
    expect(cn({ a: true, b: false, c: true })).toBe("a c");
  });

  it("handles arrays", () => {
    expect(cn(["a", "b"], "c")).toBe("a b c");
  });
});
