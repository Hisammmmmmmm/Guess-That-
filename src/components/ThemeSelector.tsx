import React, { useState, useEffect, useRef } from 'react';
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
  Lock,
  BookOpen,
  Keyboard,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { QuizTheme, GameMode, GameDifficulty, GameStyle } from '../types';
import { PRESET_THEMES } from '../data/presetThemes';
import { soundEngine } from '../services/soundEngine';
import { useGamepad } from '../hooks/useGamepad';
import { XboxBadge } from './XboxBadge';

import { t } from '../i18n/translations';

interface ThemeSelectorProps {
  language: string;
  onSelectPreset: (theme: QuizTheme, difficulty: GameDifficulty, gameMode: GameMode, gameStyle: GameStyle, isPublic?: boolean) => void;
  onGenerateCustom: (customTopic: string, difficulty: GameDifficulty, gameMode: GameMode, gameStyle: GameStyle, isPublic?: boolean) => void;
  selectedMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  selectedStyle: GameStyle;
  onSelectStyle: (style: GameStyle, isPublic?: boolean) => void;
  isGenerating: boolean;
  isPublicRoom?: boolean;
  onPlayClickSound?: () => void;
  onPlayHoverSound?: () => void;
  onOpenJoinRoom?: () => void;
  onOpenPublicRooms?: () => void;
  onOpenLibrary?: () => void;
  libraryCount?: number;
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
  onOpenPublicRooms,
  onOpenLibrary,
  libraryCount = 0,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [customTopic, setCustomTopic] = useState('');
  const [activeHoveredTheme, setActiveHoveredTheme] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<GameDifficulty>('medium');
  const [isPublicRoom, setIsPublicRoom] = useState<boolean>(true);

  // Keyboard navigation indexes and zones for each step
  const [focusedModeIndex, setFocusedModeIndex] = useState<number>(() => {
    if (selectedMode === 'music_blind_test') return 1;
    if (selectedMode === 'visual_blind_test') return 2;
    return 0;
  });

  const [step1Zone, setStep1Zone] = useState<'modes' | 'actions'>('modes');
  const [step1ActionIndex, setStep1ActionIndex] = useState<number>(0); // 0: Library, 1: Public Rooms, 2: Join Room

  const [focusedStyleIndex, setFocusedStyleIndex] = useState<number>(() => {
    if (selectedStyle === 'competitive_room') return 1;
    if (selectedStyle === 'slideshow') return 2;
    return 0;
  });
  const [step2Zone, setStep2Zone] = useState<'styles' | 'privacy' | 'actions'>('styles');
  const [step2ActionIndex, setStep2ActionIndex] = useState<number>(0); // 0: Public Rooms, 1: Join Room

  const [focusedDiffIndex, setFocusedDiffIndex] = useState<number>(1); // 'medium'
  
  // Step 4 zones: 'input' (topic input) vs 'presets' (presets grid)
  const [step4Zone, setStep4Zone] = useState<'input' | 'presets'>('presets');
  const [focusedPresetIndex, setFocusedPresetIndex] = useState<number>(0);
  const customTopicInputRef = useRef<HTMLInputElement>(null);

  const gamepadState = useGamepad();

  // Keep DOM input focus synchronized when step4Zone changes
  useEffect(() => {
    if (step === 4 && step4Zone === 'input') {
      customTopicInputRef.current?.focus();
    }
  }, [step, step4Zone]);

  const difficultiesList: { id: GameDifficulty; label: string; desc: string }[] = [
    { id: 'easy', label: t('easy', language), desc: t('diff_desc_easy', language) },
    { id: 'medium', label: t('medium', language), desc: t('diff_desc_medium', language) },
    { id: 'hard', label: t('hard', language), desc: t('diff_desc_hard', language) },
    { id: 'expert', label: t('expert', language), desc: t('diff_desc_expert', language) },
  ];

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTopic.trim() || isGenerating) return;
    onPlayClickSound?.();
    onGenerateCustom(customTopic.trim(), difficulty, selectedMode, selectedStyle, isPublicRoom);
  };

  const handleSuggestionClick = (sug: string) => {
    onPlayClickSound?.();
    const clean = sug.replace(/^[^\w\s]+/, '').trim();
    setCustomTopic(clean);
    onGenerateCustom(clean, difficulty, selectedMode, selectedStyle, isPublicRoom);
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

  const gameStylesList: {
    id: GameStyle;
    label: string;
    desc: string;
    badge: string;
    icon: React.ReactNode;
    isRoom?: boolean;
  }[] = [
    {
      id: 'competitive_solo',
      label: t('comp_solo', language),
      desc: t('comp_solo_desc', language),
      badge: t('badge_solo', language),
      icon: <Gamepad2 className="w-4 h-4 sm:w-6 sm:h-6 mb-0.5 sm:mb-1 text-purple-400" />,
    },
    {
      id: 'competitive_room',
      label: t('comp_room', language),
      desc: t('comp_room_desc', language),
      badge: isPublicRoom ? `🌐 ${t('room_public_label', language)}` : `🔒 ${t('room_private_label', language)}`,
      icon: <Users className="w-4 h-4 sm:w-6 sm:h-6 mb-0.5 sm:mb-1 text-pink-400" />,
      isRoom: true,
    },
    {
      id: 'slideshow',
      label: t('slideshow', language),
      desc: t('slideshow_desc', language),
      badge: t('badge_relaxed', language),
      icon: <Tv className="w-4 h-4 sm:w-6 sm:h-6 mb-0.5 sm:mb-1 text-blue-400" />,
    },
  ];

  // Global menu keyboard & gamepad navigation
  useEffect(() => {
    const handleMenuKeyDown = (e: KeyboardEvent) => {
      const isTyping = e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement;

      // When typing in custom topic input, let user navigate down or escape to exit typing
      if (isTyping) {
        if (e.key === 'Escape' || e.key === 'ArrowDown') {
          e.preventDefault();
          customTopicInputRef.current?.blur();
          setStep4Zone('presets');
          setFocusedPresetIndex(0);
          onPlayHoverSound?.();
          return;
        }
        if (e.key === 'Enter') {
          // Normal form submit handled by onSubmit
          return;
        }
        return;
      }

      // Prevent scrolling on all Arrow keys and Page keys
      if (
        e.key === 'ArrowUp' ||
        e.key === 'ArrowDown' ||
        e.key === 'ArrowLeft' ||
        e.key === 'ArrowRight' ||
        e.key === 'PageUp' ||
        e.key === 'PageDown'
      ) {
        e.preventDefault();
      }

      if (isGenerating) return;

      const keyLower = e.key.toLowerCase();

      // Quick Shortcuts across all steps
      // X key (or Xbox X): In Step 2 toggles Public/Private, in Step 4 focuses custom topic input
      if (keyLower === 'x') {
        if (step === 2) {
          e.preventDefault();
          onPlayClickSound?.();
          setIsPublicRoom(prev => !prev);
          return;
        }
        if (step === 4) {
          e.preventDefault();
          setStep4Zone('input');
          customTopicInputRef.current?.focus();
          onPlayHoverSound?.();
          return;
        }
      }

      // Y key (or Xbox Y): Opens Public Rooms modal if available
      if (keyLower === 'y' && onOpenPublicRooms) {
        e.preventDefault();
        onPlayClickSound?.();
        onOpenPublicRooms();
        return;
      }

      // ================= STEP 1: Game Modes & Bottom Actions =================
      if (step === 1) {
        if (step1Zone === 'modes') {
          if (e.key === 'ArrowLeft') {
            e.preventDefault();
            onPlayHoverSound?.();
            const nextIdx = focusedModeIndex > 0 ? focusedModeIndex - 1 : 2;
            setFocusedModeIndex(nextIdx);
            onSelectMode(gameModesList[nextIdx].id);
          } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            onPlayHoverSound?.();
            const nextIdx = focusedModeIndex < 2 ? focusedModeIndex + 1 : 0;
            setFocusedModeIndex(nextIdx);
            onSelectMode(gameModesList[nextIdx].id);
          } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            onPlayHoverSound?.();
            setStep1Zone('actions');
            setStep1ActionIndex(0);
          } else if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onPlayClickSound?.();
            onSelectMode(gameModesList[focusedModeIndex].id);
            setStep(2);
          }
        } else if (step1Zone === 'actions') {
          const maxActions = 2;
          if (e.key === 'ArrowLeft') {
            e.preventDefault();
            onPlayHoverSound?.();
            setStep1ActionIndex(prev => (prev > 0 ? prev - 1 : maxActions - 1));
          } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            onPlayHoverSound?.();
            setStep1ActionIndex(prev => (prev < maxActions - 1 ? prev + 1 : 0));
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            onPlayHoverSound?.();
            setStep1Zone('modes');
          } else if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onPlayClickSound?.();
            if (step1ActionIndex === 0 && onOpenPublicRooms) onOpenPublicRooms();
            else if (step1ActionIndex === 1 && onOpenJoinRoom) onOpenJoinRoom();
          }
        }
        return;
      }

      // ================= STEP 2: Game Style, Privacy Switcher & Bottom Actions =================
      if (step === 2) {
        if (step2Zone === 'styles') {
          if (e.key === 'ArrowLeft') {
            e.preventDefault();
            onPlayHoverSound?.();
            const nextIdx = focusedStyleIndex > 0 ? focusedStyleIndex - 1 : 2;
            setFocusedStyleIndex(nextIdx);
            onSelectStyle(gameStylesList[nextIdx].id, isPublicRoom);
          } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            onPlayHoverSound?.();
            const nextIdx = focusedStyleIndex < 2 ? focusedStyleIndex + 1 : 0;
            setFocusedStyleIndex(nextIdx);
            onSelectStyle(gameStylesList[nextIdx].id, isPublicRoom);
          } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            onPlayHoverSound?.();
            if (focusedStyleIndex === 1) {
              setStep2Zone('privacy');
            } else {
              setStep2Zone('actions');
              setStep2ActionIndex(0);
            }
          } else if (e.key === 'p' || e.key === 'P' || e.key === ' ') {
            if (focusedStyleIndex === 1) {
              e.preventDefault();
              onPlayClickSound?.();
              setIsPublicRoom(prev => !prev);
            }
          } else if (e.key === 'Enter') {
            e.preventDefault();
            onPlayClickSound?.();
            onSelectStyle(gameStylesList[focusedStyleIndex].id, isPublicRoom);
            setStep(3);
          } else if (e.key === 'Backspace' || e.key === 'Escape') {
            e.preventDefault();
            onPlayClickSound?.();
            setStep(1);
          }
        } else if (step2Zone === 'privacy') {
          if (e.key === 'ArrowLeft') {
            e.preventDefault();
            onPlayHoverSound?.();
            setIsPublicRoom(false);
          } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            onPlayHoverSound?.();
            setIsPublicRoom(true);
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            onPlayHoverSound?.();
            setStep2Zone('styles');
          } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            onPlayHoverSound?.();
            setStep2Zone('actions');
            setStep2ActionIndex(0);
          } else if (e.key === 'Enter') {
            e.preventDefault();
            onPlayClickSound?.();
            onSelectStyle('competitive_room', isPublicRoom);
            setStep(3);
          } else if (e.key === 'Backspace' || e.key === 'Escape') {
            e.preventDefault();
            setStep2Zone('styles');
          }
        } else if (step2Zone === 'actions') {
          if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            e.preventDefault();
            onPlayHoverSound?.();
            setStep2ActionIndex(prev => (prev === 0 ? 1 : 0));
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            onPlayHoverSound?.();
            setStep2Zone('styles');
          } else if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onPlayClickSound?.();
            if (step2ActionIndex === 0 && onOpenPublicRooms) onOpenPublicRooms();
            else if (step2ActionIndex === 1 && onOpenJoinRoom) onOpenJoinRoom();
          } else if (e.key === 'Backspace' || e.key === 'Escape') {
            e.preventDefault();
            setStep2Zone('styles');
          }
        }
        return;
      }

      // ================= STEP 3: Difficulty =================
      if (step === 3) {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          onPlayHoverSound?.();
          const nextIdx = focusedDiffIndex > 0 ? focusedDiffIndex - 1 : 3;
          setFocusedDiffIndex(nextIdx);
          setDifficulty(difficultiesList[nextIdx].id);
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          onPlayHoverSound?.();
          const nextIdx = focusedDiffIndex < 3 ? focusedDiffIndex + 1 : 0;
          setFocusedDiffIndex(nextIdx);
          setDifficulty(difficultiesList[nextIdx].id);
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
          e.preventDefault();
          onPlayHoverSound?.();
          const nextIdx = (focusedDiffIndex + 2) % 4;
          setFocusedDiffIndex(nextIdx);
          setDifficulty(difficultiesList[nextIdx].id);
        } else if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onPlayClickSound?.();
          setDifficulty(difficultiesList[focusedDiffIndex].id);
          setStep(4);
        } else if (e.key === 'Backspace' || e.key === 'Escape') {
          e.preventDefault();
          onPlayClickSound?.();
          setStep(2);
        }
        return;
      }

      // ================= STEP 4: Custom Topic Input & Presets Grid =================
      if (step === 4) {
        if (step4Zone === 'input') {
          if (e.key === 'ArrowDown' || e.key === 'Tab') {
            e.preventDefault();
            setStep4Zone('presets');
            customTopicInputRef.current?.blur();
            onPlayHoverSound?.();
          } else if (e.key === 'Enter') {
            e.preventDefault();
            if (customTopic.trim()) {
              onPlayClickSound?.();
              onGenerateCustom(customTopic.trim(), difficulty, selectedMode, selectedStyle, isPublicRoom);
            }
          } else if (e.key === 'Backspace' && !customTopic) {
            e.preventDefault();
            onPlayClickSound?.();
            setStep(3);
          }
        } else if (step4Zone === 'presets') {
          const totalPresets = PRESET_THEMES.length;
          if (e.key === 'ArrowLeft') {
            e.preventDefault();
            onPlayHoverSound?.();
            setFocusedPresetIndex(prev => (prev > 0 ? prev - 1 : totalPresets - 1));
          } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            onPlayHoverSound?.();
            setFocusedPresetIndex(prev => (prev < totalPresets - 1 ? prev + 1 : 0));
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            onPlayHoverSound?.();
            if (focusedPresetIndex < 3) {
              // Jump up to Custom Topic Input box!
              setStep4Zone('input');
              customTopicInputRef.current?.focus();
            } else {
              setFocusedPresetIndex(prev => prev - 3);
            }
          } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            onPlayHoverSound?.();
            setFocusedPresetIndex(prev => (prev + 3 < totalPresets ? prev + 3 : prev));
          } else if (e.key === 'Tab') {
            e.preventDefault();
            setStep4Zone('input');
            customTopicInputRef.current?.focus();
          } else if (e.key === 'Enter') {
            e.preventDefault();
            if (PRESET_THEMES[focusedPresetIndex]) {
              onPlayClickSound?.();
              onSelectPreset(PRESET_THEMES[focusedPresetIndex], difficulty, selectedMode, selectedStyle, isPublicRoom);
            }
          } else if (e.key === 'Backspace' || e.key === 'Escape') {
            e.preventDefault();
            onPlayClickSound?.();
            setStep(3);
          }
        }
        return;
      }
    };

    window.addEventListener('keydown', handleMenuKeyDown);
    return () => window.removeEventListener('keydown', handleMenuKeyDown);
  }, [
    step,
    step1Zone,
    step1ActionIndex,
    step2Zone,
    step2ActionIndex,
    step4Zone,
    focusedModeIndex,
    focusedStyleIndex,
    focusedDiffIndex,
    focusedPresetIndex,
    selectedMode,
    selectedStyle,
    difficulty,
    isPublicRoom,
    isGenerating,
    customTopic,
    onSelectMode,
    onSelectStyle,
    onSelectPreset,
    onGenerateCustom,
    onOpenLibrary,
    onOpenPublicRooms,
    onOpenJoinRoom,
    onPlayClickSound,
    onPlayHoverSound,
    language,
    difficultiesList,
    gameModesList,
    gameStylesList,
  ]);

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-1.5 sm:gap-4 py-0 sm:py-2 px-1 sm:px-4 max-h-full sm:max-h-[100dvh]" id="theme-selector-view">
      {/* Logo & Title - Compact on mobile portrait */}
      <div className="text-center flex flex-col items-center gap-0.5 mb-0.5 sm:mb-2 relative shrink-0">
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="relative"
        >
          {/* Subtle glow effect behind the logo */}
          <div className="absolute inset-0 bg-purple-500/30 blur-xl rounded-full scale-75 animate-pulse" />
          <div className="relative inline-block">
            <img 
              src="/logo5.png" 
              alt="GuessThat!" 
              className="w-14 h-14 xs:w-16 xs:h-16 sm:w-28 sm:h-28 object-contain relative z-10 drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]" 
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
      <div className="w-full bg-white/5 border border-white/10 p-2.5 xs:p-3.5 sm:p-6 rounded-2xl sm:rounded-[32px] backdrop-blur-xl shadow-2xl relative flex flex-col min-h-0 flex-1 overflow-y-auto hide-scrollbar">
        {/* Step indicators */}
        <div className="flex justify-center items-center gap-1.5 sm:gap-4 mb-2 sm:mb-6 shrink-0">
          {[1, 2, 3, 4].map(s => (
            <React.Fragment key={s}>
              <div 
                className={`w-6 h-6 xs:w-7 xs:h-7 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-base transition-all duration-300 ${
                  step === s 
                    ? 'bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)] scale-105 sm:scale-110' 
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
                {step > s ? <CheckCircle2 className="w-3.5 h-3.5 sm:w-5 sm:h-5" /> : s}
              </div>
              {s < 4 && (
                <div className={`w-4 xs:w-6 sm:w-12 h-0.5 sm:h-1 rounded-full transition-colors duration-300 ${step > s ? 'bg-purple-500/50' : 'bg-white/10'}`} />
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
                className="flex flex-col gap-2 sm:gap-4"
              >
                <div className="text-center mb-0.5 sm:mb-1">
                  <h2 className="text-sm xs:text-base sm:text-2xl font-black text-white font-heading">{t('step1_title', language)}</h2>
                  <p className="text-[11px] sm:text-sm text-white/60 mt-0.5 hidden xs:block">{t('step1_desc', language)}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-1.5 sm:gap-3">
                  {gameModesList.map((m, idx) => {
                    const isSelected = selectedMode === m.id;
                    const isFocused = step1Zone === 'modes' && focusedModeIndex === idx;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => {
                          onPlayClickSound?.();
                          setStep1Zone('modes');
                          setFocusedModeIndex(idx);
                          onSelectMode(m.id);
                          setStep(2);
                        }}
                        onMouseEnter={() => {
                          setStep1Zone('modes');
                          setFocusedModeIndex(idx);
                          onPlayHoverSound?.();
                        }}
                        id={`game-mode-btn-${m.id}`}
                        className={`relative p-2 sm:p-3 rounded-xl sm:rounded-3xl border text-left transition-all duration-300 cursor-pointer flex flex-row md:flex-col items-center md:items-start gap-2 backdrop-blur-xl group overflow-hidden ${
                          isSelected || isFocused
                            ? 'border-purple-400 bg-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.35)] ring-2 ring-purple-400/80 scale-[1.01] sm:scale-[1.02]'
                            : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10 text-white/70 hover:text-white'
                        }`}
                      >
                        {(isSelected || isFocused) && (
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/15 via-transparent to-pink-500/10 pointer-events-none" />
                        )}
                        <div className={`p-1.5 sm:p-2.5 rounded-xl sm:rounded-2xl border text-white shadow-md transition-transform duration-200 group-hover:scale-105 shrink-0 ${isSelected || isFocused ? `bg-gradient-to-br ${m.color} border-white/30` : 'bg-white/10 border-white/15'}`}>
                          {React.cloneElement(m.icon as React.ReactElement<any>, { className: 'w-4 h-4 sm:w-6 sm:h-6' })}
                        </div>
                        <div className="relative z-10 flex flex-col gap-0.5 flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <h3 className="text-xs xs:text-sm sm:text-lg font-black text-white font-heading truncate">{m.title}</h3>
                              {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                            </div>
                            <span className={`px-1.5 py-0.5 rounded-full text-[8px] sm:text-[10px] font-extrabold uppercase tracking-wider border shrink-0 ${isSelected || isFocused ? 'bg-purple-500/30 text-purple-200 border-purple-400/50' : 'bg-white/5 text-white/50 border-white/10'}`}>
                              {m.badge}
                            </span>
                          </div>
                          <p className="text-[10px] sm:text-xs text-white/60 leading-tight truncate md:whitespace-normal">{m.subtitle}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Option Rapide: Salons Publics & Rejoindre avec code */}
                <div className={`pt-1.5 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-2 p-2 sm:p-3.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-purple-900/40 via-indigo-900/40 to-pink-900/40 border backdrop-blur-md shadow-lg transition-all ${
                  step1Zone === 'actions' ? 'border-purple-400/80 ring-1 ring-purple-400/50' : 'border-purple-400/30'
                }`}>
                  <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto">
                    <div className="p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl bg-purple-500/30 text-purple-200 border border-purple-400/40 shadow-inner shrink-0">
                      <Globe2 className="w-4 h-4 sm:w-5 sm:h-5 text-pink-400" />
                    </div>
                    <div className="flex flex-col text-left min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] sm:text-sm font-bold text-white truncate">{t('public_rooms', language)} & {t('join_room', language)}</span>
                        <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[8px] sm:text-[9px] font-black uppercase shrink-0">
                          {t('badge_multi', language)}
                        </span>
                      </div>
                      <span className="text-[9px] sm:text-[11px] text-purple-200/70 truncate">{t('public_rooms_desc', language)}</span>
                    </div>
                  </div>

                  <div className="flex flex-row items-center gap-1.5 sm:gap-2 w-full md:w-auto shrink-0">
                    {onOpenPublicRooms && (
                      <button
                        type="button"
                        id="btn-step1-public-rooms"
                        onClick={() => {
                          onPlayClickSound?.();
                          setStep1Zone('actions');
                          setStep1ActionIndex(0);
                          onOpenPublicRooms();
                        }}
                        onMouseEnter={() => {
                          setStep1Zone('actions');
                          setStep1ActionIndex(0);
                        }}
                        className={`flex-1 sm:flex-none px-2.5 sm:px-4 py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white font-black text-[10px] sm:text-xs uppercase tracking-wider flex items-center justify-center gap-1 sm:gap-1.5 shadow-lg shadow-purple-900/40 cursor-pointer transition-all transform whitespace-nowrap border ${
                          step1Zone === 'actions' && step1ActionIndex === 0
                            ? 'border-pink-300 ring-2 ring-pink-400 scale-105 shadow-[0_0_20px_rgba(236,72,153,0.6)]'
                            : 'border-transparent hover:scale-105 active:scale-95'
                        }`}
                      >
                        <Globe2 className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{t('browse_public_rooms', language)}</span>
                      </button>
                    )}

                    {onOpenJoinRoom && (
                      <button
                        type="button"
                        id="btn-step1-join-room"
                        onClick={() => {
                          onPlayClickSound?.();
                          setStep1Zone('actions');
                          setStep1ActionIndex(1);
                          onOpenJoinRoom();
                        }}
                        onMouseEnter={() => {
                          setStep1Zone('actions');
                          setStep1ActionIndex(1);
                        }}
                        className={`flex-1 sm:flex-none px-2.5 sm:px-3.5 py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl border font-bold text-[10px] sm:text-xs flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer transition-all whitespace-nowrap ${
                          step1Zone === 'actions' && step1ActionIndex === 1
                            ? 'bg-white/25 border-pink-400 text-white ring-2 ring-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.5)] scale-105'
                            : 'bg-white/10 hover:bg-white/20 border-white/20 text-white hover:border-purple-400/50'
                        }`}
                      >
                        <QrCode className="w-3.5 h-3.5 text-purple-300 shrink-0" />
                        <span className="sm:hidden">Salon avec code</span>
                        <span className="hidden sm:inline truncate">{t('enter_code_btn', language)}</span>
                      </button>
                    )}
                  </div>
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
                className="flex flex-col gap-2 sm:gap-4 items-center"
              >
                <div className="text-center mb-0.5 sm:mb-2">
                  <h2 className="text-sm xs:text-base sm:text-2xl font-black text-white font-heading">{t('step2_title', language)}</h2>
                  <p className="text-[11px] sm:text-sm text-white/60 mt-0.5 hidden xs:block">{t('how_to_play', language)}</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 sm:gap-3 w-full max-w-3xl">
                  {gameStylesList.map((style, idx) => {
                    const isSelected = selectedStyle === style.id || (style.id === 'competitive_solo' && selectedStyle === 'competitive');
                    const isFocused = (step2Zone === 'styles' || (step2Zone === 'privacy' && style.isRoom)) && focusedStyleIndex === idx;
                    return (
                      <div
                        key={style.id}
                        onClick={() => {
                          onPlayClickSound?.();
                          setStep2Zone('styles');
                          setFocusedStyleIndex(idx);
                          onSelectStyle(style.id as GameStyle, isPublicRoom);
                          setStep(3);
                        }}
                        onMouseEnter={() => {
                          setStep2Zone('styles');
                          setFocusedStyleIndex(idx);
                          onPlayHoverSound?.();
                        }}
                        className={`relative flex flex-col items-center justify-between p-2 sm:p-4 rounded-xl sm:rounded-3xl border transition-all duration-300 text-center gap-1 sm:gap-2 cursor-pointer backdrop-blur-md group ${
                          isSelected || isFocused
                            ? 'bg-purple-600/25 border-purple-500 ring-2 ring-purple-400/80 shadow-[0_0_20px_rgba(168,85,247,0.35)] text-white scale-[1.01] sm:scale-[1.02]'
                            : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/25 hover:text-white'
                        }`}
                      >
                        <div className="flex flex-col items-center w-full gap-0.5 sm:gap-1">
                          <span className={`px-2 py-0.5 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-wider border mb-0.5 sm:mb-1 ${
                            isSelected || isFocused ? 'bg-purple-500/30 text-purple-200 border-purple-400/50' : 'bg-white/5 text-white/40 border-white/10'
                          }`}>
                            {style.badge}
                          </span>
                          {style.icon}
                          <span className="font-extrabold text-xs xs:text-sm sm:text-lg text-white">{style.label}</span>
                          <span className="text-[9px] sm:text-[11px] opacity-70 leading-tight line-clamp-1 sm:line-clamp-none">{style.desc}</span>
                        </div>

                        {/* If competitive room, provide inline Privé / Public switcher with keyboard navigation */}
                        {style.isRoom && (
                          <div
                            className={`mt-0.5 sm:mt-1 flex flex-col items-center gap-1 p-0.5 sm:p-1 rounded-xl sm:rounded-2xl border w-full transition-all ${
                              step2Zone === 'privacy'
                                ? 'bg-black/60 border-purple-400 ring-2 ring-purple-400/80 shadow-lg'
                                : 'bg-black/40 border-white/10'
                            }`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex items-center justify-center gap-1 w-full">
                              <button
                                type="button"
                                id="btn-style-room-private"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onPlayClickSound?.();
                                  setIsPublicRoom(false);
                                  onSelectStyle('competitive_room', false);
                                  setStep(3);
                                }}
                                className={`flex-1 py-1 px-1.5 sm:py-1.5 sm:px-2 rounded-lg sm:rounded-xl text-[9px] sm:text-[11px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1 cursor-pointer ${
                                  !isPublicRoom
                                    ? 'bg-purple-600 text-white shadow-md ring-1 ring-purple-400'
                                    : 'text-white/60 hover:text-white hover:bg-white/10'
                                }`}
                              >
                                <Lock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-pink-300" />
                                <span>{t('room_private_label', language)}</span>
                              </button>
                              <button
                                type="button"
                                id="btn-style-room-public"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onPlayClickSound?.();
                                  setIsPublicRoom(true);
                                  onSelectStyle('competitive_room', true);
                                  setStep(3);
                                }}
                                className={`flex-1 py-1 px-1.5 sm:py-1.5 sm:px-2 rounded-lg sm:rounded-xl text-[9px] sm:text-[11px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1 cursor-pointer ${
                                  isPublicRoom
                                    ? 'bg-emerald-600 text-white shadow-md ring-1 ring-emerald-400'
                                    : 'text-white/60 hover:text-white hover:bg-white/10'
                                }`}
                              >
                                <Globe2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-300" />
                                <span>{t('room_public_label', language)}</span>
                              </button>
                            </div>
                            <span className="text-[8px] text-white/40 hidden sm:inline">
                              Touche [P] ou [X] pour basculer
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Quick Action: Public Rooms & Join Room Buttons on the exact same row */}
                <div className="pt-1 sm:pt-2 w-full max-w-2xl flex flex-row items-center justify-center gap-2 sm:gap-3">
                  {onOpenPublicRooms && (
                    <button
                      type="button"
                      id="btn-step2-public-rooms"
                      onClick={() => {
                        onPlayClickSound?.();
                        setStep2Zone('actions');
                        setStep2ActionIndex(0);
                        onOpenPublicRooms();
                      }}
                      onMouseEnter={() => {
                        setStep2Zone('actions');
                        setStep2ActionIndex(0);
                      }}
                      className={`flex-1 px-2.5 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl border text-[11px] sm:text-sm font-bold flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer backdrop-blur-md shadow-md whitespace-nowrap ${
                        step2Zone === 'actions' && step2ActionIndex === 0
                          ? 'bg-purple-600 border-pink-400 text-white ring-2 ring-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.5)] scale-105'
                          : 'bg-purple-600/30 hover:bg-purple-600/50 border-purple-500/40 text-white hover:border-purple-400'
                      }`}
                    >
                      <Globe2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-pink-400 shrink-0" />
                      <span className="sm:hidden">Salon public</span>
                      <span className="hidden sm:inline truncate">{t('browse_public_rooms', language)}</span>
                    </button>
                  )}

                  {onOpenJoinRoom && (
                    <button
                      type="button"
                      id="btn-step2-join-room"
                      onClick={() => {
                        onPlayClickSound?.();
                        setStep2Zone('actions');
                        setStep2ActionIndex(1);
                        onOpenJoinRoom();
                      }}
                      onMouseEnter={() => {
                        setStep2Zone('actions');
                        setStep2ActionIndex(1);
                      }}
                      className={`flex-1 px-2.5 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl border text-[11px] sm:text-sm font-bold flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer backdrop-blur-md shadow-md whitespace-nowrap ${
                        step2Zone === 'actions' && step2ActionIndex === 1
                          ? 'bg-white/20 border-purple-400 text-white ring-2 ring-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.5)] scale-105'
                          : 'bg-white/5 hover:bg-white/10 border-white/15 text-white/90 hover:text-white hover:border-pink-500/40'
                      }`}
                    >
                      <QrCode className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-pink-400 shrink-0" />
                      <span className="sm:hidden">Salon avec code</span>
                      <span className="hidden sm:inline truncate">{t('join_existing_room_btn', language)}</span>
                    </button>
                  )}
                </div>
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
                className="flex flex-col gap-2 sm:gap-4 items-center"
              >
                <div className="text-center mb-0.5 sm:mb-2">
                  <h2 className="text-sm xs:text-base sm:text-2xl font-black text-white font-heading">{t('difficulty_level', language)}</h2>
                  <p className="text-[11px] sm:text-sm text-white/60 mt-0.5 hidden xs:block">{t('step3_desc_alt', language)}</p>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 w-full max-w-3xl">
                  {difficultiesList.map((lvl, idx) => {
                    const isSelected = difficulty === lvl.id;
                    const isFocused = focusedDiffIndex === idx;
                    return (
                      <button
                        key={lvl.id}
                        onClick={() => {
                          onPlayClickSound?.();
                          setFocusedDiffIndex(idx);
                          setDifficulty(lvl.id as GameDifficulty);
                          setStep(4);
                        }}
                        onMouseEnter={() => {
                          setFocusedDiffIndex(idx);
                          onPlayHoverSound?.();
                        }}
                        className={`flex flex-col items-center justify-center p-2 sm:p-3 rounded-xl sm:rounded-2xl border transition-all duration-300 text-center gap-0.5 sm:gap-1 cursor-pointer ${
                          isSelected || isFocused
                            ? 'bg-purple-600/30 border-purple-400 ring-2 ring-purple-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)] scale-[1.02]'
                            : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20 hover:text-white'
                        }`}
                      >
                        <span className="font-bold text-xs sm:text-base">{lvl.label}</span>
                        <span className="text-[9px] sm:text-xs opacity-70 leading-tight">{lvl.desc}</span>
                      </button>
                    );
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
                className="flex flex-col gap-2 sm:gap-4"
              >
                <div className="text-center mb-0.5 sm:mb-1">
                  <h2 className="text-sm xs:text-base sm:text-2xl font-black text-white font-heading">{t('step3_title', language)}</h2>
                  <p className="text-[11px] sm:text-sm text-white/60 mt-0.5 hidden xs:block">{t('step4_desc', language)}</p>
                </div>

                {/* Custom Theme Generator Box */}
                <div className={`rounded-2xl sm:rounded-3xl p-2 sm:p-4 border transition-all ${
                  step4Zone === 'input'
                    ? 'bg-purple-950/40 border-purple-400 ring-2 ring-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                    : 'bg-black/20 border-white/10'
                }`}>
                  <form onSubmit={handleCustomSubmit} className="flex flex-col sm:flex-row gap-1.5 sm:gap-2">
                    <div className="flex-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-2.5 sm:pl-3 flex items-center pointer-events-none">
                        <Wand2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400" />
                      </div>
                      <input
                        ref={customTopicInputRef}
                        type="text"
                        value={customTopic}
                        onChange={(e) => setCustomTopic(e.target.value)}
                        onFocus={() => setStep4Zone('input')}
                        placeholder={t('custom_topic_placeholder', language)}
                        disabled={isGenerating}
                        className={`w-full pl-8 sm:pl-9 pr-3 sm:pr-4 py-2 sm:py-3 rounded-xl bg-black/40 border text-white placeholder:text-white/40 focus:outline-none text-xs sm:text-sm font-medium transition-all shadow-inner ${
                          step4Zone === 'input'
                            ? 'border-purple-400 ring-2 ring-purple-400/80 bg-black/60'
                            : 'border-white/15'
                        }`}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={!customTopic.trim() || isGenerating}
                      className="px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider text-white bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition-all duration-200 shadow-[0_0_15px_rgba(168,85,247,0.4)] flex items-center justify-center gap-1.5 sm:gap-2 disabled:opacity-50 disabled:cursor-not-allowed shrink-0 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span>{t('generate_action', language)}</span>
                    </button>
                  </form>
                </div>

                {/* Preset Categories Grid */}
                <div className="mt-1 sm:mt-2">
                  <h3 className="text-xs sm:text-sm font-bold text-white mb-1 sm:mb-1.5 flex items-center gap-1.5">
                    <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-yellow-400" />{t('or_choose_preset', language)}</h3>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-1 sm:gap-1.5">
                    {PRESET_THEMES.map((theme, idx) => {
                      const isFocused = step4Zone === 'presets' && focusedPresetIndex === idx;
                      return (
                        <button
                          key={theme.id}
                          type="button"
                          onClick={() => {
                            if (!isGenerating) {
                              onPlayClickSound?.();
                              setStep4Zone('presets');
                              setFocusedPresetIndex(idx);
                              onSelectPreset(theme, difficulty, selectedMode, selectedStyle, isPublicRoom);
                            }
                          }}
                          onMouseEnter={() => {
                            setStep4Zone('presets');
                            setFocusedPresetIndex(idx);
                            setActiveHoveredTheme(theme.id);
                            onPlayHoverSound?.();
                          }}
                          onMouseLeave={() => setActiveHoveredTheme(null)}
                          disabled={isGenerating}
                          className={`group relative rounded-lg sm:rounded-xl p-1.5 sm:p-2 border transition-all duration-300 flex items-center gap-1.5 sm:gap-2 cursor-pointer overflow-hidden text-left disabled:opacity-50 ${
                            isFocused
                              ? 'border-purple-400 bg-purple-600/20 ring-2 ring-purple-400/80 shadow-[0_0_15px_rgba(168,85,247,0.35)] scale-[1.01]'
                              : 'border-white/10 hover:border-purple-500/50 bg-white/5 hover:bg-white/10'
                          }`}
                        >
                          <div
                            className="p-1 sm:p-1.5 rounded-lg border text-white transition-transform duration-200 group-hover:scale-110 shrink-0"
                            style={{
                              backgroundColor: `${theme.primaryColor}25`,
                              borderColor: `${theme.primaryColor}50`,
                              color: theme.primaryColor,
                            }}
                          >
                            {ICON_MAP[theme.icon] ? React.cloneElement(ICON_MAP[theme.icon] as React.ReactElement<any>, { className: 'w-3 h-3 sm:w-3.5 sm:h-3.5' }) : <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-[10px] sm:text-[11px] font-bold text-white group-hover:text-purple-200 transition-colors truncate">
                              {getPresetTitle(theme)}
                            </h4>
                            <p className="text-[8px] sm:text-[9px] text-white/50 truncate">
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

        {/* Keyboard & Xbox Gamepad navigation helper footer */}
        <div className="mt-2 pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[10px] sm:text-xs text-white/60 select-none">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/20 text-white/80 font-mono text-[9px] sm:text-[10px]">↑</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/20 text-white/80 font-mono text-[9px] sm:text-[10px]">↓</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/20 text-white/80 font-mono text-[9px] sm:text-[10px]">←</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/20 text-white/80 font-mono text-[9px] sm:text-[10px]">→</kbd>
              <span className="ml-1">Naviguer</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/20 text-white/80 font-mono text-[9px] sm:text-[10px]">Entrée</kbd>
              <span className="ml-1">Valider</span>
            </span>
            {step === 2 && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/20 text-white/80 font-mono text-[9px] sm:text-[10px]">P</kbd>
                  <span className="ml-1">Privé/Public</span>
                </span>
              </>
            )}
            {step === 4 && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/20 text-white/80 font-mono text-[9px] sm:text-[10px]">Tab</kbd>
                  <span className="ml-1">Zone Sujet</span>
                </span>
              </>
            )}
            {step > 1 && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/20 text-white/80 font-mono text-[9px] sm:text-[10px]">Échap / Retour</kbd>
                  <span className="ml-1">Précédent</span>
                </span>
              </>
            )}
          </div>

          {/* Gamepad Xbox Status and Indicators */}
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[9px] sm:text-[10px] transition-colors ${
              gamepadState.isConnected
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-white/5 text-white/40 border-white/10'
            }`}>
              <Gamepad2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>{gamepadState.isConnected ? (gamepadState.isXbox ? 'Manette Xbox Connectée' : 'Manette Connectée') : 'Manette Xbox supportée'}</span>
              {gamepadState.isConnected && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
            </div>

            <div className="hidden md:flex items-center gap-1.5 text-[9px] text-white/50">
              <span className="flex items-center gap-0.5"><XboxBadge button="A" /> Valider</span>
              <span className="flex items-center gap-0.5"><XboxBadge button="B" /> Retour</span>
              <span className="flex items-center gap-0.5"><XboxBadge button="X" /> Action</span>
              <span className="flex items-center gap-0.5"><XboxBadge button="Y" /> Salons</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
