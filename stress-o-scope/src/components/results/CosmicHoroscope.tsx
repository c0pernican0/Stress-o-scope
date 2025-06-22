'use client';

import React, { useState, useEffect } from 'react';

interface CosmicHoroscopeProps {
  horoscope: string;
}

const CosmicHoroscope: React.FC<CosmicHoroscopeProps> = ({ horoscope }) => {
  const [displayedHoroscope, setDisplayedHoroscope] = useState('');
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    if (horoscope && horoscope.length > 0) {
      setIsRevealed(false); // Reset for potential prop changes
      setDisplayedHoroscope(''); // Clear previous
      let charIndex = 0;
      const intervalId = setInterval(() => {
        setDisplayedHoroscope((prev) => prev + horoscope[charIndex]);
        charIndex++;
        if (charIndex === horoscope.length) {
          clearInterval(intervalId);
          setIsRevealed(true);
        }
      }, 30); // Adjust speed of reveal here (milliseconds per character)

      return () => clearInterval(intervalId); // Cleanup on unmount or prop change
    } else {
        setDisplayedHoroscope("Your cosmic path is currently unwritten. Explore and discover!");
        setIsRevealed(true);
    }
  }, [horoscope]);

  return (
    <div className="p-6 bg-gradient-to-br from-nebula-purple/30 via-cosmic-blue/40 to-deep-space/50 rounded-xl shadow-xl animate-fadeIn mt-8">
      <h3 className="text-2xl font-bold text-star-gold mb-4 text-center">Cosmic Horoscope</h3>
      <div
        className="text-lg text-gray-200 leading-relaxed italic text-center min-h-[4em]" // min-h for layout consistency
        aria-live="polite"
        aria-atomic="true"
      >
        {displayedHoroscope}
        {!isRevealed && (
            <span
                className="inline-block w-2 h-5 bg-star-gold animate-pulse ml-1"
                aria-hidden="true"
                style={{ animationDuration: '0.7s' }}
            /> /* Blinking cursor */
        )}
      </div>
    </div>
  );
};

export default CosmicHoroscope;
