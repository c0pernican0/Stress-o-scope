'use client';

import React, { useEffect } from 'react';
import { useGameContext } from '@/context/GameContext';
import { useRouter } from 'next/navigation';
import { ResultsSummary } from '@/components/results'; // Assuming ResultsSummary is exported from results/index.ts
import { LoadingSpinner, Button } from '@/components/ui';
// import type { Metadata } from 'next';

// Static metadata for results page. Dynamic aspects handled by ResultsSummary.
// export const metadata: Metadata = {
// title: "Stress-O-Scope - Your Analysis",
// description: "View your personalized stress analysis results from the Stress-O-Scope games.",
// };
// Metadata export is for Server Components. Client component will update document.title.


const ResultsPage: React.FC = () => {
  const { state, resetSession } = useGameContext();
  const { finalAnalysis, analysisLoading, analysisError, isComplete, currentGame } = state;
  const router = useRouter();

  useEffect(() => {
    document.title = "Stress-O-Scope - Your Analysis";
  }, []);

  useEffect(() => {
    // If games are not complete, or if they are complete but analysis is still pending (and not just loading after completion)
    // and not already on the results trigger step (currentGame === 4), redirect.
    // This aims to prevent direct access before games are done or if analysis failed before reaching this page.
    if (!isComplete && currentGame < 4) {
      router.replace('/game'); // Or '/' for home page
    } else if (isComplete && !finalAnalysis && !analysisLoading && analysisError) {
      // If complete, but analysis failed and error is set, stay here to show error (ResultsSummary handles this)
      // but perhaps offer a way to restart.
    } else if (isComplete && !finalAnalysis && !analysisLoading && !analysisError && currentGame === 4) {
      // This state means results should be loading or available. If not, something is wrong.
      // Could redirect or let ResultsSummary handle 'no data'.
      // For now, ResultsSummary will show "Analysis Not Available".
    }
  }, [isComplete, finalAnalysis, analysisLoading, analysisError, currentGame, router]);

  // ResultsSummary component itself handles internal loading/error/no-data states for finalAnalysis.
  // This page primarily ensures the user should be here.

  // If analysis is loading (e.g., user navigated here while currentGame === 4 and API call is in progress)
  if (analysisLoading && !finalAnalysis && !analysisError) {
     return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-white">
        <LoadingSpinner size="lg" text="Loading your cosmic analysis..." />
      </div>
    );
  }

  // If isComplete is false, but somehow user landed here (e.g. direct navigation)
  // and useEffect hasn't redirected yet.
  if (!isComplete && !analysisLoading) {
      return (
          <div className="p-6 bg-deep-space/50 rounded-xl shadow-xl text-center text-white animate-fadeIn">
              <h3 className="text-2xl font-bold text-star-gold mb-4">Analysis Not Ready</h3>
              <p className="text-gray-300 mb-6">
                  Please complete all the games to view your analysis.
              </p>
              <Button onClick={() => router.push('/game')} variant="primary">
                  Go to Games
              </Button>
          </div>
      );
  }


  return (
    <div className="w-full">
      <ResultsSummary />
      {/* The "Take Test Again" button is inside ResultsSummary,
          but if we need a global one on this page for some reason, it could be here.
          For now, ResultsSummary's button is sufficient.
      */}
    </div>
  );
};

export default ResultsPage;
