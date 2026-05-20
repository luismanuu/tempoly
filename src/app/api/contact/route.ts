import {
  ContactInput,
  confirmationEmailHtml,
  internalNotificationHtml,
  isHoneypotTriggered,
} from "@/lib/contact";
import { supabaseAdmin } from "@/lib/supabase";
import { resendClient, CONTACT_FROM, CONTACT_NOTIFY } from "@/lib/resend";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = ContactInput.safeParse(json);
  if (!parsed.success) {
    return Response.json(
      { error: "Revisa los campos: nombre y un correo válido son obligatorios." },
      { status: 400 },
    );
  }

  const input = parsed.data;
  const userAgent = req.headers.get("user-agent") ?? null;
  const ipCountry = req.headers.get("x-vercel-ip-country") ?? null;
  const supabase = supabaseAdmin();

  // Honeypot: bots fill it. We silently accept (200), log as spam, no email.
  if (isHoneypotTriggered(input)) {
    await supabase.from("leads").insert({
      name: input.name,
      email: input.email,
      company: input.company ?? null,
      industry: input.industry ?? null,
      message: input.message ?? null,
      source: input.source ?? "contacto",
      ip_country: ipCountry,
      user_agent: userAgent,
      is_spam: true,
    });
    return Response.json({ ok: true });
  }

  const { error: insertErr } = await supabase.from("leads").insert({
    name: input.name,
    email: input.email,
    company: input.company ?? null,
    industry: input.industry ?? null,
    message: input.message ?? null,
    source: input.source ?? "contacto",
    ip_country: ipCountry,
    user_agent: userAgent,
    is_spam: false,
  });
  if (insertErr) {
    console.error("contact.insert", insertErr);
    return Response.json({ error: "Error temporal" }, { status: 500 });
  }

  // Email is best-effort: the row is the source of truth.
  try {
    const resend = resendClient();
    await resend.emails.send({
      from: CONTACT_FROM,
      to: CONTACT_NOTIFY,
      replyTo: input.email,
      subject: `Nuevo lead — ${input.name}${input.company ? ` (${input.company})` : ""}`,
      html: internalNotificationHtml(input),
    });
    await resend.emails.send({
      from: CONTACT_FROM,
      to: input.email,
      subject: "Recibimos tu mensaje — Tempoly",
      html: confirmationEmailHtml({ name: input.name }),
    });
  } catch (err) {
    console.error("contact.email", err);
  }

  return Response.json({ ok: true });
}
