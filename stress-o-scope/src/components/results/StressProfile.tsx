'use client';

import React, { useEffect, useState } from 'react';

interface StressProfileProps {
  stressLevel: number; // 1-10
  stressAreas: string[];
}

const StressProfile: React.FC<StressProfileProps> = ({ stressLevel, stressAreas }) => {
  const [animatedLevel, setAnimatedLevel] = useState(0);

  useEffect(() => {
    const animationDuration = 1000; // 1 second
    const startTime = Date.now();

    const animateValue = () => {
      const elapsedTime = Date.now() - startTime;
      const progress = Math.min(elapsedTime / animationDuration, 1);
      setAnimatedLevel(Math.round(progress * stressLevel));

      if (progress < 1) {
        requestAnimationFrame(animateValue);
      }
    };

    requestAnimationFrame(animateValue);
  }, [stressLevel]);

  const getStressColor = (level: number): string => {
    if (level <= 3) return 'text-green-400'; // Low stress
    if (level <= 6) return 'text-yellow-400'; // Moderate stress
    return 'text-red-500'; // High stress
  };

  const getStressStrokeColor = (level: number): string => {
    if (level <= 3) return '#4ade80'; // green-400
    if (level <= 6) return '#facc15'; // yellow-400
    return '#ef4444'; // red-500
  };

  const percentage = (animatedLevel / 10) * 100;
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="p-6 bg-deep-space/50 rounded-xl shadow-xl text-center animate-fadeIn">
      <h3 className="text-2xl font-bold text-star-gold mb-6">Your Stress Profile</h3>

      <div className="relative w-48 h-48 sm:w-56 sm:h-56 mx-auto mb-6">
        <svg className="w-full h-full" viewBox="0 0 200 200">
          {/* Background Circle */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            strokeWidth="16"
            className="stroke-cosmic-blue/30"
          />
          {/* Progress Arc */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            strokeWidth="16"
            stroke={getStressStrokeColor(animatedLevel)}
            strokeLinecap="round"
            transform="rotate(-90 100 100)"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: strokeDashoffset,
              transition: 'stroke-dashoffset 0.5s ease-out, stroke 0.5s ease-out',
            }}
          />
          {/* Text in Center */}
          <text
            x="50%"
            y="50%"
            dy=".3em"
            textAnchor="middle"
            className={`text-5xl font-bold fill-current ${getStressColor(animatedLevel)}`}
            style={{ transition: 'fill 0.5s ease-out' }}
          >
            {animatedLevel}
          </text>
          <text
            x="50%"
            y="65%" // Position " / 10" below the level number
            dy=".3em"
            textAnchor="middle"
            className="text-lg fill-current text-gray-400"
          >
            / 10
          </text>
        </svg>
      </div>

      {stressAreas && stressAreas.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-nebula-purple mb-2">Key Stress Areas:</h4>
          <div className="flex flex-wrap justify-center gap-2">
            {stressAreas.map((area, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-cosmic-blue text-white text-sm rounded-full shadow"
              >
                {area.charAt(0).toUpperCase() + area.slice(1)}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StressProfile;
