'use client';

import React, { useEffect } from 'react';
import { useGameContext } from '@/context/GameContext';
import { useRouter } from 'next/navigation'; // Using App Router's navigation

import IntroInstructions from '@/components/games/IntroInstructions';
import CosmicCalm from '@/components/games/CosmicCalm';
import StellarMemory from '@/components/games/StellarMemory';
import NarrativeWaves from '@/components/games/NarrativeWaves';
import { LoadingSpinner } from '@/components/ui';
import type { Metadata } from 'next';

// Note: `export const metadata` for dynamic titles based on game state is complex in client components.
// Static metadata can be set, or title updates could be managed via a client-side effect on document.title.
// For now, a generic title for the game page.
// export const metadata: Metadata = {
// title: "Stress-O-Scope - The Games",
// description: "Engage in interactive games to gain insights into your stress levels.",
// };
// Metadata export is for Server Components, so it won't work directly here.
// We can set a static title in a parent layout or use useEffect for document.title.

const GamePage: React.FC = () => {
  const { state } = useGameContext();
  const { currentGame, isComplete, finalAnalysis, analysisLoading } = state;
  const router = useRouter();

  useEffect(() => {
    // If all games are complete and analysis is done (or not loading and no error), redirect to results.
    // This also handles the case where a user might try to navigate back to /game after finishing.
    if (isComplete && (finalAnalysis || (!analysisLoading && !state.analysisError))) {
      router.replace('/results');
    }
  }, [isComplete, finalAnalysis, analysisLoading, state.analysisError, router]);

  useEffect(() => {
    // Update document title based on current game
    let title = "Stress-O-Scope - The Journey";
    if(currentGame === 0) title = "Stress-O-Scope - Introduction";
    else if(currentGame === 1) title = "Stress-O-Scope - Cosmic Calm";
    else if(currentGame === 2) title = "Stress-O-Scope - Stellar Memory";
    else if(currentGame === 3) title = "Stress-O-Scope - Narrative Waves";
    else if(isComplete) title = "Stress-O-Scope - Analysis"; // Should be on /results by now
    document.title = title;
  }, [currentGame, isComplete]);


  const renderCurrentGame = () => {
    switch (currentGame) {
      case 0:
        return <IntroInstructions />;
      case 1:
        return <CosmicCalm />;
      case 2:
        return <StellarMemory />;
      case 3:
        return <NarrativeWaves />;
      case 4:
        // This case should ideally be handled by the isComplete logic above.
        // If analysis is loading, show spinner. Otherwise, user should already be on /results.
        if (analysisLoading) {
          return <LoadingSpinner size="lg" text="Finalizing your cosmic analysis..." />;
        }
        // If somehow here without analysis and complete, redirect again or show message.
        // This state (currentGame 4 and not yet on /results) should be brief.
        return <div className="text-center p-8"><p>Preparing results...</p></div>;
      default:
        // Should not happen, but good to have a fallback or redirect to intro.
        // router.replace('/'); // Or back to intro
        return <IntroInstructions />;
    }
  };

  // If isComplete is true, but we haven't redirected yet (e.g. finalAnalysis is still loading),
  // it might be showing the last game component briefly or the loading spinner.
  // The useEffect for redirection should handle this.
  // If analysis is loading (triggered by last game), show a global spinner.
  if (currentGame === 4 && analysisLoading) {
     return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <LoadingSpinner size="lg" text="Finalizing your cosmic analysis..." />
      </div>
    );
  }


  return (
    <div className="w-full">
      {/* ProgressBar is in the main Layout and updates via context */}
      {renderCurrentGame()}
    </div>
  );
};

export default GamePage;
