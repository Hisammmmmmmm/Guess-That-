import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, ArrowRight, Lightbulb, Zap, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Question } from '../types';

import { t } from '../i18n/translations';

interface QuestionCardProps {
  language?: string;
  question: Question;
  selectedOption: string | null;
  isAnswered: boolean;
  onSelectOption: (option: string) => void;
  onNextQuestion: () => void;
  isLastQuestion: boolean;
  scoreEarned: number;
  primaryColor?: string;
  onHoverSound?: () => void;
  gameStyle?: string;
  autoAdvanceCountdown?: number | null;
  isHost?: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  language = 'fr',
  question,
  selectedOption,
  isAnswered,
  onSelectOption,
  onNextQuestion,
  isLastQuestion,
  scoreEarned,
  primaryColor = '#9333ea',
  onHoverSound,
  gameStyle = 'competitive',
  autoAdvanceCountdown,
  isHost = true,
}) => {
  const [focusedIndex, setFocusedIndex] = useState<number>(0);

  // Reset keyboard focus to first choice whenever question changes
  useEffect(() => {
    setFocusedIndex(0);
  }, [question.id, question.question]);

  // Listen for keyboard navigation: Arrows, Enter, Space, A/B/C/D, 1/2/3/4
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (gameStyle === 'slideshow') {
        if (e.key.startsWith('Arrow')) e.preventDefault();
        return;
      }

      if (e.key.startsWith('Arrow')) {
        e.preventDefault();
      }

      // After question is answered: Enter or Space advances to next question
      if (isAnswered || selectedOption) {
        if (isHost && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onNextQuestion();
        }
        return;
      }

      const key = e.key.toLowerCase();

      // Direct selection via ABCD or 1234
      let directIndex = -1;
      if (key === '1' || key === 'a') directIndex = 0;
      else if (key === '2' || key === 'b') directIndex = 1;
      else if (key === '3' || key === 'c') directIndex = 2;
      else if (key === '4' || key === 'd') directIndex = 3;

      if (directIndex >= 0 && directIndex < question.options.length) {
        e.preventDefault();
        setFocusedIndex(directIndex);
        onSelectOption(question.options[directIndex]);
        return;
      }

      // Directional arrow navigation
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        onHoverSound?.();
        setFocusedIndex((prev) => {
          if (prev === 0) return 1;
          if (prev === 1) return 0;
          if (prev === 2) return 3;
          if (prev === 3) return 2;
          return 0;
        });
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        onHoverSound?.();
        setFocusedIndex((prev) => {
          if (prev === 1) return 0;
          if (prev === 0) return 1;
          if (prev === 3) return 2;
          if (prev === 2) return 3;
          return 0;
        });
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        onHoverSound?.();
        setFocusedIndex((prev) => {
          if (prev === 0) return 2;
          if (prev === 1) return 3;
          if (prev === 2) return 0;
          if (prev === 3) return 1;
          return 0;
        });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        onHoverSound?.();
        setFocusedIndex((prev) => {
          if (prev === 2) return 0;
          if (prev === 3) return 1;
          if (prev === 0) return 2;
          if (prev === 1) return 3;
          return 0;
        });
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < question.options.length) {
          onSelectOption(question.options[focusedIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isAnswered,
    selectedOption,
    question.options,
    focusedIndex,
    onSelectOption,
    onNextQuestion,
    isHost,
    gameStyle,
    onHoverSound,
  ]);

  const optionLetters = ['A', 'B', 'C', 'D'];
  const isLocked = isAnswered || Boolean(selectedOption);

  return (
    <div className="flex flex-col gap-1.5 sm:gap-2.5 w-full min-h-0 shrink-0" id="question-card-container">
      {/* 4 Choices Grid with Immersive Glass Buttons - 4 rows on mobile portrait, 2x2 Responsive Grid on sm/desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2.5 w-full transition-all duration-300" id="options-grid">
        {question.options.map((option, idx) => {
          const letter = optionLetters[idx] || `${idx + 1}`;
          const isSelected = selectedOption === option;
          const isCorrect = option === question.correctAnswer;
          const isKeyboardFocused = !isLocked && focusedIndex === idx && gameStyle !== 'slideshow';

          let btnClasses = gameStyle === 'slideshow' 
            ? 'border-white/15 bg-white/5 text-white shadow-sm backdrop-blur-md pointer-events-none'
            : isKeyboardFocused
            ? 'border-2 border-purple-400 bg-purple-500/25 text-white shadow-[0_0_20px_rgba(168,85,247,0.5)] ring-2 ring-purple-400/50 scale-[1.01]'
            : 'border-white/15 bg-white/5 hover:bg-white/10 hover:border-purple-400/50 text-white shadow-sm backdrop-blur-md';
          let radioCircle = gameStyle === 'slideshow'
            ? 'border-white/30 text-white/70'
            : isKeyboardFocused
            ? 'border-purple-300 bg-purple-500 text-white font-black shadow-sm'
            : 'border-white/30 text-white/70 group-hover:border-purple-400 group-hover:text-purple-300';

          if (!isAnswered && isSelected) {
            btnClasses = 'border-2 border-purple-400 bg-purple-600/70 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)] ring-2 ring-purple-300/40 pointer-events-none';
            radioCircle = 'border-purple-200 bg-purple-500 text-white font-black';
          } else if (!isAnswered && isLocked && !isSelected) {
            btnClasses = 'opacity-30 border-white/10 bg-white/5 text-white/40 pointer-events-none';
            radioCircle = 'border-white/15 text-white/20';
          } else if (isAnswered) {
            if (isCorrect) {
              btnClasses =
                'border-2 border-emerald-400 bg-emerald-600/80 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)] pointer-events-none';
              radioCircle = 'border-emerald-300 bg-emerald-400 text-slate-950 font-black';
            } else if (isSelected && !isCorrect) {
              btnClasses =
                'border-2 border-red-400 bg-red-600/80 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)] pointer-events-none';
              radioCircle = 'border-red-300 bg-red-400 text-white font-black';
            } else {
              btnClasses = 'opacity-30 border-white/10 bg-white/5 text-white/40 pointer-events-none';
              radioCircle = 'border-white/15 text-white/20';
            }
          }

          return (
            <button
              key={idx}
              id={`option-btn-${idx}`}
              onClick={() => !isLocked && gameStyle !== 'slideshow' && onSelectOption(option)}
              onMouseEnter={() => {
                if (!isLocked) {
                  setFocusedIndex(idx);
                  onHoverSound?.();
                }
              }}
              disabled={isLocked || gameStyle === 'slideshow'}
              className={`group relative min-h-[34px] sm:min-h-[44px] border rounded-xl sm:rounded-2xl px-2.5 sm:px-4 py-1 sm:py-2 flex items-center justify-between transition-all duration-150 text-left ${btnClasses} ${
                !isLocked && gameStyle !== 'slideshow' ? 'cursor-pointer active:scale-[0.98] transform hover:scale-[1.005]' : ''
              }`}
            >
              <div className="flex items-center gap-1.5 sm:gap-2.5 pr-1 min-w-0 flex-1">
                <span
                  className={`${isLocked ? 'w-4 h-4 sm:w-5 sm:h-5 text-[9px] sm:text-[10px]' : 'w-4 h-4 sm:w-5 sm:h-5 text-[10px] sm:text-xs'} rounded-lg sm:rounded-xl flex items-center justify-center font-mono font-black border transition-colors shrink-0 ${radioCircle}`}
                >
                  {letter}
                </span>
                <span className={`font-bold tracking-tight text-[11px] sm:text-xs md:text-sm text-white group-hover:text-purple-200 transition-colors truncate`}>
                  {option}
                </span>
              </div>

              {/* Status Indicator / Enter Key Hint */}
              <div className="shrink-0 flex items-center gap-1">
                {isKeyboardFocused && !isLocked && (
                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono text-purple-200 bg-purple-900/60 px-2 py-0.5 rounded-md border border-purple-400/40">
                    ↵
                  </span>
                )}
                {isAnswered && isCorrect && (
                  <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-300 animate-bounce" />
                )}
                {isAnswered && isSelected && !isCorrect && (
                  <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-200" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Keyboard Shortcuts Helper Bar during Question */}
      {gameStyle !== 'slideshow' && !isAnswered && !selectedOption && (
        <div className="hidden sm:flex items-center justify-center gap-3 text-[10px] font-medium text-white/50 bg-black/30 backdrop-blur-md py-1 px-3 rounded-full border border-white/10 w-fit mx-auto">
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.2 rounded bg-white/10 text-white font-mono font-bold">A</kbd>
            <kbd className="px-1.5 py-0.2 rounded bg-white/10 text-white font-mono font-bold">B</kbd>
            <kbd className="px-1.5 py-0.2 rounded bg-white/10 text-white font-mono font-bold">C</kbd>
            <kbd className="px-1.5 py-0.2 rounded bg-white/10 text-white font-mono font-bold">D</kbd>
            <span className="ml-0.5">Répondre</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.2 rounded bg-white/10 text-white font-mono font-bold">← ↑ ↓ →</kbd>
            <span className="ml-0.5">Viser</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.2 rounded bg-emerald-600/40 text-emerald-300 font-mono font-bold border border-emerald-500/30">Entrée ↵</kbd>
            <span className="ml-0.5">Valider</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.2 rounded bg-pink-600/40 text-pink-300 font-mono font-bold border border-pink-500/30">O</kbd>
            <span className="ml-0.5">Options</span>
          </span>
        </div>
      )}

      {/* Answer Explanation & Next Question Drawer */}
      <AnimatePresence>
        {isAnswered && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border border-white/15 bg-white/5 backdrop-blur-2xl shadow-lg shrink-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 sm:gap-3"
          >
            <div className="flex items-start gap-3 min-w-0 flex-1">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0 mt-0.5 shadow-sm">
                <Lightbulb className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                    {t('fun_fact', language)}
                  </span>
                  {scoreEarned > 0 && (
                    <span className="text-[11px] font-bold px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-0.5">
                      <Zap className="w-3 h-3 fill-current" /> +{scoreEarned} pts
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-200 mt-0.5 leading-relaxed line-clamp-2 sm:line-clamp-3">
                  {question.trivia}
                </p>
              </div>
            </div>

            {gameStyle !== 'slideshow' && (
              !isHost ? (
                <div
                  id="guest-countdown-badge"
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-purple-950/60 border border-purple-400/40 text-purple-200 text-xs font-bold flex items-center justify-center gap-2 shrink-0 backdrop-blur-md shadow-inner"
                >
                  <Clock className="w-3.5 h-3.5 text-purple-300 animate-pulse shrink-0" />
                  <span>
                    {isLastQuestion ? t('results_in', language) : t('next_question_in', language)}{' '}
                    <strong className="text-white text-sm font-black font-heading ml-1">
                      {autoAdvanceCountdown !== null && autoAdvanceCountdown !== undefined && autoAdvanceCountdown > 0
                        ? `${autoAdvanceCountdown}s`
                        : '...'}
                    </strong>
                    <span className="text-[10px] text-purple-300/70 ml-1.5 font-medium">({t('host_in_control', language)})</span>
                  </span>
                </div>
              ) : (
                <button
                  onClick={onNextQuestion}
                  id="btn-next-question"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider text-white shadow-md transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                  style={{
                    backgroundColor: primaryColor,
                    boxShadow: `0 0 20px ${primaryColor}70`,
                  }}
                >
                  <span>
                    {isLastQuestion
                      ? autoAdvanceCountdown !== null && autoAdvanceCountdown !== undefined && autoAdvanceCountdown > 0
                        ? t('results_countdown', language).replace('%s', autoAdvanceCountdown.toString())
                        : t('results_enter', language)
                      : autoAdvanceCountdown !== null && autoAdvanceCountdown !== undefined && autoAdvanceCountdown > 0
                      ? t('next_countdown', language).replace('%s', autoAdvanceCountdown.toString())
                      : t('next_enter', language)}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

