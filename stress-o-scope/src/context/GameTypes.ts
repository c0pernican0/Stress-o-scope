// src/context/GameTypes.ts

// Psychological profile dimensions for narrative analysis
export interface PsychProfileDimensions {
  planning: number;
  control: number;
  social: number;
  curiosity: number;
  anxiety: number;
  exploration: number;
}

// Individual game result structures
export interface CosmicResults {
  initialElement: string;
  constellationPattern: 'organized' | 'scattered' | 'centered';
  responseTime: number[]; // For 5 questions
  choicePattern: string[]; // Sentiment or category of choices
  totalTime: number;
  constellationPoints: Array<{ x: number; y: number }>;
}

export interface MemoryResults {
  maxSequenceLength: number;
  totalErrors: number;
  averageReactionTime: number;
  breathingSyncRate: number; // Percentage
  failurePoint: string; // e.g., "level_X"
  stressProgression: number[]; // Perceived stress per level
  reactionTimes: number[]; // Time for each element input
}

export interface NarrativeResults {
  decisionSpeed: number[]; // Time for each segment
  psychProfile: PsychProfileDimensions; // Now uses the defined interface
  choiceConsistency: number; // 0-1
  totalTime: number;
  storyPath: string[]; // Sequence of choices made
}

// Structure for the final analysis from Groq API
export interface FinalAnalysis {
  stressLevel: number; // 1-10
  stressAreas: string[]; // e.g., ["cognitivo", "emotivo", "comportamentale"]
  strengths: string[];
  recommendations: string[];
  cosmicHoroscope: string;
  summary: string;
}

// Main state structure for the GameContext
export interface GameState {
  currentGame: number; // 0=intro, 1=cosmic, 2=memory, 3=narrative, 4=results
  isComplete: boolean;
  cosmicResults: CosmicResults | null;
  memoryResults: MemoryResults | null;
  narrativeResults: NarrativeResults | null;
  finalAnalysis: FinalAnalysis | null;
  analysisLoading: boolean;
  analysisError: string | null;
  startTime: number; // Timestamp
  sessionId: string; // UUID
}

// Action types for the reducer
export type GameAction =
  | { type: 'NEXT_GAME' }
  | { type: 'SET_COSMIC_RESULTS'; payload: CosmicResults }
  | { type: 'SET_MEMORY_RESULTS'; payload: MemoryResults }
  | { type: 'SET_NARRATIVE_RESULTS'; payload: NarrativeResults }
  | { type: 'TRIGGER_ANALYSIS' }
  | { type: 'SET_ANALYSIS_COMPLETE'; payload: FinalAnalysis }
  | { type: 'SET_ANALYSIS_ERROR'; payload: string }
  | { type: 'RESET_SESSION' };

// Props for the GameContext
export interface GameContextProps {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  // Convenience action dispatchers (to be defined in GameProvider)
  nextGame: () => void;
  setCosmicResults: (data: CosmicResults) => void;
  setMemoryResults: (data: MemoryResults) => void;
  setNarrativeResults: (data: NarrativeResults) => void;
  triggerAnalysis: () => void;
  setAnalysisComplete: (data: FinalAnalysis) => void; // Added for completeness
  setAnalysisError: (error: string) => void; // Added for completeness
  resetSession: () => void;
}
