import { describe, expect, it } from "vitest";
import {
  ContactInput,
  confirmationEmailHtml,
  internalNotificationHtml,
  isHoneypotTriggered,
} from "../contact";

describe("ContactInput", () => {
  it("accepts a minimal valid lead", () => {
    const r = ContactInput.safeParse({ name: "A", email: "a@b.co" });
    expect(r.success).toBe(true);
  });

  it("rejects a missing name", () => {
    const r = ContactInput.safeParse({ email: "a@b.co" });
    expect(r.success).toBe(false);
  });

  it("rejects a non-email", () => {
    const r = ContactInput.safeParse({ name: "A", email: "nope" });
    expect(r.success).toBe(false);
  });

  it("rejects an oversized message", () => {
    const r = ContactInput.safeParse({
      name: "A",
      email: "a@b.co",
      message: "x".repeat(2001),
    });
    expect(r.success).toBe(false);
  });
});

describe("isHoneypotTriggered", () => {
  it("true when website is filled", () => {
    expect(
      isHoneypotTriggered({ name: "A", email: "a@b.co", website: "x" }),
    ).toBe(true);
  });
  it("false when website is empty/whitespace", () => {
    expect(
      isHoneypotTriggered({ name: "A", email: "a@b.co", website: "  " }),
    ).toBe(false);
  });
});

describe("email templates escape user input", () => {
  it("confirmation escapes the name", () => {
    const html = confirmationEmailHtml({ name: "<script>x</script>" });
    expect(html).not.toContain("<script>x</script>");
    expect(html).toContain("&lt;script&gt;");
  });

  it("internal notification escapes message and renders fields", () => {
    const html = internalNotificationHtml({
      name: "Lucho",
      email: "a@b.co",
      company: "Acme & Co",
      message: "<b>hola</b>",
    });
    expect(html).toContain("Lucho");
    expect(html).toContain("Acme &amp; Co");
    expect(html).not.toContain("<b>hola</b>");
  });
});
