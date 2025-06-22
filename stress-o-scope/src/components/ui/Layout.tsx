import React from 'react';
import ProgressBar from './ProgressBar'; // Import the actual ProgressBar

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-deep-space via-nebula-purple to-cosmic-blue text-white">
      <header className="py-6 px-4 sm:px-6 lg:px-8 bg-deep-space/50 shadow-lg sticky top-0 z-50">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-star-gold">Stress-O-Scope</h1>
          <p className="text-sm text-gray-300 mt-1">
            An Interactive Journey Through Your Inner Cosmos
          </p>
        </div>
      </header>

      {/* Actual ProgressBar Integration - Placed directly after header, part of normal flow */}
      <div className="py-3 px-4 sm:px-6 lg:px-8 bg-deep-space/40 shadow-md">
        <ProgressBar />
      </div>

      {/* Adjust padding-top for main content to account for the sticky header height */}
      {/* Assuming header is roughly h-24 (6rem) to h-28 (7rem) tall with padding and text */}
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10"> {/* Simplified padding */}
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
