import React from 'react';
import { Clock, CheckCircle2, Award, Zap, Trophy, Timer } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SolvedHistoryList({ history = [], theme = 'dark' }) {
  const isLight = theme === 'light';

  if (!history || history.length === 0) {
    return (
      <div className={`p-4 rounded-xl border text-center transition-all ${
        isLight
          ? 'bg-white/80 border-slate-200 text-slate-500 shadow-sm'
          : 'bg-[#090e1f]/80 border-zinc-800 text-gray-400'
      }`}>
        <div className="flex items-center justify-center gap-2 text-xs font-mono">
          <Clock className="w-4 h-4 text-cyan-500" />
          <span>No questions solved yet. Spin the wheel to start tracking solve times!</span>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalSeconds = history.reduce((acc, item) => acc + (item.timeTakenSeconds || 0), 0);
  const avgSeconds = Math.round(totalSeconds / history.length);
  const formatSecs = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  return (
    <div className={`p-4 sm:p-5 rounded-2xl border shadow-lg backdrop-blur-md transition-all ${
      isLight
        ? 'bg-white border-red-500/40 shadow-[0_4px_20px_rgba(0,0,0,0.06)] text-slate-900'
        : 'bg-[#090e1f]/95 border-red-500/40 text-white shadow-spider-glow'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-red-500/20 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className={`p-1.5 rounded-lg border ${
            isLight ? 'bg-amber-50 border-amber-300 text-amber-600' : 'bg-yellow-500/20 border-yellow-400/50 text-yellow-400'
          }`}>
            <Trophy className="w-4 h-4" />
          </span>
          <div>
            <h3 className={`comic-font text-lg tracking-wide uppercase ${isLight ? 'text-red-600' : 'text-white spidey-glow-red'}`}>
              Team Solve Times History
            </h3>
            <span className={`text-[10px] font-mono ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
              Recorded &amp; Synced to Dedicated Excel Sheet
            </span>
          </div>
        </div>

        {/* Stats Pills */}
        <div className="flex items-center gap-2">
          <div className={`px-2.5 py-1 rounded-lg border text-xs font-mono flex items-center gap-1.5 ${
            isLight ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-zinc-800/80 border-zinc-700 text-gray-300'
          }`}>
            <span className="font-bold">Avg:</span>
            <span className={isLight ? 'text-cyan-700 font-black' : 'text-cyan-300 font-bold'}>{formatSecs(avgSeconds)}</span>
          </div>
          <div className={`px-2.5 py-1 rounded-lg border text-xs font-mono flex items-center gap-1.5 ${
            isLight ? 'bg-red-50 border-red-200 text-red-700 font-bold' : 'bg-red-950/60 border-red-500/40 text-red-300'
          }`}>
            <span>Total Solved:</span>
            <span className="font-black">{history.length}</span>
          </div>
        </div>
      </div>

      {/* List of Solved Questions */}
      <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
        <AnimatePresence>
          {history.map((item, idx) => (
            <motion.div
              key={item.id || idx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`p-2.5 sm:p-3 rounded-xl border flex items-center justify-between gap-3 text-xs font-mono transition-all ${
                isLight
                  ? 'bg-slate-50/80 border-slate-200 hover:border-cyan-400'
                  : 'bg-[#0d1633]/80 border-zinc-800 hover:border-cyan-500/50'
              }`}
            >
              {/* Question Badge & Title */}
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="flex-shrink-0 px-2 py-0.5 rounded-md bg-gradient-to-r from-red-600 to-rose-600 text-white font-black text-[11px] shadow-sm">
                  {item.questionNumber}
                </span>
                <div className="truncate">
                  <div className={`font-bold truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    {item.questionName}
                  </div>
                  <div className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                    {item.questionPattern} &bull; Solved at {item.solvedAt}
                  </div>
                </div>
              </div>

              {/* Time Taken Badge */}
              <div className="flex-shrink-0 flex items-center gap-1.5">
                <div className={`px-2.5 py-1 rounded-lg border flex items-center gap-1.5 shadow-sm ${
                  isLight
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-black'
                    : 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300 font-bold'
                }`}>
                  <Timer className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                  <span>{item.timeTakenFormatted || `${item.timeTakenSeconds}s`}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
