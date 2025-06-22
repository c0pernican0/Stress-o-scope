import React from 'react';

interface ProgressBarProps {
  currentStep: number; // 0-indexed (0 to 4 for 5 steps)
  totalSteps?: number; // Defaults to 5
  className?: string;
}

const stepLabels = ["Intro", "Cosmic Calm", "Stellar Memory", "Narrative Waves", "Results"];

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  totalSteps = 5, // Fixed as per original prompt for 5 steps
  className = '',
}) => {
  const normalizedCurrentStep = Math.max(0, Math.min(currentStep, totalSteps -1));
  const progressPercentage = totalSteps > 1 ? (normalizedCurrentStep / (totalSteps -1)) * 100 : 0;

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between mb-1">
        {stepLabels.slice(0, totalSteps).map((label, index) => (
          <div
            key={index}
            className={`text-xs sm:text-sm text-center flex-1
                        ${index < normalizedCurrentStep ? 'text-star-gold' : ''}
                        ${index === normalizedCurrentStep ? 'text-white font-semibold' : ''}
                        ${index > normalizedCurrentStep ? 'text-gray-400' : ''}`}
          >
            {label}
          </div>
        ))}
      </div>
      <div className="w-full bg-deep-space/70 rounded-full h-2.5 shadow-inner">
        <div
          className="bg-gradient-to-r from-nebula-purple to-star-gold h-2.5 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      {/* Optional: Display current step number if needed */}
      {/* <p className="text-center text-xs text-gray-300 mt-1">
        Step {normalizedCurrentStep + 1} of {totalSteps}
      </p> */}
    </div>
  );
};

export default ProgressBar;
