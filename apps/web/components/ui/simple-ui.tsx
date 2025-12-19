"use client";

import { AIInputWithSearch } from "@/components/ui/ai-input-with-search";
import { BlurFade } from "@/components/ui/blur-fade";
import { DotPattern } from "@/components/ui/dot-pattern";

const cards = Array.from({ length: 5 });

export default function SimpleUI() {
  const hour = new Date().getHours();
  const time = hour < 12 ? "Morning" : hour < 18 ? "Afternoon" : "Evening";

  return (
    <div className="min-h-screen w-full bg-black text-white flex flex-col items-center justify-start px-6 pt-24">

      <DotPattern />

      <header className="text-center mb-10 space-y-4">

        <BlurFade>
          <h1 className="text-5xl font-bold">Good {time}</h1>
        </BlurFade>
        <p className="text-muted-foreground mt-2">
          Ready to turn your ideas into art?
        </p>
      </header>

      <div className="w-full max-w-xl mx-auto mb-16">

        <AIInputWithSearch />
      </div>

      <section className="grid grid-cols-1 md:grid-cols-5 gap-4 relative z-10">
        {cards.map((_, i) => (
          <div
            key={i}
            className="h-[300px] bg-gray-200 dark:bg-gray-800 rounded-xl"
          />
        ))}
      </section>
    </div>
  );
}
