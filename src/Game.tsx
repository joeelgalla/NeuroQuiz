import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Clock, Check, X as XIcon } from 'lucide-react';
import { questions, Question, Category, shuffle } from './data';
import { Direction, OptionType } from './App';

interface GameProps {
  category: Category | 'All';
  direction: Direction;
  optionType: OptionType;
  onGameOver: (score: number, total: number, missed: Question[]) => void;
  onQuit: () => void;
}

const GAME_DURATION = 60; // 60 seconds

export function Game({ category, direction, optionType, onGameOver, onQuit }: GameProps) {
  const [gameQuestions, setGameQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [score, setScore] = useState(0);
  const [missed, setMissed] = useState<Question[]>([]);
  
  // Feedback state
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // Initialize game
  useEffect(() => {
    let filtered = category === 'All' ? questions : questions.filter(q => q.category === category);
    // Shuffle questions
    filtered = shuffle(filtered);
    setGameQuestions(filtered);
  }, [category]);

  const currentQ = gameQuestions[currentIndex];

  const expectedAnswer = useMemo(() => {
    if (!currentQ) return '';
    return direction === 'reverse' ? currentQ.prompt : currentQ.answer;
  }, [currentQ, direction]);

  const displayPrompt = useMemo(() => {
    if (!currentQ) return '';
    return direction === 'reverse' ? currentQ.answer : currentQ.prompt;
  }, [currentQ, direction]);

  const displayImage = useMemo(() => {
    if (!currentQ) return null;
    // In forward mode with image options, the prompt is the image (Structure)
    if (direction === 'forward' && optionType === 'image') {
      return currentQ.image || null;
    }
    return null;
  }, [currentQ, direction, optionType]);

  // Timer
  useEffect(() => {
    if (timeLeft <= 0) {
      onGameOver(score, currentIndex, missed);
      return;
    }
    
    if (selectedAnswer !== null) return; // Pause timer during feedback

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, selectedAnswer, score, currentIndex, missed, onGameOver]);

  const handleAnswer = useCallback((answer: string) => {
    if (selectedAnswer !== null) return; // Prevent multiple clicks

    const correct = answer === expectedAnswer;
    
    setSelectedAnswer(answer);
    setIsCorrect(correct);

    if (correct) {
      setScore(s => s + 1);
    } else {
      setMissed(m => [...m, gameQuestions[currentIndex]]);
    }

    // Wait for feedback, then next question
    setTimeout(() => {
      setSelectedAnswer(null);
      setIsCorrect(null);
      
      if (currentIndex + 1 >= gameQuestions.length) {
        onGameOver(score + (correct ? 1 : 0), currentIndex + 1, correct ? missed : [...missed, gameQuestions[currentIndex]]);
      } else {
        setCurrentIndex(i => i + 1);
      }
    }, 800); // 800ms feedback duration
  }, [currentIndex, gameQuestions, selectedAnswer, score, missed, onGameOver, expectedAnswer]);

  // Ensure we have exactly 6 options if possible, or fallback to what's available
  const currentOptions = useMemo(() => {
    if (!currentQ) return [];
    
    let pool: string[] = [];
    if (direction === 'reverse') {
      // In reverse mode, the options are the prompts from the same category
      pool = questions.filter(q => q.category === currentQ.category).map(q => q.prompt);
    } else {
      // In forward mode, use the provided options
      pool = [...currentQ.options];
    }

    // Ensure the expected answer is in the pool
    const others = pool.filter(o => o !== expectedAnswer);
    const distinctOthers = Array.from(new Set(others));
    const selectedOthers = shuffle(distinctOthers).slice(0, 5);
    return shuffle([expectedAnswer, ...selectedOthers]);
  }, [currentQ, direction, expectedAnswer]);

  if (gameQuestions.length === 0) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-10">
        <button onClick={onQuit} className="p-2 -ml-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100">
          <X size={24} />
        </button>
        
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Score</span>
            <span className="text-xl font-black text-indigo-600">{score}</span>
          </div>
          
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold ${timeLeft <= 10 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-slate-100 text-slate-700'}`}>
            <Clock size={18} />
            <span>{timeLeft}s</span>
          </div>
        </div>
      </header>

      {/* Main Game Area */}
      <main className="flex-1 max-w-lg w-full mx-auto p-4 flex flex-col">
        
        {/* Progress Bar */}
        <div className="w-full h-2 bg-slate-200 rounded-full mb-8 overflow-hidden">
          <div 
            className="h-full bg-indigo-500 transition-all duration-300 ease-out"
            style={{ width: `${(currentIndex / gameQuestions.length) * 100}%` }}
          />
        </div>

        {/* Prompt */}
        <div className="flex-1 flex flex-col items-center justify-center mb-8 min-h-[160px]">
          <span className="text-sm font-bold text-indigo-500 uppercase tracking-widest mb-3">{currentQ.category}</span>
          {displayImage ? (
            <div className="flex flex-col items-center gap-4">
              <img src={displayImage} alt={displayPrompt} className="max-h-48 object-contain rounded-xl shadow-sm" />
              <h2 className="text-xl sm:text-2xl font-bold text-center text-slate-600 leading-tight">
                {displayPrompt}
              </h2>
            </div>
          ) : (
            <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-slate-800 leading-tight">
              {displayPrompt}
            </h2>
          )}
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 pb-8">
          <AnimatePresence mode="popLayout">
            {currentOptions.map((option) => {
              const isSelected = selectedAnswer === option;
              const isActuallyCorrect = option === expectedAnswer;
              
              let buttonClass = "relative flex flex-col items-center justify-center aspect-square rounded-2xl border-2 text-lg sm:text-xl font-bold transition-all duration-200 overflow-hidden ";
              
              if (selectedAnswer === null) {
                // Default state
                buttonClass += "bg-white border-slate-200 text-slate-700 hover:border-indigo-400 hover:shadow-md active:scale-95";
              } else {
                // Feedback state
                if (isActuallyCorrect) {
                  buttonClass += "bg-emerald-500 border-emerald-600 text-white shadow-lg shadow-emerald-200 z-10 scale-105";
                } else if (isSelected && !isActuallyCorrect) {
                  buttonClass += "bg-red-500 border-red-600 text-white shadow-lg shadow-red-200 z-10 scale-95";
                } else {
                  buttonClass += "bg-slate-50 border-slate-200 text-slate-400 opacity-50 scale-95";
                }
              }

              return (
                <motion.button
                  key={option}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileTap={selectedAnswer === null ? { scale: 0.95 } : {}}
                  onClick={() => handleAnswer(option)}
                  disabled={selectedAnswer !== null}
                  className={buttonClass}
                >
                  {optionType === 'image' && direction === 'reverse' ? (
                    <>
                      <img 
                        src={questions.find(q => q.prompt === option)?.image || `https://placehold.co/400x400/e2e8f0/475569?text=${encodeURIComponent(option)}`} 
                        alt={option}
                        className={`w-full h-full object-cover transition-opacity ${selectedAnswer !== null && !isActuallyCorrect && !isSelected ? 'opacity-50' : ''}`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none flex items-end justify-center pb-2">
                         <span className="text-white text-xs font-bold text-center px-1">{option}</span>
                      </div>
                    </>
                  ) : (
                    <span className="text-center p-4">{option}</span>
                  )}
                  
                  {/* Feedback Icons */}
                  {selectedAnswer !== null && isActuallyCorrect && (
                    <motion.div 
                      initial={{ scale: 0 }} 
                      animate={{ scale: 1 }} 
                      className="absolute -top-3 -right-3 w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white border-2 border-white shadow-sm z-20"
                    >
                      <Check size={16} strokeWidth={3} />
                    </motion.div>
                  )}
                  {selectedAnswer !== null && isSelected && !isActuallyCorrect && (
                    <motion.div 
                      initial={{ scale: 0 }} 
                      animate={{ scale: 1 }} 
                      className="absolute -top-3 -right-3 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white border-2 border-white shadow-sm z-20"
                    >
                      <XIcon size={16} strokeWidth={3} />
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
