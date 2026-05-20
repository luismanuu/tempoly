import { describe, expect, it } from "vitest";
import {
  WaitlistInput,
  confirmationEmailHtml,
  isHoneypotTriggered,
} from "../waitlist";

describe("WaitlistInput", () => {
  it("accepts minimal valid email", () => {
    const r = WaitlistInput.safeParse({ email: "a@b.co" });
    expect(r.success).toBe(true);
  });

  it("rejects non-email", () => {
    const r = WaitlistInput.safeParse({ email: "nope" });
    expect(r.success).toBe(false);
  });

  it("rejects oversized email", () => {
    const big = "a".repeat(201) + "@b.co";
    const r = WaitlistInput.safeParse({ email: big });
    expect(r.success).toBe(false);
  });
});

describe("isHoneypotTriggered", () => {
  it("returns true when website is non-empty", () => {
    expect(
      isHoneypotTriggered({ email: "a@b.co", website: "x" }),
    ).toBe(true);
  });

  it("returns false when website is missing", () => {
    expect(isHoneypotTriggered({ email: "a@b.co" })).toBe(false);
  });

  it("returns false when website is whitespace only", () => {
    expect(
      isHoneypotTriggered({ email: "a@b.co", website: "   " }),
    ).toBe(false);
  });
});

describe("confirmationEmailHtml", () => {
  it("includes greeting with name when provided", () => {
    const html = confirmationEmailHtml({
      email: "a@b.co",
      name: "Lucho",
    });
    expect(html).toContain("Hola Lucho,");
  });

  it("falls back to anonymous greeting when name missing", () => {
    const html = confirmationEmailHtml({ email: "a@b.co" });
    expect(html).toContain("Hola,");
  });

  it("escapes HTML in name", () => {
    const html = confirmationEmailHtml({
      email: "a@b.co",
      name: "<script>x</script>",
    });
    expect(html).not.toContain("<script>x</script>");
    expect(html).toContain("&lt;script&gt;");
  });
});
