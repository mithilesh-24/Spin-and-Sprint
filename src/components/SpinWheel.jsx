import React from 'react';
import { QUESTIONS_DATA } from '../data/questions';

export default function SpinWheel({
  rotation,
  isSpinning,
  usedQuestionIds = [],
  activeHighlightIndex = null,
  questions = QUESTIONS_DATA,
}) {
  const total = questions.length || 20; // 20
  const anglePerSegment = 360 / total; // 18 deg
  const radius = 240;
  const center = 250;

  // Segment colors matching Spider-Man comic palette
  const segmentColors = [
    { bg: '#b91c1c', text: '#ffffff' }, // Marvel Crimson
    { bg: '#0b1528', text: '#38bdf8' }, // Dark Navy
    { bg: '#dc2626', text: '#ffffff' }, // Bright Red
    { bg: '#111e38', text: '#facc15' }, // Deep Blue / Gold text
    { bg: '#991b1b', text: '#ffffff' }, // Deep Crimson
    { bg: '#0f172a', text: '#38bdf8' }, // Midnight
    { bg: '#e11d48', text: '#ffffff' }, // Rose Red
    { bg: '#1e293b', text: '#facc15' }, // Slate Navy
  ];

  // SVG slice path generator
  const createSlicePath = (index) => {
    const startAngle = (index * anglePerSegment - 90) * (Math.PI / 180);
    const endAngle = ((index + 1) * anglePerSegment - 90) * (Math.PI / 180);

    const x1 = center + radius * Math.cos(startAngle);
    const y1 = center + radius * Math.sin(startAngle);
    const x2 = center + radius * Math.cos(endAngle);
    const y2 = center + radius * Math.sin(endAngle);

    return `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`;
  };

  return (
    <div className="relative flex items-center justify-center select-none w-full h-full max-h-[min(48vh,365px)] max-w-[min(100%,365px)] aspect-square mx-auto my-auto p-1">
      {/* Outer Web Glow Ring */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-red-600/35 via-cyan-500/20 to-red-600/35 blur-xl animate-pulse pointer-events-none" />

      {/* Outer Comic Bezel Frame */}
      <div className="relative w-full h-full p-2 rounded-full bg-gradient-to-b from-red-700 via-zinc-900 to-black border-[3.5px] border-red-500/90 shadow-[0_0_25px_rgba(226,54,54,0.5)] flex items-center justify-center">
        {/* Fixed Top Pointer (Spider Fang / Arrow) */}
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center pointer-events-none">
          <div className="w-6 h-8 filter drop-shadow-[0_4px_8px_rgba(226,54,54,0.9)] animate-bounce">
            <svg viewBox="0 0 40 50" className="w-full h-full fill-yellow-400 stroke-black" strokeWidth="2">
              <polygon points="20,50 5,5 35,5" fill="#facc15" />
              <polygon points="20,40 10,12 30,12" fill="#e23636" />
              <circle cx="20" cy="18" r="4" fill="#ffffff" />
            </svg>
          </div>
        </div>

        {/* The Rotating Wheel */}
        <div
          className="w-full h-full rounded-full overflow-hidden relative shadow-inner aspect-square"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning
              ? 'transform 5.5s cubic-bezier(0.15, 0.9, 0.2, 1)'
              : 'none',
          }}
        >
          <svg
            viewBox="0 0 500 500"
            className="w-full h-full transform transition-transform"
          >
            <defs>
              <radialGradient id="spiderCenterGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#e23636" />
                <stop offset="70%" stopColor="#990000" />
                <stop offset="100%" stopColor="#050811" />
              </radialGradient>
            </defs>

            {/* Slices */}
            {questions.map((q, idx) => {
              const colorConfig = segmentColors[idx % segmentColors.length];
              const isUsed = usedQuestionIds.includes(q.id);
              const isHighlighted = activeHighlightIndex === idx;

              const midAngle = idx * anglePerSegment + anglePerSegment / 2;
              const textAngle = midAngle - 90;
              const textRadius = radius * 0.72;
              const tx = center + textRadius * Math.cos((textAngle * Math.PI) / 180);
              const ty = center + textRadius * Math.sin((textAngle * Math.PI) / 180);

              let fillColor = colorConfig.bg;
              if (isHighlighted) fillColor = '#eab308'; // Golden highlight when chosen
              if (isUsed) fillColor = '#1e2029'; // Dimmed for used items

              return (
                <g key={q.id}>
                  {/* Slice Wedge */}
                  <path
                    d={createSlicePath(idx)}
                    fill={fillColor}
                    stroke="#000000"
                    strokeWidth="2"
                    className="transition-colors duration-300"
                  />

                  {/* Spiderweb Web Arc Overlay in slice */}
                  <path
                    d={`M ${center + radius * 0.4 * Math.cos(((idx * anglePerSegment - 90) * Math.PI) / 180)} ${center + radius * 0.4 * Math.sin(((idx * anglePerSegment - 90) * Math.PI) / 180)} A ${radius * 0.4} ${radius * 0.4} 0 0 1 ${center + radius * 0.4 * Math.cos((((idx + 1) * anglePerSegment - 90) * Math.PI) / 180)} ${center + radius * 0.4 * Math.sin((((idx + 1) * anglePerSegment - 90) * Math.PI) / 180)}`}
                    fill="none"
                    stroke="rgba(255,255,255,0.15)"
                    strokeWidth="1"
                  />
                  <path
                    d={`M ${center + radius * 0.7 * Math.cos(((idx * anglePerSegment - 90) * Math.PI) / 180)} ${center + radius * 0.7 * Math.sin(((idx * anglePerSegment - 90) * Math.PI) / 180)} A ${radius * 0.7} ${radius * 0.7} 0 0 1 ${center + radius * 0.7 * Math.cos((((idx + 1) * anglePerSegment - 90) * Math.PI) / 180)} ${center + radius * 0.7 * Math.sin((((idx + 1) * anglePerSegment - 90) * Math.PI) / 180)}`}
                    fill="none"
                    stroke="rgba(255,255,255,0.15)"
                    strokeWidth="1"
                  />

                  {/* Label (Q1, Q2, ..., Q20 or Q25) */}
                  <text
                    x={tx}
                    y={ty}
                    fill={isHighlighted ? '#000000' : isUsed ? '#6b7280' : colorConfig.text}
                    fontSize={total > 20 ? "13.5" : "16.5"}
                    fontWeight="900"
                    fontFamily="Outfit, Impact, sans-serif"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${midAngle}, ${tx}, ${ty})`}
                    className="select-none pointer-events-none"
                    style={{
                      filter: isHighlighted ? 'drop-shadow(0 0 3px #fff)' : 'drop-shadow(1px 1px 2px #000)',
                    }}
                  >
                    {q.number}
                  </text>
                </g>
              );
            })}

            {/* Concentric Web Rings */}
            <circle cx={center} cy={center} r={radius} fill="none" stroke="#E23636" strokeWidth="3" />
            <circle cx={center} cy={center} r={radius * 0.7} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
            <circle cx={center} cy={center} r={radius * 0.4} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />

            {/* Central Spidey Hub */}
            <circle cx={center} cy={center} r="42" fill="url(#spiderCenterGlow)" stroke="#facc15" strokeWidth="2.5" />
            <circle cx={center} cy={center} r="34" fill="#0c1222" stroke="#E23636" strokeWidth="1.5" />

            {/* Spider Logo in the center */}
            <g transform={`translate(${center - 24}, ${center - 24}) scale(1)`}>
              {/* Spider Body */}
              <ellipse cx="24" cy="24" rx="7" ry="10" fill="#E23636" />
              <circle cx="24" cy="15" r="5" fill="#E23636" />
              {/* Spider Eyes */}
              <path d="M21,13 Q24,15 23,17 Q20,16 21,13 Z" fill="#ffffff" />
              <path d="M27,13 Q24,15 25,17 Q28,16 27,13 Z" fill="#ffffff" />
              {/* Spider Legs */}
              <path d="M18,19 Q10,12 8,6 M18,22 Q8,20 6,18 M18,25 Q8,28 6,34 M18,28 Q10,38 12,42" fill="none" stroke="#E23636" strokeWidth="2" strokeLinecap="round" />
              <path d="M30,19 Q38,12 40,6 M30,22 Q40,20 42,18 M30,25 Q40,28 42,34 M30,28 Q38,38 36,42" fill="none" stroke="#E23636" strokeWidth="2" strokeLinecap="round" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
