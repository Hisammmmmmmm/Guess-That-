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
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { RoomState, RoomPlayer } from '../types';
import { soundEngine } from '../services/soundEngine';
import { multiplayerService } from '../services/multiplayerService';

interface MultiplayerResultsViewProps {
  roomState: RoomState;
  currentPlayerId: string;
  onReplayRoom?: () => void;
  onNewTheme?: () => void;
  onLeaveRoom?: () => void;
  onPlayClickSound?: () => void;
  onReplay?: () => void;
  onExitToMenu?: () => void;
  onSendReaction?: (emoji: string) => void;
}

export const MultiplayerResultsView: React.FC<MultiplayerResultsViewProps> = ({
  roomState,
  currentPlayerId,
  onReplayRoom,
  onNewTheme,
  onLeaveRoom,
  onPlayClickSound,
  onReplay,
  onExitToMenu,
}) => {
  const [copied, setCopied] = useState(false);
  const [newTopicInput, setNewTopicInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [expandedPlayerId, setExpandedPlayerId] = useState<string | null>(null);

  const playersList: RoomPlayer[] = Object.values(roomState.players || {});
  const sortedPlayers = [...playersList].sort((a, b) => b.score - a.score);
  const isHost = roomState.hostId === currentPlayerId;

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
    const winnerText = firstPlace ? `🏆 Vainqueur : ${firstPlace.name} (${firstPlace.score} pts)` : '';
    const text = `🎉 Fin de la partie multijoueur sur Blind Test "${roomState.themeTitle || roomState.topic}" !\n${winnerText}\nRejoins-nous pour la prochaine !`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleGenerateNewQuiz = async () => {
    if (!newTopicInput.trim() || isGenerating) return;
    setIsGenerating(true);
    onPlayClickSound?.();
    try {
      const response = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: newTopicInput.trim(),
          difficulty: roomState.difficulty || 'medium',
          language: 'fr',
          gameMode: roomState.gameMode || 'quiz',
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la génération du quiz');
      }
      const preparedData = {
        ...data,
        questions: (data.questions || []).map((q: any, idx: number) => ({
          ...q,
          id: idx + 1,
        })),
      };
      multiplayerService.restartWithQuiz(roomState.code, preparedData);
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Erreur lors de la génération du nouveau quiz.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8 py-4 px-3 sm:px-6" id="multiplayer-results-view">
      {/* Top Banner & Podium */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative rounded-[32px] sm:rounded-[36px] p-6 sm:p-8 bg-white/5 border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl text-center flex flex-col items-center gap-6 overflow-hidden"
      >
        {/* Glow */}
        <div
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full opacity-25 filter blur-3xl pointer-events-none"
          style={{ backgroundColor: roomState.primaryColor || '#9333ea' }}
        />

        {/* Title */}
        <div>
          <span className="px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
            Podium Final du Salon
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-heading mt-3">
            {roomState.themeTitle || roomState.topic}
          </h2>
          <p className="text-xs sm:text-sm text-white/60 mt-1">
            Partie multijoueur terminée • {playersList.length} participants
          </p>
        </div>

        {/* 3D Animated Podium */}
        <div className="flex items-end justify-center gap-3 sm:gap-6 w-full max-w-lg mt-4 px-2">
          {/* 2nd Place (Silver) */}
          {secondPlace && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex-1 flex flex-col items-center"
            >
              <span className="text-3xl mb-1">{secondPlace.avatar || '🥈'}</span>
              <span className="font-bold text-xs sm:text-sm text-white truncate max-w-[90px]">
                {secondPlace.isHost && secondPlace.name && secondPlace.name !== 'Hôte' ? `${secondPlace.name} (Hôte)` : secondPlace.name}
              </span>
              <span className="text-xs font-black text-slate-300 mb-2">
                {secondPlace.score.toLocaleString()} pts
              </span>

              <div className="w-full h-24 sm:h-28 rounded-t-2xl bg-gradient-to-t from-slate-700/80 to-slate-500/80 border-t border-x border-slate-400/50 flex flex-col items-center justify-start pt-2 shadow-lg backdrop-blur-md">
                <span className="text-2xl sm:text-3xl font-black text-slate-200">2</span>
                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-300">ARGENT</span>
              </div>
            </motion.div>
          )}

          {/* 1st Place (Gold Winner) */}
          {firstPlace && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex-1 flex flex-col items-center relative z-10"
            >
              <Crown className="w-6 h-6 text-amber-400 animate-bounce mb-1" />
              <span className="text-4xl sm:text-5xl mb-1">{firstPlace.avatar || '👑'}</span>
              <span className="font-black text-sm sm:text-base text-yellow-300 truncate max-w-[110px]">
                {firstPlace.isHost && firstPlace.name && firstPlace.name !== 'Hôte' ? `${firstPlace.name} (Hôte)` : firstPlace.name}
              </span>
              <span className="text-xs sm:text-sm font-black text-amber-400 mb-2">
                {firstPlace.score.toLocaleString()} pts
              </span>

              <div className="w-full h-32 sm:h-40 rounded-t-2xl bg-gradient-to-t from-amber-600/90 to-yellow-500/90 border-t border-x border-yellow-300/60 flex flex-col items-center justify-start pt-3 shadow-[0_0_30px_rgba(245,158,11,0.4)] backdrop-blur-md">
                <span className="text-3xl sm:text-4xl font-black text-white">1</span>
                <span className="text-[10px] uppercase tracking-wider font-black text-yellow-100">CHAMPION</span>
              </div>
            </motion.div>
          )}

          {/* 3rd Place (Bronze) */}
          {thirdPlace && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex-1 flex flex-col items-center"
            >
              <span className="text-3xl mb-1">{thirdPlace.avatar || '🥉'}</span>
              <span className="font-bold text-xs sm:text-sm text-white truncate max-w-[90px]">
                {thirdPlace.isHost && thirdPlace.name && thirdPlace.name !== 'Hôte' ? `${thirdPlace.name} (Hôte)` : thirdPlace.name}
              </span>
              <span className="text-xs font-black text-amber-600 mb-2">
                {thirdPlace.score.toLocaleString()} pts
              </span>

              <div className="w-full h-16 sm:h-20 rounded-t-2xl bg-gradient-to-t from-amber-900/80 to-amber-700/80 border-t border-x border-amber-600/50 flex flex-col items-center justify-start pt-2 shadow-lg backdrop-blur-md">
                <span className="text-2xl sm:text-3xl font-black text-amber-200">3</span>
                <span className="text-[10px] uppercase tracking-wider font-bold text-amber-300">BRONZE</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Action / New Topic or Guest Waiting */}
        <div className="flex flex-col items-center justify-center w-full max-w-md pt-4 gap-3">
          {roomState.newQuizReady ? (
            <div className="flex flex-col gap-3 w-full p-4 bg-purple-900/40 border border-purple-500/40 rounded-2xl backdrop-blur-xl">
              <div className="flex items-center justify-center gap-2 text-yellow-300 font-bold text-sm text-center">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>Nouveau sujet chargé : "{roomState.themeTitle || roomState.topic}"</span>
              </div>
              {isHost ? (
                <button
                  onClick={() => {
                    soundEngine.playStartGame();
                    multiplayerService.startGame(roomState.code);
                  }}
                  id="btn-start-new-multiplayer-game"
                  className="w-full py-3.5 rounded-xl font-black text-sm uppercase tracking-wider text-white bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 hover:via-pink-500 hover:to-amber-400 shadow-[0_0_25px_rgba(168,85,247,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer transform active:scale-98"
                >
                  <ArrowRight className="w-5 h-5" />
                  <span>Lancer la partie ({playersList.length} joueur{playersList.length > 1 ? 's' : ''})</span>
                </button>
              ) : (
                <div className="text-xs text-purple-200 text-center font-semibold animate-pulse p-2">
                  ⏳ Sujet chargé ! En attente du lancement par l'hôte ({roomState.players?.[roomState.hostId]?.name || 'Hôte'})...
                </div>
              )}
            </div>
          ) : isHost ? (
            <div className="flex flex-col gap-2 w-full">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTopicInput}
                  onChange={(e) => setNewTopicInput(e.target.value)}
                  placeholder="Nouveau sujet (ex: Cinéma 90s, Histoire...)"
                  className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder-white/40 focus:outline-none focus:border-purple-400"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newTopicInput.trim() && !isGenerating) {
                      handleGenerateNewQuiz();
                    }
                  }}
                />
                <button
                  onClick={handleGenerateNewQuiz}
                  disabled={isGenerating || !newTopicInput.trim()}
                  id="btn-generate-new-quiz"
                  className="px-5 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg cursor-pointer shrink-0"
                >
                  {isGenerating ? (
                    <span className="animate-spin">⏳</span>
                  ) : (
                    <Sparkles className="w-4 h-4 text-yellow-300" />
                  )}
                  <span>{isGenerating ? 'Génération...' : 'Générer'}</span>
                </button>
              </div>
              <span className="text-[11px] text-white/50 text-center">
                En tant qu'hôte, tape un autre sujet pour générer un nouveau quiz et lancer la partie
              </span>
            </div>
          ) : (
            <div className="text-sm text-white/80 font-semibold p-4 bg-white/5 rounded-2xl border border-white/10 text-center w-full backdrop-blur-md">
              ⏳ En attente du choix de l'hôte pour un nouveau quiz...
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-3 w-full pt-2">
            <button
              onClick={() => {
                onPlayClickSound?.();
                onNewTheme?.() || onExitToMenu?.();
              }}
              id="btn-new-theme-room"
              className="flex-1 min-w-[140px] px-5 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider text-white/90 hover:text-white bg-white/5 hover:bg-white/10 border border-white/15 transition-all flex items-center justify-center gap-2 cursor-pointer backdrop-blur-md"
            >
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span>Nouveau Salon</span>
            </button>

            <button
              onClick={handleShare}
              id="btn-share-multiplayer"
              className="flex-1 min-w-[140px] px-5 py-3 rounded-2xl font-bold text-xs text-white/80 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer backdrop-blur-md"
            >
              <Share2 className="w-4 h-4 text-purple-400" />
              <span>{copied ? 'Résultats Copiés !' : 'Partager'}</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Complete Final Leaderboard with Clickable Expandable Player Results */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xl font-extrabold text-white font-heading flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" />
            <span>Classement Général ({playersList.length} Joueurs)</span>
          </h3>
          <span className="text-xs text-white/50 font-medium">Clique sur un joueur pour voir ses détails 👆</span>
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
                          {player.isHost && player.name && player.name !== 'Hôte' ? `${player.name} (Hôte)` : player.name}
                        </span>
                        {player.isHost && (
                          <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" title="Hôte" />
                        )}
                      </div>
                      {player.maxStreak >= 2 && (
                        <span className="text-[10px] text-orange-400 font-bold flex items-center gap-0.5 mt-0.5">
                          <Flame className="w-3 h-3 fill-current" /> Meilleure série : {player.maxStreak}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-right shrink-0">
                    <div>
                      <span className="text-base sm:text-lg font-black text-amber-300 font-heading block">
                        {player.score.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-white/50 block -mt-1 font-semibold">points</span>
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
                        Résultats par question pour {player.name} :
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
                                Question {qIdx + 1} : {q.question}
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
                                  ? '⌛ Pas de réponse'
                                  : isCorrect
                                  ? `✅ +${ans.scoreEarned || 0} pts`
                                  : '❌ Incorrect'}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-white/60 text-[11px] mt-0.5">
                              <span>
                                Son choix : <strong className="text-white">{ans?.selectedOption || 'Aucun'}</strong>
                              </span>
                              <span>
                                Réponse correcte : <strong className="text-emerald-400">{q.correctAnswer}</strong>
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
