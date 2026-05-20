import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

type Row = Record<string, unknown> & { confirmed_at?: string | null };

// Shared in-memory state shared between mocks and assertions.
const state = {
  rows: [] as Row[],
  emailsSent: [] as { to: string; subject: string }[],
};

vi.mock("@/lib/supabase", () => {
  function from(_table: string) {
    void _table;
    const builder = {
      _filterEmail: undefined as string | undefined,
      _filterSpamFalse: false,
      _payload: undefined as Record<string, unknown> | undefined,
      _op: undefined as "select" | "insert" | "update" | undefined,

      insert(payload: Record<string, unknown>) {
        this._op = "insert";
        this._payload = payload;
        return Promise.resolve({ error: null }).then((r) => {
          state.rows.push({ ...payload });
          return r;
        });
      },
      select(_cols: string) {
        void _cols;
        this._op = "select";
        return this;
      },
      eq(col: string, val: unknown) {
        if (col === "is_spam" && val === false) this._filterSpamFalse = true;
        return this;
      },
      ilike(col: string, val: string) {
        if (col === "email") this._filterEmail = val.toLowerCase();
        return this;
      },
      maybeSingle() {
        const match = state.rows.find(
          (r) =>
            (!this._filterSpamFalse || r.is_spam === false) &&
            (!this._filterEmail ||
              String(r.email).toLowerCase() === this._filterEmail),
        );
        return Promise.resolve({ data: match ?? null, error: null });
      },
      update(payload: Record<string, unknown>) {
        this._op = "update";
        this._payload = payload;
        return this;
      },
      then(resolve: (v: { error: null }) => void) {
        // terminal `await` on builder after update(...).ilike(...).eq(...)
        if (this._op === "update" && this._filterEmail) {
          for (const r of state.rows) {
            const match =
              String(r.email).toLowerCase() === this._filterEmail &&
              (!this._filterSpamFalse || r.is_spam === false);
            if (match && this._payload) Object.assign(r, this._payload);
          }
        }
        resolve({ error: null });
      },
    };
    return builder;
  }
  return {
    supabaseAdmin: () => ({ from }),
  };
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
  WAITLIST_FROM: "test <test@tempoly.xyz>",
}));

import { POST } from "../route";

function postRequest(body: unknown, headers: Record<string, string> = {}) {
  return new Request("http://localhost/api/waitlist", {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

beforeEach(() => {
  state.rows = [];
  state.emailsSent = [];
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("POST /api/waitlist", () => {
  it("happy path: 200, row inserted, email sent, confirmed_at populated", async () => {
    const res = await POST(postRequest({ email: "lucho@tempoly.xyz" }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(state.rows).toHaveLength(1);
    expect(state.rows[0]).toMatchObject({
      email: "lucho@tempoly.xyz",
      is_spam: false,
    });
    expect(state.emailsSent).toHaveLength(1);
    expect(state.emailsSent[0]).toMatchObject({
      to: "lucho@tempoly.xyz",
      subject: "Estás en la lista — Tempoly",
    });
    expect(state.rows[0].confirmed_at).toBeTruthy();
  });

  it("honeypot triggered: 200, row marked is_spam, no email", async () => {
    const res = await POST(
      postRequest({
        email: "bot@example.com",
        website: "https://buy-pills.tld",
      }),
    );
    expect(res.status).toBe(200);
    expect(state.rows).toHaveLength(1);
    expect(state.rows[0]).toMatchObject({ is_spam: true });
    expect(state.emailsSent).toHaveLength(0);
  });

  it("invalid email: 400, nothing inserted, no email", async () => {
    const res = await POST(postRequest({ email: "not-an-email" }));
    expect(res.status).toBe(400);
    expect(state.rows).toHaveLength(0);
    expect(state.emailsSent).toHaveLength(0);
  });

  it("invalid JSON: 400", async () => {
    const res = await POST(postRequest("not json"));
    expect(res.status).toBe(400);
  });

  it("duplicate already confirmed: 200, no duplicate row, no duplicate email", async () => {
    state.rows.push({
      email: "dup@tempoly.xyz",
      is_spam: false,
      confirmed_at: "2026-05-01T00:00:00.000Z",
    });
    const res = await POST(postRequest({ email: "dup@tempoly.xyz" }));
    expect(res.status).toBe(200);
    expect(state.rows).toHaveLength(1);
    expect(state.emailsSent).toHaveLength(0);
  });

  it("duplicate not yet confirmed: 200, no duplicate row, email re-sent", async () => {
    state.rows.push({
      email: "retry@tempoly.xyz",
      is_spam: false,
      confirmed_at: null,
    });
    const res = await POST(postRequest({ email: "retry@tempoly.xyz" }));
    expect(res.status).toBe(200);
    expect(state.rows).toHaveLength(1);
    expect(state.emailsSent).toHaveLength(1);
  });

  it("captures user-agent and country headers", async () => {
    await POST(
      postRequest(
        { email: "geo@tempoly.xyz", name: "Geo Tester" },
        {
          "user-agent": "Mozilla/5.0",
          "x-vercel-ip-country": "EC",
        },
      ),
    );
    expect(state.rows[0]).toMatchObject({
      user_agent: "Mozilla/5.0",
      ip_country: "EC",
      name: "Geo Tester",
    });
  });
});
