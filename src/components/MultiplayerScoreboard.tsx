import React from 'react';
import { Trophy, Flame, Crown, CheckCircle2, Clock, Zap, Sparkles, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { RoomState, RoomPlayer } from '../types';
import { soundEngine } from '../services/soundEngine';
import { multiplayerService } from '../services/multiplayerService';

import { t } from '../i18n/translations';

interface MultiplayerScoreboardProps {
  language?: string;
  roomState: RoomState;
  currentPlayerId: string;
  onSendReaction?: (emoji: string) => void;
  className?: string;
}

const QUICK_REACTIONS = ['🔥', '🎉', '👏', '😂', '😱', '👑'];

export const MultiplayerScoreboard: React.FC<MultiplayerScoreboardProps> = ({
  language = 'fr',
  roomState,
  currentPlayerId,
  onSendReaction,
  className = '',
}) => {
  const playersList: RoomPlayer[] = Object.values(roomState.players || {});
  // Sort players by score descending
  const sortedPlayers = [...playersList].sort((a, b) => b.score - a.score);

  return (
    <div
      className={`w-full rounded-[28px] sm:rounded-[32px] p-4 sm:p-5 bg-white/5 border border-white/15 backdrop-blur-2xl shadow-[0_15px_40px_rgba(0,0,0,0.5)] flex flex-col gap-3 shrink-0 ${className}`}
      id="multiplayer-leaderboard-panel"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-extrabold text-white font-heading">{t('live_ranking', language)}</h3>
            <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
              <span className="text-[10px] text-white/50">{t('room', language)} : <span className="font-bold text-purple-300">{roomState.code}</span> ({playersList.length} {t('players_short', language)})
              </span>
              <button
                type="button"
                id="btn-refresh-room-game"
                onClick={() => {
                  soundEngine.playClick();
                  multiplayerService.refreshRoom(roomState.code);
                }}
                className="p-1 rounded-md bg-white/10 hover:bg-purple-500/30 border border-white/15 text-purple-300 hover:text-white transition-all cursor-pointer flex items-center justify-center"
                title={t('refresh_room', language)}
              >
                <RefreshCw className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Players List */}
      <div className="flex flex-col gap-2 overflow-y-auto max-h-[280px] sm:max-h-[380px] pr-1 hide-scrollbar">
        <AnimatePresence>
          {sortedPlayers.map((player, index) => {
            const isMe = player.id === currentPlayerId;
            const rank = index + 1;
            let medal = null;
            if (rank === 1) medal = '🥇';
            else if (rank === 2) medal = '🥈';
            else if (rank === 3) medal = '🥉';

            const isRevealed = roomState.status === 'question_result' || roomState.status === 'game_over';

            return (
              <motion.div
                key={player.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`p-2.5 sm:p-3 rounded-2xl border flex items-center justify-between gap-2 transition-all duration-300 backdrop-blur-md ${
                  isMe
                    ? 'bg-purple-500/25 border-purple-400/60 shadow-[0_0_15px_rgba(168,85,247,0.3)] ring-1 ring-purple-400/50'
                    : 'bg-white/5 border-white/10'
                }`}
              >
                {/* Left: Rank & Avatar & Name */}
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <span className="w-5 text-center font-extrabold text-xs text-white/70 shrink-0">
                    {medal || `#${rank}`}
                  </span>

                  <span className="text-xl w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center border border-white/15 shrink-0">
                    {player.avatar || '🦊'}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1">
                      <span className={`text-xs font-bold truncate ${isMe ? 'text-purple-200' : 'text-white'}`}>
                        {player.name}
                      </span>
                      {player.isHost && (
                        <span title={t('host', language)} className="flex items-center">
                          <Crown className="w-3 h-3 text-amber-400 shrink-0" />
                        </span>
                      )}
                    </div>

                    {/* Streak & Status */}
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {player.streak >= 2 && (
                        <span className="text-[9px] font-bold text-orange-400 flex items-center gap-0.5">
                          <Flame className="w-2.5 h-2.5 fill-current" /> {player.streak}
                        </span>
                      )}

                      {/* Question Answer Status */}
                      {!isRevealed ? (
                        player.answeredCurrent ? (
                          <span className="text-[9px] font-bold text-emerald-300 bg-emerald-500/20 px-1.5 py-0.2 rounded-full border border-emerald-500/30 flex items-center gap-0.5">
                            <CheckCircle2 className="w-2.5 h-2.5" />{t('answered', language)}</span>
                        ) : (
                          <span className="text-[9px] text-white/40 flex items-center gap-0.5 animate-pulse">
                            <Clock className="w-2.5 h-2.5" />{t('thinking', language)}</span>
                        )
                      ) : (
                        player.lastScoreEarned !== undefined && (
                          <span
                            className={`text-[9px] font-black px-1.5 py-0.2 rounded-full border flex items-center gap-0.5 ${
                              player.lastScoreEarned > 0
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                : 'bg-red-500/20 text-red-300 border-red-500/40'
                            }`}
                          >
                            {player.lastScoreEarned > 0 ? `+${player.lastScoreEarned}` : '0 pt'}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Score */}
                <div className="text-right shrink-0">
                  <span className="text-xs sm:text-sm font-black text-amber-300 font-heading">
                    {player.score.toLocaleString()}
                  </span>
                  <span className="text-[9px] text-white/50 block -mt-1 font-semibold">pts</span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Quick Reaction Footer Bar */}
      {onSendReaction && (
        <div className="border-t border-white/10 pt-2 flex items-center justify-between">
          <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-yellow-400" />{t('react', language)} :</span>
          <div className="flex items-center gap-1">
            {QUICK_REACTIONS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => {
                  soundEngine.playClick();
                  onSendReaction(emoji);
                }}
                className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-sm transition-transform active:scale-90 hover:scale-110 cursor-pointer"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
