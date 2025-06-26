'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useGameContext } from '@/context/GameContext';
import { Button } from '@/components/ui';
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
  choice: string;
  time: number;
}

// Modern cosmic elements with better styling
const COSMIC_ELEMENTS = [
  { id: 'star', name: 'Stella Brillante', icon: '✨', desc: 'Luminosa e guidatrice' },
  { id: 'planet', name: 'Pianeta Mistico', icon: '🪐', desc: 'Stabile e protettivo' },
  { id: 'comet', name: 'Cometa Veloce', icon: '☄️', desc: 'Dinamica e trasformativa' },
  { id: 'nebula', name: 'Nebulosa Infinita', icon: '🌌', desc: 'Misteriosa e creativa' },
];

const QUESTIONS_DATA: Question[] = [
  { id: 1, text: "Se fossi un pianeta, che atmosfera avresti?", options: ["Calma e Serena", "Elettrica e Tempestosa", "Calda e Gassosa", "Ghiacciata e Sottile"] },
  { id: 2, text: "Quale fenomeno celeste descrive la tua settimana?", options: ["Una Supernova (esplosiva, trasformativa)", "Un Buco Nero (assorbe tutto)", "Una pioggia di meteore (tanti piccoli eventi)", "Un'orbita stabile (prevedibile, calma)"] },
  { id: 3, text: "Come preferisci viaggiare nello spazio (nella vita)?", options: ["Velocità Warp, focalizzato sulla destinazione", "Crociera lenta, godendoti la vista", "Teletrasporto, cambiamenti istantanei", "Seguendo le forze gravitazionali"] },
  { id: 4, text: "Cosa cerchi nel vasto universo?", options: ["Conoscenza e Verità", "Pace e Tranquillità", "Connessione e Compagnia", "Avventura e Nuove Esperienze"] },
  { id: 5, text: "A quale energia cosmica sei più attratto?", options: ["La nascita di una stella (creazione)", "Il silenzio dello spazio profondo (introspezione)", "La danza delle galassie (armonia)", "L'ignoto oltre l'osservabile (mistero)"] },
];

type ConstellationPattern = 'organized' | 'scattered' | 'centered';

function calculateConstellationPattern(points: Point[], canvasWidth: number, canvasHeight: number): ConstellationPattern {
  if (points.length < 3) return 'scattered';

  let sumX = 0, sumY = 0;
  points.forEach(p => {
    sumX += p.x;
    sumY += p.y;
  });
  const centroidX = sumX / points.length;
  const centroidY = sumY / points.length;

  const distances = points.map(p => Math.sqrt((p.x - centroidX) ** 2 + (p.y - centroidY) ** 2));
  const avgDistance = distances.reduce((sum, d) => sum + d, 0) / distances.length;
  const variance = distances.reduce((sum, d) => sum + (d - avgDistance) ** 2, 0) / distances.length;

  const canvasDiagonal = Math.sqrt(canvasWidth ** 2 + canvasHeight ** 2);
  const normalizedAvgDist = avgDistance / (canvasDiagonal / 2);

  const centerDistance = Math.sqrt((centroidX - canvasWidth / 2) ** 2 + (centroidY - canvasHeight / 2) ** 2);
  const normalizedCenterDist = centerDistance / (canvasDiagonal / 2);

  if (normalizedCenterDist < 0.2 && normalizedAvgDist < 0.25) {
    return 'centered';
  }

  if (normalizedAvgDist < 0.3 && variance < (canvasDiagonal * 0.1) ** 2) {
    return 'organized';
  }

  return 'scattered';
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
        choicePattern: questionAnswers.map(a => a.choice),
        totalTime: totalTime,
        constellationPoints: constellationPoints,
      };

      setCosmicResults(results);
      const timer = setTimeout(() => {
        nextGame();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [currentPhase, selectedElement, constellationPoints, questionAnswers, gameStartTime, setCosmicResults, nextGame]);

  const handleAnswer = (optionText: string) => {
    const timeTaken = Date.now() - phaseStartTime;
    const answer: Answer = {
      questionId: QUESTIONS_DATA[currentQuestionIndex].id,
      choice: optionText,
      time: timeTaken,
    };

    const newAnswers = [...questionAnswers, answer];
    setQuestionAnswers(newAnswers);

    if (currentQuestionIndex < QUESTIONS_DATA.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setPhaseStartTime(Date.now());
    } else {
      setCurrentPhase('finished');
    }
  };

  const handleConstellationClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (constellationPoints.length < 7 && interactiveAreaRef.current) {
      const rect = interactiveAreaRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Assicurati che i click siano dentro l'area
      if (x >= 0 && y >= 0 && x <= rect.width && y <= rect.height) {
        setConstellationPoints([...constellationPoints, { x, y }]);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Modern Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
            Cosmic Calm
          </h2>
          <p className="text-lg text-slate-300">Scopri il tuo elemento cosmico interiore</p>
        </div>

        {/* Element Selection Phase */}
        {currentPhase === 'elementSelection' && (
          <div className="animate-in slide-in-from-bottom duration-700">
            <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 shadow-2xl border border-white/20">
              <h3 className="text-2xl font-semibold mb-8 text-center text-white">
                Scegli il tuo Elemento Cosmico
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                {COSMIC_ELEMENTS.map((element) => (
                  <button
                    key={element.id}
                    onClick={() => {
                      setSelectedElement(element.id);
                      setPhaseStartTime(Date.now());
                      setCurrentPhase('constellation');
                    }}
                    className="group relative p-6 rounded-2xl bg-gradient-to-br from-white/20 to-white/5 hover:from-white/30 hover:to-white/10 border border-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25"
                  >
                    <div className="text-center">
                      <span className="text-5xl mb-3 block group-hover:scale-110 transition-transform duration-300">
                        {element.icon}
                      </span>
                      <h4 className="text-xl font-semibold text-white mb-2">{element.name}</h4>
                      <p className="text-sm text-slate-300">{element.desc}</p>
                    </div>
                    {/* Glow effect */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl"></div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Constellation Creation Phase */}
        {currentPhase === 'constellation' && (
          <div className="animate-in slide-in-from-right duration-700">
            <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 shadow-2xl border border-white/20">
              <h3 className="text-2xl font-semibold mb-4 text-center text-white">
                Crea la tua Costellazione
              </h3>
              <p className="text-center text-slate-300 mb-6">
                Clicca da 5 a 7 volte sulla tela stellare per posizionare le tue stelle
              </p>
              
              <div className="flex justify-center items-center gap-4 mb-6">
                <div className="px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full border border-white/20">
                  <span className="text-white font-medium">Stelle: {constellationPoints.length}/7</span>
                </div>
                {constellationPoints.length >= 5 && (
                  <Button
                    onClick={() => {
                      setPhaseStartTime(Date.now());
                      setCurrentPhase('questions');
                    }}
                    variant="cosmic"
                    className="animate-pulse"
                  >
                    ✨ Completa Costellazione
                  </Button>
                )}
              </div>

              {/* FIXED: Interactive Constellation Area */}
              <div className="relative max-w-2xl mx-auto">
                <div
                  ref={interactiveAreaRef}
                  onClick={handleConstellationClick}
                  className="w-full h-80 md:h-96 bg-gradient-to-br from-slate-800/50 via-purple-900/30 to-slate-800/50 border-2 border-purple-500/30 rounded-2xl mx-auto cursor-crosshair relative overflow-hidden shadow-inner backdrop-blur-sm"
                  style={{ 
                    background: 'radial-gradient(ellipse at center, rgba(139, 69, 19, 0.1) 0%, rgba(0, 0, 0, 0.8) 70%)',
                    boxShadow: 'inset 0 0 50px rgba(139, 69, 19, 0.3), 0 0 30px rgba(138, 43, 226, 0.3)'
                  }}
                >
                  {/* Background stars */}
                  <div className="absolute inset-0 opacity-30">
                    {[...Array(20)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                          animationDelay: `${Math.random() * 3}s`,
                        }}
                      />
                    ))}
                  </div>

                  {/* User constellation points */}
                  {constellationPoints.map((point, index) => (
                    <div
                      key={`point-${index}`}
                      className="absolute w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-lg animate-pulse"
                      style={{ 
                        left: `${point.x}px`, 
                        top: `${point.y}px`,
                        boxShadow: '0 0 15px rgba(255, 215, 0, 0.8)',
                        animation: `pulse 2s infinite ${index * 0.2}s`
                      }}
                    />
                  ))}

                  {/* Constellation lines */}
                  {constellationPoints.length > 1 && (
                    <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
                      {constellationPoints.slice(1).map((point, index) => (
                        <line
                          key={`line-${index}`}
                          x1={constellationPoints[index].x}
                          y1={constellationPoints[index].y}
                          x2={point.x}
                          y2={point.y}
                          stroke="rgba(255, 215, 0, 0.6)"
                          strokeWidth="2"
                          className="animate-pulse"
                        />
                      ))}
                    </svg>
                  )}

                  {/* Click hint */}
                  {constellationPoints.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-white/70 pointer-events-none">
                        <div className="text-4xl mb-2 animate-bounce">✨</div>
                        <p className="text-sm">Clicca per iniziare la tua costellazione</p>
                      </div>
                    </div>
                  )}
                </div>

                {constellationPoints.length > 0 && constellationPoints.length < 5 && (
                  <p className="text-center text-yellow-400 mt-4 animate-pulse">
                    Posiziona almeno {5 - constellationPoints.length} stelle in più
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Questions Phase */}
        {currentPhase === 'questions' && QUESTIONS_DATA[currentQuestionIndex] && (
          <div className="animate-in slide-in-from-left duration-700">
            <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 shadow-2xl border border-white/20 max-w-3xl mx-auto">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full border border-white/20 mb-4">
                  <span className="text-white font-medium">
                    Domanda {currentQuestionIndex + 1} di {QUESTIONS_DATA.length}
                  </span>
                </div>
                <h3 className="text-2xl font-semibold text-white mb-6 leading-relaxed">
                  {QUESTIONS_DATA[currentQuestionIndex].text}
                </h3>
              </div>

              <div className="grid gap-4">
                {QUESTIONS_DATA[currentQuestionIndex].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    className="group p-4 rounded-xl bg-gradient-to-r from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 border border-white/20 transition-all duration-300 hover:scale-102 text-left"
                  >
                    <span className="text-white group-hover:text-blue-200 transition-colors duration-300">
                      {option}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Completion Phase */}
        {currentPhase === 'finished' && (
          <div className="animate-in zoom-in duration-700">
            <div className="backdrop-blur-xl bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-3xl p-8 shadow-2xl border border-white/20 text-center">
              <div className="text-6xl mb-4 animate-bounce">🌟</div>
              <h3 className="text-3xl font-bold text-white mb-4">
                Cosmic Calm Completato!
              </h3>
              <p className="text-lg text-slate-300">
                La tua energia cosmica è stata catturata...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CosmicCalm;
