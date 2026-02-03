"use client";

import { useEffect, useMemo, useState } from "react";
import PosterWallBackground from "@/components/poster-wall-bg";
import Sidebar from "@/components/sidebar";
import ChatBubble from "@/components/chat-bubble";
import { Search, Star, Play, ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Movie = {
  id: number;
  title: string;
  year: number;
  popularity: number;
  genres?: string[];
  poster_url?: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8000";

export default function Page() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [skip, setSkip] = useState(0);
  const [limit] = useState(20);
  const [query, setQuery] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // AI State
  const [aiMessage, setAiMessage] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);

  // Time-based greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 5) return "Up late?";
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  }, []);

  const loadMovies = async (newSkip: number, isMore = false, searchQuery = query) => {
    try {
      if (!isMore) {
        setLoading(true);
        // Only trigger "AI Thinking" on new fresh searches with a query
        if (searchQuery && newSkip === 0) {
          setIsThinking(true);
          setAiMessage(null);
        }
      } else {
        setLoadingMore(true);
      }
      setError(null);

      const qs = new URLSearchParams({
        limit: limit.toString(),
        skip: newSkip.toString(),
      });
      if (searchQuery) qs.set("q", searchQuery);

      // Simulate AI "Thinking" delay for effect if searching
      if (searchQuery && newSkip === 0) {
        await new Promise(r => setTimeout(r, 800));
      }

      const res = await fetch(`${API_BASE}/api/v1/?${qs.toString()}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
      const data = await res.json();

      if (Array.isArray(data)) {
        setMovies(prev => isMore ? [...prev, ...data] : data);
        setHasMore(data.length === limit);
        setSkip(newSkip);

        // Generate AI Message
        if (newSkip === 0) {
          if (searchQuery) {
            // Mock smart response
            const count = data.length;
            const genresv = data[0]?.genres?.slice(0, 2).join(" & ") || "Cinema";
            setAiMessage(`I've found ${count} ${searchQuery} titles for you. Dive into some ${genresv} gems!`);
          } else {
            setAiMessage(null); // Clear message on reset
          }
        }
      }
    } catch (e: any) {
      setError(e?.message ?? "Failed to load movies");
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setIsThinking(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadMovies(0);
  }, []);

  // Debounced Search
  useEffect(() => {
    const timer = setTimeout(() => {
      loadMovies(0, false, query);
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  const handleLoadMore = () => {
    loadMovies(skip + limit, true);
  };

  const filtered = movies;

  const posters = useMemo(() => {
    return movies
      .map((m) => m.poster_url)
      .filter((p): p is string => Boolean(p && p.trim().length > 0));
  }, [movies]);

  const topPick = filtered[0];

  return (
    <div className="flex min-h-screen bg-black font-sans selection:bg-white/20">

      {/* Sidebar */}
      <Sidebar className="hidden md:flex shrink-0" />

      {/* Main Content Wrapper */}
      <div className="relative flex-1 flex flex-col min-w-0">

        <PosterWallBackground posters={posters} columns={8} />

        {/* Content Scrollable Area */}
        <main className="relative z-10 flex flex-col flex-1 overflow-x-hidden">

          {/* Header */}
          <header className="sticky top-0 z-50 border-b border-white/5 bg-black/60 backdrop-blur-xl">
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
              <div className="flex items-center gap-3 md:hidden">
                <div className="w-8" />
                <div className="leading-tight">
                  <div className="text-xl font-bold font-display tracking-tight text-white">WatchThis</div>
                </div>
              </div>

              <div className="hidden md:block text-sm font-medium text-white/40">
                {greeting}
              </div>

              <div className="flex items-center gap-4 ml-auto">
                <button className="rounded-full bg-white px-5 py-2 text-sm font-bold text-black transition hover:bg-white/90 active:scale-95">
                  Sign In
                </button>
              </div>
            </div>
          </header>

          {/* Hero Section */}
          <div className="mx-auto w-full max-w-7xl px-6 pt-12 pb-20 lg:pt-20">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              {/* Left Col */}
              <div className="relative">
                {/* Aurora */}
                <div className="absolute -left-20 -top-20 -z-10 h-[400px] w-[400px] rounded-full bg-blue-500/10 blur-[120px] opacity-40" />

                {/* Greeting Badge */}
                <div className="inline-flex items-center gap-2 rounded-full border border-white/5 bg-white/5 px-3 py-1 text-xs font-medium text-white/50 backdrop-blur-md mb-8">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  {greeting}
                </div>

                <h1 className="font-display text-5xl font-bold tracking-tight leading-[1.1] sm:text-6xl lg:text-7xl">
                  WatchThis <span className="text-white/40">AI</span>
                </h1>

                <p className="mt-4 text-xl text-white/60 font-light">
                  Let's find something to watch.
                </p>

                {/* Conversational Input */}
                <div className="mt-8 relative max-w-2xl">
                  <div className="relative flex flex-col gap-4">
                    <div className="relative group">
                      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-white/10 to-transparent opacity-0 group-focus-within:opacity-100 transition duration-500 blur-md" />
                      <div className="relative flex items-center bg-white rounded-2xl p-2 shadow-2xl shadow-indigo-500/10 transition-transform active:scale-[0.99]">
                        <div className="pl-4 pr-3">
                          <div className="h-8 w-8 rounded-full bg-black flex items-center justify-center">
                            <Play className="h-3 w-3 fill-white text-white ml-0.5" />
                          </div>
                        </div>
                        <input
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                          placeholder="What are you in the mood for?"
                          className="flex-1 h-14 bg-transparent text-lg text-black placeholder:text-black/40 font-medium focus:outline-none"
                        />
                        {query && (
                          <button onClick={() => setQuery("")} className="mr-2 p-2 rounded-full hover:bg-black/5 transition">
                            <X className="h-5 w-5 text-black/40" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Mood Chips */}
                    <div className="flex flex-wrap gap-2">
                      {["Chill", "Thrilling", "Laugh", "Cry", "Learn", "Sci-Fi"].map(mood => (
                        <button
                          key={mood}
                          onClick={() => setQuery(mood)}
                          className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white hover:border-white/20 transition active:scale-95"
                        >
                          {mood}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="mt-10 flex items-center gap-6 text-xs font-medium text-white/30">
                  <span className="flex items-center gap-1.5">
                    <div className="h-1 w-1 rounded-full bg-white/40" />
                    {loading && !movies.length ? "Syncing..." : `${filtered.length} Movies Loaded`}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <div className="h-1 w-1 rounded-full bg-white/40" />
                    Real-time Popularity
                  </span>
                </div>
              </div>

              {/* Right Col: Top Pick (Spotlight) */}
              <div className="lg:pl-10">
                <AnimatePresence mode="wait">
                  {!isThinking && topPick ? (
                    <motion.div
                      key={topPick.id}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="relative group rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-black/40 p-1 backdrop-blur-2xl shadow-2xl"
                    >
                      <div className="rounded-[20px] bg-black/40 p-6 overflow-hidden relative">
                        {/* Spotlight Glow */}
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-indigo-500/20 blur-[80px]" />

                        <div className="relative flex gap-6 items-start">
                          <div className="shrink-0 relative rounded-xl overflow-hidden shadow-lg border border-white/10">
                            {topPick.poster_url && (
                              <img
                                src={topPick.poster_url}
                                className="h-48 w-32 object-cover"
                                alt={topPick.title}
                              />
                            )}
                          </div>
                          <div className="flex-1 min-w-0 pt-2">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white text-black">Top Pick</span>
                              {topPick.year && <span className="px-2 py-0.5 rounded text-[10px] font-bold border border-white/20 text-white/70">{topPick.year}</span>}
                            </div>
                            <h3 className="text-3xl font-display font-bold leading-tight truncate pr-4">{topPick.title}</h3>

                            <div className="mt-4 flex flex-wrap gap-2">
                              {topPick.genres?.slice(0, 3).map(g => (
                                <span key={g} className="text-xs text-white/60 bg-white/5 px-2 py-1 rounded-md border border-white/5">{g}</span>
                              ))}
                            </div>

                            <div className="mt-6 flex items-center gap-4">
                              <button className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-bold text-black hover:bg-white/90 transition shadow-lg shadow-white/10">
                                <Play className="h-4 w-4 fill-current" /> Watch Trailer
                              </button>
                              <div className="flex flex-col">
                                <span className="text-[10px] uppercase text-white/40 tracking-wider">Popularity</span>
                                <span className="text-sm font-semibold">{topPick.popularity.toFixed(0)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ) : isThinking ? (
                    <div className="h-64 flex flex-col gap-4 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-white/40 animate-pulse">
                      <span className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="text-sm font-medium">AI is thinking...</span>
                    </div>
                  ) : (
                    <div className="h-64 flex items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-white/40">
                      No movies found
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Browse Section */}
          <div className="flex-1 border-t border-white/5 bg-black/40 backdrop-blur-sm">
            <div className="mx-auto max-w-7xl px-6 py-12">

              {/* AI Chat Bubble */}
              <AnimatePresence>
                {(aiMessage || isThinking) && (
                  <div className="mb-12">
                    <ChatBubble message={aiMessage || ""} isThinking={isThinking} />
                  </div>
                )}
              </AnimatePresence>

              <div className="flex items-end justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-display font-semibold">Trending Now</h2>
                  <p className="text-sm text-white/50 mt-1">Movies tailored to your taste</p>
                </div>
                <button className="text-sm font-medium text-white/60 hover:text-white flex items-center gap-1 transition">
                  View all <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {loading && !movies.length ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="h-32 rounded-2xl bg-white/5 animate-pulse" />
                  ))
                ) : (
                  filtered.slice(1).map((m) => (
                    <div key={m.id} className="group relative flex gap-4 rounded-2xl border border-white/5 bg-white/5 p-3 transition duration-300 hover:bg-white/10 hover:border-white/10 hover:-translate-y-1">
                      <div className="shrink-0 h-24 w-16 bg-black/50 rounded-lg overflow-hidden relative shadow-sm">
                        {m.poster_url && (
                          <img src={m.poster_url} className="h-full w-full object-cover transition duration-500 group-hover:scale-110" alt="" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <h3 className="font-semibold text-base leading-tight truncate pr-2 group-hover:text-blue-300 transition-colors">{m.title}</h3>
                        <div className="mt-1.5 flex items-center gap-2 text-xs text-white/50">
                          <span>{m.year}</span>
                          <span className="h-1 w-1 rounded-full bg-white/20" />
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-500/80 fill-current" />
                            {m.popularity > 0 ? (m.popularity / 10).toFixed(1) : "N/A"}
                          </span>
                        </div>
                        <div className="mt-2.5 flex flex-wrap gap-1.5">
                          {m.genres?.slice(0, 2).map(g => (
                            <span key={g} className="text-[10px] text-white/40 bg-black/20 px-1.5 py-0.5 rounded border border-white/5">{g}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {hasMore && !query && (
                <div className="mt-12 text-center">
                  <button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="rounded-full bg-white/10 px-8 py-3 text-sm font-medium text-white hover:bg-white/20 disabled:opacity-50 transition"
                  >
                    {loadingMore ? "Loading..." : "Load More Movies"}
                  </button>
                </div>
              )}

              {!loading && filtered.length === 0 && (
                <div className="col-span-full py-20 text-center">
                  <div className="mx-auto h-24 w-24 rounded-full bg-white/5 flex items-center justify-center mb-4">
                    <Search className="h-10 w-10 text-white/20" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">No movies found</h3>
                  <p className="text-white/40 mt-2">We couldn't find any matches for "{query}"</p>
                  <button onClick={() => setQuery("")} className="mt-6 rounded-full bg-white px-6 py-2 text-sm font-bold text-black border border-transparent hover:bg-white/90 transition">
                    Clear Search
                  </button>
                </div>
              )}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
