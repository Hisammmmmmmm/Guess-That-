import React, { useState } from 'react';
import {
  Clapperboard,
  Gamepad2,
  Sparkles,
  Disc3,
  Tv,
  Globe2,
  Wand2,
  ArrowRight,
  Flame,
  Music2,
  Film,
  Zap,
  HelpCircle,
  Headphones,
  Eye,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Users,
  QrCode,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { QuizTheme, GameMode, GameDifficulty, GameStyle } from '../types';
import { PRESET_THEMES } from '../data/presetThemes';
import { soundEngine } from '../services/soundEngine';

import { t } from '../i18n/translations';

interface ThemeSelectorProps {
  language: string;
  onSelectPreset: (theme: QuizTheme, difficulty: GameDifficulty, gameMode: GameMode, gameStyle: GameStyle) => void;
  onGenerateCustom: (customTopic: string, difficulty: GameDifficulty, gameMode: GameMode, gameStyle: GameStyle) => void;
  selectedMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  selectedStyle: GameStyle;
  onSelectStyle: (style: GameStyle) => void;
  isGenerating: boolean;
  onPlayClickSound?: () => void;
  onPlayHoverSound?: () => void;
  onOpenJoinRoom?: () => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Clapperboard: <Clapperboard className="w-6 h-6" />,
  Gamepad2: <Gamepad2 className="w-6 h-6" />,
  Sparkles: <Sparkles className="w-6 h-6" />,
  Disc3: <Disc3 className="w-6 h-6" />,
  Tv: <Tv className="w-6 h-6" />,
  Globe2: <Globe2 className="w-6 h-6" />,
};

const SUGGESTIONS = [
  '🎬 Blockbusters des années 80 et 90',
  '🧙 Harry Potter & Univers Magique',
  '⚡ Super-Héros Marvel & DC Comics',
  '🎸 Rock Légendaire & Solos Cultes',
  '🍙 Mangas Shonen & Studio Ghibli',
  '🕹️ Jeux de Plateforme & Rétrogaming',
  '🍕 Séries Télévisées Comédies & Sitcoms',
  '🦁 Animaux Sauvages & Faune Insolite',
  '🚀 Astronomie & Conquête Spatiale',
  '🥐 Spécialités Culinaires du Monde',
];

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  language,
  onSelectPreset,
  onGenerateCustom,
  selectedMode,
  onSelectMode,
  selectedStyle,
  onSelectStyle,
  isGenerating,
  onPlayClickSound,
  onPlayHoverSound,
  onOpenJoinRoom,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [customTopic, setCustomTopic] = useState('');
  const [activeHoveredTheme, setActiveHoveredTheme] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<GameDifficulty>('medium');

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTopic.trim() || isGenerating) return;
    onPlayClickSound?.();
    onGenerateCustom(customTopic.trim(), difficulty, selectedMode, selectedStyle);
  };

  const handleSuggestionClick = (sug: string) => {
    onPlayClickSound?.();
    const clean = sug.replace(/^[^\w\s]+/, '').trim();
    setCustomTopic(clean);
    onGenerateCustom(clean, difficulty, selectedMode, selectedStyle);
  };

  const getPresetTitle = (theme: QuizTheme) => {
    const key = `preset_${theme.id}_title`;
    const val = t(key, language);
    return val !== key ? val : theme.title;
  };

  const getPresetTag = (theme: QuizTheme) => {
    const key = `preset_${theme.id}_tag`;
    const val = t(key, language);
    return val !== key ? val : theme.tag;
  };

  const gameModesList: { id: GameMode; title: string; subtitle: string; icon: React.ReactNode; badge: string; color: string }[] = [
    {
      id: 'quiz',
      title: t('mode_quiz_title', language),
      subtitle: t('mode_quiz_desc', language),
      icon: <HelpCircle className="w-6 h-6" />,
      badge: t('badge_balanced', language),
      color: 'from-blue-600 to-indigo-600',
    },
    {
      id: 'music_blind_test',
      title: t('mode_music_title', language),
      subtitle: t('mode_music_desc', language),
      icon: <Headphones className="w-6 h-6" />,
      badge: t('badge_audio', language),
      color: 'from-fuchsia-600 to-pink-600',
    },
    {
      id: 'visual_blind_test',
      title: t('mode_visual_title', language),
      subtitle: t('mode_visual_desc', language),
      icon: <Eye className="w-6 h-6" />,
      badge: t('badge_visual', language),
      color: 'from-amber-500 to-orange-600',
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-4 py-2 px-2 sm:px-4 max-h-[100dvh] overflow-hidden" id="theme-selector-view">
      {/* Logo & Title */}
      <div className="text-center flex flex-col items-center gap-1 mb-2 relative">
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="relative"
        >
          {/* Subtle glow effect behind the logo */}
          <div className="absolute inset-0 bg-purple-500/30 blur-2xl rounded-full scale-75 animate-pulse" />
          <div className="relative inline-block">
            <img 
              src="/logo5.png" 
              alt="GuessThat!" 
              className="w-24 h-24 sm:w-32 sm:h-32 object-contain relative z-10 drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]" 
            />
            <div 
              className="absolute inset-0 z-20 overflow-hidden"
              style={{
                maskImage: `url('/logo5.png')`,
                maskSize: 'contain',
                maskRepeat: 'no-repeat',
                maskPosition: 'center',
                WebkitMaskImage: `url('/logo5.png')`,
                WebkitMaskSize: 'contain',
                WebkitMaskRepeat: 'no-repeat',
                WebkitMaskPosition: 'center',
              }}
            >
              <motion.div
                animate={{ x: ['-200%', '200%'] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut', repeatDelay: 1.5 }}
                className="absolute inset-0 w-[50%] h-full skew-x-12 bg-gradient-to-r from-transparent via-white/80 to-transparent"
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Wizard Container */}
      <div className="w-full bg-white/5 border border-white/10 p-4 sm:p-6 rounded-[32px] backdrop-blur-xl shadow-2xl relative flex flex-col min-h-0 flex-1 overflow-y-auto hide-scrollbar">
        {/* Step indicators */}
        <div className="flex justify-center items-center gap-2 sm:gap-4 mb-4 sm:mb-6 shrink-0">
          {[1, 2, 3, 4].map(s => (
            <React.Fragment key={s}>
              <div 
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-sm sm:text-base transition-all duration-300 ${
                  step === s 
                    ? 'bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)] scale-110' 
                    : step > s 
                      ? 'bg-purple-500/50 text-white/80 cursor-pointer hover:bg-purple-500/70' 
                      : 'bg-white/10 text-white/40'
                }`}
                onClick={() => {
                  if (step > s && !isGenerating) {
                    onPlayClickSound?.();
                    setStep(s as 1|2|3|4);
                  }
                }}
              >
                {step > s ? <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" /> : s}
              </div>
              {s < 4 && (
                <div className={`w-6 sm:w-12 h-1 rounded-full transition-colors duration-300 ${step > s ? 'bg-purple-500/50' : 'bg-white/10'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="flex-1 relative min-h-0">
          <AnimatePresence mode="wait">
            {/* Step 1: Game Mode */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-4"
              >
                <div className="text-center mb-1">
                  <h2 className="text-xl sm:text-2xl font-black text-white font-heading">{t('step1_title', language)}</h2>
                  <p className="text-sm text-white/60 mt-1">{t('step1_desc', language)}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {gameModesList.map((m) => {
                    const isSelected = selectedMode === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => {
                          onPlayClickSound?.();
                          onSelectMode(m.id);
                          setStep(2);
                        }}
                        onMouseEnter={() => onPlayHoverSound?.()}
                        id={`game-mode-btn-${m.id}`}
                        className={`relative p-3 rounded-3xl border text-left transition-all duration-300 cursor-pointer flex flex-col gap-2 backdrop-blur-xl group overflow-hidden ${
                          isSelected
                            ? 'border-purple-400 bg-purple-500/20 shadow-[0_0_30px_rgba(168,85,247,0.35)] ring-2 ring-purple-400/60 scale-[1.02]'
                            : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10 text-white/70 hover:text-white'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/15 via-transparent to-pink-500/10 pointer-events-none" />
                        )}
                        <div className="relative z-10 flex items-center justify-between">
                          <div className={`p-2.5 rounded-2xl border text-white shadow-md transition-transform duration-200 group-hover:scale-110 ${isSelected ? `bg-gradient-to-br ${m.color} border-white/30` : 'bg-white/10 border-white/15'}`}>
                            {m.icon}
                          </div>
                          <span className={`px-2 py-1 rounded-full text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider border ${isSelected ? 'bg-purple-500/30 text-purple-200 border-purple-400/50' : 'bg-white/5 text-white/50 border-white/10'}`}>
                            {m.badge}
                          </span>
                        </div>
                        <div className="relative z-10 flex flex-col gap-1 flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-base sm:text-lg font-black text-white font-heading">{m.title}</h3>
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                          </div>
                          <p className="text-xs text-white/60 leading-relaxed">{m.subtitle}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Option Rapide: Rejoindre un salon existant */}
                <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-purple-900/40 via-indigo-900/40 to-pink-900/40 border border-purple-400/30 backdrop-blur-md shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-purple-500/30 text-purple-200 border border-purple-400/40 shadow-inner shrink-0">
                      <QrCode className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold text-white">{t('already_have_code', language)}</span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-black uppercase">
                          {t('badge_multi', language)}
                        </span>
                      </div>
                      <span className="text-[11px] text-purple-200/70">{t('join_friend_live', language)}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    id="btn-step1-join-room"
                    onClick={() => {
                      onPlayClickSound?.();
                      onOpenJoinRoom?.();
                    }}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 hover:via-pink-500 hover:to-amber-400 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-purple-900/40 cursor-pointer transition-all transform hover:scale-105 active:scale-95 shrink-0"
                  >
                    <Users className="w-4 h-4" />
                    <span>{t('join_room', language)}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Game Style */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-4 items-center"
              >
                <div className="text-center mb-2">
                  <h2 className="text-xl sm:text-2xl font-black text-white font-heading">{t('step2_title', language)}</h2>
                  <p className="text-sm text-white/60 mt-1">{t('how_to_play', language)}</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-3xl">
                  {[
                    {
                      id: 'competitive_solo',
                      label: t('comp_solo', language),
                      desc: t('comp_solo_desc', language),
                      badge: t('badge_solo', language),
                      icon: <Gamepad2 className="w-6 h-6 mb-1 text-purple-400" />
                    },
                    {
                      id: 'competitive_room',
                      label: t('comp_room', language),
                      desc: t('comp_room_desc', language),
                      badge: t('badge_multi', language),
                      icon: <Users className="w-6 h-6 mb-1 text-pink-400" />
                    },
                    {
                      id: 'slideshow',
                      label: t('slideshow', language),
                      desc: t('slideshow_desc', language),
                      badge: t('badge_relaxed', language),
                      icon: <Tv className="w-6 h-6 mb-1 text-blue-400" />
                    },
                  ].map((style) => {
                    const isSelected = selectedStyle === style.id || (style.id === 'competitive_solo' && selectedStyle === 'competitive');
                    return (
                      <button
                        key={style.id}
                        onClick={() => {
                          onPlayClickSound?.();
                          onSelectStyle(style.id as GameStyle);
                          setStep(3);
                        }}
                        onMouseEnter={() => onPlayHoverSound?.()}
                        className={`relative flex flex-col items-center justify-center p-4 rounded-3xl border transition-all duration-300 text-center gap-1.5 cursor-pointer backdrop-blur-md group ${
                          isSelected
                            ? 'bg-purple-600/25 border-purple-500 ring-2 ring-purple-400 shadow-[0_0_25px_rgba(168,85,247,0.35)] text-white scale-[1.02]'
                            : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/25 hover:text-white'
                        }`}
                      >
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border mb-1 ${
                          isSelected ? 'bg-purple-500/30 text-purple-200 border-purple-400/50' : 'bg-white/5 text-white/40 border-white/10'
                        }`}>
                          {style.badge}
                        </span>
                        {style.icon}
                        <span className="font-extrabold text-base sm:text-lg text-white">{style.label}</span>
                        <span className="text-[11px] opacity-70 leading-tight">{style.desc}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Quick Action: Join Room Button */}
                {onOpenJoinRoom && (
                  <div className="pt-2 w-full max-w-md flex justify-center">
                    <button
                      type="button"
                      onClick={() => {
                        onPlayClickSound?.();
                        onOpenJoinRoom();
                      }}
                      className="px-5 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-bold text-white flex items-center gap-2 transition-all cursor-pointer backdrop-blur-md hover:border-pink-500/40"
                    >
                      <QrCode className="w-4 h-4 text-pink-400" />
                      <span>{t('join_existing_room_btn', language)}</span>
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 3: Difficulty */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-4 items-center"
              >
                <div className="text-center mb-2">
                  <h2 className="text-xl sm:text-2xl font-black text-white font-heading">{t('difficulty_level', language)}</h2>
                  <p className="text-sm text-white/60 mt-1">{t('step3_desc_alt', language)}</p>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full max-w-3xl">
                  {[
                    { id: 'easy', label: t('easy', language), desc: t('diff_desc_easy', language) },
                    { id: 'medium', label: t('medium', language), desc: t('diff_desc_medium', language) },
                    { id: 'hard', label: t('hard', language), desc: t('diff_desc_hard', language) },
                    { id: 'expert', label: t('expert', language), desc: t('diff_desc_expert', language) }
                  ].map((lvl) => {
                    const isSelected = difficulty === lvl.id;
                    return (
                      <button
                        key={lvl.id}
                        onClick={() => {
                          onPlayClickSound?.();
                          setDifficulty(lvl.id as GameDifficulty);
                          setStep(4);
                        }}
                        onMouseEnter={() => onPlayHoverSound?.()}
                        className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-300 text-center gap-1 ${
                          isSelected
                            ? 'bg-purple-600/20 border-purple-500 ring-1 ring-purple-500 text-white'
                            : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20 hover:text-white'
                        }`}
                      >
                        <span className="font-bold text-sm sm:text-base">{lvl.label}</span>
                        <span className="text-[10px] sm:text-xs opacity-70 leading-tight">{lvl.desc}</span>
                      </button>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {/* Step 4: Topic */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-4"
              >
                <div className="text-center mb-1">
                  <h2 className="text-xl sm:text-2xl font-black text-white font-heading">{t('step3_title', language)}</h2>
                  <p className="text-sm text-white/60 mt-1">{t('step4_desc', language)}</p>
                </div>

                {/* Custom Theme Generator Box */}
                <div className="bg-black/20 rounded-3xl p-4 border border-white/10">
                  <form onSubmit={handleCustomSubmit} className="flex flex-col sm:flex-row gap-2">
                    <div className="flex-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Wand2 className="w-4 h-4 text-purple-400" />
                      </div>
                      <input
                        type="text"
                        value={customTopic}
                        onChange={(e) => setCustomTopic(e.target.value)}
                        placeholder={t('custom_topic_placeholder', language)}
                        disabled={isGenerating}
                        className="w-full pl-9 pr-4 py-3 rounded-xl bg-black/40 border border-white/15 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm font-medium transition-all shadow-inner"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={!customTopic.trim() || isGenerating}
                      className="px-6 py-3 rounded-xl font-black text-sm uppercase tracking-wider text-white bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition-all duration-200 shadow-[0_0_20px_rgba(168,85,247,0.4)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>{t('generate_action', language)}</span>
                    </button>
                  </form>

                </div>

                {/* Preset Categories Grid */}
                <div className="mt-2">
                  <h3 className="text-sm font-bold text-white mb-1.5 flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-yellow-400" />{t('or_choose_preset', language)}</h3>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-1.5">
                    {PRESET_THEMES.map((theme) => {
                      return (
                        <button
                          key={theme.id}
                          type="button"
                          onClick={() => {
                            if (!isGenerating) {
                              onPlayClickSound?.();
                              onSelectPreset(theme, difficulty, selectedMode, selectedStyle);
                            }
                          }}
                          onMouseEnter={() => {
                            setActiveHoveredTheme(theme.id);
                            onPlayHoverSound?.();
                          }}
                          onMouseLeave={() => setActiveHoveredTheme(null)}
                          disabled={isGenerating}
                          className="group relative rounded-xl p-2 border border-white/10 hover:border-purple-500/50 bg-white/5 hover:bg-white/10 transition-all duration-300 flex items-center gap-2 cursor-pointer overflow-hidden text-left disabled:opacity-50"
                        >
                          <div
                            className="p-1.5 rounded-lg border text-white transition-transform duration-200 group-hover:scale-110 shrink-0"
                            style={{
                              backgroundColor: `${theme.primaryColor}25`,
                              borderColor: `${theme.primaryColor}50`,
                              color: theme.primaryColor,
                            }}
                          >
                            {ICON_MAP[theme.icon] || <Sparkles className="w-3.5 h-3.5" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-[11px] font-bold text-white group-hover:text-purple-200 transition-colors truncate">
                              {getPresetTitle(theme)}
                            </h4>
                            <p className="text-[9px] text-white/50 truncate">
                              {getPresetTag(theme)}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
