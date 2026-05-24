// Supabase-backed MeasurementStore. Used by the Worker and the CLI's --live
// path only. Pure DB I/O (no engine calls), but it is reached only after the
// safety gate has been cleared, so it never runs in this build.

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { EngineSlug } from "../engines/types";
import type { LeaderboardSnapshot, PrevRanking } from "../aggregate/leaderboard";
import type {
  CitationRecord,
  LoadedIndustry,
  MeasurementStore,
  QueryRunRecord,
} from "./measure-industry";

export class SupabaseStore implements MeasurementStore {
  private engineIdBySlug: Map<string, string> | null = null;

  constructor(private readonly db: SupabaseClient) {}

  static fromEnv(env: Record<string, string | undefined>): SupabaseStore {
    const url = env.NEXT_PUBLIC_SUPABASE_URL ?? env.SUPABASE_URL;
    const key = env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
      throw new Error("SUPABASE url / SUPABASE_SERVICE_ROLE_KEY not set");
    }
    return new SupabaseStore(
      createClient(url, key, {
        auth: { persistSession: false, autoRefreshToken: false },
      }),
    );
  }

  private async engineId(slug: EngineSlug): Promise<string> {
    if (!this.engineIdBySlug) {
      const { data, error } = await this.db.from("engines").select("id, slug");
      if (error) throw error;
      this.engineIdBySlug = new Map(data.map((r) => [r.slug, r.id]));
    }
    const id = this.engineIdBySlug.get(slug);
    if (!id) throw new Error(`engine not found: ${slug}`);
    return id;
  }

  async loadIndustry(slug: string): Promise<LoadedIndustry> {
    const { data: industry, error: iErr } = await this.db
      .from("industries")
      .select("id")
      .eq("slug", slug)
      .single();
    if (iErr) throw iErr;
    const industryId = industry.id as string;

    const { data: companies, error: cErr } = await this.db
      .from("companies")
      .select("id, slug, name, full_name, aliases")
      .eq("industry_id", industryId)
      .eq("active", true);
    if (cErr) throw cErr;

    const { data: queries, error: qErr } = await this.db
      .from("queries")
      .select("id, text")
      .eq("industry_id", industryId)
      .is("archived_at", null);
    if (qErr) throw qErr;

    return {
      industryId,
      companies: companies.map((c) => ({
        id: c.id,
        slug: c.slug,
        names: [c.name, c.full_name, ...(c.aliases ?? [])].filter(
          (n): n is string => Boolean(n),
        ),
      })),
      queries: queries.map((q) => ({ id: q.id, text: q.text })),
    };
  }

  async insertQueryRun(rec: QueryRunRecord): Promise<{ id: string }> {
    const { data, error } = await this.db
      .from("query_runs")
      .insert({
        query_id: rec.queryId,
        engine_id: await this.engineId(rec.engineSlug),
        response_raw: rec.responseRaw,
        cost_usd: rec.costUsd,
        tokens_in: rec.tokensIn,
        tokens_out: rec.tokensOut,
        cache_hit: rec.cacheHit,
      })
      .select("id")
      .single();
    if (error) throw error;
    return { id: data.id };
  }

  async insertCitations(rows: CitationRecord[]): Promise<void> {
    const { error } = await this.db.from("citations").insert(
      rows.map((r) => ({
        query_run_id: r.queryRunId,
        company_id: r.companyId,
        position: r.position,
        snippet: r.snippet,
      })),
    );
    if (error) throw error;
  }

  async loadPrevRankings(
    industryId: string,
    weekStarting: string,
  ): Promise<PrevRanking[]> {
    const { data, error } = await this.db
      .from("leaderboard_snapshots")
      .select("rankings")
      .eq("industry_id", industryId)
      .lt("week_starting", weekStarting)
      .order("week_starting", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    if (!data) return [];
    return (data.rankings as { slug: string; position: number }[]).map((r) => ({
      slug: r.slug,
      position: r.position,
    }));
  }

  async saveSnapshot(
    industryId: string,
    snapshot: LeaderboardSnapshot,
  ): Promise<void> {
    const { error } = await this.db.from("leaderboard_snapshots").upsert(
      {
        industry_id: industryId,
        week_starting: snapshot.weekStarting,
        rankings: snapshot.rankings,
        total_queries: snapshot.totalQueries,
        engines_used: snapshot.enginesUsed,
      },
      { onConflict: "industry_id,week_starting" },
    );
    if (error) throw error;
  }
}
