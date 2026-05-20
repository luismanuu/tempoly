import { render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup } from "@testing-library/react";
import { Sparkline, trendOf } from "../Sparkline";

afterEach(() => cleanup());

describe("trendOf", () => {
  it("detects an up trend", () => {
    expect(trendOf([0.1, 0.2, 0.3, 0.4])).toBe("up");
  });
  it("detects a down trend", () => {
    expect(trendOf([0.5, 0.4, 0.3, 0.2])).toBe("down");
  });
  it("treats small movement as flat", () => {
    expect(trendOf([0.3, 0.305, 0.31, 0.31])).toBe("flat");
  });
});

describe("Sparkline", () => {
  it("renders an SVG path from values", () => {
    const { container } = render(<Sparkline values={[0.1, 0.2, 0.3]} />);
    const path = container.querySelector("path");
    expect(path).not.toBeNull();
    expect(path?.getAttribute("d")).toMatch(/^M/);
  });

  it("uses success color on an up trend", () => {
    const { container } = render(<Sparkline values={[0.1, 0.3, 0.5]} />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("data-trend")).toBe("up");
    expect(container.querySelector("path")?.getAttribute("stroke")).toBe(
      "var(--color-success)",
    );
  });

  it("uses warn color on a down trend", () => {
    const { container } = render(<Sparkline values={[0.5, 0.3, 0.1]} />);
    expect(container.querySelector("path")?.getAttribute("stroke")).toBe(
      "var(--color-warn)",
    );
  });
});
