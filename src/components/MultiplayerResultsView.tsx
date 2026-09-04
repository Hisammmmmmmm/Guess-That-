import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  RotateCcw,
  Sparkles,
  Crown,
  Users,
  Share2,
  Medal,
  Flame,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Headphones,
  Eye,
  Check,
  CheckCircle2,
  Radio,
  BookOpen,
  Star,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { RoomState, RoomPlayer, GameMode } from '../types';
import { soundEngine } from '../services/soundEngine';
import { multiplayerService } from '../services/multiplayerService';
import { quizLibraryService } from '../services/quizLibraryService';
import { t } from '../i18n/translations';

interface MultiplayerResultsViewProps {
  language?: string;
  roomState: RoomState;
  currentPlayerId: string;
  onReplayRoom?: () => void;
  onNewTheme?: () => void;
  onLeaveRoom?: () => void;
  onPlayClickSound?: () => void;
  onReplay?: () => void;
  onExitToMenu?: () => void;
  onSendReaction?: (emoji: string) => void;
  onOpenLibrary?: () => void;
}

const MODE_SUGGESTIONS: Record<GameMode, string[]> = {
  quiz: [
    '🎬 Blockbusters 90s',
    '🧙 Harry Potter & Magie',
    '⚡ Marvel & Super-Héros',
    '🍙 Mangas & Anime',
    '🌍 Géographie & Capitales',
    '🍕 Séries & Sitcoms',
  ],
  music_blind_test: [
    '🎸 Rock Légendaire',
    '🎹 OST Jeux Vidéo & Retro',
    '🎤 Pop & Hits des Années 2000',
    '🎬 Musiques de Films Cultes',
    '✨ Dessins Animés Disney',
    '🔥 Rap Français & US',
  ],
  visual_blind_test: [
    '🦁 Animaux Sauvages & Faune',
    '🗼 Monuments & Merveilles',
    '🎮 Logos & Héros de Jeux',
    '🎨 Peintures & Art',
    '🚗 Voitures & Marques Cultes',
    '🍕 Gastronomie & Spécialités',
  ],
};

export const MultiplayerResultsView: React.FC<MultiplayerResultsViewProps> = ({
  language = 'fr',
  roomState,
  currentPlayerId,
  onReplayRoom,
  onNewTheme,
  onLeaveRoom,
  onPlayClickSound,
  onReplay,
  onExitToMenu,
  onOpenLibrary,
}) => {
  const [copied, setCopied] = useState(false);
  const [selectedMode, setSelectedMode] = useState<GameMode>((roomState.gameMode as GameMode) || 'quiz');
  const [newTopicInput, setNewTopicInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [expandedPlayerId, setExpandedPlayerId] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const playersList: RoomPlayer[] = Object.values(roomState.players || {});
  const sortedPlayers = [...playersList].sort((a, b) => b.score - a.score);
  const isHost = roomState.hostId === currentPlayerId;

  // Auto-save room quiz to local library for this player (host or invited)
  useEffect(() => {
    if (roomState.quizData?.questions?.length) {
      const myPlayer = roomState.players?.[currentPlayerId];
      try {
        const savedItem = quizLibraryService.saveQuiz(roomState.quizData, {
          source: isHost ? 'generated' : 'invited',
          bestScore: myPlayer?.score || 0,
        });
        setIsSaved(true);
        setIsFavorite(savedItem.isFavorite);
      } catch (err) {
        console.warn('Error saving quiz to library in results view:', err);
      }
    }
  }, [roomState.quizData, roomState.status, currentPlayerId, isHost]);

  const handleToggleFavorite = () => {
    soundEngine.playClick();
    if (!roomState.quizData?.questions?.length) return;
    const item = quizLibraryService.findSavedItem(roomState.quizData);
    if (item) {
      const next = quizLibraryService.toggleFavorite(item.id);
      setIsFavorite(next);
    } else {
      const myPlayer = roomState.players?.[currentPlayerId];
      const newItem = quizLibraryService.saveQuiz(roomState.quizData, {
        source: isHost ? 'generated' : 'invited',
        isFavorite: true,
        bestScore: myPlayer?.score || 0,
      });
      setIsFavorite(newItem.isFavorite);
      setIsSaved(true);
    }
  };

  const firstPlace = sortedPlayers[0];
  const secondPlace = sortedPlayers[1];
  const thirdPlace = sortedPlayers[2];

  useEffect(() => {
    soundEngine.playFanfare();
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 },
    });
  }, []);

  const handleShare = () => {
    onPlayClickSound?.();
    const winnerText = firstPlace ? `🏆 ${firstPlace.name} (${firstPlace.score} pts)` : '';
    const text = `🎉 ${t('final_ranking', language)} : "${roomState.themeTitle || roomState.topic}"\n${winnerText}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSelectMode = (mode: GameMode) => {
    if (!isHost || isGenerating) return;
    onPlayClickSound?.();
    setSelectedMode(mode);
    multiplayerService.updateRoomSettings({
      code: roomState.code,
      gameMode: mode,
    });
  };

  const handleGenerateNewQuiz = async (topicOverride?: string) => {
    const topicToUse = (topicOverride || newTopicInput).trim();
    if (!topicToUse || isGenerating) return;
    setIsGenerating(true);
    onPlayClickSound?.();
    try {
      const response = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topicToUse,
          difficulty: roomState.difficulty || 'medium',
          language: roomState.language || language,
          gameMode: selectedMode,
        }),
      });
      const rawText = await response.text();
      let data: any;
      try {
        data = JSON.parse(rawText);
      } catch (parseErr) {
        if (response.status === 405) {
          throw new Error('Erreur 405 (Nginx Not Allowed) : Le serveur Nginx bloque les requêtes POST vers /api.');
        }
        throw new Error('Le serveur IA a renvoyé un format inattendu.');
      }
      if (!response.ok) {
        throw new Error(data?.error || `Erreur serveur (${response.status}) lors de la génération du quiz`);
      }
      const preparedData = {
        ...data,
        gameMode: selectedMode,
        difficulty: roomState.difficulty || 'medium',
        questions: (data.questions || []).map((q: any, idx: number) => ({
          ...q,
          id: idx + 1,
        })),
      };

      // Save immediately to host library
      try {
        quizLibraryService.saveQuiz(preparedData, {
          source: 'generated',
        });
      } catch (saveErr) {
        console.warn('Could not save chained quiz to library:', saveErr);
      }

      multiplayerService.restartWithQuiz(roomState.code, preparedData, {
        gameMode: selectedMode,
        difficulty: roomState.difficulty || 'medium',
      });
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Erreur lors de la génération du nouveau quiz.');
    } finally {
      setIsGenerating(false);
    }
  };

  const modesConfig: { id: GameMode; title: string; subtitle: string; icon: React.ReactNode; color: string; activeBorder: string; activeBg: string }[] = [
    {
      id: 'quiz',
      title: t('mode_quiz_title', language),
      subtitle: t('mode_quiz_desc', language),
      icon: <HelpCircle className="w-5 h-5 text-blue-400" />,
      color: 'from-blue-600 to-indigo-600',
      activeBorder: 'border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.35)]',
      activeBg: 'bg-blue-500/20',
    },
    {
      id: 'music_blind_test',
      title: t('mode_music_title', language),
      subtitle: t('mode_music_desc', language),
      icon: <Headphones className="w-5 h-5 text-fuchsia-400" />,
      color: 'from-fuchsia-600 to-pink-600',
      activeBorder: 'border-fuchsia-400 shadow-[0_0_20px_rgba(217,70,239,0.35)]',
      activeBg: 'bg-fuchsia-500/20',
    },
    {
      id: 'visual_blind_test',
      title: t('mode_visual_title', language),
      subtitle: t('mode_visual_desc', language),
      icon: <Eye className="w-5 h-5 text-amber-400" />,
      color: 'from-amber-500 to-orange-600',
      activeBorder: 'border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.35)]',
      activeBg: 'bg-amber-500/20',
    },
  ];

  const currentModeInfo = modesConfig.find((m) => m.id === selectedMode) || modesConfig[0];

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-4 sm:gap-8 py-2 sm:py-4 px-2 sm:px-6" id="multiplayer-results-view">
      {/* Top Banner & Podium */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative rounded-2xl sm:rounded-[36px] p-3.5 xs:p-5 sm:p-8 bg-white/5 border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl text-center flex flex-col items-center gap-3 sm:gap-6 overflow-hidden"
      >
        {/* Glow */}
        <div
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full opacity-25 filter blur-3xl pointer-events-none"
          style={{ backgroundColor: roomState.primaryColor || '#9333ea' }}
        />

        {/* Title */}
        <div>
          <span className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-extrabold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
            {t('final_podium', language)}
          </span>
          <h2 className="text-xl sm:text-4xl font-extrabold text-white font-heading mt-2 sm:mt-3">
            {roomState.themeTitle || roomState.topic}
          </h2>
          <p className="text-[11px] sm:text-sm text-white/60 mt-0.5 sm:mt-1">
            {t('multiplayer_ended_participants', language).replace('%s', String(playersList.length))}
          </p>
        </div>

        {/* 3D Animated Podium */}
        <div className="flex items-end justify-center gap-2 sm:gap-6 w-full max-w-lg mt-2 sm:mt-4 px-1">
          {/* 2nd Place (Silver) */}
          {secondPlace && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex-1 flex flex-col items-center min-w-0"
            >
              <span className="text-2xl xs:text-3xl sm:text-4xl mb-0.5 sm:mb-1">{secondPlace.avatar || '🥈'}</span>
              <span className="font-bold text-[11px] xs:text-xs sm:text-sm text-white truncate max-w-[75px] xs:max-w-[90px]">
                {secondPlace.name}
              </span>
              <span className="text-[10px] sm:text-xs font-black text-slate-300 mb-1 sm:mb-2">
                {secondPlace.score.toLocaleString()} pts
              </span>

              <div className="w-full h-16 xs:h-20 sm:h-28 rounded-t-xl sm:rounded-t-2xl bg-gradient-to-t from-slate-700/80 to-slate-500/80 border-t border-x border-slate-400/50 flex flex-col items-center justify-start pt-1.5 sm:pt-2 shadow-lg backdrop-blur-md">
                <span className="text-xl sm:text-3xl font-black text-slate-200">2</span>
                <span className="text-[9px] sm:text-[10px] uppercase tracking-wider font-bold text-slate-300">{t('silver', language)}</span>
              </div>
            </motion.div>
          )}

          {/* 1st Place (Gold Winner) */}
          {firstPlace && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex-1 flex flex-col items-center relative z-10 min-w-0"
            >
              <Crown className="w-4 h-4 sm:w-6 sm:h-6 text-amber-400 animate-bounce mb-0.5 sm:mb-1" />
              <span className="text-3xl xs:text-4xl sm:text-5xl mb-0.5 sm:mb-1">{firstPlace.avatar || '👑'}</span>
              <span className="font-black text-xs xs:text-sm sm:text-base text-yellow-300 truncate max-w-[90px] xs:max-w-[110px]">
                {firstPlace.name}
              </span>
              <span className="text-[11px] sm:text-sm font-black text-amber-400 mb-1 sm:mb-2">
                {firstPlace.score.toLocaleString()} pts
              </span>

              <div className="w-full h-24 xs:h-30 sm:h-40 rounded-t-xl sm:rounded-t-2xl bg-gradient-to-t from-amber-600/90 to-yellow-500/90 border-t border-x border-yellow-300/60 flex flex-col items-center justify-start pt-2 sm:pt-3 shadow-[0_0_30px_rgba(245,158,11,0.4)] backdrop-blur-md">
                <span className="text-2xl sm:text-4xl font-black text-white">1</span>
                <span className="text-[9px] sm:text-[10px] uppercase tracking-wider font-black text-yellow-100">{t('champion', language)}</span>
              </div>
            </motion.div>
          )}

          {/* 3rd Place (Bronze) */}
          {thirdPlace && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex-1 flex flex-col items-center min-w-0"
            >
              <span className="text-2xl xs:text-3xl sm:text-4xl mb-0.5 sm:mb-1">{thirdPlace.avatar || '🥉'}</span>
              <span className="font-bold text-[11px] xs:text-xs sm:text-sm text-white truncate max-w-[75px] xs:max-w-[90px]">
                {thirdPlace.name}
              </span>
              <span className="text-[10px] sm:text-xs font-black text-amber-600 mb-1 sm:mb-2">
                {thirdPlace.score.toLocaleString()} pts
              </span>

              <div className="w-full h-12 xs:h-16 sm:h-20 rounded-t-xl sm:rounded-t-2xl bg-gradient-to-t from-amber-900/80 to-amber-700/80 border-t border-x border-amber-600/50 flex flex-col items-center justify-start pt-1.5 sm:pt-2 shadow-lg backdrop-blur-md">
                <span className="text-xl sm:text-3xl font-black text-amber-200">3</span>
                <span className="text-[9px] sm:text-[10px] uppercase tracking-wider font-bold text-amber-300">{t('bronze', language)}</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Action / New Topic or Guest Waiting */}
        <div className="flex flex-col items-center justify-center w-full max-w-2xl pt-2 sm:pt-4 gap-3 sm:gap-4">
          {roomState.newQuizReady ? (
            <div className="flex flex-col gap-2.5 sm:gap-3 w-full p-3.5 sm:p-5 bg-purple-900/40 border border-purple-500/40 rounded-2xl sm:rounded-3xl backdrop-blur-xl shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg border ${currentModeInfo.activeBorder} ${currentModeInfo.activeBg}`}>
                    {currentModeInfo.icon}
                  </div>
                  <div className="text-left">
                    <span className="text-[10px] uppercase font-bold text-white/50 tracking-wider block">
                      {t('next_game_mode', language)}
                    </span>
                    <span className="text-xs font-black text-white">
                      {currentModeInfo.title}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-yellow-500/20 border border-yellow-500/40 text-yellow-300 text-[11px] sm:text-xs font-bold">
                  <Sparkles className="w-3 h-3 text-yellow-300" />
                  <span>{roomState.quizData?.questions?.length || 10} questions</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-yellow-300 font-bold text-xs sm:text-base text-center py-1">
                <Sparkles className="w-3.5 h-3.5 shrink-0 text-yellow-400" />
                <span className="line-clamp-2">{t('new_topic_loaded', language).replace('%s', roomState.themeTitle || roomState.topic)}</span>
              </div>

              {isHost ? (
                <div className="flex flex-col gap-2 w-full">
                  <button
                    onClick={() => {
                      soundEngine.playStartGame();
                      multiplayerService.startGame(roomState.code);
                    }}
                    id="btn-start-new-multiplayer-game"
                    className="w-full py-3 sm:py-3.5 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider text-white bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 hover:via-pink-500 hover:to-amber-400 shadow-[0_0_25px_rgba(168,85,247,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer transform active:scale-98"
                  >
                    <ArrowRight className="w-4 h-4" />
                    <span>{t('launch_game_players', language).replace('%s', String(playersList.length))}</span>
                  </button>
                  <button
                    onClick={() => {
                      onPlayClickSound?.();
                      multiplayerService.updateRoomSettings({
                        code: roomState.code,
                        gameMode: selectedMode,
                        newQuizReady: false,
                      });
                      // Allow re-generating another topic
                      setNewTopicInput('');
                    }}
                    id="btn-change-topic-again"
                    className="text-xs text-white/60 hover:text-white underline text-center py-1 transition-colors"
                  >
                    {t('other_theme', language)} / Changer de mode
                  </button>
                </div>
              ) : (
                <div className="text-xs text-purple-200 text-center font-semibold animate-pulse p-2">
                  {t('topic_loaded_waiting_host', language).replace('%s', roomState.players?.[roomState.hostId]?.name || t('host', language))}
                </div>
              )}
            </div>
          ) : isHost ? (
            <div className="flex flex-col gap-3 sm:gap-4 w-full p-3 sm:p-5 bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl backdrop-blur-xl shadow-xl">
              {/* Host Mode Selection */}
              <div className="flex flex-col gap-1.5 text-left w-full">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-extrabold text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    {t('change_mode_prompt', language)}
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-medium text-purple-300 bg-purple-900/40 border border-purple-500/30 px-2 sm:px-2.5 py-0.5 rounded-full">
                    👑 Hôte
                  </span>
                </div>

                {/* 3 Interactive Mode Tabs - Compact Responsive Grid */}
                <div className="grid grid-cols-3 gap-1.5 sm:gap-2 w-full pt-1" id="host-game-mode-selector">
                  {modesConfig.map((mode) => {
                    const isSelected = selectedMode === mode.id;
                    return (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => handleSelectMode(mode.id)}
                        id={`btn-mode-select-${mode.id}`}
                        disabled={isGenerating}
                        className={`relative p-2 sm:p-3 rounded-xl sm:rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col gap-1 sm:gap-1.5 ${
                          isSelected
                            ? `${mode.activeBorder} ${mode.activeBg} ring-2 ring-purple-400/40 bg-gradient-to-b from-white/15 to-white/5`
                            : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 opacity-75 hover:opacity-100'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-1 sm:gap-2 min-w-0">
                            {mode.icon}
                            <span className="text-[11px] xs:text-xs sm:text-sm font-extrabold text-white truncate">
                              {mode.title}
                            </span>
                          </div>
                          {isSelected && (
                            <div className="w-3.5 h-3.5 rounded-full bg-purple-500 flex items-center justify-center text-white shadow-sm shrink-0">
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </div>
                          )}
                        </div>
                        <span className="hidden sm:block text-[10px] text-white/60 line-clamp-1">
                          {mode.subtitle}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic Suggestions for selected mode (Hidden on vertical smartphone resolution) */}
              <div className="hidden sm:flex flex-col gap-1.5 text-left w-full">
                <span className="text-[11px] font-bold text-white/60 uppercase tracking-wider flex items-center gap-1">
                  {t('quick_suggestions', language)}
                </span>
                <div className="flex flex-wrap gap-1.5 w-full">
                  {(MODE_SUGGESTIONS[selectedMode] || MODE_SUGGESTIONS.quiz).map((sug, sIdx) => (
                    <button
                      key={sIdx}
                      type="button"
                      disabled={isGenerating}
                      onClick={() => {
                        const cleanTopic = sug.replace(/^[^\w\sÀ-ÿ]+/, '').trim();
                        setNewTopicInput(cleanTopic);
                        handleGenerateNewQuiz(cleanTopic);
                      }}
                      className="px-2.5 py-1 rounded-xl text-xs font-medium text-white/80 hover:text-white bg-white/5 hover:bg-purple-600/30 border border-white/10 hover:border-purple-400/40 transition-all cursor-pointer transform active:scale-95 disabled:opacity-50"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Topic Input & Generate Button */}
              <div className="flex flex-col gap-2 w-full pt-1">
                <div className="flex gap-1.5 sm:gap-2">
                  <input
                    type="text"
                    value={newTopicInput}
                    onChange={(e) => setNewTopicInput(e.target.value)}
                    placeholder={
                      selectedMode === 'music_blind_test'
                        ? 'Sujet musical (ex: Rock 80s, Anime, Pop...)'
                        : selectedMode === 'visual_blind_test'
                        ? 'Sujet visuel (ex: Logos, Animaux...)'
                        : t('new_topic_placeholder', language)
                    }
                    className="flex-1 bg-white/10 border border-white/20 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-white placeholder-white/40 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/50"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newTopicInput.trim() && !isGenerating) {
                        handleGenerateNewQuiz();
                      }
                    }}
                  />
                  <button
                    onClick={() => handleGenerateNewQuiz()}
                    disabled={isGenerating || !newTopicInput.trim()}
                    id="btn-generate-new-quiz"
                    className="px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-xl font-extrabold text-xs sm:text-sm text-white bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-500 hover:via-fuchsia-500 hover:to-pink-500 transition-all flex items-center justify-center gap-1.5 sm:gap-2 disabled:opacity-50 shadow-lg cursor-pointer shrink-0"
                  >
                    {isGenerating ? (
                      <span className="animate-spin">⏳</span>
                    ) : (
                      <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-300" />
                    )}
                    <span>{isGenerating ? t('loading', language) : t('generate_action', language)}</span>
                  </button>
                </div>
                <span className="text-[10px] sm:text-[11px] text-white/50 text-center">
                  {t('host_change_mode_hint', language)}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3 w-full p-5 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl text-center shadow-lg">
              <div className="flex items-center justify-center gap-2">
                <div className={`p-1.5 rounded-lg border ${currentModeInfo.activeBorder} ${currentModeInfo.activeBg}`}>
                  {currentModeInfo.icon}
                </div>
                <div className="text-left">
                  <span className="text-[10px] uppercase font-bold text-white/50 tracking-wider block">
                    {t('mode_selected_by_host', language)}
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold text-white">
                    {currentModeInfo.title}
                  </span>
                </div>
              </div>
              <div className="text-xs sm:text-sm text-white/80 font-semibold animate-pulse pt-1">
                {t('waiting_host_new_quiz', language)}
              </div>
            </div>
          )}

          <div className="flex flex-row items-center justify-center gap-2 sm:gap-3 w-full pt-1 sm:pt-2">
            <button
              onClick={() => {
                onPlayClickSound?.();
                if (onNewTheme) onNewTheme();
                else if (onExitToMenu) onExitToMenu();
              }}
              id="btn-new-theme-room"
              className="flex-1 px-3 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-bold text-[11px] sm:text-xs uppercase tracking-wider text-white/90 hover:text-white bg-white/5 hover:bg-white/10 border border-white/15 transition-all flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer backdrop-blur-md"
            >
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400 shrink-0" />
              <span className="truncate">{t('new_room_btn', language)}</span>
            </button>

            <button
              onClick={handleShare}
              id="btn-share-multiplayer"
              className="flex-1 px-3 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-bold text-[11px] sm:text-xs text-white/80 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer backdrop-blur-md"
            >
              <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400 shrink-0" />
              <span className="truncate">{copied ? t('results_copied', language) : t('share_result', language)}</span>
            </button>
          </div>

          {/* Library & Favorite row for multiplayer quiz */}
          <div className="flex items-center justify-center gap-2 w-full pt-1">
            <button
              onClick={handleToggleFavorite}
              id="btn-toggle-favorite-multi"
              className={`flex-1 py-2 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                isFavorite
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-md shadow-amber-500/20'
                  : 'bg-white/5 border-white/10 text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${isFavorite ? 'fill-amber-400 text-amber-400' : 'text-yellow-400'}`} />
              <span>{isFavorite ? 'Enregistré dans tes Favoris ⭐' : t('add_to_favorites', language)}</span>
            </button>

            {onOpenLibrary && (
              <button
                onClick={() => {
                  soundEngine.playClick();
                  onOpenLibrary();
                }}
                id="btn-open-library-from-multi"
                className="py-2 px-3.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-200 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 text-purple-300" />
                <span>Bibliothèque</span>
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Complete Final Leaderboard with Clickable Expandable Player Results */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xl font-extrabold text-white font-heading flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" />
            <span>{t('general_ranking', language).replace('%s', String(playersList.length))}</span>
          </h3>
          <span className="text-xs text-white/50 font-medium">{t('click_player_details', language)}</span>
        </div>

        <div className="flex flex-col gap-2">
          {sortedPlayers.map((player, idx) => {
            const isMe = player.id === currentPlayerId;
            const rank = idx + 1;
            let badge = `#${rank}`;
            if (rank === 1) badge = '🥇 1er';
            else if (rank === 2) badge = '🥈 2e';
            else if (rank === 3) badge = '🥉 3e';

            const isExpanded = expandedPlayerId === player.id;

            return (
              <div
                key={player.id}
                onClick={() => {
                  onPlayClickSound?.();
                  setExpandedPlayerId(isExpanded ? null : player.id);
                }}
                className={`p-4 rounded-2xl border flex flex-col transition-all cursor-pointer backdrop-blur-md ${
                  isMe
                    ? 'bg-purple-500/20 border-purple-400/50 shadow-[0_0_20px_rgba(168,85,247,0.25)] ring-1 ring-purple-400/50'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-extrabold text-xs sm:text-sm text-white/80 w-12 text-center shrink-0">
                      {badge}
                    </span>
                    <span className="text-2xl w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/15 shrink-0">
                      {player.avatar || '🦊'}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm text-white truncate">
                          {player.name}
                        </span>
                        {player.isHost && (
                          <span title={t('host', language)} className="flex items-center">
                            <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          </span>
                        )}
                      </div>
                      {player.maxStreak >= 2 && (
                        <span className="text-[10px] text-orange-400 font-bold flex items-center gap-0.5 mt-0.5">
                          <Flame className="w-3 h-3 fill-current" /> {t('max_streak', language)} : {player.maxStreak}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-right shrink-0">
                    <div>
                      <span className="text-base sm:text-lg font-black text-amber-300 font-heading block">
                        {player.score.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-white/50 block -mt-1 font-semibold">{t('points', language)}</span>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-purple-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-white/40" />
                    )}
                  </div>
                </div>

                {/* Expandable Details per Question */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pt-3 border-t border-white/10 flex flex-col gap-2 w-full overflow-hidden"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-1">
                        {t('results_per_question', language).replace('%s', player.name)}
                      </span>
                      {(roomState.quizData?.questions || []).map((q, qIdx) => {
                        const ans = player.answersHistory?.[qIdx];
                        const isCorrect = ans?.isCorrect;
                        const answered = ans !== undefined;
                        return (
                          <div
                            key={qIdx}
                            className="p-3 rounded-xl bg-black/40 border border-white/10 flex flex-col gap-1.5 text-xs"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-bold text-white/90">
                                {t('question', language)} {qIdx + 1} : {q.question}
                              </span>
                              <span
                                className={`px-2.5 py-1 rounded-md font-bold text-[10px] shrink-0 ${
                                  !answered
                                    ? 'bg-slate-500/20 text-slate-300 border border-slate-500/30'
                                    : isCorrect
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                }`}
                              >
                                {!answered
                                  ? `⌛ ${t('no_answer', language)}`
                                  : isCorrect
                                  ? `✅ +${ans.scoreEarned || 0} pts`
                                  : `❌ ${t('incorrect', language)}`}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-white/60 text-[11px] mt-0.5">
                              <span>
                                {t('player_choice', language)} <strong className="text-white">{ans?.selectedOption || t('none', language)}</strong>
                              </span>
                              <span>
                                {t('correct_answer_label', language)} <strong className="text-emerald-400">{q.correctAnswer}</strong>
                              </span>
                              {answered && (
                                <span className="text-white/40 ml-auto">⏱️ {ans.timeSpent}s</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
