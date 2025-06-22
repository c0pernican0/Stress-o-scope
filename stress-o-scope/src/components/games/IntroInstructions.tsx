'use client';

import React from 'react';
import { useGameContext } from '@/context/GameContext';
import { Button } from '@/components/ui';

const IntroInstructions: React.FC = () => {
  const { nextGame } = useGameContext();

  const handleStart = () => {
    nextGame(); // This will advance currentGame from 0 to 1, starting CosmicCalm
  };

  return (
    <div className="p-6 md:p-8 rounded-lg shadow-xl bg-deep-space/70 text-white max-w-xl mx-auto text-center animate-fadeIn">
      <h2 className="text-3xl font-bold text-star-gold mb-6">Welcome to the Stress-O-Scope Journey!</h2>
      <p className="text-lg text-gray-300 mb-4 leading-relaxed">
        You are about to embark on a series of three short, interactive experiences designed to offer a glimpse into your current state of mind.
      </p>
      <p className="text-lg text-gray-300 mb-8 leading-relaxed">
        There are no right or wrong answers. Simply interact naturally and let your cosmic intuition guide you.
      </p>
      <Button onClick={handleStart} variant="cosmic" size="lg">
        Begin Your Cosmic Exploration
      </Button>
      <p className="text-xs text-gray-500 mt-8">
        Remember, this is for self-reflection and entertainment, not a diagnostic tool.
      </p>
    </div>
  );
};

export default IntroInstructions;
