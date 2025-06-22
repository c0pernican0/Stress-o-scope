'use client';

import React from 'react';
import { CosmicResults, MemoryResults, NarrativeResults, PsychProfileDimensions } from '@/context/GameTypes';

interface GamePerformanceSummaryProps {
  cosmicResults: CosmicResults | null;
  memoryResults: MemoryResults | null;
  narrativeResults: NarrativeResults | null;
}

const GamePerformanceSummary: React.FC<GamePerformanceSummaryProps> = ({
  cosmicResults,
  memoryResults,
  narrativeResults,
}) => {

  const renderPsychProfile = (profile: PsychProfileDimensions) => {
    const entries = Object.entries(profile)
      .map(([key, value]) => ({
        name: key.charAt(0).toUpperCase() + key.slice(1),
        score: value
      }))
      .sort((a, b) => b.score - a.score); // Sort by score descending

    // Display top 3 or all if less than 3 have score > 0
    const topEntries = entries.filter(e => e.score > 0).slice(0, 3);
    if (topEntries.length === 0 && entries.length > 0) { // if all scores are 0, show first 3
        const firstThree = entries.slice(0,3);
        return (
            <ul className="space-y-1 text-sm text-gray-300">
                {firstThree.map(entry => (
                    <li key={entry.name}>{entry.name}: {entry.score}</li>
                ))}
            </ul>
        );
    }


    return (
      <div className="space-y-2 mt-2">
        {topEntries.map(entry => (
          <div key={entry.name} className="w-full">
            <div className="flex justify-between text-xs text-gray-400 mb-0.5">
              <span>{entry.name}</span>
              <span>{entry.score}</span>
            </div>
            <div className="w-full bg-cosmic-blue/30 rounded-full h-2.5">
              <div
                className="bg-star-gold h-2.5 rounded-full"
                style={{ width: `${(entry.score / 6) * 100}%` }} // Assuming max score per dimension is ~6
              ></div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 bg-deep-space/50 rounded-xl shadow-xl animate-fadeIn mt-8">
      <h3 className="text-2xl font-bold text-star-gold mb-6 text-center">Game Performance Insights</h3>
      <div className="grid md:grid-cols-3 gap-6">
        {/* Cosmic Calm Summary */}
        <div className="p-4 bg-cosmic-blue/30 rounded-lg shadow">
          <h4 className="text-lg font-semibold text-nebula-purple mb-2">Cosmic Calm</h4>
          {cosmicResults ? (
            <ul className="space-y-1 text-sm text-gray-300">
              <li>Initial Element: <span className="font-medium text-white">{cosmicResults.initialElement}</span></li>
              <li>Constellation: <span className="font-medium text-white">{cosmicResults.constellationPattern}</span></li>
              <li>Total Time: <span className="font-medium text-white">{(cosmicResults.totalTime / 1000).toFixed(1)}s</span></li>
            </ul>
          ) : (
            <p className="text-sm text-gray-400">No data available.</p>
          )}
        </div>

        {/* Stellar Memory Summary */}
        <div className="p-4 bg-cosmic-blue/30 rounded-lg shadow">
          <h4 className="text-lg font-semibold text-nebula-purple mb-2">Stellar Memory</h4>
          {memoryResults ? (
            <ul className="space-y-1 text-sm text-gray-300">
              <li>Max Sequence: <span className="font-medium text-white">{memoryResults.maxSequenceLength}</span></li>
              <li>Avg. Reaction: <span className="font-medium text-white">{memoryResults.averageReactionTime.toFixed(0)}ms</span></li>
              <li>Errors: <span className="font-medium text-white">{memoryResults.totalErrors}</span></li>
              <li>Breathing Sync: <span className="font-medium text-white">{memoryResults.breathingSyncRate.toFixed(1)}%</span></li>
            </ul>
          ) : (
            <p className="text-sm text-gray-400">No data available.</p>
          )}
        </div>

        {/* Narrative Waves Summary */}
        <div className="p-4 bg-cosmic-blue/30 rounded-lg shadow">
          <h4 className="text-lg font-semibold text-nebula-purple mb-2">Narrative Waves</h4>
          {narrativeResults ? (
            <>
              <p className="text-sm text-gray-300 mb-1">Top Profile Traits:</p>
              {renderPsychProfile(narrativeResults.psychProfile)}
              <p className="text-sm text-gray-300 mt-2">Consistency: <span className="font-medium text-white">{(narrativeResults.choiceConsistency * 100).toFixed(0)}%</span></p>
            </>
          ) : (
            <p className="text-sm text-gray-400">No data available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GamePerformanceSummary;
