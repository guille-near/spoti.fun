'use client'

import { SpotifyIsrcConverter } from "@/components/spotify-isrc-converter";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col">
      <div className="flex-grow flex flex-col items-center pt-8 sm:pt-16 px-4 sm:px-8">
        <header className="w-full text-center mb-6">
          <h1 className="text-3xl font-bold"></h1>
        </header>
        
        <main className="w-full max-w-xl">
          <SpotifyIsrcConverter />
        </main>
      </div>
      
      <footer className="sticky bottom-0 py-4 bg-black text-white text-center text-sm">
        <p className="flex items-center justify-center space-x-2">
          <span>spoti.fun &copy; 2024</span>
          <span>|</span>
          <a 
            href="instagram://user?username=diss.shit"
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-gray-300 transition-colors duration-200"
            onClick={(e) => {
              e.preventDefault();
              window.open('instagram://user?username=diss.shit', '_blank');
              setTimeout(() => {
                window.location.href = 'https://www.instagram.com/diss.shit';
              }, 500);
            }}
          >
            Made with ❤️ by Diss$hit
          </a>
        </p>
      </footer>
    </div>
  );
}