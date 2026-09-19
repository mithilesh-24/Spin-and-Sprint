import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { sound } from '../utils/audio';

export default function SpideyMascot() {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    sound.playButtonClick();
  };

  return (
    <div className="relative flex flex-col items-center justify-center select-none py-1">
      {/* Spider-Sense Atmospheric Glow Behind Character */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-64 bg-gradient-to-tr from-red-600/35 via-rose-500/20 to-cyan-500/25 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Animated Floating Spider-Man Hero */}
      <motion.div
        animate={{
          y: [0, -8, 0],
          rotate: [-1.2, 1.2, -1.2],
        }}
        transition={{
          duration: 3.6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        whileHover={{ scale: 1.05, rotate: 0 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={handleClick}
        className="relative cursor-pointer group flex flex-col items-center"
      >
        {/* Spider-Sense Sparks on Hover */}
        <div className="absolute -top-3 flex gap-3 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
          <span className="text-yellow-400 text-xs animate-ping">⚡</span>
          <span className="text-red-400 text-xs animate-pulse">🕸️</span>
          <span className="text-cyan-400 text-xs animate-ping">⚡</span>
        </div>

        {/* Standalone Spider-Man Image (Transparent PNG) */}
        <img
          src="/spidey-alone.png"
          alt="Spidey"
          className="max-h-[min(34vh,240px)] w-auto object-contain filter drop-shadow-[0_8px_18px_rgba(226,54,54,0.6)] drop-shadow-[0_4px_10px_rgba(0,210,255,0.4)] transition-all duration-300 group-hover:drop-shadow-[0_12px_24px_rgba(250,204,21,0.6)]"
          onError={(e) => {
            e.currentTarget.src = './spidey-alone.png';
          }}
        />

        {/* Interactive Badge */}
        <div className="mt-1.5 px-3 py-0.5 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 border border-yellow-400 rounded-full text-white text-[10px] font-mono font-black tracking-wider uppercase shadow-spider-red whitespace-nowrap">
          🕸️ Ready for the Wheel!
        </div>
      </motion.div>

      {/* Comic Hero Typography */}
      <div className="mt-2 text-center">
        <h1 className="comic-font text-3xl sm:text-4xl text-red-500 tracking-wider spidey-glow-red uppercase leading-none">
          SPIDEY
        </h1>
        <p className="text-[11px] text-cyan-300 font-mono mt-0.5">
          Spin the wheel &bull; Solve the challenge
        </p>
      </div>
    </div>
  );
}
