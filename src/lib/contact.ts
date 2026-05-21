import { z } from "zod";

export const ContactInput = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().max(200),
  company: z.string().max(160).optional(),
  industry: z.string().max(80).optional(),
  message: z.string().max(2000).optional(),
  source: z.string().max(60).optional(),
  website: z.string().max(200).optional(), // honeypot
});

export type ContactInput = z.infer<typeof ContactInput>;

export function isHoneypotTriggered(input: ContactInput): boolean {
  return typeof input.website === "string" && input.website.trim().length > 0;
}

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Confirmation sent to the person who reached out.
export function confirmationEmailHtml(input: { name: string }): string {
  const greet = `Hola ${escapeHtml(input.name)},`;
  return `<!doctype html>
<html lang="es">
<body style="margin:0;background:#0a0a0a;color:#f4f1ea;font-family:Georgia,serif;">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px;">
    <p style="font-family:'JetBrains Mono',ui-monospace,monospace;font-size:12px;letter-spacing:0.18em;color:#777;text-transform:uppercase;margin:0 0 28px;">tempoly · contacto</p>
    <h1 style="font-size:32px;line-height:1.15;font-weight:400;margin:0 0 16px;">Recibimos tu mensaje.</h1>
    <p style="font-family:system-ui,sans-serif;font-size:16px;line-height:1.55;color:#bdb7ad;margin:0 0 14px;">${greet}</p>
    <p style="font-family:system-ui,sans-serif;font-size:16px;line-height:1.55;color:#bdb7ad;margin:0 0 14px;">
      Gracias por escribirnos. Medimos cómo aparecen las empresas ecuatorianas en ChatGPT, Claude, Perplexity y Gemini, y ayudamos a las que quieren aparecer. Revisamos tu caso y te respondemos en menos de 24 horas hábiles.
    </p>
    <p style="font-family:system-ui,sans-serif;font-size:14px;line-height:1.55;color:#777;margin:32px 0 0;">— Tempoly</p>
  </div>
</body>
</html>`;
}

// Internal notification to the Tempoly inbox.
export function internalNotificationHtml(input: ContactInput): string {
  const rows: Array<[string, string | undefined]> = [
    ["Nombre", input.name],
    ["Email", input.email],
    ["Empresa", input.company],
    ["Industria", input.industry],
    ["Origen", input.source],
  ];
  const meta = rows
    .filter(([, v]) => v)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:4px 12px 4px 0;color:#777;font-size:13px;">${k}</td><td style="padding:4px 0;color:#f4f1ea;font-size:13px;">${escapeHtml(String(v))}</td></tr>`,
    )
    .join("");
  const message = input.message
    ? escapeHtml(input.message).replace(/\n/g, "<br>")
    : "(sin mensaje)";
  return `<!doctype html>
<html lang="es">
<body style="margin:0;background:#0a0a0a;color:#f4f1ea;font-family:system-ui,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:32px 24px;">
    <p style="font-family:'JetBrains Mono',ui-monospace,monospace;font-size:12px;letter-spacing:0.18em;color:#777;text-transform:uppercase;margin:0 0 20px;">tempoly · nuevo lead</p>
    <table style="border-collapse:collapse;margin:0 0 20px;">${meta}</table>
    <div style="border-top:1px solid #222;padding-top:16px;font-size:15px;line-height:1.6;color:#bdb7ad;">${message}</div>
  </div>
</body>
</html>`;
}
