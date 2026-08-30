import React, { useState } from 'react';
import {
  Volume2,
  VolumeX,
  Music,
  Music2,
  Sliders,
  Sparkles,
  ArrowLeft,
  Flame,
  HelpCircle,
  Gamepad2,
  Gauge,
  Hash,
  Pause,
  Play,
  Globe
} from 'lucide-react';
import { GameSettings, QuizData, GameScreen, RoomState } from '../types';
import { soundEngine } from '../services/soundEngine';
import { t, languages } from '../i18n/translations';
import { FlagIcon } from './FlagIcon';

interface NavbarProps {
  currentScreen: GameScreen;
  quizData: QuizData | null;
  settings: GameSettings;
  roomState?: RoomState | null;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  onOpenSettings: () => void;
  onExitToMenu: () => void;
  onPlayClickSound?: () => void;
  isPaused?: boolean;
  onTogglePause?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentScreen,
  quizData,
  settings,
  roomState,
  onUpdateSettings,
  onOpenSettings,
  onExitToMenu,
  onPlayClickSound,
  isPaused,
  onTogglePause,
}) => {
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const toggleSound = () => {
    soundEngine.unlockAudio();
    const isMuted = !settings.soundEffectsEnabled && !settings.musicEnabled;
    const nextState = isMuted;

    soundEngine.setSfxMuted(!nextState);
    soundEngine.setMusicMuted(!nextState);
    soundEngine.playClick();

    onUpdateSettings({
      soundEffectsEnabled: nextState,
      musicEnabled: nextState,
    });
  };

  const currentLang = languages.find(l => l.code === settings.language) || languages[0];
  const roomLang = roomState ? (languages.find(l => l.code === roomState.language) || languages[0]) : null;

  return (
    <header className={`fixed top-0 z-40 w-full transition-all duration-300 ${currentScreen === 'playing' ? 'bg-transparent' : 'backdrop-blur-2xl bg-[#0F0A1F]/80 border-b border-white/10'}`}>
      <div className="max-w-6xl mx-auto px-3 sm:px-6 h-12 sm:h-16 flex items-center justify-between gap-2 sm:gap-3">
        {/* Left: App Logo or Back Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          {currentScreen === 'playing' ? (
            <div className="flex items-center gap-1.5 sm:gap-3">
              <button
                onClick={() => {
                  onPlayClickSound?.();
                  onExitToMenu();
                }}
                id="btn-back-to-menu"
                className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl bg-white/5 hover:bg-white/10 text-white/90 hover:text-white border border-white/15 text-xs font-bold transition-all cursor-pointer backdrop-blur-md shadow-md shrink-0"
              >
                <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400" />
                <span className="hidden sm:inline">{t('quit', settings.language)}</span>
              </button>
              
              {/* Game Info Badge */}
              <div className="flex items-center gap-1.5 sm:gap-2.5 px-3 py-1.5 sm:py-2 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md text-[9px] sm:text-xs">
                {roomLang && (
                  <>
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-purple-500/20 border border-purple-400/30 text-purple-200" title={`${t('room_language', settings.language)}: ${roomLang.name}`}>
                      <span className="text-[9px] uppercase tracking-wider text-purple-300 font-bold hidden sm:inline">{t('room_language', settings.language)}:</span>
                      <FlagIcon code={roomLang.code} className="w-4 h-3 rounded-xs" />
                      <span className="font-bold text-white text-[10px]">{roomLang.name}</span>
                    </div>
                    <span className="w-1 h-1 rounded-full bg-white/20 shrink-0" />
                  </>
                )}
                <span className="flex items-center gap-1 text-white/70">
                  <Gamepad2 className="w-3.5 h-3.5 text-indigo-400 hidden lg:block" />
                  <span className="font-semibold text-white">
                    {t(settings.gameMode, settings.language)}
                  </span>
                </span>
                <span className="w-1 h-1 rounded-full bg-white/20 shrink-0" />
                <span className="flex items-center gap-1 text-white/70">
                  <Gauge className="w-3.5 h-3.5 text-amber-400 hidden lg:block" />
                  <span className="font-semibold text-white">
                    {t(settings.difficulty, settings.language)}
                  </span>
                </span>
                {quizData && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-white/20 shrink-0" />
                    <span className="flex items-center gap-1 text-white/70 max-w-[100px] sm:max-w-[150px] md:max-w-[200px] truncate">
                      <Hash className="w-3.5 h-3.5 text-pink-400 hidden lg:block shrink-0" />
                      <span className="font-bold text-white truncate">
                        {quizData.topic || quizData.themeTitle}
                      </span>
                    </span>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div
              onClick={() => currentScreen !== 'menu' && onExitToMenu()}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-purple-500 via-fuchsia-500 to-pink-500 p-0.5 shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-[#0F0A1F] rounded-[14px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-heading text-base font-black tracking-tight text-white flex items-center gap-1.5">
                  Guess<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">That!</span>
                </span>
                <span className="text-[10px] text-white/50 -mt-1 font-semibold hidden sm:inline">
                  {t('app_subtitle', settings.language)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-2.5 relative">
          {currentScreen === 'playing' && settings.gameStyle === 'slideshow' && (
            <button
              onClick={() => {
                onPlayClickSound?.();
                onTogglePause?.();
              }}
              className="p-2.5 px-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-2 text-xs font-bold backdrop-blur-md shadow-md bg-amber-500/20 border-amber-500/40 text-amber-300 hover:bg-amber-500/30"
              title={isPaused ? t('resume', settings.language) : t('pause', settings.language)}
            >
              {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              <span className="hidden sm:inline">{isPaused ? t('resume', settings.language) : t('pause', settings.language)}</span>
            </button>
          )}

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="p-2.5 px-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-2 text-xs font-bold backdrop-blur-md shadow-md bg-white/5 border-white/10 text-white/90 hover:bg-white/10 hover:text-white"
              title={t('language', settings.language)}
              id="btn-language-selector"
            >
              <FlagIcon code={currentLang.code} className="w-5 h-3.5 rounded-xs" />
              <span className="hidden sm:inline text-xs font-bold uppercase text-white/80">{currentLang.code}</span>
            </button>
            
            {isLangMenuOpen && (
              <div className="absolute top-full mt-2 right-0 bg-[#0F0A1F] border border-white/10 rounded-2xl shadow-xl overflow-hidden py-1 min-w-[140px] z-50">
                {languages.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      onUpdateSettings({ language: lang.code });
                      setIsLangMenuOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs hover:bg-white/10 flex items-center gap-2.5 transition-colors ${settings.language === lang.code ? 'bg-purple-500/20 text-purple-300 font-bold' : 'text-white/80'}`}
                  >
                    <FlagIcon code={lang.code} className="w-4 h-3 rounded-xs" />
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Sound Toggle */}
          <button
            onClick={toggleSound}
            id="btn-quick-sound-toggle"
            className={`p-2.5 px-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-2 text-xs font-bold backdrop-blur-md shadow-md ${
              settings.soundEffectsEnabled || settings.musicEnabled
                ? 'bg-purple-500/20 border-purple-500/40 text-purple-300 hover:bg-purple-500/30'
                : 'bg-white/5 border-white/10 text-white/40 hover:text-white/70'
            }`}
            title={t('toggle_sound', settings.language)}
          >
            {settings.soundEffectsEnabled || settings.musicEnabled ? (
              <>
                <Volume2 className="w-4 h-4 text-emerald-400" />
                <span className="hidden lg:inline text-[11px]">{t('sound_active', settings.language)}</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-white/40" />
                <span className="hidden lg:inline text-[11px]">{t('muted', settings.language)}</span>
              </>
            )}
          </button>

          {/* Settings Button */}
          <button
            onClick={() => {
              soundEngine.unlockAudio();
              soundEngine.playClick();
              onOpenSettings();
            }}
            id="btn-open-settings"
            className="p-2.5 px-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-white/90 hover:text-white transition-all cursor-pointer flex items-center gap-2 backdrop-blur-md shadow-md"
            title={t('game_settings', settings.language)}
          >
            <Sliders className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-bold hidden sm:inline">{t('options', settings.language)}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
