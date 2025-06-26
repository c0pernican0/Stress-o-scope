import Link from 'next/link';
import { Button } from '@/components/ui';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Stress-O-Scope - Il Viaggio Cosmico del Benessere",
  description: "Scopri il tuo livello di stress attraverso un'esperienza interattiva unica nel cosmo. Tre giochi coinvolgenti per esplorare il tuo universo interiore.",
};

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background with animated stars */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-void-black-900 via-nebula-purple-900 to-cosmic-blue-900"></div>
        
        {/* Animated background stars */}
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
        
        {/* Larger glowing orbs */}
        {[...Array(8)].map((_, i) => (
          <div
            key={`orb-${i}`}
            className="absolute w-3 h-3 bg-gradient-to-br from-star-gold-400 to-aurora-pink-500 rounded-full animate-float opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              filter: 'blur(1px)',
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center text-center text-white min-h-screen px-4">
        
        {/* Hero Section */}
        <section className="animate-in slide-in-from-bottom duration-700 max-w-6xl mx-auto">
          
          {/* Main title with modern effects */}
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-8 animate-float">
              <span className="text-2xl">🌌</span>
              <span className="text-sm font-medium text-slate-200">La Nuova Era del Self-Assessment</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-star-gold-400 via-aurora-pink-500 to-cosmic-blue-400 bg-clip-text text-transparent animate-shimmer">
                Stress-O-Scope
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl md:text-3xl text-slate-300 mb-8 font-light max-w-4xl mx-auto leading-relaxed">
              Un viaggio interattivo attraverso tre universi cosmici per scoprire i segreti del tuo benessere interiore
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link href="/game" passHref>
                <Button variant="gradient" size="xl" className="group shadow-2xl shadow-star-gold-500/25 animate-glow">
                  <span className="flex items-center gap-3">
                    <span className="text-2xl group-hover:rotate-12 transition-transform duration-300">🚀</span>
                    <span>Inizia l'Esplorazione</span>
                  </span>
                </Button>
              </Link>
              
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <span>⏱️ 5-7 minuti</span>
                <span>•</span>
                <span>🔒 100% Privato</span>
                <span>•</span>
                <span>🎮 Interattivo</span>
              </div>
            </div>
          </div>

          {/* Feature cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-20 animate-in slide-in-from-bottom duration-700" style={{animationDelay: '0.3s'}}>
            
            {/* Cosmic Calm Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-star-gold-500/20 to-aurora-pink-500/20 rounded-3xl blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative p-8 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 h-full">
                <div className="text-5xl mb-4 animate-float">✨</div>
                <h3 className="text-2xl font-bold text-white mb-4">Cosmic Calm</h3>
                <p className="text-slate-300 leading-relaxed">
                  Crea la tua costellazione personale e scopri il tuo elemento cosmico attraverso domande introspettive guidate dall'universo.
                </p>
              </div>
            </div>

            {/* Stellar Memory Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-cosmic-blue-500/20 to-nebula-purple-500/20 rounded-3xl blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative p-8 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 h-full">
                <div className="text-5xl mb-4 animate-float" style={{animationDelay: '1s'}}>🌟</div>
                <h3 className="text-2xl font-bold text-white mb-4">Stellar Memory</h3>
                <p className="text-slate-300 leading-relaxed">
                  Un Simon cosmico con tecniche di respirazione integrate per misurare la tua gestione dello stress cognitivo.
                </p>
              </div>
            </div>

            {/* Narrative Waves Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-aurora-pink-500/20 to-nebula-purple-500/20 rounded-3xl blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative p-8 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 h-full">
                <div className="text-5xl mb-4 animate-float" style={{animationDelay: '2s'}}>🌌</div>
                <h3 className="text-2xl font-bold text-white mb-4">Narrative Waves</h3>
                <p className="text-slate-300 leading-relaxed">
                  Una storia interattiva che analizza i tuoi pattern decisionali e rivela il tuo profilo psicologico nascosto.
                </p>
              </div>
            </div>
          </div>

          {/* Results preview */}
          <div className="animate-in slide-in-from-bottom duration-700" style={{animationDelay: '0.6s'}}>
            <div className="relative max-w-4xl mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-star-gold-500/10 via-aurora-pink-500/10 to-cosmic-blue-500/10 rounded-3xl blur-2xl"></div>
              <div className="relative p-8 md:p-12 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  La tua Analisi Cosmica Personalizzata
                </h2>
                <div className="grid md:grid-cols-2 gap-8 text-left">
                  <div>
                    <h3 className="text-xl font-semibold text-star-gold-400 mb-3">🎯 Analisi Precisa</h3>
                    <p className="text-slate-300 leading-relaxed">
                      Algoritmi AI avanzati analizzano i tuoi pattern comportamentali per fornire insights personalizzati sul tuo livello di stress.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-aurora-pink-400 mb-3">🔮 Raccomandazioni Pratiche</h3>
                    <p className="text-slate-300 leading-relaxed">
                      Ricevi consigli specifici e tecniche di gestione dello stress basate sul tuo profilo cosmico unico.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-cosmic-blue-400 mb-3">🌟 Oroscopo del Benessere</h3>
                    <p className="text-slate-300 leading-relaxed">
                      Un oroscopo motivazionale personalizzato che collega il tuo stato emotivo con l'energia cosmica.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-nebula-purple-400 mb-3">🔒 Privacy Totale</h3>
                    <p className="text-slate-300 leading-relaxed">
                      Zero tracciamento, zero storage di dati personali. La tua esperienza rimane completamente privata.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-20 animate-in slide-in-from-bottom duration-700" style={{animationDelay: '0.9s'}}>
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Pronto per il tuo viaggio cosmico?
              </h2>
              <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                Unisciti a migliaia di esploratori che hanno già scoperto i segreti del loro universo interiore.
              </p>
              <Link href="/game" passHref>
                <Button variant="cosmic" size="xl" className="animate-pulse-slow shadow-2xl shadow-cosmic-blue-500/30">
                  <span className="flex items-center gap-3">
                    <span>🚀</span>
                    <span>Inizia Ora - È Gratuito</span>
                    <span>✨</span>
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
