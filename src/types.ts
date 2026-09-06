export type AmbientSoundType =
  | 'synthwave'
  | 'cinema'
  | 'retro80s'
  | 'fantasy'
  | 'electro'
  | 'jazzy'
  | 'nature'
  | 'space';

export interface QuizTheme {
  id: string;
  title: string;
  description: string;
  icon: string;
  primaryColor: string; // e.g. '#6366f1' or 'indigo'
  accentColor: string;  // e.g. '#ec4899' or 'pink'
  badgeBg: string;
  interfaceImage: string;
  ambientSound: AmbientSoundType;
  tag: string;
  suggestedPrompt: string;
}

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  clue: string;
  audioNotes?: number[]; // Frequency or MIDI notes for melody synth (e.g. [261.6, 329.6, 392.0, 523.2])
  wikiSearchQuery?: string;
  youtubeSearchQuery?: string;
  youtubeVideoId?: string;
  youtubeVideoIds?: string[];
  audioPreviewUrl?: string;
  audioTrackName?: string;
  audioArtistName?: string;
  imagePrompt?: string;
  imageUrl?: string;
  secondaryImageUrl?: string;
  secondaryImageSource?: string;
  tertiaryImageUrl?: string;
  images?: string[];
  trivia: string;
  category?: string;
}

export interface QuizData {
  topic: string;
  themeTitle: string;
  themeDescription: string;
  primaryColor: string;
  accentColor: string;
  themeBgImage?: string;
  themeMusicQuery?: string;
  themeYoutubeVideoId?: string;
  ambientSound: AmbientSoundType;
  questions: Question[];
  quotaExceededNotice?: boolean;
  fallbackUsed?: boolean;
  gameMode?: GameMode;
  difficulty?: GameDifficulty;
  gameStyle?: GameStyle;
}

export type GameDifficulty = 'easy' | 'medium' | 'hard' | 'expert';

export type GameMode = 'quiz' | 'music_blind_test' | 'visual_blind_test';

export type GameStyle = 'competitive_solo' | 'competitive_room' | 'slideshow' | 'competitive';

export interface RoomPlayer {
  id: string;
  name: string;
  avatar: string;
  score: number;
  streak: number;
  maxStreak: number;
  answeredCurrent: boolean;
  isCorrect?: boolean;
  selectedOption?: string;
  timeSpent?: number;
  isHost: boolean;
  lastScoreEarned?: number;
  answersHistory?: Record<number, { selectedOption: string; isCorrect: boolean; timeSpent: number; scoreEarned: number }>;
}

export interface RoomState {
  code: string;
  hostId: string;
  status: 'lobby' | 'playing' | 'question_result' | 'game_over';
  topic: string;
  themeTitle: string;
  themeBgImage?: string;
  primaryColor?: string;
  accentColor?: string;
  difficulty: GameDifficulty;
  gameMode: GameMode;
  gameStyle: GameStyle;
  language: string;
  durationPerQuestion: number;
  currentQuestionIndex: number;
  questionStartTime: number;
  quizData?: QuizData | null;
  newQuizReady?: boolean;
  isPublic?: boolean;
  isBotRoom?: boolean;
  players: Record<string, RoomPlayer>;
}

export interface PublicRoomSummary {
  code: string;
  hostName: string;
  hostAvatar: string;
  themeTitle: string;
  topic: string;
  gameMode: GameMode;
  difficulty: GameDifficulty;
  language: string;
  playerCount: number;
  maxPlayers: number;
  status: 'lobby' | 'playing' | 'question_result' | 'game_over';
  isPublic: boolean;
  isBotRoom?: boolean;
  currentQuestionIndex?: number;
  totalQuestions?: number;
}

export interface GameSettings {
  difficulty: GameDifficulty;
  gameMode: GameMode;
  gameStyle: GameStyle;
  language: string;
  durationPerQuestion: number; // in seconds (10, 15, 20, 30)
  masterVolume: number; // 0 to 1
  sfxVolume: number;    // 0 to 1
  menuMusicVolume: number; // 0 to 1 (default 0.1)
  questionMusicVolume: number; // 0 to 1 (default 0.8)
  musicVolume: number;  // 0 to 1
  soundEffectsEnabled: boolean;
  musicEnabled: boolean;
  progressiveBlur: boolean;
  speechCluesEnabled: boolean;
}

export interface PlayerAnswer {
  questionIndex: number;
  question: Question;
  selectedOption: string;
  isCorrect: boolean;
  timeSpent: number;
  scoreEarned: number;
}

export interface GameStats {
  score: number;
  streak: number;
  maxStreak: number;
  correctAnswers: number;
  totalQuestions: number;
  totalTimeSpent: number;
  answers: PlayerAnswer[];
}

export interface GlobalStats {
  onlinePlayers: number;
  activeRooms: number;
  totalGenerations: number;
}

export type GameScreen = 'menu' | 'generating' | 'ready' | 'playing' | 'results' | 'settings' | 'room_lobby' | 'room_results';
