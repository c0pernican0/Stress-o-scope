import { CosmicResults, MemoryResults, NarrativeResults, FinalAnalysis, PsychProfileDimensions } from '@/context/GameTypes';

/**
 * Generates a fallback analysis object if the primary AI analysis fails.
 * This function uses simple heuristics based on game results to provide a plausible,
 * albeit simplified, stress analysis.
 *
 * @param cosmicResults - Results from the Cosmic Calm game.
 * @param memoryResults - Results from the Stellar Memory game.
 * @param narrativeResults - Results from the Narrative Waves game.
 * @returns A `FinalAnalysis` object with fallback data.
 */
export function getFallbackAnalysis(
  cosmicResults: CosmicResults | null,
  memoryResults: MemoryResults | null,
  narrativeResults: NarrativeResults | null
): FinalAnalysis {
  let stressLevel = 5; // Default neutral
  const stressAreas: string[] = [];
  const strengths: string[] = [];
  let recommendations: string[] = [
    "Take a few deep breaths when you feel overwhelmed.",
    "Ensure you get adequate sleep to support cognitive function.",
    "Connect with a friend or loved one today.",
  ];
  let cosmicHoroscope = "The universe is vast and full of possibilities. Even small steps forward are progress. Stay curious!";
  let summary = "Fallback analysis indicates a need for general stress management techniques. Detailed insights require AI connection.";

  // Heuristics based on game results
  if (memoryResults) {
    if (memoryResults.totalErrors > 2) {
      stressLevel = Math.min(10, stressLevel + 2);
      if (!stressAreas.includes("cognitive")) stressAreas.push("cognitive");
    }
    if (memoryResults.averageReactionTime > 1500 && memoryResults.averageReactionTime !== 0) { // Assuming RT is in ms
      stressLevel = Math.min(10, stressLevel + 1);
      if (!stressAreas.includes("cognitive")) stressAreas.push("cognitive");
    }
    if (memoryResults.maxSequenceLength < 4 && memoryResults.failurePoint !== "completed_all") { // Example threshold
        stressLevel = Math.min(10, stressLevel + 1);
    }
    if (memoryResults.breathingSyncRate > 60) {
      strengths.push("Good focus under pressure (based on breathing sync).");
    } else if (memoryResults.breathingSyncRate < 30 && memoryResults.breathingSyncRate !== 0) {
      recommendations.push("Try focusing on your breath during tasks to improve concentration.");
    }
  }

  if (narrativeResults) {
    const profile = narrativeResults.psychProfile;
    if (profile.anxiety > 2) { // Assuming profile scores are sums of +1s
      stressLevel = Math.min(10, stressLevel + profile.anxiety);
      if (!stressAreas.includes("emotivo")) stressAreas.push("emotivo");
    }
    if (profile.control > 3) {
        // High control can be a stressor or a coping mechanism
        recommendations.push("Consider moments where letting go of control might be beneficial.");
    }
    if (profile.planning > 2) strengths.push("Strong planning and methodical approach.");
    if (profile.social > 2) strengths.push("Socially oriented and collaborative.");
    if (profile.curiosity > 2) strengths.push("Curious and open to new experiences.");
    if (profile.exploration > 2) strengths.push("Enjoys exploration and adventure.");

    // Simple check for decision speed
    const avgDecisionSpeed = narrativeResults.decisionSpeed.reduce((a, b) => a + b, 0) / (narrativeResults.decisionSpeed.length || 1);
    if (avgDecisionSpeed > 15000 && narrativeResults.decisionSpeed.length > 0) { // e.g., >15s average per decision
        stressLevel = Math.min(10, stressLevel + 1);
        if (!stressAreas.includes("cognitive")) stressAreas.push("cognitive");
        recommendations.push("Practice making timely decisions to reduce potential overthinking.");
    }
  }

  if (cosmicResults) {
      if (cosmicResults.constellationPattern === 'scattered') {
          recommendations.push("Channel your creativity; perhaps find structure in your imaginative ideas.");
      } else if (cosmicResults.constellationPattern === 'centered') {
          strengths.push("Focused and centered approach (based on constellation).");
      }
  }

  if (stressAreas.length === 0) {
    stressAreas.push("general"); // Default if no specific area triggered
  }
  if (strengths.length === 0) {
      strengths.push("Potential for self-discovery through these games.");
  }

  // Clamp stress level
  stressLevel = Math.max(1, Math.min(10, Math.round(stressLevel)));

  return {
    stressLevel,
    stressAreas,
    strengths,
    recommendations,
    cosmicHoroscope,
    summary,
  };
}
