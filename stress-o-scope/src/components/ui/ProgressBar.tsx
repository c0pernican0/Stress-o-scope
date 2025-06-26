'use client';

import React from 'react';
import { useGameContext } from '@/context/GameContext';

interface ProgressBarProps {
  className?: string;
}

const stepLabels = [
  { name: "Introduzione", icon: "🚀" },
  { name: "Cosmic Calm", icon: "✨" },
  { name: "Stellar Memory", icon: "🌟" },
  { name: "Narrative Waves", icon: "🌌" },
  { name: "Risultati", icon: "🎯" }
];

const TOTAL_STEPS = 5;

const ProgressBar: React.FC<ProgressBarProps> = ({ className = '' }) => {
  const { state } = useGameContext();
  const { currentGame, isComplete } = state;

  let displayStep = currentGame;
  if (isComplete && currentGame === TOTAL_STEPS - 1) {
    displayStep = TOTAL_STEPS - 1;
  } else if (currentGame >= TOTAL_STEPS - 1) {
    displayStep = TOTAL_STEPS - 1;
  }

  const normalizedCurrentStep = Math.max(0, Math.min(displayStep, TOTAL_STEPS - 1));
  const progressPercentage = TOTAL_STEPS > 1 ? (normalizedCurrentStep / (TOTAL_STEPS - 1)) * 100 : 0;

  return (
    <div className={`w-full ${className}`}>
      
      {/* Steps indicators */}
      <div className="flex justify-between items-center mb-4 px-2">
        {stepLabels.map((step, index) => {
          const isActive = index === normalizedCurrentStep;
          const isCompleted = index < normalizedCurrentStep;
          const isPending = index > normalizedCurrentStep;
          
          return (
            <div key={index} className="flex flex-col items-center flex-1 relative">
              
              {/* Step circle with icon */}
              <div className={`
                relative w-12 h-12 rounded-full flex items-center justify-center text-lg transition-all duration-500 transform
                ${isCompleted 
                  ? 'bg-gradient-to-br from-star-gold-400 to-aurora-pink-500 text-white shadow-lg shadow-star-gold-500/30 scale-100' 
                  : isActive 
                    ? 'bg-gradient-to-br from-cosmic-blue-500 to-nebula-purple-500 text-white shadow-xl shadow-cosmic-blue-500/50 scale-110 animate-pulse-slow' 
                    : 'bg-white/10 backdrop-blur-md text-slate-400 border border-white/20'
                }
              `}>
                <span className={`transition-transform duration-300 ${isActive ? 'scale-110' : ''}`}>
                  {step.icon}
                </span>
                
                {/* Glow effect for active step */}
                {isActive && (
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cosmic-blue-400 to-nebula-purple-400 animate-ping opacity-30"></div>
                )}
              </div>
              
              {/* Step label */}
              <div className="mt-2 text-center">
                <p className={`
                  text-xs sm:text-sm font-medium transition-all duration-300
                  ${isCompleted 
                    ? 'text-star-gold-400' 
                    : isActive 
                      ? 'text-white font-semibold' 
                      : 'text-slate-400'
                  }
                `}>
                  {step.name}
                </p>
              </div>
              
              {/* Connection line to next step */}
              {index < stepLabels.length - 1 && (
                <div className="absolute top-6 left-full w-full h-0.5 -translate-y-1/2 hidden sm:block">
                  <div className={`
                    h-full transition-all duration-500
                    ${index < normalizedCurrentStep 
                      ? 'bg-gradient-to-r from-star-gold-400 to-aurora-pink-500' 
                      : 'bg-white/20'
                    }
                  `}></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modern progress bar */}
      <div className="relative">
        <div className="w-full bg-white/10 backdrop-blur-md rounded-full h-3 shadow-inner border border-white/20">
          <div
            className="h-full rounded-full bg-gradient-to-r from-star-gold-400 via-aurora-pink-500 to-cosmic-blue-500 transition-all duration-700 ease-out relative overflow-hidden"
            style={{ width: `${progressPercentage}%` }}
          >
            {/* Animated shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
          </div>
        </div>
        
        {/* Progress percentage indicator */}
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-slate-400">
            Progresso
          </span>
          <span className="text-xs font-medium text-white">
            {Math.round(progressPercentage)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
