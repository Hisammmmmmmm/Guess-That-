import 'dotenv/config';
import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { WebSocketServer, WebSocket } from 'ws';
import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { generateFallbackQuiz } from './src/data/fallbackGenerator';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface ServerPlayer {
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
  ws?: WebSocket;
}

interface ServerRoom {
  code: string;
  hostId: string;
  status: 'lobby' | 'playing' | 'question_result' | 'game_over';
  topic: string;
  themeTitle: string;
  themeBgImage?: string;
  primaryColor?: string;
  accentColor?: string;
  difficulty: string;
  gameMode: string;
  gameStyle: string;
  durationPerQuestion: number;
  currentQuestionIndex: number;
  questionStartTime: number;
  quizData: any;
  newQuizReady?: boolean;
  players: Map<string, ServerPlayer>;
  createdAt: number;
  autoNextTimer?: any;
}

// In-memory active rooms map
const activeRooms = new Map<string, ServerRoom>();

function serializeRoom(room: ServerRoom) {
  const playersObj: Record<string, any> = {};
  room.players.forEach((p, id) => {
    playersObj[id] = {
      id: p.id,
      name: p.name,
      avatar: p.avatar,
      score: p.score,
      streak: p.streak,
      maxStreak: p.maxStreak,
      answeredCurrent: p.answeredCurrent,
      isCorrect: room.status === 'question_result' || room.status === 'game_over' ? p.isCorrect : undefined,
      selectedOption: room.status === 'question_result' || room.status === 'game_over' ? p.selectedOption : undefined,
      timeSpent: p.timeSpent,
      isHost: p.isHost,
      lastScoreEarned: p.lastScoreEarned,
      answersHistory: p.answersHistory || {},
    };
  });

  return {
    code: room.code,
    hostId: room.hostId,
    status: room.status,
    topic: room.topic,
    themeTitle: room.themeTitle,
    themeBgImage: room.themeBgImage,
    primaryColor: room.primaryColor,
    accentColor: room.accentColor,
    difficulty: room.difficulty,
    gameMode: room.gameMode,
    gameStyle: room.gameStyle,
    durationPerQuestion: room.durationPerQuestion,
    currentQuestionIndex: room.currentQuestionIndex,
    questionStartTime: room.questionStartTime,
    quizData: room.quizData,
    newQuizReady: room.newQuizReady,
    players: playersObj,
  };
}

function broadcastToRoom(room: ServerRoom, payload: any) {
  const message = JSON.stringify(payload);
  room.players.forEach((player) => {
    if (player.ws && player.ws.readyState === WebSocket.OPEN) {
      player.ws.send(message);
    }
  });
}

function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const server = http.createServer(app);
  const wss = new WebSocketServer({ server });

  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // In-memory cache for YouTube searches to make audio instant
  const ytCache = new Map<string, { videoId: string; title: string; videoIds?: string[] }>();

  // In-memory cache for Wikipedia images and second images
  const wikiImageCache = new Map<string, string>();
  const secondImageCache = new Map<string, string>();

  // Pre-seed common music queries for instant 0ms responses
  ytCache.set('ost retro game menu theme loop', { videoId: 'jfKfPfyJRdk', title: 'Lofi Hip Hop / Retro Synth Ambience' });
  ytCache.set('ost synthwave gaming loop', { videoId: '4xDzrJKXOOY', title: 'Synthwave Chill' });

  // Robust Image Retriever using DuckDuckGo (Primary Engine)
  async function fetchDDGImage(query: string, answer: string = '', topic: string = '', skipIndex: number = 0): Promise<string | null> {
    const cleanQ = (query || '').trim();
    if (!cleanQ && !answer) return null;
    const cacheKey = `${cleanQ}_${answer}_${topic}_skip${skipIndex}`;
    
    if (wikiImageCache.has(cacheKey)) {
      return wikiImageCache.get(cacheKey)!;
    }

    // Try top 2 specific queries prioritizing the exact character / item
    const queries = [
      answer ? `${answer} ${topic}`.trim() : null,
      cleanQ,
    ].filter((q, i, arr): q is string => Boolean(q && q.length > 0 && arr.indexOf(q) === i)).slice(0, 2);

    for (const q of queries) {
      try {
        const res = await fetch(`https://duckduckgo.com/?q=${encodeURIComponent(q)}&t=h_&iax=images&ia=images`, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' },
            signal: AbortSignal.timeout(2500),
        });
        const text = await res.text();
        
        let vqdMatch = text.match(/vqd=["']?([\d-]+)["']?/);
        if (!vqdMatch) vqdMatch = text.match(/vqd=([^&'"]+)/);
        
        if (vqdMatch && vqdMatch[1]) {
            const vqd = vqdMatch[1];
            const imgRes = await fetch(`https://duckduckgo.com/i.js?l=us-en&o=json&q=${encodeURIComponent(q)}&vqd=${vqd}&f=,,,&p=1`, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'application/json, text/javascript, */*; q=0.01'
                },
                signal: AbortSignal.timeout(2500),
            });
            const imgData = await imgRes.json();
            
            // Filter out obvious logos or tiny icons
            const validImages = (imgData.results || []).filter((r: any) => 
              r.image &&
              !r.image.toLowerCase().includes('logo') && 
              !r.image.toLowerCase().includes('icon') &&
              !r.image.endsWith('.svg')
            );
            
            if (validImages.length > skipIndex) {
                const imgUrl = validImages[skipIndex].image;
                wikiImageCache.set(cacheKey, imgUrl);
                return imgUrl;
            } else if (validImages.length > 0) {
                const imgUrl = validImages[0].image;
                wikiImageCache.set(cacheKey, imgUrl);
                return imgUrl;
            }
        }
      } catch (e) {
        // ignore and try next query
      }
    }

    return null;
  }

  // Category translation to English
  function translateCategoryToEnglish(category: string): string {
    const c = (category || '').toLowerCase().trim();
    if (!c) return '';
    if (c.includes('personnage') || c.includes('character')) return 'character';
    if (c.includes('jeu') || c.includes('gaming') || c.includes('game')) return 'video game';
    if (c.includes('film') || c.includes('movie') || c.includes('ciné')) return 'movie';
    if (c.includes('série') || c.includes('tv') || c.includes('show')) return 'tv series';
    if (c.includes('anime') || c.includes('manga')) return 'anime character';
    if (c.includes('dessin animé') || c.includes('cartoon') || c.includes('animation')) return 'animated series';
    if (c.includes('monument') || c.includes('lieu') || c.includes('édifice') || c.includes('place')) return 'landmark';
    if (c.includes('ville') || c.includes('city') || c.includes('pays') || c.includes('country')) return 'city location';
    if (c.includes('acteur') || c.includes('actrice') || c.includes('actor') || c.includes('actress')) return 'actor';
    if (c.includes('célébrité') || c.includes('celebrity') || c.includes('personnalité')) return 'celebrity';
    if (c.includes('chanteur') || c.includes('chanteuse') || c.includes('singer') || c.includes('musique') || c.includes('groupe') || c.includes('band')) return 'music artist band';
    if (c.includes('animal') || c.includes('espèce') || c.includes('nature') || c.includes('faune')) return 'animal wildlife';
    if (c.includes('véhicule') || c.includes('voiture') || c.includes('car') || c.includes('vehicle')) return 'vehicle car';
    if (c.includes('arme') || c.includes('objet') || c.includes('weapon') || c.includes('item')) return 'item weapon';
    if (c.includes('peinture') || c.includes('tableau') || c.includes('art') || c.includes('painting')) return 'painting artwork';
    return category.trim();
  }

  // Topic translation to English
  function translateTopicToEnglish(topic: string): string {
    const t = (topic || '').toLowerCase().trim();
    if (!t) return '';
    if (t.includes('jeux vidéo') || t.includes('jeu vidéo')) return 'video games';
    if (t.includes('dessins animés') || t.includes('dessin animé')) return 'cartoons animation';
    if (t.includes('films') || t.includes('cinéma') || t.includes('film')) return 'movies cinema';
    if (t.includes('séries') || t.includes('série')) return 'tv shows';
    if (t.includes('monuments') || t.includes('monument')) return 'world landmarks';
    if (t.includes('animaux') || t.includes('animal')) return 'animals wildlife';
    if (t.includes('célébrités') || t.includes('célébrité')) return 'celebrities';
    if (t.includes('histoire')) return 'history';
    if (t.includes('géographie')) return 'geography';
    return topic.trim();
  }

  // Second Image Search: exact same DuckDuckGo engine as Image 1, but formulated in English and with the Category taken into account
  async function fetchSecondImage(query: string, answer: string = '', category: string = '', topic: string = ''): Promise<{ url: string | null; source: string }> {
    const cleanAns = (answer || '').trim();
    const cleanCat = (category || '').trim();
    const cleanTopic = (topic || '').trim();
    const cleanQ = (query || '').trim();
    const cacheKey = `sec_en_${cleanQ}_${cleanAns}_${cleanCat}_${cleanTopic}`;

    if (secondImageCache.has(cacheKey)) {
      return { url: secondImageCache.get(cacheKey)!, source: 'Web (EN)' };
    }

    const engCat = translateCategoryToEnglish(cleanCat);
    const engTopic = translateTopicToEnglish(cleanTopic);

    // Queries formulated in English with category + answer prioritization (top 2)
    const queries = [
      engCat && cleanAns ? `${cleanAns} ${engCat}`.trim() : null,
      cleanAns && engTopic ? `${cleanAns} ${engTopic}`.trim() : null,
      cleanAns ? cleanAns : null,
    ].filter((q, i, arr): q is string => Boolean(q && q.length > 0 && arr.indexOf(q) === i)).slice(0, 2);

    for (const q of queries) {
      try {
        const res = await fetch(`https://duckduckgo.com/?q=${encodeURIComponent(q)}&t=h_&iax=images&ia=images`, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' },
          signal: AbortSignal.timeout(2500),
        });
        const text = await res.text();
        
        let vqdMatch = text.match(/vqd=["']?([\d-]+)["']?/);
        if (!vqdMatch) vqdMatch = text.match(/vqd=([^&'"]+)/);
        
        if (vqdMatch && vqdMatch[1]) {
          const vqd = vqdMatch[1];
          const imgRes = await fetch(`https://duckduckgo.com/i.js?l=us-en&o=json&q=${encodeURIComponent(q)}&vqd=${vqd}&f=,,,&p=1`, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
              'Accept': 'application/json, text/javascript, */*; q=0.01'
            },
            signal: AbortSignal.timeout(2500),
          });
          const imgData = await imgRes.json();
          
          const validImages = (imgData.results || []).filter((r: any) => 
            r.image &&
            !r.image.toLowerCase().includes('logo') && 
            !r.image.toLowerCase().includes('icon') &&
            !r.image.endsWith('.svg')
          );
          
          if (validImages.length > 0) {
            const imgUrl = validImages[0].image;
            secondImageCache.set(cacheKey, imgUrl);
            return { url: imgUrl, source: 'Web (EN)' };
          }
        }
      } catch (e) {
        // try next query
      }
    }

    return { url: null, source: 'Web (EN)' };
  }

  // Dual Image Search endpoint
  app.get('/api/wiki-image', async (req, res) => {
    try {
      const q = (req.query.q as string || '').trim();
      const fallback = (req.query.fallback as string || '').trim();
      const category = (req.query.category as string || '').trim();
      const topic = (req.query.topic as string || '').trim();
      if (!q && !fallback) {
        return res.status(400).json({ error: 'Query is required' });
      }
      const [img1, img2Data] = await Promise.all([
        fetchDDGImage(q, fallback, topic, 0),
        fetchSecondImage(q, fallback, category, topic)
      ]);
      return res.json({ 
        imageUrl: img1, 
        secondaryImageUrl: img2Data.url || img1,
        secondaryImageSource: img2Data.source
      });
    } catch (err) {
      console.error('Wiki image search error:', err);
      res.status(500).json({ error: 'Failed to search Wiki image' });
    }
  });

  // YouTube search endpoint for background OST with instant cache
  app.get('/api/search-youtube', async (req, res) => {
    try {
      const query = (req.query.q as string || '').trim().toLowerCase();
      if (!query) {
        return res.status(400).json({ error: 'Query is required' });
      }

      // Check cache first for 0ms response
      if (ytCache.has(query)) {
        return res.json(ytCache.get(query));
      }

      const ytSearch = await import('yt-search');
      const searchFn: any = ytSearch.default || ytSearch;
      
      const r = await searchFn(query);
      const video = r.videos[0];
      
      if (video) {
        const result = { videoId: video.videoId, title: video.title };
        ytCache.set(query, result);
        return res.json(result);
      } else {
        return res.status(404).json({ error: 'No video found' });
      }
    } catch (error) {
      console.error('YouTube Search Error:', error);
      res.status(500).json({ error: 'Failed to search YouTube' });
    }
  });

  // TTS endpoint
  app.get('/api/tts', async (req, res) => {
    try {
      const text = req.query.text as string;
      if (!text) {
        return res.status(400).json({ error: 'Text is required' });
      }
      const googleTTS = await import('google-tts-api');
      const base64Audio = await googleTTS.getAudioBase64(text.slice(0, 200), {
        lang: 'fr',
        slow: false,
        host: 'https://translate.google.com',
      });
      res.json({ url: `data:audio/mp3;base64,${base64Audio}` });
    } catch (error) {
      console.error('TTS Error:', error);
      res.status(500).json({ error: 'Failed to generate TTS' });
    }
  });

  // AI Quiz Generation Endpoint
  app.post('/api/generate-quiz', async (req, res) => {
    const { topic, difficulty = 'medium', language = 'fr', gameMode = 'quiz' } = req.body;

    if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
      return res.status(400).json({ error: 'Le sujet (topic) est requis.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    let modeInstructions = '';
    if (gameMode === 'visual_blind_test') {
      modeInstructions = `MODE : BLIND TEST VISUEL (Reconnaissance d'image)
- L'objectif est STRICTEMENT de reconnaître l'élément visuel affiché (personnage, objet, lieu, ou l'œuvre d'origine).
- "question" : DOIT ÊTRE TRÈS COURTE, SIMPLE ET DIRECTE SANS AUCUN SPOILER. Exemples : "Qui est ce personnage ?", "Quel est cet objet ?", "De quelle série vient cette image ?", "Quel est ce lieu ?".
- "options" : 4 propositions précises (dont 1 bonne réponse).
- "clue" : Laisse ce champ vide "" (l'image est l'unique support de devinette).
- "wikiSearchQuery" : LE NOM COMPLET OFFICIEL de l'entité/objet/série pour obtenir son image (ex: "Dragon Balls", "Épée de légende Zelda", "Batarang", "Central Perk", "Millennium Falcon").`;
    } else if (gameMode === 'music_blind_test') {
      modeInstructions = `MODE : BLIND TEST MUSICAL (Reconnaissance audio & thèmes)
- L'objectif est d'identifier les musiques cultes, génériques, OST ou thèmes sonores.
- "question" : DOIT porter UNIQUEMENT sur l'écoute. Exemples : "De quelle œuvre vient cette musique ?", "De qui cette musique est-elle le thème ?", "Quel est ce morceau ?". NE DONNE AUCUN SPOILER.
- "options" : 4 propositions de morceaux, œuvres ou personnages.
- "youtubeSearchQuery" : LE TITRE EXACT de l'OST, de la musique ou du thème à chercher sur YouTube (ex: "Naruto Sadness and Sorrow", "Interstellar Main Theme", "Zelda Gerudo Valley", "Darth Vader Imperial March").`;
    } else {
      modeInstructions = `MODE : QUIZ CLASSIQUE
- Questions variées de culture générale, énigmes, citations et devinettes sur le thème.
- "youtubeSearchQuery" : Fournis le titre exact d'une musique, OST ou ambiance sonore liée au sujet.`;
    }

    let difficultyInstructions = '';
    if (difficulty === 'expert') {
      difficultyInstructions = `EXPERT : Questions pointues, pièges subtils, 4 choix très proches.`;
    } else if (difficulty === 'hard') {
      difficultyInstructions = `DIFFICILE : Éléments pointus, personnages secondaires ou détails spécifiques.`;
    } else if (difficulty === 'medium') {
      difficultyInstructions = `MOYEN : Équilibre entre éléments cultes et questions de réflexion.`;
    } else {
      difficultyInstructions = `FACILE : Éléments emblématiques et accessibles à tous.`;
    }

    const prompt = `Tu es le créateur expert du jeu "Blind Test Ultimate".
Génère un quiz ultra-dynamique de 15 questions captivantes sur le thème : "${topic}".

${modeInstructions}

RÈGLES IMPORTANTES :
1. Génère EXACTEMENT 15 questions progressives.
2. Pour CHAQUE question :
   - "question" : L'énoncé court adapté au mode.
   - "options" : 4 propositions distinctes avec ordre aléatoire (la bonne réponse NE DOIT PAS être toujours en 1ère position).
   - "correctAnswer" : La réponse exacte (identique à l'une des 4 options).
   - "wikiSearchQuery" : Le nom précis pour trouver l'image de l'élément.
   - "youtubeSearchQuery" : Le titre exact de l'OST ou musique.
   - "clue" : Court indice (vide si blind test visuel).
   - "audioNotes" : [261.63, 329.63, 392.0, 523.25] (4 à 6 fréquences Hertz).
   - "imagePrompt" : Description courte.
   - "trivia" : Anecdote captivante ("Le savais-tu ?").
   - "category" : Sous-catégorie (ex: "Personnage", "Film", "Objet", "Lieu").
3. Thème global :
   - "themeTitle" : Titre percutant.
   - "themeDescription" : Phrase d'accroche courte.
   - "primaryColor" : Couleur hex (ex: "#8b5cf6", "#ec4899", "#3b82f6", "#10b981", "#f59e0b").
   - "accentColor" : Couleur hex contrastée.
   - "ambientSound" : "synthwave", "cinema", "retro80s", "fantasy", "electro", "jazzy", "nature" ou "space".

Langue : Français. Niveau : ${difficultyInstructions}`;

    const config = {
      responseMimeType: 'application/json',
      thinkingConfig: {
        thinkingLevel: ThinkingLevel.MINIMAL,
      },
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          topic: { type: Type.STRING },
          themeTitle: { type: Type.STRING },
          themeDescription: { type: Type.STRING },
          primaryColor: { type: Type.STRING },
          accentColor: { type: Type.STRING },
          themeMusicQuery: { type: Type.STRING },
          ambientSound: { type: Type.STRING },
          themeBgImage: { type: Type.STRING },
          questions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.INTEGER },
                question: { type: Type.STRING },
                options: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                correctAnswer: { type: Type.STRING },
                wikiSearchQuery: { type: Type.STRING },
                youtubeSearchQuery: { type: Type.STRING },
                clue: { type: Type.STRING },
                audioNotes: {
                  type: Type.ARRAY,
                  items: { type: Type.NUMBER }
                },
                imagePrompt: { type: Type.STRING },
                imageUrl: { type: Type.STRING },
                trivia: { type: Type.STRING },
                category: { type: Type.STRING }
              },
              required: ['id', 'question', 'options', 'correctAnswer', 'clue', 'trivia']
            }
          }
        },
        required: ['themeTitle', 'themeDescription', 'primaryColor', 'accentColor', 'ambientSound', 'questions']
      }
    };

    let parsedData: any = null;

    if (apiKey) {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      // Ultra-fast lightweight models first
      const candidateModels = [
        'gemini-3.1-flash-lite',
        'gemini-flash-latest',
        'gemini-3.7-flash',
      ];

      for (const modelName of candidateModels) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: config
          });

          if (response && response.text) {
            let str = response.text.trim();
            str = str.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
            try {
              parsedData = JSON.parse(str);
            } catch {
              const match = str.match(/\{[\s\S]*\}/);
              if (match) {
                parsedData = JSON.parse(match[0]);
              }
            }
            if (parsedData && Array.isArray(parsedData.questions) && parsedData.questions.length > 0) {
              console.log(`Successfully generated quiz with ultra-fast model: ${modelName}`);
              break;
            }
          }
        } catch (err: any) {
          console.warn(`Model ${modelName} encountered an error, trying next fast model:`, err.message || err);
        }
      }
    }

    // Seamless instant fallback if Gemini is not configured, rate-limited, or failed
    if (!parsedData || !Array.isArray(parsedData.questions) || parsedData.questions.length === 0) {
      console.warn('Using instant fallback quiz generator for topic:', topic);
      parsedData = generateFallbackQuiz(topic, gameMode as any, difficulty as any);
    }

    // Helper function to shuffle options randomly
    const shuffle = <T>(arr: T[]): T[] => {
      const result = [...arr];
      for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
      }
      return result;
    };

    // Fast non-blocking media pre-fetching with strict timeouts (1.2s max)
    if (Array.isArray(parsedData.questions)) {
      let ytSearchFn: any = null;
      if (gameMode === 'music_blind_test') {
        try {
          const ytSearch = await import('yt-search');
          ytSearchFn = ytSearch.default || ytSearch;
        } catch {}
      }

      const processedQuestions = await Promise.all(
        parsedData.questions.map(async (q: any, idx: number) => {
          const primaryQuery = q.wikiSearchQuery || `${q.correctAnswer} ${topic}`;
          
          let finalImg1 = q.imageUrl || `https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Wikipedia-logo-v2.svg/1200px-Wikipedia-logo-v2.svg.png`;
          let finalImg2 = q.secondaryImageUrl || finalImg1;
          let secondarySource = 'Web (EN)';

          try {
            const results = await Promise.allSettled([
              fetchDDGImage(primaryQuery, q.correctAnswer, topic, 0),
              fetchSecondImage(primaryQuery, q.correctAnswer, q.category || '', topic)
            ]);

            const wikiImg = results[0].status === 'fulfilled' ? results[0].value : null;
            const secondData = results[1].status === 'fulfilled' ? results[1].value : null;

            if (wikiImg) finalImg1 = wikiImg;
            else if (secondData?.url) finalImg1 = secondData.url;

            if (secondData?.url && secondData.url !== finalImg1) {
              finalImg2 = secondData.url;
              secondarySource = secondData.source || 'Web (EN)';
            } else {
              finalImg2 = finalImg1;
            }
          } catch {}

          let youtubeVideoIds: string[] = [];
          if (gameMode === 'music_blind_test' && q.youtubeSearchQuery && ytSearchFn) {
            try {
              if (ytCache.has(q.youtubeSearchQuery)) {
                const cached = ytCache.get(q.youtubeSearchQuery)!;
                youtubeVideoIds = cached.videoIds || [cached.videoId];
              } else {
                const r = await Promise.race([
                  ytSearchFn(q.youtubeSearchQuery),
                  new Promise<any>((_, reject) => setTimeout(() => reject(new Error('timeout')), 1500))
                ]);
                if (r && r.videos && r.videos.length > 0) {
                  youtubeVideoIds = r.videos.slice(0, 4).map((v: any) => v.videoId);
                  ytCache.set(q.youtubeSearchQuery, { videoIds: youtubeVideoIds, videoId: youtubeVideoIds[0], title: r.videos[0].title });
                }
              }
            } catch {}
          }

          let optionsList: string[] = Array.isArray(q.options) ? [...q.options] : [];
          if (!optionsList.includes(q.correctAnswer)) {
            optionsList[0] = q.correctAnswer;
          }
          optionsList = shuffle(optionsList);

          return {
            ...q,
            id: idx + 1,
            options: optionsList,
            imageUrl: finalImg1,
            secondaryImageUrl: finalImg2,
            secondaryImageSource: secondarySource,
            youtubeVideoId: youtubeVideoIds[0] || q.youtubeVideoId,
            youtubeVideoIds: youtubeVideoIds.length > 0 ? youtubeVideoIds : (q.youtubeVideoIds || []),
            imagePrompt: q.imagePrompt || q.correctAnswer,
            audioNotes: Array.isArray(q.audioNotes) && q.audioNotes.length > 0
              ? q.audioNotes
              : [330, 392, 440, 523.25, 659.25, 587.33]
          };
        })
      );
      parsedData.questions = processedQuestions;
    }

    parsedData.topic = topic;
    return res.json(parsedData);
  });

  // Room API check endpoint
  app.get('/api/room/:code', (req, res) => {
    const code = (req.params.code || '').toUpperCase().trim();
    const room = activeRooms.get(code);
    if (!room) {
      return res.status(404).json({ exists: false, error: 'Salon introuvable' });
    }
    return res.json({
      exists: true,
      room: {
        code: room.code,
        topic: room.topic,
        themeTitle: room.themeTitle,
        status: room.status,
        difficulty: room.difficulty,
        gameMode: room.gameMode,
        playerCount: room.players.size,
        hostId: room.hostId,
      }
    });
  });

  // WebSocket Multiplayer Server Logic
  wss.on('connection', (ws) => {
    let clientRoomCode: string | null = null;
    let clientPlayerId: string | null = null;

    function advanceToNextQuestion(room: ServerRoom) {
      if (room.autoNextTimer) {
        clearTimeout(room.autoNextTimer);
        room.autoNextTimer = null;
      }

      const totalQuestions = room.quizData?.questions?.length || 15;
      if (room.currentQuestionIndex + 1 < totalQuestions) {
        room.currentQuestionIndex += 1;
        room.status = 'playing';
        room.questionStartTime = Date.now();

        room.players.forEach((p) => {
          p.answeredCurrent = false;
          p.isCorrect = undefined;
          p.selectedOption = undefined;
          p.lastScoreEarned = 0;
        });

        const serialized = serializeRoom(room);
        broadcastToRoom(room, {
          type: 'next_question_started',
          room: serialized,
        });
        broadcastToRoom(room, {
          type: 'room_state',
          room: serialized,
        });
        broadcastToRoom(room, {
          type: 'room_updated',
          room: serialized,
        });
      } else {
        room.status = 'game_over';
        const serialized = serializeRoom(room);
        broadcastToRoom(room, {
          type: 'game_over',
          room: serialized,
        });
        broadcastToRoom(room, {
          type: 'room_state',
          room: serialized,
        });
        broadcastToRoom(room, {
          type: 'room_updated',
          room: serialized,
        });
      }
    }

    function triggerRevealQuestion(room: ServerRoom) {
      if (room.status === 'question_result' || room.status === 'game_over') return;
      room.status = 'question_result';

      if (room.autoNextTimer) {
        clearTimeout(room.autoNextTimer);
        room.autoNextTimer = null;
      }

      const serialized = serializeRoom(room);
      broadcastToRoom(room, {
        type: 'question_revealed',
        room: serialized,
      });
      broadcastToRoom(room, {
        type: 'room_state',
        room: serialized,
      });
      broadcastToRoom(room, {
        type: 'room_updated',
        room: serialized,
      });

      // Synchronized auto-advance to next question after 5 seconds for all room members
      room.autoNextTimer = setTimeout(() => {
        advanceToNextQuestion(room);
      }, 5000);
    }

    ws.on('message', (raw) => {
      try {
        const data = JSON.parse(raw.toString());
        const { type } = data;

        // CREATE ROOM
        if (type === 'create_room') {
          const { hostName = 'Hôte', avatar = '👑', quizData, difficulty = 'medium', gameMode = 'quiz', gameStyle = 'competitive_room', durationPerQuestion = 20 } = data;
          let code = generateRoomCode();
          while (activeRooms.has(code)) {
            code = generateRoomCode();
          }

          const hostId = `player_${Math.random().toString(36).substring(2, 9)}`;
          const hostPlayer: ServerPlayer = {
            id: hostId,
            name: hostName.trim() || 'Hôte',
            avatar: avatar || '👑',
            score: 0,
            streak: 0,
            maxStreak: 0,
            answeredCurrent: false,
            isHost: true,
            lastScoreEarned: 0,
            ws,
          };

          const newRoom: ServerRoom = {
            code,
            hostId,
            status: 'lobby',
            topic: quizData?.topic || 'Blind Test',
            themeTitle: quizData?.themeTitle || 'Blind Test Ultimate',
            themeBgImage: quizData?.themeBgImage,
            primaryColor: quizData?.primaryColor || '#9333ea',
            accentColor: quizData?.accentColor || '#f43f5e',
            difficulty,
            gameMode,
            gameStyle,
            durationPerQuestion: durationPerQuestion || 20,
            currentQuestionIndex: 0,
            questionStartTime: 0,
            quizData,
            players: new Map([[hostId, hostPlayer]]),
            createdAt: Date.now(),
          };

          activeRooms.set(code, newRoom);
          clientRoomCode = code;
          clientPlayerId = hostId;

          ws.send(JSON.stringify({
            type: 'room_created',
            code,
            playerId: hostId,
            room: serializeRoom(newRoom),
          }));
        }

        // JOIN ROOM
        else if (type === 'join_room') {
          const { code: rawCode, playerName = 'Joueur', avatar = '🦊', playerId: existingId } = data;
          const code = (rawCode || '').toUpperCase().trim();
          const room = activeRooms.get(code);

          if (!room) {
            return ws.send(JSON.stringify({ type: 'error', message: 'Salon introuvable ou expiré.' }));
          }

          let playerId = existingId;
          if (playerId && room.players.has(playerId)) {
            // Reconnecting existing player
            const player = room.players.get(playerId)!;
            player.ws = ws;
            player.name = playerName || player.name;
            player.avatar = avatar || player.avatar;
          } else {
            // New player joining
            playerId = `player_${Math.random().toString(36).substring(2, 9)}`;
            const newPlayer: ServerPlayer = {
              id: playerId,
              name: playerName.trim() || `Joueur ${room.players.size + 1}`,
              avatar: avatar || '🦊',
              score: 0,
              streak: 0,
              maxStreak: 0,
              answeredCurrent: false,
              isHost: false,
              lastScoreEarned: 0,
              ws,
            };
            room.players.set(playerId, newPlayer);
          }

          clientRoomCode = code;
          clientPlayerId = playerId;

          const joinPayload = {
            type: 'room_joined',
            code,
            playerId,
            room: serializeRoom(room),
          };
          ws.send(JSON.stringify(joinPayload));
          // Also send joined_room alias
          ws.send(JSON.stringify({ ...joinPayload, type: 'joined_room' }));

          broadcastToRoom(room, {
            type: 'room_state',
            room: serializeRoom(room),
          });
        }

        // UPDATE QUIZ DATA (background generation finished)
        else if (type === 'update_quiz_data') {
          const { code: rawCode, quizData } = data;
          const code = (rawCode || clientRoomCode || '').toUpperCase().trim();
          const room = activeRooms.get(code);
          if (!room || !quizData) return;

          room.quizData = quizData;
          if (quizData.topic) room.topic = quizData.topic;
          if (quizData.themeTitle) room.themeTitle = quizData.themeTitle;
          if (quizData.themeBgImage) room.themeBgImage = quizData.themeBgImage;
          if (quizData.primaryColor) room.primaryColor = quizData.primaryColor;
          if (quizData.accentColor) room.accentColor = quizData.accentColor;

          broadcastToRoom(room, {
            type: 'room_state',
            room: serializeRoom(room),
          });
          broadcastToRoom(room, {
            type: 'room_updated',
            room: serializeRoom(room),
          });
        }

        // START GAME
        else if (type === 'start_game') {
          const { code: rawCode } = data;
          const code = (rawCode || clientRoomCode || '').toUpperCase().trim();
          const room = activeRooms.get(code);
          if (!room) return;

          if (clientPlayerId !== room.hostId) {
            return ws.send(JSON.stringify({ type: 'error', message: 'Seul l’hôte peut lancer la partie.' }));
          }

          if (room.autoNextTimer) {
            clearTimeout(room.autoNextTimer);
            room.autoNextTimer = null;
          }

          room.status = 'playing';
          room.newQuizReady = false;
          room.currentQuestionIndex = 0;
          room.questionStartTime = Date.now();

          // Reset all players stats
          room.players.forEach((p) => {
            p.score = 0;
            p.streak = 0;
            p.maxStreak = 0;
            p.answeredCurrent = false;
            p.isCorrect = undefined;
            p.selectedOption = undefined;
            p.lastScoreEarned = 0;
            p.answersHistory = {};
          });

          const serialized = serializeRoom(room);
          broadcastToRoom(room, {
            type: 'game_started',
            room: serialized,
          });
          broadcastToRoom(room, {
            type: 'room_state',
            room: serialized,
          });
          broadcastToRoom(room, {
            type: 'room_updated',
            room: serialized,
          });
        }

        // SUBMIT ANSWER
        else if (type === 'submit_answer') {
          const { code: rawCode, questionIndex, selectedOption, timeSpent = 0 } = data;
          const code = (rawCode || clientRoomCode || '').toUpperCase().trim();
          const room = activeRooms.get(code);
          if (!room || !clientPlayerId) return;

          const player = room.players.get(clientPlayerId);
          if (!player || player.answeredCurrent) return;

          const currentQ = room.quizData?.questions?.[questionIndex];
          if (!currentQ) return;

          const isCorrect = selectedOption === currentQ.correctAnswer;
          let earned = 0;

          if (isCorrect) {
            player.streak += 1;
            if (player.streak > player.maxStreak) {
              player.maxStreak = player.streak;
            }

            let multiplier = 1.0;
            if (player.streak >= 5) multiplier = 3.0;
            else if (player.streak >= 3) multiplier = 2.0;
            else if (player.streak >= 2) multiplier = 1.5;

            // Speed bonus: from 500 to 1000 base
            const speedRatio = Math.max(0, 1 - (timeSpent / (room.durationPerQuestion || 20)));
            const basePoints = 500 + Math.round(500 * speedRatio);
            earned = Math.round(basePoints * multiplier);
            player.score += earned;
          } else {
            player.streak = 0;
          }

          player.answeredCurrent = true;
          player.isCorrect = isCorrect;
          player.selectedOption = selectedOption;
          player.timeSpent = timeSpent;
          player.lastScoreEarned = earned;

          if (!player.answersHistory) player.answersHistory = {};
          player.answersHistory[questionIndex] = {
            selectedOption: selectedOption || '',
            isCorrect,
            timeSpent,
            scoreEarned: earned,
          };

          // Check if all connected players in room have submitted an answer
          let allAnswered = true;
          room.players.forEach((p) => {
            if (p.ws && p.ws.readyState === WebSocket.OPEN && !p.answeredCurrent) {
              allAnswered = false;
            }
          });

          if (allAnswered) {
            triggerRevealQuestion(room);
          } else {
            broadcastToRoom(room, {
              type: 'room_state',
              room: serializeRoom(room),
            });
            broadcastToRoom(room, {
              type: 'room_updated',
              room: serializeRoom(room),
            });
          }
        }

        // REVEAL QUESTION (Timer expired on host or manual trigger)
        else if (type === 'reveal_question') {
          const { code: rawCode } = data;
          const code = (rawCode || clientRoomCode || '').toUpperCase().trim();
          const room = activeRooms.get(code);
          if (!room) return;

          triggerRevealQuestion(room);
        }

        // REFRESH / RESYNC ROOM
        else if (type === 'refresh_room') {
          const { code: rawCode, playerId } = data;
          const code = (rawCode || clientRoomCode || '').toUpperCase().trim();
          const room = activeRooms.get(code);
          if (!room) {
            return ws.send(JSON.stringify({ type: 'error', message: 'Salon introuvable.' }));
          }
          const targetPlayerId = playerId || clientPlayerId;
          if (targetPlayerId && room.players.has(targetPlayerId)) {
            const player = room.players.get(targetPlayerId)!;
            player.ws = ws;
            clientRoomCode = code;
            clientPlayerId = targetPlayerId;
          }
          ws.send(JSON.stringify({
            type: 'room_state',
            room: serializeRoom(room),
            playerId: targetPlayerId,
          }));
        }

        // UPDATE PLAYER PROFILE (Host or Guest)
        else if (type === 'update_player') {
          const { code: rawCode, name, avatar, playerId } = data;
          const code = (rawCode || clientRoomCode || '').toUpperCase().trim();
          const room = activeRooms.get(code);
          if (!room) return;

          const targetPlayerId = playerId || clientPlayerId;
          if (!targetPlayerId) return;

          const player = room.players.get(targetPlayerId);
          if (player) {
            if (name && typeof name === 'string' && name.trim()) {
              player.name = name.trim();
            }
            if (avatar && typeof avatar === 'string') {
              player.avatar = avatar;
            }

            broadcastToRoom(room, {
              type: 'room_state',
              room: serializeRoom(room),
            });
            broadcastToRoom(room, {
              type: 'room_updated',
              room: serializeRoom(room),
            });
          }
        }

        // NEXT QUESTION
        else if (type === 'next_question') {
          const { code: rawCode, playerId } = data;
          const code = (rawCode || clientRoomCode || '').toUpperCase().trim();
          const room = activeRooms.get(code);
          if (!room) return;

          const senderId = clientPlayerId || playerId;
          if (senderId && senderId !== room.hostId) {
            return ws.send(JSON.stringify({ type: 'error', message: 'Seul l’hôte peut passer à la question suivante.' }));
          }

          advanceToNextQuestion(room);
        }

        // REACTION
        else if (type === 'send_reaction') {
          const { code: rawCode, emoji = '🔥' } = data;
          const code = (rawCode || clientRoomCode || '').toUpperCase().trim();
          const room = activeRooms.get(code);
          if (!room || !clientPlayerId) return;

          const player = room.players.get(clientPlayerId);
          if (!player) return;

          broadcastToRoom(room, {
            type: 'reaction',
            playerId: player.id,
            playerName: player.name,
            avatar: player.avatar,
            emoji,
          });
        }

        // RESTART GAME (Return to lobby)
        else if (type === 'restart_room') {
          const { code: rawCode } = data;
          const code = (rawCode || clientRoomCode || '').toUpperCase().trim();
          const room = activeRooms.get(code);
          if (!room || clientPlayerId !== room.hostId) return;

          room.status = 'lobby';
          room.currentQuestionIndex = 0;
          room.players.forEach((p) => {
            p.score = 0;
            p.streak = 0;
            p.maxStreak = 0;
            p.answeredCurrent = false;
            p.isCorrect = undefined;
            p.selectedOption = undefined;
            p.lastScoreEarned = 0;
            p.answersHistory = {};
          });

          broadcastToRoom(room, {
            type: 'room_state',
            room: serializeRoom(room),
          });
        }

        // RESTART WITH NEW QUIZ TOPIC
        else if (type === 'restart_with_quiz') {
          const { code: rawCode, quizData } = data;
          const code = (rawCode || clientRoomCode || '').toUpperCase().trim();
          const room = activeRooms.get(code);
          if (!room || clientPlayerId !== room.hostId) return;

          if (quizData) {
            room.quizData = quizData;
            room.topic = quizData.topic || room.topic;
            room.themeTitle = quizData.themeTitle || room.themeTitle;
            room.themeBgImage = quizData.themeBgImage || room.themeBgImage;
            room.primaryColor = quizData.primaryColor || room.primaryColor;
            room.accentColor = quizData.accentColor || room.accentColor;
          }

          room.status = 'game_over';
          room.newQuizReady = true;
          room.currentQuestionIndex = 0;
          room.players.forEach((p) => {
            p.score = 0;
            p.streak = 0;
            p.maxStreak = 0;
            p.answeredCurrent = false;
            p.isCorrect = undefined;
            p.selectedOption = undefined;
            p.lastScoreEarned = 0;
            p.answersHistory = {};
          });

          broadcastToRoom(room, {
            type: 'room_state',
            room: serializeRoom(room),
          });
        }

        // LEAVE ROOM
        else if (type === 'leave_room') {
          const { code: rawCode } = data;
          const code = (rawCode || clientRoomCode || '').toUpperCase().trim();
          const room = activeRooms.get(code);
          if (!room || !clientPlayerId) return;

          room.players.delete(clientPlayerId);
          if (room.players.size === 0) {
            activeRooms.delete(code);
          } else {
            if (room.hostId === clientPlayerId) {
              // Assign new host
              const nextHostId = room.players.keys().next().value;
              if (nextHostId) {
                room.hostId = nextHostId;
                const nextHost = room.players.get(nextHostId);
                if (nextHost) nextHost.isHost = true;
              }
            }
            broadcastToRoom(room, {
              type: 'room_state',
              room: serializeRoom(room),
            });
          }
          clientRoomCode = null;
          clientPlayerId = null;
        }
      } catch (err) {
        console.error('WebSocket message parsing error:', err);
      }
    });

    ws.on('close', () => {
      if (clientRoomCode && clientPlayerId) {
        const room = activeRooms.get(clientRoomCode);
        if (room) {
          const player = room.players.get(clientPlayerId);
          if (player) {
            player.ws = undefined;
          }
          broadcastToRoom(room, {
            type: 'room_state',
            room: serializeRoom(room),
          });
        }
      }
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Blind Test Server with WebSockets running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
