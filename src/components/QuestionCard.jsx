import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { ArrowRight, Users, Timer, Lock, Unlock, ShieldAlert, Sparkles, Trophy, Flame } from 'lucide-react';
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
    // Fire festive celebratory confetti
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#E23636', '#00D2FF', '#FFB800', '#FFFFFF'],
      });
    } catch (e) {}
  }, []);

  if (!question) return null;

  const getDifficultyColor = (diff) => {
    switch (diff?.toLowerCase()) {
      case 'easy':
        return isLight
          ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
          : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40';
      case 'hard':
        return isLight
          ? 'bg-rose-50 text-rose-700 border-rose-300'
          : 'bg-rose-500/15 text-rose-400 border-rose-500/40';
      default:
        return isLight
          ? 'bg-amber-50 text-amber-800 border-amber-300'
          : 'bg-amber-500/15 text-amber-400 border-amber-500/40';
    }
  };

  const getPatternBadge = (pattern) => {
    switch (pattern) {
      case 'PATTERN':
        return isLight
          ? 'bg-amber-50 text-amber-900 border-amber-300'
          : 'bg-yellow-500/20 text-yellow-300 border-yellow-400/40';
      case 'BASIC PROGRAMMING':
      case 'CODING':
        return isLight
          ? 'bg-cyan-50 text-cyan-900 border-cyan-300'
          : 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40';
      case 'DEBUGGING':
        return isLight
          ? 'bg-rose-50 text-rose-900 border-rose-300'
          : 'bg-rose-500/20 text-rose-300 border-rose-400/40';
      default:
        return isLight
          ? 'bg-red-50 text-red-900 border-red-300'
          : 'bg-red-500/20 text-red-300 border-red-400/40';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97, y: -12 }}
      transition={{ type: 'spring', stiffness: 280, damping: 24 }}
      className={`w-full mx-auto rounded-3xl p-[2px] transition-all ${
        isLight
          ? 'bg-gradient-to-b from-red-500 via-slate-200 to-cyan-500 shadow-[0_12px_40px_rgba(0,0,0,0.08)]'
          : 'bg-gradient-to-b from-red-600/80 via-slate-800 to-cyan-600/80 shadow-[0_15px_50px_rgba(0,0,0,0.7)]'
      }`}
    >
      <div
        className={`rounded-[22px] p-4 sm:p-6 transition-colors relative overflow-hidden ${
          isLight
            ? 'bg-white text-slate-900'
            : 'bg-[#0a0f1d] text-slate-100'
        }`}
      >
        {/* Top Bar: Team Info & Live Clocks */}
        <div
          className={`flex flex-wrap items-center justify-between gap-2.5 pb-3.5 border-b ${
            isLight ? 'border-slate-100' : 'border-slate-800'
          }`}
        >
          {/* Team Pill */}
          {teamData && (
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0f172a] border-slate-700/60'
              }`}
            >
              <Users className={`w-3.5 h-3.5 ${isLight ? 'text-red-600' : 'text-red-400'}`} />
              <div className="text-xs">
                <span className={`font-black uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {teamData.teamName}
                </span>
                <span className={`ml-1.5 font-mono text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  ({teamData.member1Name} &bull; {teamData.member2Name})
                </span>
              </div>
            </div>
          )}

          {/* Badges: Live Stopwatch + 2-Min Lock */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Live Stopwatch Badge */}
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 border rounded-full text-xs font-mono font-bold tracking-wider ${
                isLight
                  ? 'bg-cyan-50 border-cyan-300 text-cyan-900 shadow-sm'
                  : 'bg-cyan-950/60 border-cyan-500/50 text-cyan-300'
              }`}
            >
              <Timer className="w-3.5 h-3.5 text-cyan-500" />
              <span>TIME: <strong>{formattedElapsedSolvingTime}</strong></span>
            </div>

            {/* 2-Minute Lock Badge */}
            {isTimerLocked ? (
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 border rounded-full text-xs font-mono font-black tracking-wider uppercase ${
                  isLight
                    ? 'bg-rose-50 border-rose-300 text-rose-700 shadow-sm'
                    : 'bg-rose-950/70 border-rose-500/70 text-rose-300'
                }`}
              >
                <Lock className="w-3.5 h-3.5 text-rose-500" />
                <span>LOCK: {formattedLockTime}</span>
              </div>
            ) : (
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 border rounded-full text-xs font-mono font-bold tracking-wider uppercase ${
                  isLight
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                    : 'bg-emerald-950/60 border-emerald-500/60 text-emerald-300'
                }`}
              >
                <Unlock className="w-3.5 h-3.5 text-emerald-500" />
                <span>UNLOCKED</span>
              </div>
            )}
          </div>
        </div>

        {/* Question Header: Number Pill, Title & Metadata Badges */}
        <div className="my-3 sm:my-4 text-center space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-mono font-black tracking-widest uppercase shadow-sm bg-gradient-to-r from-red-500 to-rose-600 text-white border-red-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{question.number} SELECTED</span>
          </div>

          <h2
            className={`text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight uppercase leading-tight font-sans ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}
          >
            {question.name}
          </h2>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-1 font-mono text-xs">
            <span className={`px-2.5 py-0.5 rounded-lg border font-bold ${getPatternBadge(question.pattern)}`}>
              Type: {question.pattern}
            </span>
            <span className={`px-2.5 py-0.5 rounded-lg border font-bold flex items-center gap-1 ${getDifficultyColor(question.difficulty)}`}>
              <Flame className="w-3 h-3" />
              Difficulty: {question.difficulty}
            </span>
          </div>
        </div>

        {/* Dynamic Question Content Area */}
        <div className="my-3 sm:my-4">
          <QuestionRenderer question={question} theme={theme} />
        </div>

        {/* 2-Minute Lock Progress Bar */}
        {isTimerLocked && (
          <div
            className={`mb-3 p-3 border rounded-2xl space-y-1.5 ${
              isLight ? 'bg-rose-50/80 border-rose-200' : 'bg-rose-950/30 border-rose-500/30'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-mono">
              <span className={`font-bold flex items-center gap-1.5 ${isLight ? 'text-rose-800' : 'text-rose-300'}`}>
                <Lock className="w-3.5 h-3.5 text-rose-500" /> Challenge Lock in Progress
              </span>
              <span className={`font-black text-xs sm:text-sm ${isLight ? 'text-rose-700' : 'text-amber-400'}`}>
                {formattedLockTime} remaining
              </span>
            </div>
            <div
              className={`w-full h-2 rounded-full overflow-hidden border ${
                isLight ? 'bg-slate-200 border-slate-300' : 'bg-slate-900 border-slate-800'
              }`}
            >
              <div
                className="h-full bg-gradient-to-r from-red-600 via-rose-500 to-amber-400 transition-all duration-1000"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Bottom Actions: Next Spin CTA */}
        <div
          className={`pt-3 border-t flex flex-col sm:flex-row items-center justify-between gap-3 ${
            isLight ? 'border-slate-100' : 'border-slate-800'
          }`}
        >
          <div className={`text-xs font-mono flex items-center gap-1.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            <ShieldAlert className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <span>
              {isTimerLocked
                ? `Next spin will unlock in ${formattedLockTime}.`
                : 'Timer completed! Click NEXT SPIN to continue.'}
            </span>
          </div>

          <button
            onClick={onNextSpin}
            disabled={isTimerLocked}
            className={`w-full sm:w-auto px-7 py-2.5 font-black text-sm sm:text-base rounded-xl border transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-wider group flex-shrink-0 ${
              isTimerLocked
                ? isLight
                  ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-500 cursor-not-allowed opacity-75'
                : 'bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white border-amber-400 shadow-lg hover:shadow-red-500/30 transform hover:-translate-y-0.5 active:scale-95'
            }`}
          >
            {isTimerLocked ? (
              <>
                <Lock className={`w-4 h-4 ${isLight ? 'text-slate-400' : 'text-slate-500'}`} />
                <span className="font-mono font-bold tracking-wider">LOCKED ({formattedLockTime})</span>
              </>
            ) : (
              <>
                <span className="font-sans font-black tracking-wider">NEXT SPIN</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
