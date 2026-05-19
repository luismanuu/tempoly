import {
  WaitlistInput,
  confirmationEmailHtml,
  isHoneypotTriggered,
} from "@/lib/waitlist";
import { supabaseAdmin } from "@/lib/supabase";
import { resendClient, WAITLIST_FROM } from "@/lib/resend";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = WaitlistInput.safeParse(json);
  if (!parsed.success) {
    return Response.json(
      {
        error: "Email inválido. Revisa tu correo.",
      },
      { status: 400 },
    );
  }

  const input = parsed.data;
  const userAgent = req.headers.get("user-agent") ?? null;
  const ipCountry = req.headers.get("x-vercel-ip-country") ?? null;

  // Honeypot: bots fill it. We silently accept (200), log as spam, no email.
  if (isHoneypotTriggered(input)) {
    const supabase = supabaseAdmin();
    await supabase.from("signups").insert({
      email: input.email,
      name: input.name ?? null,
      role: input.role ?? null,
      company: input.company ?? null,
      industry: input.industry ?? null,
      source: input.source ?? "landing-v0",
      ip_country: ipCountry,
      user_agent: userAgent,
      honeypot: input.website ?? null,
      is_spam: true,
    });
    return Response.json({ ok: true });
  }

  const supabase = supabaseAdmin();

  // Idempotent: if email already exists (non-spam), skip insert + skip email.
  const { data: existing, error: selectErr } = await supabase
    .from("signups")
    .select("id, confirmed_at")
    .eq("is_spam", false)
    .ilike("email", input.email)
    .maybeSingle();

  if (selectErr) {
    console.error("waitlist.select", selectErr);
    return Response.json({ error: "Error temporal" }, { status: 500 });
  }

  let sendEmail = false;

  if (!existing) {
    const { error: insertErr } = await supabase.from("signups").insert({
      email: input.email,
      name: input.name ?? null,
      role: input.role ?? null,
      company: input.company ?? null,
      industry: input.industry ?? null,
      source: input.source ?? "landing-v0",
      ip_country: ipCountry,
      user_agent: userAgent,
      is_spam: false,
    });
    if (insertErr) {
      console.error("waitlist.insert", insertErr);
      return Response.json({ error: "Error temporal" }, { status: 500 });
    }
    sendEmail = true;
  } else if (!existing.confirmed_at) {
    // Existing row but no confirmation sent → re-send.
    sendEmail = true;
  }

  if (sendEmail) {
    try {
      const resend = resendClient();
      await resend.emails.send({
        from: WAITLIST_FROM,
        to: input.email,
        subject: "Estás en la lista — Tempoly",
        html: confirmationEmailHtml({
          email: input.email,
          name: input.name,
        }),
      });
      await supabase
        .from("signups")
        .update({ confirmed_at: new Date().toISOString() })
        .ilike("email", input.email)
        .eq("is_spam", false);
    } catch (err) {
      // Don't fail the request if Resend hiccups — row is saved, we can retry.
      console.error("waitlist.email", err);
    }
  }

  return Response.json({ ok: true });
}
