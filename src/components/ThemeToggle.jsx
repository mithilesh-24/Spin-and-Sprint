import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { sound } from '../utils/audio';

export default function ThemeToggle({ theme, onToggleTheme }) {
  const isLight = theme === 'light';

  const handleClick = () => {
    sound.playButtonClick();
    onToggleTheme();
  };

  return (
    <button
      onClick={handleClick}
      className={`p-2.5 rounded-xl border-2 transition-all duration-300 shadow-md backdrop-blur-md flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider ${
        isLight
          ? 'bg-white/90 border-red-500 text-red-600 hover:bg-red-50 shadow-spider-red'
          : 'bg-[#0c1328]/90 border-zinc-700 text-yellow-400 hover:border-yellow-400/80 shadow-md'
      }`}
      title={isLight ? 'Switch to Dark Theme' : 'Switch to White Theme'}
      aria-label="Toggle Theme"
    >
      {isLight ? (
        <>
          <Moon className="w-4 h-4 text-slate-800" />
          <span className="hidden sm:inline text-slate-800">Dark</span>
        </>
      ) : (
        <>
          <Sun className="w-4 h-4 text-yellow-400 animate-spin" style={{ animationDuration: '12s' }} />
          <span className="hidden sm:inline text-gray-200">White</span>
        </>
      )}
    </button>
  );
}
