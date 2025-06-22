import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { CosmicResults, MemoryResults, NarrativeResults, FinalAnalysis } from '@/context/GameTypes';
import { getFallbackAnalysis } from '@/utils/analysisEngine'; // Import fallback function

// Ensure the API key is available
if (!process.env.GROQ_API_KEY) {
  console.error('GROQ_API_KEY is not set in environment variables.');
  // Optionally, throw an error at startup or handle this more gracefully
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { cosmicResults, memoryResults, narrativeResults } = body as {
      cosmicResults: CosmicResults | null;
      memoryResults: MemoryResults | null;
      narrativeResults: NarrativeResults | null;
    };

    // Basic validation: Check if all results are present
    if (!cosmicResults || !memoryResults || !narrativeResults) {
      return NextResponse.json({ error: 'Missing game results data.' }, { status: 400 });
    }

    // Placeholder for prompt engineering and Groq call (Step 4 & 5)
    // Placeholder for fallback logic (Step 6 & 7)

    function constructAnalysisPrompt(
        cosmic: CosmicResults,
        memory: MemoryResults,
        narrative: NarrativeResults
    ): string {
        // Helper to format arrays/objects nicely for the prompt
        const formatArray = (arr: any[] | undefined | null) => arr && arr.length > 0 ? arr.join(', ') : 'N/A';
        const formatObject = (obj: object | undefined | null) => obj ? JSON.stringify(obj, null, 2) : 'N/A';

        // Constructing detailed data presentation for each game
        const cosmicData = `
        Game 1: Cosmic Calm
        - Initial Element Chosen: ${cosmic.initialElement || 'N/A'}
        - Constellation Pattern: ${cosmic.constellationPattern || 'N/A'}
        - Constellation Points: ${cosmic.constellationPoints?.length || 0} points created.
          (Detailed points: ${formatObject(cosmic.constellationPoints)})
        - Question Response Times (ms): ${formatArray(cosmic.responseTime)}
        - Question Choices: ${formatArray(cosmic.choicePattern)}
        - Total Time for Cosmic Calm (ms): ${cosmic.totalTime || 'N/A'}
        `;

        const memoryData = `
        Game 2: Stellar Memory (Cosmic Simon)
        - Max Sequence Length Reached: ${memory.maxSequenceLength || 'N/A'}
        - Total Errors: ${memory.totalErrors || 0}
        - Average Reaction Time (ms): ${memory.averageReactionTime || 'N/A'}
        - Detailed Reaction Times (ms): ${formatArray(memory.reactionTimes)}
        - Breathing Sync Rate (%): ${memory.breathingSyncRate !== null && memory.breathingSyncRate !== undefined ? memory.breathingSyncRate.toFixed(1) : 'N/A'}
        - Failure Point: ${memory.failurePoint || 'N/A'}
        - Perceived Stress Progression (if available): ${formatArray(memory.stressProgression)}
        `;

        const narrativeData = `
        Game 3: Narrative Waves (Interactive Storytelling)
        - Decision Speeds per Segment (ms): ${formatArray(narrative.decisionSpeed)}
        - Psychological Profile Scores: ${formatObject(narrative.psychProfile)}
        - Choice Consistency Score (0-1): ${narrative.choiceConsistency !== null && narrative.choiceConsistency !== undefined ? narrative.choiceConsistency.toFixed(2) : 'N/A'}
        - Story Path (Choices Made):
          ${narrative.storyPath?.map((choice, i) => `  Segment ${i+1}: "${choice}"`).join('\n') || 'N/A'}
        - Total Time for Narrative Waves (ms): ${narrative.totalTime || 'N/A'}
        `;

        // The main prompt for the AI
        return `
        You are an AI assistant for the 'Stress-O-Scope' application, designed to analyze user stress levels and patterns based on their performance in three interactive games.
        Please provide a comprehensive analysis based on the following game data.

        ${cosmicData}
        ${memoryData}
        ${narrativeData}

        Analysis Instructions:
        Based on all the provided data, please generate a JSON object with the following structure and content:
        {
          "stressLevel": number, // An overall stress level from 1 (very low stress) to 10 (very high stress). Consider cognitive load (memory game errors, reaction times), emotional indicators (narrative choices like anxiety), and behavioral patterns (constellation, decision speeds).
          "stressAreas": string[], // Identify key areas where stress might be manifesting. Examples: "cognitive" (e.g., from memory game performance, decision speed), "emotivo" (e.g., from narrative choices related to anxiety, control), "comportamentale" (e.g., scattered constellation, inconsistent choices). Choose 1-3 relevant areas.
          "strengths": string[], // Identify 2-3 positive traits or strengths demonstrated by the user. Examples: "Resilience under pressure", "Good attention control (high breathing sync)", "Methodical planning (narrative choices)", "Creative expression (constellation type)", "Curiosity and openness (narrative/cosmic choices)".
          "recommendations": string[], // Provide 3-5 personalized, actionable recommendations to manage stress or enhance well-being, tailored to the analysis. Examples: "Practice mindfulness for 5-10 minutes daily.", "Incorporate short breaks during demanding tasks.", "Explore creative outlets to express yourself.".
          "cosmicHoroscope": string, // A short (2-3 sentences) uplifting, cosmic-themed "horoscope" or motivational message. Example: "The stars indicate a phase of insightful growth. Your ability to navigate challenges shines brightly. Embrace the journey ahead with cosmic calm."
          "summary": string // A concise (1-2 sentences) summary of the user's overall stress profile and key takeaways.
        }

        Interpretation Guidelines:
        - Cosmic Calm:
            - Constellation Pattern: 'centered' might suggest focus or control; 'scattered' might suggest distraction or creativity; 'organized' could be methodical.
            - Response Times/Choices: Quick, impulsive choices vs. slow, deliberate ones. Choices might reflect mood or outlook.
        - Stellar Memory:
            - High max sequence length and low errors indicate good working memory and focus.
            - Average Reaction Time: Lower is generally better. Increases might indicate rising cognitive load.
            - Breathing Sync Rate: Higher % suggests better focus and calmness under pressure.
            - Failure Point: Early failure might indicate lower stress resilience or difficulty with the task type.
        - Narrative Waves:
            - Psych Profile: High 'anxiety' or 'control' might correlate with stress. High 'planning', 'social', 'curiosity', 'exploration' can be strengths or indicate coping styles.
            - Decision Speed: Very fast or very slow decisions could be stress indicators.
            - Choice Consistency: High consistency might mean a clear approach; low might mean indecisiveness or varied coping mechanisms.
            - Story Path: Choices related to avoidance, worry, or seeking help can be informative.

        Cross-Game Analysis:
        - Correlate findings. E.g., if memory game shows high errors AND narrative choices show high anxiety, this might indicate cognitive stress linked to emotional state.
        - If breathing sync is high DESPITE high difficulty in memory game, it's a strength.

        IMPORTANT: Ensure your entire response is ONLY the JSON object described above, with no other text before or after it.
        The JSON keys must be exactly as specified. Values should be appropriate types.
        `;
    }

    // Construct the prompt using the validated results
    const prompt = constructAnalysisPrompt(cosmicResults, memoryResults, narrativeResults);
    // console.log("API Route: Constructed Prompt for Groq:\n", prompt); // Keep for debugging if needed

    try {
      console.log("Attempting Groq API call...");
      const completion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: "mixtral-8x7b-32768",
        temperature: 0.7, // Adjust for creativity vs. determinism
        // max_tokens: 1024, // Optional: limit response size
        response_format: { type: "json_object" }, // Crucial for getting JSON output
      });

      const aiResponseContent = completion.choices[0]?.message?.content;
      if (!aiResponseContent) {
        console.error('Groq API returned empty content. Using fallback.');
        const fallbackAnalysis = getFallbackAnalysis(cosmicResults, memoryResults, narrativeResults);
        return NextResponse.json(fallbackAnalysis, { status: 200, headers: { 'X-Analysis-Source': 'Fallback' } });
      }

      console.log("Groq API Raw Response:", aiResponseContent);

      let analysisResult: FinalAnalysis;
      try {
        analysisResult = JSON.parse(aiResponseContent);
        // Basic validation of the parsed JSON structure
        if (
          typeof analysisResult.stressLevel !== 'number' ||
          !Array.isArray(analysisResult.stressAreas) ||
          !Array.isArray(analysisResult.strengths) ||
          !Array.isArray(analysisResult.recommendations) ||
          typeof analysisResult.cosmicHoroscope !== 'string' ||
          typeof analysisResult.summary !== 'string'
        ) {
            console.error("Invalid JSON structure from AI. Using fallback.", analysisResult);
            const fallbackAnalysis = getFallbackAnalysis(cosmicResults, memoryResults, narrativeResults);
            return NextResponse.json(fallbackAnalysis, { status: 200, headers: { 'X-Analysis-Source': 'Fallback-Invalid-AI-Structure' } });
        }
        console.log("Groq API Parsed and Validated Response:", analysisResult);
        return NextResponse.json(analysisResult, { status: 200, headers: { 'X-Analysis-Source': 'AI' } });

      } catch (parseError) {
        console.error('Failed to parse JSON response from Groq. Using fallback.', parseError);
        console.error('Malformed JSON string:', aiResponseContent);
        const fallbackAnalysis = getFallbackAnalysis(cosmicResults, memoryResults, narrativeResults);
        return NextResponse.json(fallbackAnalysis, { status: 200, headers: { 'X-Analysis-Source': 'Fallback-Parse-Error' } });
      }

    } catch (apiError: any) {
      console.error('Groq API call failed. Using fallback.', apiError.message || apiError);
      const fallbackAnalysis = getFallbackAnalysis(cosmicResults, memoryResults, narrativeResults);
      return NextResponse.json(fallbackAnalysis, { status: 200, headers: { 'X-Analysis-Source': 'Fallback-API-Error' } });
    }

  } catch (error) {
    console.error('Error in /api/analyze (outer try-catch):', error);
    if (error instanceof SyntaxError) { // JSON parsing error
        return NextResponse.json({ error: 'Invalid request body: Malformed JSON.' }, { status: 400 });
    }
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}

// Optional: Add a GET handler or other methods if needed, though not required by the plan.
// export async function GET(request: Request) {
//   return NextResponse.json({ message: 'This is the analyze API endpoint. Use POST to submit data.' });
// }
