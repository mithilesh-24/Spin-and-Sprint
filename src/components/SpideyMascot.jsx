import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { sound } from '../utils/audio';

export default function SpideyMascot({ theme = 'dark' }) {
  const [isHovered, setIsHovered] = useState(false);
  const [violetGlow, setVioletGlow] = useState(false);
  const isLight = theme === 'light';

  const handleClick = () => {
    sound.playButtonClick();
    setVioletGlow((prev) => !prev);
  };

  return (
    <div className="relative flex flex-col items-center justify-center select-none py-1 w-full">
      {/* Soft Ambient Radial Glow Behind Character (Seamless Fade, Zero Hard Cutoffs) */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-80 sm:h-80 rounded-full blur-3xl -z-10 pointer-events-none transition-all duration-500 ${
          violetGlow
            ? isLight
              ? 'bg-gradient-to-r from-purple-500/30 via-violet-400/20 to-transparent scale-110'
              : 'bg-gradient-to-r from-violet-600/50 via-purple-600/30 to-transparent scale-110'
            : isLight
              ? 'bg-gradient-to-r from-red-500/15 via-rose-400/10 to-transparent'
              : 'bg-gradient-to-r from-red-600/30 via-rose-500/20 to-transparent'
        }`}
      />

      {/* Animated Floating Spider-Man Hero */}
      <motion.div
        animate={{
          y: [0, -10, 0],
          rotate: [-1.2, 1.2, -1.2],
        }}
        transition={{
          duration: 3.6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        whileHover={{ scale: 1.05, rotate: 0 }}
        whileTap={{ scale: 0.95 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={handleClick}
        className="relative cursor-pointer group flex flex-col items-center"
      >
        {/* Spider-Sense Sparks on Hover / Click */}
        <div className="absolute -top-4 flex gap-3 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity text-sm">
          {violetGlow ? (
            <>
              <span className="text-purple-400 animate-ping">⚡</span>
              <span className="text-fuchsia-400 animate-pulse">💜</span>
              <span className="text-violet-400 animate-ping">⚡</span>
            </>
          ) : (
            <>
              <span className="text-yellow-400 animate-ping">⚡</span>
              <span className="text-red-400 animate-pulse">🕸️</span>
              <span className="text-cyan-400 animate-ping">⚡</span>
            </>
          )}
        </div>

        {/* Standalone Spider-Man Image (Transparent PNG) */}
        <img
          src="/spidey-alone.png"
          alt="Spidey"
          className={`max-h-[min(45vh,350px)] sm:max-h-[min(48vh,390px)] w-auto object-contain transition-all duration-300 ${
            violetGlow
              ? isLight
                ? 'filter drop-shadow-[0_0_22px_rgba(147,51,234,0.7)] drop-shadow-[0_8px_16px_rgba(124,58,237,0.35)] scale-105'
                : 'filter drop-shadow-[0_0_28px_rgba(168,85,247,0.95)] drop-shadow-[0_12px_24px_rgba(147,51,234,0.6)] scale-105'
              : isLight
                ? 'filter drop-shadow-[0_10px_22px_rgba(226,54,54,0.45)] drop-shadow-[0_4px_10px_rgba(0,180,216,0.35)] group-hover:drop-shadow-[0_14px_28px_rgba(250,204,21,0.65)]'
                : 'filter drop-shadow-[0_12px_28px_rgba(226,54,54,0.65)] drop-shadow-[0_6px_14px_rgba(0,210,255,0.45)] group-hover:drop-shadow-[0_16px_36px_rgba(250,204,21,0.75)]'
          }`}
          onError={(e) => {
            e.currentTarget.src = './spidey-alone.png';
          }}
        />

        {/* Interactive Badge */}
        <div
          className={`mt-2 px-3.5 py-1 border rounded-full text-white text-[11px] font-mono font-black tracking-wider uppercase whitespace-nowrap transition-all duration-300 ${
            violetGlow
              ? 'bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 border-purple-300 shadow-[0_0_16px_rgba(147,51,234,0.6)]'
              : 'bg-gradient-to-r from-red-600 via-rose-600 to-red-700 border-yellow-400 shadow-spider-red'
          }`}
        >
          {violetGlow ? 'RESPONSIBILITY EDUCATES' : 'READY FOR THE WHEEL!'}
        </div>
      </motion.div>

      {/* Comic Hero Typography */}
      <div className="mt-2 text-center">
        <h1
          className={`comic-font text-4xl sm:text-5xl tracking-wider uppercase leading-none transition-colors duration-300 ${
            violetGlow
              ? isLight
                ? 'text-purple-700 drop-shadow-[0_2px_8px_rgba(147,51,234,0.35)]'
                : 'text-purple-400 spidey-glow-violet'
              : isLight
                ? 'text-red-600 drop-shadow-[0_2px_8px_rgba(226,54,54,0.35)]'
                : 'text-red-500 spidey-glow-red'
          }`}
        >
          SPIDEY
        </h1>
        <p
          className={`text-xs sm:text-sm font-mono mt-0.5 font-bold transition-colors duration-300 ${
            violetGlow
              ? isLight
                ? 'text-purple-900'
                : 'text-purple-200'
              : isLight
                ? 'text-slate-700'
                : 'text-cyan-300'
          }`}
        >
          {violetGlow
            ? 'Responsibility Educates • Code with Purpose'
            : 'Spin the wheel • Solve the challenge'}
        </p>
      </div>
    </div>
  );
}
