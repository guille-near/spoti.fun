'use client'

import { SpotifyIsrcConverter } from "@/components/spotify-isrc-converter";
import { Toaster } from "@/components/ui/toaster";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col">
      <div className="flex-grow grid grid-rows-[auto_1fr] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <header className="w-full text-center">
          <h1 className="text-2xl font-bold mb-4">Enjoy Spoti.fun!</h1>
        </header>
        
        <main className="w-full max-w-2xl">
          <SpotifyIsrcConverter />
        </main>
      </div>
      
      <footer className="sticky bottom-0 py-4 bg-black text-white text-center text-sm font-[family-name:var(--font-geist-sans)]">
        <p className="flex items-center justify-center space-x-2">
          <span>spoti.fun &copy; 2024</span>
          <span>|</span>
          <a 
            href="https://instagram.com/diss.shit" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-gray-300 transition-colors duration-200"
          >
            by Diss$hit
          </a>
        </p>
      </footer>
      
      <Toaster />
    </div>
  );
}