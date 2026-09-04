import { QuizData, GameMode, GameDifficulty, GameStyle } from '../types';

export interface SavedQuizItem {
  id: string;
  title: string;
  originalTopic: string;
  gameMode: GameMode;
  difficulty: GameDifficulty;
  gameStyle?: GameStyle;
  createdAt: number;
  lastPlayedAt?: number;
  playCount: number;
  bestScore?: number;
  isFavorite: boolean;
  source: 'generated' | 'invited' | 'imported' | 'preset';
  questionsCount: number;
  quizData: QuizData;
}

const STORAGE_KEY = 'guessthat_library_v1';

class QuizLibraryService {
  private cache: SavedQuizItem[] | null = null;
  private listeners: Set<() => void> = new Set();

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((l) => {
      try {
        l();
      } catch (e) {
        console.error('Library listener error:', e);
      }
    });
  }

  public getAll(): SavedQuizItem[] {
    if (this.cache !== null) return this.cache;

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        this.cache = [];
        return [];
      }
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        this.cache = parsed
          .filter(
            (item) => item && item.id && item.quizData && Array.isArray(item.quizData.questions)
          )
          .map((item) => {
            let mode: GameMode = item.gameMode || item.quizData?.gameMode;
            // Deduce gameMode if missing or defaulted to quiz
            if (!mode || mode === 'quiz') {
              const hasMusic =
                item.quizData?.questions?.some(
                  (q: any) =>
                    q.youtubeVideoId ||
                    q.audioNotes ||
                    q.youtubeSearchQuery ||
                    (q.category && q.category.toLowerCase().includes('musique'))
                ) ||
                item.quizData?.themeYoutubeVideoId ||
                item.originalTopic?.toLowerCase().includes('musique') ||
                item.originalTopic?.toLowerCase().includes('music') ||
                item.originalTopic?.toLowerCase().includes('blind test musical');

              const hasVisual =
                item.quizData?.questions?.some(
                  (q: any) =>
                    q.imageUrl ||
                    q.secondaryImageUrl ||
                    q.imagePrompt ||
                    (Array.isArray(q.images) && q.images.length > 0)
                ) ||
                item.originalTopic?.toLowerCase().includes('visuel') ||
                item.originalTopic?.toLowerCase().includes('visual') ||
                item.originalTopic?.toLowerCase().includes('blind test visuel');

              if (hasMusic && !hasVisual) {
                mode = 'music_blind_test';
              } else if (hasVisual && !hasMusic) {
                mode = 'visual_blind_test';
              }
            }
            if (!mode) mode = 'quiz';

            const diff: GameDifficulty = item.difficulty || item.quizData?.difficulty || 'medium';

            return {
              ...item,
              gameMode: mode,
              difficulty: diff,
              quizData: {
                ...item.quizData,
                gameMode: mode,
                difficulty: diff,
              },
            };
          });
        return this.cache;
      }
    } catch (err) {
      console.warn('Failed to load quiz library from localStorage:', err);
    }
    this.cache = [];
    return [];
  }

  private persist(items: SavedQuizItem[]) {
    this.cache = items;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (err: any) {
      console.error('Failed to save library to localStorage (quota or storage error):', err);
      // If quota exceeded, try to drop older non-favorite items
      if (err?.name === 'QuotaExceededError' && items.length > 5) {
        const kept = items
          .filter((i) => i.isFavorite)
          .concat(items.filter((i) => !i.isFavorite).slice(0, 10));
        this.cache = kept;
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(kept));
        } catch {}
      }
    }
    this.notify();
  }

  public getById(id: string): SavedQuizItem | undefined {
    return this.getAll().find((q) => q.id === id);
  }

  private isSameQuiz(q1: QuizData, q2: QuizData): boolean {
    if (!q1?.questions?.length || !q2?.questions?.length) return false;
    if ((q1 as any).id && (q2 as any).id && (q1 as any).id === (q2 as any).id) return true;

    // If game modes or question counts are different, they are definitely different quizzes
    if (q1.gameMode && q2.gameMode && q1.gameMode !== q2.gameMode) return false;

    // Check similarity of questions text
    const len = Math.min(q1.questions.length, q2.questions.length);
    if (len === 0) return false;

    let matchCount = 0;
    for (let i = 0; i < len; i++) {
      const q1Text = (q1.questions[i]?.question || '').trim().toLowerCase();
      const q2Text = (q2.questions[i]?.question || '').trim().toLowerCase();
      if (q1Text && q2Text && q1Text === q2Text) {
        matchCount++;
      }
    }

    // Exact same quiz if at least 2 questions match or all questions match
    return matchCount >= Math.min(2, len);
  }

  public isQuizSaved(quizData: QuizData): boolean {
    if (!quizData?.questions?.length) return false;
    const all = this.getAll();
    return all.some((item) => this.isSameQuiz(item.quizData, quizData));
  }

  public findSavedItem(quizData: QuizData): SavedQuizItem | undefined {
    if (!quizData?.questions?.length) return undefined;
    const all = this.getAll();
    return all.find((item) => this.isSameQuiz(item.quizData, quizData));
  }

  public saveQuiz(
    quizData: QuizData,
    options?: {
      source?: 'generated' | 'invited' | 'imported' | 'preset';
      isFavorite?: boolean;
      customTitle?: string;
      bestScore?: number;
      autoSave?: boolean;
    }
  ): SavedQuizItem {
    if (!quizData || !Array.isArray(quizData.questions) || quizData.questions.length === 0) {
      throw new Error('Impossible d’enregistrer un quiz sans questions valides.');
    }

    const all = [...this.getAll()];
    const topic = (quizData.topic || quizData.themeTitle || 'Quiz Inconnu').trim();
    const mode = quizData.gameMode || 'quiz';
    const difficulty = quizData.difficulty || 'medium';

    // Check if exact same quiz item already exists
    const existingIndex = all.findIndex((item) => this.isSameQuiz(item.quizData, quizData));

    const now = Date.now();

    if (existingIndex >= 0) {
      const existing = all[existingIndex];
      const updated: SavedQuizItem = {
        ...existing,
        lastPlayedAt: now,
        playCount: (existing.playCount || 0) + 1,
        bestScore: Math.max(existing.bestScore || 0, options?.bestScore || 0),
        gameMode: mode || existing.gameMode || 'quiz',
        difficulty: difficulty || existing.difficulty || 'medium',
        quizData: {
          ...existing.quizData,
          ...quizData,
          gameMode: mode || existing.gameMode || 'quiz',
          difficulty: difficulty || existing.difficulty || 'medium',
        },
        title: options?.customTitle?.trim() || existing.title,
        isFavorite: options?.isFavorite !== undefined ? options.isFavorite : existing.isFavorite,
      };
      // Move to top of library on new play or update
      all.splice(existingIndex, 1);
      all.unshift(updated);
      this.persist(all);
      return updated;
    }

    // Brand new quiz entry in library
    const newItem: SavedQuizItem = {
      id: `quiz_${now}_${Math.random().toString(36).substring(2, 8)}`,
      title: options?.customTitle?.trim() || quizData.themeTitle || topic,
      originalTopic: topic,
      gameMode: mode,
      difficulty,
      gameStyle: quizData.gameStyle,
      createdAt: now,
      lastPlayedAt: now,
      playCount: 1,
      bestScore: options?.bestScore || 0,
      isFavorite: options?.isFavorite ?? false,
      source: options?.source || 'generated',
      questionsCount: quizData.questions.length,
      quizData: {
        ...quizData,
        gameMode: mode,
        difficulty,
      },
    };

    all.unshift(newItem);
    this.persist(all);
    return newItem;
  }

  public renameQuiz(id: string, newTitle: string): boolean {
    const trimmed = newTitle.trim();
    if (!trimmed) return false;
    const all = [...this.getAll()];
    const idx = all.findIndex((q) => q.id === id);
    if (idx === -1) return false;

    all[idx] = {
      ...all[idx],
      title: trimmed,
    };
    this.persist(all);
    return true;
  }

  public toggleFavorite(id: string): boolean {
    const all = [...this.getAll()];
    const idx = all.findIndex((q) => q.id === id);
    if (idx === -1) return false;

    const nextState = !all[idx].isFavorite;
    all[idx] = {
      ...all[idx],
      isFavorite: nextState,
    };
    this.persist(all);
    return nextState;
  }

  public deleteQuiz(id: string): boolean {
    const all = [...this.getAll()];
    const filtered = all.filter((q) => q.id !== id);
    if (filtered.length === all.length) return false;
    this.persist(filtered);
    return true;
  }

  public clearNonFavorites(): void {
    const all = this.getAll().filter((q) => q.isFavorite);
    this.persist(all);
  }

  public recordPlay(quizDataOrId: QuizData | string, score?: number): void {
    const all = [...this.getAll()];
    const now = Date.now();

    let targetIdx = -1;
    if (typeof quizDataOrId === 'string') {
      targetIdx = all.findIndex((q) => q.id === quizDataOrId);
    } else {
      const topic = (quizDataOrId.topic || quizDataOrId.themeTitle || '').trim().toLowerCase();
      const firstQ = quizDataOrId.questions?.[0]?.question;
      targetIdx = all.findIndex((q) => {
        const itemTopic = (q.originalTopic || q.title || '').trim().toLowerCase();
        const itemFirstQ = q.quizData?.questions?.[0]?.question;
        return (itemTopic === topic && itemFirstQ === firstQ) || (firstQ && itemFirstQ === firstQ);
      });
    }

    if (targetIdx >= 0) {
      const item = all[targetIdx];
      all[targetIdx] = {
        ...item,
        lastPlayedAt: now,
        playCount: (item.playCount || 0) + 1,
        bestScore: Math.max(item.bestScore || 0, score || 0),
      };
      this.persist(all);
    }
  }

  // Export a single quiz as JSON file
  public exportQuizAsJson(item: SavedQuizItem): void {
    const exportData = {
      format: 'GuessThat-Quiz-Export',
      version: '1.0',
      exportedAt: new Date().toISOString(),
      quiz: {
        title: item.title,
        originalTopic: item.originalTopic,
        gameMode: item.gameMode,
        difficulty: item.difficulty,
        gameStyle: item.gameStyle,
        quizData: item.quizData,
      },
    };

    const cleanFilename = (item.title || 'quiz')
      .toLowerCase()
      .replace(/[^a-z0-9à-ÿ]/gi, '_')
      .replace(/_+/g, '_')
      .slice(0, 40);

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `guessthat_${cleanFilename}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Export all library as JSON file
  public exportLibraryAsJson(): void {
    const all = this.getAll();
    const exportData = {
      format: 'GuessThat-Library-Backup',
      version: '1.0',
      exportedAt: new Date().toISOString(),
      count: all.length,
      quizzes: all,
    };

    const dateStr = new Date().toISOString().slice(0, 10);
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `guessthat_library_backup_${dateStr}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Import JSON content (supports single quiz export, full backup, or direct QuizData)
  public importFromJson(jsonString: string): {
    success: boolean;
    importedCount: number;
    message: string;
    items?: SavedQuizItem[];
  } {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed) throw new Error('Contenu JSON vide ou non valide.');

      const toImport: { quizData: QuizData; title?: string; isFav?: boolean }[] = [];

      // Case 1: Full Library Backup
      if (parsed.format === 'GuessThat-Library-Backup' && Array.isArray(parsed.quizzes)) {
        parsed.quizzes.forEach((item: any) => {
          if (item?.quizData && Array.isArray(item.quizData.questions) && item.quizData.questions.length > 0) {
            toImport.push({
              quizData: item.quizData,
              title: item.title,
              isFav: item.isFavorite,
            });
          }
        });
      }
      // Case 2: Single Quiz Export wrapper
      else if (parsed.format === 'GuessThat-Quiz-Export' && parsed.quiz?.quizData) {
        toImport.push({
          quizData: parsed.quiz.quizData,
          title: parsed.quiz.title,
          isFav: false,
        });
      }
      // Case 3: Raw QuizData object
      else if (Array.isArray(parsed.questions) && parsed.questions.length > 0) {
        toImport.push({
          quizData: parsed as QuizData,
          title: parsed.themeTitle || parsed.topic,
          isFav: false,
        });
      }
      // Case 4: Array of QuizData
      else if (Array.isArray(parsed)) {
        parsed.forEach((entry: any) => {
          if (Array.isArray(entry.questions) && entry.questions.length > 0) {
            toImport.push({
              quizData: entry as QuizData,
              title: entry.themeTitle || entry.topic,
              isFav: false,
            });
          } else if (entry.quizData && Array.isArray(entry.quizData.questions)) {
            toImport.push({
              quizData: entry.quizData,
              title: entry.title || entry.quizData.themeTitle || entry.quizData.topic,
              isFav: entry.isFavorite,
            });
          }
        });
      } else {
        throw new Error(
          'Format de quiz non reconnu. Le fichier doit contenir un tableau de questions valide.'
        );
      }

      if (toImport.length === 0) {
        return {
          success: false,
          importedCount: 0,
          message: 'Aucun quiz avec questions valides trouvé dans ce fichier.',
        };
      }

      const importedItems: SavedQuizItem[] = [];
      toImport.forEach((entry) => {
        const item = this.saveQuiz(entry.quizData, {
          source: 'imported',
          customTitle: entry.title,
          isFavorite: entry.isFav ?? false,
        });
        importedItems.push(item);
      });

      return {
        success: true,
        importedCount: toImport.length,
        message: `${toImport.length} quiz ${
          toImport.length > 1 ? 'ont été importés' : 'a été importé'
        } avec succès dans ta bibliothèque !`,
        items: importedItems,
      };
    } catch (err: any) {
      return {
        success: false,
        importedCount: 0,
        message: err.message || 'Erreur lors du décodage du fichier JSON.',
      };
    }
  }

  // Generate a share text
  public generateShareText(item: SavedQuizItem): string {
    const modeLabel =
      item.gameMode === 'music_blind_test'
        ? '🎵 Blind Test Musical'
        : item.gameMode === 'visual_blind_test'
        ? '🖼️ Blind Test Visuel'
        : '🧠 Quiz Culture';

    const diffLabel =
      item.difficulty === 'easy'
        ? 'Facile'
        : item.difficulty === 'hard'
        ? 'Difficile'
        : item.difficulty === 'expert'
        ? 'Expert'
        : 'Moyen';

    return `🎯 GuessThat! Découvre ce quiz : "${item.title}"\n🕹️ Mode : ${modeLabel}\n⚡ Difficulté : ${diffLabel}\n❓ Questions : ${item.questionsCount}\nRejoins-moi sur GuessThat! pour tester tes connaissances !`;
  }
}

export const quizLibraryService = new QuizLibraryService();
