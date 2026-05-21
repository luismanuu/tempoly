import { Resend } from "resend";

let cached: Resend | null = null;

export function resendClient(): Resend {
  if (cached) return cached;
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY missing");
  cached = new Resend(key);
  return cached;
}

export const CONTACT_FROM =
  process.env.CONTACT_FROM ?? "Tempoly <hola@tempoly.xyz>";

// Where internal lead notifications land.
export const CONTACT_NOTIFY = process.env.CONTACT_NOTIFY ?? "hola@tempoly.xyz";
