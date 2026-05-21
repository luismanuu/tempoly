"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Mono } from "@/components/ui/Mono";

const INDUSTRIES = ["Universidades", "Bancos", "Hospitales", "Otra"];

type Props = {
  source?: string;
  defaultCompany?: string;
  defaultIndustry?: string;
  defaultMessage?: string;
};

type Status =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "ok" }
  | { kind: "error"; message: string };

const fieldLabel =
  "block font-(family-name:--font-mono) text-[0.7rem] uppercase tracking-[0.16em] text-[var(--color-fg-subtle)]";

export function ContactForm({
  source = "contacto",
  defaultCompany,
  defaultIndustry,
  defaultMessage,
}: Props) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status.kind === "loading") return;

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") || ""),
      email: String(data.get("email") || ""),
      company: String(data.get("company") || "") || undefined,
      industry: String(data.get("industry") || "") || undefined,
      message: String(data.get("message") || "") || undefined,
      website: String(data.get("website") || ""),
      source,
    };

    setStatus({ kind: "loading" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        setStatus({
          kind: "error",
          message: body.error || "No pudimos enviar tu mensaje. Reintenta en un momento.",
        });
        return;
      }
      setStatus({ kind: "ok" });
    } catch {
      setStatus({ kind: "error", message: "Error de red. Reintenta." });
    }
  }

  if (status.kind === "ok") {
    return (
      <div className="border border-[var(--color-success)] bg-[var(--color-bg-elev)] p-6">
        <Mono className="text-[var(--color-success)]">mensaje recibido</Mono>
        <p className="mt-3 text-lg text-[var(--color-fg)]">
          Gracias. Te respondemos en menos de 24 horas hábiles.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="grid w-full max-w-2xl gap-5"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-name" className={fieldLabel}>
            Nombre
          </label>
          <Input
            id="cf-name"
            name="name"
            required
            autoComplete="name"
            placeholder="Tu nombre"
            className="mt-2"
          />
        </div>
        <div>
          <label htmlFor="cf-email" className={fieldLabel}>
            Correo
          </label>
          <Input
            id="cf-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="tu@empresa.com"
            invalid={status.kind === "error"}
            className="mt-2"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-company" className={fieldLabel}>
            Empresa
          </label>
          <Input
            id="cf-company"
            name="company"
            autoComplete="organization"
            placeholder="Tu empresa o institución"
            defaultValue={defaultCompany}
            className="mt-2"
          />
        </div>
        <div>
          <label htmlFor="cf-industry" className={fieldLabel}>
            Industria
          </label>
          <select
            id="cf-industry"
            name="industry"
            defaultValue={defaultIndustry ?? ""}
            className="mt-2 h-12 w-full border border-[var(--color-border)] bg-[var(--color-bg-elev)] px-4 font-(family-name:--font-sans) text-[0.95rem] text-[var(--color-fg)] focus:border-[var(--color-success)] focus:outline-none focus:ring-2 focus:ring-[var(--color-success)]"
          >
            <option value="">Selecciona…</option>
            {INDUSTRIES.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="cf-message" className={fieldLabel}>
          Cuéntanos tu caso
        </label>
        <textarea
          id="cf-message"
          name="message"
          rows={4}
          defaultValue={defaultMessage}
          placeholder="¿Qué quieres lograr? ¿Apareces hoy cuando tu cliente le pregunta a la IA?"
          className="mt-2 w-full border border-[var(--color-border)] bg-[var(--color-bg-elev)] px-4 py-3 font-(family-name:--font-sans) text-[0.95rem] text-[var(--color-fg)] placeholder:text-[var(--color-fg-subtle)] focus:border-[var(--color-success)] focus:outline-none focus:ring-2 focus:ring-[var(--color-success)]"
        />
      </div>

      {/* Honeypot — bots fill it, humans skip. CSS-hidden, aria-hidden. */}
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
        <label htmlFor="cf-hp">Tu sitio web (no rellenar)</label>
        <input id="cf-hp" type="text" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" size="lg" disabled={status.kind === "loading"}>
          {status.kind === "loading" ? "Enviando…" : "Hablemos"}
        </Button>
        {status.kind === "error" ? (
          <p role="alert" className="text-sm text-[var(--color-warn)]">
            {status.message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
