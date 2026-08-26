import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { WebSocketServer, WebSocket } from 'ws';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

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
  const PORT = 3000;
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
    try {
      const { topic, difficulty = 'medium', language = 'fr', gameMode = 'quiz' } = req.body;

      if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
        return res.status(400).json({ error: 'Le sujet (topic) est requis.' });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.warn('GEMINI_API_KEY not configured in environment. Using fallback generator.');
        return res.status(503).json({
          error: 'GEMINI_API_KEY manquante. Veuillez configurer la clé API dans les Paramètres.',
          useFallback: true
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      let modeInstructions = '';
      if (gameMode === 'visual_blind_test') {
        modeInstructions = `MODE : BLIND TEST VISUEL (Reconnaissance d'image)
- L'objectif est STRICTEMENT de reconnaître l'élément visuel affiché (personnage, objet, lieu, ou l'œuvre d'origine).
- "question" : DOIT ÊTRE TRÈS COURTE, SIMPLE ET DIRECTE SANS AUCUN SPOILER. Varie les formulations selon le contexte de l'image. Exemples : "Qui est ce personnage ?", "Quel est cet objet ?", "À qui appartient cet objet ?", "De quelle série vient cette image ?", "Quel est ce lieu ?". Ne te limite pas à "Qui est ce personnage ?".
- "options" : 4 propositions précises (dont 1 bonne réponse).
- "clue" : Laisse ce champ vide "" (l'image est l'unique support de devinette).
- "wikiSearchQuery" : LE NOM COMPLET OFFICIEL de l'entité/objet/série pour obtenir son image via moteur de recherche (ex: "Dragon Balls", "Épée de légende Zelda", "Batarang", "Central Perk", "Millennium Falcon"). Sois très précis pour garantir une bonne image.`;
      } else if (gameMode === 'music_blind_test') {
        modeInstructions = `MODE : BLIND TEST MUSICAL (Reconnaissance audio & thèmes)
- L'objectif est d'identifier les musiques cultes, génériques, OST ou thèmes sonores.
- "question" : DOIT porter UNIQUEMENT sur l'écoute. Pose SIMPLEMENT l'une de ces questions : "À quelle série/film vient cette musique ?", "De quel personnage cette musique est-elle le thème ?" ou "C'est le son de quoi ?". NE DONNE AUCUN SPOILER DANS LA QUESTION.
- "options" : 4 propositions de morceaux, œuvres ou personnages.
- "youtubeSearchQuery" : LE TITRE EXACT de l'OST, de la musique ou du thème à chercher sur YouTube (ex: "Naruto Sadness and Sorrow", "Interstellar Main Theme", "Zelda Gerudo Valley", "Darth Vader Imperial March"). Il servira à jouer la vraie musique.`;
      } else {
        modeInstructions = `MODE : QUIZ CLASSIQUE
- Questions variées de culture générale, énigmes, citations et devinettes sur le thème.
- "youtubeSearchQuery" : POUR CHAQUE QUESTION, fournis LE TITRE EXACT d'une musique, OST, ou ambiance sonore liée spécifiquement à la réponse ou au sujet de cette question (ex: "Musique Tristesse et Douleur Naruto", "Star Wars Imperial March", "Ambiance sonore forêt magique"). Cette musique sera jouée en fond sonore pendant la question.`;
      }

      let difficultyInstructions = '';
      if (difficulty === 'expert') {
        difficultyInstructions = `EXPERT : Niveau d'érudit absolu. Sélectionne les éléments les plus pointus, obscurs ou spécifiques possibles. Les questions doivent être ultra-précises. Les 4 propositions de réponses doivent être extrêmement similaires, vicieuses et conçues pour induire en erreur le joueur. Laisse aucune place au hasard.`;
      } else if (difficulty === 'hard') {
        difficultyInstructions = `TRÈS DIFFICILE : Choisis les éléments les plus obscurs, des personnages très secondaires, des objets rares, des lieux très spécifiques ou des thèmes musicaux oubliés. Aucune question facile ou moyenne.`;
      } else if (difficulty === 'medium') {
        difficultyInstructions = `MOYEN : Équilibre entre des éléments connus et quelques pièges.`;
      } else {
        difficultyInstructions = `FACILE : Pour les débutants, les éléments les plus emblématiques et connus.`;
      }

      const prompt = `Tu es le créateur expert du jeu "Blind Test Ultimate".
Génère un quiz de 15 énigmes captivantes et stimulantes sur le thème suivant : "${topic}".

${modeInstructions}

RÈGLES IMPORTANTES :
1. Génère EXACTEMENT 15 questions progressives (de la plus accessible à la plus pointue pour ce niveau).
2. Pour CHAQUE question :
   - "question" : L'énoncé précis (très court et adapté au mode).
   - "options" : 4 propositions crédibles et distinctes. ATTENTION : Mélange impérativement l'ordre des options de façon aléatoire (la bonne réponse NE DOIT PAS être systématiquement en première position !).
   - "correctAnswer" : La réponse exacte (doit correspondre mot pour mot à l'une des 4 options).
   - "wikiSearchQuery" : Le terme précis pour trouver l'IMAGE (ex: "Monkey D. Luffy", "Sabre laser Star Wars", "Pikachu"). ATTENTION : Cherche l'objet ou le personnage spécifique dont on parle, évite le logo de la série !
   - "youtubeSearchQuery" : (Seulement pour Blind Test Musical) Le terme exact pour trouver la musique sur YouTube.
   - "clue" : Un court indice (ou vide si blind test visuel).
   - "audioNotes" : Un tableau de 4 à 7 fréquences sonores en Hertz (ex: [261.63, 329.63, 392.0, 523.25]) représentant un motif mélodique (optionnel si musical avec youtube).
   - "imagePrompt" : Une courte description textuelle de l'élément visuel à identifier.
   - "trivia" : Une anecdote captivante, insolite ou croustillante ("Le savais-tu ?").
   - "category" : La sous-catégorie précise de l'élément (ex: "Personnage", "Film", "Monument", "Acteur", "Jeu vidéo", "Groupe de musique", "Espèce animale"). Utilisée pour cibler la recherche d'images complémentaires en anglais.
3. Pour le thème global :
   - "themeTitle" : Un titre percutant pour le blind test.
   - "themeDescription" : Une courte phrase d'accroche pour ce thème.
   - "primaryColor" : Une couleur hex dominante adaptée (ex: "#ec4899", "#8b5cf6", "#f59e0b", "#10b981", "#3b82f6", "#ef4444").
   - "accentColor" : Une couleur hex secondaire contrastée.
   - "ambientSound" : L'un de ces choix sonores obligatoirement : "synthwave", "cinema", "retro80s", "fantasy", "electro", "jazzy", "nature", "space".

Langue du contenu : ${language === 'fr' ? 'Français' : 'English'}.
Niveau de difficulté : ${difficultyInstructions}`;

      const config = {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            topic: { type: Type.STRING },
            themeTitle: { type: Type.STRING },
            themeDescription: { type: Type.STRING },
            primaryColor: { type: Type.STRING },
            accentColor: { type: Type.STRING },
            themeMusicQuery: {
              type: Type.STRING,
              description: 'Exact YouTube search query for the overall theme background soundtrack (e.g. "Harry Potter Hedwig Theme OST", "Star Wars Main Theme", "80s retro quiz game show music")'
            },
            ambientSound: {
              type: Type.STRING,
              description: 'One of: synthwave, cinema, retro80s, fantasy, electro, jazzy, nature, space'
            },
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

      const candidateModels = [
        'gemini-3.7-flash',
        'gemini-flash-latest',
        'gemini-3.1-flash-lite',
        'gemini-2.5-flash',
      ];
      let response: any = null;
      let lastError: any = null;

      for (const modelName of candidateModels) {
        try {
          response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: config
          });
          if (response && response.text) {
            console.log(`Successfully generated quiz with model: ${modelName}`);
            break;
          }
        } catch (err: any) {
          lastError = err;
          console.warn(`Model ${modelName} failed, falling back to next available fast model...`, err.message || err);
        }
      }

      if (!response || !response.text) {
        throw new Error(lastError?.message || 'Aucune réponse générée par les modèles IA.');
      }

      const responseText = response.text;
      
      // Robust JSON extraction and cleaning
      const cleanAndParseJSON = (raw: string) => {
        let str = raw.trim();
        // Remove markdown backtick blocks if present
        str = str.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
        try {
          return JSON.parse(str);
        } catch {
          const match = str.match(/\{[\s\S]*\}/);
          if (match) {
            return JSON.parse(match[0]);
          }
          throw new Error('Format JSON invalide reçu du modèle IA.');
        }
      };

      const parsedData = cleanAndParseJSON(responseText);

      // Helper function to shuffle options randomly
      const shuffle = <T>(arr: T[]): T[] => {
        const result = [...arr];
        for (let i = result.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [result[i], result[j]] = [result[j], result[i]];
        }
        return result;
      };

      // Fetch authentic images for all 15 questions in parallel
      if (Array.isArray(parsedData.questions)) {
        // Preload ytSearch if needed
        let ytSearchFn: any = null;
        if (gameMode === 'music_blind_test') {
          const ytSearch = await import('yt-search');
          ytSearchFn = ytSearch.default || ytSearch;
        }

        const processedQuestions = await Promise.all(
          parsedData.questions.map(async (q: any, idx: number) => {
            const primaryQuery = q.wikiSearchQuery || `${q.correctAnswer} ${topic}`;
            
            // Parallel fetch: Image 1 (Web engine) and Image 2 (Wikipedia / Wikimedia / Alternative search with category+answer)
            const [wikiImg, secondImgData] = await Promise.all([
              fetchDDGImage(primaryQuery, q.correctAnswer, topic, 0),
              fetchSecondImage(primaryQuery, q.correctAnswer, q.category || '', topic)
            ]);

            // Primary Image fallback
            const finalImg1 = wikiImg || secondImgData.url || `https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Wikipedia-logo-v2.svg/1200px-Wikipedia-logo-v2.svg.png`;
            // Secondary Image (guaranteed different angle/source or alternate query)
            const finalImg2 = (secondImgData.url && secondImgData.url !== finalImg1) 
              ? secondImgData.url 
              : (await fetchDDGImage(primaryQuery, q.correctAnswer, topic, 1)) || finalImg1;

            // If music blind test and youtube query provided, search youtube
            let youtubeVideoIds = [];
            if (gameMode === 'music_blind_test' && q.youtubeSearchQuery && ytSearchFn) {
              try {
                if (ytCache.has(q.youtubeSearchQuery)) {
                  youtubeVideoIds = ytCache.get(q.youtubeSearchQuery).videoIds || [ytCache.get(q.youtubeSearchQuery).videoId];
                } else {
                  const r = await ytSearchFn(q.youtubeSearchQuery);
                  if (r.videos && r.videos.length > 0) {
                    youtubeVideoIds = r.videos.slice(0, 5).map(v => v.videoId);
                    ytCache.set(q.youtubeSearchQuery, { videoIds: youtubeVideoIds, videoId: youtubeVideoIds[0], title: r.videos[0].title });
                  }
                }
              } catch (e) {
                console.error('Failed to fetch youtube video for', q.youtubeSearchQuery, e);
              }
            }

            // Guarantee options contain the correct answer and are shuffled
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
              secondaryImageSource: secondImgData.source || 'Alternative',
              youtubeVideoId: youtubeVideoIds[0],
              youtubeVideoIds: youtubeVideoIds,
              imagePrompt: q.imagePrompt || q.correctAnswer,
              audioNotes: Array.isArray(q.audioNotes) && q.audioNotes.length > 0
                ? q.audioNotes
                : [330, 392, 440, 523.25, 659.25, 587.33]
            };
          })
        );
        parsedData.questions = processedQuestions;
      }

      // Fetch authentic image for theme background
      const themeWikiImg = await fetchDDGImage(parsedData.themeTitle || topic, topic);
      if (themeWikiImg) {
        parsedData.themeBgImage = themeWikiImg;
      } else if (!parsedData.themeBgImage || !parsedData.themeBgImage.startsWith('http')) {
        parsedData.themeBgImage = 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Wikipedia-logo-v2.svg/1200px-Wikipedia-logo-v2.svg.png';
      }

      // Fetch theme YouTube soundtrack for quiz background music
      try {
        const themeMusicTerm = parsedData.themeMusicQuery || `${parsedData.themeTitle || topic} soundtrack ost theme`;
        if (themeMusicTerm) {
          if (ytCache.has(themeMusicTerm.toLowerCase())) {
            parsedData.themeYoutubeVideoId = ytCache.get(themeMusicTerm.toLowerCase()).videoId;
          } else {
            const ytSearch = await import('yt-search');
            const searchFn: any = ytSearch.default || ytSearch;
            const r = await searchFn(themeMusicTerm);
            const video = r.videos[0];
            if (video) {
              parsedData.themeYoutubeVideoId = video.videoId;
              ytCache.set(themeMusicTerm.toLowerCase(), { videoId: video.videoId, title: video.title });
            }
          }
        }
      } catch (e) {
        console.warn('Failed to pre-fetch theme YouTube soundtrack', e);
      }

      parsedData.topic = topic;

      return res.json(parsedData);
    } catch (err: any) {
      console.error('Error generating quiz:', err);
      const isQuota = err.message?.includes('resource_exhausted') || err.message?.includes('Quota exceeded') || err.message?.includes('429');
      const errorMsg = isQuota
        ? 'Quota Gemini dépassé (limite de requêtes/tokens atteinte). Veuillez patienter quelques instants avant de réessayer.'
        : ('Erreur lors de la génération du quiz: ' + (err.message || 'Erreur interne'));
      return res.status(500).json({ error: errorMsg });
    }
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
          });

          broadcastToRoom(room, {
            type: 'game_started',
            room: serializeRoom(room),
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
            room.status = 'question_result';
            broadcastToRoom(room, {
              type: 'question_revealed',
              room: serializeRoom(room),
            });
          }

          broadcastToRoom(room, {
            type: 'room_state',
            room: serializeRoom(room),
          });
        }

        // REVEAL QUESTION (Timer expired on host or manual trigger)
        else if (type === 'reveal_question') {
          const { code: rawCode } = data;
          const code = (rawCode || clientRoomCode || '').toUpperCase().trim();
          const room = activeRooms.get(code);
          if (!room) return;

          room.status = 'question_result';
          broadcastToRoom(room, {
            type: 'question_revealed',
            room: serializeRoom(room),
          });
          broadcastToRoom(room, {
            type: 'room_state',
            room: serializeRoom(room),
          });
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

            broadcastToRoom(room, {
              type: 'next_question_started',
              room: serializeRoom(room),
            });
            broadcastToRoom(room, {
              type: 'room_state',
              room: serializeRoom(room),
            });
          } else {
            room.status = 'game_over';
            broadcastToRoom(room, {
              type: 'game_over',
              room: serializeRoom(room),
            });
          }
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
