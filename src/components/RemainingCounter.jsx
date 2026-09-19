import React from 'react';
import { Sparkles } from 'lucide-react';
import { QUESTIONS_DATA } from '../data/questions';

export default function RemainingCounter({
  usedQuestionIds = [],
  theme = 'dark',
  questions = QUESTIONS_DATA,
}) {
  const isLight = theme === 'light';
  const total = questions.length || 20;
  const remaining = total - usedQuestionIds.length;
  const progressPercent = ((total - remaining) / total) * 100;

  return (
    <div
      className={`w-full px-3 py-2 rounded-xl border shadow-sm backdrop-blur-md transition-all ${
        isLight
          ? 'bg-white/95 border-red-500/40 text-slate-900 shadow-sm'
          : 'bg-gradient-to-r from-[#0c1228]/90 via-[#101935]/90 to-[#0c1228]/90 border-red-500/30 text-white shadow-spider-glow'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className={`p-1 rounded-md border ${
              isLight
                ? 'bg-red-50 border-red-400 text-red-600'
                : 'bg-red-600/30 border-red-500 text-red-400'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
          </span>
          <div className="flex items-center gap-1.5 font-mono text-xs">
            <span
              className={`font-bold uppercase tracking-wider ${
                isLight ? 'text-slate-600' : 'text-gray-400'
              }`}
            >
              QUESTIONS REMAINING:
            </span>
            <span
              className={`font-black text-sm ${
                isLight ? 'text-red-600' : 'text-yellow-400'
              }`}
            >
              {remaining} / {total}
            </span>
          </div>
        </div>

        {/* Slim Progress Bar */}
        <div className="w-28 sm:w-36 flex flex-col gap-0.5">
          <div className="flex justify-between text-[10px] font-mono leading-none">
            <span className={isLight ? 'text-slate-500' : 'text-gray-400'}>Done</span>
            <span className="font-bold">{Math.round(progressPercent)}%</span>
          </div>
          <div
            className={`w-full h-1.5 rounded-full overflow-hidden border ${
              isLight ? 'bg-slate-200 border-slate-300' : 'bg-zinc-800 border-zinc-700'
            }`}
          >
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-red-500 to-yellow-400 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
