'use client'; // If using context hook

import React from 'react';
import { useGameContext } from '@/context/GameContext'; // Import the context hook

interface ProgressBarProps {
  // currentStep and totalSteps will now come from context or be fixed
  className?: string;
}

const stepLabels = ["Intro", "Cosmic Calm", "Stellar Memory", "Narrative Waves", "Results"];
const TOTAL_STEPS = 5; // Total number of main stages including intro and results view trigger

const ProgressBar: React.FC<ProgressBarProps> = ({ className = '' }) => {
  const { state } = useGameContext();
  const { currentGame, isComplete } = state; // currentGame: 0=intro, 1=cosmic, 2=memory, 3=narrative, 4=results trigger

  // Determine the current step for progress bar display.
  // If game is complete and we are on "results" view (triggered by currentGame === 4), show full progress.
  let displayStep = currentGame;
  if (isComplete && currentGame === TOTAL_STEPS -1) { // currentGame is 4, which means results page
    displayStep = TOTAL_STEPS -1; // Show full progress for results page
  } else if (currentGame >= TOTAL_STEPS -1) { // If somehow currentGame goes beyond results trigger, cap it for display
    displayStep = TOTAL_STEPS -1;
  }


  // Normalized current step for 0-indexed array of labels.
  // Max is TOTAL_STEPS - 1, so for 5 steps, indices are 0,1,2,3,4
  const normalizedCurrentStep = Math.max(0, Math.min(displayStep, TOTAL_STEPS - 1));

  // Progress percentage should be based on segments completed towards the "Results" label.
  // If there are 5 labels (0 to 4), progress to "Results" (index 4) means 4 out of 4 segments are done.
  // So, if current step is `N`, `N` segments are "active or done" out of `TOTAL_STEPS - 1` game segments.
  const progressPercentage = TOTAL_STEPS > 1 ? (normalizedCurrentStep / (TOTAL_STEPS - 1)) * 100 : 0;


  return (
    <div className={`w-full ${className} py-2`}> {/* Added some padding */}
      <div className="flex justify-between mb-1 px-1 sm:px-2">
        {stepLabels.map((label, index) => (
          <div
            key={index}
            className={`text-xs sm:text-sm text-center flex-1 transition-colors duration-300
                        ${index < normalizedCurrentStep ? 'text-star-gold' : ''}
                        ${index === normalizedCurrentStep ? 'text-white font-semibold scale-105' : ''}
                        ${index > normalizedCurrentStep ? 'text-gray-400 opacity-70' : ''}`}
          >
            {label}
          </div>
        ))}
      </div>
      <div className="w-full bg-deep-space/70 rounded-full h-2.5 shadow-inner mx-auto max-w-3xl"> {/* Centered bar */}
        <div
          className="bg-gradient-to-r from-nebula-purple via-cosmic-blue to-star-gold h-2.5 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
