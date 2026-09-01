import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  Users,
  Copy,
  Check,
  Play,
  ArrowLeft,
  Sparkles,
  Crown,
  Share2,
  Loader2,
  Radio,
  Edit2,
  X,
  Globe,
  RotateCcw,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { RoomState, RoomPlayer } from '../types';
import { soundEngine } from '../services/soundEngine';
import { t } from '../i18n/translations';

interface MultiplayerLobbyProps {
  language?: string;
  roomState: RoomState;
  currentPlayerId: string;
  isQuizGenerating?: boolean;
  generationStepText?: string;
  errorMessage?: string | null;
  onStartGame: () => void;
  onLeaveRoom: () => void;
  onSendReaction: (emoji: string) => void;
  onRetryGeneration?: () => void;
  onPlayClickSound?: () => void;
  onUpdateProfile?: (name: string, avatar: string) => void;
  onTogglePublic?: (isPublic: boolean) => void;
  floatingReactions?: { id: string; emoji: string; name: string }[];
}

const QUICK_EMOJIS = ['🔥', '🎉', '👏', '😂', '🚀', '👑'];
const AVATAR_CHOICES = ['👑', '🦊', '🦁', '🤖', '🚀', '⚡', '🎮', '🍕', '🎯', '🔥', '🐱', '🌟', '🦄', '🎧', '🏆', '💎'];

export const MultiplayerLobby: React.FC<MultiplayerLobbyProps> = ({
  language = 'fr',
  roomState,
  currentPlayerId,
  isQuizGenerating = false,
  generationStepText = '',
  errorMessage = null,
  onStartGame,
  onLeaveRoom,
  onSendReaction,
  onRetryGeneration,
  onPlayClickSound,
  onUpdateProfile,
  onTogglePublic,
  floatingReactions = [],
}) => {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const currentPlayer = roomState.players?.[currentPlayerId];
  const [editName, setEditName] = useState(currentPlayer?.name || '');
  const [editAvatar, setEditAvatar] = useState(currentPlayer?.avatar || (roomState.hostId === currentPlayerId ? '👑' : '🦊'));

  useEffect(() => {
    if (currentPlayer?.name) {
      setEditName(currentPlayer.name);
    }
    if (currentPlayer?.avatar) {
      setEditAvatar(currentPlayer.avatar);
    }
  }, [currentPlayer?.name, currentPlayer?.avatar]);

  const handleSaveProfile = (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = editName.trim();
    if (!trimmed) return;
    soundEngine.playClick();
    onUpdateProfile?.(trimmed, editAvatar);
    setIsEditingProfile(false);
  };

  const playersList: RoomPlayer[] = Object.values(roomState.players || {});
  const isHost = roomState.hostId === currentPlayerId;
  const questionsCount = roomState.quizData?.questions?.length || 0;
  const isReadyToPlay = !isQuizGenerating && questionsCount > 0;

  // Generate join URL
  const joinUrl = `${window.location.origin}${window.location.pathname}?room=${roomState.code}`;

  // Generate QR Code
  useEffect(() => {
    QRCode.toDataURL(joinUrl, {
      width: 200,
      margin: 1.5,
      color: {
        dark: '#0F0A1F',
        light: '#FFFFFF',
      },
    })
      .then((url) => setQrCodeDataUrl(url))
      .catch((err) => console.error('Failed to generate QR code', err));
  }, [joinUrl]);

  const handleCopyCode = () => {
    soundEngine.playClick();
    navigator.clipboard.writeText(roomState.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    soundEngine.playClick();
    navigator.clipboard.writeText(joinUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-2.5 sm:gap-3 py-1 px-2 sm:px-4 relative" id="multiplayer-lobby-view">
      {/* Floating Reactions Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        <AnimatePresence>
          {floatingReactions.map((r) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 50, scale: 0.5, x: Math.random() * 200 - 100 }}
              animate={{ opacity: 1, y: -250, scale: 1.4 }}
              exit={{ opacity: 0, scale: 1.8 }}
              transition={{ duration: 2, ease: 'easeOut' }}
              className="absolute bottom-24 left-1/2 flex flex-col items-center gap-1"
            >
              <span className="text-3xl filter drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]">
                {r.emoji}
              </span>
              <span className="text-[9px] font-bold text-white bg-black/70 px-2 py-0.5 rounded-full border border-white/20">
                {r.name}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Top Action Bar */}
      <div className="flex items-center justify-between">
        <button
          id="btn-leave-lobby"
          onClick={() => {
            soundEngine.playClick();
            onLeaveRoom();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/15 text-xs font-bold transition-all cursor-pointer backdrop-blur-md"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-purple-400" />
          <span>{t('quit_room', language)}</span>
        </button>

        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-300 text-[11px] font-black uppercase tracking-wider backdrop-blur-md">
          <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
          <span>{t('live_multiplayer_lobby', language)}</span>
        </div>
      </div>

      {/* Live AI Generation / Loading Banner or Error Banner */}
      {isQuizGenerating ? (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-2.5 sm:p-3 rounded-2xl bg-gradient-to-r from-purple-900/50 via-indigo-900/50 to-pink-900/50 border border-purple-400/40 backdrop-blur-md flex items-center justify-between gap-3 shadow-lg"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <Loader2 className="w-4 h-4 text-purple-300 animate-spin shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-white truncate">
                {t('preparing_questions_media', language)}
              </span>
              <span className="text-[10px] text-purple-200/70 truncate">
                {generationStepText || t('simultaneous_generation_hint', language)}
              </span>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-purple-500/30 border border-purple-400/50 text-[10px] font-extrabold text-purple-200 shrink-0 animate-pulse">
            {t('in_background', language)}
          </span>
        </motion.div>
      ) : errorMessage ? (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-2xl bg-rose-500/20 border border-rose-500/50 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <div className="flex flex-col min-w-0 text-left">
              <span className="text-xs font-bold text-rose-200">
                {t('error_label', language)}
              </span>
              <span className="text-[11px] text-rose-100/90 leading-tight">
                {errorMessage}
              </span>
            </div>
          </div>
          {isHost && onRetryGeneration && (
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                onRetryGeneration();
              }}
              id="banner-retry-generation-btn"
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shrink-0 cursor-pointer active:scale-95 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t('retry_ai_generation', language)}</span>
            </button>
          )}
        </motion.div>
      ) : null}

      {/* Main Compact Bento Grid (QR Code on Left, Room info & Players on Right) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 sm:gap-3 items-stretch">
        
        {/* Left Column: QR Code + Room Code Card (Col 1-5) */}
        <div className="md:col-span-5 bg-black/40 border border-white/15 rounded-2xl sm:rounded-3xl p-3 sm:p-4 backdrop-blur-xl flex flex-col items-center justify-between gap-3 shadow-xl relative overflow-hidden">
          {/* Subtle Glow */}
          <div
            className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full opacity-20 filter blur-2xl pointer-events-none"
            style={{ backgroundColor: roomState.primaryColor || '#9333ea' }}
          />

          <div className="text-center flex flex-col items-center gap-0.5">
            <span className="text-[10px] font-extrabold text-purple-300 uppercase tracking-widest">
              {t('join_with_phone', language)}
            </span>
            <span className="text-xs text-white/70">{t('scan_qr_to_enter', language)}</span>
          </div>

          {/* QR Code Display */}
          <div className="p-2 bg-white rounded-2xl shadow-2xl relative group">
            {qrCodeDataUrl ? (
              <img
                src={qrCodeDataUrl}
                alt="QR Code Salon"
                className="w-36 h-36 sm:w-40 sm:h-40 object-contain rounded-lg"
              />
            ) : (
              <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-lg bg-slate-900 flex items-center justify-center text-white/50 text-[10px]">
                {t('loading', language)}
              </div>
            )}
          </div>

          {/* Room Code Badge */}
          <div className="w-full flex items-center justify-between bg-white/10 px-3 py-2 rounded-xl border border-white/20">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300">{t('code_label', language)}</span>
              <span className="text-xl sm:text-2xl font-black font-heading tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-pink-200 to-amber-200">
                {roomState.code}
              </span>
            </div>
            <button
              id="btn-copy-code"
              onClick={handleCopyCode}
              className="p-1.5 rounded-lg bg-purple-500/30 hover:bg-purple-500/50 text-white transition-all cursor-pointer"
              title={t('copy_code', language)}
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Share Link Button */}
          <button
            id="btn-copy-link"
            onClick={handleCopyLink}
            className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-[11px] font-bold text-white flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-purple-400" />
            <span>{copiedLink ? t('link_copied_clipboard', language) : t('copy_invite_link', language)}</span>
          </button>

          {/* Public / Private Room Toggle */}
          <div className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-1.5 text-left">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/60 flex items-center gap-1">
                <Globe className="w-3 h-3 text-pink-400" />
                {t('public_room_visibility', language)}
              </span>

              {isHost ? (
                <button
                  type="button"
                  id="btn-toggle-public-room"
                  onClick={() => {
                    soundEngine.playClick();
                    const newPublicState = !roomState.isPublic;
                    onTogglePublic?.(newPublicState);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 border ${
                    roomState.isPublic
                      ? 'bg-emerald-500/25 text-emerald-300 border-emerald-400/50 shadow-[0_0_10px_rgba(52,211,153,0.3)]'
                      : 'bg-white/10 text-white/70 border-white/20 hover:bg-white/20'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${roomState.isPublic ? 'bg-emerald-400 animate-pulse' : 'bg-white/40'}`} />
                  <span>{roomState.isPublic ? t('public_rooms', language) : t('private_room_badge', language)}</span>
                </button>
              ) : (
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                  roomState.isPublic ? 'text-emerald-300 bg-emerald-500/20' : 'text-white/50 bg-white/10'
                }`}>
                  {roomState.isPublic ? t('public_rooms', language) : t('private_room_badge', language)}
                </span>
              )}
            </div>

            <p className="text-[10px] text-white/50 leading-tight">
              {roomState.isPublic
                ? t('public_room_toggle_desc', language)
                : t('private_room_toggle_desc', language)}
            </p>
          </div>
        </div>

        {/* Right Column: Theme details, Connected Players & Launch Button (Col 6-12) */}
        <div className="md:col-span-7 bg-black/40 border border-white/15 rounded-2xl sm:rounded-3xl p-3 sm:p-4 backdrop-blur-xl flex flex-col justify-between gap-2.5 shadow-xl">
          
          {/* Header Info */}
          <div className="flex flex-col gap-1 border-b border-white/10 pb-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">
                {t('selected_blind_test', language)}
              </span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30">
                {roomState.difficulty.toUpperCase()} • {roomState.gameMode === 'music_blind_test' ? t('music_blind_test', language) : roomState.gameMode === 'visual_blind_test' ? t('visual_blind_test', language) : t('quiz', language)}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white font-heading truncate">
              {roomState.themeTitle || roomState.topic}
            </h2>
            <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-[11px] text-white/70">
              <span>⏱️ {roomState.durationPerQuestion || 20}s / question</span>
              <span>🎯 {questionsCount > 0 ? `${questionsCount} ${t('questions_ready', language)}` : t('loading_questions', language)}</span>
            </div>
          </div>

          {/* Connected Players Grid */}
          <div className="flex flex-col gap-1.5 flex-1 min-h-0">
            {/* Header Players & Edit Profile Action */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-xs font-bold text-white">
                  {t('players_in_room', language)} ({playersList.length})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-white/50 hidden sm:inline">
                  {isHost ? t('you_are_the_host', language) : t('waiting_for_host', language)}
                </span>
              </div>
            </div>

            {/* Players List (Compact Chips) */}
            <div className="grid grid-cols-2 gap-1.5 max-h-36 sm:max-h-44 overflow-y-auto pr-1">
              {playersList.map((player) => {
                const isMe = player.id === currentPlayerId;
                return (
                  <div
                    key={player.id}
                    className={`p-2 rounded-xl border flex items-center justify-between transition-all backdrop-blur-md ${
                      isMe
                        ? 'bg-purple-500/20 border-purple-400/50 shadow-[0_0_15px_rgba(168,85,247,0.2)] ring-1 ring-purple-400/40'
                        : 'bg-white/5 border-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-lg w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center border border-white/15 shrink-0">
                        {player.avatar || '🦊'}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-xs text-white truncate max-w-[120px] sm:max-w-[150px]">
                            {player.name}
                          </span>
                          {player.isHost && (
                            <span title={t('host', language)} className="flex items-center">
                              <Crown className="w-3 h-3 text-amber-400 shrink-0" />
                            </span>
                          )}
                        </div>
                        <span className="text-[9px] text-white/50 flex items-center gap-1">
                          {isMe ? t('you', language) : t('ready', language)}
                        </span>
                      </div>
                    </div>

                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0 ml-1" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Reaction Bar */}
          <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-white/70">
              <Sparkles className="w-3 h-3 text-yellow-400 shrink-0" />
              <span className="hidden sm:inline">{t('reactions_label', language)}</span>
            </div>

            <div className="flex items-center gap-1.5">
              {QUICK_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => {
                    soundEngine.playClick();
                    onSendReaction(emoji);
                  }}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-sm sm:text-base transition-transform active:scale-90 hover:scale-110 cursor-pointer"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Launch Game Action Button / Error Retry Button */}
          <div>
            {errorMessage ? (
              <div className="flex flex-col gap-2.5 p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-center">
                <div className="flex items-center justify-center gap-2 text-rose-200 text-xs font-bold">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
                {isHost ? (
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playClick();
                      onRetryGeneration?.();
                    }}
                    id="btn-retry-multiplayer-generation"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 hover:from-rose-500 hover:via-purple-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-black uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all transform active:scale-95 cursor-pointer shadow-[0_0_20px_rgba(225,29,72,0.3)]"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>{t('retry_ai_generation', language)}</span>
                  </button>
                ) : (
                  <p className="text-[11px] text-rose-300/80">
                    {t('waiting_for_host', language)}
                  </p>
                )}
              </div>
            ) : isHost ? (
              <button
                onClick={() => {
                  if (isReadyToPlay) {
                    soundEngine.playStartGame();
                    onStartGame();
                  }
                }}
                disabled={!isReadyToPlay}
                id="btn-start-multiplayer-game"
                className={`w-full py-3 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider text-white transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer transform active:scale-98 ${
                  isReadyToPlay
                    ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 hover:via-pink-500 hover:to-amber-400 shadow-[0_0_25px_rgba(168,85,247,0.4)] hover:scale-[1.01]'
                    : 'bg-gray-700/50 border border-white/10 opacity-70 cursor-not-allowed'
                }`}
              >
                {isReadyToPlay ? (
                  <>
                    <Play className="w-4 h-4 fill-current text-white" />
                    <span>{t('start_game_players', language)} ({playersList.length} {playersList.length > 1 ? t('players', language).toLowerCase() : t('player', language).toLowerCase()})</span>
                  </>
                ) : (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-purple-300" />
                    <span>{t('loading_questions_waiting', language).replace('%s', String(playersList.length))}</span>
                  </>
                )}
              </button>
            ) : (
              <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-400/30 flex items-center justify-center gap-2 text-purple-200 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                <span>{t('waiting_host_to_launch', language).replace('%s', roomState.players?.[roomState.hostId]?.name || t('host', language))}</span>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Edit Profile (Host & Player Name/Avatar) Modal */}
      <AnimatePresence>
        {isEditingProfile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditingProfile(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-sm rounded-3xl border border-white/20 bg-[#120B26] p-5 sm:p-6 shadow-2xl backdrop-blur-2xl flex flex-col gap-4 z-10"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40">
                    <Edit2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      {isHost ? t('edit_host_name', language) : t('edit_profile', language)}
                    </h3>
                    <p className="text-[11px] text-white/60">
                      {t('visible_by_all_players', language)}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-white/80">{t('choose_avatar_label', language)}</label>
                  <div className="grid grid-cols-8 gap-1.5 p-2 rounded-2xl bg-white/5 border border-white/10">
                    {AVATAR_CHOICES.map((av) => (
                      <button
                        key={av}
                        type="button"
                        onClick={() => {
                          soundEngine.playClick();
                          setEditAvatar(av);
                        }}
                        className={`w-8 h-8 rounded-xl flex items-center justify-center text-lg transition-transform ${
                          editAvatar === av
                            ? 'bg-purple-500 text-white ring-2 ring-purple-300 scale-110 shadow-md'
                            : 'bg-white/5 hover:bg-white/15'
                        }`}
                      >
                        {av}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-white/80">
                    {isHost ? t('host_name_input_label', language) : t('your_nickname_input_label', language)}
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    maxLength={20}
                    placeholder={isHost ? 'Ex: Quiz Master Alex' : 'Ex: Thomas'}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/40"
                    autoFocus
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 text-xs font-bold transition-all cursor-pointer"
                  >
                    {t('cancel', language)}
                  </button>
                  <button
                    type="submit"
                    disabled={!editName.trim()}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-bold shadow-md cursor-pointer transition-all transform active:scale-95 disabled:opacity-50"
                  >
                    {t('save', language)}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
