import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, HelpCircle } from 'lucide-react';
import { t } from '../i18n/translations';

interface QuizBannerCardProps {
  title: string;
  category?: string;
  questionIndex: number;
  totalQuestions: number;
  primaryColor?: string;
  accentColor?: string;
  isAnswered?: boolean;
  language?: string;
}

export const QuizBannerCard: React.FC<QuizBannerCardProps> = ({
  title,
  category,
  questionIndex,
  totalQuestions,
  primaryColor = '#9333ea',
  accentColor = '#ec4899',
  isAnswered = false,
  language = 'fr',
}) => {
  return (
    <div
      className="relative w-full h-full flex items-center justify-center overflow-hidden select-none px-3 sm:px-6 py-2"
      id="quiz-banner-card"
    >
      {/* Dynamic Animated Ambient Background Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Glowing aura left/center */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: isAnswered ? [0.3, 0.55, 0.3] : [0.25, 0.4, 0.25],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -left-10 top-1/2 -translate-y-1/2 w-48 sm:w-64 h-48 sm:h-64 rounded-full blur-2xl"
          style={{
            background: `radial-gradient(circle, ${primaryColor} 0%, transparent 70%)`,
          }}
        />

        {/* Glowing aura right */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.3, 0.15],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute -right-10 top-1/2 -translate-y-1/2 w-48 sm:w-64 h-48 sm:h-64 rounded-full blur-2xl"
          style={{
            background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)`,
          }}
        />

        {/* Subtle cyber grid backdrop */}
        <div 
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)`,
            backgroundSize: '16px 16px',
          }}
        />

        {/* Ambient moving beam */}
        <motion.div
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-y-0 w-32 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent skew-x-12"
        />
      </div>

      {/* Main Content Layout: Logo on Left/Center + Quiz Title & Badges */}
      <div className="relative z-10 w-full max-w-2xl flex items-center justify-center sm:justify-start gap-3 sm:gap-5">
        {/* Animated Logo Container */}
        <div className="relative shrink-0 flex items-center justify-center">
          {/* Pulsing neon halo ring behind logo */}
          <motion.div
            animate={{
              scale: [0.95, 1.12, 0.95],
              opacity: [0.4, 0.75, 0.4],
            }}
            transition={{
              repeat: Infinity,
              duration: 3,
              ease: 'easeInOut',
            }}
            className="absolute inset-0 rounded-full blur-xl"
            style={{
              background: `radial-gradient(circle, ${primaryColor} 0%, ${accentColor} 60%, transparent 80%)`,
            }}
          />

          {/* Floating Logo with sheen reflection */}
          <motion.div
            animate={{
              y: [0, -4, 0],
              rotate: [-1, 1, -1],
            }}
            transition={{
              repeat: Infinity,
              duration: 3.6,
              ease: 'easeInOut',
            }}
            className="relative"
          >
            <div className="relative inline-block">
              <img
                src="/logo.png"
                onError={(e) => {
                  // Fallback to logo5.png if logo.png is ever missing
                  const target = e.currentTarget;
                  if (!target.src.includes('logo5.png')) {
                    target.src = '/logo5.png';
                  }
                }}
                alt="GuessThat Logo"
                className="w-14 h-14 xs:w-16 xs:h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain relative z-10 drop-shadow-[0_0_18px_rgba(168,85,247,0.5)] transition-transform duration-300"
              />

              {/* Glossy sheen swipe animation masking the logo */}
              <div
                className="absolute inset-0 z-20 pointer-events-none overflow-hidden"
                style={{
                  maskImage: `url('/logo.png')`,
                  maskSize: 'contain',
                  maskRepeat: 'no-repeat',
                  maskPosition: 'center',
                  WebkitMaskImage: `url('/logo.png')`,
                  WebkitMaskSize: 'contain',
                  WebkitMaskRepeat: 'no-repeat',
                  WebkitMaskPosition: 'center',
                }}
              >
                <motion.div
                  animate={{ x: ['-200%', '250%'] }}
                  transition={{
                    repeat: Infinity,
                    duration: 3,
                    ease: 'easeInOut',
                    repeatDelay: 2,
                  }}
                  className="absolute inset-0 w-[60%] h-full skew-x-12 bg-gradient-to-r from-transparent via-white/80 to-transparent"
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Title, Badge & Theme Details */}
        <div className="flex flex-col min-w-0 text-left justify-center">
          {/* Top Mini Badges */}
          <div className="flex items-center gap-1.5 mb-1 flex-wrap">
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] xs:text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-white shadow-sm border border-white/20"
              style={{
                background: `linear-gradient(135deg, ${primaryColor}99, ${accentColor}99)`,
              }}
            >
              <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-yellow-300 animate-pulse" />
              <span>{t('mode_quiz_title', language) || 'Mode Quiz'}</span>
            </span>

            {category && (
              <span className="hidden xs:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold text-purple-200 bg-black/40 border border-white/10 truncate max-w-[130px] sm:max-w-[180px]">
                <HelpCircle className="w-2.5 h-2.5 text-purple-400 shrink-0" />
                <span className="truncate">{category}</span>
              </span>
            )}

            <span className="text-[9px] sm:text-[10px] font-mono-tech font-bold text-white/50 pl-0.5">
              Q{questionIndex + 1}/{totalQuestions}
            </span>
          </div>

          {/* Quiz Theme Title with Stylized Glow */}
          <h1
            className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl font-black text-white font-heading leading-tight drop-shadow-md line-clamp-2"
            style={{
              textShadow: '0 2px 12px rgba(0,0,0,0.8), 0 0 20px rgba(168,85,247,0.3)',
            }}
          >
            {title || 'Quiz Time'}
          </h1>

          {/* Bottom subtle aesthetic subtitle */}
          <div className="flex items-center gap-2 mt-0.5 sm:mt-1">
            <div className="h-0.5 w-6 sm:w-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-80" />
            <span className="text-[9px] sm:text-[10px] font-medium text-white/60 tracking-wider uppercase truncate">
              Trouve la bonne réponse
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
