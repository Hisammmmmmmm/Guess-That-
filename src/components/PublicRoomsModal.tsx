import React, { useState, useEffect, useCallback } from 'react';
import {
  X,
  Globe2,
  Users,
  Sparkles,
  RefreshCw,
  Music2,
  Eye,
  BrainCircuit,
  Bot,
  Filter,
  Play,
  ArrowRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PublicRoomSummary } from '../types';
import { multiplayerService } from '../services/multiplayerService';
import { soundEngine } from '../services/soundEngine';
import { t } from '../i18n/translations';

interface PublicRoomsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRoom: (room: PublicRoomSummary) => void;
  onOpenEnterCodeModal: () => void;
}

export const PublicRoomsModal: React.FC<PublicRoomsModalProps> = ({
  isOpen,
  onClose,
  onSelectRoom,
  onOpenEnterCodeModal,
}) => {
  const [rooms, setRooms] = useState<PublicRoomSummary[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedGameMode, setSelectedGameMode] = useState<string>('all');

  const fetchRooms = useCallback(async () => {
    setIsLoading(true);
    try {
      // 1. Try WebSocket request
      if (multiplayerService.isConnected()) {
        multiplayerService.requestPublicRooms(
          undefined,
          selectedGameMode === 'all' ? undefined : selectedGameMode
        );
      }

      // 2. Fetch via REST as immediate fallback / sync
      const params = new URLSearchParams();
      if (selectedGameMode !== 'all') params.append('gameMode', selectedGameMode);

      const res = await fetch(`/api/public-rooms?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.rooms)) {
          setRooms(data.rooms);
        }
      }
    } catch (err) {
      console.warn('Failed to load public rooms', err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedGameMode]);

  // Handle WebSocket rooms broadcast
  useEffect(() => {
    if (!isOpen) return;

    const handlePublicRoomsList = (data: any) => {
      if (Array.isArray(data.rooms)) {
        setRooms(data.rooms);
      }
    };

    multiplayerService.on('public_rooms_list', handlePublicRoomsList);
    fetchRooms();

    // Auto refresh every 4 seconds for live activity
    const interval = setInterval(() => {
      fetchRooms();
    }, 4000);

    return () => {
      multiplayerService.off('public_rooms_list', handlePublicRoomsList);
      clearInterval(interval);
    };
  }, [isOpen, fetchRooms]);

  if (!isOpen) return null;

  const handleJoinClick = (room: PublicRoomSummary) => {
    soundEngine.playClick();
    onSelectRoom(room);
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'music_blind_test':
        return <Music2 className="w-3.5 h-3.5 text-pink-400" />;
      case 'visual_blind_test':
        return <Eye className="w-3.5 h-3.5 text-emerald-400" />;
      case 'quiz':
      default:
        return <BrainCircuit className="w-3.5 h-3.5 text-purple-400" />;
    }
  };

  const getModeName = (mode: string) => {
    switch (mode) {
      case 'music_blind_test':
        return t('music_blind_test');
      case 'visual_blind_test':
        return t('visual_blind_test');
      case 'quiz':
      default:
        return t('quiz');
    }
  };

  const getStatusBadge = (status: string, currentQ: number = 0, totalQ: number = 0) => {
    switch (status) {
      case 'lobby':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {t('status_lobby')}
          </span>
        );
      case 'playing':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-purple-500/25 text-purple-200 border border-purple-400/40 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping" />
            {t('status_playing')} {totalQ > 0 ? `(${currentQ + 1}/${totalQ})` : ''}
          </span>
        );
      case 'question_result':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-black uppercase tracking-wider">
            {t('status_question_result')}
          </span>
        );
      case 'game_over':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[10px] font-black uppercase tracking-wider">
            {t('status_game_over')}
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            soundEngine.playClick();
            onClose();
          }}
          className="absolute inset-0 bg-black/80 backdrop-blur-xl"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          className="relative w-full max-w-4xl max-h-[90vh] rounded-[32px] border border-white/15 bg-[#0D071E]/95 shadow-[0_25px_70px_rgba(0,0,0,0.85)] p-4 sm:p-6 backdrop-blur-2xl flex flex-col gap-4 z-10 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500/30 to-pink-500/30 text-purple-200 border border-purple-400/40 shadow-lg">
                <Globe2 className="w-6 h-6 text-pink-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl sm:text-2xl font-black text-white font-heading">
                    {t('public_rooms')}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-black uppercase">
                    {rooms.length} {rooms.length === 1 ? 'salon' : 'salons'}
                  </span>
                </div>
                <p className="text-xs text-white/60 line-clamp-1">
                  {t('public_rooms_desc')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  fetchRooms();
                }}
                className={`p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 transition-all cursor-pointer ${
                  isLoading ? 'animate-spin text-purple-400' : ''
                }`}
                title={t('refresh_rooms')}
              >
                <RefreshCw className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  onClose();
                }}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white/5 p-3 rounded-2xl border border-white/10 shrink-0">
            {/* Game Mode Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white/60 flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-pink-400" />
                {t('filter_by_mode')}:
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  { id: 'all', label: t('all_modes') },
                  { id: 'music_blind_test', label: t('music_blind_test'), icon: <Music2 className="w-3 h-3 text-pink-400" /> },
                  { id: 'visual_blind_test', label: t('visual_blind_test'), icon: <Eye className="w-3 h-3 text-emerald-400" /> },
                  { id: 'quiz', label: t('quiz'), icon: <BrainCircuit className="w-3 h-3 text-purple-400" /> },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => {
                      soundEngine.playClick();
                      setSelectedGameMode(mode.id);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      selectedGameMode === mode.id
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-900/40 border border-purple-400'
                        : 'bg-white/5 hover:bg-white/10 text-white/70 border border-white/10'
                    }`}
                  >
                    {mode.icon}
                    <span>{mode.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Rooms Grid / List */}
          <div className="flex-1 overflow-y-auto min-h-0 pr-1 space-y-3">
            {rooms.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center gap-3 bg-white/5 rounded-3xl border border-white/10">
                <Globe2 className="w-12 h-12 text-white/20" />
                <p className="text-sm font-bold text-white/80">{t('no_public_rooms')}</p>
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playClick();
                    setSelectedGameMode('all');
                  }}
                  className="px-4 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 text-xs font-bold cursor-pointer transition-all"
                >
                  {t('all_modes')}
                </button>
              </div>
            ) : (
              rooms.map((room) => (
                <div
                  key={room.code}
                  className="group relative flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-3xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/50 transition-all gap-4 shadow-lg backdrop-blur-md overflow-hidden"
                >
                  {/* Left info */}
                  <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                    <div className="text-2xl p-2.5 rounded-2xl bg-white/10 border border-white/15 shrink-0 flex items-center justify-center shadow-inner">
                      {room.isBotRoom ? '🤖' : room.hostAvatar || '👑'}
                    </div>

                    <div className="flex flex-col gap-1 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-extrabold text-base text-white truncate max-w-[280px] sm:max-w-md">
                          {room.themeTitle || room.topic}
                        </span>

                        {room.isBotRoom && (
                          <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm">
                            <Bot className="w-3 h-3 text-amber-400" />
                            {t('bot_room_tag')}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-white/60">
                        {/* Mode */}
                        <span className="flex items-center gap-1 font-semibold text-white/80">
                          {getModeIcon(room.gameMode)}
                          {getModeName(room.gameMode)}
                        </span>

                        <span>•</span>

                        {/* Room Code */}
                        <span className="font-mono font-bold text-purple-300 tracking-wider">
                          #{room.code}
                        </span>

                        <span>•</span>

                        {/* Player Count */}
                        <span className="flex items-center gap-1 font-medium">
                          <Users className="w-3 h-3 text-white/50" />
                          {room.playerCount}/{room.maxPlayers || 8} {t('players')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Status & Join Button */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                    <div>{getStatusBadge(room.status, room.currentQuestionIndex, room.totalQuestions)}</div>

                    <button
                      type="button"
                      onClick={() => handleJoinClick(room)}
                      className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 hover:via-pink-500 hover:to-amber-400 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-purple-900/30 cursor-pointer transition-all transform hover:scale-105 active:scale-95 shrink-0"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{t('join_action')}</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Action Switcher */}
          <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div className="text-xs text-white/50 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>{t('step1_desc')}</span>
            </div>

            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                onClose();
                onOpenEnterCodeModal();
              }}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/15 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>{t('enter_code_btn')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
