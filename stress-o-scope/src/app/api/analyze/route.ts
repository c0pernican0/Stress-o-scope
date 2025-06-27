import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { CosmicResults, MemoryResults, NarrativeResults, FinalAnalysis } from '@/context/GameTypes';
import { getFallbackAnalysis } from '@/utils/analysisEngine';

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

    // Initialize Groq inside the function (runtime) instead of at module level (build time)
    let groq: Groq | null = null;
    
    if (process.env.GROQ_API_KEY) {
      try {
        groq = new Groq({
          apiKey: process.env.GROQ_API_KEY,
        });
      } catch (initError) {
        console.error('Failed to initialize Groq client:', initError);
        groq = null;
      }
    } else {
      console.warn('GROQ_API_KEY is not set in environment variables. Using fallback analysis.');
    }

    function constructAnalysisPrompt(
        cosmic: CosmicResults,
        memory: MemoryResults,
        narrative: NarrativeResults
    ): string {
        const formatArray = (arr: unknown[] | undefined | null) => arr && arr.length > 0 ? arr.join(', ') : 'N/A';
        const formatObject = (obj: object | undefined | null) => obj ? JSON.stringify(obj, null, 2) : 'N/A';

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
        - Breathing Sync Rate (%): ${memory.breathingSyncRate !== null && memory.breathingSyncRate !== undefined ?
          (memory.breathingSyncRate * 100).toFixed(1) : 'N/A'}
        - Failure Point: ${memory.failurePoint || 'N/A'}
        `;

        const narrativeData = `
        Game 3: Narrative Waves (Interactive Story)
        - Decision Speed (ms): ${formatArray(narrative.decisionSpeed)}
        - Psychological Profile:
          ${formatObject(narrative.psychProfile)}
        - Choice Consistency: ${narrative.choiceConsistency?.toFixed(2) || 'N/A'}
        - Total Time for Narrative Waves (ms): ${narrative.totalTime || 'N/A'}
        `;

        const prompt = `
        Sei un esperto psicologo digitale specializzato in stress management e analisi comportamentale.
        Analizza i seguenti risultati di tre test interattivi per lo stress:

        ${cosmicData}
        ${memoryData}
        ${narrativeData}

        IMPORTANTE: Devi rispondere SOLO con un JSON valido senza testo aggiuntivo.
        Analizza i dati e fornisci un profilo completo dello stress dell'utente.

        Considera questi aspetti:
        - Tempi di reazione e decision-making
        - Pattern comportamentali e consistenza
        - Capacità di gestire stress cognitivo
        - Livelli di ansia e controllo
        - Resilienza e adattabilità

        RISPONDI ESCLUSIVAMENTE con questo formato JSON:
        {
          "stressLevel": numero da 1 a 10,
          "stressAreas": ["cognitivo", "emotivo", "comportamentale"],
          "strengths": ["lista dei punti di forza rilevati"],
          "recommendations": ["3-5 consigli pratici personalizzati per gestire lo stress"],
          "cosmicHoroscope": "Oroscopo motivazionale personalizzato (2-3 frasi)",
          "summary": "Riassunto profilo stress (1-2 frasi)"
        }

        I valori devono essere appropriati ai dati forniti.
        `;

        return prompt;
    }

    // Try Groq API if available, otherwise use fallback
    if (groq) {
      const prompt = constructAnalysisPrompt(cosmicResults, memoryResults, narrativeResults);
      
      try {
        console.log("Attempting Groq API call...");
        const completion = await groq.chat.completions.create({
          messages: [{ role: 'user', content: prompt }],
          model: "mixtral-8x7b-32768",
          temperature: 0.7,
          response_format: { type: "json_object" },
        });

        const aiResponseContent = completion.choices[0]?.message?.content;
        if (!aiResponseContent) {
          console.error('Groq API returned empty content. Using fallback.');
          const fallbackAnalysis = getFallbackAnalysis(cosmicResults, memoryResults, narrativeResults);
          return NextResponse.json(fallbackAnalysis, { status: 200, headers: { 'X-Analysis-Source': 'Fallback-Empty-Response' } });
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

      } catch (apiError: unknown) {
        const errorMessage = apiError instanceof Error ? apiError.message : 'Unknown API error';
        console.error('Groq API call failed. Using fallback.', errorMessage);
        const fallbackAnalysis = getFallbackAnalysis(cosmicResults, memoryResults, narrativeResults);
        return NextResponse.json(fallbackAnalysis, { status: 200, headers: { 'X-Analysis-Source': 'Fallback-API-Error' } });
      }
    } else {
      // No Groq API available, use fallback directly
      console.log('Groq API not available. Using fallback analysis.');
      const fallbackAnalysis = getFallbackAnalysis(cosmicResults, memoryResults, narrativeResults);
      return NextResponse.json(fallbackAnalysis, { status: 200, headers: { 'X-Analysis-Source': 'Fallback-No-API' } });
    }

  } catch (error) {
    console.error('Error in /api/analyze (outer try-catch):', error);
    if (error instanceof SyntaxError) {
        return NextResponse.json({ error: 'Invalid request body: Malformed JSON.' }, { status: 400 });
    }
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}
