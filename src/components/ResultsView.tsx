import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  RotateCcw,
  Sparkles,
  Flame,
  CheckCircle2,
  XCircle,
  Share2,
  ArrowRight,
  Clock,
  Award,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GameStats, QuizData, GameStyle } from '../types';
import { soundEngine } from '../services/soundEngine';

import { t } from '../i18n/translations';

interface ResultsViewProps {
  language?: string;
  stats: GameStats;
  quizData: QuizData;
  onReplay: () => void;
  onNewTheme: () => void;
  onPlayClickSound?: () => void;
  gameStyle?: GameStyle;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  language = 'fr',
  stats,
  quizData,
  onReplay,
  onNewTheme,
  onPlayClickSound,
  gameStyle = 'competitive',
}) => {
  const [copied, setCopied] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const total = stats.totalQuestions || 15;
  const correct = stats.correctAnswers;
  const accuracyPct = Math.round((correct / total) * 100);

  // Determine Rank
  let rank = 'B';
  let rankTitle = t('well_played', language);
  let rankColor = 'from-amber-400 to-orange-500';
  let rankBadgeBg = 'bg-amber-500/20 text-amber-300 border-amber-500/40';

  if (accuracyPct >= 90) {
    rank = 'S';
    rankTitle = t('rank_s_title', language);
    rankColor = 'from-yellow-300 via-amber-400 to-pink-500';
    rankBadgeBg = 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50';
  } else if (accuracyPct >= 75) {
    rank = 'A';
    rankTitle = t('rank_a_title', language);
    rankColor = 'from-emerald-400 to-teal-500';
    rankBadgeBg = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
  } else if (accuracyPct >= 50) {
    rank = 'B';
    rankTitle = t('rank_b_title', language);
    rankColor = 'from-blue-400 to-indigo-500';
    rankBadgeBg = 'bg-blue-500/20 text-blue-300 border-blue-500/40';
  } else {
    rank = 'C';
    rankTitle = t('rank_c_title', language);
    rankColor = 'from-purple-400 to-slate-400';
    rankBadgeBg = 'bg-purple-500/20 text-purple-300 border-purple-500/40';
  }

  // Trigger celebration on load
  useEffect(() => {
    soundEngine.playFanfare();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, []);

  const handleShare = () => {
    onPlayClickSound?.();
    const text = t('share_result_text', language)
      .replace('%s', rank)
      .replace('%s', quizData.themeTitle || quizData.topic)
      .replace('%s', stats.score.toLocaleString())
      .replace('%s', correct.toString())
      .replace('%s', total.toString());
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const toggleExpand = (idx: number) => {
    onPlayClickSound?.();
    setExpandedIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-4 sm:gap-8 py-2 sm:py-4 px-2 sm:px-4" id="results-view">
      {/* Top Banner Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative rounded-2xl sm:rounded-[36px] p-4 xs:p-5 sm:p-8 bg-white/5 border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl text-center flex flex-col items-center gap-4 sm:gap-6 overflow-hidden"
      >
        {/* Glow Halo */}
        <div
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full opacity-25 filter blur-3xl"
          style={{ backgroundColor: quizData.primaryColor || '#9333ea' }}
        />

        {gameStyle === 'slideshow' ? (
          <>
            <div>
              <span className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-extrabold uppercase tracking-wider border ${rankBadgeBg}`}>
                {t('end_of_slideshow', language)}
              </span>
              <h2 className="text-xl sm:text-4xl font-extrabold text-white font-heading mt-2 sm:mt-4">
                {t('thank_you_attention', language)}
              </h2>
              <p className="text-xs sm:text-sm text-white/60 mt-1 sm:mt-3 max-w-md mx-auto">
                {t('presentation_ended', language).replace('%s', quizData.themeTitle || quizData.topic)}
              </p>
            </div>
          </>
        ) : (
          <>
            {/* Rank Circle Emblem */}
            <div className="relative">
              <div
                className={`w-20 h-20 sm:w-32 sm:h-32 rounded-2xl sm:rounded-3xl bg-gradient-to-br ${rankColor} p-0.5 sm:p-1 shadow-2xl flex items-center justify-center transform rotate-3 hover:rotate-0 transition-transform`}
              >
                <div className="w-full h-full bg-[#0F0A1F] rounded-[14px] sm:rounded-[22px] flex flex-col items-center justify-center">
                  <span className={`text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br ${rankColor} font-heading`}>
                    {rank}
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest text-white/50 -mt-0.5 sm:-mt-1">
                    {t('rank_label', language)}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <span className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-extrabold uppercase tracking-wider border ${rankBadgeBg}`}>
                {rankTitle}
              </span>
              <h2 className="text-xl sm:text-4xl font-extrabold text-white font-heading mt-2 sm:mt-3">
                {t('final_score', language)} <span className="text-yellow-400">{stats.score.toLocaleString()} pts</span>
              </h2>
              <p className="text-[11px] sm:text-sm text-white/60 mt-0.5 sm:mt-1">
                Blind Test : {quizData.themeTitle}
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 w-full max-w-2xl mt-0.5 sm:mt-1">
              <div className="p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center backdrop-blur-md shadow-md">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 mb-0.5 sm:mb-1" />
                <span className="text-base sm:text-xl font-black text-white">{correct} / {total}</span>
                <span className="text-[10px] sm:text-[11px] text-white/60 font-semibold">{t('correct_answers', language)}</span>
              </div>

              <div className="p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center backdrop-blur-md shadow-md">
                <Award className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 mb-0.5 sm:mb-1" />
                <span className="text-base sm:text-xl font-black text-white">{accuracyPct}%</span>
                <span className="text-[10px] sm:text-[11px] text-white/60 font-semibold">{t('overall_accuracy', language)}</span>
              </div>

              <div className="p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center backdrop-blur-md shadow-md">
                <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400 mb-0.5 sm:mb-1" />
                <span className="text-base sm:text-xl font-black text-white">{stats.maxStreak} max</span>
                <span className="text-[10px] sm:text-[11px] text-white/60 font-semibold">{t('max_streak', language)}</span>
              </div>

              <div className="p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center backdrop-blur-md shadow-md">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-pink-400 mb-0.5 sm:mb-1" />
                <span className="text-base sm:text-xl font-black text-white">
                  {Math.round(stats.totalTimeSpent / Math.max(1, stats.answers.length))}s
                </span>
                <span className="text-[10px] sm:text-[11px] text-white/60 font-semibold">{t('avg_time_per_q', language)}</span>
              </div>
            </div>
          </>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 w-full max-w-md pt-1 sm:pt-2">
          <button
            onClick={() => {
              onPlayClickSound?.();
              onReplay();
            }}
            id="btn-replay-quiz"
            className="flex-1 min-w-[120px] px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition-all flex items-center justify-center gap-1.5 sm:gap-2 shadow-[0_0_30px_rgba(168,85,247,0.5)] cursor-pointer transform active:scale-95 hover:scale-[1.02]"
          >
            <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>{t('replay', language)}</span>
          </button>

          <button
            onClick={() => {
              onPlayClickSound?.();
              onNewTheme();
            }}
            id="btn-new-theme"
            className="flex-1 min-w-[120px] px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider text-white/90 hover:text-white bg-white/5 hover:bg-white/10 border border-white/15 transition-all flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer transform active:scale-95 hover:scale-[1.02] backdrop-blur-md"
          >
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400" />
            <span>{t('other_theme', language)}</span>
          </button>

          {gameStyle !== 'slideshow' && (
            <button
              onClick={handleShare}
              id="btn-share-score"
              className="w-full sm:w-auto px-4 sm:px-5 py-2 sm:py-3 rounded-xl sm:rounded-2xl font-bold text-xs text-white/80 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer backdrop-blur-md"
            >
              <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400" />
              <span>{copied ? t('score_copied', language) : t('share_result', language)}</span>
            </button>
          )}
        </div>
      </motion.div>

      {/* Review of all 15 Questions */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-2xl font-extrabold text-white font-heading">
            {t('recap_questions_trivia', language)}
          </h3>
          <span className="text-xs font-semibold text-white/50">{t('click_to_view_details', language)}</span>
        </div>

        <div className="flex flex-col gap-2.5">
          {quizData.questions.map((q, idx) => {
            const playerAnswer = stats.answers.find((a) => a.questionIndex === idx);
            const isCorrect = playerAnswer?.isCorrect ?? false;
            const isExpanded = expandedIndex === idx;

            return (
              <div
                key={q.id || idx}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden backdrop-blur-md ${
                  isCorrect
                    ? 'border-emerald-500/40 bg-emerald-950/30'
                    : 'border-red-500/40 bg-red-950/30'
                }`}
              >
                <button
                  onClick={() => toggleExpand(idx)}
                  className="w-full p-4 flex items-center justify-between text-left gap-3 cursor-pointer hover:bg-white/5"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-black border ${
                        isCorrect
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-red-500/20 text-red-300 border-red-500/40'
                      }`}
                    >
                      {idx + 1}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-white truncate">
                        {q.question}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5 text-xs">
                        <span className="text-white/50">{t('answer', language)}</span>
                        <span className="font-bold text-emerald-400">{q.correctAnswer}</span>
                        {!isCorrect && playerAnswer?.selectedOption && (
                          <span className="text-red-400 line-through text-[11px] truncate">
                            ({t('your_choice', language)} {playerAnswer.selectedOption})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                    )}
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-white/50" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-white/50" />
                    )}
                  </div>
                </button>

                {/* Expanded Details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-4 bg-black/40 border-t border-white/10 flex flex-col sm:flex-row gap-4 items-start"
                    >
                      {/* Image Preview */}
                      <img
                        src={q.imageUrl}
                        alt={q.imagePrompt}
                        referrerPolicy="no-referrer"
                        className="w-full sm:w-36 h-24 object-cover rounded-xl border border-white/15 shrink-0"
                      />

                      <div className="flex flex-col gap-2">
                        <div>
                          <span className="text-[11px] font-bold text-yellow-400 uppercase tracking-wider">
                            {t('clue_label', language)}
                          </span>
                          <p className="text-xs text-white/80 mt-0.5">{q.clue}</p>
                        </div>

                        <div>
                          <span className="text-[11px] font-bold text-purple-300 uppercase tracking-wider">
                            {t('fun_fact', language)}
                          </span>
                          <p className="text-xs text-white/80 mt-0.5 leading-relaxed">
                            {q.trivia}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
