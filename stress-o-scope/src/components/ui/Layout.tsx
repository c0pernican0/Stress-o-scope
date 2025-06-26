import React from 'react';
import ProgressBar from './ProgressBar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-void-black-900 via-nebula-purple-900 to-cosmic-blue-900 text-white relative overflow-hidden">
      
      {/* Background effects */}
      <div className="fixed inset-0 -z-10">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-void-black-950/50 via-transparent to-cosmic-blue-950/50 animate-pulse-slow"></div>
        
        {/* Subtle moving stars */}
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-px h-px bg-white rounded-full animate-twinkle opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Modern Header */}
      <header className="relative py-6 px-4 sm:px-6 lg:px-8 backdrop-blur-xl bg-white/10 shadow-2xl border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-4xl animate-float">🌌</div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-star-gold-400 via-aurora-pink-500 to-cosmic-blue-400 bg-clip-text text-transparent">
                Stress-O-Scope
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                Il tuo viaggio cosmico del benessere
              </p>
            </div>
          </div>
          
          {/* Optional: Add navigation or user info here */}
          <div className="hidden sm:flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <span>🔒</span>
              <span>Privato</span>
            </span>
            <span className="w-1 h-1 bg-slate-500 rounded-full"></span>
            <span className="flex items-center gap-1">
              <span>⚡</span>
              <span>Veloce</span>
            </span>
          </div>
        </div>
      </header>

      {/* Modern Progress Bar */}
      <div className="py-4 px-4 sm:px-6 lg:px-8 backdrop-blur-md bg-white/5 border-b border-white/10">
        <div className="max-w-6xl mx-auto">
          <ProgressBar />
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>

      {/* Modern Footer */}
      <footer className="relative py-8 px-4 sm:px-6 lg:px-8 text-center backdrop-blur-xl bg-white/5 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🌟</span>
              <div className="text-left">
                <p className="text-sm font-medium text-white">
                  &copy; {new Date().getFullYear()} Stress-O-Scope
                </p>
                <p className="text-xs text-slate-400">
                  Esplora il tuo universo interiore
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:items-end gap-1">
              <p className="text-xs text-slate-400 max-w-md">
                Questa app è per scopi di intrattenimento e auto-riflessione e non fornisce consigli medici.
              </p>
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span>🔒 Privacy garantita</span>
                <span>•</span>
                <span>🌌 Made with cosmic love</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
