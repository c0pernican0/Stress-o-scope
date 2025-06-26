'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useGameContext } from '@/context/GameContext';
import { Button } from '@/components/ui';
import { NarrativeResults, PsychProfileDimensions } from '@/context/GameTypes';

export interface StoryOption {
  text: string;
  effects: Partial<PsychProfileDimensions>; // Partial because not all options affect all dimensions
}

export interface StorySegment {
  id: number;
  text: string;
  options: StoryOption[];
}

export interface DecisionRecord {
  segmentId: number;
  choiceText: string;
  timeTaken: number; // in milliseconds
}

// Story Data as per the prompt
const STORY_DATA: StorySegment[] = [
  {
    id: 1,
    text: "You awaken in an unfamiliar yet cozy house. The first thing you do is...",
    options: [
      { text: "Methodically explore each room", effects: { planning: 1, control: 1 } },
      { text: "Look for other inhabitants", effects: { social: 1, curiosity: 1 } },
      { text: "Check if your belongings are safe", effects: { control: 1, anxiety: 1 } },
      { text: "Peer outside to understand your location", effects: { curiosity: 1, exploration: 1 } },
    ],
  },
  {
    id: 2,
    text: "A mysterious person approaches with a friendly smile. How do you react?",
    options: [
      { text: "Ask many questions about who they are", effects: { curiosity: 1, social: 1 } },
      { text: "Remain cautious and observe them", effects: { control: 1, anxiety: 1 } },
      { text: "Be immediately friendly and open", effects: { social: 1, exploration: 1 } },
      { text: "Assess the situation before acting", effects: { planning: 1 } },
    ],
  },
  {
    id: 3,
    text: "You are presented with a complex puzzle that seems important. Your approach?",
    options: [
      { text: "Systematically analyze every detail", effects: { planning: 1, control: 1 } },
      { text: "Ask others for help or insights", effects: { social: 1 } },
      { text: "Try intuitive solutions quickly", effects: { exploration: 1, curiosity: 1 } },
      { text: "Worry about the possibility of failing", effects: { anxiety: 1 } },
    ],
  },
  {
    id: 4,
    text: "Two people are arguing and turn to you for a solution. How do you proceed?",
    options: [
      { text: "Methodically listen to both sides", effects: { planning: 1, social: 1 } },
      { text: "Propose a quick compromise", effects: { social: 1, exploration: 1 } },
      { text: "Avoid getting involved if possible", effects: { anxiety: 1, control: 1 } }, // Prompt had control+1 here too
      { text: "Take control of the situation assertively", effects: { control: 1, social: 1 } }, // Prompt had social+1
    ],
  },
  {
    id: 5,
    text: "You must plan the next step of your journey. Your strategy?",
    options: [
      { text: "Create a detailed step-by-step plan", effects: { planning: 1, control: 1 } },
      { text: "Decide to go with the flow of events", effects: { exploration: 1 } },
      { text: "Consult others before making a decision", effects: { social: 1 } },
      { text: "Worry about potential negative consequences", effects: { anxiety: 1, planning: 1 } },
    ],
  },
  {
    id: 6,
    text: "You arrive at a crossroads that will determine the rest of your journey. How do you choose?",
    options: [
      { text: "Follow the safest, most known path", effects: { control: 1, anxiety: 1 } },
      { text: "Choose adventure and the unknown", effects: { exploration: 1, curiosity: 1 } },
      { text: "Ask for advice and weigh opinions", effects: { social: 1, planning: 1 } },
      { text: "Meditate on the choice and trust your intuition", effects: { curiosity: 1 } }, // Prompt had only curiosity+1
    ],
  },
];


const NarrativeWaves: React.FC = () => {
  const { setNarrativeResults, nextGame } = useGameContext();

  const [currentSegmentIndex, setCurrentSegmentIndex] = useState<number>(0);
  const [userPsychProfile, setUserPsychProfile] = useState<PsychProfileDimensions>({
    planning: 0,
    control: 0,
    social: 0,
    curiosity: 0,
    anxiety: 0,
    exploration: 0,
  });
  const [decisionRecords, setDecisionRecords] = useState<DecisionRecord[]>([]);
  const [storyPath, setStoryPath] = useState<string[]>([]);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const [segmentStartTime, setSegmentStartTime] = useState<number>(0);
  const [gameStartTime, setGameStartTime] = useState<number>(0);

  useEffect(() => {
    setGameStartTime(Date.now());
    setSegmentStartTime(Date.now());
  }, []);

  const handleOptionSelect = useCallback((option: StoryOption) => {
    if (isFinished) return;

    const timeTaken = Date.now() - segmentStartTime;
    const currentSegment = STORY_DATA[currentSegmentIndex];

    // Record decision
    const newDecision: DecisionRecord = {
      segmentId: currentSegment.id,
      choiceText: option.text,
      timeTaken: timeTaken,
    };
    setDecisionRecords(prev => [...prev, newDecision]);

    // Update story path
    setStoryPath(prev => [...prev, option.text]);

    // Update psychological profile
    setUserPsychProfile(prevProfile => {
      const updatedProfile = { ...prevProfile };
      for (const key in option.effects) {
        if (Object.prototype.hasOwnProperty.call(option.effects, key)) {
          const dimension = key as keyof PsychProfileDimensions;
          updatedProfile[dimension] += option.effects[dimension] || 0;
        }
      }
      return updatedProfile;
    });

    // Move to next segment or finish
    if (currentSegmentIndex < STORY_DATA.length - 1) {
      setCurrentSegmentIndex(prevIndex => prevIndex + 1);
      setSegmentStartTime(Date.now()); // Reset timer for the new segment
    } else {
      setIsFinished(true);
    }
  }, [isFinished, segmentStartTime, currentSegmentIndex]);

  // Metrics Calculation (and context update in the next step)
  useEffect(() => {
    if (isFinished) {
      const calculatedTotalTime = Date.now() - gameStartTime;
      const calculatedDecisionSpeed = decisionRecords.map(dr => dr.timeTaken);

      // Calculate Choice Consistency (heuristic based on variance of psych profile scores)
      // Lower variance might mean a more "balanced" or less spiky profile.
      // Higher variance means some traits are much more dominant.
      // For "consistency" as in "user consistently picks similar types of choices",
      // a low number of dominant traits (low variance among a few high scores, others low)
      // or high scores in general might be better.
      // Let's use a simple variance measure:
      // 1. Get the final scores of the 6 dimensions.
      const profileScores = Object.values(userPsychProfile);
      // 2. Calculate the mean of these scores.
      const meanScore = profileScores.reduce((sum, score) => sum + score, 0) / profileScores.length;
      // 3. Calculate the variance.
      const variance = profileScores.reduce((sum, score) => sum + Math.pow(score - meanScore, 2), 0) / profileScores.length;

      // Normalize variance to a 0-1 "consistency" score.
      // Max possible score for a dimension is 6 (if one option per segment boosted it, unlikely by design).
      // A more realistic max is around 3-4 for a dimension.
      // If all scores are equal (e.g., all 2), variance is 0. Perfect "balance".
      // If one score is high (e.g., 4) and others low (e.g., 0-1), variance is high. "Spiky" profile.
      // Let's define consistency as 1 - normalized_variance.
      // Max possible variance: if one is N and K-1 are 0, var is roughly (N^2/K) * (K-1)/K.
      // If one is 3, five are 0 (total score 3), mean=0.5. Var = ( (2.5^2)*1 + (-0.5^2)*5 ) / 6 = (6.25 + 1.25)/6 = 7.5/6 = 1.25
      // If all are 1 (total score 6), mean=1. Var = 0.
      // Max possible total score is around 6-8 if user picks options that always boost some traits.
      // Max score for any single dimension is realistically capped by number of segments (6).
      // Let's assume max possible individual score is 6. Max variance if one is 6, others 0: mean=1. Var = ( (5^2)*1 + (-1^2)*5 )/6 = (25+5)/6 = 5.
      // So, let's normalize variance by 5 (approx max variance).
      const MAX_VARIANCE_HEURISTIC = 5; // This is a rough estimate, might need tuning.
      let calculatedChoiceConsistency = 1 - Math.min(variance / MAX_VARIANCE_HEURISTIC, 1);
      calculatedChoiceConsistency = parseFloat(calculatedChoiceConsistency.toFixed(2));


      const finalResults: NarrativeResults = {
        decisionSpeed: calculatedDecisionSpeed,
        psychProfile: userPsychProfile,
        choiceConsistency: calculatedChoiceConsistency, // Placeholder for now
        totalTime: calculatedTotalTime,
        storyPath: storyPath,
      };

      setNarrativeResults(finalResults);
      // Short delay before automatically moving to the next game/results
      const timer = setTimeout(() => {
        nextGame();
      }, 1500); // Give user a moment to see the "concludes" message

      return () => clearTimeout(timer); // Cleanup timer if component unmounts
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFinished, gameStartTime, decisionRecords, userPsychProfile, storyPath, setNarrativeResults, nextGame]);


  // Rendering logic and interaction handlers will be added next

  return (
    <div className="p-4 md:p-6 rounded-lg shadow-xl bg-deep-space/70 text-white max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-star-gold mb-6 text-center">Narrative Waves</h2>
      {/* Content will be rendered here based on game state */}
      {STORY_DATA[currentSegmentIndex] && !isFinished ? (
        <div className="animate-fadeIn"> {/* Simple fade-in for segment changes */}
          <p className="text-center text-sm text-nebula-purple mb-3 tracking-wider">
            SEGMENT {currentSegmentIndex + 1} OF {STORY_DATA.length}
          </p>
          <p className="text-xl sm:text-2xl leading-relaxed text-gray-200 mb-8 text-center min-h-[6em] sm:min-h-[4em]">
            {STORY_DATA[currentSegmentIndex].text}
          </p>
          <div className="space-y-3 sm:space-y-4">
            {STORY_DATA[currentSegmentIndex].options.map((option, index) => (
              <Button
                key={index}
                variant="cosmic" // Or a new 'narrative' variant if desired
                size="lg" // Larger buttons for readability
                className="w-full !justify-start text-left !py-3 sm:!py-4 !px-4 sm:!px-5 !normal-case !font-normal"
                onClick={() => handleOptionSelect(option)}
              >
                {option.text}
              </Button>
            ))}
          </div>
        </div>
      ) : isFinished ? (
        <div className="text-center animate-fadeIn">
          <p className="text-2xl text-star-gold mb-4">The narrative concludes.</p>
          <p className="text-lg text-gray-300">Calculating your wave pattern...</p>
        </div>
      ) : (
        // Initial loading or pre-start state, though game starts immediately
        <p className="text-center text-lg">Loading story...</p>
      )}
    </div>
  );
};

export default NarrativeWaves;
