import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { sound } from '../utils/audio';

export default function SoundControl() {
  const [muted, setMuted] = useState(sound.isMuted());

  const handleToggle = () => {
    const isNowMuted = sound.toggleMute();
    setMuted(isNowMuted);
    if (!isNowMuted) {
      sound.playButtonClick();
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`fixed bottom-4 right-4 z-40 p-3 rounded-full border-2 transition-all duration-300 shadow-lg backdrop-blur-md flex items-center justify-center ${
        muted
          ? 'bg-gray-900/80 border-gray-600 text-gray-400 hover:border-gray-400'
          : 'bg-red-950/80 border-red-500 text-red-400 hover:text-white hover:border-red-400 shadow-spider-red scale-100 hover:scale-105'
      }`}
      title={muted ? 'Unmute Sound' : 'Mute Sound'}
      aria-label="Toggle Sound"
    >
      {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 animate-pulse" />}
    </button>
  );
}
