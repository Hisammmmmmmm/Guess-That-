import React from 'react';
import { t } from '../i18n/translations';
import {
  X,
  Volume2,
  VolumeX,
  Music,
  Gauge,
  Clock,
  Eye,
  Mic,
  Sliders,
  Check,
  Zap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GameSettings, GameDifficulty } from '../types';
import { soundEngine } from '../services/soundEngine';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  primaryColor?: string;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  primaryColor = '#6366f1',
}) => {
  if (!isOpen) return null;

  const difficulties: { id: GameDifficulty; label: string; desc: string; time: number }[] = [
    { id: 'easy', label: t('easy', settings.language), desc: t('diff_desc_easy_time', settings.language), time: 25 },
    { id: 'medium', label: t('medium', settings.language), desc: t('diff_desc_medium_time', settings.language), time: 15 },
    { id: 'hard', label: t('hard', settings.language), desc: t('diff_desc_hard_time', settings.language), time: 10 },
    { id: 'expert', label: t('expert', settings.language), desc: t('diff_desc_expert_time', settings.language), time: 8 },
  ];

  const handleDifficultyChange = (diff: GameDifficulty, time: number) => {
    soundEngine.playClick();
    onUpdateSettings({
      difficulty: diff,
      durationPerQuestion: time,
    });
  };

  const handleMasterVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    soundEngine.setMasterVolume(val);
    onUpdateSettings({ masterVolume: val });
  };

  const handleSfxVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    soundEngine.setSfxVolume(val);
    onUpdateSettings({ sfxVolume: val });
  };

  const handleMusicVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    soundEngine.setMusicVolume(val);
    onUpdateSettings({ musicVolume: val });
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

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            soundEngine.playClick();
            onClose();
          }}
          className="absolute inset-0 bg-black/70 backdrop-blur-xl"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-xl rounded-[32px] sm:rounded-[36px] border border-white/15 bg-[#0F0A1F]/95 shadow-[0_25px_60px_rgba(0,0,0,0.7)] p-6 sm:p-8 backdrop-blur-2xl flex flex-col gap-6 max-h-[90vh] overflow-y-auto"
          id="settings-modal-dialog"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-md">
                <Sliders className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-white font-heading">
                  {t('settings_customization', settings.language)}
                </h3>
                <p className="text-xs text-white/60">
                  {t('settings_desc', settings.language)}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                soundEngine.playClick();
                onClose();
              }}
              id="btn-close-settings"
              className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Game Mode Section */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Zap className="w-4 h-4 text-purple-400" />
              <span>{t('game_mode_label', settings.language)}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                { id: 'quiz', label: t('quiz', settings.language), desc: t('mode_quiz_desc', settings.language) },
                { id: 'music_blind_test', label: t('music_blind_test', settings.language), desc: t('mode_music_desc', settings.language) },
                { id: 'visual_blind_test', label: t('visual_blind_test', settings.language), desc: t('mode_visual_desc', settings.language) },
              ].map((m) => {
                const isSelected = settings.gameMode === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => {
                      soundEngine.playClick();
                      onUpdateSettings({ gameMode: m.id as any });
                    }}
                    className={`p-3 rounded-2xl border flex flex-col items-center justify-center text-center transition-all cursor-pointer backdrop-blur-md ${
                      isSelected
                        ? 'border-purple-500 bg-purple-500/20 text-white font-black shadow-[0_0_20px_rgba(168,85,247,0.3)] ring-1 ring-purple-400/50'
                        : 'border-white/10 bg-white/5 text-white/60 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    <span className="text-xs font-bold">{m.label}</span>
                    <span className="text-[10px] text-white/50 mt-0.5">{m.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Difficulty Section */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Gauge className="w-4 h-4 text-yellow-400" />
              <span>{t('difficulty_level', settings.language)}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {difficulties.map((diff) => {
                const isSelected = settings.difficulty === diff.id;
                return (
                  <button
                    key={diff.id}
                    onClick={() => handleDifficultyChange(diff.id, diff.time)}
                    id={`diff-btn-${diff.id}`}
                    className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center text-center transition-all cursor-pointer backdrop-blur-md ${
                      isSelected
                        ? 'border-purple-500 bg-purple-500/20 text-white font-black shadow-[0_0_20px_rgba(168,85,247,0.3)] ring-1 ring-purple-400/50'
                        : 'border-white/10 bg-white/5 text-white/60 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    <span className="text-sm font-bold">{diff.label}</span>
                    <span className="text-[10px] text-white/50 mt-0.5">{diff.time}s</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Duration Custom Selection */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Clock className="w-4 h-4 text-purple-400" />
              <span>{t('timer_per_question', settings.language)}</span>
            </div>
            <div className="flex items-center gap-2">
              {[8, 10, 15, 20, 25, 30].map((seconds) => {
                const isSelected = settings.durationPerQuestion === seconds;
                return (
                  <button
                    key={seconds}
                    onClick={() => {
                      soundEngine.playClick();
                      onUpdateSettings({ durationPerQuestion: seconds });
                    }}
                    className={`flex-1 py-2.5 rounded-2xl border text-xs font-black transition-all cursor-pointer backdrop-blur-md ${
                      isSelected
                        ? 'border-purple-500 bg-purple-500/20 text-purple-200 ring-1 ring-purple-500/40 shadow-sm'
                        : 'border-white/10 bg-white/5 text-white/50 hover:text-white'
                    }`}
                  >
                    {seconds}s
                  </button>
                );
              })}
            </div>
          </div>

          {/* Audio Volume Controls */}
          <div className="flex flex-col gap-4 border-t border-white/10 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Volume2 className="w-4 h-4 text-emerald-400" />
                <span>{t('sound_volume_management', settings.language)}</span>
              </div>
            </div>

            {/* Master Volume */}
            <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center justify-between text-xs text-white/80 font-semibold">
                <span>{t('master_volume', settings.language)}</span>
                <span className="font-mono-tech text-purple-300 font-bold">{Math.round(settings.masterVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.masterVolume}
                onChange={handleMasterVolumeChange}
                className="w-full accent-purple-500 h-2 bg-white/10 rounded-lg cursor-pointer mt-1"
              />
            </div>

            {/* SFX Volume */}
            <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center justify-between text-xs text-white/80 font-semibold">
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-yellow-400" /> {t('sound_effects_desc', settings.language)}
                </span>
                <span className="font-mono-tech text-yellow-400 font-bold">{Math.round(settings.sfxVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.sfxVolume}
                onChange={handleSfxVolumeChange}
                className="w-full accent-yellow-400 h-2 bg-white/10 rounded-lg cursor-pointer mt-1"
              />
            </div>

            {/* Ambience Volume */}
            <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center justify-between text-xs text-white/80 font-semibold">
                <span className="flex items-center gap-1.5">
                  <Music className="w-3.5 h-3.5 text-pink-400" /> {t('music_ambience_desc', settings.language)}
                </span>
                <span className="font-mono-tech text-pink-400 font-bold">{Math.round(settings.musicVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.musicVolume}
                onChange={handleMusicVolumeChange}
                className="w-full accent-pink-500 h-2 bg-white/10 rounded-lg cursor-pointer mt-1"
              />
            </div>
          </div>

          {/* Gameplay Toggles */}
          <div className="flex flex-col gap-2.5 border-t border-white/10 pt-4">
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-3">
                <Mic className="w-5 h-5 text-pink-400" />
                <div>
                  <p className="text-xs font-bold text-white">{t('speech_clues_title', settings.language)}</p>
                  <p className="text-[10px] text-white/50">{t('speech_clues_desc', settings.language)}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  soundEngine.playClick();
                  onUpdateSettings({ speechCluesEnabled: !settings.speechCluesEnabled });
                }}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  settings.speechCluesEnabled ? 'bg-purple-600' : 'bg-white/20'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform transform absolute top-1 ${
                    settings.speechCluesEnabled ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Footer Save Button */}
          <div className="border-t border-white/10 pt-3 flex justify-end">
            <button
              onClick={() => {
                soundEngine.playClick();
                onClose();
              }}
              id="btn-save-settings"
              className="px-7 py-3 rounded-2xl font-black text-sm uppercase tracking-wider text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition-all cursor-pointer flex items-center gap-2 shadow-[0_0_25px_rgba(168,85,247,0.5)] transform active:scale-95"
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
