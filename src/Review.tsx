import { Trophy, RotateCcw, Home, AlertCircle } from 'lucide-react';
import { Question } from './data';

interface ReviewProps {
  score: number;
  total: number;
  missedQuestions: Question[];
  onPlayAgain: () => void;
  onMenu: () => void;
}

export function Review({ score, total, missedQuestions, onPlayAgain, onMenu }: ReviewProps) {
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  
  let message = "Good effort!";
  if (percentage >= 90) message = "Outstanding!";
  else if (percentage >= 70) message = "Great job!";
  else if (percentage < 50) message = "Keep practicing!";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <div className="flex-1 max-w-md w-full mx-auto p-6 flex flex-col">
        
        {/* Score Header */}
        <div className="flex flex-col items-center justify-center py-10">
          <div className="w-24 h-24 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-6 shadow-inner">
            <Trophy size={48} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">{message}</h1>
          <div className="text-5xl font-extrabold text-indigo-600 mb-2">
            {score} <span className="text-2xl text-slate-400">/ {total}</span>
          </div>
          <p className="text-slate-500 font-medium">Accuracy: {percentage}%</p>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          <button 
            onClick={onPlayAgain}
            className="flex items-center justify-center gap-2 bg-indigo-600 text-white p-4 rounded-2xl font-bold hover:bg-indigo-700 active:scale-95 transition-all shadow-lg shadow-indigo-200"
          >
            <RotateCcw size={20} />
            Play Again
          </button>
          <button 
            onClick={onMenu}
            className="flex items-center justify-center gap-2 bg-white text-slate-700 border-2 border-slate-200 p-4 rounded-2xl font-bold hover:border-slate-300 hover:bg-slate-50 active:scale-95 transition-all"
          >
            <Home size={20} />
            Menu
          </button>
        </div>

        {/* Missed Questions Review */}
        {missedQuestions.length > 0 && (
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle size={20} className="text-amber-500" />
              <h2 className="text-lg font-bold text-slate-800">Needs Review ({missedQuestions.length})</h2>
            </div>
            
            <div className="space-y-3 pb-8">
              {missedQuestions.map((q, i) => (
                <div key={`${q.id}-${i}`} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-1">{q.category}</div>
                  <div className="font-bold text-slate-800 mb-2">{q.prompt}</div>
                  <div className="flex items-center gap-2 text-emerald-600 font-bold bg-emerald-50 px-3 py-2 rounded-lg inline-flex">
                    Answer: {q.answer}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {missedQuestions.length === 0 && total > 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-emerald-50 rounded-3xl border border-emerald-100">
            <div className="text-emerald-500 mb-3">✨</div>
            <h3 className="font-bold text-emerald-800 mb-1">Perfect Score!</h3>
            <p className="text-emerald-600 text-sm">You didn't miss a single question.</p>
          </div>
        )}

      </div>
    </div>
  );
}
