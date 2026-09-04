import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  Star,
  Clock,
  Search,
  Download,
  Upload,
  Play,
  Share2,
  Trash2,
  Edit2,
  Check,
  X,
  Sparkles,
  Users,
  Tv,
  Music2,
  Eye,
  HelpCircle,
  FileJson,
  Copy,
  ChevronDown,
  ChevronUp,
  Flame,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { QuizData, GameMode, GameDifficulty, GameStyle } from '../types';
import { quizLibraryService, SavedQuizItem } from '../services/quizLibraryService';
import { soundEngine } from '../services/soundEngine';
import { t } from '../i18n/translations';

interface QuizLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: string;
  onPlaySolo: (quizData: QuizData, mode: GameMode, difficulty: GameDifficulty) => void;
  onPlayMulti: (quizData: QuizData, mode: GameMode, difficulty: GameDifficulty) => void;
  onPlaySlideshow: (quizData: QuizData, mode: GameMode, difficulty: GameDifficulty) => void;
}

type FilterTab = 'all' | 'favorites' | 'history' | 'quiz' | 'music_blind_test' | 'visual_blind_test';

export const QuizLibraryModal: React.FC<QuizLibraryModalProps> = ({
  isOpen,
  onClose,
  language = 'fr',
  onPlaySolo,
  onPlayMulti,
  onPlaySlideshow,
}) => {
  const [quizzes, setQuizzes] = useState<SavedQuizItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [shareItem, setShareItem] = useState<SavedQuizItem | null>(null);
  const [copiedShare, setCopiedShare] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [importNotification, setImportNotification] = useState<string | null>(null);
  const [expandedQuizId, setExpandedQuizId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const refreshList = () => {
    setQuizzes(quizLibraryService.getAll());
  };

  useEffect(() => {
    if (isOpen) {
      refreshList();
      const unsubscribe = quizLibraryService.subscribe(() => {
        refreshList();
      });
      return () => unsubscribe();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Filter quizzes
  const filteredQuizzes = quizzes.filter((q) => {
    // Search match
    if (searchQuery.trim()) {
      const qLower = searchQuery.toLowerCase().trim();
      const matchesTitle = q.title?.toLowerCase().includes(qLower);
      const matchesTopic = q.originalTopic?.toLowerCase().includes(qLower);
      const matchesQuestion = q.quizData?.questions?.some((quest) =>
        quest.question?.toLowerCase().includes(qLower)
      );
      if (!matchesTitle && !matchesTopic && !matchesQuestion) return false;
    }

    // Tab filter
    if (activeTab === 'favorites') return q.isFavorite;
    if (activeTab === 'history') return true; // will be sorted by lastPlayedAt
    if (activeTab === 'quiz') return q.gameMode === 'quiz';
    if (activeTab === 'music_blind_test') return q.gameMode === 'music_blind_test';
    if (activeTab === 'visual_blind_test') return q.gameMode === 'visual_blind_test';
    return true;
  });

  // Sort: history sorts by lastPlayedAt descending, otherwise favorites first then lastPlayedAt
  const sortedQuizzes = [...filteredQuizzes].sort((a, b) => {
    if (activeTab === 'history') {
      return (b.lastPlayedAt || b.createdAt) - (a.lastPlayedAt || a.createdAt);
    }
    if (a.isFavorite && !b.isFavorite) return -1;
    if (!a.isFavorite && b.isFavorite) return 1;
    return (b.lastPlayedAt || b.createdAt) - (a.lastPlayedAt || a.createdAt);
  });

  const favoritesCount = quizzes.filter((q) => q.isFavorite).length;

  const handleStartEditing = (item: SavedQuizItem) => {
    soundEngine.playClick();
    setEditingId(item.id);
    setEditTitle(item.title);
  };

  const handleSaveTitle = (id: string) => {
    soundEngine.playClick();
    if (editTitle.trim()) {
      quizLibraryService.renameQuiz(id, editTitle.trim());
    }
    setEditingId(null);
  };

  const handleToggleFavorite = (id: string) => {
    soundEngine.playClick();
    quizLibraryService.toggleFavorite(id);
  };

  const handleDelete = (id: string) => {
    soundEngine.playWrong();
    quizLibraryService.deleteQuiz(id);
    setDeleteConfirmId(null);
  };

  const handleExportSingle = (item: SavedQuizItem) => {
    soundEngine.playClick();
    quizLibraryService.exportQuizAsJson(item);
  };

  const handleExportAll = () => {
    soundEngine.playClick();
    quizLibraryService.exportLibraryAsJson();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = ev.target?.result as string;
      if (content) {
        processImportJson(content);
      }
    };
    reader.readAsText(file);
    if (e.target) e.target.value = '';
  };

  const processImportJson = (content: string) => {
    const result = quizLibraryService.importFromJson(content);
    if (result.success) {
      soundEngine.playCorrect();
      setImportNotification(result.message);
      setIsImportModalOpen(false);
      setImportJsonText('');
      setTimeout(() => setImportNotification(null), 4000);
    } else {
      soundEngine.playWrong();
      alert(`Erreur d'import : ${result.message}`);
    }
  };

  const handleCopyShareText = (item: SavedQuizItem) => {
    soundEngine.playClick();
    const text = quizLibraryService.generateShareText(item);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  const handleCopyShareJson = (item: SavedQuizItem) => {
    soundEngine.playClick();
    const exportObj = {
      format: 'GuessThat-Quiz-Export',
      version: '1.0',
      quiz: {
        title: item.title,
        originalTopic: item.originalTopic,
        gameMode: item.gameMode,
        difficulty: item.difficulty,
        quizData: item.quizData,
      },
    };
    if (navigator.clipboard) {
      navigator.clipboard.writeText(JSON.stringify(exportObj, null, 2));
      setCopiedJson(true);
      setTimeout(() => setCopiedJson(false), 2000);
    }
  };

  const getModeBadge = (mode: GameMode) => {
    switch (mode) {
      case 'music_blind_test':
        return {
          icon: <Music2 className="w-3.5 h-3.5 text-pink-400" />,
          label: 'Blind Test Musical',
          color: 'bg-pink-500/20 text-pink-300 border-pink-500/40',
        };
      case 'visual_blind_test':
        return {
          icon: <Eye className="w-3.5 h-3.5 text-cyan-400" />,
          label: 'Blind Test Visuel',
          color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
        };
      default:
        return {
          icon: <HelpCircle className="w-3.5 h-3.5 text-purple-400" />,
          label: 'Quiz Culture',
          color: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
        };
    }
  };

  const getSourceBadge = (source: string) => {
    switch (source) {
      case 'invited':
        return { label: 'Salon Invité', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' };
      case 'imported':
        return { label: 'Importé', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
      case 'preset':
        return { label: 'Officiel', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' };
      default:
        return { label: 'IA Gemini', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
    }
  };

  const formatDate = (timestamp: number) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div
        id="quiz-library-modal-container"
        className="w-full max-w-5xl max-h-[92vh] flex flex-col bg-[#0F0A1F]/95 border border-purple-500/30 rounded-2xl sm:rounded-3xl shadow-[0_0_50px_rgba(168,85,247,0.25)] overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between gap-3 bg-gradient-to-r from-purple-900/30 via-black/40 to-pink-900/30">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 shadow-inner shrink-0">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-2xl font-black text-white font-heading truncate">
                  {t('library_title', language)}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-purple-500/30 border border-purple-400/40 text-purple-200 text-xs font-black">
                  {quizzes.length}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-white/60 truncate">
                {t('library_subtitle', language)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Export All button */}
            {quizzes.length > 0 && (
              <button
                onClick={handleExportAll}
                id="btn-export-all-library"
                className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white/80 hover:text-white text-xs font-bold transition-all cursor-pointer"
                title="Exporter tous les quiz en sauvegarde JSON"
              >
                <Download className="w-4 h-4 text-purple-400" />
                <span>{t('library_export_all', language)}</span>
              </button>
            )}

            {/* Import Button */}
            <button
              onClick={() => {
                soundEngine.playClick();
                setIsImportModalOpen(true);
              }}
              id="btn-import-quiz-json"
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 hover:text-white text-xs font-bold transition-all cursor-pointer shadow-md"
            >
              <Upload className="w-4 h-4 text-pink-400" />
              <span className="hidden xs:inline">{t('library_import', language)}</span>
              <span className="xs:hidden">Importer</span>
            </button>

            {/* Close */}
            <button
              onClick={() => {
                soundEngine.playClick();
                onClose();
              }}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white cursor-pointer transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Success toast notification */}
        {importNotification && (
          <div className="mx-4 mt-3 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{importNotification}</span>
          </div>
        )}

        {/* Search & Tabs Controls */}
        <div className="p-3 sm:p-4 border-b border-white/10 bg-black/20 flex flex-col gap-3">
          {/* Search bar */}
          <div className="relative w-full">
            <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par titre, thème ou question..."
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-white/5 border border-white/15 text-white placeholder-white/40 text-xs sm:text-sm focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/50 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar text-xs">
            <button
              onClick={() => {
                soundEngine.playClick();
                setActiveTab('all');
              }}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'all'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <span>{t('library_all', language)}</span>
              <span className="text-[10px] opacity-75">({quizzes.length})</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playClick();
                setActiveTab('favorites');
              }}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'favorites'
                  ? 'bg-amber-500 text-black shadow-md shadow-amber-500/30'
                  : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${activeTab === 'favorites' ? 'fill-black' : 'text-yellow-400'}`} />
              <span>{t('library_favorites', language)}</span>
              <span className="text-[10px] opacity-75">({favoritesCount})</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playClick();
                setActiveTab('history');
              }}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'history'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{t('library_history', language)}</span>
            </button>

            <div className="w-[1px] h-5 bg-white/15 mx-1" />

            <button
              onClick={() => {
                soundEngine.playClick();
                setActiveTab('quiz');
              }}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'quiz'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
              <span>Quiz</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playClick();
                setActiveTab('music_blind_test');
              }}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'music_blind_test'
                  ? 'bg-pink-600 text-white shadow-md'
                  : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <Music2 className="w-3.5 h-3.5 text-pink-400" />
              <span>Blind Test Audio</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playClick();
                setActiveTab('visual_blind_test');
              }}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'visual_blind_test'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-cyan-400" />
              <span>Blind Test Visuel</span>
            </button>
          </div>
        </div>

        {/* Quizzes List Container */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 flex flex-col gap-3 custom-scrollbar">
          {sortedQuizzes.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center my-auto">
              <div className="w-16 h-16 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-3">
                {activeTab === 'favorites' ? (
                  <Star className="w-8 h-8 text-yellow-400" />
                ) : (
                  <BookOpen className="w-8 h-8" />
                )}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-1 font-heading">
                {activeTab === 'favorites'
                  ? 'Aucun quiz dans tes favoris'
                  : searchQuery
                  ? 'Aucun résultat trouvé'
                  : t('library_empty_title', language)}
              </h3>
              <p className="text-xs sm:text-sm text-white/50 max-w-md">
                {activeTab === 'favorites'
                  ? 'Clique sur l’étoile pour ajouter n’importe quel quiz à tes favoris et le retrouver rapidement.'
                  : searchQuery
                  ? `Aucun quiz ne correspond à "${searchQuery}". Essaie un autre terme.`
                  : t('library_empty_desc', language)}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {sortedQuizzes.map((item) => {
                const modeInfo = getModeBadge(item.gameMode);
                const sourceInfo = getSourceBadge(item.source);
                const isEditing = editingId === item.id;
                const isExpanded = expandedQuizId === item.id;
                const isConfirmingDelete = deleteConfirmId === item.id;

                return (
                  <div
                    key={item.id}
                    className="relative flex flex-col rounded-2xl border border-white/15 bg-white/5 hover:border-purple-500/40 backdrop-blur-xl p-3 sm:p-4 transition-all duration-200 group shadow-lg"
                  >
                    {/* Top Row: Badges & Favorite button */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {/* Mode badge */}
                        <span
                          className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${modeInfo.color}`}
                        >
                          {modeInfo.icon}
                          <span>{modeInfo.label}</span>
                        </span>

                        {/* Difficulty badge */}
                        <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/70 text-[10px] font-bold capitalize">
                          {item.difficulty}
                        </span>

                        {/* Source badge */}
                        <span
                          className={`px-2 py-0.5 rounded-full border text-[9px] font-bold ${sourceInfo.color}`}
                        >
                          {sourceInfo.label}
                        </span>
                      </div>

                      {/* Favorite star */}
                      <button
                        onClick={() => handleToggleFavorite(item.id)}
                        className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
                          item.isFavorite
                            ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 scale-110 shadow-sm'
                            : 'bg-white/5 border-white/10 text-white/30 hover:text-white/70'
                        }`}
                        title={item.isFavorite ? t('remove_from_favorites', language) : t('add_to_favorites', language)}
                      >
                        <Star className={`w-4 h-4 ${item.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
                      </button>
                    </div>

                    {/* Quiz Title & Inline Rename */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      {isEditing ? (
                        <div className="flex items-center gap-1.5 w-full">
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSaveTitle(item.id)}
                            className="flex-1 px-2.5 py-1 bg-black/60 border border-purple-400 rounded-lg text-white text-sm font-bold focus:outline-none"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSaveTitle(item.id)}
                            className="p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 cursor-pointer"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-1.5 rounded-lg bg-white/10 text-white/70 hover:bg-white/20 cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <h4 className="text-sm sm:text-base font-black text-white font-heading truncate leading-snug">
                            {item.title}
                          </h4>
                          <button
                            onClick={() => handleStartEditing(item)}
                            className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-white/40 hover:text-purple-300 hover:bg-white/5 transition-opacity cursor-pointer shrink-0"
                            title="Renommer ce quiz"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Metadata: Questions count, Play count, Best score, Date */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-white/50 mb-3">
                      <span className="flex items-center gap-1 text-white/70 font-semibold">
                        <Sparkles className="w-3 h-3 text-purple-400" />
                        {item.questionsCount || item.quizData?.questions?.length || 0} questions
                      </span>

                      {item.playCount > 0 && (
                        <span>
                          {item.playCount} partie{item.playCount > 1 ? 's' : ''}
                        </span>
                      )}

                      {item.bestScore !== undefined && item.bestScore > 0 && (
                        <span className="text-amber-400 font-bold">
                          Record : {item.bestScore.toLocaleString()} pts
                        </span>
                      )}

                      <span className="text-white/40">{formatDate(item.lastPlayedAt || item.createdAt)}</span>
                    </div>

                    {/* Action buttons */}
                    <div className="mt-auto pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-1.5">
                      {/* Play options */}
                      <div className="flex items-center gap-1.5 flex-1 min-w-0">
                        {/* Play Solo button */}
                        <button
                          onClick={() => {
                            soundEngine.playClick();
                            onPlaySolo(
                              {
                                ...item.quizData,
                                gameMode: item.gameMode,
                                difficulty: item.difficulty,
                              },
                              item.gameMode,
                              item.difficulty
                            );
                            onClose();
                          }}
                          className="flex-1 py-1.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md shadow-purple-900/30 active:scale-95"
                          title="Lancer le quiz en Solo"
                        >
                          <Play className="w-3.5 h-3.5 fill-white" />
                          <span>Jouer Solo</span>
                        </button>

                        {/* Create Room button */}
                        <button
                          onClick={() => {
                            soundEngine.playClick();
                            onPlayMulti(
                              {
                                ...item.quizData,
                                gameMode: item.gameMode,
                                difficulty: item.difficulty,
                              },
                              item.gameMode,
                              item.difficulty
                            );
                            onClose();
                          }}
                          className="py-1.5 px-2.5 rounded-xl bg-pink-600/30 hover:bg-pink-600/50 border border-pink-500/40 text-pink-200 hover:text-white font-bold text-xs flex items-center gap-1 transition-all cursor-pointer active:scale-95"
                          title="Créer un salon Multijoueur avec ce quiz"
                        >
                          <Users className="w-3.5 h-3.5 text-pink-300" />
                          <span className="hidden sm:inline">Salon</span>
                        </button>

                        {/* Slideshow button */}
                        <button
                          onClick={() => {
                            soundEngine.playClick();
                            onPlaySlideshow(
                              {
                                ...item.quizData,
                                gameMode: item.gameMode,
                                difficulty: item.difficulty,
                              },
                              item.gameMode,
                              item.difficulty
                            );
                            onClose();
                          }}
                          className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-all cursor-pointer"
                          title="Mode Diaporama (Sans chrono)"
                        >
                          <Tv className="w-3.5 h-3.5 text-blue-300" />
                        </button>
                      </div>

                      {/* Share, Export, Details, Delete */}
                      <div className="flex items-center gap-1 shrink-0">
                        {/* Share */}
                        <button
                          onClick={() => {
                            soundEngine.playClick();
                            setShareItem(item);
                          }}
                          className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-purple-300 transition-all cursor-pointer"
                          title="Partager ce quiz"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Export single JSON */}
                        <button
                          onClick={() => handleExportSingle(item)}
                          className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-emerald-300 transition-all cursor-pointer"
                          title="Télécharger le fichier JSON"
                        >
                          <FileJson className="w-3.5 h-3.5" />
                        </button>

                        {/* Expand questions */}
                        <button
                          onClick={() => {
                            soundEngine.playClick();
                            setExpandedQuizId(isExpanded ? null : item.id);
                          }}
                          className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-all cursor-pointer"
                          title="Voir les questions"
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {/* Delete button */}
                        {isConfirmingDelete ? (
                          <div className="flex items-center gap-1 bg-red-900/60 p-1 rounded-xl border border-red-500/50">
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="px-2 py-0.5 rounded bg-red-600 text-white text-[10px] font-black cursor-pointer"
                            >
                              Oui
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="px-1.5 py-0.5 text-white/70 text-[10px] cursor-pointer"
                            >
                              Non
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              soundEngine.playClick();
                              setDeleteConfirmId(item.id);
                            }}
                            className="p-1.5 rounded-xl bg-white/5 hover:bg-red-500/20 border border-white/10 text-white/40 hover:text-red-400 transition-all cursor-pointer"
                            title="Supprimer de la bibliothèque"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Expandable questions drawer */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-3 pt-3 border-t border-white/10 flex flex-col gap-1.5 text-xs overflow-hidden"
                        >
                          <span className="font-bold text-white/70 text-[11px] mb-0.5">
                            Aperçu des questions ({item.quizData.questions.length}) :
                          </span>
                          <div className="max-h-48 overflow-y-auto pr-1 flex flex-col gap-1.5 custom-scrollbar">
                            {item.quizData.questions.map((q, qIdx) => (
                              <div
                                key={qIdx}
                                className="p-2 rounded-lg bg-black/40 border border-white/5 flex items-start gap-2 text-[11px]"
                              >
                                <span className="font-bold text-purple-400 shrink-0">
                                  #{qIdx + 1}
                                </span>
                                <div className="flex-1 min-w-0">
                                  <p className="text-white/90 font-medium truncate">{q.question}</p>
                                  <span className="text-emerald-400 font-semibold text-[10px]">
                                    ✓ {q.correctAnswer}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-3 sm:p-4 border-t border-white/10 bg-black/30 flex items-center justify-between text-xs text-white/50">
          <span>
            {quizzes.length} quiz sauvegardé{quizzes.length > 1 ? 's' : ''} localement
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExportAll}
              className="hover:text-purple-300 underline cursor-pointer md:hidden"
            >
              Exporter tout (.json)
            </button>
            <button
              onClick={() => {
                soundEngine.playClick();
                onClose();
              }}
              className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold cursor-pointer transition-all"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>

      {/* Share Modal Sub-dialog */}
      <AnimatePresence>
        {shareItem && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#160D2E] border border-purple-500/40 rounded-2xl sm:rounded-3xl p-5 shadow-2xl flex flex-col gap-4 text-white"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-purple-400" />
                  <h3 className="font-heading font-black text-lg">Partager ce quiz</h3>
                </div>
                <button
                  onClick={() => setShareItem(null)}
                  className="text-white/60 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-xs flex flex-col gap-1">
                <span className="font-extrabold text-sm text-purple-300">{shareItem.title}</span>
                <span className="text-white/70">
                  {shareItem.questionsCount} questions • Mode {shareItem.gameMode} • Difficulté {shareItem.difficulty}
                </span>
              </div>

              {/* Share actions */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleCopyShareText(shareItem)}
                  className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md"
                >
                  <Copy className="w-4 h-4" />
                  <span>{copiedShare ? 'Texte copié dans le presse-papier !' : 'Copier le résumé pour Discord / SMS'}</span>
                </button>

                <button
                  onClick={() => handleCopyShareJson(shareItem)}
                  className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <FileJson className="w-4 h-4 text-pink-300" />
                  <span>{copiedJson ? 'Code JSON copié !' : 'Copier le contenu JSON brut'}</span>
                </button>

                <button
                  onClick={() => {
                    handleExportSingle(shareItem);
                    setShareItem(null);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all text-white/80"
                >
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span>Télécharger le fichier .json</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Import Modal Sub-dialog */}
      <AnimatePresence>
        {isImportModalOpen && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-[#160D2E] border border-purple-500/40 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col gap-4 text-white"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Upload className="w-5 h-5 text-pink-400" />
                  <h3 className="font-heading font-black text-lg">Importer un quiz ou une sauvegarde</h3>
                </div>
                <button
                  onClick={() => setIsImportModalOpen(false)}
                  className="text-white/60 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Option 1: File selector */}
              <input
                type="file"
                ref={fileInputRef}
                accept=".json,application/json"
                onChange={handleFileUpload}
                className="hidden"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className="p-6 border-2 border-dashed border-purple-400/40 hover:border-purple-400 rounded-2xl bg-purple-500/5 hover:bg-purple-500/10 flex flex-col items-center justify-center gap-2 text-center cursor-pointer transition-all"
              >
                <FileJson className="w-8 h-8 text-purple-400" />
                <span className="font-bold text-sm text-white">
                  Sélectionner un fichier JSON (.json)
                </span>
                <span className="text-xs text-white/50">
                  Supporte les quiz uniques GuessThat, les QuizData bruts et les sauvegardes complètes
                </span>
              </div>

              <div className="flex items-center gap-3 text-white/40 text-xs font-bold">
                <div className="flex-1 h-[1px] bg-white/10" />
                <span>OU COLLER LE JSON</span>
                <div className="flex-1 h-[1px] bg-white/10" />
              </div>

              {/* Option 2: Paste JSON */}
              <textarea
                rows={4}
                value={importJsonText}
                onChange={(e) => setImportJsonText(e.target.value)}
                placeholder='Colle ici le JSON du quiz (ex: { "questions": [...] })'
                className="w-full p-3 rounded-xl bg-black/50 border border-white/15 text-xs text-white placeholder-white/40 focus:outline-none focus:border-purple-400 custom-scrollbar font-mono"
              />

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  onClick={() => {
                    if (importJsonText.trim()) {
                      processImportJson(importJsonText.trim());
                    }
                  }}
                  disabled={!importJsonText.trim()}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-xs font-extrabold text-white cursor-pointer transition-all shadow-md"
                >
                  Importer le contenu
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
