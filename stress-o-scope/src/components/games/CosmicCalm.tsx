'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useGameContext } from '@/context/GameContext';
import { Button } from '@/components/ui'; // Assuming Button is exported from ui/index.ts
import { CosmicResults } from '@/context/GameTypes';

// Types for game-specific state
type CosmicGamePhase = 'elementSelection' | 'constellation' | 'questions' | 'finished';

interface Point {
  x: number;
  y: number;
}

interface Question {
  id: number;
  text: string;
  options: string[];
}

interface Answer {
  questionId: number;
  choice: string; // The chosen option text
  time: number; // Time taken for this question in ms
}

// Define cosmic elements
const COSMIC_ELEMENTS = [
  { id: 'star', name: 'Shining Star', icon: '🌟' },
  { id: 'planet', name: 'Mystic Planet', icon: '🪐' },
  { id: 'comet', name: 'Swift Comet', icon: '☄️' },
  { id: 'nebula', name: 'Vast Nebula', icon: '🌌' },
];

// Define questions (placeholders for now, will be filled in a later step)
const QUESTIONS_DATA: Question[] = [
  { id: 1, text: "If you were a planet, what kind of atmosphere would you have?", options: ["Calm and Serene", "Electric and Stormy", "Warm and Gaseous", "Icy and Thin"] },
  { id: 2, text: "Which celestial phenomenon best describes your current week?", options: ["A Supernova (explosive, transformative)", "A Black Hole (absorbing everything)", "A meteor shower (many small events)", "A stable orbit (predictable, calm)"] },
  { id: 3, text: "How do you prefer to travel through space (life)?", options: ["Warp speed, destination focused", "Slow cruise, enjoying the view", "Teleportation, instant changes", "Following gravitational pulls"] },
  { id: 4, text: "What are you searching for in the vast universe?", options: ["Knowledge and Truth", "Peace and Tranquility", "Connection and Companionship", "Adventure and New Experiences"] },
  { id: 5, text: "Which cosmic energy are you most drawn to?", options: ["The birth of a star (creation)", "The stillness of deep space (introspection)", "The dance of galaxies (harmony)", "The unknown beyond the observable (mystery)"] },
];

type ConstellationPattern = 'organized' | 'scattered' | 'centered';

function calculateConstellationPattern(points: Point[], canvasWidth: number, canvasHeight: number): ConstellationPattern {
  if (points.length < 3) return 'scattered'; // Not enough points to determine a pattern

  // 1. Calculate centroid of the points
  let sumX = 0, sumY = 0;
  points.forEach(p => {
    sumX += p.x;
    sumY += p.y;
  });
  const centroidX = sumX / points.length;
  const centroidY = sumY / points.length;

  // 2. Calculate distances from centroid and average distance
  let totalDistanceFromCentroid = 0;
  const distancesFromCentroid: number[] = [];
  points.forEach(p => {
    const dist = Math.sqrt(Math.pow(p.x - centroidX, 2) + Math.pow(p.y - centroidY, 2));
    distancesFromCentroid.push(dist);
    totalDistanceFromCentroid += dist;
  });
  const avgDistanceFromCentroid = totalDistanceFromCentroid / points.length;

  // 3. Calculate variance of distances from centroid
  let sumOfSquaredDifferences = 0;
  distancesFromCentroid.forEach(dist => {
    sumOfSquaredDifferences += Math.pow(dist - avgDistanceFromCentroid, 2);
  });
  const variance = sumOfSquaredDifferences / points.length;

  // 4. Calculate spread relative to canvas size (bounding box of points)
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  points.forEach(p => {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  });
  const spreadX = maxX - minX;
  const spreadY = maxY - minY;
  const relativeSpread = (spreadX / canvasWidth) * (spreadY / canvasHeight); // Area covered relative to canvas

  // Heuristic thresholds (these may need tuning)
  // Normalize avgDistance by canvas diagonal for better comparison
  const canvasDiagonal = Math.sqrt(canvasWidth * canvasWidth + canvasHeight * canvasHeight);
  const normalizedAvgDist = avgDistanceFromCentroid / canvasDiagonal;

  // Centered: Points are tightly clustered around the centroid, and centroid is near canvas center
  const canvasCenterX = canvasWidth / 2;
  const canvasCenterY = canvasHeight / 2;
  const centroidToCanvasCenterDist = Math.sqrt(Math.pow(centroidX - canvasCenterX, 2) + Math.pow(centroidY - canvasCenterY, 2));

  if (normalizedAvgDist < 0.15 && centroidToCanvasCenterDist < canvasDiagonal * 0.15) { // Small average distance to centroid & centroid is near canvas center
      return 'centered';
  }

  // Scattered: High variance in distances from centroid OR large relative spread
  if (variance > (canvasDiagonal * 0.1)**2 || relativeSpread > 0.5) { // High variance or covers large area
      return 'scattered';
  }

  // Organized: Default if not clearly centered or scattered.
  // This could be improved with more specific checks for lines, regular shapes, etc., but that's complex.
  // For now, 'organized' might mean moderately spread, not too chaotic, not too tightly clustered in center.
  if (normalizedAvgDist < 0.3 && relativeSpread < 0.4 && variance < (canvasDiagonal * 0.1)**2 ) {
      return 'organized';
  }

  return 'scattered'; // Fallback, or could be 'organized' as a general bucket
}


const CosmicCalm: React.FC = () => {
  const { setCosmicResults, nextGame } = useGameContext();

  const [currentPhase, setCurrentPhase] = useState<CosmicGamePhase>('elementSelection');
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [constellationPoints, setConstellationPoints] = useState<Point[]>([]);
  const [questionAnswers, setQuestionAnswers] = useState<Answer[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);

  const [gameStartTime, setGameStartTime] = useState<number>(0);
  const [phaseStartTime, setPhaseStartTime] = useState<number>(0);
  // To store collected metrics before sending to context
  // const [metrics, setMetrics] = useState<Partial<CosmicResults>>({});

  const interactiveAreaRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    setGameStartTime(Date.now());
    setPhaseStartTime(Date.now());
  }, []);

  useEffect(() => {
    if (currentPhase === 'finished') {
      const totalTime = Date.now() - gameStartTime;

      let pattern: ConstellationPattern = 'scattered';
      if (interactiveAreaRef.current && constellationPoints.length > 0) {
        const rect = interactiveAreaRef.current.getBoundingClientRect();
        pattern = calculateConstellationPattern(constellationPoints, rect.width, rect.height);
      }

      const results: CosmicResults = {
        initialElement: selectedElement || '',
        constellationPattern: pattern,
        responseTime: questionAnswers.map(a => a.time),
        choicePattern: questionAnswers.map(a => a.choice), // Storing actual choices
        totalTime: totalTime,
        constellationPoints: constellationPoints,
        // Include other temporary metrics if they were part of CosmicResults
        // timeElementSelection: metrics.timeElementSelection || 0,
        // timeConstellation: metrics.timeConstellation || 0,
      };

      setCosmicResults(results);
      // Short delay before automatically moving to the next game for user to see completion message
      const timer = setTimeout(() => {
        nextGame();
      }, 1500);

      return () => clearTimeout(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPhase]); // Dependencies: only run when currentPhase changes. Other values are read when 'finished'.

  return (
    <div className="p-4 md:p-6 rounded-lg shadow-xl bg-deep-space/70 text-white">
      <h2 className="text-2xl font-bold text-star-gold mb-4 text-center">Cosmic Calm</h2>

      {/* Phase-specific rendering will go here */}
      {currentPhase === 'elementSelection' && (
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-6 text-nebula-purple">Choose Your Cosmic Element</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {COSMIC_ELEMENTS.map((element) => (
              <button
                key={element.id}
                onClick={() => {
                  // const timeTaken = Date.now() - phaseStartTime; // This specific timing isn't in CosmicResults
                  setSelectedElement(element.id);
                  // setMetrics(prev => ({ ...prev, initialElement: element.id })); // Storing directly
                  setPhaseStartTime(Date.now()); // Reset for next phase
                  setCurrentPhase('constellation');
                }}
                className="p-4 sm:p-6 rounded-lg bg-cosmic-blue/50 hover:bg-nebula-purple/70 focus:ring-2 focus:ring-star-gold transition-all duration-150 ease-in-out transform hover:scale-105"
              >
                <span className="text-4xl sm:text-5xl" role="img" aria-label={element.name}>{element.icon}</span>
                <p className="mt-2 text-sm sm:text-base font-medium">{element.name}</p>
              </button>
            ))}
          </div>
        </div>
      )}
      {currentPhase === 'constellation' && (
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-4 text-nebula-purple">Create Your Constellation</h3>
          <p className="text-sm text-gray-300 mb-1">Click 5 to 7 times on the canvas below to place your stars.</p>
          <p className="text-sm text-gray-300 mb-4">Current points: {constellationPoints.length}</p>
          <div
            ref={interactiveAreaRef}
            className="w-full max-w-xl h-64 sm:h-80 md:h-96 bg-deep-space border-2 border-cosmic-blue rounded-lg mx-auto cursor-pointer relative overflow-hidden shadow-inner"
            onClick={(e) => {
              if (constellationPoints.length < 7 && interactiveAreaRef.current) {
                const rect = interactiveAreaRef.current.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                setConstellationPoints([...constellationPoints, { x, y }]);
              }
            }}
          >
            {/* Render points */}
            {constellationPoints.map((point, index) => (
              <div
                key={`point-${index}`}
                className="absolute w-2 h-2 bg-star-gold rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-lg"
                style={{ left: `${point.x}px`, top: `${point.y}px` }}
              />
            ))}
            {/* Render lines */}
            {constellationPoints.length > 1 && (
              <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
                {constellationPoints.slice(1).map((point, index) => (
                  <line
                    key={`line-${index}`}
                    x1={constellationPoints[index].x}
                    y1={constellationPoints[index].y}
                    x2={point.x}
                    y2={point.y}
                    stroke="rgba(255, 215, 0, 0.5)" // star-gold with opacity
                    strokeWidth="1.5"
                  />
                ))}
              </svg>
            )}
          </div>
          {constellationPoints.length >= 5 && (
            <Button
              onClick={() => {
                // const timeTaken = Date.now() - phaseStartTime; // This specific timing isn't in CosmicResults
                // setMetrics(prev => ({ ...prev, constellationPoints: [...constellationPoints] })); // Storing directly
                setPhaseStartTime(Date.now()); // Reset for next phase
                setCurrentPhase('questions');
              }}
              className="mt-6"
              variant="primary"
            >
              Done Creating
            </Button>
          )}
           {constellationPoints.length > 0 && constellationPoints.length < 5 && (
            <p className="text-xs text-star-gold mt-2">Place at least {5 - constellationPoints.length} more star(s).</p>
          )}
        </div>
      )}
      {currentPhase === 'questions' && QUESTIONS_DATA[currentQuestionIndex] && (
        <div className="text-center max-w-xl mx-auto">
          <h3 className="text-xl font-semibold mb-2 text-nebula-purple">
            Cosmic Query ({currentQuestionIndex + 1}/{QUESTIONS_DATA.length})
          </h3>
          <p className="text-lg text-gray-200 mb-6 min-h-[3em]"> {/* min-h to reduce layout shift */}
            {QUESTIONS_DATA[currentQuestionIndex].text}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {QUESTIONS_DATA[currentQuestionIndex].options.map((option, index) => (
              <Button
                key={index}
                variant="cosmic"
                size="md"
                onClick={() => {
                  const timeTaken = Date.now() - phaseStartTime;
                  const newAnswer: Answer = {
                    questionId: QUESTIONS_DATA[currentQuestionIndex].id,
                    choice: option,
                    time: timeTaken,
                  };
                  const updatedAnswers = [...questionAnswers, newAnswer];
                  setQuestionAnswers(updatedAnswers);

                  setPhaseStartTime(Date.now()); // Reset for next question or finishing logic

                  if (currentQuestionIndex < QUESTIONS_DATA.length - 1) {
                    setCurrentQuestionIndex(currentQuestionIndex + 1);
                  } else {
                    setCurrentPhase('finished');
                  }
                }}
                className="w-full text-left justify-start py-3 px-4" // Ensure text is aligned left for options
              >
                {option}
              </Button>
            ))}
          </div>
        </div>
      )}
      {currentPhase === 'finished' && (
        <div className="text-center">
          <p className="text-xl">Cosmic Calm journey complete!</p>
          <p className="text-sm text-gray-300">Preparing your cosmic insights...</p>
        </div>
      )}
    </div>
  );
};

export default CosmicCalm;
