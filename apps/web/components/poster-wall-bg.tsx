"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

type Props = {
  posters: string[]; // absolute URLs recommended
  className?: string;
  columns?: number; // default 7
  tileWidth?: number; // default 180
  tileHeight?: number; // default 270
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function makeLoop<T>(arr: T[], targetLen: number) {
  if (!arr.length) return [];
  const out: T[] = [];
  for (let i = 0; i < targetLen; i++) out.push(arr[i % arr.length]);
  return out;
}

export default function PosterWallBackground({
  posters,
  className,
  columns = 7,
  tileWidth = 180,
  tileHeight = 270,
}: Props) {
  const safeColumns = clamp(columns, 4, 10);

  const grid = useMemo(() => {
    // We build more tiles than needed so scrolling motion never shows empty gaps.
    const rowsPerCol = 10; // looks good for 1080p/1440p
    const totalTiles = safeColumns * rowsPerCol;

    const cleaned = posters
      .filter(Boolean)
      .map((p) => String(p).trim())
      .filter((p) => p.length > 0);

    // If backend is slow or empty, show placeholder dark tiles (no broken icons)
    const usable = cleaned.length ? cleaned : [];

    const looped = makeLoop(usable, totalTiles);

    const cols: string[][] = Array.from({ length: safeColumns }, () => []);
    for (let i = 0; i < totalTiles; i++) {
      cols[i % safeColumns].push(looped[i] ?? "");
    }
    return cols;
  }, [posters, safeColumns]);

  return (
    <div
      className={[
        "pointer-events-none fixed inset-0 -z-10 overflow-hidden",
        className ?? "",
      ].join(" ")}
      aria-hidden="true"
    >
      {/* Base darkness */}
      <div className="absolute inset-0 bg-black" />

      {/* Poster wall */}
      <div className="absolute inset-0">
        {/* Mask so posters fade at edges */}
        <div
          className="absolute inset-0"
          style={{
            maskImage:
              "radial-gradient(80% 70% at 50% 45%, black 40%, transparent 72%)",
            WebkitMaskImage:
              "radial-gradient(80% 70% at 50% 45%, black 40%, transparent 72%)",
          }}
        >
          <div className="absolute left-1/2 top-1/2 h-[140vh] w-[140vw] -translate-x-1/2 -translate-y-1/2">
            <div className="flex h-full w-full items-center justify-center gap-4">
              {grid.map((col, colIdx) => {
                // Different speeds per column for a natural feel
                const duration = 18 + (colIdx % 4) * 6; // 18..36s
                const direction = colIdx % 2 === 0 ? 1 : -1;
                const drift = 42 + (colIdx % 3) * 18; // pixels

                return (
                  <motion.div
                    key={colIdx}
                    className="flex flex-col gap-4"
                    style={{
                      width: tileWidth,
                    }}
                    initial={{ y: direction * drift }}
                    animate={{ y: direction * -drift }}
                    transition={{
                      duration,
                      repeat: Infinity,
                      repeatType: "mirror",
                      ease: "easeInOut",
                    }}
                  >
                    {col.map((url, i) => {
                      const hasPoster = Boolean(url);
                      return (
                        <div
                          key={`${colIdx}-${i}`}
                          className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
                          style={{
                            width: tileWidth,
                            height: tileHeight,
                          }}
                        >
                          {hasPoster ? (
                            // Using <img> so you DON'T need next/image remotePatterns setup
                            <img
                              src={url}
                              alt=""
                              loading="lazy"
                              decoding="async"
                              className="h-full w-full object-cover opacity-80"
                              onError={(e) => {
                                // Hide broken images cleanly
                                const el = e.currentTarget;
                                el.style.display = "none";
                              }}
                            />
                          ) : null}

                          {/* soft dark overlay per tile */}
                          <div className="absolute inset-0 bg-black/35" />

                          {/* subtle top highlight */}
                          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/20" />
                        </div>
                      );
                    })}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Overall vignette + readability layers (NO blur) */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/45 to-black/75" />
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_30%_20%,rgba(255,255,255,0.06),transparent_60%)]" />
      </div>
    </div>
  );
}
