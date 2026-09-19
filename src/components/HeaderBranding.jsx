import React from 'react';
import ThemeToggle from './ThemeToggle';

export default function HeaderBranding({ theme = 'dark', onToggleTheme, extraHeaderAction }) {
  const isLight = theme === 'light';

  return (
    <header className="relative z-20 w-full max-w-6xl mx-auto px-4 py-1.5 flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-red-500/20 flex-shrink-0">
      {/* Left: Renaissance Symposium Logo Image */}
      <div className="flex items-center gap-3">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-rose-500 rounded-xl blur opacity-30 group-hover:opacity-75 transition duration-500" />
          <div
            className={`relative px-3 py-1 border-2 rounded-xl flex items-center shadow-md transition-all ${
              isLight ? 'bg-white border-red-500/50' : 'bg-[#090e1f]/90 border-red-500/40'
            }`}
          >
            <img
              src="/renaissance-logo.png"
              alt="Renaissance Logo"
              className="h-8 sm:h-9 w-auto object-contain filter drop-shadow-[0_2px_8px_rgba(226,54,54,0.6)]"
            />
          </div>
        </div>
      </div>

      {/* Right: CSEA & CCC Logos & Theme Toggle */}
      <div className="flex items-center gap-2.5 flex-wrap justify-center">
        {extraHeaderAction}

        {/* CSEA Logo Badge */}
        <div
          className={`flex items-center gap-2 px-2.5 py-1 border rounded-lg shadow-sm transition-all ${
            isLight ? 'bg-white border-orange-500/50' : 'bg-[#090e1f]/90 border-orange-500/40'
          }`}
        >
          <img
            src="/csea-logo.png"
            alt="CSEA Logo"
            className="h-6 sm:h-7 w-auto object-contain"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="text-left">
            <div className={`text-[11px] font-black leading-tight ${isLight ? 'text-orange-600' : 'text-orange-400'}`}>
              CSEA
            </div>
            <div className={`text-[7px] font-bold tracking-tighter uppercase ${isLight ? 'text-slate-600' : 'text-orange-200/80'}`}>
              WE CAN ∞ WE WILL
            </div>
          </div>
        </div>

        {/* CCC (CSE Coding Club) Logo Badge */}
        <div
          className={`flex items-center gap-2 px-2.5 py-1 border rounded-lg shadow-sm transition-all ${
            isLight ? 'bg-white border-purple-500/50' : 'bg-[#090e1f]/90 border-purple-500/40'
          }`}
        >
          <img
            src="/ccc-logo.png"
            alt="CCC Logo"
            className="h-6 sm:h-7 w-auto object-contain"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="text-left">
            <div className={`text-[11px] font-black leading-tight ${isLight ? 'text-purple-700' : 'text-purple-400'}`}>
              CCC
            </div>
            <div className={`text-[7px] font-bold tracking-tighter uppercase ${isLight ? 'text-slate-600' : 'text-purple-200/80'}`}>
              CSE CODING CLUB
            </div>
          </div>
        </div>

        {/* Theme Toggle */}
        {onToggleTheme && (
          <ThemeToggle theme={theme} onToggleTheme={onToggleTheme} />
        )}
      </div>
    </header>
  );
}
