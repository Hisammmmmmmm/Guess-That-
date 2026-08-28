import React, { useState, useEffect } from 'react';
import {
  X,
  Users,
  ArrowRight,
  Sparkles,
  Gamepad2,
  AlertCircle,
  Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { soundEngine } from '../services/soundEngine';

import { t } from '../i18n/translations';

interface JoinRoomModalProps {
  language?: string;
  isOpen: boolean;
  onClose: () => void;
  onJoinRoom: (code: string, playerName: string, avatar: string) => void;
  initialCode?: string;
  isConnecting?: boolean;
  errorMessage?: string | null;
}

const AVATARS = ['🦊', '🦁', '🤖', '🚀', '⚡', '👑', '🎮', '🍕', '🎯', '🔥', '🐱', '🌟'];

export const JoinRoomModal: React.FC<JoinRoomModalProps> = ({
  language = 'fr',
  isOpen,
  onClose,
  onJoinRoom,
  initialCode = '',
  isConnecting = false,
  errorMessage = null,
}) => {
  const [code, setCode] = useState(initialCode);
  const [playerName, setPlayerName] = useState('');
  const [avatar, setAvatar] = useState('🦊');
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (initialCode) {
      setCode(initialCode.toUpperCase());
    }
  }, [initialCode]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = code.trim().toUpperCase();
    const cleanName = playerName.trim();

    if (!cleanCode) {
      setLocalError(t('enter_room_code_error', language));
      return;
    }
    if (!cleanName) {
      setLocalError(t('enter_player_name_error', language));
      return;
    }

    setLocalError(null);
    soundEngine.playClick();
    onJoinRoom(cleanCode, cleanName, avatar);
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
          className="absolute inset-0 bg-black/75 backdrop-blur-xl"
        />

        {/* Dialog Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md rounded-[32px] border border-white/15 bg-[#0F0A1F]/95 shadow-[0_25px_60px_rgba(0,0,0,0.8)] p-6 sm:p-8 backdrop-blur-2xl flex flex-col gap-5 z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-md">
                <Users className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-white font-heading">{t('join_room', language)}</h3>
                <p className="text-xs text-white/60">
                  {t('join_modal_desc', language)}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                soundEngine.playClick();
                onClose();
              }}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {(localError || errorMessage) && (
            <div className="p-3 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{localError || errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Room Code */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-white/80 uppercase tracking-wider">
                {t('room_code_label', language)}
              </label>
              <input
                type="text"
                maxLength={8}
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Ex: 8XF72Q"
                className="w-full bg-white/5 border border-white/15 focus:border-purple-400 focus:bg-white/10 rounded-2xl px-4 py-3 text-lg font-black tracking-widest text-center text-white placeholder-white/20 uppercase transition-all outline-none"
                autoFocus={!initialCode}
              />
            </div>

            {/* Player Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-white/80 uppercase tracking-wider">
                {t('nickname_label', language)}
              </label>
              <input
                type="text"
                maxLength={20}
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Ex: Alex, MasterQuiz..."
                className="w-full bg-white/5 border border-white/15 focus:border-purple-400 focus:bg-white/10 rounded-2xl px-4 py-3 text-sm font-bold text-white placeholder-white/20 transition-all outline-none"
                autoFocus={Boolean(initialCode)}
              />
            </div>

            {/* Avatar Picker */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-white/80 uppercase tracking-wider">{t('choose_avatar', language)}</label>
              <div className="grid grid-cols-6 gap-2 p-2 rounded-2xl bg-white/5 border border-white/10">
                {AVATARS.map((av) => (
                  <button
                    key={av}
                    type="button"
                    onClick={() => {
                      soundEngine.playClick();
                      setAvatar(av);
                    }}
                    className={`h-11 rounded-xl flex items-center justify-center text-2xl transition-all cursor-pointer ${
                      avatar === av
                        ? 'bg-purple-600/40 border-2 border-purple-400 scale-110 shadow-md'
                        : 'hover:bg-white/10'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isConnecting}
              className="w-full py-4 rounded-2xl font-black text-sm uppercase tracking-wider text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition-all flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(168,85,247,0.5)] cursor-pointer transform active:scale-95 disabled:opacity-50 mt-2"
            >
              {isConnecting ? (
                <span>{t('connecting_room', language)}</span>
              ) : (
                <>
                  <span>{t('join_game', language)}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
