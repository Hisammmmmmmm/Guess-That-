import React from 'react';
import { Flame } from 'lucide-react';

interface CircularCountdownProps {
  timeLeft: number;
  totalTime: number;
  primaryColor?: string;
  isPaused?: boolean;
  size?: number;
}

export const CircularCountdown: React.FC<CircularCountdownProps> = ({
  timeLeft,
  totalTime,
  primaryColor = '#9333ea',
  isPaused = false,
  size = 56,
}) => {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(1, timeLeft / totalTime));
  const strokeDashoffset = circumference - progress * circumference;

  // Determine timer color state
  const isCritical = timeLeft <= 3;
  const isWarning = timeLeft <= 6 && timeLeft > 3;

  let strokeColor = primaryColor;
  let glowClass = 'drop-shadow-[0_0_8px_rgba(147,51,234,0.6)]';

  if (isCritical) {
    strokeColor = '#ef4444'; // Red
    glowClass = 'drop-shadow-[0_0_12px_rgba(239,68,68,0.9)] animate-pulse';
  } else if (isWarning) {
    strokeColor = '#f59e0b'; // Amber
    glowClass = 'drop-shadow-[0_0_10px_rgba(245,158,11,0.8)]';
  }

  const formattedNum = Math.ceil(timeLeft).toString().padStart(2, '0');

  return (
    <div
      className="relative flex items-center justify-center select-none shrink-0"
      id="circular-timer-container"
      style={{ width: size, height: size }}
    >
      {/* Outer Glow Halo when Critical */}
      {isCritical && (
        <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping pointer-events-none" />
      )}

      <svg
        className="transform -rotate-90 w-full h-full"
        viewBox="0 0 96 96"
      >
        {/* Background Track */}
        <circle
          cx="48"
          cy="48"
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          className="text-white/10"
        />

        {/* Animated Progress Stroke */}
        <circle
          cx="48"
          cy="48"
          r={radius}
          stroke={strokeColor}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={`transition-all duration-300 ease-linear ${glowClass}`}
          fill="transparent"
        />
      </svg>

      {/* Center Digital Display */}
      <div className="absolute flex flex-col items-center justify-center pointer-events-none">
        <span
          className={`font-black font-mono-tech leading-none transition-colors duration-200 ${
            size >= 70 ? 'text-2xl' : size >= 50 ? 'text-lg' : 'text-sm'
          } ${
            isCritical
              ? 'text-red-500 animate-pulse'
              : isWarning
              ? 'text-amber-400'
              : 'text-white'
          }`}
        >
          {formattedNum}
        </span>
        {size >= 65 && (
          <span
            className={`text-[7px] uppercase font-bold tracking-wider mt-0.5 ${
              isCritical ? 'text-red-400' : isWarning ? 'text-amber-400/80' : 'text-purple-300/80'
            }`}
          >
            {isCritical ? 'Vite !' : 'Sec'}
          </span>
        )}
      </div>
    </div>
  );
};

