import React from 'react';
import { Flame, Trophy, Zap, Target } from 'lucide-react';

import { t } from '../i18n/translations';

interface ScoreBoardProps {
  language?: string;
  currentIndex: number;
  totalQuestions: number;
  score: number;
  streak: number;
  correctCount: number;
  primaryColor?: string;
  gameMode?: string;
  themeTitle?: string;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  language = 'fr',
  currentIndex,
  totalQuestions,
  score,
  streak,
  correctCount,
  primaryColor = '#9333ea',
  gameMode,
  themeTitle,
}) => {
  const progressPct = ((currentIndex + 1) / totalQuestions) * 100;
  const formattedQuestionNum = (currentIndex + 1).toString().padStart(2, '0');
  const formattedTotal = totalQuestions.toString().padStart(2, '0');

  let streakBadge = null;
  if (streak >= 2) {
    let multiplier = 'x1.5';
    let fireColor = 'text-amber-400';
    if (streak >= 5) {
      multiplier = 'x3.0 ULTRA !';
      fireColor = 'text-red-500 animate-bounce';
    } else if (streak >= 3) {
      multiplier = 'x2.0 COMBO';
      fireColor = 'text-orange-400';
    }

    streakBadge = (
      <div className="bg-white/5 border border-white/10 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-2 shadow-lg animate-pulse">
        <Flame className={`w-4 h-4 fill-current ${fireColor}`} />
        <div className="flex flex-col">
          <span className="text-[9px] uppercase tracking-widest text-orange-400 font-bold">{t('streak_label', language)}</span>
          <span className="text-xs font-black text-white">{streak} ({multiplier})</span>
        </div>
      </div>
    );
  }

  
    return (
    <div className="fixed top-16 left-0 right-0 z-40 w-full" id="hud-scoreboard">
      {/* Thin Sleek Progress Bar with Ambient Glow */}
      <div className="w-full bg-white/10 h-1.5 overflow-hidden backdrop-blur-sm">
        <div
          className="h-full transition-all duration-500 ease-out shadow-[0_0_15px_rgba(147,51,234,0.8)]"
          style={{
            width: `${progressPct}%`,
            backgroundColor: primaryColor || '#ef4444', // Default to red to match 'ligne rouge'
          }}
        />
      </div>
    </div>
  );

};

