// src/context/GameContext.tsx
'use client';

import React, { createContext, useReducer, useContext, ReactNode, useCallback } from 'react'; // Added useEffect
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

const SESSION_STORAGE_KEY = 'stressOScopeGameState';

// Function to load state from session storage
const loadStateFromSessionStorage = (): Partial<GameState> | undefined => {
  if (typeof window === 'undefined') return undefined;
  try {
    const serializedState = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (serializedState === null) {
      return undefined;
    }
    const storedState = JSON.parse(serializedState);
    // Ensure essential parts for rehydration are present, otherwise discard
    if (typeof storedState.currentGame === 'number') {
        // Could add more checks here if needed
        return storedState;
    }
    return undefined;
  } catch (error) {
    console.warn("Error loading state from session storage:", error);
    return undefined;
  }
};


// Reducer function to manage state transitions
const gameReducer = (state: GameState, action: GameAction): GameState => {
  let newState: GameState;
  switch (action.type) {
    case 'NEXT_GAME':
      const nextGameIndex = state.currentGame + 1;
      const isNowComplete = nextGameIndex === 4;
      newState = {
        ...state,
        currentGame: nextGameIndex,
        isComplete: isNowComplete || state.isComplete,
      };
      break;
    case 'SET_COSMIC_RESULTS':
      newState = { ...state, cosmicResults: action.payload };
      break;
    case 'SET_MEMORY_RESULTS':
      newState = { ...state, memoryResults: action.payload };
      break;
    case 'SET_NARRATIVE_RESULTS':
      newState = { ...state, narrativeResults: action.payload };
      break;
    case 'TRIGGER_ANALYSIS':
      newState = {
        ...state,
        analysisLoading: true,
        analysisError: null,
        finalAnalysis: null,
      };
      break;
    case 'SET_ANALYSIS_COMPLETE':
      newState = {
        ...state,
        finalAnalysis: action.payload,
        analysisLoading: false,
      };
      break;
    case 'SET_ANALYSIS_ERROR':
      newState = {
        ...state,
        analysisError: action.payload,
        analysisLoading: false,
      };
      break;
    case 'RESET_SESSION':
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
      }
      newState = {
        ...initialState,
        sessionId: typeof window !== 'undefined' ? crypto.randomUUID() : '',
        startTime: Date.now(),
        currentGame: 0,
        isComplete: false,
        cosmicResults: null,
        memoryResults: null,
        narrativeResults: null,
        finalAnalysis: null,
        analysisLoading: false,
        analysisError: null,
      };
      break;
    default:
      newState = state;
  }

  // Save relevant parts of the new state to session storage (excluding sensitive or very large data if any)
  if (typeof window !== 'undefined' && action.type !== 'RESET_SESSION') { // Avoid saving the reset state immediately before it's used
    try {
      const stateToSave = {
        currentGame: newState.currentGame,
        isComplete: newState.isComplete,
        cosmicResults: newState.cosmicResults,
        memoryResults: newState.memoryResults,
        narrativeResults: newState.narrativeResults,
        finalAnalysis: newState.finalAnalysis, // Save analysis too if user refreshes on results page
        sessionId: newState.sessionId, // Persist session ID
        startTime: newState.startTime, // Persist original start time
        // analysisLoading and analysisError are transient, probably don't need to save.
      };
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (error) {
      console.warn("Error saving state to session storage:", error);
    }
  }
  return newState;
};

// GameProvider component
interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  // Initialize state with data from session storage if available
  const [state, dispatch] = useReducer(gameReducer, {
    ...initialState,
    ...loadStateFromSessionStorage(), // Spread stored state over initial, potentially overriding
    // Ensure crucial fields like sessionId and startTime are re-initialized if not in storedState or if it's a fresh session
    sessionId: loadStateFromSessionStorage()?.sessionId || (typeof window !== 'undefined' ? crypto.randomUUID() : ''),
    startTime: loadStateFromSessionStorage()?.startTime || Date.now(),
  });


  // Effect to clear session storage on explicit session reset through UI, if reducer doesn't cover all edge cases.
  // The reducer's RESET_SESSION already handles this.

  // Convenience action dispatchers
  const nextGame = useCallback(() => dispatch({ type: 'NEXT_GAME' }), []);
  const setCosmicResults = useCallback((data: CosmicResults) => dispatch({ type: 'SET_COSMIC_RESULTS', payload: data }), []);
  const setMemoryResults = useCallback((data: MemoryResults) => dispatch({ type: 'SET_MEMORY_RESULTS', payload: data }), []);
  const setNarrativeResults = useCallback((data: NarrativeResults) => dispatch({ type: 'SET_NARRATIVE_RESULTS', payload: data }), []);

  const setAnalysisComplete = useCallback((data: FinalAnalysis) => dispatch({ type: 'SET_ANALYSIS_COMPLETE', payload: data }), []);
  const setAnalysisError = useCallback((error: string) => dispatch({ type: 'SET_ANALYSIS_ERROR', payload: error }), []);
  const resetSession = useCallback(() => dispatch({ type: 'RESET_SESSION' }), []);

  const triggerAnalysis = useCallback(async () => {
    if (!state.cosmicResults || !state.memoryResults || !state.narrativeResults) {
      console.error("Cannot trigger analysis: Not all game results are available.");
      setAnalysisError("Cannot trigger analysis: Missing some game results.");
      return;
    }

    dispatch({ type: 'TRIGGER_ANALYSIS' }); // Sets loading to true, clears previous error/analysis

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cosmicResults: state.cosmicResults,
          memoryResults: state.memoryResults,
          narrativeResults: state.narrativeResults,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        // Use error message from API response if available, otherwise a generic one
        const errorMessage = responseData.error || `API request failed with status ${response.status}`;
        throw new Error(errorMessage);
      }

      // Assuming responseData is of type FinalAnalysis
      setAnalysisComplete(responseData as FinalAnalysis);

    } catch (apiError: unknown) {
      const errorMessage = apiError instanceof Error ? apiError.message : 'Unknown API error';
      console.error('Groq API call failed. Using fallback.', errorMessage);      
      setAnalysisError(errorMessage);
    }
  }, [state.cosmicResults, state.memoryResults, state.narrativeResults, setAnalysisComplete, setAnalysisError]);


  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = React.useMemo(() => ({
    state,
    dispatch,
    nextGame,
    setCosmicResults,
    setMemoryResults,
    setNarrativeResults,
    triggerAnalysis,
    setAnalysisComplete, // Keep these if direct dispatch is ever needed from a component, though triggerAnalysis is primary
    setAnalysisError,    // Same as above
    resetSession,
  }), [state, nextGame, setCosmicResults, setMemoryResults, setNarrativeResults, triggerAnalysis, setAnalysisComplete, setAnalysisError, resetSession]);

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
