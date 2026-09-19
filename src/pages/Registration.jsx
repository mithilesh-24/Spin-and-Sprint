import React from 'react';
import HeaderBranding from '../components/HeaderBranding';
import RegistrationForm from '../components/RegistrationForm';
import SpiderBackground from '../components/SpiderBackground';
import SpideyMascot from '../components/SpideyMascot';
import SoundControl from '../components/SoundControl';

export default function Registration({ theme, onToggleTheme, onRegisterSuccess }) {
  return (
    <div className="relative h-screen max-h-screen overflow-hidden flex flex-col justify-between select-none">
      <SpiderBackground />

      {/* Header with Renaissance & Department Badges + Theme Toggle */}
      <HeaderBranding theme={theme} onToggleTheme={onToggleTheme} />

      {/* Main Container: Fits Viewport Without Any Scroll */}
      <main className="relative z-10 flex-1 max-w-6xl mx-auto w-full px-4 py-1 flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-10 min-h-0 overflow-hidden">
        {/* Left: Isolated Animated Spidey Mascot */}
        <div className="hidden sm:flex flex-1 flex-col items-center justify-center max-w-sm py-1 min-h-0">
          <SpideyMascot />
        </div>

        {/* Right: Team Registration Form */}
        <div className="flex-1 w-full max-w-lg min-h-0 flex items-center justify-center">
          <RegistrationForm onRegisterSuccess={onRegisterSuccess} theme={theme} />
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-1 text-center text-[11px] text-gray-500 border-t border-red-500/10 flex-shrink-0">
        Renaissance 2026 &bull; Department of Computer Science & Engineering &bull; CSEA &amp; CCC
      </footer>

      <SoundControl />
    </div>
  );
}
