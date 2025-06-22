import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-deep-space via-nebula-purple to-cosmic-blue text-white">
      <header className="py-6 px-4 sm:px-6 lg:px-8 bg-deep-space/50 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-star-gold">Stress-O-Scope</h1>
          <p className="text-sm text-gray-300 mt-1">
            An Interactive Journey Through Your Inner Cosmos
          </p>
        </div>
      </header>

      {/* Placeholder for ProgressBar - to be integrated properly later */}
      <div className="py-4 px-4 sm:px-6 lg:px-8 bg-deep-space/30">
        <div className="max-w-4xl mx-auto">
          {/* This div will eventually hold the ProgressBar component */}
          <div id="progress-bar-placeholder" className="h-8 bg-gray-700 rounded text-center text-xs flex items-center justify-center">
            Progress Bar Placeholder
          </div>
        </div>
      </div>

      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </main>

      <footer className="py-6 px-4 sm:px-6 lg:px-8 text-center bg-deep-space/50">
        <p className="text-xs text-gray-400">
          &copy; {new Date().getFullYear()} Stress-O-Scope. Explore your universe.
        </p>
        <p className="text-xs text-gray-500 mt-1">
          This app is for entertainment and self-reflection purposes only and does not provide medical advice.
        </p>
      </footer>
    </div>
  );
};

export default Layout;
