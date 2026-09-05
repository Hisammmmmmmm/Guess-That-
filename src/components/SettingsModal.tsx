import React, { useState, useEffect } from 'react';
import { t } from '../i18n/translations';
import {
  X,
  Volume2,
  Music,
  User,
  Check,
  Zap,
  Radio,
  BookOpen,
  Keyboard,
  HelpCircle,
  Gamepad2,
  Headphones,
  Eye,
  CornerDownLeft,
  Users,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GameSettings } from '../types';
import { soundEngine } from '../services/soundEngine';
import { XboxBadge } from './XboxBadge';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  primaryColor?: string;
  playerName?: string;
  playerAvatar?: string;
  onUpdatePlayerProfile?: (name: string, avatar: string) => void;
  initialTab?: 'settings' | 'tutorial';
}

const AVATAR_PRESETS = ['👑', '🦊', '🦁', '🚀', '⚡', '🎧', '🎮', '🦄', '🐼', '🔥', '🏆', '🐱', '🤖', '🌟'];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  primaryColor = '#6366f1',
  playerName = 'Michel',
  playerAvatar = '👑',
  onUpdatePlayerProfile,
  initialTab = 'settings',
}) => {
  const [activeTab, setActiveTab] = useState<'settings' | 'tutorial'>(initialTab);
  const [localName, setLocalName] = useState(playerName);
  const [localAvatar, setLocalAvatar] = useState(playerAvatar);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  useEffect(() => {
    setLocalName(playerName || 'Michel');
  }, [playerName]);

  useEffect(() => {
    setLocalAvatar(playerAvatar || '👑');
  }, [playerAvatar]);

  // Handle keyboard navigation inside the modal: Esc to close, Enter to save & close, Left/Right to switch tabs
  useEffect(() => {
    if (!isOpen) return;

    const handleModalKeyDown = (e: KeyboardEvent) => {
      const isTypingInInput = e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement;

      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        handleSaveAndClose();
        return;
      }

      if (e.key === 'Enter' && !isTypingInInput) {
        e.preventDefault();
        e.stopPropagation();
        handleSaveAndClose();
        return;
      }

      // Tab or ArrowLeft/ArrowRight to switch tabs if not typing
      if (!isTypingInInput) {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          soundEngine.playHover();
          setActiveTab('settings');
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          soundEngine.playHover();
          setActiveTab('tutorial');
        } else if (e.key === 't' || e.key === 'T' || e.key === 'h' || e.key === 'H') {
          e.preventDefault();
          soundEngine.playClick();
          setActiveTab('tutorial');
        } else if (e.key === 'p' || e.key === 'P') {
          e.preventDefault();
          soundEngine.playClick();
          setActiveTab('settings');
        }
      }
    };

    window.addEventListener('keydown', handleModalKeyDown);
    return () => window.removeEventListener('keydown', handleModalKeyDown);
  }, [isOpen, localName, localAvatar]);

  if (!isOpen) return null;

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalName(val);
    if (onUpdatePlayerProfile) {
      onUpdatePlayerProfile(val, localAvatar);
    }
  };

  const handleAvatarSelect = (avatar: string) => {
    soundEngine.playClick();
    setLocalAvatar(avatar);
    if (onUpdatePlayerProfile) {
      onUpdatePlayerProfile(localName, avatar);
    }
  };

  const handleMasterVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    soundEngine.setMasterVolume(val);
    onUpdateSettings({ masterVolume: val });
  };

  const handleMenuMusicVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    soundEngine.setMenuMusicVolume(val);
    onUpdateSettings({ menuMusicVolume: val, musicVolume: val });
  };

  const handleQuestionMusicVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    soundEngine.setQuestionMusicVolume(val);
    onUpdateSettings({ questionMusicVolume: val });
  };

  const handleSfxVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    soundEngine.setSfxVolume(val);
    onUpdateSettings({ sfxVolume: val });
  };

  const toggleSfx = () => {
    const next = !settings.soundEffectsEnabled;
    soundEngine.setSfxMuted(!next);
    soundEngine.playClick();
    onUpdateSettings({ soundEffectsEnabled: next });
  };

  const toggleMusic = () => {
    const next = !settings.musicEnabled;
    soundEngine.setMusicMuted(!next);
    soundEngine.playClick();
    onUpdateSettings({ musicEnabled: next });
  };

  const handleSaveAndClose = () => {
    soundEngine.playClick();
    if (onUpdatePlayerProfile) {
      const finalName = localName.trim() || 'Michel';
      onUpdatePlayerProfile(finalName, localAvatar);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleSaveAndClose}
          className="absolute inset-0 bg-black/75 backdrop-blur-xl"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-xl rounded-[28px] sm:rounded-[36px] border border-white/15 bg-[#0F0A1F]/95 shadow-[0_25px_60px_rgba(0,0,0,0.85)] p-4 sm:p-6 backdrop-blur-2xl flex flex-col gap-4 max-h-[92vh] overflow-y-auto"
          id="settings-modal-dialog"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 sm:p-3 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-md">
                {activeTab === 'settings' ? (
                  <Sliders className="w-5 h-5 text-purple-400" />
                ) : (
                  <BookOpen className="w-5 h-5 text-pink-400" />
                )}
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-white font-heading">
                  {activeTab === 'settings' ? t('settings_customization') : t('tutorial_title')}
                </h3>
                <p className="text-xs text-white/60">
                  {activeTab === 'settings'
                    ? 'Gestion des volumes, profil et personnalisation'
                    : 'Règles du jeu & guide complet des touches clavier'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-xl border border-white/10">
                <kbd className="hidden sm:inline font-mono text-[10px] text-white/70">Échap</kbd>
                <XboxBadge button="B" />
                <button
                  onClick={handleSaveAndClose}
                  id="btn-close-settings"
                  className="p-1 text-white/60 hover:text-white transition-all cursor-pointer"
                  title="Fermer (Échap / Manette B)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Tabs Header */}
          <div className="flex items-center p-1 rounded-2xl bg-black/40 border border-white/10 shadow-inner">
            <button
              type="button"
              id="tab-btn-settings"
              onClick={() => {
                soundEngine.playClick();
                setActiveTab('settings');
              }}
              className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/50 ring-1 ring-purple-400'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Paramètres & Profil</span>
              <span className="hidden md:inline text-[9px] opacity-60 font-mono">[←]</span>
            </button>
            <button
              type="button"
              id="tab-btn-tutorial"
              onClick={() => {
                soundEngine.playClick();
                setActiveTab('tutorial');
              }}
              className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'tutorial'
                  ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg shadow-pink-900/50 ring-1 ring-pink-400'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Keyboard className="w-4 h-4 text-pink-300" />
              <span>Tuto & Touches Clavier</span>
              <span className="hidden md:inline text-[9px] opacity-60 font-mono">[→]</span>
            </button>
          </div>

          {/* TAB 1: SETTINGS & AUDIO */}
          {activeTab === 'settings' && (
            <motion.div
              key="settings-tab-content"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-4"
            >
              {/* Player Nickname / Pseudo & Avatar Section */}
              <div className="flex flex-col gap-3 p-4 rounded-2xl bg-gradient-to-br from-purple-900/30 to-indigo-900/20 border border-purple-500/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-black text-white">
                    <User className="w-4 h-4 text-purple-400" />
                    <span>{t('your_nickname')}</span>
                  </div>
                  <span className="text-[11px] font-bold text-purple-300/80 bg-purple-500/20 px-2 py-0.5 rounded-full border border-purple-500/30">
                    Hôte & Joueur
                  </span>
                </div>

                <p className="text-[11px] text-white/60 -mt-1 leading-relaxed">
                  Ce pseudo remplacera la mention "Hôte" et sera affiché dans les classements et salons.
                </p>

                <div className="flex items-center gap-3">
                  <div className="text-2xl sm:text-3xl w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 shrink-0 shadow-inner">
                    {localAvatar}
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      id="settings-nickname-input"
                      value={localName}
                      maxLength={24}
                      onChange={handleNameChange}
                      placeholder={t('nickname_placeholder')}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all placeholder:text-white/30"
                    />
                  </div>
                </div>

                {/* Quick Avatar Presets */}
                <div className="flex flex-col gap-1.5 mt-1">
                  <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider">
                    {t('choose_avatar')} :
                  </span>
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                    {AVATAR_PRESETS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => handleAvatarSelect(emoji)}
                        className={`w-8 h-8 rounded-xl flex items-center justify-center text-lg transition-all shrink-0 cursor-pointer ${
                          localAvatar === emoji
                            ? 'bg-purple-500 border-2 border-white shadow-[0_0_10px_rgba(168,85,247,0.8)] scale-110'
                            : 'bg-white/5 border border-white/10 hover:bg-white/15'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sound Volume Controls */}
              <div className="flex flex-col gap-3 border-t border-white/10 pt-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-black text-white">
                    <Volume2 className="w-4 h-4 text-emerald-400" />
                    <span>{t('sound_volume_management')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={toggleSfx}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                        settings.soundEffectsEnabled
                          ? 'bg-yellow-500/20 border-yellow-500/40 text-yellow-300'
                          : 'bg-white/5 border-white/10 text-white/40 line-through'
                      }`}
                    >
                      SFX {settings.soundEffectsEnabled ? 'ON' : 'OFF'}
                    </button>
                    <button
                      type="button"
                      onClick={toggleMusic}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                        settings.musicEnabled
                          ? 'bg-pink-500/20 border-pink-500/40 text-pink-300'
                          : 'bg-white/5 border-white/10 text-white/40 line-through'
                      }`}
                    >
                      Music {settings.musicEnabled ? 'ON' : 'OFF'}
                    </button>
                  </div>
                </div>

                {/* 1. Master Volume */}
                <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between text-xs text-white/90 font-semibold">
                    <span className="flex items-center gap-1.5">
                      <Volume2 className="w-3.5 h-3.5 text-purple-400" /> {t('master_volume')}
                    </span>
                    <span className="font-mono text-purple-300 font-black">{Math.round((settings.masterVolume ?? 1.0) * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={settings.masterVolume ?? 1.0}
                    onChange={handleMasterVolumeChange}
                    className="w-full accent-purple-500 h-2 bg-white/10 rounded-lg cursor-pointer mt-1"
                  />
                </div>

                {/* 2. Menu Music Volume */}
                <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between text-xs text-white/90 font-semibold">
                    <span className="flex items-center gap-1.5">
                      <Music className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Musique du Menu (Ambiance)</span>
                      <span className="text-[10px] font-normal text-indigo-300/70 bg-indigo-500/10 px-1.5 py-0.2 rounded border border-indigo-500/20">
                        10% défaut
                      </span>
                    </span>
                    <span className="font-mono text-indigo-300 font-black">{Math.round((settings.menuMusicVolume ?? 0.1) * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={settings.menuMusicVolume ?? 0.1}
                    onChange={handleMenuMusicVolumeChange}
                    className="w-full accent-indigo-500 h-2 bg-white/10 rounded-lg cursor-pointer mt-1"
                  />
                </div>

                {/* 3. Question Music Volume */}
                <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between text-xs text-white/90 font-semibold">
                    <span className="flex items-center gap-1.5">
                      <Radio className="w-3.5 h-3.5 text-pink-400" />
                      <span>Musiques YouTube en Jeu (Blind Test)</span>
                      <span className="text-[10px] font-normal text-pink-300/70 bg-pink-500/10 px-1.5 py-0.2 rounded border border-pink-500/20">
                        80% défaut
                      </span>
                    </span>
                    <span className="font-mono text-pink-400 font-black">{Math.round((settings.questionMusicVolume ?? 0.8) * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={settings.questionMusicVolume ?? 0.8}
                    onChange={handleQuestionMusicVolumeChange}
                    className="w-full accent-pink-500 h-2 bg-white/10 rounded-lg cursor-pointer mt-1"
                  />
                </div>

                {/* 4. Sound Effects Volume */}
                <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between text-xs text-white/90 font-semibold">
                    <span className="flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-yellow-400" />
                      <span>{t('sound_effects_desc')}</span>
                    </span>
                    <span className="font-mono text-yellow-400 font-black">{Math.round((settings.sfxVolume ?? 0.85) * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={settings.sfxVolume ?? 0.85}
                    onChange={handleSfxVolumeChange}
                    className="w-full accent-yellow-400 h-2 bg-white/10 rounded-lg cursor-pointer mt-1"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: TUTORIAL & KEYBOARD SHORTCUTS */}
          {activeTab === 'tutorial' && (
            <motion.div
              key="tutorial-tab-content"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-4 text-white"
            >
              {/* Introduction Card */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-purple-900/40 via-indigo-950/40 to-pink-900/30 border border-purple-400/30 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm font-black text-white">
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  <span>Bienvenue sur Guess That!</span>
                </div>
                <p className="text-xs text-purple-200/90 leading-relaxed">
                  Guess That! est une plateforme de quiz ultra-rapide et de blind tests musicaux et visuels. Vous pouvez jouer en <strong>Solo</strong>, organiser des <strong>Salons Multijoueurs</strong> avec vos amis (via code ou QR code sur smartphone), ou animer une soirée en mode <strong>Diaporama</strong>.
                </p>
              </div>

              {/* Game Modes Explanation */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                  <Gamepad2 className="w-3.5 h-3.5 text-purple-400" />
                  Les 3 Modes de Jeu :
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-blue-300">
                      <HelpCircle className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span>Quiz Culture G</span>
                    </div>
                    <p className="text-[11px] text-white/60 leading-snug">
                      QCM à 4 choix générés par l'IA sur tous les sujets imaginables avec anecdotes culturelles (*Fun Facts*).
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-pink-300">
                      <Headphones className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                      <span>Blind Test Musical</span>
                    </div>
                    <p className="text-[11px] text-white/60 leading-snug">
                      Écoutez les extraits de morceaux ou musiques de films en direct et devinez le titre ou l'artiste avant la fin du temps !
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                      <Eye className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Blind Test Visuel</span>
                    </div>
                    <p className="text-[11px] text-white/60 leading-snug">
                      Analysez les images, photos d'animés, monuments ou tableaux et trouvez la bonne réponse le plus vite possible.
                    </p>
                  </div>
                </div>
              </div>

              {/* Keyboard Shortcuts Full Guide (Requested by User) */}
              <div className="flex flex-col gap-2.5 border-t border-white/10 pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-pink-300 flex items-center gap-1.5">
                    <Keyboard className="w-4 h-4 text-pink-400" />
                    Commandes Clavier (Jouez 100% au Clavier) :
                  </span>
                  <span className="text-[10px] text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30 font-bold">
                    Toujours actif
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {/* Shortcut 1: ABCD */}
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-white/90">Réponses directes</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 rounded bg-purple-600/60 border border-purple-400/50 text-white font-mono font-bold text-[11px] shadow-sm">A</kbd>
                      <kbd className="px-1.5 py-0.5 rounded bg-purple-600/60 border border-purple-400/50 text-white font-mono font-bold text-[11px] shadow-sm">B</kbd>
                      <kbd className="px-1.5 py-0.5 rounded bg-purple-600/60 border border-purple-400/50 text-white font-mono font-bold text-[11px] shadow-sm">C</kbd>
                      <kbd className="px-1.5 py-0.5 rounded bg-purple-600/60 border border-purple-400/50 text-white font-mono font-bold text-[11px] shadow-sm">D</kbd>
                    </div>
                  </div>

                  {/* Shortcut 2: Arrows */}
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-white/90">Naviguer</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/20 text-white font-mono font-bold text-[11px] shadow-sm">←</kbd>
                      <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/20 text-white font-mono font-bold text-[11px] shadow-sm">↑</kbd>
                      <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/20 text-white font-mono font-bold text-[11px] shadow-sm">↓</kbd>
                      <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/20 text-white font-mono font-bold text-[11px] shadow-sm">→</kbd>
                    </div>
                  </div>

                  {/* Shortcut 3: Enter */}
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-white/90">Valider / Suivant</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <kbd className="px-2 py-0.5 rounded bg-emerald-600/60 border border-emerald-400/50 text-white font-mono font-bold text-[11px] flex items-center gap-1 shadow-sm">
                        Entrée ↵
                      </kbd>
                    </div>
                  </div>

                  {/* Shortcut 4: Esc */}
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-white/90">Fermer / Quitter</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <kbd className="px-2 py-0.5 rounded bg-red-600/60 border border-red-400/50 text-white font-mono font-bold text-[11px] shadow-sm">
                        Échap / Esc
                      </kbd>
                    </div>
                  </div>

                  {/* Shortcut 5: O for Options */}
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-white/90">Menu Options</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <kbd className="px-2 py-0.5 rounded bg-pink-600/60 border border-pink-400/50 text-white font-mono font-bold text-[11px] shadow-sm">
                        O
                      </kbd>
                      <span className="text-[10px] text-white/40">ou P</span>
                    </div>
                  </div>

                  {/* Shortcut 6: T for Tutorial */}
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-white/90">Tuto & Aide</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <kbd className="px-2 py-0.5 rounded bg-indigo-600/60 border border-indigo-400/50 text-white font-mono font-bold text-[11px] shadow-sm">
                        T
                      </kbd>
                      <span className="text-[10px] text-white/40">ou H</span>
                    </div>
                  </div>

                  {/* Shortcut 7: M for Mute */}
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-white/90">Mute Son & Musique</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <kbd className="px-2 py-0.5 rounded bg-amber-600/60 border border-amber-400/50 text-white font-mono font-bold text-[11px] shadow-sm">
                        M
                      </kbd>
                    </div>
                  </div>

                  {/* Shortcut 8: L for Library */}
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-white/90">Bibliothèque (Menu)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <kbd className="px-2 py-0.5 rounded bg-white/10 border border-white/20 text-white font-mono font-bold text-[11px] shadow-sm">
                        L
                      </kbd>
                    </div>
                  </div>

                  {/* Shortcut 9: J for Join Room */}
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-white/90">Rejoindre Salon (Menu)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <kbd className="px-2 py-0.5 rounded bg-white/10 border border-white/20 text-white font-mono font-bold text-[11px] shadow-sm">
                        J
                      </kbd>
                    </div>
                  </div>

                  {/* Shortcut 10: Numbers 1, 2, 3, 4 */}
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-white/90">Choix rapide chiffres</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/20 text-white font-mono font-bold text-[11px] shadow-sm">1</kbd>
                      <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/20 text-white font-mono font-bold text-[11px] shadow-sm">2</kbd>
                      <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/20 text-white font-mono font-bold text-[11px] shadow-sm">3</kbd>
                      <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/20 text-white font-mono font-bold text-[11px] shadow-sm">4</kbd>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pro Tip */}
              <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/20 text-[11px] text-purple-200 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-300 shrink-0" />
                <span>
                  <strong>Astuce pro :</strong> En jeu, utilisez les flèches pour prévisualiser la réponse et <kbd className="px-1 bg-white/10 rounded font-mono font-bold">Entrée</kbd> pour valider, ou appuyez directement sur <kbd className="px-1 bg-white/10 rounded font-mono font-bold">A</kbd>, <kbd className="px-1 bg-white/10 rounded font-mono font-bold">B</kbd>, <kbd className="px-1 bg-white/10 rounded font-mono font-bold">C</kbd> ou <kbd className="px-1 bg-white/10 rounded font-mono font-bold">D</kbd> pour répondre en une fraction de seconde !
                </span>
              </div>
            </motion.div>
          )}

          {/* Footer Save Button */}
          <div className="border-t border-white/10 pt-3 flex items-center justify-between gap-3">
            <div className="hidden sm:flex items-center gap-2 text-[11px] text-white/50">
              <span>Touches :</span>
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/15 text-white/70 font-mono font-bold text-[10px]">← → Onglets</kbd>
              <XboxBadge button="LB" />
              <XboxBadge button="RB" />
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/15 text-white/70 font-mono font-bold text-[10px]">Échap Fermer</kbd>
              <XboxBadge button="B" />
            </div>

            <button
              onClick={handleSaveAndClose}
              id="btn-save-settings"
              className="w-full sm:w-auto px-7 py-2.5 sm:py-3 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(168,85,247,0.5)] transform active:scale-95 ml-auto"
            >
              <Check className="w-4 h-4" />
              <span>{activeTab === 'tutorial' ? "J'ai compris, c'est parti !" : t('save_and_resume')}</span>
              <XboxBadge button="A" className="ml-1" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

