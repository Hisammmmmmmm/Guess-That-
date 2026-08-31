import { t } from './i18n/translations';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import YouTube from 'react-youtube';
import {
  Sparkles,
  Loader2,
  AlertCircle,
  Wand2,
  Music,
  Flame,
  Volume2,
  RefreshCw,
  Coffee,
} from 'lucide-react';
import {
  QuizData,
  QuizTheme,
  GameSettings,
  GameStats,
  GlobalStats,
  GameScreen,
  Question,
  RoomState,
  RoomPlayer,
  GameDifficulty,
  GameMode,
  GameStyle,
} from './types';
import { PRESET_THEMES, PRESET_QUIZ_DATA } from './data/presetThemes';
import { generateFallbackQuiz } from './data/fallbackGenerator';
import { soundEngine } from './services/soundEngine';
import { multiplayerService } from './services/multiplayerService';
import { Navbar } from './components/Navbar';
import { DynamicBackground } from './components/DynamicBackground';
import { ThemeSelector } from './components/ThemeSelector';
import { CircularCountdown } from './components/CircularCountdown';
import { VisualClue } from './components/VisualClue';
import { AudioCluePlayer } from './components/AudioCluePlayer';
import { QuestionCard } from './components/QuestionCard';
import { ScoreBoard } from './components/ScoreBoard';
import { SettingsModal } from './components/SettingsModal';
import { ResultsView } from './components/ResultsView';
import { MultiplayerLobby } from './components/MultiplayerLobby';
import { JoinRoomModal } from './components/JoinRoomModal';
import { PublicRoomsModal } from './components/PublicRoomsModal';
import { MultiplayerScoreboard } from './components/MultiplayerScoreboard';
import { MultiplayerResultsView } from './components/MultiplayerResultsView';

// Fisher-Yates array shuffler
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Ensure options are thoroughly randomized so the correct answer is NEVER always Option A
function prepareQuizData(data: QuizData): QuizData {
  const qs = Array.isArray(data.questions) ? data.questions : [];
  return {
    ...data,
    questions: qs.map((q) => {
      let opts = Array.isArray(q.options) ? [...q.options] : [];
      if (!opts.includes(q.correctAnswer)) {
        if (opts.length > 0) opts[0] = q.correctAnswer;
        else opts.push(q.correctAnswer || 'Réponse Inconnue');
      }
      opts = shuffleArray(opts);
      return {
        ...q,
        options: opts,
      };
    }),
  };
}

export default function App() {
  const [screen, setScreen] = useState<GameScreen>('menu');
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [pendingQuizData, setPendingQuizData] = useState<QuizData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Question Interaction State
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [currentYtIndex, setCurrentYtIndex] = useState(0);
  const [scoreEarnedForCurrent, setScoreEarnedForCurrent] = useState(0);

  // Timer State
  const [timeLeft, setTimeLeft] = useState(20);
  const [timerActive, setTimerActive] = useState(false);
  const timerRef = useRef<number | null>(null);
  const lastTickSecondRef = useRef<number>(-1);

  // Settings State - Default speechCluesEnabled to false as requested (TTS disabled by default), menuMusicVolume at 10%, questionMusicVolume at 80%
  const [settings, setSettings] = useState<GameSettings>({
    difficulty: 'medium',
    gameMode: 'quiz',
    gameStyle: 'competitive',
    language: 'fr',
    durationPerQuestion: 20,
    masterVolume: 1.0,
    sfxVolume: 0.85,
    menuMusicVolume: 0.1,
    questionMusicVolume: 0.8,
    musicVolume: 0.1,
    soundEffectsEnabled: true,
    musicEnabled: true,
    progressiveBlur: true,
    speechCluesEnabled: false,
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Generation & Loading State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('Préparation du Blind Test...');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Retro Quiz Show menu music
  const RETRO_QUIZ_MENU_VIDEO_ID = 'n61OIl_gkVE'; // Retro Quiz Game Show 80s Soundtrack
  const [ytVideoId, setYtVideoId] = useState<string | null>(RETRO_QUIZ_MENU_VIDEO_ID);
  const ytCacheRef = useRef<Record<string, string>>({
    'retro quiz show music loop': RETRO_QUIZ_MENU_VIDEO_ID,
    'retro 80s arcade quiz game show music theme loop': RETRO_QUIZ_MENU_VIDEO_ID,
    'menu_retro_quiz': RETRO_QUIZ_MENU_VIDEO_ID,
  });

  // Stats State
  const [stats, setStats] = useState<GameStats>({
    score: 0,
    streak: 0,
    maxStreak: 0,
    correctAnswers: 0,
    totalQuestions: 15,
    totalTimeSpent: 0,
    answers: [],
  });

  // Global Platform Statistics (Live players, Active rooms, Total generations)
  const [globalStats, setGlobalStats] = useState<GlobalStats>({
    onlinePlayers: 1,
    activeRooms: 0,
    totalGenerations: 1842,
  });

  const bgYtPlayerRef = useRef<any>(null);
  const mainYtPlayerRef = useRef<any>(null);

  // --- MULTIPLAYER ROOM STATE ---
  const [roomState, setRoomState] = useState<RoomState | null>(null);
  const [currentPlayerId, setCurrentPlayerId] = useState<string | null>(null);
  const [currentRoomCode, setCurrentRoomCode] = useState<string | null>(null);
  const currentRoomCodeRef = useRef<string | null>(null);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isPublicRoomsModalOpen, setIsPublicRoomsModalOpen] = useState(false);
  const [joinModalInitialCode, setJoinModalInitialCode] = useState('');
  const [isJoinModalCodeLocked, setIsJoinModalCodeLocked] = useState(false);
  const [isJoiningRoom, setIsJoiningRoom] = useState(false);
  const [joinErrorMessage, setJoinErrorMessage] = useState<string | null>(null);
  const [floatingReactions, setFloatingReactions] = useState<{ id: string; emoji: string; name: string }[]>([]);

  // Stored player profile (Host or guest)
  const [profileName, setProfileName] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('guessthat_player_name');
      if (saved && saved.trim() && saved !== 'Hôte' && saved !== 'Host') {
        return saved.trim();
      }
      return 'Michel';
    } catch {
      return 'Michel';
    }
  });
  const [profileAvatar, setProfileAvatar] = useState<string>(() => {
    try {
      return localStorage.getItem('guessthat_player_avatar') || '👑';
    } catch {
      return '👑';
    }
  });

  const handleUpdateProfile = useCallback((name: string, avatar: string) => {
    setProfileName(name);
    setProfileAvatar(avatar);
    try {
      localStorage.setItem('guessthat_player_name', name);
      localStorage.setItem('guessthat_player_avatar', avatar);
    } catch (e) {
      console.warn('Could not save profile in localStorage', e);
    }
    const targetRoom = currentRoomCodeRef.current || currentRoomCode;
    multiplayerService.updatePlayer({
      code: targetRoom || undefined,
      name,
      avatar,
    });
  }, [currentRoomCode]);

  // 5-second automatic progression timer after time up or question result
  const autoAdvanceTimerRef = useRef<any>(null);
  const [autoAdvanceCountdown, setAutoAdvanceCountdown] = useState<number | null>(null);
  const handleNextQuestionRef = useRef<() => void>(() => {});

  const clearAutoAdvanceTimer = useCallback(() => {
    if (autoAdvanceTimerRef.current) {
      clearInterval(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
    setAutoAdvanceCountdown(null);
  }, []);

  const startAutoAdvanceTimer = useCallback((seconds: number = 5) => {
    if (autoAdvanceTimerRef.current) {
      clearInterval(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
    setAutoAdvanceCountdown(seconds);
    let count = seconds;

    autoAdvanceTimerRef.current = window.setInterval(() => {
      count -= 1;
      if (count <= 0) {
        if (autoAdvanceTimerRef.current) {
          clearInterval(autoAdvanceTimerRef.current);
          autoAdvanceTimerRef.current = null;
        }
        setAutoAdvanceCountdown(null);
        handleNextQuestionRef.current?.();
      } else {
        setAutoAdvanceCountdown(count);
      }
    }, 1000);
  }, []);

  // Check URL params for direct join ?room=CODE on load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roomCodeParam = params.get('room');
    if (roomCodeParam) {
      setJoinModalInitialCode(roomCodeParam.toUpperCase());
      setIsJoinModalOpen(true);
    }
  }, []);

  // Subscribe to Multiplayer WebSocket events
  useEffect(() => {
    const handleRoomCreated = (data: any) => {
      currentRoomCodeRef.current = data.code;
      setRoomState(data.room);
      setCurrentPlayerId(data.playerId);
      setCurrentRoomCode(data.code);
      if (data.room?.quizData?.questions?.length > 0) {
        setQuizData(data.room.quizData);
      }
      setScreen('room_lobby');
      setIsJoiningRoom(false);
    };

    const handleRoomJoined = (data: any) => {
      currentRoomCodeRef.current = data.code;
      setRoomState(data.room);
      setCurrentPlayerId(data.playerId);
      setCurrentRoomCode(data.code);
      if (data.room?.quizData?.questions?.length > 0) {
        setQuizData(data.room.quizData);
        setSettings((prev) => ({
          ...prev,
          difficulty: data.room.difficulty,
          gameMode: data.room.gameMode,
          gameStyle: 'competitive_room',
          durationPerQuestion: data.room.durationPerQuestion || 20,
        }));
      }
      setIsJoinModalOpen(false);
      setIsJoiningRoom(false);

      if (data.room.status === 'playing') {
        setCurrentQuestionIndex(data.room.currentQuestionIndex || 0);
        setSelectedOption(null);
        setIsAnswered(false);
        setScreen('playing');
      } else {
        setScreen('room_lobby');
      }
    };

    const handleRoomUpdated = (data: any) => {
      if (!data?.room) return;
      setRoomState(data.room);
      if (data.room.gameMode) {
        setSettings((prev) => ({ ...prev, gameMode: data.room.gameMode }));
      }
      if (data.room.difficulty) {
        setSettings((prev) => ({ ...prev, difficulty: data.room.difficulty }));
      }
      if (data.room?.quizData?.questions?.length > 0) {
        setQuizData(data.room.quizData);
        setPendingQuizData(data.room.quizData);
      }

      if (data.room.status === 'question_result') {
        setIsAnswered(true);
        if (ttsAudioRef.current) {
          ttsAudioRef.current.pause();
          ttsAudioRef.current = null;
        }
        if (currentPlayerId && data.room.players?.[currentPlayerId]) {
          const me = data.room.players[currentPlayerId];
          if (me.lastScoreEarned > 0) {
            setScoreEarnedForCurrent(me.lastScoreEarned);
          }
        }
        startAutoAdvanceTimer(5);
      } else if (data.room.status === 'playing' && data.room.currentQuestionIndex !== undefined) {
        const nextQIndex = data.room.currentQuestionIndex;
        setCurrentQuestionIndex((prev) => {
          const isNewQ = prev !== nextQIndex;
          if (isNewQ) {
            clearAutoAdvanceTimer();
            if (ttsAudioRef.current) {
              ttsAudioRef.current.pause();
              ttsAudioRef.current = null;
            }
            setSelectedOption(null);
            setIsAnswered(false);
            setScoreEarnedForCurrent(0);

            const duration = data.room.durationPerQuestion || settings.durationPerQuestion || 20;
            const elapsed = data.room.questionStartTime ? Math.max(0, (Date.now() - data.room.questionStartTime) / 1000) : 0;
            const remaining = Math.max(0.5, duration - elapsed);
            setTimeLeft(remaining);
            lastTickSecondRef.current = -1;
            setScreen('playing');
            soundEngine.playQuestionTransition();
            return nextQIndex;
          }
          return prev;
        });

        // If player already answered in this room question
        if (currentPlayerId && data.room.players?.[currentPlayerId]?.answeredCurrent) {
          const me = data.room.players[currentPlayerId];
          if (me.selectedOption) setSelectedOption(me.selectedOption);
        }
      } else if (data.room.status === 'game_over') {
        clearAutoAdvanceTimer();
        stopTimer();
        soundEngine.stopAmbience();
        setScreen('room_results');
      }
    };

    const handleGameStarted = (data: any) => {
      clearAutoAdvanceTimer();
      if (ttsAudioRef.current) {
        ttsAudioRef.current.pause();
        ttsAudioRef.current = null;
      }
      setRoomState(data.room);
      if (data.room?.quizData) {
        setQuizData(data.room.quizData);
      }
      setCurrentQuestionIndex(data.room.currentQuestionIndex || 0);
      setSelectedOption(null);
      setIsAnswered(false);
      setScoreEarnedForCurrent(0);

      const duration = data.room?.durationPerQuestion || settings.durationPerQuestion || 20;
      const elapsed = data.room?.questionStartTime ? Math.max(0, (Date.now() - data.room.questionStartTime) / 1000) : 0;
      const remaining = Math.max(0.5, duration - elapsed);
      setTimeLeft(remaining);
      lastTickSecondRef.current = -1;
      setScreen('playing');

      soundEngine.playStartGame();
      if (settings.musicEnabled && data.room.gameMode !== 'music_blind_test') {
        soundEngine.startAmbience(data.room.quizData?.ambientSound || 'synthwave');
      }
    };

    const handleQuestionRevealed = (data: any) => {
      setRoomState(data.room);
      setIsAnswered(true);
      if (ttsAudioRef.current) {
        ttsAudioRef.current.pause();
        ttsAudioRef.current = null;
      }

      if (currentPlayerId && data.room?.players?.[currentPlayerId]) {
        const me = data.room.players[currentPlayerId];
        if (me.lastScoreEarned > 0) {
          setScoreEarnedForCurrent(me.lastScoreEarned);
          soundEngine.playCorrect();
        } else {
          setScoreEarnedForCurrent(0);
          soundEngine.playWrong();
        }
      }

      // Auto advance to next question after 5 seconds
      startAutoAdvanceTimer(5);
    };

    const handleNextQuestionStarted = (data: any) => {
      clearAutoAdvanceTimer();
      if (ttsAudioRef.current) {
        ttsAudioRef.current.pause();
        ttsAudioRef.current = null;
      }
      setRoomState(data.room);
      if (data.room?.quizData) {
        setQuizData(data.room.quizData);
      }
      setCurrentQuestionIndex(data.room.currentQuestionIndex);
      setSelectedOption(null);
      setIsAnswered(false);
      setScoreEarnedForCurrent(0);

      const duration = data.room?.durationPerQuestion || settings.durationPerQuestion || 20;
      const elapsed = data.room?.questionStartTime ? Math.max(0, (Date.now() - data.room.questionStartTime) / 1000) : 0;
      const remaining = Math.max(0.5, duration - elapsed);
      setTimeLeft(remaining);
      lastTickSecondRef.current = -1;
      setScreen('playing');
      soundEngine.playQuestionTransition();
    };

    const handleGameOver = (data: any) => {
      clearAutoAdvanceTimer();
      if (ttsAudioRef.current) {
        ttsAudioRef.current.pause();
        ttsAudioRef.current = null;
      }
      setRoomState(data.room);
      stopTimer();
      soundEngine.stopAmbience();
      soundEngine.playGameOver();
      setScreen('room_results');
    };

    const handleReaction = (data: any) => {
      const item = {
        id: Math.random().toString(),
        emoji: data.emoji,
        name: data.playerName,
      };
      setFloatingReactions((prev) => [...prev.slice(-8), item]);
      soundEngine.playMenuSelect();
      setTimeout(() => {
        setFloatingReactions((prev) => prev.filter((r) => r.id !== item.id));
      }, 2500);
    };

    const handleError = (data: any) => {
      setIsJoiningRoom(false);
      setJoinErrorMessage(data.message || 'Erreur salon.');
    };

    multiplayerService.on('room_created', handleRoomCreated);
    multiplayerService.on('room_joined', handleRoomJoined);
    multiplayerService.on('joined_room', handleRoomJoined);
    multiplayerService.on('room_state', handleRoomUpdated);
    multiplayerService.on('room_updated', handleRoomUpdated);
    multiplayerService.on('game_started', handleGameStarted);
    multiplayerService.on('question_revealed', handleQuestionRevealed);
    multiplayerService.on('next_question_started', handleNextQuestionStarted);
    multiplayerService.on('game_over', handleGameOver);
    multiplayerService.on('reaction', handleReaction);
    multiplayerService.on('error', handleError);

    const handleVisibilityOrFocus = () => {
      const code = currentRoomCodeRef.current || currentRoomCode;
      if (code && multiplayerService.isConnected()) {
        multiplayerService.refreshRoom(code);
      }
    };

    window.addEventListener('focus', handleVisibilityOrFocus);
    document.addEventListener('visibilitychange', handleVisibilityOrFocus);

    return () => {
      window.removeEventListener('focus', handleVisibilityOrFocus);
      document.removeEventListener('visibilitychange', handleVisibilityOrFocus);
      multiplayerService.off('room_created', handleRoomCreated);
      multiplayerService.off('room_joined', handleRoomJoined);
      multiplayerService.off('joined_room', handleRoomJoined);
      multiplayerService.off('room_state', handleRoomUpdated);
      multiplayerService.off('room_updated', handleRoomUpdated);
      multiplayerService.off('game_started', handleGameStarted);
      multiplayerService.off('question_revealed', handleQuestionRevealed);
      multiplayerService.off('next_question_started', handleNextQuestionStarted);
      multiplayerService.off('game_over', handleGameOver);
      multiplayerService.off('reaction', handleReaction);
      multiplayerService.off('error', handleError);
    };
  }, [currentPlayerId, quizData, settings.durationPerQuestion, settings.musicEnabled]);

  // Global platform stats synchronization (Initial fetch + WebSocket listener + polling fallback)
  useEffect(() => {
    fetch('/api/stats')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && typeof data.totalGenerations === 'number') {
          setGlobalStats(data);
        }
      })
      .catch((err) => console.warn('Could not fetch global stats', err));

    const handleGlobalStats = (data: any) => {
      if (data?.stats) {
        setGlobalStats(data.stats);
      }
    };

    multiplayerService.on('global_stats', handleGlobalStats);

    const statsInterval = setInterval(() => {
      if (multiplayerService.isConnected()) {
        multiplayerService.requestStats();
      } else {
        fetch('/api/stats')
          .then((res) => (res.ok ? res.json() : null))
          .then((data) => {
            if (data && typeof data.totalGenerations === 'number') {
              setGlobalStats(data);
            }
          })
          .catch(() => {});
      }
    }, 15000);

    return () => {
      clearInterval(statsInterval);
      multiplayerService.off('global_stats', handleGlobalStats);
    };
  }, []);

  const updateSettings = (newSettings: Partial<GameSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      const master = updated.masterVolume ?? 1.0;

      if (newSettings.masterVolume !== undefined) {
        soundEngine.setMasterVolume(newSettings.masterVolume);
        if (bgYtPlayerRef.current && typeof bgYtPlayerRef.current.setVolume === 'function') {
          try {
            const menuVol = updated.menuMusicVolume ?? 0.1;
            bgYtPlayerRef.current.setVolume(Math.min(100, Math.max(0, Math.round(menuVol * master * 100))));
          } catch {}
        }
        if (mainYtPlayerRef.current && typeof mainYtPlayerRef.current.setVolume === 'function') {
          try {
            const baseQVol = updated.questionMusicVolume ?? 0.8;
            const modeMultiplier = updated.gameMode === 'music_blind_test' ? 1.2 : 1.0;
            const qVol = Math.min(1.0, baseQVol * modeMultiplier);
            mainYtPlayerRef.current.setVolume(Math.min(100, Math.max(0, Math.round(qVol * master * 100))));
          } catch {}
        }
      }
      if (newSettings.sfxVolume !== undefined) {
        soundEngine.setSfxVolume(newSettings.sfxVolume);
      }
      if (newSettings.menuMusicVolume !== undefined || newSettings.musicVolume !== undefined) {
        const menuVol = newSettings.menuMusicVolume ?? newSettings.musicVolume ?? 0.1;
        soundEngine.setMenuMusicVolume(menuVol);
        if (bgYtPlayerRef.current && typeof bgYtPlayerRef.current.setVolume === 'function') {
          try {
            bgYtPlayerRef.current.setVolume(Math.min(100, Math.max(0, Math.round(menuVol * master * 100))));
          } catch {}
        }
      }
      if (newSettings.questionMusicVolume !== undefined) {
        const baseQVol = newSettings.questionMusicVolume;
        soundEngine.setQuestionMusicVolume(baseQVol);
        if (mainYtPlayerRef.current && typeof mainYtPlayerRef.current.setVolume === 'function') {
          try {
            const modeMultiplier = updated.gameMode === 'music_blind_test' ? 1.2 : 1.0;
            const qVol = Math.min(1.0, baseQVol * modeMultiplier);
            mainYtPlayerRef.current.setVolume(Math.min(100, Math.max(0, Math.round(qVol * master * 100))));
          } catch {}
        }
      }
      if (newSettings.soundEffectsEnabled !== undefined) {
        soundEngine.setSfxMuted(!newSettings.soundEffectsEnabled);
      }
      if (newSettings.musicEnabled !== undefined) {
        soundEngine.setMusicMuted(!newSettings.musicEnabled);
        if (newSettings.musicEnabled && (screen === 'menu' || screen === 'results' || screen === 'multiplayer_results' || screen === 'lobby' || screen === 'room_lobby')) {
          soundEngine.startMenuMusic();
        }
      }
      return updated;
    });
  };

  // --- START QUIZ WITH DATA ---
  const startQuiz = async (rawData: QuizData) => {
    soundEngine.unlockAudio();
    soundEngine.playMenuSelect();

    // Randomize options order for every single question
    const preparedData = prepareQuizData(rawData);

    setQuizData(preparedData);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScoreEarnedForCurrent(0);
    setCurrentYtIndex(0);
    setYtVideoId(null);

    setStats({
      score: 0,
      streak: 0,
      maxStreak: 0,
      correctAnswers: 0,
      totalQuestions: preparedData.questions.length || 15,
      totalTimeSpent: 0,
      answers: [],
    });

    setTimeLeft(settings.durationPerQuestion);
    lastTickSecondRef.current = -1;

    setScreen('playing');

    if (settings.musicEnabled && settings.gameMode !== 'music_blind_test') {
      soundEngine.startAmbience(preparedData.ambientSound || 'synthwave');
    }
  };

  // --- SELECT PRESET THEME ---
  const handleSelectPreset = (
    theme: QuizTheme,
    difficulty: GameDifficulty,
    gameMode: GameMode,
    gameStyle: GameStyle,
    isPublic?: boolean
  ) => {
    setSettings((prev) => ({ ...prev, difficulty, gameMode, gameStyle }));
    const localizedTitle = t(`preset_${theme.id}_title`, settings.language);
    const titleToUse = localizedTitle && !localizedTitle.startsWith('preset_') ? localizedTitle : theme.title;
    generateQuizFromTopic(titleToUse, theme, difficulty, gameMode, gameStyle, isPublic);
  };

  // --- AI GENERATE QUIZ FOR CUSTOM TOPIC ---
  const generateQuizFromTopic = async (
    topic: string,
    fallbackTheme?: QuizTheme,
    difficultyStr?: GameDifficulty,
    modeStr?: GameMode,
    styleStr?: GameStyle,
    isPublic?: boolean
  ) => {
    const finalDifficulty = difficultyStr || settings.difficulty;
    const finalMode = modeStr || settings.gameMode;
    const finalStyle = styleStr || settings.gameStyle;
    setSettings((prev) => ({ ...prev, difficulty: finalDifficulty, gameMode: finalMode, gameStyle: finalStyle }));

    soundEngine.unlockAudio();
    setIsGenerating(true);
    setErrorMessage(null);

    if (finalStyle === 'competitive_room') {
      if (screen !== 'room_lobby' && !multiplayerService.getCurrentRoomCode()) {
        multiplayerService.createRoom({
          hostName: profileName?.trim() || 'Michel',
          avatar: profileAvatar || '👑',
          isPublic: isPublic ?? true,
          quizData: {
            topic,
            themeTitle: fallbackTheme?.title || topic,
            difficulty: finalDifficulty,
            gameMode: finalMode,
            gameStyle: 'competitive_room',
            questions: [],
          },
          difficulty: finalDifficulty,
          gameMode: finalMode,
          language: settings.language,
          durationPerQuestion: settings.durationPerQuestion,
        });
      }
      setScreen('room_lobby');
    } else {
      setScreen('generating');
    }

    const modeLabels: Record<string, string> = {
      quiz: t('mode_quiz_title', settings.language),
      music_blind_test: t('mode_music_title', settings.language),
      visual_blind_test: t('mode_visual_title', settings.language),
    };

    const steps = [
      t('step_analyzing_topic', settings.language).replace('...', '') + ` "${topic}"...`,
      t('step_generating_questions', settings.language),
      t('step_searching_images', settings.language),
      t('step_synthesizing_audio', settings.language),
      t('step_preparing_arena', settings.language),
    ];

    let stepIdx = 0;
    const interval = window.setInterval(() => {
      stepIdx = (stepIdx + 1) % steps.length;
      setGenerationStep(steps[stepIdx]);
    }, 1200);

    try {
      const response = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          difficulty: finalDifficulty,
          language: settings.language,
          gameMode: finalMode,
        }),
      });

      clearInterval(interval);

      const rawText = await response.text();
      let generatedData: QuizData;
      try {
        generatedData = JSON.parse(rawText);
        if (!response.ok || !generatedData?.questions?.length) {
          console.warn('Backend returned non-OK status or empty questions, using fallback generator:', rawText);
          generatedData = generateFallbackQuiz(topic, finalMode, finalDifficulty);
        }
      } catch (parseErr) {
        console.warn('Failed to parse response as JSON, falling back to local quiz generator:', rawText);
        generatedData = generateFallbackQuiz(topic, finalMode, finalDifficulty);
      }

      setGenerationStep(t('step_preloading_media', settings.language));

      // Preload primary and secondary image for the first question with a safety timeout
      const firstQ = generatedData.questions[0];
      const imagesToLoad = firstQ ? [firstQ.imageUrl, firstQ.secondaryImageUrl].filter(Boolean) as string[] : [];
      await Promise.race([
        Promise.all(
          imagesToLoad.map(
            (url) =>
              new Promise((resolve) => {
                const img = new Image();
                img.onload = resolve;
                img.onerror = resolve;
                img.src = url;
              })
          )
        ),
        new Promise((resolve) => setTimeout(resolve, 2000)),
      ]);

      // Preload the rest asynchronously without awaiting
      generatedData.questions.slice(1).forEach((q) => {
        if (q.imageUrl) {
          const img1 = new Image();
          img1.src = q.imageUrl;
        }
        if (q.secondaryImageUrl) {
          const img2 = new Image();
          img2.src = q.secondaryImageUrl;
        }
      });

      // If server already found theme soundtrack, cache it directly
      if (generatedData.themeYoutubeVideoId) {
        const themeKey = `theme_ost_${generatedData.topic}`;
        ytCacheRef.current[themeKey] = generatedData.themeYoutubeVideoId;
        if (generatedData.themeTitle) {
          ytCacheRef.current[`theme_ost_${generatedData.themeTitle}`] = generatedData.themeYoutubeVideoId;
        }
      }

      // For music blind test or quiz mode, prefetch any missing question songs in background
      if (finalMode === 'music_blind_test' || finalMode === 'quiz') {
        generatedData.questions.forEach((q) => {
          const searchKey = q.youtubeSearchQuery || `ost ${q.correctAnswer} ${generatedData.topic}`;
          if (!q.youtubeVideoId && (q.correctAnswer || q.youtubeSearchQuery)) {
            if (!ytCacheRef.current[searchKey]) {
              fetch(`/api/search-youtube?q=${encodeURIComponent(searchKey)}`)
                .then((res) => (res.ok ? res.json().catch(() => null) : null))
                .then((data) => {
                  if (data?.videoId) {
                    ytCacheRef.current[searchKey] = data.videoId;
                    setQuizData((prev) => {
                      if (!prev) return prev;
                      const newQuestions = [...prev.questions];
                      const idx = newQuestions.findIndex((quest) => quest.id === q.id);
                      if (idx !== -1) {
                        newQuestions[idx] = { ...newQuestions[idx], youtubeVideoId: data.videoId };
                      }
                      return { ...prev, questions: newQuestions };
                    });
                  }
                })
                .catch(() => {});
            } else {
              q.youtubeVideoId = ytCacheRef.current[searchKey];
            }
          }
        });
      }

      const finalPreparedData = prepareQuizData(
        fallbackTheme
          ? {
              ...fallbackTheme,
              ...generatedData,
              themeTitle: generatedData.themeTitle || t(`preset_${fallbackTheme.id}_title`, settings.language) || fallbackTheme.title,
              themeDescription: generatedData.themeDescription || t(`preset_${fallbackTheme.id}_desc`, settings.language) || fallbackTheme.description,
              questions: generatedData.questions,
            }
          : generatedData
      );
      setPendingQuizData(finalPreparedData);
      setQuizData(finalPreparedData);
      setIsGenerating(false);

      if (finalStyle === 'competitive_room') {
        const targetRoom = currentRoomCodeRef.current || multiplayerService.getCurrentRoomCode() || currentRoomCode;
        multiplayerService.updateQuizData(targetRoom || '', finalPreparedData);
      } else {
        setScreen('ready');
      }
    } catch (err: any) {
      clearInterval(interval);
      console.error('AI Quiz generation failed:', err);
      setIsGenerating(false);
      setErrorMessage(err.message || 'Erreur inconnue lors de la génération.');
      if (finalStyle === 'competitive_room') {
        // Keep in lobby with error notification
      } else {
        setScreen('menu');
      }
    }
  };

  // --- QUESTION & TIMER LIFECYCLE ---
  const currentQuestion: Question | undefined = quizData?.questions[currentQuestionIndex];
  const activeVideoId = currentQuestion?.youtubeVideoIds?.[currentYtIndex] || currentQuestion?.youtubeVideoId;

  // Reset YouTube fallback index on question change and fetch missing video if needed
  useEffect(() => {
    setCurrentYtIndex(0);
    if (currentQuestion && !currentQuestion.youtubeVideoId && (currentQuestion.youtubeSearchQuery || currentQuestion.correctAnswer)) {
      const qKey = (currentQuestion.youtubeSearchQuery || `${currentQuestion.correctAnswer} ${quizData?.topic || ''}`).trim();
      if (qKey) {
        const cached = ytCacheRef.current[qKey.toLowerCase()];
        if (cached) {
          setQuizData((prev) => {
            if (!prev) return prev;
            const updated = [...prev.questions];
            if (updated[currentQuestionIndex]) {
              updated[currentQuestionIndex] = { ...updated[currentQuestionIndex], youtubeVideoId: cached, youtubeVideoIds: [cached] };
            }
            return { ...prev, questions: updated };
          });
        } else {
          fetch(`/api/search-youtube?q=${encodeURIComponent(qKey)}`)
            .then((res) => (res.ok ? res.json().catch(() => null) : null))
            .then((data) => {
              if (data?.videoId) {
                ytCacheRef.current[qKey.toLowerCase()] = data.videoId;
                setQuizData((prev) => {
                  if (!prev) return prev;
                  const updated = [...prev.questions];
                  if (updated[currentQuestionIndex]) {
                    const vIds = data.videoIds && data.videoIds.length > 0 ? data.videoIds : [data.videoId];
                    updated[currentQuestionIndex] = { ...updated[currentQuestionIndex], youtubeVideoId: data.videoId, youtubeVideoIds: vIds };
                  }
                  return { ...prev, questions: updated };
                });
              }
            })
            .catch(() => {});
        }
      }
    }
  }, [currentQuestionIndex, currentQuestion?.id]);

  // Aggressive background prefetch of all 15 questions' YouTube videos and images
  useEffect(() => {
    if (!quizData?.questions || quizData.questions.length === 0) return;
    
    quizData.questions.forEach((q, idx) => {
      if (q.imageUrl) {
        const img = new Image();
        img.src = q.imageUrl;
      }
      if (q.secondaryImageUrl) {
        const img = new Image();
        img.src = q.secondaryImageUrl;
      }

      const searchKey = (q.youtubeSearchQuery || `${q.correctAnswer} ${quizData.topic}`).trim();
      if (!q.youtubeVideoId && searchKey) {
        const cached = ytCacheRef.current[searchKey.toLowerCase()];
        if (cached) {
          setQuizData((prev) => {
            if (!prev || prev.questions[idx]?.youtubeVideoId) return prev;
            const updated = [...prev.questions];
            if (updated[idx]) {
              updated[idx] = { ...updated[idx], youtubeVideoId: cached, youtubeVideoIds: [cached] };
            }
            return { ...prev, questions: updated };
          });
        } else {
          fetch(`/api/search-youtube?q=${encodeURIComponent(searchKey)}`)
            .then((res) => (res.ok ? res.json().catch(() => null) : null))
            .then((resData) => {
              if (resData?.videoId) {
                ytCacheRef.current[searchKey.toLowerCase()] = resData.videoId;
                setQuizData((prev) => {
                  if (!prev) return prev;
                  const updated = [...prev.questions];
                  if (updated[idx]) {
                    const vIds = resData.videoIds && resData.videoIds.length > 0 ? resData.videoIds : [resData.videoId];
                    updated[idx] = { ...updated[idx], youtubeVideoId: resData.videoId, youtubeVideoIds: vIds };
                  }
                  return { ...prev, questions: updated };
                });
              }
            })
            .catch(() => {});
        }
      }
    });
  }, [quizData?.themeTitle, quizData?.topic]);

  // Stop Timer
  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setTimerActive(false);
  }, []);

  // Time-up Handler (when clock reaches 0)
  const handleTimeUp = useCallback(() => {
    if (isAnswered || !currentQuestion) return;

    stopTimer();
    setIsAnswered(true);
    
    if (settings.gameStyle === 'slideshow') {
      setSelectedOption(currentQuestion.correctAnswer);
      soundEngine.playCorrect(); // Or maybe no sound for slideshow, or just correct sound
      setScoreEarnedForCurrent(0);
      
      // Auto-advance in slideshow mode
      startAutoAdvanceTimer(4);
    } else {
      setSelectedOption(null);
      setScoreEarnedForCurrent(0);
      // Play defeat sound effect (buzzer + sad trombone)
      soundEngine.playTimeUp();

      // In multiplayer mode, trigger reveal on server if we have the room code
      if (roomState && (currentRoomCode || currentRoomCodeRef.current)) {
        multiplayerService.revealQuestion(currentRoomCode || currentRoomCodeRef.current || '');
      }

      // Auto-advance automatically after 5 seconds without requiring button press
      startAutoAdvanceTimer(5);
    }

    // Cancel speech synthesis immediately
    if (ttsAudioRef.current) {
      ttsAudioRef.current.pause();
      ttsAudioRef.current = null;
    }

    setStats((prev) => ({
      ...prev,
      streak: 0,
      totalTimeSpent: prev.totalTimeSpent + settings.durationPerQuestion,
      answers: [
        ...prev.answers,
        {
          questionIndex: currentQuestionIndex,
          question: currentQuestion,
          selectedOption: settings.gameStyle === 'slideshow' ? currentQuestion.correctAnswer : t('time_up', settings.language),
          isCorrect: settings.gameStyle === 'slideshow',
          timeSpent: settings.durationPerQuestion,
          scoreEarned: 0,
        },
      ],
    }));
  }, [isAnswered, currentQuestion, currentQuestionIndex, settings.durationPerQuestion, stopTimer, settings.gameStyle, roomState, currentRoomCode, startAutoAdvanceTimer]);

  const [isPaused, setIsPaused] = useState(false);

  // Start Timer when on a fresh question
  useEffect(() => {
    if (screen !== 'playing' || isAnswered || !currentQuestion) {
      stopTimer();
      return;
    }

    // Only reset time left if we are on a new question and not just unpausing
    if (timeLeft === 0 || timeLeft === settings.durationPerQuestion) {
      setTimeLeft(settings.durationPerQuestion);
    }
    lastTickSecondRef.current = -1;
    setTimerActive(true);

    // If game is paused, don't tick
    if (isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    let lastTick = Date.now();
    // Start countdown immediately without delay
    let delayRemainingMs = 0;

    timerRef.current = window.setInterval(() => {
      const now = Date.now();
      const deltaMs = now - lastTick;
      lastTick = now;

      if (delayRemainingMs > 0) {
        delayRemainingMs -= deltaMs;
        return; // still in delay phase
      }

      setTimeLeft((prev) => {
        const next = Math.max(0, prev - (deltaMs / 1000));
        
        // Play tick-tock at integer boundary changes
        const currentIntSec = Math.ceil(next);
        if (currentIntSec !== lastTickSecondRef.current && currentIntSec > 0 && currentIntSec <= 10 && next <= 10) {
          lastTickSecondRef.current = currentIntSec;
          soundEngine.playCountdownTick(currentIntSec <= 3);
        }

        if (next <= 0) {
          handleTimeUp();
        }
        return next;
      });

    }, 100);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [screen, currentQuestionIndex, isAnswered, currentQuestion, settings.durationPerQuestion, settings.gameMode, handleTimeUp, stopTimer, isPaused]);

  // Ref for the TTS audio so we can cancel it
  const ttsAudioRef = useRef<HTMLAudioElement | null>(null);

  // Automatic Voice Clue Reading on Question Start (if enabled)
  useEffect(() => {
    if (screen === 'playing' && currentQuestion && !isAnswered) {
      if (settings.speechCluesEnabled) {
        const audioTimer = setTimeout(() => {
          if (ttsAudioRef.current) {
            ttsAudioRef.current.pause();
            ttsAudioRef.current = null;
          }
          const currentLangCode = roomState?.language || settings.language || 'fr';
          fetch(`/api/tts?text=${encodeURIComponent(currentQuestion.question)}&lang=${encodeURIComponent(currentLangCode)}`)
            .then(async (res) => {
              if (!res.ok) return null;
              return res.json().catch(() => null);
            })
            .then((data) => {
              if (data?.url && !isAnswered) {
                const audio = new Audio(data.url);
                ttsAudioRef.current = audio;
                audio.play().catch((e) => console.warn('Auto TTS play failed', e));
              }
            })
            .catch(() => {});
        }, 500);

        return () => {
          clearTimeout(audioTimer);
          if (ttsAudioRef.current) {
            ttsAudioRef.current.pause();
            ttsAudioRef.current = null;
          }
        };
      }
    }
  }, [screen, currentQuestionIndex, currentQuestion?.id, isAnswered, settings.speechCluesEnabled, settings.gameMode]);

  // Volume synchronization
  useEffect(() => {
    if (!settings.musicEnabled) {
      soundEngine.setMusicMuted(true);
    } else {
      soundEngine.setMusicMuted(false);
      soundEngine.setMusicVolume(settings.musicVolume);
    }
  }, [settings.gameMode, settings.musicVolume, settings.musicEnabled, screen]);

  // Manage YouTube Background Music for Menu and Themes
  useEffect(() => {
    let isActive = true;

    if (!settings.musicEnabled) {
      soundEngine.stopAmbience();
      setYtVideoId(null);
      return;
    }

    if (screen === 'menu' || screen === 'results' || screen === 'multiplayer_results' || screen === 'lobby' || screen === 'room_lobby') {
      soundEngine.startMenuMusic().then((isCustom) => {
        if (isCustom) {
          setYtVideoId(null);
        }
      });
      const menuKey = 'retro 80s arcade quiz game show music theme loop';
      if (ytCacheRef.current[menuKey]) {
        setYtVideoId(ytCacheRef.current[menuKey]);
      } else {
        fetch(`/api/search-youtube?q=${encodeURIComponent(menuKey)}`)
          .then((res) => (res.ok ? res.json().catch(() => null) : null))
          .then((data) => {
            if (isActive && data?.videoId) {
              ytCacheRef.current[menuKey] = data.videoId;
              setYtVideoId(data.videoId);
            }
          })
          .catch(() => {});
      }
      return;
    }

    if (screen === 'playing') {
      if (quizData) {
        if (settings.gameMode === 'music_blind_test') {
          soundEngine.stopAmbience();
        } else {
          soundEngine.startAmbience(quizData.ambientSound || 'synthwave');
        }

        if (settings.gameMode === 'music_blind_test') {
          setYtVideoId(null);
          return;
        }

        if (settings.gameMode === 'quiz' && currentQuestion) {
          // If the question has a specific video ID (pre-fetched or defined)
          if (currentQuestion.youtubeVideoId) {
            setYtVideoId(currentQuestion.youtubeVideoId);
            return;
          }
          
          // Otherwise search for the question's specific query
          const questionQuery = currentQuestion.youtubeSearchQuery || `ost ${currentQuestion.correctAnswer} ${quizData.topic}`;
          if (ytCacheRef.current[questionQuery]) {
            currentQuestion.youtubeVideoId = ytCacheRef.current[questionQuery];
            setYtVideoId(ytCacheRef.current[questionQuery]);
            return;
          }

          fetch(`/api/search-youtube?q=${encodeURIComponent(questionQuery)}`)
            .then((res) => (res.ok ? res.json().catch(() => null) : null))
            .then((data) => {
              if (isActive && data?.videoId) {
                ytCacheRef.current[questionQuery] = data.videoId;
                currentQuestion.youtubeVideoId = data.videoId;
                setYtVideoId(data.videoId);
              }
            })
            .catch(() => {});
          return;
        }

        // Fallback or visual mode: Theme Soundtrack
        if (quizData.themeYoutubeVideoId) {
          setYtVideoId(quizData.themeYoutubeVideoId);
          return;
        }

        const themeQuery = `${quizData.themeTitle || quizData.topic} soundtrack ost theme loop`;
        if (ytCacheRef.current[themeQuery]) {
          setYtVideoId(ytCacheRef.current[themeQuery]);
          return;
        }

        fetch(`/api/search-youtube?q=${encodeURIComponent(themeQuery)}`)
          .then((res) => (res.ok ? res.json().catch(() => null) : null))
          .then((data) => {
            if (isActive && data?.videoId) {
              ytCacheRef.current[themeQuery] = data.videoId;
              setYtVideoId(data.videoId);
            }
          })
          .catch(() => {});
      }
    } else {
      // Results or settings
      setYtVideoId(null);
    }

    return () => {
      isActive = false;
    };
  }, [screen, currentQuestion?.id, quizData?.topic, quizData?.themeTitle, quizData?.themeYoutubeVideoId, settings.musicEnabled, settings.gameMode]);

  // Option Selected Handler
  const handleSelectOption = (option: string) => {
    if (isAnswered || selectedOption || !currentQuestion || settings.gameStyle === 'slideshow') return;

    if (ttsAudioRef.current) {
      ttsAudioRef.current.pause();
      ttsAudioRef.current = null;
    }

    // Multiplayer Mode
    if (roomState && currentRoomCode && currentPlayerId) {
      setSelectedOption(option);
      const timeSpent = Math.max(0.5, settings.durationPerQuestion - timeLeft);
      multiplayerService.submitAnswer(currentRoomCode, currentQuestionIndex, option, timeSpent);
      soundEngine.playClick();
      return;
    }

    // Solo Mode
    stopTimer();
    setSelectedOption(option);
    setIsAnswered(true);

    const isCorrect = option === currentQuestion.correctAnswer;
    const timeSpent = Math.max(1, settings.durationPerQuestion - timeLeft);

    let points = 0;
    if (isCorrect) {
      const basePoints = 100;
      const speedBonus = Math.round(timeLeft * 10);
      const newStreak = stats.streak + 1;

      let multiplier = 1.0;
      if (newStreak >= 5) multiplier = 3.0;
      else if (newStreak >= 3) multiplier = 2.0;
      else if (newStreak >= 2) multiplier = 1.5;

      points = Math.round((basePoints + speedBonus) * multiplier);

      soundEngine.playCorrect();
      if (newStreak > 1) {
        soundEngine.playStreak(newStreak);
      }

      setScoreEarnedForCurrent(points);
      setStats((prev) => ({
        ...prev,
        score: prev.score + points,
        streak: newStreak,
        maxStreak: Math.max(prev.maxStreak, newStreak),
        correctAnswers: prev.correctAnswers + 1,
        totalTimeSpent: prev.totalTimeSpent + timeSpent,
        answers: [
          ...prev.answers,
          {
            questionIndex: currentQuestionIndex,
            question: currentQuestion,
            selectedOption: option,
            isCorrect: true,
            timeSpent,
            scoreEarned: points,
          },
        ],
      }));
    } else {
      soundEngine.playWrong();
      setScoreEarnedForCurrent(0);
      setStats((prev) => ({
        ...prev,
        streak: 0,
        totalTimeSpent: prev.totalTimeSpent + timeSpent,
        answers: [
          ...prev.answers,
          {
            questionIndex: currentQuestionIndex,
            question: currentQuestion,
            selectedOption: option,
            isCorrect: false,
            timeSpent,
            scoreEarned: 0,
          },
        ],
      }));
    }
  };

  // Next Question Handler
  const handleNextQuestion = () => {
    if (screen !== 'playing') return;
    clearAutoAdvanceTimer();
    soundEngine.playQuestionTransition();
    if (!quizData) return;

    if (ttsAudioRef.current) {
      ttsAudioRef.current.pause();
      ttsAudioRef.current = null;
    }

    // Multiplayer Mode Next Question (Only Host can manually trigger next question)
    if (roomState && (currentRoomCode || currentRoomCodeRef.current)) {
      const isHost = currentPlayerId ? roomState.hostId === currentPlayerId : false;
      if (!isHost) {
        return; // Guest players cannot trigger next question
      }
      multiplayerService.nextQuestion(currentRoomCode || currentRoomCodeRef.current || '');
      return;
    }

    // Solo Mode
    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setScoreEarnedForCurrent(0);
      setTimeLeft(settings.durationPerQuestion);
    } else {
      // Completed all questions
      stopTimer();
      soundEngine.stopAmbience();
      soundEngine.playGameOver();
      setScreen('results');
    }
  };
  handleNextQuestionRef.current = handleNextQuestion;

  // Replay Current Quiz
  const handleReplay = () => {
    clearAutoAdvanceTimer();
    if (roomState && (currentRoomCode || currentRoomCodeRef.current)) {
      multiplayerService.startGame(currentRoomCode || currentRoomCodeRef.current || '');
    } else if (quizData) {
      startQuiz(quizData);
    } else {
      setScreen('menu');
    }
  };

  // Return to Menu
  const handleExitToMenu = () => {
    clearAutoAdvanceTimer();
    stopTimer();
    soundEngine.stopAmbience();
    soundEngine.playClick();
    if (ttsAudioRef.current) {
      ttsAudioRef.current.pause();
      ttsAudioRef.current = null;
    }
    if (currentRoomCode || currentRoomCodeRef.current) {
      multiplayerService.leaveRoom(currentRoomCode || currentRoomCodeRef.current || '');
      setRoomState(null);
      setCurrentRoomCode(null);
      currentRoomCodeRef.current = null;
      setCurrentPlayerId(null);
    }
    setScreen('menu');
  };

  // Create Multiplayer Room from Pending/Current Quiz Data
  const handleCreateRoom = (dataToUse: QuizData) => {
    soundEngine.unlockAudio();
    soundEngine.playMenuSelect();
    const preparedData = prepareQuizData(dataToUse);
    setQuizData(preparedData);
    multiplayerService.createRoom({
      hostName: profileName?.trim() || 'Michel',
      avatar: profileAvatar || '👑',
      quizData: preparedData,
      difficulty: settings.difficulty,
      gameMode: settings.gameMode,
      language: settings.language,
      durationPerQuestion: settings.durationPerQuestion,
    });
  };

  return (
    <div
      className={`w-full text-slate-100 font-sans selection:bg-purple-500 selection:text-white flex flex-col justify-between ${
        screen === 'playing'
          ? 'h-[100dvh] max-h-[100dvh] overflow-hidden'
          : 'min-h-[100dvh] max-h-[100dvh] sm:min-h-screen sm:max-h-none overflow-hidden sm:overflow-y-auto pt-12 sm:pt-16'
      }`}
      style={{ backgroundColor: '#0B0716' }}
    >
      {/* Top Fixed Header Navbar */}
      <Navbar
        currentScreen={screen}
        quizData={quizData}
        settings={settings}
        roomState={roomState}
        onUpdateSettings={updateSettings}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onExitToMenu={handleExitToMenu}
        onPlayClickSound={() => soundEngine.playClick()}
        isPaused={isPaused}
        onTogglePause={() => {
          setIsPaused(p => {
            const nextPaused = !p;
            if (nextPaused) {
              if (ttsAudioRef.current) ttsAudioRef.current.pause();
              if (bgYtPlayerRef.current && typeof bgYtPlayerRef.current.pauseVideo === 'function') bgYtPlayerRef.current.pauseVideo();
              if (mainYtPlayerRef.current && typeof mainYtPlayerRef.current.pauseVideo === 'function') mainYtPlayerRef.current.pauseVideo();
            } else {
              if (ttsAudioRef.current && !isAnswered) ttsAudioRef.current.play().catch(()=>{});
              if (bgYtPlayerRef.current && typeof bgYtPlayerRef.current.playVideo === 'function') bgYtPlayerRef.current.playVideo();
              if (mainYtPlayerRef.current && typeof mainYtPlayerRef.current.playVideo === 'function') mainYtPlayerRef.current.playVideo();
            }
            return nextPaused;
          });
        }}
      />

      <DynamicBackground
        bgImage={settings.gameMode === 'visual_blind_test' || settings.gameMode === 'music_blind_test' ? undefined : quizData?.themeBgImage}
        primaryColor={quizData?.primaryColor}
        accentColor={quizData?.accentColor}
      />

      {/* Hidden YouTube Player for Background Music */}
      {settings.musicEnabled && ytVideoId && (
        <div className="hidden">
          <YouTube
            videoId={ytVideoId}
            opts={{
              playerVars: {
                autoplay: 1,
                controls: 0,
                disablekb: 1,
                loop: 1,
                playlist: ytVideoId, // Required for looping
                vq: 'small', // Minimal resources for background audio
              },
            }}
            onReady={(e) => {
              bgYtPlayerRef.current = e.target;
              try {
                if (e.target && typeof e.target.setPlaybackQuality === 'function') {
                  e.target.setPlaybackQuality('small');
                }
              } catch (err) {
                // ignore
              }
              // Menu music base volume is 10% by default, multiplied by master volume
              const baseVol = Math.round((settings.menuMusicVolume ?? settings.musicVolume ?? 0.1) * (settings.masterVolume ?? 1.0) * 100);
              let targetVol = baseVol;
              if (screen === 'playing') {
                if (settings.gameMode === 'quiz') {
                  targetVol = Math.min(25, baseVol * 0.25);
                } else if (settings.gameMode === 'visual_blind_test') {
                  targetVol = Math.max(1, Math.round(baseVol * 0.10)); // Reduced to 10% in visual blind test
                }
              }
              // Start immediately at 35% of target volume so audio is heard right away without delay
              let currentVol = Math.max(1, targetVol * 0.35);
              if (e.target && typeof e.target.setVolume === 'function') {
                e.target.setVolume(currentVol);
                if (typeof e.target.playVideo === 'function') {
                  e.target.playVideo();
                }
              }

              // Smoothly fade to target volume in ~500ms
              const fadeInterval = setInterval(() => {
                currentVol += (targetVol - currentVol) * 0.35 + 2;
                if (currentVol >= targetVol) {
                  currentVol = targetVol;
                  clearInterval(fadeInterval);
                }
                if (e.target && typeof e.target.setVolume === 'function') {
                  e.target.setVolume(Math.min(100, currentVol));
                } else {
                  clearInterval(fadeInterval);
                }
              }, 70);
            }}
            onPlay={() => {
              // Fade out synthetic ambience once YouTube starts playing
              soundEngine.stopAmbience();
            }}
          />
        </div>
      )}

      {/* Main Dynamic Viewport */}
      <main
        className={`relative z-10 w-full flex-1 flex flex-col items-center ${
          screen === 'playing'
            ? 'p-1.5 sm:p-3 md:p-4 pt-14 sm:pt-20 md:pt-22 max-w-7xl xl:max-w-[1550px] 2xl:max-w-[1650px] mx-auto h-[100dvh] overflow-hidden justify-start'
            : 'px-2 sm:px-6 py-1 sm:py-6 max-w-6xl mx-auto justify-center min-h-0'
        }`}
      >
        {screen === 'playing' && quizData && (
          <ScoreBoard
            language={settings.language}
            currentIndex={currentQuestionIndex}
            totalQuestions={quizData.questions.length}
            score={stats.score}
            streak={stats.streak}
            correctCount={stats.correctAnswers}
            primaryColor={quizData.primaryColor}
            gameMode={settings.gameMode}
            themeTitle={quizData.themeTitle}
          />
        )}
        <AnimatePresence mode="wait">
          {/* 1. HOME / THEME SELECTOR SCREEN */}
          {screen === 'menu' && (
            <motion.div
              key="menu"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="w-full"
            >
              <ThemeSelector
                language={settings.language}
                onSelectPreset={handleSelectPreset}
                onGenerateCustom={(topic, difficulty, mode, style, isPub) => generateQuizFromTopic(topic, undefined, difficulty, mode, style, isPub)}
                selectedMode={settings.gameMode}
                onSelectMode={(mode) => setSettings(prev => ({ ...prev, gameMode: mode }))}
                selectedStyle={settings.gameStyle}
                onSelectStyle={(style) => setSettings(prev => ({ ...prev, gameStyle: style }))}
                isGenerating={isGenerating}
                onPlayClickSound={() => soundEngine.playClick()}
                onPlayHoverSound={() => soundEngine.playHover()}
                onOpenJoinRoom={() => {
                  setJoinModalInitialCode('');
                  setIsJoinModalCodeLocked(false);
                  setIsJoinModalOpen(true);
                }}
                onOpenPublicRooms={() => {
                  setIsPublicRoomsModalOpen(true);
                }}
              />
              {errorMessage && (
                <div className="mt-6 p-4 rounded-xl bg-red-500/20 border border-red-500/40 text-red-200 text-sm font-medium text-center">
                  <span className="font-bold">{t('error_label', settings.language)}</span> {errorMessage}
                  <button 
                    onClick={() => setErrorMessage(null)}
                    className="ml-3 underline opacity-80 hover:opacity-100"
                  >
                    {t('close', settings.language)}
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* 1.5 READY SCREEN */}
          {screen === 'ready' && pendingQuizData && (
            <motion.div
              key="ready"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md p-8 rounded-3xl bg-white/5 border border-white/15 backdrop-blur-2xl text-center shadow-2xl flex flex-col items-center gap-6"
            >
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <Wand2 className="w-10 h-10 text-emerald-400" />
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="text-2xl font-black text-white font-heading">
                  {t('generation_done', settings.language)}
                </h3>
                <p className="text-sm text-white/70">
                  {t("quiz_ready", settings.language).replace("%s", pendingQuizData.themeTitle || pendingQuizData.topic)}
                </p>
              </div>

              {settings.gameStyle === 'competitive_room' ? (
                <button
                  id="create-room-btn"
                  onClick={() => {
                    handleCreateRoom(pendingQuizData);
                  }}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold tracking-wider shadow-lg transform hover:-translate-y-0.5 transition-all active:scale-95 border border-purple-400/50 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5 text-yellow-300" />
                  {t('create_room', settings.language)}
                </button>
              ) : (
                <button
                  id="launch-quiz-btn"
                  onClick={() => {
                    startQuiz(pendingQuizData);
                  }}
                  className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold tracking-wider shadow-lg transform hover:-translate-y-1 transition-all active:scale-95 border border-purple-400/50"
                >
                  {t('start_game', settings.language)}
                </button>
              )}
            </motion.div>
          )}

          {/* 1.8 MULTIPLAYER LOBBY SCREEN */}
          {screen === 'room_lobby' && roomState && (
            <motion.div
              key="room_lobby"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="w-full flex items-center justify-center"
            >
              <MultiplayerLobby
                language={settings.language}
                roomState={roomState}
                currentPlayerId={currentPlayerId || ''}
                isQuizGenerating={isGenerating}
                generationStepText={generationStep}
                errorMessage={errorMessage}
                onStartGame={() => currentRoomCode && multiplayerService.startGame(currentRoomCode)}
                onSendReaction={(emoji) => currentRoomCode && multiplayerService.sendReaction(currentRoomCode, emoji)}
                onLeaveRoom={handleExitToMenu}
                onRetryGeneration={() => generateQuizFromTopic(roomState.topic, undefined, roomState.difficulty, roomState.gameMode as any, 'competitive_room')}
                onTogglePublic={(isPublic) => currentRoomCode && multiplayerService.togglePublicRoom(currentRoomCode, isPublic)}
                floatingReactions={floatingReactions}
              />
            </motion.div>
          )}

          {/* 2. AI GENERATION PROGRESS OVERLAY */}
          {screen === 'generating' && (
            <motion.div
              key="generating"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-white/5 border border-white/15 backdrop-blur-2xl text-center shadow-2xl flex flex-col items-center gap-5"
            >
              {/* Spinning enlarged game logo with glowing backdrop */}
              <div className="relative my-1">
                <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-xl animate-pulse scale-110" />
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center p-3 shadow-xl shadow-purple-500/20">
                  <img 
                    src="/logo5.png" 
                    alt="GuessThat!" 
                    className="w-full h-full object-contain animate-spin drop-shadow-[0_0_20px_rgba(168,85,247,0.6)]" 
                    style={{ animationDuration: '6s' }}
                  />
                </div>
                <div className="absolute inset-0 rounded-3xl bg-purple-500/10 animate-ping opacity-40 pointer-events-none" />
              </div>

              <div className="flex flex-col gap-1">
                <h3 className="text-2xl font-black text-white font-heading">
                  {t('ai_generation_in_progress', settings.language)}
                </h3>
              </div>

              {/* Informational Coffee Break Box - Placed above loading info */}
              <div className="w-full flex flex-col items-center gap-2 text-xs text-white/70 bg-white/5 p-4 rounded-2xl border border-white/10 shadow-inner">
                <div className="w-9 h-9 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mb-0.5">
                  <Coffee className="w-5 h-5 text-amber-300" />
                </div>
                <p className="text-sm font-bold text-white">
                  {t('take_a_coffee', settings.language)}
                </p>
                <p className="leading-relaxed text-white/60">
                  {t('coffee_break_desc', settings.language)}
                </p>
              </div>

              {/* Dynamic Step Loading Information & Progress Bar */}
              <div className="w-full flex flex-col items-center gap-2 pt-1">
                <div className="flex items-center gap-2 text-xs font-bold text-purple-300">
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                  <p className="animate-pulse">{generationStep}</p>
                </div>
                <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden border border-white/10 p-0.5 mt-1">
                  <div className="bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 h-full rounded-full animate-pulse w-3/4 shadow-[0_0_15px_rgba(168,85,247,0.8)]" />
                </div>
              </div>
            </motion.div>
          )}

          {/* 3. ACTIVE QUIZ PLAYING - MASTER RESPONSIVE CONTAINER */}
          {screen === 'playing' && currentQuestion && quizData && (() => {
            const roomPlayersList: RoomPlayer[] = roomState ? (Object.values(roomState.players || {}) as RoomPlayer[]) : [];
            const sortedRoomPlayers = [...roomPlayersList].sort((a, b) => b.score - a.score);
            const myRoomRankIndex = sortedRoomPlayers.findIndex(p => p.id === currentPlayerId);
            const myRoomRank = myRoomRankIndex >= 0 ? myRoomRankIndex + 1 : 1;
            const myRoomPlayer = sortedRoomPlayers.find(p => p.id === currentPlayerId);
            const myDisplayScore = roomState && myRoomPlayer ? myRoomPlayer.score : stats.score;

            return (
            <motion.div
              key={`question-${currentQuestionIndex}`}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="w-full flex flex-col lg:flex-row gap-3 sm:gap-4 items-stretch justify-center min-h-0 h-full sm:h-auto"
            >
              {/* CADRE CLASSEMENT MULTIJOUEUR À GAUCHE (UNIQUEMENT SUR GRANDS ÉCRANS / DESKTOP) */}
              {roomState && (
                <div className="hidden lg:flex w-full lg:w-72 xl:w-80 shrink-0 flex-col">
                  <MultiplayerScoreboard
                    language={roomState?.language || settings.language}
                    roomState={roomState}
                    currentPlayerId={currentPlayerId || ''}
                    onSendReaction={(emoji) => (currentRoomCode || currentRoomCodeRef.current) && multiplayerService.sendReaction(currentRoomCode || currentRoomCodeRef.current || '', emoji)}
                  />
                </div>
              )}

              {/* GRAND CADRE CONTENEUR DU JEU RESPONSIVE (SANS SCROLL SUR MOBILE) */}
              <div
                id="game-master-container"
                className="flex-1 w-full min-w-0 flex flex-col justify-between bg-black/40 backdrop-blur-2xl rounded-2xl sm:rounded-3xl border border-white/15 p-2 sm:p-3 md:p-4 shadow-[0_10px_35px_rgba(0,0,0,0.6)] gap-1.5 sm:gap-2.5 overflow-hidden max-h-full"
              >
                {/* 1. HAUT DU CONTENEUR: Zone Médias et Cadres d'informations */}
                <div className="w-full flex flex-col gap-1.5 sm:gap-2.5">
                  
                  {/* Bandeau d'état compact sur une seule ligne pour Mobile (Position, Rang, Score) */}
                  <div className="md:hidden flex flex-row items-center justify-between gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/10 shrink-0 w-full text-xs">
                    {/* Gauche: Chronomètre & Question # */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <CircularCountdown
                        timeLeft={timeLeft}
                        totalTime={settings.durationPerQuestion}
                        primaryColor={quizData.primaryColor}
                        size={24}
                      />
                      <span className="text-[11px] font-black text-purple-300 font-heading">
                        Q{currentQuestionIndex + 1}/{quizData.questions.length}
                      </span>
                    </div>

                    {/* Droite: Position, Rang et Score sur la même ligne */}
                    {roomState ? (
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-purple-500/25 border border-purple-400/40 text-[11px] font-extrabold text-purple-200">
                          <span>{myRoomRank === 1 ? '🥇' : myRoomRank === 2 ? '🥈' : myRoomRank === 3 ? '🥉' : '🏅'}</span>
                          <span>
                            {myRoomRank}
                            {settings.language === 'fr' ? (myRoomRank === 1 ? 'er' : 'e') : (myRoomRank === 1 ? 'st' : myRoomRank === 2 ? 'nd' : myRoomRank === 3 ? 'rd' : 'th')} / {roomPlayersList.length}
                          </span>
                        </div>
                        <span className="text-[11px] font-black text-yellow-400 font-heading shrink-0">
                          {myDisplayScore.toLocaleString()} pts
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        {settings.gameStyle === 'competitive' && stats.streak >= 3 && (
                          <span className="text-[9px] font-bold text-orange-400 bg-orange-500/20 px-1.5 py-0.5 rounded-md border border-orange-500/30 flex items-center gap-0.5">
                            <Flame className="w-2.5 h-2.5" /> x{stats.streak >= 5 ? '3.0' : '2.0'}
                          </span>
                        )}
                        {settings.gameStyle === 'competitive' && (
                          <span className="text-[11px] font-black text-yellow-400 font-heading">{stats.score.toLocaleString()} pts</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Zone Médias & Colonnes Latérales */}
                  <div className="w-full flex flex-col md:grid md:grid-cols-12 gap-2 sm:gap-3 items-stretch">
                    
                    {/* Colonne Gauche (Desktop): Question #, Chrono & Gain, Indice Audio */}
                    <div className="hidden md:flex md:col-span-3 flex-col gap-2 min-h-0 justify-between">
                      {/* Cadre Question # */}
                      <div className="bg-black/30 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10 shadow-md flex flex-row items-center justify-between shrink-0">
                        <span className="text-[9px] uppercase tracking-wider text-purple-400 font-bold">{t('question', roomState?.language || settings.language)}</span>
                        <span className="text-base font-black text-white leading-none font-heading">
                          {(currentQuestionIndex + 1).toString().padStart(2, '0')}{' '}
                          <span className="text-white/35 text-xs font-normal">/ {quizData.questions.length.toString().padStart(2, '0')}</span>
                        </span>
                      </div>

                      {/* Cadre Compte à Rebours & Gain */}
                      <div className="bg-black/30 backdrop-blur-md p-2 rounded-xl border border-white/10 shadow-md flex flex-row items-center justify-around gap-2 flex-1 min-h-0">
                        <CircularCountdown
                          timeLeft={timeLeft}
                          totalTime={settings.durationPerQuestion}
                          primaryColor={quizData.primaryColor}
                          size={50}
                        />
                        {settings.gameStyle === 'competitive' ? (
                          <div className="flex flex-col text-right">
                            <span className="text-[8px] uppercase tracking-wider text-white/50 font-bold">{t('potential_gain', roomState?.language || settings.language)}</span>
                            <span className="text-sm font-black text-yellow-400 font-mono-tech drop-shadow-md">
                              +{Math.round(100 + Math.max(0, timeLeft) * 10)} pts
                            </span>
                          </div>
                        ) : (
                          <div className="flex flex-col text-right">
                            <span className="text-[8px] uppercase tracking-wider text-white/50 font-bold">{t('mode', roomState?.language || settings.language)}</span>
                            <span className="text-sm font-black text-purple-400 font-heading drop-shadow-md">
                              {settings.gameStyle === 'competitive_room' ? t('comp_room', roomState?.language || settings.language) : t('slideshow', roomState?.language || settings.language)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Cadre Indice Audio (si mode non blind test musical) */}
                      {(roomState?.gameMode || settings.gameMode) !== 'music_blind_test' && (
                        <div className="bg-black/30 backdrop-blur-md p-1.5 rounded-xl border border-white/10 shadow-md flex items-center justify-center shrink-0">
                          <AudioCluePlayer
                            audioNotes={currentQuestion.audioNotes}
                            clueText={currentQuestion.clue}
                            speechEnabled={settings.speechCluesEnabled}
                            primaryColor={quizData.primaryColor}
                            youtubeVideoId={activeVideoId}
                            gameMode={roomState?.gameMode || settings.gameMode}
                            language={roomState?.language || settings.language}
                            volume={Math.round((settings.questionMusicVolume ?? 0.8) * (settings.masterVolume ?? 1.0) * 100)}
                          />
                        </div>
                      )}
                    </div>

                    {/* Colonne Centrale (Mobile & Desktop): Cadre Média UNIQUE */}
                    <div className="w-full md:col-span-6 h-[105px] xs:h-[125px] sm:h-[165px] md:h-[200px] rounded-xl sm:rounded-2xl overflow-hidden border border-white/10 bg-black/40 shadow-inner relative shrink-0">
                      {(roomState?.gameMode || settings.gameMode) === 'music_blind_test' ? (
                        <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden">
                          {/* Visualiseur musical animé avant réponse */}
                          <div className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-700 ${isAnswered ? 'opacity-0 pointer-events-none' : 'opacity-100 z-10'}`}>
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/15 via-white/5 to-transparent" />
                            <div className="relative flex flex-col items-center justify-center gap-2 z-10">
                              <div className="relative">
                                <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-xl animate-pulse" />
                                <div className="w-16 h-16 sm:w-22 sm:h-22 bg-black/60 border border-white/20 rounded-full flex items-center justify-center shadow-lg relative z-10">
                                  <Music className="w-7 h-7 sm:w-10 sm:h-10 text-white/80 animate-pulse" />
                                </div>
                                <div className="absolute inset-0 rounded-full border border-white/30 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]" />
                                <div className="absolute inset-0 rounded-full border border-white/10 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite_1s]" />
                              </div>
                              <span className="text-[9px] sm:text-[10px] font-bold text-white/60 uppercase tracking-widest">{t('listen_clue', roomState?.language || settings.language)}</span>
                            </div>
                          </div>

                          {/* Lecteur Vidéo YouTube optimisé 480p (Instance unique) */}
                          {activeVideoId && (
                            <div className={`absolute inset-0 w-full h-full z-20 transition-opacity duration-700 ${isAnswered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                              <YouTube
                                key={`yt_player_${currentQuestionIndex}_${activeVideoId}`}
                                videoId={activeVideoId}
                                opts={{
                                  width: '100%',
                                  height: '100%',
                                  playerVars: {
                                    autoplay: 1,
                                    controls: 0,
                                    disablekb: 1,
                                    fs: 0,
                                    start: 3,
                                    vq: 'large', // 480p playback quality
                                  },
                                }}
                                className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:rounded-xl sm:[&>iframe]:rounded-2xl"
                                onReady={(e) => {
                                  mainYtPlayerRef.current = e.target;
                                  try {
                                    if (e.target && typeof e.target.setPlaybackQuality === 'function') {
                                      e.target.setPlaybackQuality('large'); // 480p
                                    }
                                  } catch (err) {
                                    // ignore
                                  }
                                  const baseQVol = settings.questionMusicVolume ?? 0.8;
                                  const modeMultiplier = settings.gameMode === 'music_blind_test' ? 1.2 : 1.0;
                                  const qVol = Math.min(1.0, baseQVol * modeMultiplier);
                                  const finalVol = Math.min(100, Math.max(0, Math.round(qVol * (settings.masterVolume ?? 1.0) * 100)));
                                  e.target.setVolume(finalVol);
                                  e.target.playVideo();
                                }}
                                onEnd={(e) => {
                                  e.target.seekTo(3);
                                  e.target.playVideo();
                                }}
                                onError={(e) => {
                                  console.error("Youtube Player Error Center:", e);
                                  if (currentQuestion && currentQuestion.youtubeVideoIds && currentYtIndex < currentQuestion.youtubeVideoIds.length - 1) {
                                    setCurrentYtIndex(prev => prev + 1);
                                  }
                                }}
                              />
                            </div>
                          )}
                        </div>
                      ) : (
                        <VisualClue
                          language={roomState?.language || settings.language}
                          imageUrl={(roomState?.gameMode || settings.gameMode) === 'quiz' ? (quizData.themeBgImage || currentQuestion.imageUrl) : currentQuestion.imageUrl}
                          secondaryImageUrl={(roomState?.gameMode || settings.gameMode) === 'quiz' ? undefined : currentQuestion.secondaryImageUrl}
                          secondaryImageSource={(roomState?.gameMode || settings.gameMode) === 'quiz' ? 'Wikipedia' : currentQuestion.secondaryImageSource}
                          imagePrompt={(roomState?.gameMode || settings.gameMode) === 'quiz' ? (quizData.themeTitle || quizData.topic) : currentQuestion.imagePrompt}
                          category={(roomState?.gameMode || settings.gameMode) === 'quiz' ? (quizData.themeTitle || quizData.topic) : currentQuestion.category}
                          clue=""
                          isAnswered={isAnswered}
                          questionIndex={currentQuestionIndex}
                          totalQuestions={quizData.questions.length}
                          primaryColor={quizData.primaryColor}
                          onPlayClickSound={() => soundEngine.playClick()}
                          showTextClue={false}
                          fullHeight={true}
                        />
                      )}
                    </div>

                    {/* Colonne Droite (Desktop): Score, Catégorie, Indice Texte */}
                    <div className="hidden md:flex md:col-span-3 flex-col gap-2 min-h-0 justify-between">
                      {/* Cadre Score & Multiplicateur */}
                      {settings.gameStyle === 'competitive' && (
                        <div className="bg-black/30 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10 shadow-md flex flex-row items-center justify-between shrink-0 relative overflow-hidden">
                          {stats.streak >= 3 && (
                            <div className="absolute top-0 right-0 bg-orange-500/20 px-1.5 py-0.5 rounded-bl-md border-b border-l border-orange-500/30 text-[8px] font-bold text-orange-400 flex items-center gap-0.5">
                              <Flame className="w-2.5 h-2.5" /> x{stats.streak >= 5 ? '3.0' : '2.0'}
                            </div>
                          )}
                          <span className="text-[9px] uppercase tracking-wider text-purple-400 font-bold">{t('score', roomState?.language || settings.language)}</span>
                          <span className="text-base font-black text-yellow-400 font-heading">
                            {stats.score.toLocaleString()}
                          </span>
                        </div>
                      )}

                      {/* Cadre Catégorie */}
                      {(roomState?.gameMode || settings.gameMode) !== 'music_blind_test' && (
                        <div className="bg-black/30 backdrop-blur-md px-2 py-1.5 rounded-xl border border-white/10 shadow-md text-center flex flex-row items-center justify-between shrink-0">
                          <span className="text-[8px] uppercase tracking-wider text-white/50 font-bold">{t('category', roomState?.language || settings.language)}</span>
                          <span className="text-xs font-bold text-white capitalize truncate max-w-[120px]">{currentQuestion.category}</span>
                        </div>
                      )}

                      {/* Cadre Indice Texte */}
                      <div className="bg-black/30 backdrop-blur-md p-2 rounded-xl border border-white/10 shadow-md text-center flex-1 min-h-0 flex flex-col items-center justify-center overflow-hidden">
                        <span className="text-[8px] uppercase text-white/50 font-bold mb-0.5 block shrink-0">{t('clue', roomState?.language || settings.language)}</span>
                        <span className="text-xs text-white/90 italic leading-snug overflow-y-auto w-full custom-scrollbar pr-1">
                          « {currentQuestion.clue} »
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Indice Audio Mobile (si non blind test musical) */}
                  {(roomState?.gameMode || settings.gameMode) !== 'music_blind_test' && (
                    <div className="md:hidden bg-black/30 backdrop-blur-md px-2 py-0.5 rounded-lg border border-white/10 flex items-center justify-center shrink-0">
                      <AudioCluePlayer
                        audioNotes={currentQuestion.audioNotes}
                        clueText={currentQuestion.clue}
                        speechEnabled={settings.speechCluesEnabled}
                        primaryColor={quizData.primaryColor}
                        youtubeVideoId={activeVideoId}
                        gameMode={roomState?.gameMode || settings.gameMode}
                        language={roomState?.language || settings.language}
                        volume={Math.round((settings.questionMusicVolume ?? 0.8) * (settings.masterVolume ?? 1.0) * 100)}
                      />
                    </div>
                  )}
                </div>

                {/* 2. BAS DU CONTENEUR: Question & Choix de réponses */}
                <div className="w-full flex flex-col gap-1 sm:gap-2 shrink-0 mt-0.5">
                  {/* Titre de la question : défilement continu permanent sur smartphone, conditionnel sur desktop */}
                  <div className="px-1 text-center shrink-0 overflow-hidden w-full">
                    {/* Mobile / Smartphone : défilement continu permanent */}
                    <div className="md:hidden w-full overflow-hidden whitespace-nowrap relative py-0.5">
                      <div
                        className="animate-marquee-smooth inline-block text-xs sm:text-sm font-black text-white leading-tight font-heading drop-shadow-md px-2"
                        style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}
                      >
                        <span>{currentQuestion.question}</span>
                        <span className="inline-block mx-6 text-purple-400 font-bold opacity-60">•</span>
                        <span>{currentQuestion.question}</span>
                        <span className="inline-block mx-6 text-purple-400 font-bold opacity-60">•</span>
                        <span>{currentQuestion.question}</span>
                      </div>
                    </div>

                    {/* Écrans moyens et Desktop */}
                    <div className="hidden md:block">
                      {currentQuestion.question.length > 80 ? (
                        <div className="w-full overflow-hidden whitespace-nowrap relative">
                          <h2
                            className="animate-marquee-smooth inline-block text-base md:text-lg font-black text-white leading-tight font-heading drop-shadow-md px-2"
                            style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}
                          >
                            <span>{currentQuestion.question}</span>
                            <span className="inline-block mx-8 text-purple-400 font-bold opacity-60">•</span>
                            <span>{currentQuestion.question}</span>
                          </h2>
                        </div>
                      ) : (
                        <h2
                          className="text-base md:text-lg font-black text-white leading-tight font-heading drop-shadow-md whitespace-nowrap overflow-hidden text-ellipsis px-1"
                          style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}
                        >
                          {currentQuestion.question}
                        </h2>
                      )}
                    </div>
                  </div>

                  {/* Cadre des réponses */}
                  <div className="w-full bg-black/30 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-white/15 p-1.5 sm:p-2.5 shadow-xl max-w-4xl mx-auto shrink-0">
                    <QuestionCard
                      language={roomState?.language || settings.language}
                      question={currentQuestion}
                      selectedOption={selectedOption}
                      isAnswered={isAnswered}
                      onSelectOption={handleSelectOption}
                      onNextQuestion={handleNextQuestion}
                      isLastQuestion={currentQuestionIndex === quizData.questions.length - 1}
                      scoreEarned={scoreEarnedForCurrent}
                      primaryColor={quizData.primaryColor}
                      onHoverSound={() => soundEngine.playHover()}
                      gameStyle={settings.gameStyle}
                      autoAdvanceCountdown={autoAdvanceCountdown}
                      isHost={roomState ? (currentPlayerId ? roomState.hostId === currentPlayerId : false) : true}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
            );
          })()}

          {/* 4. RESULTS & SCORECARD */}
          {screen === 'results' && quizData && (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full"
            >
              <ResultsView
                language={settings.language}
                stats={stats}
                quizData={quizData}
                onReplay={handleReplay}
                onNewTheme={handleExitToMenu}
                onPlayClickSound={() => soundEngine.playClick()}
                gameStyle={settings.gameStyle}
              />
            </motion.div>
          )}

          {/* 5. MULTIPLAYER ROOM FINAL RESULTS */}
          {screen === 'room_results' && roomState && (
            <motion.div
              key="room_results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full flex items-center justify-center"
            >
              <MultiplayerResultsView
                language={settings.language}
                roomState={roomState}
                currentPlayerId={currentPlayerId || ''}
                onReplay={handleReplay}
                onExitToMenu={handleExitToMenu}
                onSendReaction={(emoji) => currentRoomCode && multiplayerService.sendReaction(currentRoomCode, emoji)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating Reactions Overlay */}
      <div className="fixed bottom-6 right-6 pointer-events-none z-50 flex flex-col-reverse gap-2">
        <AnimatePresence>
          {floatingReactions.map((r) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1.1 }}
              exit={{ opacity: 0, y: -20, scale: 0.8 }}
              className="bg-black/80 backdrop-blur-md border border-white/20 px-3.5 py-2 rounded-full shadow-2xl flex items-center gap-2"
            >
              <span className="text-2xl">{r.emoji}</span>
              <span className="text-xs font-bold text-white">{r.name}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Join Room Modal */}
      <JoinRoomModal
        language={settings.language}
        isOpen={isJoinModalOpen}
        isCodeLocked={isJoinModalCodeLocked}
        onClose={() => setIsJoinModalOpen(false)}
        onJoinRoom={(code, name, avatar) => {
          setIsJoiningRoom(true);
          setJoinErrorMessage(null);
          multiplayerService.joinRoom({ code, playerName: name, avatar });
        }}
        onOpenPublicRooms={() => {
          setIsJoinModalOpen(false);
          setIsPublicRoomsModalOpen(true);
        }}
        initialCode={joinModalInitialCode}
        isJoining={isJoiningRoom}
        errorMessage={joinErrorMessage}
      />

      {/* Public Rooms Modal */}
      <PublicRoomsModal
        language={settings.language}
        isOpen={isPublicRoomsModalOpen}
        onClose={() => setIsPublicRoomsModalOpen(false)}
        onSelectRoom={(room) => {
          setIsPublicRoomsModalOpen(false);
          setJoinModalInitialCode(room.code);
          setIsJoinModalCodeLocked(true);
          setIsJoinModalOpen(true);
        }}
        onOpenEnterCodeModal={() => {
          setIsPublicRoomsModalOpen(false);
          setJoinModalInitialCode('');
          setIsJoinModalCodeLocked(false);
          setIsJoinModalOpen(true);
        }}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={updateSettings}
        primaryColor={quizData?.primaryColor || '#6366f1'}
        playerName={profileName}
        playerAvatar={profileAvatar}
        onUpdatePlayerProfile={handleUpdateProfile}
      />

      {/* Live Statistics Footer (Only visible on non-playing screens to guarantee 0 scroll in-game) */}
      {screen !== 'playing' && (
        <footer className="hidden sm:block relative z-10 py-1.5 sm:py-2.5 px-2 sm:px-4 text-center border-t border-white/10 backdrop-blur-md bg-black/40 shrink-0">
          <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-7 gap-y-0.5 text-[10px] sm:text-xs text-white/70">
            {/* Joueurs en direct */}
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-extrabold text-emerald-400 text-sm tracking-tight">
                {globalStats.onlinePlayers.toLocaleString()}
              </span>
              <span className="text-white/60 font-medium">
                {t('online_players_label', settings.language)}
              </span>
            </div>

            <span className="text-white/20 hidden sm:inline">•</span>

            {/* Salons en cours */}
            <div className="flex items-center gap-1.5">
              <span className="text-sm">🎮</span>
              <span className="font-extrabold text-amber-300 text-sm tracking-tight">
                {globalStats.activeRooms.toLocaleString()}
              </span>
              <span className="text-white/60 font-medium">
                {t('active_rooms_label', settings.language)}
              </span>
            </div>

            <span className="text-white/20 hidden sm:inline">•</span>

            {/* Quiz générés au total */}
            <div className="flex items-center gap-1.5">
              <span className="text-sm text-indigo-400">✨</span>
              <span className="font-extrabold text-indigo-300 text-sm tracking-tight">
                {globalStats.totalGenerations.toLocaleString()}
              </span>
              <span className="text-white/60 font-medium">
                {t('total_quizzes_label', settings.language)}
              </span>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
