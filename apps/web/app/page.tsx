"use client";

import { useEffect, useMemo, useState } from "react";
import PosterWallBackground from "@/components/poster-wall-bg";

type Movie = {
  id: number;
  title: string;
  year: number;
  popularity: number;
  genres?: string[];
  poster_url?: string; // backend should return ABSOLUTE URL
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8000";

function cn(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(" ");
}

export default function Page() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(20);
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        setError(null);
        setLoading(true);

        const res = await fetch(`${API_BASE}/api/v1/?limit=${limit}`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
        const data = await res.json();

        setMovies(Array.isArray(data) ? data : []);
      } catch (e: any) {
        setError(e?.message ?? "Failed to load movies");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [limit]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return movies;
    return movies.filter((m) => m.title.toLowerCase().includes(q));
  }, [movies, query]);

  const posters = useMemo(() => {
    // Use loaded posters for background
    return movies
      .map((m) => m.poster_url)
      .filter((p): p is string => Boolean(p && p.trim().length > 0));
  }, [movies]);

  const topPick = filtered[0];

  return (
    <div className="relative min-h-screen text-white">
      {/* ✅ Poster background BEHIND everything */}
      <PosterWallBackground posters={posters} columns={7} />

      {/* Foreground content */}
      <main className="relative z-10">
        {/* Top nav */}
        <header className="sticky top-0 z-20 border-b border-white/10 bg-black/35 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-white/10" />
              <div className="leading-tight">
                <div className="text-xs text-white/60">WatchThis</div>
                <div className="text-lg font-semibold">WatchThisAI</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10">
                Browse
              </button>
              <button className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-white/90">
                Login
              </button>
            </div>
          </div>
        </header>

        {/* Hero */}
        <section className="mx-auto max-w-6xl px-6 pb-10 pt-12">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
            <div>
              <div className="text-sm text-white/60">{greeting}</div>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
                Find something worth <br className="hidden sm:block" />
                watching tonight.
              </h1>
              <p className="mt-4 max-w-xl text-white/65">
                Search fast, skim clean cards, pick a movie. No noise.
              </p>

              {/* Controls */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search movies by title..."
                  className="h-12 w-full max-w-md rounded-full border border-white/10 bg-white/5 px-5 text-white placeholder:text-white/40 outline-none focus:border-white/25"
                />

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-sm text-white/60">
                    <span>Limit</span>
                    <select
                      className="h-12 rounded-full border border-white/10 bg-white/5 px-4 text-white/80 outline-none focus:border-white/25"
                      value={limit}
                      onChange={(e) => setLimit(Number(e.target.value))}
                    >
                      {[10, 20, 30, 50, 100].map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="h-12 rounded-full border border-white/10 bg-white/5 px-5 text-sm text-white/80 hover:bg-white/10"
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div className="mt-3 text-xs text-white/40">
                {loading
                  ? "Loading..."
                  : `Showing ${filtered.length} of ${movies.length} · API: ${API_BASE}`}
              </div>

              {error && (
                <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
                  {error}
                </div>
              )}
            </div>

            {/* Top pick card */}
            <div className="lg:pt-10">
              {topPick ? (
                <div className="rounded-3xl border border-white/10 bg-black/35 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.05)] backdrop-blur-md">
                  <div className="flex items-center justify-between text-xs text-white/50">
                    <span className="font-medium text-white/70">Top pick</span>
                    <span>#{topPick.id}</span>
                  </div>

                  <div className="mt-4 flex gap-4">
                    <div className="h-16 w-16 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                      {topPick.poster_url ? (
                        <img
                          src={topPick.poster_url}
                          alt={topPick.title}
                          className="h-full w-full object-cover"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : null}
                    </div>

                    <div className="min-w-0">
                      <div className="truncate text-lg font-semibold">
                        {topPick.title}
                      </div>
                      <div className="mt-1 text-sm text-white/60">
                        {topPick.year} · Popularity {topPick.popularity}
                      </div>

                      {topPick.genres?.length ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {topPick.genres.slice(0, 6).map((g) => (
                            <span
                              key={g}
                              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70"
                            >
                              {g}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-3xl border border-white/10 bg-black/25 p-6 text-white/60">
                  No top pick yet.
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Browse */}
        <section className="mx-auto max-w-6xl px-6 pb-16">
          <div className="flex items-end justify-between">
            <h2 className="text-lg font-semibold">Browse</h2>
            <div className="text-xs text-white/40">Type to filter instantly</div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {!loading &&
              filtered.map((m) => (
                <div
                  key={m.id}
                  className={cn(
                    "group rounded-3xl border border-white/10 bg-black/35 p-5 backdrop-blur-md",
                    "shadow-[0_0_0_1px_rgba(255,255,255,0.04)]",
                    "transition hover:bg-black/45 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.08)]"
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex gap-4">
                      <div className="h-14 w-14 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                        {m.poster_url ? (
                          <img
                            src={m.poster_url}
                            alt={m.title}
                            className="h-full w-full object-cover transition group-hover:scale-[1.03]"
                            loading="lazy"
                            decoding="async"
                          />
                        ) : null}
                      </div>

                      <div className="min-w-0">
                        <div className="truncate font-semibold">{m.title}</div>
                        <div className="mt-1 text-sm text-white/60">
                          {m.year} · Popularity {m.popularity}
                        </div>
                      </div>
                    </div>

                    <div className="text-xs text-white/40">#{m.id}</div>
                  </div>

                  {m.genres?.length ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {m.genres.slice(0, 5).map((g) => (
                        <span
                          key={g}
                          className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70"
                        >
                          {g}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}

            {loading && (
              <div className="text-sm text-white/60">Loading movies...</div>
            )}

            {!loading && !filtered.length && (
              <div className="text-sm text-white/60">
                No movies match your search.
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
