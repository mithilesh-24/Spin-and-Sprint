import React from 'react';
import { Users, RotateCcw } from 'lucide-react';

export default function TeamInfo({ teamData, onSwitchTeam, theme = 'dark' }) {
  if (!teamData) return null;
  const isLight = theme === 'light';
  const isFirstYear = teamData.year === '1st Year';

  return (
    <div
      className={`w-full rounded-xl border px-3 py-2 shadow-sm backdrop-blur-md transition-all flex-shrink-0 ${
        isLight
          ? 'bg-white/95 border-red-500/40 text-slate-900 shadow-sm'
          : 'bg-gradient-to-r from-[#0d1633]/90 via-[#132247]/90 to-[#0d1633]/90 border-red-500/40 text-white shadow-spider-glow'
      }`}
    >
      <div className="flex items-center justify-between pb-1.5 border-b border-red-500/20">
        <div className="flex items-center gap-1.5">
          <div
            className={`w-5 h-5 rounded border flex items-center justify-center ${
              isLight
                ? 'bg-red-50 border-red-400 text-red-600'
                : 'bg-red-600/30 border-red-500 text-red-400'
            }`}
          >
            <Users className="w-3 h-3" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-mono uppercase tracking-wider text-red-500 font-black">
              TEAM:
            </span>
            <span
              className={`font-black text-xs sm:text-sm uppercase tracking-wider ${
                isLight ? 'text-slate-900' : 'text-yellow-400'
              }`}
            >
              {teamData.teamName}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span
            className={`px-2 py-0.5 rounded-full text-[8px] font-mono font-black uppercase tracking-wider border ${
              isFirstYear
                ? isLight
                  ? 'bg-amber-100 border-amber-400 text-amber-900'
                  : 'bg-amber-950/70 border-yellow-400 text-yellow-300'
                : isLight
                  ? 'bg-cyan-100 border-cyan-400 text-cyan-900'
                  : 'bg-cyan-950/70 border-cyan-400 text-cyan-300'
            }`}
          >
            {isFirstYear ? '1st Year' : '2nd Year'}
          </span>
          {onSwitchTeam && (
            <button
              onClick={onSwitchTeam}
              title="Switch Team"
              className={`p-1 rounded text-[9px] font-mono flex items-center gap-1 transition-colors border ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-gray-300 border-zinc-700'
              }`}
            >
              <RotateCcw className="w-2.5 h-2.5" />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-1.5 text-xs font-mono">
        {/* Member 1 */}
        <div
          className={`px-2 py-1 rounded border leading-tight ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#080d1f]/80 border-cyan-500/20'
          }`}
        >
          <div className="text-[8px] font-bold text-red-500 uppercase tracking-wider">
            MEMBER 1
          </div>
          <div className={`font-black text-[11px] truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>
            {teamData.member1Name}
          </div>
          <div className={`text-[9px] font-bold ${isLight ? 'text-slate-600' : 'text-cyan-300'}`}>
            {teamData.member1Roll}
          </div>
        </div>

        {/* Member 2 */}
        <div
          className={`px-2 py-1 rounded border leading-tight ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#080d1f]/80 border-rose-500/20'
          }`}
        >
          <div className="text-[8px] font-bold text-red-500 uppercase tracking-wider">
            MEMBER 2
          </div>
          <div className={`font-black text-[11px] truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>
            {teamData.member2Name}
          </div>
          <div className={`text-[9px] font-bold ${isLight ? 'text-slate-600' : 'text-cyan-300'}`}>
            {teamData.member2Roll}
          </div>
        </div>
      </div>
    </div>
  );
}
