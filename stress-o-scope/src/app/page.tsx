import Link from 'next/link';
import { Button } from '@/components/ui';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Stress-O-Scope - TEST MODERNA",
  description: "Test UI moderna funzionante",
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white p-8">
      <div className="max-w-4xl mx-auto text-center">
        
        <div className="mb-12">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-pink-500 to-blue-500 bg-clip-text text-transparent">
            🌌 UI MODERNA FUNZIONA! 🌌
          </h1>
          <p className="text-2xl text-gray-300 mb-8">
            Se vedi questo design colorato, la trasformazione è riuscita! ✨
          </p>
        </div>

        <div className="mb-12">
          <Link href="/game">
            <Button 
              variant="cosmic" 
              size="xl" 
              className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white px-8 py-4 rounded-2xl text-2xl shadow-2xl hover:scale-105 transition-all duration-300"
            >
              🚀 INIZIA IL TEST MODERNO! 🚀
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300">
            <div className="text-4xl mb-4">✨</div>
            <h3 className="text-2xl font-bold mb-4">Cosmic Calm</h3>
            <p className="text-gray-300">Glassmorphism moderno!</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300">
            <div className="text-4xl mb-4">🌟</div>
            <h3 className="text-2xl font-bold mb-4">Stellar Memory</h3>
            <p className="text-gray-300">Design 2025!</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300">
            <div className="text-4xl mb-4">🌌</div>
            <h3 className="text-2xl font-bold mb-4">Narrative Waves</h3>
            <p className="text-gray-300">Addio Windows 3.1!</p>
          </div>
        </div>

        <div className="mt-12 p-6 bg-green-500/20 rounded-2xl border border-green-500/30">
          <h2 className="text-3xl font-bold mb-4 text-green-400">✅ TRASFORMAZIONE RIUSCITA!</h2>
          <p className="text-green-300">
            Design moderno caricato correttamente!
          </p>
        </div>
      </div>
    </div>
  );
}
