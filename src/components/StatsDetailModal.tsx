import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Users,
  Gamepad2,
  Sparkles,
  Clock,
  Flame,
  Trophy,
  Play,
  Copy,
  Check,
  RotateCw,
  Crown,
  ArrowRight,
  Music,
  Image as ImageIcon,
  HelpCircle,
  Radio,
  ExternalLink,
} from 'lucide-react';
import { DetailedPlatformStats, ActivePlayerDetail, RecentQuizDetail, PublicRoomSummary } from '../types';
import { t } from '../i18n/translations';
import { soundEngine } from '../services/soundEngine';

interface StatsDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'players' | 'rooms' | 'quizzes';
  language: string;
  onJoinRoom?: (code: string) => void;
  onPlayQuizSolo?: (quizData: any, gameMode?: any, difficulty?: any) => void;
  onPlayQuizMulti?: (quizData: any, gameMode?: any, difficulty?: any) => void;
}

export const StatsDetailModal: React.FC<StatsDetailModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'players',
  language,
  onJoinRoom,
  onPlayQuizSolo,
  onPlayQuizMulti,
}) => {
  const [activeTab, setActiveTab] = useState<'players' | 'rooms' | 'quizzes'>(initialTab);
  const [stats, setStats] = useState<DetailedPlatformStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Sync tab when initialTab changes
  useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  const fetchDetails = useCallback(async (showLoading = false) => {
    if (showLoading) setIsLoading(true);
    try {
      const res = await fetch('/api/stats/details');
      if (res.ok) {
        const data: DetailedPlatformStats = await res.json();
        setStats(data);
      }
    } catch (e) {
      console.warn('Failed to fetch detailed stats', e);
    } finally {
      if (showLoading) setIsLoading(false);
    }
  }, []);

  // Poll stats while modal is open
  useEffect(() => {
    if (!isOpen) return;
    fetchDetails(true);
    const interval = setInterval(() => {
      fetchDetails(false);
    }, 4000);
    return () => clearInterval(interval);
  }, [isOpen, fetchDetails]);

  const handleCopyCode = (code: string) => {
    soundEngine.playClick();
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const formatRelativeTime = (timestamp: number) => {
    if (!timestamp) return 'Récemment';
    const diffSeconds = Math.max(1, Math.floor((Date.now() - timestamp) / 1000));
    if (diffSeconds < 60) return `Il y a ${diffSeconds} sec`;
    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) return `Il y a ${diffMinutes} min`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `Il y a ${diffHours} h`;
    return `Il y a ${Math.floor(diffHours / 24)} j`;
  };

  const getModeBadge = (mode: string) => {
    switch (mode) {
      case 'music_blind_test':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <Music className="w-3 h-3 text-emerald-400" />
            Blind Test Musical
          </span>
        );
      case 'visual_blind_test':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
            <ImageIcon className="w-3 h-3 text-purple-400" />
            Blind Test Visuel
          </span>
        );
      case 'quiz':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
            <HelpCircle className="w-3 h-3 text-blue-400" />
            Quiz QCM
          </span>
        );
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Facile</span>;
      case 'medium':
        return <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">Moyen</span>;
      case 'hard':
        return <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">Difficile</span>;
      case 'expert':
        return <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">Expert</span>;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string, currentQuestionIndex?: number, totalQuestions?: number) => {
    switch (status) {
      case 'playing':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <Radio className="w-2.5 h-2.5 text-amber-400 animate-pulse" />
            {totalQuestions ? `En jeu (Q ${Number(currentQuestionIndex || 0) + 1}/${totalQuestions})` : 'En jeu'}
          </span>
        );
      case 'lobby':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            En attente
          </span>
        );
      case 'question_result':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
            Résultats Question
          </span>
        );
      case 'game_over':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-white/70 border border-white/20">
            Terminé
          </span>
        );
    }
  };

  if (!isOpen) return null;

  const playersList = stats?.activePlayers || [];
  const roomsList = stats?.activeRoomsList || [];
  const recentQuizzes = stats?.recentQuizzes || [];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-hidden">
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

        {/* Dialog Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-4xl max-h-[90vh] rounded-[28px] sm:rounded-[36px] border border-white/15 bg-[#0D0B18]/95 shadow-[0_30px_90px_rgba(0,0,0,0.85)] p-4 sm:p-7 backdrop-blur-2xl flex flex-col gap-4 sm:gap-5 z-10 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3 sm:pb-4 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2.5 sm:p-3 rounded-2xl bg-gradient-to-tr from-purple-600/30 to-indigo-600/30 text-purple-300 border border-purple-500/30 shadow-inner">
                <Radio className="w-5 h-5 text-purple-400 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg sm:text-2xl font-black text-white font-heading tracking-tight">
                    {t('stats_modal_title', language)}
                  </h3>
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-extrabold border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    LIVE
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-white/60">
                  {t('stats_modal_subtitle', language)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  soundEngine.playClick();
                  fetchDetails(true);
                }}
                disabled={isLoading}
                className="p-2 sm:p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 transition-all cursor-pointer flex items-center gap-1 text-xs font-bold"
                title="Actualiser les données"
              >
                <RotateCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-purple-400' : ''}`} />
                <span className="hidden sm:inline">Actualiser</span>
              </button>

              <button
                onClick={() => {
                  soundEngine.playClick();
                  onClose();
                }}
                className="p-2 sm:p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 sm:gap-2 p-1 bg-black/40 rounded-2xl border border-white/10 shrink-0">
            {/* Tab 1: Joueurs Actifs */}
            <button
              onClick={() => {
                soundEngine.playClick();
                setActiveTab('players');
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 sm:py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                activeTab === 'players'
                  ? 'bg-gradient-to-r from-emerald-600/80 to-teal-600/80 text-white shadow-md border border-emerald-400/40'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Users className="w-4 h-4 text-emerald-400" />
              <span>{t('stats_tab_players', language)}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                activeTab === 'players' ? 'bg-black/40 text-emerald-200' : 'bg-white/10 text-white/70'
              }`}>
                {playersList.length}
              </span>
            </button>

            {/* Tab 2: Salons en Cours */}
            <button
              onClick={() => {
                soundEngine.playClick();
                setActiveTab('rooms');
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 sm:py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                activeTab === 'rooms'
                  ? 'bg-gradient-to-r from-amber-600/80 to-orange-600/80 text-white shadow-md border border-amber-400/40'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Gamepad2 className="w-4 h-4 text-amber-300" />
              <span>{t('stats_tab_rooms', language)}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                activeTab === 'rooms' ? 'bg-black/40 text-amber-200' : 'bg-white/10 text-white/70'
              }`}>
                {roomsList.length}
              </span>
            </button>

            {/* Tab 3: 10 Derniers Quiz */}
            <button
              onClick={() => {
                soundEngine.playClick();
                setActiveTab('quizzes');
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 sm:py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                activeTab === 'quizzes'
                  ? 'bg-gradient-to-r from-purple-600/80 to-indigo-600/80 text-white shadow-md border border-purple-400/40'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Sparkles className="w-4 h-4 text-purple-300" />
              <span>{t('stats_tab_quizzes', language)}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                activeTab === 'quizzes' ? 'bg-black/40 text-purple-200' : 'bg-white/10 text-white/70'
              }`}>
                {recentQuizzes.length}
              </span>
            </button>
          </div>

          {/* Tab Content Container */}
          <div className="flex-1 overflow-y-auto pr-1 space-y-3 min-h-[320px] max-h-[58vh]">
            {/* TAB 1: LISTE DES JOUEURS ACTIFS */}
            {activeTab === 'players' && (
              <div className="space-y-2.5">
                {playersList.length > 0 ? (
                  playersList.map((player) => (
                    <div
                      key={`${player.roomCode}-${player.id}`}
                      className="p-3 sm:p-4 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-emerald-500/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group"
                    >
                      {/* Player Info Left */}
                      <div className="flex items-center gap-3">
                        <div className="relative text-2xl sm:text-3xl w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-black/40 border border-white/15 flex items-center justify-center shrink-0 shadow-inner">
                          <span>{player.avatar}</span>
                          {player.isHost && (
                            <span className="absolute -top-1.5 -right-1.5 bg-amber-400 text-black text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-md flex items-center gap-0.5">
                              <Crown className="w-2.5 h-2.5 fill-black" /> Hôte
                            </span>
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-white text-sm sm:text-base tracking-tight">
                              {player.name}
                            </span>
                            <span className="w-2 h-2 rounded-full bg-emerald-400" title="En ligne"></span>
                          </div>

                          <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                            <span className="text-[10px] font-bold text-white/50">
                              {t('in_room_prefix', language)}:
                            </span>
                            <span className="font-mono text-[11px] font-black text-purple-300 bg-purple-500/20 px-1.5 py-0.5 rounded-md border border-purple-500/30">
                              #{player.roomCode}
                            </span>
                            <span className="text-white/20">•</span>
                            <span className="text-[11px] font-semibold text-white/80 truncate max-w-[180px] sm:max-w-[280px]">
                              {player.themeTitle || player.topic}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Room & Game Status Right */}
                      <div className="flex flex-wrap items-center gap-2 self-end sm:self-center">
                        {getModeBadge(player.gameMode)}
                        {getStatusBadge(player.status, player.currentQuestionIndex, player.totalQuestions)}

                        {player.score > 0 && (
                          <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-black/50 border border-white/10 text-xs font-black text-amber-300">
                            <Trophy className="w-3 h-3 text-amber-400" />
                            <span>{player.score.toLocaleString()}</span>
                            {player.streak >= 2 && (
                              <span className="flex items-center gap-0.5 text-orange-400 text-[10px] ml-1">
                                <Flame className="w-2.5 h-2.5" />x{player.streak}
                              </span>
                            )}
                          </div>
                        )}

                        {onJoinRoom && (
                          <button
                            onClick={() => {
                              soundEngine.playClick();
                              onClose();
                              onJoinRoom(player.roomCode);
                            }}
                            className="px-2.5 py-1 rounded-xl bg-purple-600/80 hover:bg-purple-600 text-white text-xs font-bold border border-purple-400/40 transition-all cursor-pointer flex items-center gap-1 shadow-sm"
                            title="Rejoindre ce salon"
                          >
                            <span>Rejoindre</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 px-4 rounded-3xl bg-white/[0.02] border border-white/10 flex flex-col items-center justify-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center text-2xl">
                      👥
                    </div>
                    <h4 className="text-base font-extrabold text-white font-heading">
                      {t('no_active_players', language)}
                    </h4>
                    <p className="text-xs text-white/50 max-w-sm">
                      {t('no_active_players_desc', language)}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: SALONS EN COURS */}
            {activeTab === 'rooms' && (
              <div className="space-y-2.5">
                {roomsList.length > 0 ? (
                  roomsList.map((room) => (
                    <div
                      key={room.code}
                      className="p-3.5 sm:p-4 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-amber-500/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group"
                    >
                      {/* Room Details Left */}
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-center justify-center shrink-0 text-xl font-black font-mono">
                          🎮
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm font-black text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-lg border border-amber-500/30 flex items-center gap-1">
                              #{room.code}
                              <button
                                onClick={() => handleCopyCode(room.code)}
                                className="hover:text-white transition-colors cursor-pointer"
                                title="Copier le code"
                              >
                                {copiedCode === room.code ? (
                                  <Check className="w-3 h-3 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            </span>
                            <span className="font-black text-white text-sm sm:text-base tracking-tight truncate max-w-[200px] sm:max-w-[300px]">
                              {room.themeTitle || room.topic}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-white/60">
                            <span>Hôte: <strong className="text-white">{room.hostName} {room.hostAvatar}</strong></span>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-emerald-300 font-bold">
                              <Users className="w-3 h-3" />
                              {room.playerCount}/{room.maxPlayers || 12} joueurs
                            </span>
                            {room.createdAt && (
                              <>
                                <span>•</span>
                                <span className="text-white/40">{formatRelativeTime(room.createdAt)}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Room Actions Right */}
                      <div className="flex flex-wrap items-center gap-2 self-end sm:self-center">
                        {getModeBadge(room.gameMode)}
                        {getDifficultyBadge(room.difficulty)}
                        {getStatusBadge(room.status, room.currentQuestionIndex, room.totalQuestions)}

                        {onJoinRoom && (
                          <button
                            onClick={() => {
                              soundEngine.playClick();
                              onClose();
                              onJoinRoom(room.code);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white text-xs font-bold shadow-md transform hover:-translate-y-0.5 transition-all cursor-pointer flex items-center gap-1.5"
                          >
                            <span>Rejoindre</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 px-4 rounded-3xl bg-white/[0.02] border border-white/10 flex flex-col items-center justify-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 flex items-center justify-center text-2xl">
                      🎮
                    </div>
                    <h4 className="text-base font-extrabold text-white font-heading">
                      {t('no_active_rooms', language)}
                    </h4>
                    <p className="text-xs text-white/50 max-w-sm">
                      {t('no_active_rooms_desc', language)}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: 10 DERNIERS QUIZ GÉNÉRÉS */}
            {activeTab === 'quizzes' && (
              <div className="space-y-2.5">
                {recentQuizzes.length > 0 ? (
                  recentQuizzes.map((quiz, idx) => (
                    <div
                      key={quiz.id || idx}
                      className="p-3.5 sm:p-4 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-purple-500/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group"
                    >
                      {/* Quiz Info Left */}
                      <div className="flex items-center gap-3">
                        <div
                          className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl border flex items-center justify-center shrink-0 text-xl font-bold shadow-md"
                          style={{
                            backgroundColor: `${quiz.primaryColor || '#9333ea'}25`,
                            borderColor: `${quiz.primaryColor || '#9333ea'}50`,
                            color: quiz.primaryColor || '#c084fc',
                          }}
                        >
                          {idx + 1}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h5 className="font-extrabold text-white text-sm sm:text-base tracking-tight truncate max-w-[220px] sm:max-w-[320px]">
                              {quiz.themeTitle || quiz.topic}
                            </h5>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-white/60">
                            <span className="text-purple-300 font-semibold">{quiz.topic}</span>
                            <span>•</span>
                            <span className="text-white/50">{quiz.questionCount || 15} questions</span>
                            <span>•</span>
                            <span className="text-white/40 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatRelativeTime(quiz.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Quiz Actions Right */}
                      <div className="flex flex-wrap items-center gap-2 self-end sm:self-center">
                        {getModeBadge(quiz.gameMode)}
                        {getDifficultyBadge(quiz.difficulty)}

                        {onPlayQuizSolo && quiz.quizData && (
                          <button
                            onClick={() => {
                              soundEngine.playClick();
                              onClose();
                              const effectiveMode = quiz.gameMode || quiz.quizData?.gameMode || 'quiz';
                              const effectiveDiff = quiz.difficulty || quiz.quizData?.difficulty || 'medium';
                              const preparedData = {
                                ...quiz.quizData,
                                gameMode: effectiveMode,
                                difficulty: effectiveDiff,
                              };
                              onPlayQuizSolo(preparedData, effectiveMode, effectiveDiff);
                            }}
                            className="px-2.5 py-1.5 rounded-xl bg-purple-600/70 hover:bg-purple-600 text-white text-xs font-bold border border-purple-400/40 transition-all cursor-pointer flex items-center gap-1 shadow-sm"
                            title="Lancer ce quiz en Solo"
                          >
                            <Play className="w-3 h-3 fill-white" />
                            <span>Solo</span>
                          </button>
                        )}

                        {onPlayQuizMulti && quiz.quizData && (
                          <button
                            onClick={() => {
                              soundEngine.playClick();
                              onClose();
                              const effectiveMode = quiz.gameMode || quiz.quizData?.gameMode || 'quiz';
                              const effectiveDiff = quiz.difficulty || quiz.quizData?.difficulty || 'medium';
                              const preparedData = {
                                ...quiz.quizData,
                                gameMode: effectiveMode,
                                difficulty: effectiveDiff,
                              };
                              onPlayQuizMulti(preparedData, effectiveMode, effectiveDiff);
                            }}
                            className="px-2.5 py-1.5 rounded-xl bg-indigo-600/70 hover:bg-indigo-600 text-white text-xs font-bold border border-indigo-400/40 transition-all cursor-pointer flex items-center gap-1 shadow-sm"
                            title="Créer un salon avec ce quiz"
                          >
                            <Users className="w-3 h-3" />
                            <span>Salon</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 px-4 rounded-3xl bg-white/[0.02] border border-white/10 flex flex-col items-center justify-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-300 flex items-center justify-center text-2xl">
                      ✨
                    </div>
                    <h4 className="text-base font-extrabold text-white font-heading">
                      {t('no_recent_quizzes', language)}
                    </h4>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
