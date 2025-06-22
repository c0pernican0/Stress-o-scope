'use client';

import React from 'react';
import { useGameContext } from '@/context/GameContext';
import StressProfile from './StressProfile';
import Recommendations from './Recommendations';
import CosmicHoroscope from './CosmicHoroscope';
import GamePerformanceSummary from './GamePerformanceSummary';
import { LoadingSpinner, Button } from '@/components/ui';
// import { useRouter } from 'next/navigation'; // For Task #9

const ResultsSummary: React.FC = () => {
  const {
    state: {
      finalAnalysis,
      analysisLoading,
      analysisError,
      cosmicResults,
      memoryResults,
      narrativeResults
    },
    resetSession
  } = useGameContext();
  // const router = useRouter(); // For Task #9

  const handleTakeTestAgain = () => {
    resetSession();
    // router.push('/'); // Navigation will be handled in Task #9
    // For now, we can log or alert that the session is reset
    alert("Session Reset! You would be navigated to the home page.");
    // Or, more gracefully, perhaps the page itself will react to context change.
  };

  if (analysisLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-white">
        <LoadingSpinner size="lg" text="Analyzing your cosmic waves..." />
      </div>
    );
  }

  if (analysisError) {
    return (
      <div className="p-6 bg-red-800/50 rounded-xl shadow-xl text-center text-white animate-fadeIn">
        <h3 className="text-2xl font-bold text-red-300 mb-4">Analysis Error</h3>
        <p className="text-red-200 mb-6">{analysisError}</p>
        <Button onClick={handleTakeTestAgain} variant="secondary">
          Try Again
        </Button>
      </div>
    );
  }

  if (!finalAnalysis) {
    return (
      <div className="p-6 bg-deep-space/50 rounded-xl shadow-xl text-center text-white animate-fadeIn">
        <h3 className="text-2xl font-bold text-star-gold mb-4">Analysis Not Available</h3>
        <p className="text-gray-300 mb-6">
          The stress analysis data could not be loaded. Please try completing the games again.
        </p>
        <Button onClick={handleTakeTestAgain} variant="primary">
          Start New Test
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      <div className="p-6 bg-gradient-to-r from-nebula-purple/60 to-cosmic-blue/60 rounded-xl shadow-2xl text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">Your Stress-O-Scope Results</h2>
        <p className="text-lg sm:text-xl text-gray-200 italic">
          {finalAnalysis.summary}
        </p>
      </div>

      <StressProfile
        stressLevel={finalAnalysis.stressLevel}
        stressAreas={finalAnalysis.stressAreas}
      />

      <Recommendations recommendationsList={finalAnalysis.recommendations} />

      <CosmicHoroscope horoscope={finalAnalysis.cosmicHoroscope} />

      <GamePerformanceSummary
        cosmicResults={cosmicResults}
        memoryResults={memoryResults}
        narrativeResults={narrativeResults}
      />

      <div className="mt-12 text-center">
        <Button onClick={handleTakeTestAgain} variant="cosmic" size="lg">
          Take Test Again
        </Button>
      </div>
    </div>
  );
};

export default ResultsSummary;
