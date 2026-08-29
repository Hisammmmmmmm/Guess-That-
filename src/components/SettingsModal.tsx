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
  Sparkles,
  VolumeX,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GameSettings } from '../types';
import { soundEngine } from '../services/soundEngine';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  primaryColor?: string;
  playerName?: string;
  playerAvatar?: string;
  onUpdatePlayerProfile?: (name: string, avatar: string) => void;
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
}) => {
  const [localName, setLocalName] = useState(playerName);
  const [localAvatar, setLocalAvatar] = useState(playerAvatar);

  useEffect(() => {
    setLocalName(playerName || 'Michel');
  }, [playerName]);

  useEffect(() => {
    setLocalAvatar(playerAvatar || '👑');
  }, [playerAvatar]);

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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleSaveAndClose}
          className="absolute inset-0 bg-black/70 backdrop-blur-xl"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-lg rounded-[28px] sm:rounded-[36px] border border-white/15 bg-[#0F0A1F]/95 shadow-[0_25px_60px_rgba(0,0,0,0.75)] p-5 sm:p-7 backdrop-blur-2xl flex flex-col gap-5 max-h-[90vh] overflow-y-auto"
          id="settings-modal-dialog"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 sm:p-3 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-md">
                <Volume2 className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-white font-heading">
                  {t('settings_customization', settings.language)}
                </h3>
                <p className="text-xs text-white/60">
                  {settings.language === 'fr' 
                    ? 'Gestion des volumes sonores & configuration de ton pseudo'
                    : 'Sound volumes management & player profile customization'}
                </p>
              </div>
            </div>

            <button
              onClick={handleSaveAndClose}
              id="btn-close-settings"
              className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Player Nickname / Pseudo & Avatar Section */}
          <div className="flex flex-col gap-3 p-4 rounded-2xl bg-gradient-to-br from-purple-900/30 to-indigo-900/20 border border-purple-500/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-black text-white">
                <User className="w-4 h-4 text-purple-400" />
                <span>{t('your_nickname', settings.language)}</span>
              </div>
              <span className="text-[11px] font-bold text-purple-300/80 bg-purple-500/20 px-2 py-0.5 rounded-full border border-purple-500/30">
                {settings.language === 'fr' ? 'Hôte & Joueur' : 'Host & Player'}
              </span>
            </div>

            <p className="text-[11px] text-white/60 -mt-1 leading-relaxed">
              {settings.language === 'fr'
                ? 'Ce pseudo remplacera la mention "Hôte" et sera affiché dans les classements et salons.'
                : 'This nickname replaces "Host" and is displayed in game scoreboards and lobbies.'}
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
                  placeholder={t('nickname_placeholder', settings.language)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all placeholder:text-white/30"
                />
              </div>
            </div>

            {/* Quick Avatar Presets */}
            <div className="flex flex-col gap-1.5 mt-1">
              <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider">
                {t('choose_avatar', settings.language)} :
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
          <div className="flex flex-col gap-3.5 border-t border-white/10 pt-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-black text-white">
                <Volume2 className="w-4 h-4 text-emerald-400" />
                <span>{t('sound_volume_management', settings.language)}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleSfx}
                  className={`text-[10px] font-bold px-2 py-1 rounded-lg border transition-all cursor-pointer ${
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
                  className={`text-[10px] font-bold px-2 py-1 rounded-lg border transition-all cursor-pointer ${
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
                  <Volume2 className="w-3.5 h-3.5 text-purple-400" /> {t('master_volume', settings.language)}
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

            {/* 2. Menu Music Volume (Default 10%) */}
            <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center justify-between text-xs text-white/90 font-semibold">
                <span className="flex items-center gap-1.5">
                  <Music className="w-3.5 h-3.5 text-indigo-400" />
                  <span>
                    {settings.language === 'fr' ? 'Musique du Menu (Ambiance)' : 'Menu Music (Ambience)'}
                  </span>
                  <span className="text-[10px] font-normal text-indigo-300/70 bg-indigo-500/10 px-1.5 py-0.2 rounded border border-indigo-500/20">
                    {settings.language === 'fr' ? '10% défaut' : '10% def'}
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

            {/* 3. Question Music Volume (YouTube - Default 80%) */}
            <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center justify-between text-xs text-white/90 font-semibold">
                <span className="flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-pink-400" />
                  <span>
                    {settings.language === 'fr' ? 'Musiques YouTube en Jeu (Questions)' : 'In-Game YouTube Music'}
                  </span>
                  <span className="text-[10px] font-normal text-pink-300/70 bg-pink-500/10 px-1.5 py-0.2 rounded border border-pink-500/20">
                    {settings.language === 'fr' ? '80% défaut' : '80% def'}
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

            {/* 4. Sound Effects Volume (SFX) */}
            <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center justify-between text-xs text-white/90 font-semibold">
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-yellow-400" />
                  <span>{t('sound_effects_desc', settings.language)}</span>
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

          {/* Footer Save Button */}
          <div className="border-t border-white/10 pt-3 flex justify-end">
            <button
              onClick={handleSaveAndClose}
              id="btn-save-settings"
              className="w-full sm:w-auto px-7 py-3 rounded-2xl font-black text-sm uppercase tracking-wider text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(168,85,247,0.5)] transform active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>{t('save_and_resume', settings.language)}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
