import React from 'react';
import { Clock, AlertCircle, RefreshCw, X, Award, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { sound } from '../utils/audio';

export default function RoundReminderTimer({
  formattedRoundTime,
  roundRemainingSeconds,
  totalRoundDuration = 1200,
  showRoundReminderAlert,
  onDismissAlert,
  onResetRoundTimer,
  theme = 'dark',
}) {
  const isLight = theme === 'light';
  const isUrgent = roundRemainingSeconds <= 180 && roundRemainingSeconds > 0; // last 3 mins
  const isFinished = roundRemainingSeconds <= 0;
  const progressPercent = ((totalRoundDuration - roundRemainingSeconds) / totalRoundDuration) * 100;

  return (
    <>
      {/* Top Floating 20-Min Round Pill Badge */}
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border shadow-md backdrop-blur-md transition-all ${
        isLight
          ? 'bg-white border-red-500/50 text-slate-900 shadow-sm'
          : 'bg-[#0b1227]/90 border-red-500/40 text-white'
      }`}>
        <Clock className={`w-4 h-4 ${isUrgent ? 'text-red-500 animate-spin' : isLight ? 'text-cyan-600' : 'text-cyan-400'}`} />
        <div className="flex items-center gap-1.5 text-xs font-mono">
          <span className={`hidden sm:inline ${isLight ? 'text-slate-600 font-semibold' : 'text-gray-400'}`}>Round (20m):</span>
          <span className={`font-black text-sm ${
            isUrgent
              ? 'text-red-600 animate-pulse font-black'
              : isFinished
                ? isLight ? 'text-amber-600' : 'text-yellow-400'
                : isLight ? 'text-cyan-700 font-black' : 'text-cyan-300'
          }`}>
            {formattedRoundTime}
          </span>
        </div>

        <button
          onClick={onResetRoundTimer}
          className={`ml-1 p-1 rounded transition-colors ${
            isLight ? 'hover:bg-slate-100 text-slate-500 hover:text-slate-900' : 'hover:bg-zinc-800 text-gray-400 hover:text-white'
          }`}
          title="Reset 20-min timer"
        >
          <RefreshCw className="w-3 h-3" />
        </button>
      </div>

      {/* 20-Minute Round Conclusion Modal Alert */}
      <AnimatePresence>
        {showRoundReminderAlert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              className={`w-full max-w-md p-1 rounded-2xl ${
                isLight
                  ? 'bg-gradient-to-b from-red-500 via-yellow-400 to-cyan-500 shadow-2xl'
                  : 'bg-gradient-to-b from-red-600 via-rose-600 to-yellow-400 shadow-spider-glow'
              }`}
            >
              <div className={`rounded-[14px] p-6 text-center border relative ${
                isLight ? 'bg-white border-red-500/50 text-slate-900' : 'bg-[#0b1020] border-red-500/50 text-white'
              }`}>
                <button
                  onClick={onDismissAlert}
                  className={`absolute top-3 right-3 p-1.5 rounded-lg transition-colors ${
                    isLight ? 'text-slate-400 hover:text-slate-900 hover:bg-slate-100' : 'text-gray-400 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="w-14 h-14 mx-auto rounded-full bg-red-600/20 border-2 border-yellow-400 flex items-center justify-center text-3xl mb-3 animate-bounce shadow-md">
                  ⏰
                </div>

                <div className={`inline-block px-3 py-1 rounded-full border font-mono text-xs uppercase tracking-widest mb-2 font-black ${
                  isLight ? 'bg-red-100 border-red-500 text-red-700' : 'bg-red-600/30 border-red-500 text-red-300'
                }`}>
                  20-Minute Round Reminder
                </div>

                <h3 className={`comic-font text-3xl uppercase tracking-wide ${
                  isLight ? 'text-red-600 font-black' : 'text-white spidey-glow-red'
                }`}>
                  Round Time Up!
                </h3>

                <p className={`text-sm mt-2 font-mono ${isLight ? 'text-slate-600' : 'text-gray-300'}`}>
                  The 20-minute symposium round duration has concluded. Great teamwork, heroes!
                </p>

                <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={onResetRoundTimer}
                    className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-sm rounded-xl border border-yellow-400 shadow-spider-red uppercase tracking-wider transition-transform transform hover:scale-105 active:scale-95"
                  >
                    Start Next 20m Round
                  </button>
                  <button
                    onClick={onDismissAlert}
                    className={`w-full sm:w-auto px-5 py-2.5 font-bold text-sm rounded-xl transition-colors uppercase font-mono border ${
                      isLight
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                        : 'bg-zinc-800 hover:bg-zinc-700 text-gray-300 border-zinc-700'
                    }`}
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
