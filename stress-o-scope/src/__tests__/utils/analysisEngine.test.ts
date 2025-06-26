import { generateFallbackAnalysis } from '../../utils/analysisEngine';
import { CosmicResults, MemoryResults, NarrativeResults} from '@/context/GameTypes';

// Mock data for testing
const mockCosmicResults: CosmicResults = {
  initialElement: 'star',
  constellationPattern: 'organized',
  responseTime: [1000, 1500, 1200, 1800, 1600],
  choicePattern: ['choiceA', 'choiceB', 'choiceC', 'choiceD', 'choiceE'],
  totalTime: 10000,
  constellationPoints: [{ x: 10, y: 10 }, { x: 20, y: 20 }],
};

const mockMemoryResults: MemoryResults = {
  maxSequenceLength: 5,
  totalErrors: 1,
  averageReactionTime: 800,
  breathingSyncRate: 75,
  failurePoint: 'level_3',
  stressProgression: [], // Assuming no direct input for this in fallback
  reactionTimes: [700, 800, 750, 850, 900],
};

const mockNarrativeResults: NarrativeResults = {
  decisionSpeed: [5000, 6000, 5500, 7000, 6500, 6000],
  psychProfile: {
    planning: 2,
    control: 3,
    social: 1,
    curiosity: 4,
    anxiety: 1,
    exploration: 3,
  },
  choiceConsistency: 0.7,
  totalTime: 36000,
  storyPath: ['pathA', 'pathB', 'pathC', 'pathD', 'pathE', 'pathF'],
};

describe('getFallbackAnalysis', () => {
  it('should return a valid FinalAnalysis object when all inputs are null', () => {
    const analysis = getFallbackAnalysis(null, null, null);
    expect(analysis).toBeDefined();
    expect(typeof analysis.stressLevel).toBe('number');
    expect(analysis.stressLevel).toBeGreaterThanOrEqual(1);
    expect(analysis.stressLevel).toBeLessThanOrEqual(10);
    expect(Array.isArray(analysis.stressAreas)).toBe(true);
    expect(Array.isArray(analysis.strengths)).toBe(true);
    expect(Array.isArray(analysis.recommendations)).toBe(true);
    expect(typeof analysis.cosmicHoroscope).toBe('string');
    expect(typeof analysis.summary).toBe('string');
  });

  it('should return a valid FinalAnalysis object with all inputs provided', () => {
    const analysis = getFallbackAnalysis(mockCosmicResults, mockMemoryResults, mockNarrativeResults);
    expect(analysis).toBeDefined();
    expect(analysis.stressLevel).toBeGreaterThanOrEqual(1);
    expect(analysis.stressLevel).toBeLessThanOrEqual(10);
    // Add more specific checks based on the heuristic logic if desired
    // For example, if mockMemoryResults has high errors, expect cognitive stressArea
    if (mockMemoryResults.totalErrors > 2) {
        expect(analysis.stressAreas).toContain('cognitive');
    }
     if (mockNarrativeResults.psychProfile.anxiety > 2) {
        expect(analysis.stressAreas).toContain('emotivo');
    }
  });

  it('should adjust stress level based on memory game errors', () => {
    const highErrorMemoryResults: MemoryResults = { ...mockMemoryResults, totalErrors: 5 };
    const analysis = getFallbackAnalysis(null, highErrorMemoryResults, null);
    // Assuming default is 5, 5 errors (+2 per error > 2, so +3*2 = +6, capped) or some other logic
    // The exact value depends on the heuristic, let's check if it's higher than base without errors
    const baseAnalysis = getFallbackAnalysis(null, {...mockMemoryResults, totalErrors: 0}, null);
    expect(analysis.stressLevel).toBeGreaterThan(baseAnalysis.stressLevel);
    expect(analysis.stressAreas).toContain('cognitive');
  });

  it('should identify strengths from narrative profile', () => {
    const narrativeWithPlanning: NarrativeResults = {
        ...mockNarrativeResults,
        psychProfile: { ...mockNarrativeResults.psychProfile, planning: 3 }
    };
    const analysis = getFallbackAnalysis(null, null, narrativeWithPlanning);
    expect(analysis.strengths).toContain('Strong planning and methodical approach.');
  });
});
