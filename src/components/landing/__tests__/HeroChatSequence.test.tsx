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
            const {
              children,
              initial,
              animate,
              transition,
              whileInView,
              variants,
              ...rest
            } = props;
            void initial;
            void animate;
            void transition;
            void whileInView;
            void variants;
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
  it("renders the user query and AI response end-state when motion is reduced", () => {
    render(<HeroChatSequence />);
    const user = screen.getByTestId("hero-chat-user");
    const ai = screen.getByTestId("hero-chat-ai");
    expect(user.textContent).toContain(
      "¿Quién es la mejor firma de protección de datos personales en Ecuador?",
    );
    expect(ai.textContent).toContain("Firma A");
    expect(ai.textContent).toContain("Firma B");
    expect(ai.textContent).toContain("Firma C");
  });

  it("reveals the top-5 leaderboard in the locked end-state", () => {
    render(<HeroChatSequence />);
    const reveal = screen.getByTestId("hero-leaderboard-reveal");
    expect(reveal.textContent).toContain("Firma A");
    expect(reveal.textContent).toContain("Firma E");
    expect(reveal.textContent).toContain("73%");
  });

  it("renders only placeholder firm names — no real brands", () => {
    render(<HeroChatSequence />);
    const html = document.body.innerHTML;
    expect(html).not.toMatch(/Altius Lexia|Pérez Bustamante|Bustamante Fabara/);
  });
});
