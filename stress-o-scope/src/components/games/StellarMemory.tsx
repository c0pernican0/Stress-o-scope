'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useGameContext } from '@/context/GameContext';
import { Button } from '@/components/ui'; // Assuming Button is exported from ui/index.ts
import { MemoryResults } from '@/context/GameTypes';

// Types for game-specific state
type StellarGamePhase = 'idle' | 'showingSequence' | 'listening' | 'feedback' | 'gameOver' | 'finished';

interface CelestialElement {
  id: string;
  name: string;
  color: string; // Tailwind color class, e.g., 'bg-red-500'
  icon?: string; // Emoji or SVG path
}

const CELESTIAL_ELEMENTS: CelestialElement[] = [
  { id: 'planet', name: 'Planet', color: 'bg-blue-500', icon: '🪐' },
  { id: 'star', name: 'Star', color: 'bg-yellow-400', icon: '🌟' },
  { id: 'comet', name: 'Comet', color: 'bg-purple-500', icon: '☄️' },
  { id: 'nebula', name: 'Nebula', color: 'bg-indigo-500', icon: '🌌' },
  { id: 'blackhole', name: 'Black Hole', color: 'bg-gray-700', icon: '⚫' },
];

const MAX_LIVES = 3;

interface LevelConfig {
  sequenceLength: number;
  speed: number; // ms per item in sequence display
  opacity: number; // 0.0 to 1.0 for elements during sequence display
}

// Difficulty progression
// Level 1: seq 3, speed 1000ms, opacity 1.0
// Level 2: seq 4, speed 900ms, opacity 0.9
// Level 3: seq 5, speed 800ms, opacity 0.8
// Level 4: seq 6, speed 700ms, opacity 0.7
// Level 5: seq 7, speed 600ms, opacity 0.6
// Level 6+: seq 8+, speed 500ms, opacity 0.5
function getLevelConfig(level: number): LevelConfig {
  if (level === 1) return { sequenceLength: 3, speed: 1000, opacity: 1.0 };
  if (level === 2) return { sequenceLength: 4, speed: 900, opacity: 0.9 };
  if (level === 3) return { sequenceLength: 5, speed: 800, opacity: 0.8 };
  if (level === 4) return { sequenceLength: 6, speed: 700, opacity: 0.7 };
  if (level === 5) return { sequenceLength: 7, speed: 600, opacity: 0.6 };
  // For level 6 and beyond
  const sequenceLength = 7 + (level - 5); // Increase length by 1 for each level beyond 5
  return { sequenceLength: Math.min(sequenceLength, 15), speed: 500, opacity: 0.5 }; // Cap length at 15 for sanity
}


const StellarMemory: React.FC = () => {
  const { setMemoryResults, nextGame } = useGameContext();

  const [gamePhase, setGamePhase] = useState<StellarGamePhase>('idle');
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [sequenceToRemember, setSequenceToRemember] = useState<string[]>([]);
  const [userSequence, setUserSequence] = useState<string[]>([]);
  const [lives, setLives] = useState<number>(MAX_LIVES);

  const [reactionTimesArray, setReactionTimesArray] = useState<number[]>([]);
  const [mouseFocusSamples, setMouseFocusSamples] = useState<boolean[]>([]); // true if focused, false if not
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');

  // For tracking time for reaction
  const lastInteractionTimeRef = useRef<number>(Date.now());
  // For tracking overall game time for average reaction time or other metrics
  const gameStartTimeRef = useRef<number>(0);
  const totalErrorsRef = useRef<number>(0);
  const maxLevelReachedRef = useRef<number>(0);

  const breathingCircleRef = useRef<HTMLDivElement>(null);
  const gameContainerRef = useRef<HTMLDivElement>(null);

  // State for highlighting elements during sequence display
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  const [currentSequenceOpacity, setCurrentSequenceOpacity] = useState<number>(1);


  const generateSequence = (length: number): string[] => {
    const newSequence: string[] = [];
    if (CELESTIAL_ELEMENTS.length === 0) return [];
    for (let i = 0; i < length; i++) {
      let nextElementId;
      do {
        nextElementId = CELESTIAL_ELEMENTS[Math.floor(Math.random() * CELESTIAL_ELEMENTS.length)].id;
      } while (i > 0 && nextElementId === newSequence[i - 1]); // No immediate repetition
      newSequence.push(nextElementId);
    }
    return newSequence;
  };

  const playSequence = useCallback(async (sequence: string[], speed: number, opacity: number) => {
    setGamePhase('showingSequence');
    setCurrentSequenceOpacity(opacity); // Set opacity for current sequence display
    for (const elementId of sequence) {
      setHighlightedElement(elementId);
      await new Promise(resolve => setTimeout(resolve, speed / 2)); // Highlight duration
      setHighlightedElement(null);
      await new Promise(resolve => setTimeout(resolve, speed / 4)); // Pause between highlights
    }
    setGamePhase('listening');
    lastInteractionTimeRef.current = Date.now(); // Start timing for user input after sequence plays
  }, []);

  const startNextLevel = useCallback(() => {
    setFeedbackMessage('');
    setUserSequence([]);
    const config = getLevelConfig(currentLevel);
    const newSequence = generateSequence(config.sequenceLength);
    setSequenceToRemember(newSequence);
    maxLevelReachedRef.current = Math.max(maxLevelReachedRef.current, currentLevel);
    setGamePhase('showingSequence'); // Ensure phase is showingSequence before playing
    playSequence(newSequence, config.speed, config.opacity);
  }, [currentLevel, playSequence]);


  const initializeGame = () => { // Renamed from startGame for clarity
    gameStartTimeRef.current = Date.now(); // Set start time when game actually begins
    totalErrorsRef.current = 0;
    maxLevelReachedRef.current = 0; // Will be set by startNextLevel
    setLives(MAX_LIVES);
    setCurrentLevel(1);
    setReactionTimesArray([]);
    setMouseFocusSamples([]);
    setUserSequence([]);
    setSequenceToRemember([]);
    setFeedbackMessage('');
    setGamePhase('idle');
  };

  // Effect for level progression after successful feedback
  useEffect(() => {
    if (gamePhase === 'feedback' && lives > 0 && feedbackMessage.includes('Correct!')) {
        const timer = setTimeout(() => {
            setCurrentLevel(prev => prev + 1);
            // startNextLevel will be called by the useEffect monitoring currentLevel changes (below)
        }, 1000);
        return () => clearTimeout(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gamePhase, lives, feedbackMessage]);

  // Effect to start a new level's sequence when currentLevel changes (and game is not idle/over)
  useEffect(() => {
    if (currentLevel > 0 && (gamePhase === 'showingSequence' || gamePhase === 'feedback')) { // Only if level changed due to progression
        if(lives > 0 && !feedbackMessage.includes('Incorrect!')) { // Ensure it's for a new level start, not after an error retry
             startNextLevel();
        }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLevel]); // Only currentLevel as dependency

  // Initial game setup or reset
  useEffect(() => {
    initializeGame(); // Initialize game state on mount, sets phase to idle
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  const handleStartButtonClick = () => {
    initializeGame(); // Reset everything to level 1 state but keeps phase 'idle'
    // We need to explicitly move to start playing level 1
    // Setting currentLevel to 1 again if already 1 won't trigger the above useEffect.
    // So, we can call startNextLevel if currentLevel is already 1 from initializeGame
    // or rely on a slight modification to ensure it runs.

    // Best way: initializeGame sets currentLevel to 1 and phase to idle.
    // Button click then sets phase to 'showingSequence' which can trigger level 1 start.
    // Or more directly:
    setCurrentLevel(1); // Ensure it's level 1
    setGamePhase('showingSequence'); // Transition to playing
    // A new useEffect will catch this phase change to call startNextLevel for level 1
  };

  // Effect to start level 1 sequence when 'Start Game' button sets phase to showingSequence
  useEffect(() => {
    if (gamePhase === 'showingSequence' && currentLevel === 1 && sequenceToRemember.length === 0) {
        startNextLevel();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gamePhase, currentLevel]); // sequenceToRemember.length condition ensures it only runs for initial start of L1

  const calculateFinalMetrics = useCallback((): MemoryResults => {
    const avgReactionTime = reactionTimesArray.length > 0
      ? reactionTimesArray.reduce((sum, rt) => sum + rt, 0) / reactionTimesArray.length
      : 0;

    const syncRate = mouseFocusSamples.length > 0
      ? (mouseFocusSamples.filter(sample => sample).length / mouseFocusSamples.length) * 100
      : 0;

    // Stress progression: For now, this will be an empty array as per plan.
    // It would be populated if there was a per-level stress input mechanism.
    const stressProgressionData: number[] = [];

    return {
      maxSequenceLength: getLevelConfig(maxLevelReachedRef.current).sequenceLength, // Length of the highest level sequence *started* or *completed*
      totalErrors: totalErrorsRef.current,
      averageReactionTime: Math.round(avgReactionTime),
      breathingSyncRate: parseFloat(syncRate.toFixed(1)),
      failurePoint: lives <= 0 ? `level_${currentLevel}` : `completed_level_${maxLevelReachedRef.current}`, // Or 'completed_all' if applicable
      stressProgression: stressProgressionData,
      reactionTimes: reactionTimesArray,
    };
  }, [reactionTimesArray, mouseFocusSamples, lives, currentLevel, getLevelConfig]); // Added getLevelConfig as it's used inside


  // Effect to handle game over
  useEffect(() => {
    if (gamePhase === 'gameOver') {
      const finalMetrics = calculateFinalMetrics();
      setMemoryResults(finalMetrics);

      // Display game over message for a bit, then proceed
      const timer = setTimeout(() => {
        // Check phase again in case of rapid changes, though nextGame() should be robust
        if (gamePhase === 'gameOver') {
             nextGame();
        }
      }, 3000); // Show game over for 3 seconds

      return () => clearTimeout(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gamePhase, calculateFinalMetrics, setMemoryResults, nextGame]);


  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (gamePhase !== 'listening' || !breathingCircleRef.current || !gameContainerRef.current) return;

    const circleRect = breathingCircleRef.current.getBoundingClientRect();
    // const containerRect = gameContainerRef.current.getBoundingClientRect();

    // Calculate circle center relative to the viewport
    const circleCenterX = circleRect.left + circleRect.width / 2;
    const circleCenterY = circleRect.top + circleRect.height / 2;

    // Mouse position relative to the viewport
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    const distance = Math.sqrt(Math.pow(mouseX - circleCenterX, 2) + Math.pow(mouseY - circleCenterY, 2));

    // Threshold: circle radius + a small buffer (e.g., 20px)
    const focusThreshold = (circleRect.width / 2) + 20;

    setMouseFocusSamples(prev => [...prev, distance < focusThreshold]);

  }, [gamePhase]);

  // No separate useEffect for mousemove needed if using onMouseMove prop directly

  const handleUserInput = (elementId: string) => {
    if (gamePhase !== 'listening') return;

    const timeNow = Date.now();
    const rt = timeNow - lastInteractionTimeRef.current;
    lastInteractionTimeRef.current = timeNow;
    setReactionTimesArray(prev => [...prev, rt]);

    const newUserSeq = [...userSequence, elementId];
    setUserSequence(newUserSeq);

    // Check if current input is correct
    if (newUserSeq[newUserSeq.length - 1] === sequenceToRemember[newUserSeq.length - 1]) {
      // Correct input
      if (newUserSeq.length === sequenceToRemember.length) {
        // Sequence complete and correct
        setFeedbackMessage('Correct! Next level...');
        setGamePhase('feedback'); // This will trigger useEffect to advance level
      } else {
        // Sequence correct so far, but not complete
        // No feedback message yet, wait for next input
      }
    } else {
      // Incorrect input
      totalErrorsRef.current += 1;
      const newLives = lives - 1;
      setLives(newLives);
      setFeedbackMessage(`Incorrect! ${newLives > 0 ? 'Try again.' : 'Game Over.'}`);

      if (newLives > 0) {
        // Option 1: Replay current sequence (typical Simon behavior)
        setUserSequence([]); // Reset user input for the retry
        setGamePhase('feedback'); // Show feedback briefly
        const timer = setTimeout(() => {
            setFeedbackMessage(`Watch carefully...`);
            playSequence(sequenceToRemember, getLevelConfig(currentLevel).speed, getLevelConfig(currentLevel).opacity);
        }, 1500); // Brief pause for feedback
        // clear this timeout if component unmounts or game resets
        // Consider adding to a ref array of timers if many such exist
        return () => clearTimeout(timer);

        // Option 2: Just let user try again from where they were (less common for Simon)
        // setUserSequence([]); // User has to restart input for this sequence.
      } else {
        setGamePhase('gameOver');
      }
    }
  };


  return (
    <div
      ref={gameContainerRef}
      className="p-4 md:p-6 rounded-lg shadow-xl bg-deep-space/70 text-white relative overflow-hidden"
      onMouseMove={handleMouseMove} // Apply mouse move handler here
    >
      <h2 className="text-2xl font-bold text-star-gold mb-2 text-center">Stellar Memory</h2>
      <div className="flex justify-between items-center mb-4 text-sm">
        <span>Level: {currentLevel}</span>
        <span>Lives: {'❤️'.repeat(lives)}</span>
      </div>

      {gamePhase === 'idle' && (
        <div className="text-center">
          <p className="mb-4">Memorize the sequence of celestial bodies.</p>
          <Button onClick={handleStartButtonClick} variant="primary">
            Start Game
          </Button>
        </div>
      )}

      {/* Breathing Circle */}
      <div
        ref={breathingCircleRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 sm:w-32 sm:h-32 rounded-full pointer-events-none opacity-50 animate-pulseBreath"
        // style={{ background: 'radial-gradient(circle, var(--nebula-purple) 0%, rgba(75,0,130,0.1) 70%)' }}
        // The animation itself will create the visual effect, direct background can be simpler or part of animation
      />

      {/* Celestial Elements Display - layout placeholder */}
      {(gamePhase === 'showingSequence' || gamePhase === 'listening' || gamePhase === 'feedback') && (
        <div className="relative w-64 h-64 sm:w-80 sm:h-80 mx-auto my-8">
          {CELESTIAL_ELEMENTS.map((element, index) => {
            const angle = (index / CELESTIAL_ELEMENTS.length) * 2 * Math.PI - (Math.PI / 2); // Start from top
            const x = Math.cos(angle) * 100 + 128 - 24; // 128 is half of 256 (w-64), 24 is half of button width
            const y = Math.sin(angle) * 100 + 128 - 24; // Adjust radius (100 here) as needed
            return (
              <button
                key={element.id}
                className={`absolute w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-2xl sm:text-3xl
                            ${element.color}
                            ${highlightedElement === element.id ? 'ring-4 ring-white shadow-lg' : 'shadow-md'}
                            ${gamePhase === 'listening' ? 'cursor-pointer hover:ring-2 hover:ring-star-gold' : 'cursor-default'}
                            transition-all duration-150`}
                style={{
                  left: `${x / 256 * 100}%`,
                  top: `${y / 256 * 100}%`,
                  opacity: (gamePhase === 'showingSequence' && highlightedElement !== element.id && highlightedElement !== null) ? currentSequenceOpacity : 1
                }}
                onClick={() => handleUserInput(element.id)}
                disabled={gamePhase !== 'listening'}
                aria-label={element.name} // Added aria-label
              >
                {element.icon}
              </button>
            );
          })}
        </div>
      )}

      {feedbackMessage && <p className="text-center my-2">{feedbackMessage}</p>}

      {gamePhase === 'gameOver' && (
        <div className="text-center">
          <p className="text-xl font-bold text-red-500 mb-2">Game Over!</p>
          <p className="mb-1">You reached Level {maxLevelReachedRef.current}.</p>
          <p className="mb-4">Total Errors: {totalErrorsRef.current}.</p>
          {/* This button will be hidden by the time nextGame() is called, but if user is fast: */}
          <Button onClick={handleStartButtonClick} variant="primary" disabled={gamePhase !== 'gameOver'}>
            Play Again
          </Button>
        </div>
      )}
       {gamePhase === 'finished' && (
        <div className="text-center">
          <p className="text-xl font-bold text-star-gold mb-2">Sequence Mastered!</p>
          {/* Further summary or auto-proceed */}
        </div>
      )}
    </div>
  );
};

export default StellarMemory;
