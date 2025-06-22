// src/context/GameContext.tsx
'use client'; // Required for Context API in Next.js App Router

import React, { createContext, useReducer, useContext, ReactNode } from 'react';
import {
  GameState,
  GameAction,
  GameContextProps,
  CosmicResults, // Will be needed for dispatchers
  MemoryResults, // Will be needed for dispatchers
  NarrativeResults, // Will be needed for dispatchers
  FinalAnalysis, // Will be needed for dispatchers
} from './GameTypes';

// Initial state for the context
const initialState: GameState = {
  currentGame: 0, // 0=intro, 1=cosmic, 2=memory, 3=narrative, 4=results
  isComplete: false,
  cosmicResults: null,
  memoryResults: null,
  narrativeResults: null,
  finalAnalysis: null,
  analysisLoading: false,
  analysisError: null,
  startTime: Date.now(),
  sessionId: typeof window !== 'undefined' ? crypto.randomUUID() : '', // Generate UUID client-side
};

// Create the context with a default value that should ideally not be used directly
const GameContext = createContext<GameContextProps | undefined>(undefined);

// Reducer function to manage state transitions
const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'NEXT_GAME':
      const nextGameIndex = state.currentGame + 1;
      // Assuming 4 is the results page, so game completes after game 3 (index)
      // Games: 0=intro, 1=cosmic, 2=memory, 3=narrative. After narrative (index 3), next is results (index 4)
      const isNowComplete = nextGameIndex === 4;
      return {
        ...state,
        currentGame: nextGameIndex,
        isComplete: isNowComplete || state.isComplete, // Persist completion
      };
    case 'SET_COSMIC_RESULTS':
      return {
        ...state,
        cosmicResults: action.payload,
      };
    case 'SET_MEMORY_RESULTS':
      return {
        ...state,
        memoryResults: action.payload,
      };
    case 'SET_NARRATIVE_RESULTS':
      return {
        ...state,
        narrativeResults: action.payload,
      };
    case 'TRIGGER_ANALYSIS':
      return {
        ...state,
        analysisLoading: true,
        analysisError: null,
        finalAnalysis: null, // Clear previous analysis
      };
    case 'SET_ANALYSIS_COMPLETE':
      return {
        ...state,
        finalAnalysis: action.payload,
        analysisLoading: false,
      };
    case 'SET_ANALYSIS_ERROR':
      return {
        ...state,
        analysisError: action.payload,
        analysisLoading: false,
      };
    case 'RESET_SESSION':
      return {
        ...initialState, // Spread the base initial state
        sessionId: typeof window !== 'undefined' ? crypto.randomUUID() : '', // Generate new session ID
        startTime: Date.now(), // Reset start time
        // Explicitly reset fields that might not be in initialState if it's ever changed shallowly
        currentGame: 0,
        isComplete: false,
        cosmicResults: null,
        memoryResults: null,
        narrativeResults: null,
        finalAnalysis: null,
        analysisLoading: false,
        analysisError: null,
      };
    default:
      return state;
  }
};

// GameProvider component
interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Convenience action dispatchers
  const nextGame = () => dispatch({ type: 'NEXT_GAME' });
  const setCosmicResults = (data: CosmicResults) => dispatch({ type: 'SET_COSMIC_RESULTS', payload: data });
  const setMemoryResults = (data: MemoryResults) => dispatch({ type: 'SET_MEMORY_RESULTS', payload: data });
  const setNarrativeResults = (data: NarrativeResults) => dispatch({ type: 'SET_NARRATIVE_RESULTS', payload: data });
  const triggerAnalysis = () => dispatch({ type: 'TRIGGER_ANALYSIS' });
  const setAnalysisComplete = (data: FinalAnalysis) => dispatch({ type: 'SET_ANALYSIS_COMPLETE', payload: data });
  const setAnalysisError = (error: string) => dispatch({ type: 'SET_ANALYSIS_ERROR', payload: error });
  const resetSession = () => dispatch({ type: 'RESET_SESSION' });

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = React.useMemo(() => ({
    state,
    dispatch, // Exposing dispatch directly if needed, alongside convenience functions
    nextGame,
    setCosmicResults,
    setMemoryResults,
    setNarrativeResults,
    triggerAnalysis,
    setAnalysisComplete,
    setAnalysisError,
    resetSession,
  }), [state]); // Add other dependencies if action functions are not stable (they are here)

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
};

// Custom hook to use the GameContext
export const useGameContext = (): GameContextProps => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};

// Clean up temporary export
// export {}; // No longer needed
