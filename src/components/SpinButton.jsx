import React from 'react';
import { Lock, Sparkles, Loader2, Timer } from 'lucide-react';

export default function SpinButton({
  onSpin,
  isSpinning,
  isLocked,
  isCompleted,
  remainingCount,
  lockRemainingSeconds = 0,
  formattedLockTime = "02:00",
  theme = 'dark',
}) {
  const isLight = theme === 'light';
  const isTimerLocked = lockRemainingSeconds > 0;
  const isDisabled = isSpinning || isLocked || isCompleted || isTimerLocked;

  let buttonText = "SPIN THE WHEEL";
  let subtitle = `${remainingCount} Questions In Pool`;

  if (isCompleted) {
    buttonText = "ALL QUESTIONS COMPLETED";
    subtitle = "Great job, heroes!";
  } else if (isSpinning) {
    buttonText = "SPINNING...";
    subtitle = "Selecting Challenge...";
  } else if (isTimerLocked) {
    buttonText = `🔒 LOCKED (${formattedLockTime})`;
    subtitle = "2-Minute Challenge In Progress";
  } else if (isLocked) {
    buttonText = "🔒 WHEEL LOCKED";
    subtitle = "Review Question Below";
  }

  return (
    <div className="flex flex-col items-center gap-1 w-full max-w-xs flex-shrink-0 mb-1">
      <button
        onClick={onSpin}
        disabled={isDisabled}
        className={`group relative w-full py-2.5 px-5 rounded-xl font-black text-base sm:text-lg uppercase tracking-wider transition-all duration-300 transform active:scale-95 ${
          isDisabled
            ? isLight
              ? 'bg-slate-200 border-2 border-slate-300 text-slate-400 cursor-not-allowed shadow-none'
              : 'bg-zinc-800/80 border-2 border-zinc-700 text-zinc-500 cursor-not-allowed opacity-80'
            : 'bg-gradient-to-r from-red-600 via-red-500 to-rose-600 hover:from-red-500 hover:to-orange-500 text-white border-2 border-yellow-400 shadow-[0_0_20px_rgba(226,54,54,0.5)] hover:shadow-[0_0_30px_rgba(250,204,21,0.7)] hover:-translate-y-0.5'
        }`}
      >
        {/* Shimmer Effect */}
        {!isDisabled && (
          <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
            <div className="w-1/2 h-full bg-white/20 skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000" />
          </div>
        )}

        <div className="flex items-center justify-center gap-2">
          {isSpinning ? (
            <Loader2 className="w-4 h-4 animate-spin text-yellow-300 flex-shrink-0" />
          ) : isTimerLocked ? (
            <Timer className={`w-4 h-4 animate-spin ${isLight ? 'text-red-500' : 'text-red-400'} flex-shrink-0`} />
          ) : isLocked ? (
            <Lock className={`w-4 h-4 animate-pulse ${isLight ? 'text-amber-500' : 'text-yellow-400'} flex-shrink-0`} />
          ) : isCompleted ? (
            <Sparkles className="w-4 h-4 text-zinc-500 flex-shrink-0" />
          ) : (
            <span className="text-lg animate-bounce">🕸️</span>
          )}

          <span className="comic-font tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] truncate">
            {buttonText}
          </span>
        </div>
      </button>

      {/* Subtitle Status */}
      <span
        className={`text-[10px] font-semibold tracking-wider uppercase text-center ${
          isLight ? 'text-slate-600' : 'text-gray-400'
        }`}
      >
        {subtitle}
      </span>
    </div>
  );
}
