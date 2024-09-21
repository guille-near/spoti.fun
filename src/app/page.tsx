'use client'

import { SpotifyIsrcConverter } from "@/components/spotify-isrc-converter";
import DotPatternBackground from "@/components/dot-pattern-background";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <DotPatternBackground />
      <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <header className="w-full text-center">
          <h1 className="text-2xl font-bold mb-4">Spotify Track Info</h1>
        </header>
        
        <main className="w-full max-w-2xl">
          <SpotifyIsrcConverter />
        </main>
      </div>
    </div>
  );
}
