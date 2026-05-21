import { render, screen, cleanup } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("motion/react", async () => {
  const React = await import("react");
  return {
    motion: new Proxy(
      {},
      {
        get: () => {
          const Comp = (
            props: Record<string, unknown> & { children?: React.ReactNode },
          ) => {
            const { children, initial, animate, transition, ...rest } = props;
            void initial;
            void animate;
            void transition;
            return React.createElement(
              "div",
              rest as React.HTMLAttributes<HTMLDivElement>,
              children,
            );
          };
          Comp.displayName = "MotionStub";
          return Comp;
        },
      },
    ),
    useReducedMotion: () => true,
    useInView: () => false,
  };
});

import { HeroChatSequence } from "@/components/landing/HeroChatSequence";

afterEach(() => cleanup());

describe("HeroChatSequence (reduced motion)", () => {
  it("renders the first industry's real query and cited companies", () => {
    render(<HeroChatSequence />);
    expect(screen.getByTestId("hero-chat-user").textContent).toContain(
      "¿Cuál es la mejor universidad de Ecuador?",
    );
    const ai = screen.getByTestId("hero-chat-ai");
    expect(ai.textContent).toContain("USFQ");
    expect(ai.textContent).toContain("ESPOL");
  });

  it("reveals the top-5 leaderboard with real institution names", () => {
    render(<HeroChatSequence />);
    const reveal = screen.getByTestId("hero-leaderboard-reveal");
    expect(reveal.textContent).toContain("USFQ");
  });

  it("contains no leftover placeholder firm names or beta language", () => {
    render(<HeroChatSequence />);
    const html = document.body.innerHTML;
    expect(html).not.toMatch(/Firma [A-J]/);
    expect(html).not.toMatch(/preview|mockup|julio 2026/i);
  });
});
