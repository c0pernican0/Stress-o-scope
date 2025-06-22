import Link from 'next/link';
import { Button } from '@/components/ui'; // Assuming Button is in ui/index.ts
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Stress-O-Scope - Welcome",
  description: "Welcome to Stress-O-Scope. Discover insights into your stress levels through interactive cosmic games.",
};

// Placeholder for a simple CSS animation class if needed for the background
// e.g., in globals.css:
// @keyframes subtleCosmicShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
// .animate-subtle-cosmic-shift { animation: subtleCosmicShift 30s ease infinite; background-size: 200% 200%; }

export default function HomePage() {
  return (
    // The main Layout component already provides the overall cosmic gradient background
    // This page's specific "cosmic background animation" could be an additional layer or effect if desired.
    // For now, we rely on the Layout's background. Add 'animate-subtle-cosmic-shift' if a specific animation is defined.
    <div className="flex flex-col items-center justify-center text-center text-white min-h-[calc(100vh-20rem)] px-4"> {/* Adjust min-h based on header/footer/progressbar approx height */}

      {/* Hero Section */}
      <section className="animate-fadeIn">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
          Welcome to <span className="text-star-gold">Stress-O-Scope</span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
          Embark on an interactive journey through a series of cosmic-themed games designed to
          provide insights into your stress levels and patterns. Discover your inner universe.
        </p>
        <Link href="/game" passHref>
          <Button variant="cosmic" size="lg" className="shadow-lg transform hover:scale-105">
            Inizia il Test (Start Test)
          </Button>
        </Link>
      </section>

      {/* Privacy Statement Highlight */}
      <section className="mt-16 sm:mt-24 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
        <div className="max-w-xl mx-auto p-6 bg-deep-space/50 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-nebula-purple mb-3">Your Privacy Matters</h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            Stress-O-Scope is designed with your privacy in mind. We do not collect or store any
            personal data from your gameplay. All analysis is performed based on in-session interactions
            and is not persisted. Enjoy your journey with peace of mind.
          </p>
        </div>
      </section>

      {/* Placeholder for additional content or animations */}
      {/* <div className="absolute inset-0 -z-10 cosmic-animation-placeholder"></div> */}
    </div>
  );
}
