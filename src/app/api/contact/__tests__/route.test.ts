import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

type Row = Record<string, unknown>;

const state = {
  rows: [] as Row[],
  emailsSent: [] as { to: string; subject: string }[],
};

vi.mock("@/lib/supabase", () => {
  function from(_table: string) {
    void _table;
    return {
      insert(payload: Record<string, unknown>) {
        state.rows.push({ ...payload });
        return Promise.resolve({ error: null });
      },
    };
  }
  return { supabaseAdmin: () => ({ from }) };
});

vi.mock("@/lib/resend", () => ({
  resendClient: () => ({
    emails: {
      send: async (msg: { to: string | string[]; subject: string }) => {
        state.emailsSent.push({
          to: Array.isArray(msg.to) ? msg.to[0] : msg.to,
          subject: msg.subject,
        });
        return { data: { id: "test" }, error: null };
      },
    },
  }),
  CONTACT_FROM: "test <test@tempoly.xyz>",
  CONTACT_NOTIFY: "hola@tempoly.xyz",
}));

import { POST } from "../route";

function postRequest(body: unknown, headers: Record<string, string> = {}) {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

beforeEach(() => {
  state.rows = [];
  state.emailsSent = [];
});

afterEach(() => vi.clearAllMocks());

describe("POST /api/contact", () => {
  it("happy path: 200, lead inserted, internal + confirmation emails sent", async () => {
    const res = await POST(
      postRequest({
        name: "Lucho",
        email: "lucho@tempoly.xyz",
        company: "Acme",
        industry: "Bancos",
        message: "Quiero aparecer en la IA.",
      }),
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(state.rows).toHaveLength(1);
    expect(state.rows[0]).toMatchObject({
      name: "Lucho",
      email: "lucho@tempoly.xyz",
      company: "Acme",
      industry: "Bancos",
      is_spam: false,
    });
    // internal notification + submitter confirmation
    expect(state.emailsSent).toHaveLength(2);
    expect(state.emailsSent.map((e) => e.to)).toContain("hola@tempoly.xyz");
    expect(state.emailsSent.map((e) => e.to)).toContain("lucho@tempoly.xyz");
  });

  it("honeypot triggered: 200, row marked is_spam, no email", async () => {
    const res = await POST(
      postRequest({
        name: "Bot",
        email: "bot@example.com",
        website: "https://buy-pills.tld",
      }),
    );
    expect(res.status).toBe(200);
    expect(state.rows).toHaveLength(1);
    expect(state.rows[0]).toMatchObject({ is_spam: true });
    expect(state.emailsSent).toHaveLength(0);
  });

  it("missing name: 400, nothing inserted", async () => {
    const res = await POST(postRequest({ email: "a@b.co" }));
    expect(res.status).toBe(400);
    expect(state.rows).toHaveLength(0);
  });

  it("invalid email: 400, nothing inserted", async () => {
    const res = await POST(postRequest({ name: "X", email: "not-email" }));
    expect(res.status).toBe(400);
    expect(state.rows).toHaveLength(0);
  });

  it("invalid JSON: 400", async () => {
    const res = await POST(postRequest("not json"));
    expect(res.status).toBe(400);
  });

  it("captures user-agent and country headers", async () => {
    await POST(
      postRequest(
        { name: "Geo", email: "geo@tempoly.xyz" },
        { "user-agent": "Mozilla/5.0", "x-vercel-ip-country": "EC" },
      ),
    );
    expect(state.rows[0]).toMatchObject({
      user_agent: "Mozilla/5.0",
      ip_country: "EC",
    });
  });
});
