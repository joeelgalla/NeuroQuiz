import { useState, useMemo } from 'react';
import { Brain, Play, RotateCcw, Trophy, Activity, Zap, Settings2, Image as ImageIcon, Type, ArrowRightLeft, ArrowRight, Wrench, BookOpen } from 'lucide-react';
import { questions, Question, Category, shuffle } from './data';
import { Game } from './Game';
import { Review } from './Review';
import { AdminPanel } from './AdminPanel';

type GameState = 'menu' | 'config' | 'playing' | 'review' | 'admin';
export type Direction = 'forward' | 'reverse' | 'alternating';
export type DisplayMode = 'text' | 'image' | 'alternating' | 'combined';

export default function App() {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [showNerveMenu, setShowNerveMenu] = useState(false);
  
  // Game Config
  const [direction, setDirection] = useState<Direction>('forward');
  const [displayMode, setDisplayMode] = useState<DisplayMode>('text');
  const [studyMode, setStudyMode] = useState(false);

  const [missedQuestions, setMissedQuestions] = useState<Question[]>([]);
  const [score, setScore] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [customQuestions, setCustomQuestions] = useState<Question[] | undefined>(undefined);
  const [forcedStudyMode, setForcedStudyMode] = useState(false);
  
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('neuroquiz_highscore');
    return saved ? parseInt(saved, 10) : 0;
  });

  // Context-aware direction labels
  const directionLabels = useMemo(() => {
    switch (selectedCategory) {
      case 'Nerve Root':
        return {
          forward: { title: 'Nerve → Actions', desc: 'Name the motor actions for each nerve' },
          reverse: { title: 'Action → Nerve', desc: 'Identify which nerve performs the action' },
          alternating: { title: 'Alternating', desc: 'Randomly mix both directions' },
        };
      case 'Brain Region':
        return {
          forward: { title: 'Function → Region', desc: 'Name the brain region for each function' },
          reverse: { title: 'Region → Function', desc: 'Identify the function of each brain region' },
          alternating: { title: 'Alternating', desc: 'Randomly mix both directions' },
        };
      default:
        return {
          forward: { title: 'Standard', desc: 'Movement → Nerve Root' },
          reverse: { title: 'Reverse', desc: 'Nerve Root → Movement' },
          alternating: { title: 'Alternating', desc: 'Randomly mix standard and reverse questions' },
        };
    }
  }, [selectedCategory]);

  const handleCategorySelect = (category: Category | 'All') => {
    setSelectedCategory(category);
    setCustomQuestions(undefined);
    setForcedStudyMode(false);
    setGameState('config');
  };

  const startGame = () => {
    setScore(0);
    setTotalAnswered(0);
    setMissedQuestions([]);
    setGameState('playing');
  };

  const handleGameOver = (finalScore: number, finalTotal: number, missed: Question[]) => {
    setScore(finalScore);
    setTotalAnswered(finalTotal);
    setMissedQuestions(missed);
    if (finalScore > highScore && !customQuestions) {
      setHighScore(finalScore);
      localStorage.setItem('neuroquiz_highscore', finalScore.toString());
    }
    setCustomQuestions(undefined);
    setForcedStudyMode(false);
    setGameState('review');
  };

  const handlePracticeMissed = (missed: Question[]) => {
    setCustomQuestions(missed);
    setForcedStudyMode(true);
    setScore(0);
    setTotalAnswered(0);
    setMissedQuestions([]);
    setGameState('playing');
  };

  if (gameState === 'admin') {
    return <AdminPanel onBack={() => setGameState('menu')} />;
  }

  if (gameState === 'playing') {
    return (
      <Game 
        category={selectedCategory} 
        direction={direction}
        displayMode={displayMode}
        studyMode={forcedStudyMode || studyMode}
        customQuestions={customQuestions}
        onGameOver={handleGameOver} 
        onQuit={() => { setCustomQuestions(undefined); setForcedStudyMode(false); setGameState('menu'); }}
      />
    );
  }

  if (gameState === 'review') {
    return (
      <Review 
        score={score} 
        total={totalAnswered} 
        missedQuestions={missedQuestions} 
        onPlayAgain={startGame}
        onMenu={() => setGameState('menu')}
        onPracticeMissed={missedQuestions.length > 0 ? handlePracticeMissed : undefined}
      />
    );
  }

  if (gameState === 'config') {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
        <div className="flex-1 max-w-md w-full mx-auto p-6 flex flex-col justify-center">
          <button 
            onClick={() => setGameState('menu')}
            className="self-start mb-8 text-slate-400 hover:text-slate-600 font-bold flex items-center gap-2"
          >
            ← Back to Categories
          </button>

          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Configure Game</h2>
            <p className="text-slate-500 font-medium">Category: <span className="text-indigo-600 font-bold">{selectedCategory === 'Nerve Root' ? 'Peripheral Nerves (Motor)' : selectedCategory}</span></p>
          </div>

          <div className="space-y-8">
            {/* Study Mode Toggle */}
            <div className="space-y-3">
              <label className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <BookOpen size={16} /> Mode
              </label>
              <button
                onClick={() => setStudyMode(!studyMode)}
                className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${
                  studyMode ? 'border-emerald-500 bg-emerald-50 shadow-md' : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-lg text-slate-800 mb-1">
                      {studyMode ? 'Study Mode' : 'Timed Quiz'}
                    </div>
                    <div className="text-sm text-slate-500">
                      {studyMode ? 'No timer • See explanations • Learn at your pace' : '60 second sprint • Race against the clock'}
                    </div>
                  </div>
                  <div className={`w-12 h-7 rounded-full transition-colors flex items-center ${
                    studyMode ? 'bg-emerald-500 justify-end' : 'bg-slate-300 justify-start'
                  }`}>
                    <div className="w-5 h-5 bg-white rounded-full shadow-sm mx-1" />
                  </div>
                </div>
              </button>
            </div>

            {/* Direction Toggle */}
            <div className="space-y-3">
              <label className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <ArrowRightLeft size={16} /> Question Direction
              </label>
              <div className="grid grid-cols-1 gap-3">
                <button 
                  onClick={() => setDirection('forward')}
                  className={`p-4 rounded-2xl border-2 text-left transition-all ${direction === 'forward' ? 'border-indigo-500 bg-indigo-50 shadow-md' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                >
                  <div className="font-bold text-lg text-slate-800 mb-1">{directionLabels.forward.title}</div>
                  <div className="text-sm text-slate-500">{directionLabels.forward.desc}</div>
                </button>
                <button 
                  onClick={() => setDirection('reverse')}
                  className={`p-4 rounded-2xl border-2 text-left transition-all ${direction === 'reverse' ? 'border-indigo-500 bg-indigo-50 shadow-md' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                >
                  <div className="font-bold text-lg text-slate-800 mb-1">{directionLabels.reverse.title}</div>
                  <div className="text-sm text-slate-500">{directionLabels.reverse.desc}</div>
                </button>
                <button 
                  onClick={() => setDirection('alternating')}
                  className={`p-4 rounded-2xl border-2 text-left transition-all ${direction === 'alternating' ? 'border-indigo-500 bg-indigo-50 shadow-md' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                >
                  <div className="font-bold text-lg text-slate-800 mb-1">{directionLabels.alternating.title}</div>
                  <div className="text-sm text-slate-500">{directionLabels.alternating.desc}</div>
                </button>
              </div>
            </div>

            {/* Display Mode Toggle */}
            <div className="space-y-3">
              <label className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Settings2 size={16} /> Display Mode
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setDisplayMode('text')}
                  className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${displayMode === 'text' ? 'border-indigo-500 bg-indigo-50 shadow-md text-indigo-700' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}
                >
                  <Type size={24} />
                  <span className="font-bold text-center">Text<br/><span className="text-xs font-normal text-slate-500">Only</span></span>
                </button>
                <button 
                  onClick={() => setDisplayMode('image')}
                  className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${displayMode === 'image' ? 'border-indigo-500 bg-indigo-50 shadow-md text-indigo-700' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}
                >
                  <ImageIcon size={24} />
                  <span className="font-bold text-center">Image<br/><span className="text-xs font-normal text-slate-500">Only</span></span>
                </button>
                <button 
                  onClick={() => setDisplayMode('alternating')}
                  className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${displayMode === 'alternating' ? 'border-indigo-500 bg-indigo-50 shadow-md text-indigo-700' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}
                >
                  <ArrowRightLeft size={24} />
                  <span className="font-bold text-center">Alternating<br/><span className="text-xs font-normal text-slate-500">Mix Both Modes</span></span>
                </button>
                <button 
                  onClick={() => setDisplayMode('combined')}
                  className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${displayMode === 'combined' ? 'border-indigo-500 bg-indigo-50 shadow-md text-indigo-700' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}
                >
                  <div className="flex gap-1 items-center"><Type size={18} /><ImageIcon size={18} /></div>
                  <span className="font-bold text-center">Combined<br/><span className="text-xs font-normal text-slate-500">Study Mode</span></span>
                </button>
              </div>
            </div>
          </div>

          <button 
            onClick={startGame}
            className="mt-12 w-full bg-indigo-600 text-white p-5 rounded-2xl font-bold text-lg hover:bg-indigo-700 active:scale-95 transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-2"
          >
            <Play size={24} fill="currentColor" />
            {studyMode ? 'Start Studying' : 'Start Game'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <div className="flex-1 max-w-md w-full mx-auto p-6 flex flex-col justify-center">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-indigo-600 text-white shadow-xl shadow-indigo-200 mb-6 transform -rotate-6">
            <Brain size={40} />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-3">NeuroQuiz</h1>
          <p className="text-slate-500 font-medium">Master neuroanatomy basics fast.</p>
          {highScore > 0 && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-full font-bold">
              <Trophy size={18} />
              High Score: {highScore}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 text-center">Select a Category</h2>
          
          <button 
            onClick={() => handleCategorySelect('All')}
            className="w-full flex items-center justify-between p-5 rounded-2xl bg-white border-2 border-slate-100 hover:border-indigo-500 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Brain size={20} />
              </div>
              <span className="font-bold text-lg">All Topics</span>
            </div>
            <Play size={20} className="text-slate-300 group-hover:text-indigo-500" />
          </button>

          <button 
            onClick={() => handleCategorySelect('Myotome')}
            className="w-full flex items-center justify-between p-5 rounded-2xl bg-white border-2 border-slate-100 hover:border-emerald-500 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Activity size={20} />
              </div>
              <span className="font-bold text-lg">Myotomes</span>
            </div>
            <Play size={20} className="text-slate-300 group-hover:text-emerald-500" />
          </button>

          <button 
            onClick={() => handleCategorySelect('Dermatome')}
            className="w-full flex items-center justify-between p-5 rounded-2xl bg-white border-2 border-slate-100 hover:border-sky-500 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Zap size={20} />
              </div>
              <span className="font-bold text-lg">Dermatomes</span>
            </div>
            <Play size={20} className="text-slate-300 group-hover:text-sky-500" />
          </button>
          
          <button 
            onClick={() => setShowNerveMenu(!showNerveMenu)}
            className="w-full flex items-center justify-between p-5 rounded-2xl bg-white border-2 border-slate-100 hover:border-purple-500 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Zap size={20} />
              </div>
              <span className="font-bold text-lg">Peripheral Nerves</span>
            </div>
            <Play size={20} className={`text-slate-300 transition-transform ${showNerveMenu ? 'rotate-90 text-purple-500' : 'group-hover:text-purple-500'}`} />
          </button>

          {/* Sub-menu for Peripheral Nerves */}
          {showNerveMenu && (
            <div className="pl-6 space-y-3 mt-2 mb-4">
              <button 
                onClick={() => handleCategorySelect('Nerve Root')}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-purple-50 border-2 border-purple-100 hover:border-purple-400 hover:bg-purple-100 transition-all font-bold text-purple-700"
              >
                <span>Motor</span>
                <Play size={16} />
              </button>
              <button 
                disabled
                className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-50 border-2 border-slate-100 text-slate-400 cursor-not-allowed font-bold"
              >
                <span>Sensory</span>
                <span className="text-xs bg-slate-200 text-slate-500 px-2 py-1 rounded-full uppercase tracking-wider">Coming Soon</span>
              </button>
            </div>
          )}
          
          <button 
            disabled
            className="w-full flex items-center justify-between p-5 rounded-2xl bg-slate-50 border-2 border-slate-100 opacity-60 cursor-not-allowed group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center">
                <Brain size={20} />
              </div>
              <span className="font-bold text-lg text-slate-500">Brain Regions</span>
            </div>
            <span className="text-xs font-bold bg-slate-200 text-slate-500 px-2 py-1 rounded-full uppercase tracking-wider">Coming Soon</span>
          </button>
        </div>

        {/* Admin Editor Link */}
        <button
          onClick={() => setGameState('admin')}
          className="mt-8 mx-auto flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-sm font-semibold rounded-xl transition-all"
        >
          <Wrench size={16} />
          Asset Editor
        </button>
      </div>
    </div>
  );
}
