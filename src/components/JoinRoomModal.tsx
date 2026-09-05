import React, { useState, useEffect } from 'react';
import {
  X,
  Users,
  ArrowRight,
  Sparkles,
  Gamepad2,
  AlertCircle,
  Check,
  Globe2,
  Lock,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { soundEngine } from '../services/soundEngine';
import { XboxBadge } from './XboxBadge';

import { t } from '../i18n/translations';

interface JoinRoomModalProps {
  language?: string;
  isOpen: boolean;
  onClose: () => void;
  onJoinRoom: (code: string, playerName: string, avatar: string) => void;
  onOpenPublicRooms?: () => void;
  initialCode?: string;
  defaultPlayerName?: string;
  defaultAvatar?: string;
  isCodeLocked?: boolean;
  isConnecting?: boolean;
  isJoining?: boolean;
  errorMessage?: string | null;
}

const AVATARS = ['🦊', '🦁', '🤖', '🚀', '⚡', '👑', '🎮', '🍕', '🎯', '🔥', '🐱', '🌟'];

export const JoinRoomModal: React.FC<JoinRoomModalProps> = ({
  language = 'fr',
  isOpen,
  onClose,
  onJoinRoom,
  onOpenPublicRooms,
  initialCode = '',
  defaultPlayerName = '',
  defaultAvatar = '🦊',
  isCodeLocked = false,
  isConnecting = false,
  isJoining = false,
  errorMessage = null,
}) => {
  const isActionLoading = isConnecting || isJoining;
  const [code, setCode] = useState(initialCode);
  const [playerName, setPlayerName] = useState(defaultPlayerName || '');
  const [avatar, setAvatar] = useState(defaultAvatar || '🦊');
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (initialCode) {
      setCode(initialCode.toUpperCase());
    }
  }, [initialCode]);

  useEffect(() => {
    if (defaultPlayerName && !playerName) {
      setPlayerName(defaultPlayerName);
    }
  }, [defaultPlayerName]);

  useEffect(() => {
    if (defaultAvatar) {
      setAvatar(defaultAvatar);
    }
  }, [defaultAvatar]);

  // Keyboard and gamepad handler for modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const isInput = e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement;
      if (e.key === 'Escape') {
        e.preventDefault();
        soundEngine.playClick();
        onClose();
        return;
      }
      if (e.key === 'y' || e.key === 'Y') {
        if (!isInput && onOpenPublicRooms && !isCodeLocked) {
          e.preventDefault();
          soundEngine.playClick();
          onClose();
          onOpenPublicRooms();
          return;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onOpenPublicRooms, isCodeLocked]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = (isCodeLocked && initialCode ? initialCode : code).trim().toUpperCase();
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
                  {isCodeLocked ? t('public_room_locked_badge', language) : t('join_modal_desc', language)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-white/50 bg-white/5 px-2 py-1 rounded-lg border border-white/10">
                <kbd className="font-mono text-[10px] text-white/80">Échap</kbd>
                <XboxBadge button="B" />
              </span>
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  onClose();
                }}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10 transition-all cursor-pointer"
                title="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
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
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-white/80 uppercase tracking-wider">
                  {t('room_code_label', language)}
                </label>
                {isCodeLocked && (
                  <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-pink-300 bg-pink-500/20 border border-pink-500/30 px-2 py-0.5 rounded-md">
                    <Lock className="w-3 h-3" />
                    <span>{t('room_public_label', language)}</span>
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type="text"
                  maxLength={8}
                  value={code}
                  onChange={(e) => {
                    if (!isCodeLocked) {
                      setCode(e.target.value.toUpperCase());
                    }
                  }}
                  readOnly={isCodeLocked}
                  placeholder="Ex: 8XF72Q"
                  className={`w-full rounded-2xl px-4 py-3 text-lg font-black tracking-widest text-center text-white placeholder-white/20 uppercase transition-all outline-none ${
                    isCodeLocked
                      ? 'bg-purple-950/40 border border-purple-500/50 text-purple-200 cursor-not-allowed select-none'
                      : 'bg-white/5 border border-white/15 focus:border-purple-400 focus:bg-white/10'
                  }`}
                  autoFocus={!initialCode || !isCodeLocked}
                />
                {isCodeLocked && (
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-pink-400 pointer-events-none">
                    <Lock className="w-4 h-4" />
                  </div>
                )}
              </div>
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
                autoFocus={Boolean(initialCode) || isCodeLocked}
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
                  <XboxBadge button="A" />
                  <span>{t('join_game', language)}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Switch to Public Rooms */}
            {onOpenPublicRooms && !isCodeLocked && (
              <div className="pt-2 border-t border-white/10 flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playClick();
                    onClose();
                    onOpenPublicRooms();
                  }}
                  className="text-xs font-bold text-purple-300 hover:text-purple-200 flex items-center gap-1.5 cursor-pointer py-1 transition-colors"
                >
                  <XboxBadge button="Y" />
                  <Globe2 className="w-3.5 h-3.5 text-pink-400" />
                  <span>{t('browse_public_rooms', language)}</span>
                </button>
              </div>
            )}
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
