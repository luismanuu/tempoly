import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button, LinkButton } from "../Button";
import { Input } from "../Input";
import { Container } from "../Container";
import { Mono } from "../Mono";
import { Display } from "../Display";

describe("Button", () => {
  it("renders as button by default", () => {
    render(<Button>Click</Button>);
    expect(screen.getByRole("button", { name: "Click" })).toBeInTheDocument();
  });

  it("renders as anchor when LinkButton with href", () => {
    render(<LinkButton href="/x">Go</LinkButton>);
    const a = screen.getByRole("link", { name: "Go" });
    expect(a).toHaveAttribute("href", "/x");
  });

  it("respects disabled attribute", () => {
    render(<Button disabled>Off</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});

describe("Input", () => {
  it("flags aria-invalid when invalid", () => {
    render(<Input invalid placeholder="email" />);
    expect(screen.getByPlaceholderText("email")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("omits aria-invalid when valid", () => {
    render(<Input placeholder="email" />);
    expect(screen.getByPlaceholderText("email")).not.toHaveAttribute(
      "aria-invalid",
    );
  });
});

describe("Container / Mono / Display", () => {
  it("Container wraps children with max width class", () => {
    render(<Container>x</Container>);
    expect(screen.getByText("x").parentElement).not.toBeNull();
  });

  it("Mono renders inline span by default", () => {
    render(<Mono>01 / 04</Mono>);
    expect(screen.getByText("01 / 04").tagName).toBe("SPAN");
  });

  it("Display.One renders h1", () => {
    render(<Display.One>Title</Display.One>);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Title");
  });
});
