import React from 'react';

export type XboxButtonType =
  | 'A'
  | 'B'
  | 'X'
  | 'Y'
  | 'LB'
  | 'RB'
  | 'LT'
  | 'RT'
  | 'DPAD'
  | 'DPAD_UP'
  | 'DPAD_DOWN'
  | 'DPAD_LEFT'
  | 'DPAD_RIGHT'
  | 'UP'
  | 'DOWN'
  | 'LEFT'
  | 'RIGHT'
  | 'START'
  | 'BACK';

interface XboxBadgeProps {
  button: XboxButtonType;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const XboxBadge: React.FC<XboxBadgeProps> = ({ button, size = 'sm', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 text-[10px]',
    md: 'w-5 h-5 text-xs',
    lg: 'w-6 h-6 text-sm',
  }[size];

  switch (button) {
    case 'A':
      return (
        <span
          className={`inline-flex items-center justify-center font-black rounded-full bg-emerald-500 text-black border border-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.6)] select-none shrink-0 ${sizeClasses} ${className}`}
          title="Touche A (Xbox)"
        >
          A
        </span>
      );
    case 'B':
      return (
        <span
          className={`inline-flex items-center justify-center font-black rounded-full bg-rose-500 text-white border border-rose-300 shadow-[0_0_8px_rgba(244,63,94,0.6)] select-none shrink-0 ${sizeClasses} ${className}`}
          title="Touche B (Xbox)"
        >
          B
        </span>
      );
    case 'X':
      return (
        <span
          className={`inline-flex items-center justify-center font-black rounded-full bg-blue-500 text-white border border-blue-300 shadow-[0_0_8px_rgba(59,130,246,0.6)] select-none shrink-0 ${sizeClasses} ${className}`}
          title="Touche X (Xbox)"
        >
          X
        </span>
      );
    case 'Y':
      return (
        <span
          className={`inline-flex items-center justify-center font-black rounded-full bg-amber-400 text-black border border-amber-200 shadow-[0_0_8px_rgba(251,191,36,0.6)] select-none shrink-0 ${sizeClasses} ${className}`}
          title="Touche Y (Xbox)"
        >
          Y
        </span>
      );
    case 'LB':
    case 'RB':
      return (
        <span
          className={`inline-flex items-center justify-center font-extrabold rounded-md bg-zinc-700 text-zinc-100 border border-zinc-500 shadow-sm select-none px-1 py-0.5 text-[9px] shrink-0 ${className}`}
          title={`Touche ${button} (Xbox)`}
        >
          {button}
        </span>
      );
    case 'START':
      return (
        <span
          className={`inline-flex items-center justify-center font-bold rounded-full bg-zinc-800 text-zinc-300 border border-zinc-600 px-1 text-[9px] select-none shrink-0 ${className}`}
          title="Menu / Start (Xbox)"
        >
          ☰
        </span>
      );
    case 'BACK':
      return (
        <span
          className={`inline-flex items-center justify-center font-bold rounded-full bg-zinc-800 text-zinc-300 border border-zinc-600 px-1 text-[9px] select-none shrink-0 ${className}`}
          title="Affichage / Back (Xbox)"
        >
          ⧉
        </span>
      );
    case 'DPAD':
      return (
        <span
          className={`inline-flex items-center justify-center font-mono rounded bg-zinc-800 text-zinc-200 border border-zinc-600 px-1 text-[9px] select-none shrink-0 ${className}`}
          title="Croix directionnelle (Xbox)"
        >
          ✚
        </span>
      );
    case 'UP':
    case 'DPAD_UP':
      return (
        <span
          className={`inline-flex items-center justify-center font-mono rounded bg-zinc-800 text-zinc-200 border border-zinc-600 px-1 text-[9px] select-none shrink-0 ${className}`}
          title="Haut (Xbox D-Pad)"
        >
          ▲
        </span>
      );
    case 'DOWN':
    case 'DPAD_DOWN':
      return (
        <span
          className={`inline-flex items-center justify-center font-mono rounded bg-zinc-800 text-zinc-200 border border-zinc-600 px-1 text-[9px] select-none shrink-0 ${className}`}
          title="Bas (Xbox D-Pad)"
        >
          ▼
        </span>
      );
    case 'LEFT':
    case 'DPAD_LEFT':
      return (
        <span
          className={`inline-flex items-center justify-center font-mono rounded bg-zinc-800 text-zinc-200 border border-zinc-600 px-1 text-[9px] select-none shrink-0 ${className}`}
          title="Gauche (Xbox D-Pad)"
        >
          ◀
        </span>
      );
    case 'RIGHT':
    case 'DPAD_RIGHT':
      return (
        <span
          className={`inline-flex items-center justify-center font-mono rounded bg-zinc-800 text-zinc-200 border border-zinc-600 px-1 text-[9px] select-none shrink-0 ${className}`}
          title="Droite (Xbox D-Pad)"
        >
          ▶
        </span>
      );
    default:
      return null;
  }
};
