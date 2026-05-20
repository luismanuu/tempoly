"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Mono } from "@/components/ui/Mono";

type Variant = "hero" | "inline";

type Props = {
  variant?: Variant;
};

type Status =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "ok"; email: string }
  | { kind: "error"; message: string };

export function WaitlistForm({ variant = "hero" }: Props) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status.kind === "loading") return;

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      email: String(data.get("email") || ""),
      name: String(data.get("name") || "") || undefined,
      company: String(data.get("company") || "") || undefined,
      role: String(data.get("role") || "") || undefined,
      industry: String(data.get("industry") || "") || undefined,
      website: String(data.get("website") || ""),
    };

    setStatus({ kind: "loading" });
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        setStatus({
          kind: "error",
          message: body.error || "No pudimos registrarte. Reintenta en un momento.",
        });
        return;
      }
      setStatus({ kind: "ok", email: payload.email });
    } catch {
      setStatus({
        kind: "error",
        message: "Error de red. Reintenta.",
      });
    }
  }

  if (status.kind === "ok") {
    return (
      <div className="border border-[var(--color-success)] bg-[var(--color-bg-elev)] p-5">
        <Mono className="text-[var(--color-success)]">en la lista</Mono>
        <p className="mt-2 text-[var(--color-fg)]">
          Te confirmamos en {status.email}. Si no llega en 5 minutos, revisa spam o
          escríbenos a hola@tempoly.xyz.
        </p>
      </div>
    );
  }

  const compact = variant === "inline";

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className={compact ? "flex w-full max-w-xl flex-col gap-3 sm:flex-row" : "flex w-full max-w-xl flex-col gap-3"}
    >
      <label htmlFor={`wl-email-${variant}`} className="sr-only">
        Correo electrónico
      </label>
      <Input
        id={`wl-email-${variant}`}
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder="tu@empresa.com"
        invalid={status.kind === "error"}
        className={compact ? "flex-1" : undefined}
      />

      {/* Honeypot — bots fill it, humans skip. CSS-hidden, aria-hidden, autocomplete off. */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-9999px",
          width: "1px",
          height: "1px",
          overflow: "hidden",
        }}
      >
        <label htmlFor={`wl-hp-${variant}`}>Tu sitio web (no rellenar)</label>
        <input
          id={`wl-hp-${variant}`}
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <Button
        type="submit"
        size={compact ? "md" : "lg"}
        disabled={status.kind === "loading"}
      >
        {status.kind === "loading" ? "Enviando…" : "Sumarme"}
      </Button>

      {status.kind === "error" ? (
        <p
          role="alert"
          className="text-sm text-[var(--color-warn)] sm:basis-full"
        >
          {status.message}
        </p>
      ) : null}
    </form>
  );
}
