import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { TeamLogo } from "./team-logo";

describe("TeamLogo", () => {
  it("renders shortName", () => {
    render(<TeamLogo shortName="OP" color="#0073B7" />);
    expect(screen.getByText("OP")).toBeInTheDocument();
  });

  it("applies background color", () => {
    render(<TeamLogo shortName="DR" color="#2EAA80" />);
    const logo = screen.getByText("DR");
    expect(logo).toHaveStyle({ background: "#2EAA80" });
  });

  it("uses dark text for light backgrounds (lime)", () => {
    render(<TeamLogo shortName="LX" color="#A4CD3A" />);
    const logo = screen.getByText("LX");
    expect(logo.className).toContain("text-navy");
  });

  it("uses white text for dark backgrounds (navy)", () => {
    render(<TeamLogo shortName="TH" color="#0A1A3D" />);
    const logo = screen.getByText("TH");
    expect(logo.className).toContain("text-white");
  });

  it("respects size variant", () => {
    const { rerender } = render(
      <TeamLogo shortName="OP" color="#000" size="xs" />
    );
    expect(screen.getByText("OP").className).toContain("w-6");
    rerender(<TeamLogo shortName="OP" color="#000" size="xl" />);
    expect(screen.getByText("OP").className).toContain("w-[120px]");
  });
});
