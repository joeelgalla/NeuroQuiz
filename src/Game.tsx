import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Clock, Check, X as XIcon, Send, ArrowRight, BookOpen } from 'lucide-react';
import { questions, Question, Category, shuffle } from './data';
import { Direction, DisplayMode } from './App';

interface GameProps {
  category: Category | 'All';
  direction: Direction;
  displayMode: DisplayMode;
  studyMode?: boolean;
  customQuestions?: Question[];
  onGameOver: (score: number, total: number, missed: Question[]) => void;
  onQuit: () => void;
}

const GAME_DURATION = 60;

export function Game({ category, direction, displayMode, studyMode = false, customQuestions, onGameOver, onQuit }: GameProps) {
  const [gameQuestions, setGameQuestions] = useState<Question[]>([]);
  const [questionDirections, setQuestionDirections] = useState<('forward'|'reverse')[]>([]);
  const [questionDisplayModes, setQuestionDisplayModes] = useState<('text'|'image'|'combined')[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [score, setScore] = useState(0);
  const [missed, setMissed] = useState<Question[]>([]);

  // Feedback state
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // Multi-select state
  const [multiSelections, setMultiSelections] = useState<string[]>([]);
  const [multiSubmitted, setMultiSubmitted] = useState(false);

  // Study mode state
  const [showExplanation, setShowExplanation] = useState(false);

  // ── Refs for timer stale closure fix ──
  const scoreRef = useRef(0);
  const missedRef = useRef<Question[]>([]);
  const currentIndexRef = useRef(0);
  const onGameOverRef = useRef(onGameOver);

  useEffect(() => { scoreRef.current = score; }, [score]);
  useEffect(() => { missedRef.current = missed; }, [missed]);
  useEffect(() => { currentIndexRef.current = currentIndex; }, [currentIndex]);
  useEffect(() => { onGameOverRef.current = onGameOver; }, [onGameOver]);

  // ── Initialize game ──
  useEffect(() => {
    let filtered: Question[];

    if (customQuestions) {
      filtered = [...customQuestions];
    } else {
      filtered = category === 'All' ? [...questions] : questions.filter(q => q.category === category);

      // Filter by study direction for questions that have it
      if (direction === 'forward') {
        filtered = filtered.filter(q => !q.studyDirection || q.studyDirection === 'forward');
      } else if (direction === 'reverse') {
        filtered = filtered.filter(q => !q.studyDirection || q.studyDirection === 'reverse');
      }

      // Deduplicate reverseGroup: keep only one random question per group
      const groups = new Map<string, Question[]>();
      const nonGrouped: Question[] = [];
      for (const q of filtered) {
        if (q.reverseGroup) {
          const arr = groups.get(q.reverseGroup) || [];
          arr.push(q);
          groups.set(q.reverseGroup, arr);
        } else {
          nonGrouped.push(q);
        }
      }
      const deduped = [...nonGrouped];
      for (const [, groupQuestions] of groups) {
        deduped.push(groupQuestions[Math.floor(Math.random() * groupQuestions.length)]);
      }
      filtered = deduped;
    }

    const shuffled = shuffle(filtered);

    // Pre-generate directions per question (fixes Math.random in useMemo bug)
    const dirs: ('forward'|'reverse')[] = shuffled.map(q => {
      if (q.directionLock) return q.directionLock;
      if (direction === 'alternating') return Math.random() > 0.5 ? 'forward' : 'reverse';
      return direction as 'forward' | 'reverse';
    });

    // Pre-generate display modes per question
    const modes: ('text'|'image'|'combined')[] = shuffled.map(q => {
      let mode: string = displayMode;
      if (displayMode === 'alternating') {
        mode = Math.random() > 0.5 ? 'text' : 'image';
      }
      if ((mode === 'image' || mode === 'combined') && (!q.image || q.image === 'placeholder')) {
        return 'text' as const;
      }
      return mode as 'text' | 'image' | 'combined';
    });

    setGameQuestions(shuffled);
    setQuestionDirections(dirs);
    setQuestionDisplayModes(modes);
  }, [category, direction, displayMode, customQuestions]);

  // ── Derived values (stable per question) ──
  const currentQ = gameQuestions[currentIndex];
  const currentDirection = questionDirections[currentIndex] || 'forward';
  const currentDisplayMode = questionDisplayModes[currentIndex] || 'text';
  const isMultiSelect = currentQ?.multiSelect === true;

  const expectedAnswer = currentQ
    ? (currentDirection === 'reverse' ? currentQ.prompt : currentQ.answer)
    : '';

  const displayPrompt = currentQ
    ? (currentDirection === 'reverse' ? currentQ.answer : currentQ.prompt)
    : '';

  const displayImage = (() => {
    if (!currentQ) return null;
    if (currentDirection === 'forward' && (currentDisplayMode === 'image' || currentDisplayMode === 'combined')) {
      if (currentQ.image === 'placeholder') {
        return `https://placehold.co/600x400/f1f5f9/64748b?text=Missing+Image%5Cn${encodeURIComponent(currentQ.prompt)}`;
      }
      return currentQ.image || null;
    }
    return null;
  })();

  const showImageOptions = (() => {
    if (currentDisplayMode !== 'image' && currentDisplayMode !== 'combined') return false;
    if (currentDirection === 'reverse' && !currentQ?.directionLock) return true;
    if (isMultiSelect) return true;
    return false;
  })();

  // ── Reset on question change ──
  useEffect(() => {
    setMultiSelections([]);
    setMultiSubmitted(false);
    setShowExplanation(false);
  }, [currentIndex]);

  // ── Timer (timed mode only, uses refs to avoid stale closures) ──
  useEffect(() => {
    if (studyMode) return;
    if (timeLeft <= 0) {
      onGameOverRef.current(scoreRef.current, currentIndexRef.current, missedRef.current);
      return;
    }
    if (selectedAnswer !== null || multiSubmitted) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, selectedAnswer, multiSubmitted, studyMode]);

  // ── Manual advance (study mode + end-of-game) ──
  const handleNext = useCallback(() => {
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowExplanation(false);
    setMultiSelections([]);
    setMultiSubmitted(false);

    if (currentIndex + 1 >= gameQuestions.length) {
      onGameOver(score, currentIndex + 1, missed);
    } else {
      setCurrentIndex(i => i + 1);
    }
  }, [currentIndex, gameQuestions.length, onGameOver, score, missed]);

  // ── Single-select answer handler ──
  const handleAnswer = useCallback((answer: string) => {
    if (selectedAnswer !== null || multiSubmitted) return;

    if (isMultiSelect) {
      setMultiSelections(prev =>
        prev.includes(answer) ? prev.filter(a => a !== answer) : [...prev, answer]
      );
      return;
    }

    const correct = answer === expectedAnswer;
    setSelectedAnswer(answer);
    setIsCorrect(correct);

    if (correct) {
      setScore(s => s + 1);
    } else {
      setMissed(m => [...m, gameQuestions[currentIndex]]);
    }

    if (studyMode) {
      setShowExplanation(true);
      return; // Don't auto-advance — wait for "Next" click
    }

    // Timed mode: auto-advance after feedback
    setTimeout(() => {
      setSelectedAnswer(null);
      setIsCorrect(null);
      if (currentIndex + 1 >= gameQuestions.length) {
        onGameOver(score + (correct ? 1 : 0), currentIndex + 1, correct ? missed : [...missed, gameQuestions[currentIndex]]);
      } else {
        setCurrentIndex(i => i + 1);
      }
    }, 800);
  }, [currentIndex, gameQuestions, selectedAnswer, multiSubmitted, isMultiSelect, score, missed, onGameOver, expectedAnswer, studyMode]);

  // ── Multi-select confirm handler ──
  const handleMultiConfirm = useCallback(() => {
    if (!currentQ?.answers || multiSubmitted) return;

    const correctSet = new Set(currentQ.answers);
    const selectedSet = new Set(multiSelections);
    const isAllCorrect = correctSet.size === selectedSet.size &&
      [...correctSet].every(a => selectedSet.has(a));

    setMultiSubmitted(true);
    setIsCorrect(isAllCorrect);

    if (isAllCorrect) {
      setScore(s => s + 1);
    } else {
      setMissed(m => [...m, currentQ]);
    }

    if (studyMode) {
      setShowExplanation(true);
      return; // Don't auto-advance
    }

    setTimeout(() => {
      setMultiSubmitted(false);
      setIsCorrect(null);
      setMultiSelections([]);
      if (currentIndex + 1 >= gameQuestions.length) {
        onGameOver(score + (isAllCorrect ? 1 : 0), currentIndex + 1, isAllCorrect ? missed : [...missed, currentQ]);
      } else {
        setCurrentIndex(i => i + 1);
      }
    }, 1200);
  }, [currentQ, multiSelections, multiSubmitted, currentIndex, gameQuestions, score, missed, onGameOver, studyMode]);

  // When showing images as options (not multi-select): use fewer, larger tiles
  const useImageGrid = showImageOptions && !isMultiSelect;

  // ── Build options (memoized to prevent reshuffling) ──
  const currentOptions = useMemo(() => {
    if (!currentQ) return [];
    const targetCount = useImageGrid ? 4 : 6;

    if (isMultiSelect && currentQ.answers) {
      const correctAnswers = currentQ.answers;
      const distractors = currentQ.options.filter(o => !correctAnswers.includes(o));
      const numDistractors = Math.max(0, targetCount - correctAnswers.length);
      const selectedDistractors = shuffle(distractors).slice(0, numDistractors);
      return shuffle([...correctAnswers, ...selectedDistractors]);
    }

    let pool: string[] = [];
    if (currentDirection === 'reverse') {
      pool = questions.filter(q => q.category === currentQ.category).map(q => q.prompt);
    } else {
      pool = [...currentQ.options];
    }

    const others = pool.filter(o => o !== expectedAnswer);
    const distinctOthers = Array.from(new Set(others));
    const selectedOthers = shuffle(distinctOthers).slice(0, targetCount - 1);
    return shuffle([expectedAnswer, ...selectedOthers]);
  }, [currentQ, currentDirection, expectedAnswer, isMultiSelect, useImageGrid]);

  if (gameQuestions.length === 0) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  const correctAnswerSet = currentQ?.answers ? new Set(currentQ.answers) : new Set<string>();

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

          {studyMode ? (
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 font-bold">
              <BookOpen size={18} />
              <span>{currentIndex + 1} / {gameQuestions.length}</span>
            </div>
          ) : (
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold ${timeLeft <= 10 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-slate-100 text-slate-700'}`}>
              <Clock size={18} />
              <span>{timeLeft}s</span>
            </div>
          )}
        </div>
      </header>

      {/* Main Game Area */}
      <main className="flex-1 max-w-lg w-full mx-auto p-4 flex flex-col">

        {/* Progress Bar */}
        <div className="w-full h-2 bg-slate-200 rounded-full mb-6 overflow-hidden">
          <div
            className="h-full bg-indigo-500 transition-all duration-300 ease-out"
            style={{ width: `${(currentIndex / gameQuestions.length) * 100}%` }}
          />
        </div>

        {/* Multi-select instruction */}
        {isMultiSelect && !multiSubmitted && !showExplanation && (
          <div className="text-center mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">
              Select all correct actions • {multiSelections.length} selected
            </span>
          </div>
        )}

        {/* Prompt */}
        <div className="flex-1 flex flex-col items-center justify-center mb-6 min-h-[140px]">
          <span className="text-sm font-bold text-indigo-500 uppercase tracking-widest mb-3">{currentQ.category}</span>
          {displayImage ? (
            <div className="flex flex-col items-center gap-4">
              <img src={displayImage} alt="Anatomy Challenge" className="max-h-48 object-contain rounded-xl shadow-sm" />
              {currentDisplayMode === 'combined' && (
                <h2 className="text-xl sm:text-2xl font-bold text-center text-slate-600 leading-tight">
                  {displayPrompt}
                </h2>
              )}
            </div>
          ) : (
            <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-slate-800 leading-tight">
              {displayPrompt}
            </h2>
          )}
        </div>

        {/* Options Grid */}
        <div className={`grid gap-3 sm:gap-4 pb-4 ${useImageGrid ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-3'}`}>
          <AnimatePresence mode="popLayout">
            {currentOptions.map((option) => {
              const isSelected = selectedAnswer === option;
              const isMultiSelected = multiSelections.includes(option);
              const isActuallyCorrect = isMultiSelect
                ? correctAnswerSet.has(option)
                : option === expectedAnswer;

              let buttonClass = `relative flex flex-col items-center justify-center ${useImageGrid ? 'aspect-[3/4]' : 'aspect-square'} rounded-2xl border-2 text-lg sm:text-xl font-bold transition-all duration-200 `;

              if (isMultiSelect) {
                if (multiSubmitted) {
                  if (isActuallyCorrect && isMultiSelected) {
                    buttonClass += "bg-emerald-500 border-emerald-600 text-white shadow-lg shadow-emerald-200 z-10 scale-105";
                  } else if (isActuallyCorrect && !isMultiSelected) {
                    buttonClass += "bg-amber-400 border-amber-500 text-white shadow-lg shadow-amber-200 z-10 animate-pulse";
                  } else if (!isActuallyCorrect && isMultiSelected) {
                    buttonClass += "bg-red-500 border-red-600 text-white shadow-lg shadow-red-200 z-10 scale-95";
                  } else {
                    buttonClass += "bg-slate-50 border-slate-200 text-slate-400 opacity-50 scale-95";
                  }
                } else if (isMultiSelected) {
                  buttonClass += "bg-indigo-500 border-indigo-600 text-white shadow-md shadow-indigo-200 scale-105";
                } else {
                  buttonClass += "bg-white border-slate-200 text-slate-700 hover:border-indigo-400 hover:shadow-md active:scale-95";
                }
              } else {
                if (selectedAnswer === null) {
                  buttonClass += "bg-white border-slate-200 text-slate-700 hover:border-indigo-400 hover:shadow-md active:scale-95";
                } else {
                  if (isActuallyCorrect) {
                    buttonClass += "bg-emerald-500 border-emerald-600 text-white shadow-lg shadow-emerald-200 z-10 scale-105";
                  } else if (isSelected && !isActuallyCorrect) {
                    buttonClass += "bg-red-500 border-red-600 text-white shadow-lg shadow-red-200 z-10 scale-95";
                  } else {
                    buttonClass += "bg-slate-50 border-slate-200 text-slate-400 opacity-50 scale-95";
                  }
                }
              }

              return (
                <motion.button
                  key={option}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileTap={(selectedAnswer === null && !multiSubmitted) ? { scale: 0.95 } : {}}
                  onClick={() => handleAnswer(option)}
                  disabled={selectedAnswer !== null || multiSubmitted}
                  className={buttonClass}
                >
                  {showImageOptions ? (
                    <div className="absolute inset-0 overflow-hidden rounded-2xl">
                      <img
                        src={(() => {
                          const qImage = questions.find(q => q.prompt === option)?.image;
                          if (!qImage || qImage === 'placeholder') return `https://placehold.co/400x400/e2e8f0/475569?text=${encodeURIComponent(option)}`;
                          return qImage;
                        })()}
                        alt="Anatomical option"
                        className={`w-full h-full object-cover transition-opacity ${
                          (selectedAnswer !== null || multiSubmitted) && !isActuallyCorrect && !isSelected && !isMultiSelected ? 'opacity-50' : ''
                        }`}
                      />
                      {isMultiSelect && (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none flex items-end justify-center pb-2">
                           <span className="text-white text-xs font-bold text-center px-1 drop-shadow-md">{option}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-center p-3 text-base sm:text-lg">{option}</span>
                  )}

                  {/* Feedback Icons — single-select */}
                  {selectedAnswer !== null && isActuallyCorrect && !isMultiSelect && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                      className="absolute -top-3 -right-3 w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white border-2 border-white shadow-sm z-20">
                      <Check size={16} strokeWidth={3} />
                    </motion.div>
                  )}
                  {selectedAnswer !== null && isSelected && !isActuallyCorrect && !isMultiSelect && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                      className="absolute -top-3 -right-3 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white border-2 border-white shadow-sm z-20">
                      <XIcon size={16} strokeWidth={3} />
                    </motion.div>
                  )}

                  {/* Feedback Icons — multi-select */}
                  {multiSubmitted && isActuallyCorrect && isMultiSelected && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                      className="absolute -top-3 -right-3 w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white border-2 border-white shadow-sm z-20">
                      <Check size={16} strokeWidth={3} />
                    </motion.div>
                  )}
                  {multiSubmitted && isActuallyCorrect && !isMultiSelected && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                      className="absolute -top-3 -right-3 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white border-2 border-white shadow-sm z-20">
                      <XIcon size={16} strokeWidth={3} />
                    </motion.div>
                  )}
                  {multiSubmitted && !isActuallyCorrect && isMultiSelected && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                      className="absolute -top-3 -right-3 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white border-2 border-white shadow-sm z-20">
                      <XIcon size={16} strokeWidth={3} />
                    </motion.div>
                  )}

                  {/* Multi-select toggle indicator */}
                  {isMultiSelect && !multiSubmitted && isMultiSelected && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                      className="absolute -top-3 -right-3 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white border-2 border-white shadow-sm z-20">
                      <Check size={16} strokeWidth={3} />
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Multi-select Confirm Button (hidden in study mode after submission) */}
        {isMultiSelect && !multiSubmitted && !showExplanation && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={handleMultiConfirm}
            disabled={multiSelections.length === 0}
            className="mt-2 mb-4 w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-300 text-white font-bold text-lg rounded-2xl flex items-center justify-center gap-2 transition-colors disabled:cursor-not-allowed shadow-lg shadow-indigo-200 disabled:shadow-none"
          >
            <Send size={20} />
            Confirm Selection
          </motion.button>
        )}

        {/* ── Study Mode: Explanation Card ── */}
        {studyMode && showExplanation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 bg-white rounded-2xl border-2 border-slate-200 p-5 shadow-lg mb-6"
          >
            <div className="flex items-center gap-2 mb-3">
              {isCorrect ? (
                <div className="flex items-center gap-2 text-emerald-600">
                  <Check size={20} strokeWidth={3} />
                  <span className="font-bold text-lg">Correct!</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-500">
                  <XIcon size={20} strokeWidth={3} />
                  <span className="font-bold text-lg">Incorrect</span>
                </div>
              )}
            </div>

            {!isCorrect && (
              <div className="mb-3 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Correct Answer</span>
                <p className="font-bold text-emerald-800 text-lg mt-0.5">
                  {isMultiSelect ? currentQ?.answers?.join(', ') : expectedAnswer}
                </p>
              </div>
            )}

            {currentQ?.explanation && (
              <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 rounded-xl p-3 border border-slate-100">
                {currentQ.explanation}
              </p>
            )}

            <button
              onClick={handleNext}
              className="mt-4 w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-md"
            >
              Next Question <ArrowRight size={18} />
            </button>
          </motion.div>
        )}
      </main>
    </div>
  );
}
