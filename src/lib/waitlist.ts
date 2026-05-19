import { z } from "zod";

export const WaitlistInput = z.object({
  email: z.string().email().max(200),
  name: z.string().max(120).optional(),
  role: z.string().max(120).optional(),
  company: z.string().max(120).optional(),
  industry: z.string().max(120).optional(),
  source: z.string().max(60).optional(),
  website: z.string().max(200).optional(), // honeypot
});

export type WaitlistInput = z.infer<typeof WaitlistInput>;

export type WaitlistOutcome =
  | { kind: "ok"; spam: false; created: boolean; sendEmail: boolean }
  | { kind: "ok"; spam: true; created: false; sendEmail: false }
  | { kind: "invalid"; errors: string[] };

export function parseWaitlist(raw: unknown): WaitlistOutcome | WaitlistInput {
  const r = WaitlistInput.safeParse(raw);
  if (!r.success) {
    return {
      kind: "invalid",
      errors: r.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`),
    };
  }
  return r.data;
}

export function isHoneypotTriggered(input: WaitlistInput): boolean {
  return typeof input.website === "string" && input.website.trim().length > 0;
}

export function confirmationEmailHtml(input: {
  email: string;
  name?: string;
}): string {
  const greet = input.name ? `Hola ${escapeHtml(input.name)},` : "Hola,";
  return `<!doctype html>
<html lang="es">
<body style="margin:0;background:#0a0a0a;color:#f4f1ea;font-family:Georgia,serif;">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px;">
    <p style="font-family:'JetBrains Mono',ui-monospace,monospace;font-size:12px;letter-spacing:0.18em;color:#777;text-transform:uppercase;margin:0 0 28px;">tempoly · waitlist</p>
    <h1 style="font-size:32px;line-height:1.15;font-weight:400;margin:0 0 16px;">Estás en la lista.</h1>
    <p style="font-family:system-ui,sans-serif;font-size:16px;line-height:1.55;color:#bdb7ad;margin:0 0 14px;">${greet}</p>
    <p style="font-family:system-ui,sans-serif;font-size:16px;line-height:1.55;color:#bdb7ad;margin:0 0 14px;">
      Gracias por sumarte a Tempoly. Empezamos con firmas legales tech en Ecuador y vamos abriendo nuevas industrias a medida que haya demanda.
    </p>
    <p style="font-family:system-ui,sans-serif;font-size:16px;line-height:1.55;color:#bdb7ad;margin:0 0 14px;">
      Si quieres priorizar la tuya, responde a este correo y cuéntanos qué sector y país te importa.
    </p>
    <p style="font-family:system-ui,sans-serif;font-size:14px;line-height:1.55;color:#777;margin:32px 0 0;">— Tempoly</p>
  </div>
</body>
</html>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
