import React from 'react';
import HeaderBranding from '../components/HeaderBranding';
import SpiderBackground from '../components/SpiderBackground';
import SpinWheel from '../components/SpinWheel';
import SpinButton from '../components/SpinButton';
import QuestionCard from '../components/QuestionCard';
import RemainingCounter from '../components/RemainingCounter';
import TeamInfo from '../components/TeamInfo';
import SolvedHistoryList from '../components/SolvedHistoryList';
import SoundControl from '../components/SoundControl';
import { useSpinWheel } from '../hooks/useSpinWheel';

export default function Game({ teamData, onSwitchTeam, theme = 'dark', onToggleTheme }) {
  const {
    questions,
    usedQuestionIds,
    selectedQuestion,
    isSpinning,
    isLocked,
    lockRemainingSeconds,
    totalLockDuration,
    formattedLockTime,
    rotation,
    activeHighlightIndex,
    spin,
    nextSpin,
    elapsedSolvingSeconds,
    formattedElapsedSolvingTime,
    solvingHistory,
    remainingCount,
    isCompleted,
  } = useSpinWheel(teamData);

  const isLight = theme === 'light';

  return (
    <div className="relative h-screen max-h-screen overflow-hidden flex flex-col justify-between select-none">
      <SpiderBackground />

      {/* Top Header Branding & Logos */}
      <HeaderBranding
        theme={theme}
        onToggleTheme={onToggleTheme}
      />

      {/* Main 2-Column Desktop Arena */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-3 sm:px-6 py-1 grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch overflow-hidden min-h-0">
        {/* =========================================================================
            LEFT PANEL: Fixed in view on desktop (NO vertical scroll)
            Team Details -> Questions Remaining -> 🎡 Spin Wheel -> Spin Button / Lock
            ========================================================================= */}
        <section className="lg:col-span-5 flex flex-col justify-between items-center gap-1.5 w-full h-full min-h-0 py-1 overflow-hidden">
          {/* Team Details Card */}
          <TeamInfo
            teamData={teamData}
            onSwitchTeam={onSwitchTeam}
            theme={theme}
          />

          {/* Questions Remaining Counter */}
          <RemainingCounter
            usedQuestionIds={usedQuestionIds}
            theme={theme}
            questions={questions}
          />

          {/* 20-Segment Dynamic Scaled Wheel */}
          <div className="flex-1 flex items-center justify-center w-full min-h-0 py-0.5 overflow-hidden">
            <SpinWheel
              rotation={rotation}
              isSpinning={isSpinning}
              usedQuestionIds={usedQuestionIds}
              activeHighlightIndex={activeHighlightIndex}
              questions={questions}
            />
          </div>

          {/* Spin Button / Lock Status */}
          <SpinButton
            onSpin={spin}
            isSpinning={isSpinning}
            isLocked={isLocked}
            isCompleted={isCompleted}
            remainingCount={remainingCount}
            lockRemainingSeconds={lockRemainingSeconds}
            formattedLockTime={formattedLockTime}
            theme={theme}
          />
        </section>

        {/* =========================================================================
            RIGHT PANEL: Independently scrollable on desktop (overflow-y: auto)
            Question Card / 2-Min Lock / Solved History & Time Taken
            ========================================================================= */}
        <section className="lg:col-span-7 w-full h-full min-h-0 overflow-y-auto pr-1.5 pb-2 flex flex-col gap-3 custom-scrollbar">
          {selectedQuestion ? (
            <QuestionCard
              question={selectedQuestion}
              teamData={teamData}
              onNextSpin={nextSpin}
              formattedElapsedSolvingTime={formattedElapsedSolvingTime}
              lockRemainingSeconds={lockRemainingSeconds}
              formattedLockTime={formattedLockTime}
              totalLockDuration={totalLockDuration}
              theme={theme}
            />
          ) : (
            /* Awaiting Challenge Prompt Placeholder */
            <div
              className={`p-6 sm:p-8 rounded-2xl border text-center transition-all flex-1 flex flex-col items-center justify-center min-h-[260px] ${
                isLight
                  ? 'bg-white/95 border-red-500/40 shadow-lg text-slate-900'
                  : 'bg-[#090e1f]/90 border-red-500/40 shadow-spider-glow text-white'
              }`}
            >
              <div className="w-14 h-14 rounded-full bg-red-600/20 border-2 border-yellow-400 flex items-center justify-center text-2xl animate-bounce shadow-md mb-2">
                🕸️
              </div>
              <div
                className={`inline-block px-3 py-0.5 rounded-full border font-mono text-xs uppercase tracking-widest mb-1.5 font-black ${
                  isLight ? 'bg-red-50 border-red-400 text-red-700' : 'bg-red-600/30 border-red-500 text-red-300'
                }`}
              >
                Awaiting Spin
              </div>
              <h3
                className={`comic-font text-2xl sm:text-3xl uppercase tracking-wide ${
                  isLight ? 'text-red-600' : 'text-white spidey-glow-red'
                }`}
              >
                Spin the Wheel to Begin!
              </h3>
              <p
                className={`text-xs sm:text-sm mt-1.5 max-w-md font-medium ${
                  isLight ? 'text-slate-600' : 'text-gray-300'
                }`}
              >
                Click <strong>SPIN THE WHEEL</strong> on the left to select a question. Each challenge is locked for <strong>2 minutes</strong> to give the duo time to solve!
              </p>
            </div>
          )}

          {/* Solved Questions & Time Taken History */}
          {solvingHistory && solvingHistory.length > 0 && (
            <SolvedHistoryList history={solvingHistory} theme={theme} />
          )}
        </section>
      </main>

      {/* Sound Toggle Control */}
      <SoundControl />
    </div>
  );
}
