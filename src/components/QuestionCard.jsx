import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { ArrowRight, Users, Timer, Lock, Unlock, ShieldAlert } from 'lucide-react';
import QuestionRenderer from './QuestionRenderer';

export default function QuestionCard({
  question,
  teamData,
  onNextSpin,
  formattedElapsedSolvingTime = "00:00",
  lockRemainingSeconds = 0,
  formattedLockTime = "02:00",
  totalLockDuration = 120,
  theme = 'dark',
}) {
  const isLight = theme === 'light';
  const isTimerLocked = lockRemainingSeconds > 0;
  const progressPercent = ((totalLockDuration - lockRemainingSeconds) / totalLockDuration) * 100;

  useEffect(() => {
    // Fire festive Spidey confetti (red, cyan, gold, white)
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#E23636', '#00D2FF', '#FFB800', '#FFFFFF'],
      });
    } catch (e) {}
  }, []);

  if (!question) return null;

  const getDifficultyColor = (diff) => {
    switch (diff?.toLowerCase()) {
      case 'easy':
        return isLight
          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
          : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50';
      case 'hard':
        return isLight
          ? 'bg-rose-100 text-rose-800 border-rose-300'
          : 'bg-rose-500/20 text-rose-400 border-rose-500/50';
      default:
        return isLight
          ? 'bg-amber-100 text-amber-800 border-amber-300'
          : 'bg-amber-500/20 text-amber-400 border-amber-500/50';
    }
  };

  const getPatternBadge = (pattern) => {
    switch (pattern) {
      case 'CODING':
        return isLight
          ? 'bg-blue-100 text-blue-800 border-blue-300'
          : 'bg-blue-600/30 text-cyan-300 border-cyan-400/50';
      case 'DEBUGGING':
        return isLight
          ? 'bg-rose-100 text-rose-800 border-rose-300'
          : 'bg-rose-600/30 text-rose-300 border-rose-400/50';
      case 'OUTPUT PREDICTION':
        return isLight
          ? 'bg-purple-100 text-purple-800 border-purple-300'
          : 'bg-purple-600/30 text-purple-300 border-purple-400/50';
      case 'MCQ':
        return isLight
          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
          : 'bg-emerald-600/30 text-emerald-300 border-emerald-400/50';
      case 'RAPID FIRE':
        return isLight
          ? 'bg-amber-100 text-amber-900 border-amber-400'
          : 'bg-yellow-500/30 text-yellow-300 border-yellow-400/50';
      default:
        return isLight
          ? 'bg-red-100 text-red-800 border-red-300'
          : 'bg-red-600/30 text-red-300 border-red-400/50';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: -15 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      className={`w-full mx-auto p-1 rounded-2xl ${
        isLight
          ? 'bg-gradient-to-b from-red-500 via-slate-300 to-cyan-500 shadow-[0_10px_30px_rgba(0,0,0,0.08)]'
          : 'bg-gradient-to-b from-red-600 via-zinc-800 to-cyan-600 shadow-spider-glow'
      }`}
    >
      <div
        className={`rounded-[14px] p-5 sm:p-6 border relative overflow-hidden transition-colors ${
          isLight
            ? 'bg-white border-red-500/50 text-slate-900 shadow-xl'
            : 'bg-[#0b1020] border-red-500/40 text-white'
        }`}
      >
        {/* Corner Web Decors */}
        <div className="absolute top-0 right-0 w-28 h-28 pointer-events-none opacity-20">
          <svg viewBox="0 0 100 100" className="w-full h-full fill-none stroke-red-500">
            <path d="M100,0 Q50,50 100,100 M100,0 Q20,20 0,100 M100,0 L0,0" strokeWidth="1.5" />
          </svg>
        </div>

        {/* Top Header: Team Info, Live Solving Stopwatch & 2-Min Lock Status */}
        <div
          className={`flex flex-wrap items-center justify-between gap-2 pb-3 border-b ${
            isLight ? 'border-slate-200' : 'border-zinc-800'
          }`}
        >
          {teamData && (
            <div
              className={`flex items-center gap-2 px-3 py-1 rounded-lg border ${
                isLight ? 'bg-red-50 border-red-300' : 'bg-red-950/40 border-red-500/40'
              }`}
            >
              <Users className={`w-3.5 h-3.5 ${isLight ? 'text-red-600' : 'text-red-400'}`} />
              <div className="text-xs">
                <span className={`font-black uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {teamData.teamName}
                </span>
                <span className={`ml-1.5 font-mono text-[11px] ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>
                  ({teamData.member1Name} &bull; {teamData.member2Name})
                </span>
              </div>
            </div>
          )}

          {/* Badges: Live Stopwatch + 2-Min Challenge Lock */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Live Stopwatch Badge */}
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 border rounded-full text-xs font-mono font-bold tracking-wider shadow-sm ${
                isLight ? 'bg-cyan-50 border-cyan-400 text-cyan-900' : 'bg-cyan-950/70 border-cyan-500/60 text-cyan-300'
              }`}
            >
              <Timer className="w-3.5 h-3.5 text-cyan-500 animate-spin" />
              <span>TIME: <strong>{formattedElapsedSolvingTime}</strong></span>
            </div>

            {/* 2-Minute Lock Badge */}
            {isTimerLocked ? (
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 border-2 rounded-full text-xs font-mono font-black tracking-wider uppercase animate-pulse shadow-sm ${
                  isLight
                    ? 'bg-red-100 border-red-500 text-red-700 shadow-sm'
                    : 'bg-red-950/80 border-red-500/80 text-red-300 shadow-spider-red'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>LOCK: {formattedLockTime}</span>
              </div>
            ) : (
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 border-2 rounded-full text-xs font-mono font-bold tracking-wider uppercase shadow-sm ${
                  isLight
                    ? 'bg-emerald-100 border-emerald-500 text-emerald-800'
                    : 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                }`}
              >
                <Unlock className="w-3.5 h-3.5 text-emerald-500" />
                <span>UNLOCKED</span>
              </div>
            )}
          </div>
        </div>

        {/* Question Title & Meta Header */}
        <div className="my-4 text-center">
          <div
            className={`inline-block px-3.5 py-1 rounded-full border font-mono font-black text-xs tracking-widest uppercase mb-1.5 shadow-sm ${
              isLight ? 'bg-red-100 border-red-500 text-red-700' : 'bg-red-600/30 border-red-500 text-white'
            }`}
          >
            🎯 {question.number} SELECTED
          </div>

          <h2
            className={`comic-font text-2xl sm:text-3xl tracking-wider uppercase mt-1 ${
              isLight ? 'text-red-600 font-black' : 'text-white spidey-glow-red'
            }`}
          >
            {question.name}
          </h2>

          <div className="flex flex-wrap items-center justify-center gap-2 mt-2.5 font-mono text-xs">
            <span className={`px-2.5 py-0.5 rounded-md border font-bold ${getPatternBadge(question.pattern)}`}>
              Pattern: {question.pattern}
            </span>
            <span className={`px-2.5 py-0.5 rounded-md border font-bold ${getDifficultyColor(question.difficulty)}`}>
              Difficulty: {question.difficulty}
            </span>
          </div>
        </div>

        {/* Dynamic Question Content */}
        <div className="my-4">
          <QuestionRenderer question={question} theme={theme} />
        </div>

        {/* 2-Minute Lock Progress Bar */}
        {isTimerLocked && (
          <div
            className={`mb-4 p-2.5 border rounded-xl space-y-1 ${
              isLight ? 'bg-red-50/90 border-red-300' : 'bg-red-950/40 border-red-500/30'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-mono">
              <span className={`font-bold flex items-center gap-1.5 ${isLight ? 'text-red-700' : 'text-red-300'}`}>
                <Lock className="w-3.5 h-3.5 text-red-500" /> 2-Minute Challenge Lock Active
              </span>
              <span className={`font-black text-sm ${isLight ? 'text-red-700' : 'text-yellow-400'}`}>
                {formattedLockTime} remaining
              </span>
            </div>
            <div
              className={`w-full h-2 rounded-full overflow-hidden border ${
                isLight ? 'bg-slate-200 border-slate-300' : 'bg-zinc-900 border-zinc-800'
              }`}
            >
              <div
                className="h-full bg-gradient-to-r from-red-600 via-rose-500 to-yellow-400 transition-all duration-1000"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Bottom Actions: Next Spin CTA */}
        <div
          className={`pt-3 mt-3 border-t flex flex-col sm:flex-row items-center justify-between gap-3 ${
            isLight ? 'border-slate-200' : 'border-zinc-800'
          }`}
        >
          <div className={`text-xs font-mono flex items-center gap-1.5 ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>
            <ShieldAlert className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <span>
              {isTimerLocked
                ? `Solve the challenge! Next spin will unlock in ${formattedLockTime}.`
                : '2-minute timer completed! Click NEXT SPIN to proceed.'}
            </span>
          </div>

          <button
            onClick={onNextSpin}
            disabled={isTimerLocked}
            className={`w-full sm:w-auto px-8 py-3 font-black text-base sm:text-lg rounded-xl border-2 transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-wider group flex-shrink-0 ${
              isTimerLocked
                ? isLight
                  ? 'bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed'
                  : 'bg-zinc-800/80 border-zinc-700 text-zinc-500 cursor-not-allowed opacity-80'
                : 'bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white border-yellow-400 shadow-spider-red hover:shadow-spider-gold transform hover:-translate-y-0.5 active:scale-95'
            }`}
          >
            {isTimerLocked ? (
              <>
                <Lock className={`w-4 h-4 ${isLight ? 'text-slate-400' : 'text-zinc-500'}`} />
                <span className="comic-font tracking-widest">LOCKED ({formattedLockTime})</span>
              </>
            ) : (
              <>
                <span className="comic-font tracking-widest">NEXT SPIN</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
