import { useState } from 'react';
import { Brain, Play, RotateCcw, Trophy, Activity, Zap, Settings2, Image as ImageIcon, Type, ArrowRightLeft, ArrowRight } from 'lucide-react';
import { questions, Question, Category, shuffle } from './data';
import { Game } from './Game';
import { Review } from './Review';

type GameState = 'menu' | 'config' | 'playing' | 'review';
export type Direction = 'forward' | 'reverse';
export type OptionType = 'text' | 'image';

export default function App() {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  
  // Game Config
  const [direction, setDirection] = useState<Direction>('forward');
  const [optionType, setOptionType] = useState<OptionType>('text');

  const [missedQuestions, setMissedQuestions] = useState<Question[]>([]);
  const [score, setScore] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('neuroquiz_highscore');
    return saved ? parseInt(saved, 10) : 0;
  });

  const handleCategorySelect = (category: Category | 'All') => {
    setSelectedCategory(category);
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
    if (finalScore > highScore) {
      setHighScore(finalScore);
      localStorage.setItem('neuroquiz_highscore', finalScore.toString());
    }
    setGameState('review');
  };

  if (gameState === 'playing') {
    return (
      <Game 
        category={selectedCategory} 
        direction={direction}
        optionType={optionType}
        onGameOver={handleGameOver} 
        onQuit={() => setGameState('menu')}
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
            <p className="text-slate-500 font-medium">Category: <span className="text-indigo-600 font-bold">{selectedCategory}</span></p>
          </div>

          <div className="space-y-8">
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
                  <div className="font-bold text-lg text-slate-800 mb-1">Standard</div>
                  <div className="text-sm text-slate-500">Structure <ArrowRight size={14} className="inline mx-1" /> Nerve Root</div>
                </button>
                <button 
                  onClick={() => setDirection('reverse')}
                  className={`p-4 rounded-2xl border-2 text-left transition-all ${direction === 'reverse' ? 'border-indigo-500 bg-indigo-50 shadow-md' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                >
                  <div className="font-bold text-lg text-slate-800 mb-1">Reverse</div>
                  <div className="text-sm text-slate-500">Nerve Root <ArrowRight size={14} className="inline mx-1" /> Structure</div>
                </button>
              </div>
            </div>

            {/* Option Type Toggle */}
            <div className="space-y-3">
              <label className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Settings2 size={16} /> Option Style
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setOptionType('text')}
                  className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${optionType === 'text' ? 'border-indigo-500 bg-indigo-50 shadow-md text-indigo-700' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}
                >
                  <Type size={24} />
                  <span className="font-bold">Text</span>
                </button>
                <button 
                  onClick={() => setOptionType('image')}
                  className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${optionType === 'image' ? 'border-indigo-500 bg-indigo-50 shadow-md text-indigo-700' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}
                >
                  <ImageIcon size={24} />
                  <span className="font-bold">Images</span>
                </button>
              </div>
            </div>
          </div>

          <button 
            onClick={startGame}
            className="mt-12 w-full bg-indigo-600 text-white p-5 rounded-2xl font-bold text-lg hover:bg-indigo-700 active:scale-95 transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-2"
          >
            <Play size={24} fill="currentColor" />
            Start Game
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
            onClick={() => handleCategorySelect('Brain Region')}
            className="w-full flex items-center justify-between p-5 rounded-2xl bg-white border-2 border-slate-100 hover:border-amber-500 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Brain size={20} />
              </div>
              <span className="font-bold text-lg">Brain Regions</span>
            </div>
            <Play size={20} className="text-slate-300 group-hover:text-amber-500" />
          </button>
        </div>
      </div>
    </div>
  );
}
