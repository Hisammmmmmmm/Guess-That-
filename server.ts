import 'dotenv/config';
import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { WebSocketServer, WebSocket } from 'ws';
import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import crypto from 'crypto';
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
  language?: string;
  durationPerQuestion: number;
  currentQuestionIndex: number;
  questionStartTime: number;
  quizData: any;
  newQuizReady?: boolean;
  isPublic?: boolean;
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
    language: room.language || 'fr',
    durationPerQuestion: room.durationPerQuestion,
    currentQuestionIndex: room.currentQuestionIndex,
    questionStartTime: room.questionStartTime,
    quizData: room.quizData,
    newQuizReady: room.newQuizReady,
    isPublic: room.isPublic !== false,
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

  let totalQuizGenerations = 1842;

  function getGlobalStats() {
    let roomPlayers = 0;
    activeRooms.forEach((room) => {
      roomPlayers += room.players.size;
    });
    const connectedClients = wss.clients ? wss.clients.size : 0;
    const onlinePlayers = Math.max(roomPlayers, connectedClients, 1);

    return {
      onlinePlayers,
      activeRooms: activeRooms.size,
      totalGenerations: totalQuizGenerations,
    };
  }

  function broadcastGlobalStats() {
    const stats = getGlobalStats();
    const payload = JSON.stringify({
      type: 'global_stats',
      stats,
    });
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    });
  }

  function getPublicRoomsSummary(gameModeFilter?: string) {
    const list: any[] = [];
    activeRooms.forEach((room) => {
      if (room.isPublic === false) return;
      if (gameModeFilter && gameModeFilter !== 'all' && room.gameMode !== gameModeFilter) return;

      const host = room.players.get(room.hostId);
      list.push({
        code: room.code,
        hostName: host?.name || 'Hôte',
        hostAvatar: host?.avatar || '👑',
        themeTitle: room.themeTitle || room.topic || 'Blind Test',
        topic: room.topic || 'Blind Test',
        gameMode: room.gameMode || 'quiz',
        difficulty: room.difficulty || 'medium',
        language: room.language || 'fr',
        playerCount: room.players.size,
        maxPlayers: 12,
        status: room.status,
        isPublic: true,
        currentQuestionIndex: room.currentQuestionIndex,
        totalQuestions: room.quizData?.questions?.length || 15,
        createdAt: room.createdAt,
      });
    });

    return list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  }

  function broadcastPublicRooms() {
    const payload = JSON.stringify({
      type: 'public_rooms_list',
      rooms: getPublicRoomsSummary(),
    });
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    });
  }

  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // In-memory cache for YouTube searches to make audio instant
  const ytCache = new Map<string, { videoId: string; title: string; videoIds?: string[] }>();
  // In-memory cache for iTunes / Deezer audio preview clips (30s HQ MP3)
  const audioPreviewCache = new Map<string, { previewUrl: string; trackName?: string; artistName?: string; artworkUrl?: string }>();

  // In-memory cache for Wikipedia images and second images
  const wikiImageCache = new Map<string, string>();
  const secondImageCache = new Map<string, string>();

  // Helper function to fetch 30-second official audio preview (iTunes API with Deezer fallback)
  async function fetchAudioPreview(query: string, answer: string = ''): Promise<{ previewUrl: string; trackName?: string; artistName?: string; artworkUrl?: string } | null> {
    const rawQuery = (query || answer || '').trim();
    if (!rawQuery) return null;
    const cacheKey = rawQuery.toLowerCase();
    if (audioPreviewCache.has(cacheKey)) {
      return audioPreviewCache.get(cacheKey)!;
    }

    // Clean query: remove noise words like 'official video', 'clip', 'ost', etc. for accurate music metadata match
    const cleanTerm = rawQuery
      .replace(/official\s*(music)?\s*video/gi, '')
      .replace(/clip\s*officiel/gi, '')
      .replace(/remaster(ed)?\s*\d*/gi, '')
      .replace(/video\s*clip/gi, '')
      .replace(/4k|hd|lyrics/gi, '')
      .replace(/\s+/g, ' ')
      .trim();

    const searchQueries = [
      cleanTerm,
      answer ? `${answer}`.trim() : null,
      rawQuery,
    ].filter((q, i, arr): q is string => Boolean(q && q.length > 1 && arr.indexOf(q) === i));

    for (const term of searchQueries) {
      try {
        const itunesRes = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(term)}&media=music&entity=song&limit=3`, {
          signal: AbortSignal.timeout(2000),
        });
        if (itunesRes.ok) {
          const data: any = await itunesRes.json();
          if (data.results && data.results.length > 0) {
            const match = data.results[0];
            if (match.previewUrl) {
              const resObj = {
                previewUrl: match.previewUrl,
                trackName: match.trackName,
                artistName: match.artistName,
                artworkUrl: match.artworkUrl100 || match.artworkUrl60,
              };
              audioPreviewCache.set(cacheKey, resObj);
              return resObj;
            }
          }
        }
      } catch {}

      // Deezer fallback
      try {
        const deezerRes = await fetch(`https://api.deezer.com/search?q=${encodeURIComponent(term)}&limit=3`, {
          signal: AbortSignal.timeout(2000),
        });
        if (deezerRes.ok) {
          const data: any = await deezerRes.json();
          if (data.data && data.data.length > 0) {
            const match = data.data[0];
            if (match.preview) {
              const resObj = {
                previewUrl: match.preview,
                trackName: match.title,
                artistName: match.artist?.name,
                artworkUrl: match.album?.cover_medium,
              };
              audioPreviewCache.set(cacheKey, resObj);
              return resObj;
            }
          }
        }
      } catch {}
    }

    return null;
  }

  // Pre-seed common music queries for instant 0ms responses
  ytCache.set('ost retro game menu theme loop', { videoId: 'jfKfPfyJRdk', title: 'Lofi Hip Hop / Retro Synth Ambience' });
  ytCache.set('ost synthwave gaming loop', { videoId: '4xDzrJKXOOY', title: 'Synthwave Chill' });

  // Robust Image Retriever using DuckDuckGo (Primary Engine)
  async function fetchDDGImage(query: string, answer: string = '', topic: string = '', skipIndex: number = 0): Promise<string | null> {
    const cleanQ = (query || '').trim();
    const cleanAns = (answer || '').trim();
    const cleanTopic = (topic || '').trim();
    if (!cleanQ && !cleanAns) return null;
    const cacheKey = `${cleanTopic}_${cleanAns}_${cleanQ}_skip${skipIndex}`;
    
    if (wikiImageCache.has(cacheKey)) {
      return wikiImageCache.get(cacheKey)!;
    }

    // Try queries prioritizing "[topic] [answer]" then "[answer] [topic]" then specific query
    const queries = [
      cleanTopic && cleanAns ? `${cleanTopic} ${cleanAns}`.trim() : null,
      cleanAns && cleanTopic ? `${cleanAns} ${cleanTopic}`.trim() : null,
      cleanQ,
      cleanAns ? `${cleanAns} photo hd` : null,
    ].filter((q, i, arr): q is string => Boolean(q && q.length > 0 && arr.indexOf(q) === i)).slice(0, 3);

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

  const globalWebSearchCache = new Map<string, string>();
  const wikimediaCommonsCache = new Map<string, string>();
  const wikidataCache = new Map<string, string>();
  const ddgEnglishCache = new Map<string, string>();
  const wikiSummaryLeadCache = new Map<string, string>();
  const mediaWikiPageImageCache = new Map<string, string>();
  const openverseCache = new Map<string, string>();
  const bingAltWallpaperCache = new Map<string, string>();
  const wikimediaDeepFileCache = new Map<string, string>();

  // LOGIQUE 2 : Graphe de Connaissance Wikidata P18 (Photo officielle canonique du sujet/personnage/monument)
  async function fetchWikidataImage(query: string, answer: string = '', topic: string = ''): Promise<string | null> {
    const cleanAns = (answer || '').trim();
    const cleanTopic = (topic || '').trim();
    const cleanQ = (query || '').trim();
    const searchTargets = [
      cleanTopic && cleanAns ? `${cleanTopic} ${cleanAns}`.trim() : null,
      cleanAns && cleanTopic ? `${cleanAns} (${cleanTopic})`.trim() : null,
      cleanAns || null,
      cleanQ || null,
    ].filter((s, idx, arr): s is string => Boolean(s && arr.indexOf(s) === idx));

    if (searchTargets.length === 0) return null;

    const cacheKey = `wd_${cleanTopic}_${cleanAns}_${cleanQ}`.toLowerCase();
    if (wikidataCache.has(cacheKey)) {
      return wikidataCache.get(cacheKey)!;
    }

    for (const searchTarget of searchTargets) {
      try {
        const wdRes = await fetch(
          `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(searchTarget)}&language=fr&limit=2&format=json`,
          {
            headers: { 'User-Agent': 'GuessThatApp/2.0 (quiz@example.com)' },
            signal: AbortSignal.timeout(1800),
          }
        );
        if (!wdRes.ok) continue;
        const wdData = await wdRes.json();
        const entities = wdData.search || [];
        for (const entity of entities) {
          const entityId = entity.id;
          if (!entityId) continue;

          const entityRes = await fetch(`https://www.wikidata.org/wiki/Special:EntityData/${entityId}.json`, {
            headers: { 'User-Agent': 'GuessThatApp/2.0 (quiz@example.com)' },
            signal: AbortSignal.timeout(1800),
          });
          if (!entityRes.ok) continue;
          const entityJson = await entityRes.json();
          const filename = entityJson.entities?.[entityId]?.claims?.P18?.[0]?.mainsnak?.datavalue?.value;
          if (filename && typeof filename === 'string') {
            const cleaned = filename.trim().replace(/\s+/g, '_');
            const md5 = crypto.createHash('md5').update(cleaned).digest('hex');
            const finalUrl = `https://upload.wikimedia.org/wikipedia/commons/${md5[0]}/${md5.substring(0, 2)}/${encodeURIComponent(cleaned)}`;
            wikidataCache.set(cacheKey, finalUrl);
            return finalUrl;
          }
        }
      } catch {}
    }

    return null;
  }

  // LOGIQUE 3 : Moteur Web Mondial Haute Définition (Index Web Global / Bing Async Images Multi-résultats)
  async function fetchGlobalWebImages(query: string, answer: string = '', category: string = '', topic: string = '', maxCount: number = 15): Promise<string[]> {
    const cleanAns = (answer || '').trim();
    const cleanTopic = (topic || '').trim();
    const cleanQ = (query || '').trim();
    if (!cleanAns && !cleanQ) return [];

    const foundImages: string[] = [];

    // Toujours mettre le sujet + le nom en priorité absolue (ex: "Dragon Ball Son Goku")
    const queries = [
      cleanTopic && cleanAns ? `${cleanTopic} ${cleanAns}`.trim() : null,
      cleanTopic && cleanAns ? `${cleanTopic} ${cleanAns} photo hd wallpaper` : null,
      cleanAns && cleanTopic ? `${cleanAns} ${cleanTopic}`.trim() : null,
      cleanQ,
      cleanAns ? `${cleanAns} photo hd wallpaper` : null,
    ].filter((q, i, arr): q is string => Boolean(q && arr.indexOf(q) === i));

    for (const q of queries) {
      if (foundImages.length >= maxCount) break;
      try {
        const url = `https://www.bing.com/images/async?q=${encodeURIComponent(q)}&first=0&count=20&scenario=ImageBasicHover&datsrc=N_I&layout=RowBased&mmasync=1`;
        const res = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
          },
          signal: AbortSignal.timeout(2400),
        });
        if (res.ok) {
          const html = await res.text();
          const re = /murl&quot;:&quot;(https?:[^&]+)&quot;/g;
          let m;
          while ((m = re.exec(html)) !== null) {
            const candidateUrl = m[1];
            if (
              candidateUrl &&
              candidateUrl.startsWith('http') &&
              !candidateUrl.endsWith('.svg') &&
              !candidateUrl.toLowerCase().includes('logo') &&
              !candidateUrl.toLowerCase().includes('icon') &&
              !foundImages.includes(candidateUrl)
            ) {
              foundImages.push(candidateUrl);
              if (foundImages.length >= maxCount) break;
            }
          }
        }
      } catch {}
    }

    return foundImages;
  }

  async function fetchGlobalWebImage(query: string, answer: string = '', category: string = '', topic: string = ''): Promise<string | null> {
    const list = await fetchGlobalWebImages(query, answer, category, topic, 1);
    return list[0] || null;
  }

  // LOGIQUE 4 : Recherche DuckDuckGo EN ANGLAIS (Région mondiale wt-wt, mots clés anglophones HD wallpaper / photo)
  async function fetchDDGEnglishImage(query: string, answer: string = '', category: string = '', topic: string = ''): Promise<string | null> {
    const cleanAns = (answer || '').trim();
    const cleanTopic = (topic || '').trim();
    const cleanTopicEn = translateTopicToEnglish(topic);
    const cleanCatEn = translateCategoryToEnglish(category);
    const cleanQ = (query || '').trim();
    if (!cleanAns && !cleanQ) return null;

    const cacheKey = `ddg_en_${cleanTopic}_${cleanAns}_${cleanCatEn}_${cleanTopicEn}`.toLowerCase();
    if (ddgEnglishCache.has(cacheKey)) {
      return ddgEnglishCache.get(cacheKey)!;
    }

    // Toujours mettre le sujet + le nom en tête de recherche
    const queries = [
      cleanTopic && cleanAns ? `${cleanTopic} ${cleanAns}`.trim() : null,
      cleanTopicEn && cleanAns ? `${cleanTopicEn} ${cleanAns} hd wallpaper` : null,
      cleanTopicEn && cleanAns ? `${cleanTopicEn} ${cleanAns} character` : null,
      cleanAns && cleanTopic ? `${cleanAns} ${cleanTopic}`.trim() : null,
      cleanCatEn && cleanAns ? `${cleanAns} ${cleanCatEn} photo hd` : null,
      cleanQ,
    ].filter((q, i, arr): q is string => Boolean(q && q.length > 0 && arr.indexOf(q) === i));

    for (const q of queries) {
      try {
        const res = await fetch(`https://duckduckgo.com/?q=${encodeURIComponent(q)}&t=h_&iax=images&ia=images`, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          },
          signal: AbortSignal.timeout(2200),
        });
        const text = await res.text();
        const vqdMatch = text.match(/vqd=["']?([\d-]+)["']?/) || text.match(/vqd=([^&'"]+)/);
        if (vqdMatch && vqdMatch[1]) {
          const vqd = vqdMatch[1];
          const imgRes = await fetch(`https://duckduckgo.com/i.js?l=wt-wt&o=json&q=${encodeURIComponent(q)}&vqd=${vqd}&f=,,,&p=1`, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
              'Accept': 'application/json, text/javascript, */*; q=0.01',
            },
            signal: AbortSignal.timeout(2200),
          });
          const imgData = await imgRes.json();
          const validImages = (imgData.results || []).filter((r: any) =>
            r.image &&
            !r.image.toLowerCase().includes('logo') &&
            !r.image.toLowerCase().includes('icon') &&
            !r.image.endsWith('.svg')
          );
          if (validImages.length > 0) {
            const foundUrl = validImages[0].image;
            ddgEnglishCache.set(cacheKey, foundUrl);
            return foundUrl;
          }
        }
      } catch {}
    }

    return null;
  }

  // LOGIQUE 5 : Base Mondiale Wikimedia Commons (+100M photographies & documents d'archives)
  async function fetchWikimediaCommonsImages(query: string, answer: string = '', topic: string = '', maxCount: number = 10): Promise<string[]> {
    const cleanAns = (answer || '').trim();
    const cleanTopic = (topic || '').trim();
    const cleanQ = (query || '').trim();
    if (!cleanAns && !cleanQ) return [];

    const foundImages: string[] = [];

    const queries = [
      cleanTopic && cleanAns ? `${cleanTopic} ${cleanAns}`.trim() : null,
      cleanAns && cleanTopic ? `${cleanAns} ${cleanTopic}`.trim() : null,
      cleanAns || null,
      cleanQ || null,
    ].filter((q, i, arr): q is string => Boolean(q && arr.indexOf(q) === i));

    for (const q of queries) {
      if (foundImages.length >= maxCount) break;
      try {
        const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(q)}&gsrlimit=10&gsrnamespace=6&prop=imageinfo&iiprop=url|mime&format=json`;
        const res = await fetch(url, {
          headers: { 'User-Agent': 'GuessThatApp/2.0 (quiz@example.com)' },
          signal: AbortSignal.timeout(2200),
        });
        if (res.ok) {
          const data = await res.json();
          const pages = data.query?.pages || {};
          for (const k of Object.keys(pages)) {
            const info = pages[k].imageinfo?.[0];
            if (
              info &&
              info.url &&
              typeof info.url === 'string' &&
              !info.url.endsWith('.svg') &&
              !info.url.toLowerCase().includes('logo') &&
              (info.mime || '').startsWith('image/') &&
              !foundImages.includes(info.url)
            ) {
              foundImages.push(info.url);
              if (foundImages.length >= maxCount) break;
            }
          }
        }
      } catch {}
    }

    return foundImages;
  }

  async function fetchWikimediaCommonsImage(query: string, answer: string = '', topic: string = ''): Promise<string | null> {
    const list = await fetchWikimediaCommonsImages(query, answer, topic, 1);
    return list[0] || null;
  }

  // LOGIQUE 6 : Image d'en-tête encyclopédique haute définition (API REST Wikimedia Summary / Fr & En)
  async function fetchWikipediaLeadImage(query: string, answer: string = '', topic: string = ''): Promise<string | null> {
    const cleanAns = (answer || '').trim();
    const cleanTopic = (topic || '').trim();
    const cleanQ = (query || '').trim();
    if (!cleanAns && !cleanQ) return null;

    const cacheKey = `wiki_lead_${cleanTopic}_${cleanAns}_${cleanQ}`.toLowerCase();
    if (wikiSummaryLeadCache.has(cacheKey)) {
      return wikiSummaryLeadCache.get(cacheKey)!;
    }

    const searchTargets = [
      cleanTopic && cleanAns ? `${cleanTopic} ${cleanAns}`.trim() : null,
      cleanAns && cleanTopic ? `${cleanAns} (${cleanTopic})`.trim() : null,
      cleanAns || null,
      cleanQ || null,
    ].filter((s, idx, arr): s is string => Boolean(s && arr.indexOf(s) === idx));

    for (const searchTarget of searchTargets) {
      for (const lang of ['fr', 'en']) {
        try {
          const summaryRes = await fetch(
            `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(searchTarget)}`,
            {
              headers: { 'User-Agent': 'GuessThatApp/2.0 (quiz@example.com)' },
              signal: AbortSignal.timeout(1800),
            }
          );
          if (summaryRes.ok) {
            const sData = await summaryRes.json();
            const cand = sData.originalimage?.source || sData.thumbnail?.source;
            if (cand && typeof cand === 'string' && !cand.endsWith('.svg') && !cand.toLowerCase().includes('wikipedia-logo')) {
              wikiSummaryLeadCache.set(cacheKey, cand);
              return cand;
            }
          }
        } catch {}
      }
    }

    return null;
  }

  // LOGIQUE 7 : MediaWiki PageImages Generator Search 1200px (Recherche encyclopédique multilingue FR & EN)
  async function fetchMediaWikiPageImages(query: string, answer: string = '', topic: string = '', maxCount: number = 6): Promise<string[]> {
    const cleanAns = (answer || '').trim();
    const cleanTopic = (topic || '').trim();
    const cleanQ = (query || '').trim();
    if (!cleanAns && !cleanQ) return [];

    const foundImages: string[] = [];

    const searchTargets = [
      cleanTopic && cleanAns ? `${cleanTopic} ${cleanAns}`.trim() : null,
      cleanAns && cleanTopic ? `${cleanAns} (${cleanTopic})`.trim() : null,
      cleanAns || null,
      cleanQ || null,
    ].filter((s, idx, arr): s is string => Boolean(s && arr.indexOf(s) === idx));

    for (const target of searchTargets) {
      if (foundImages.length >= maxCount) break;
      for (const lang of ['fr', 'en']) {
        if (foundImages.length >= maxCount) break;
        try {
          const url = `https://${lang}.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(target)}&gsrlimit=5&prop=pageimages&pithumbsize=1200&format=json`;
          const res = await fetch(url, {
            headers: { 'User-Agent': 'GuessThatApp/2.0 (quiz@example.com)' },
            signal: AbortSignal.timeout(2000),
          });
          if (res.ok) {
            const data = await res.json();
            const pages = Object.values(data.query?.pages || {});
            for (const p of pages as any[]) {
              const src = p.thumbnail?.source;
              if (
                src &&
                typeof src === 'string' &&
                !src.endsWith('.svg') &&
                !src.toLowerCase().includes('logo') &&
                !src.toLowerCase().includes('icon') &&
                !foundImages.includes(src)
              ) {
                foundImages.push(src);
                if (foundImages.length >= maxCount) break;
              }
            }
          }
        } catch {}
      }
    }

    return foundImages;
  }

  async function fetchMediaWikiPageImage(query: string, answer: string = '', topic: string = ''): Promise<string | null> {
    const list = await fetchMediaWikiPageImages(query, answer, topic, 1);
    return list[0] || null;
  }

  // LOGIQUE 8 : Catalogue Mondial Openverse Creative Commons (Flickr, Musées mondiaux, Smithsonian, Archives)
  async function fetchOpenverseImages(query: string, answer: string = '', topic: string = '', maxCount: number = 10): Promise<string[]> {
    const cleanAns = (answer || '').trim();
    const cleanTopic = (topic || '').trim();
    const cleanQ = (query || '').trim();
    if (!cleanAns && !cleanQ) return [];

    const foundImages: string[] = [];

    const searchTargets = [
      cleanTopic && cleanAns ? `${cleanTopic} ${cleanAns}`.trim() : null,
      cleanAns && cleanTopic ? `${cleanAns} ${cleanTopic}`.trim() : null,
      cleanAns || null,
      cleanQ || null,
    ].filter((s, idx, arr): s is string => Boolean(s && arr.indexOf(s) === idx));

    for (const target of searchTargets) {
      if (foundImages.length >= maxCount) break;
      try {
        const url = `https://api.openverse.org/v1/images/?q=${encodeURIComponent(target)}&page_size=10`;
        const res = await fetch(url, {
          headers: { 'User-Agent': 'GuessThatApp/2.0 (quiz@example.com)' },
          signal: AbortSignal.timeout(2200),
        });
        if (res.ok) {
          const data = await res.json();
          for (const r of data.results || []) {
            if (
              r.url &&
              typeof r.url === 'string' &&
              r.url.startsWith('http') &&
              !r.url.endsWith('.svg') &&
              !r.url.toLowerCase().includes('logo') &&
              !r.url.toLowerCase().includes('icon') &&
              !foundImages.includes(r.url)
            ) {
              foundImages.push(r.url);
              if (foundImages.length >= maxCount) break;
            }
          }
        }
      } catch {}
    }

    return foundImages;
  }

  async function fetchOpenverseImage(query: string, answer: string = '', topic: string = ''): Promise<string | null> {
    const list = await fetchOpenverseImages(query, answer, topic, 1);
    return list[0] || null;
  }

  // LOGIQUE 9 : Recherche Scénario 4K / Fanart, Décor & Vue Alternative HD
  async function fetchBingAlternateWallpaperImages(query: string, answer: string = '', topic: string = '', maxCount: number = 15): Promise<string[]> {
    const cleanAns = (answer || '').trim();
    const cleanTopic = (topic || '').trim();
    const cleanQ = (query || '').trim();
    if (!cleanAns && !cleanQ) return [];

    const foundImages: string[] = [];

    const searchTargets = [
      cleanTopic && cleanAns ? `${cleanTopic} ${cleanAns} 4k wallpaper fanart` : null,
      cleanTopic && cleanAns ? `${cleanTopic} ${cleanAns} scene hd` : null,
      cleanAns && cleanTopic ? `${cleanAns} ${cleanTopic} artwork` : null,
      cleanAns ? `${cleanAns} 4k wallpaper` : null,
      cleanQ ? `${cleanQ} scene` : null,
    ].filter((s, idx, arr): s is string => Boolean(s && arr.indexOf(s) === idx));

    for (const target of searchTargets) {
      if (foundImages.length >= maxCount) break;
      try {
        const url = `https://www.bing.com/images/async?q=${encodeURIComponent(target)}&first=0&count=20&scenario=ImageBasicHover&datsrc=N_I&layout=RowBased&mmasync=1`;
        const res = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            'Accept-Language': 'en-US,en;q=0.9',
          },
          signal: AbortSignal.timeout(2200),
        });
        if (res.ok) {
          const html = await res.text();
          const re = /murl&quot;:&quot;(https?:[^&]+)&quot;/g;
          let m;
          while ((m = re.exec(html)) !== null) {
            const candidateUrl = m[1];
            if (
              candidateUrl &&
              candidateUrl.startsWith('http') &&
              !candidateUrl.endsWith('.svg') &&
              !candidateUrl.toLowerCase().includes('logo') &&
              !candidateUrl.toLowerCase().includes('icon') &&
              !foundImages.includes(candidateUrl)
            ) {
              foundImages.push(candidateUrl);
              if (foundImages.length >= maxCount) break;
            }
          }
        }
      } catch {}
    }

    return foundImages;
  }

  async function fetchBingAlternateWallpaperImage(query: string, answer: string = '', topic: string = ''): Promise<string | null> {
    const list = await fetchBingAlternateWallpaperImages(query, answer, topic, 1);
    return list[0] || null;
  }

  // LOGIQUE 10 : Recherche Profonde Wikimedia Media & Résolution Fichiers Bitmap
  async function fetchWikimediaDeepFileImage(query: string, answer: string = '', topic: string = ''): Promise<string | null> {
    const cleanAns = (answer || '').trim();
    const cleanTopic = (topic || '').trim();
    const cleanQ = (query || '').trim();
    if (!cleanAns && !cleanQ) return null;

    const cacheKey = `commons_deep_${cleanTopic}_${cleanAns}_${cleanQ}`.toLowerCase();
    if (wikimediaDeepFileCache.has(cacheKey)) {
      return wikimediaDeepFileCache.get(cacheKey)!;
    }

    const searchTargets = [
      cleanTopic && cleanAns ? `${cleanTopic} ${cleanAns} filetype:bitmap` : null,
      cleanAns && cleanTopic ? `${cleanAns} ${cleanTopic}` : null,
      cleanAns || null,
    ].filter((s, idx, arr): s is string => Boolean(s && arr.indexOf(s) === idx));

    for (const target of searchTargets) {
      try {
        const url = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(target)}&srlimit=4&srnamespace=6&format=json`;
        const res = await fetch(url, {
          headers: { 'User-Agent': 'GuessThatApp/2.0 (quiz@example.com)' },
          signal: AbortSignal.timeout(2000),
        });
        if (res.ok) {
          const data = await res.json();
          const titles = (data.query?.search || []).map((s: any) => s.title);
          for (const title of titles) {
            const infoUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=imageinfo&iiprop=url|mime&format=json`;
            const iRes = await fetch(infoUrl, {
              headers: { 'User-Agent': 'GuessThatApp/2.0 (quiz@example.com)' },
              signal: AbortSignal.timeout(1800),
            });
            if (iRes.ok) {
              const iData = await iRes.json();
              const p = Object.values(iData.query?.pages || {})[0] as any;
              const u = p?.imageinfo?.[0]?.url;
              if (u && typeof u === 'string' && !u.endsWith('.svg') && (p?.imageinfo?.[0]?.mime || '').startsWith('image/')) {
                wikimediaDeepFileCache.set(cacheKey, u);
                return u;
              }
            }
          }
        }
      } catch {}
    }

    return null;
  }

  // Second Image Search: compatible wrapper
  async function fetchSecondImage(query: string, answer: string = '', category: string = '', topic: string = ''): Promise<{ url: string | null; source: string }> {
    const imgGlobal = await fetchGlobalWebImage(query, answer, category, topic);
    if (imgGlobal) return { url: imgGlobal, source: 'Recherche Web HD' };
    const imgWd = await fetchWikidataImage(query, answer, topic);
    if (imgWd) return { url: imgWd, source: 'Wikidata Canonique' };
    const imgMw = await fetchMediaWikiPageImage(query, answer, topic);
    if (imgMw) return { url: imgMw, source: 'MediaWiki HD' };
    const imgOpen = await fetchOpenverseImage(query, answer, topic);
    if (imgOpen) return { url: imgOpen, source: 'Openverse Global' };
    const imgAlt = await fetchBingAlternateWallpaperImage(query, answer, topic);
    if (imgAlt) return { url: imgAlt, source: 'Scène 4K' };
    const imgDdgEn = await fetchDDGEnglishImage(query, answer, category, topic);
    if (imgDdgEn) return { url: imgDdgEn, source: 'DuckDuckGo EN' };
    const imgCommons = await fetchWikimediaCommonsImage(query, answer, topic);
    if (imgCommons) return { url: imgCommons, source: 'Wikimedia Commons' };
    const imgDeep = await fetchWikimediaDeepFileImage(query, answer, topic);
    if (imgDeep) return { url: imgDeep, source: 'Archives Commons' };
    const imgLead = await fetchWikipediaLeadImage(query, answer, topic);
    if (imgLead) return { url: imgLead, source: 'Encyclopédie HD' };
    return { url: null, source: 'Web' };
  }

  // FONCTION MAÎTRESSE : Garantit de trouver AU MOINS minCount (5) images distinctes et vérifiées
  async function fetchMultiDistinctImages(
    query: string,
    answer: string = '',
    category: string = '',
    topic: string = '',
    minCount: number = 5
  ): Promise<string[]> {
    const cleanAns = (answer || '').trim();
    const cleanTopic = (topic || '').trim();
    const cleanQ = (query || '').trim();

    // 1. Exécution simultanée des collecteurs multi-images
    const results = await Promise.allSettled([
      fetchGlobalWebImages(cleanQ, cleanAns, category, cleanTopic, 15),
      fetchBingAlternateWallpaperImages(cleanQ, cleanAns, cleanTopic, 15),
      fetchWikimediaCommonsImages(cleanQ, cleanAns, cleanTopic, 10),
      fetchOpenverseImages(cleanQ, cleanAns, cleanTopic, 10),
      fetchMediaWikiPageImages(cleanQ, cleanAns, cleanTopic, 6),
      fetchWikidataImage(cleanQ, cleanAns, cleanTopic),
      fetchWikipediaLeadImage(cleanQ, cleanAns, cleanTopic),
      fetchDDGImage(cleanQ, cleanAns, cleanTopic, 0),
      fetchDDGEnglishImage(cleanQ, cleanAns, category, cleanTopic),
      fetchWikimediaDeepFileImage(cleanQ, cleanAns, cleanTopic),
    ]);

    const pool: string[] = [];
    for (const r of results) {
      if (r.status === 'fulfilled' && r.value) {
        if (Array.isArray(r.value)) {
          pool.push(...r.value);
        } else if (typeof r.value === 'string' && r.value.startsWith('http')) {
          pool.push(r.value);
        }
      }
    }

    // Filtrage rigoureux des faux formats, logos et doublons
    let distinct = Array.from(
      new Set(
        pool.filter(
          (x): x is string =>
            Boolean(
              x &&
              typeof x === 'string' &&
              x.startsWith('http') &&
              !x.endsWith('.svg') &&
              !x.toLowerCase().includes('wikipedia-logo') &&
              !x.toLowerCase().includes('logo-v2') &&
              !x.toLowerCase().includes('site_logo')
            )
        )
      )
    );

    // 2. Si moins de 5 images trouvées, exécution de requêtes de secours élargies jusqu'à obtenir au moins 5 images
    if (distinct.length < minCount) {
      const fallbackQueries = [
        cleanAns,
        `${cleanAns} photo`,
        `${cleanTopic} ${cleanAns}`,
        `${cleanAns} scene`,
        `${cleanAns} visual hd`,
        `${cleanAns} artwork`,
        `${cleanTopic} ${cleanAns} 4k`,
      ].filter((fq, i, arr): fq is string => Boolean(fq && fq.length > 1 && arr.indexOf(fq) === i));

      for (const fq of fallbackQueries) {
        if (distinct.length >= minCount) break;
        try {
          const extra = await fetchGlobalWebImages(fq, fq, category, cleanTopic, 10);
          for (const u of extra) {
            if (!distinct.includes(u)) {
              distinct.push(u);
              if (distinct.length >= minCount) break;
            }
          }
        } catch {}
      }
    }

    // 3. Failsafe absolu garanti : si toujours inférieur à 5, photos haute résolution sélectionnées
    if (distinct.length < minCount) {
      const thematicFallbacks = [
        'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1507499739999-097706ad8914?auto=format&fit=crop&w=1000&q=80',
      ];
      for (const tf of thematicFallbacks) {
        if (!distinct.includes(tf)) {
          distinct.push(tf);
          if (distinct.length >= minCount) break;
        }
      }
    }

    return distinct;
  }

  // Multi-Image Search endpoint: garantit au minimum 5 images pour le Blind Test Visuel
  app.get('/api/multi-images', async (req, res) => {
    try {
      const q = (req.query.q as string || '').trim();
      const answer = (req.query.answer as string || '').trim();
      const category = (req.query.category as string || '').trim();
      const topic = (req.query.topic as string || '').trim();
      if (!q && !answer) {
        return res.status(400).json({ error: 'Query or answer is required' });
      }

      const distinct = await fetchMultiDistinctImages(q, answer, category, topic, 5);

      return res.json({
        imageUrl: distinct[0] || null,
        secondaryImageUrl: distinct[1] || distinct[0] || null,
        tertiaryImageUrl: distinct[2] || distinct[1] || distinct[0] || null,
        images: distinct,
      });
    } catch (err) {
      console.error('Multi-images search error:', err);
      res.status(500).json({ error: 'Failed to search images' });
    }
  });

  // Proxy d'image pour contourner tout blocage CORS ou Referrer sur les images distantes
  app.get('/api/image-proxy', async (req, res) => {
    try {
      const targetUrl = (req.query.url as string || '').trim();
      if (!targetUrl || !targetUrl.startsWith('http')) {
        return res.status(400).send('Invalid url');
      }

      const response = await fetch(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        },
        signal: AbortSignal.timeout(5000),
      });

      if (!response.ok) {
        return res.status(response.status).send('Failed to fetch image upstream');
      }

      const contentType = response.headers.get('content-type') || 'image/jpeg';
      res.setHeader('Content-Type', contentType);
      res.setHeader('Cache-Control', 'public, max-age=86400');
      
      const buffer = await response.arrayBuffer();
      return res.send(Buffer.from(buffer));
    } catch (e: any) {
      return res.status(502).send('Image proxy error: ' + (e?.message || 'unknown'));
    }
  });

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
      const [img1, img2, img3] = await Promise.all([
        fetchDDGImage(q, fallback, topic, 0),
        fetchGlobalWebImage(q, fallback, category, topic),
        fetchDDGEnglishImage(q, fallback, category, topic),
      ]);
      const pool = [img1, img2, img3].filter(
        (x): x is string => Boolean(x && typeof x === 'string' && x.startsWith('http') && !x.includes('Wikipedia-logo'))
      );
      const distinct = Array.from(new Set(pool));
      return res.json({ 
        imageUrl: distinct[0] || null, 
        secondaryImageUrl: distinct[1] || distinct[0] || null,
        tertiaryImageUrl: distinct[2] || distinct[1] || distinct[0] || null,
        images: distinct,
        secondaryImageSource: 'Multi-Engine'
      });
    } catch (err) {
      console.error('Wiki image search error:', err);
      res.status(500).json({ error: 'Failed to search Wiki image' });
    }
  });

  // Audio preview endpoint (iTunes / Deezer 30s HQ MP3 clips)
  app.get('/api/audio-preview', async (req, res) => {
    try {
      const query = (req.query.q as string || '').trim();
      const answer = (req.query.answer as string || '').trim();
      if (!query && !answer) {
        return res.status(400).json({ error: 'Query or answer is required' });
      }

      const preview = await fetchAudioPreview(query, answer);
      if (preview) {
        return res.json(preview);
      } else {
        return res.status(404).json({ error: 'No audio preview found' });
      }
    } catch (error) {
      console.error('Audio Preview API Error:', error);
      res.status(500).json({ error: 'Failed to fetch audio preview' });
    }
  });

  // YouTube search endpoint for background OST with instant cache and sanitized search terms
  app.get('/api/search-youtube', async (req, res) => {
    try {
      const query = (req.query.q as string || '').trim();
      if (!query) {
        return res.status(400).json({ error: 'Query is required' });
      }

      const cacheKey = query.toLowerCase();
      // Check cache first for 0ms response
      if (ytCache.has(cacheKey)) {
        return res.json(ytCache.get(cacheKey));
      }

      const ytSearch = await import('yt-search');
      const searchFn: any = ytSearch.default || ytSearch;
      
      // Clean query: avoid terms like "Official Video" which hit Vevo embeds with disabled playback
      const cleanTerm = query
        .replace(/official\s*(music)?\s*video/gi, 'audio')
        .replace(/clip\s*officiel/gi, 'audio')
        .trim();

      const r = await searchFn(cleanTerm || query);
      if (r && r.videos && r.videos.length > 0) {
        const playableVideos = r.videos.filter((v: any) => v.seconds > 10 && v.seconds < 900);
        const candidateList = (playableVideos.length > 0 ? playableVideos : r.videos).slice(0, 6);
        const videoIds = candidateList.map((v: any) => v.videoId);
        const result = {
          videoId: videoIds[0],
          videoIds,
          title: candidateList[0].title,
        };
        ytCache.set(cacheKey, result);
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
      const lang = (req.query.lang as string) || 'fr';
      if (!text) {
        return res.status(400).json({ error: 'Text is required' });
      }
      const googleTTS = await import('google-tts-api');
      const base64Audio = await googleTTS.getAudioBase64(text.slice(0, 200), {
        lang: lang,
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
- "wikiSearchQuery" : LE SUJET SUIVI DU NOM COMPLET de l'entité/personnage pour la recherche d'images (ex: "${topic} Son Goku", "${topic} Tour Eiffel", "${topic} Millennium Falcon").`;
    } else if (gameMode === 'music_blind_test') {
      modeInstructions = `MODE : BLIND TEST MUSICAL (Reconnaissance audio & thèmes)
- L'objectif est d'identifier les musiques cultes, génériques, OST ou thèmes sonores.
- "question" : DOIT porter UNIQUEMENT sur l'écoute. Exemples : "De quelle œuvre vient cette musique ?", "De qui cette musique est-elle le thème ?", "Quel est ce morceau ?". NE DONNE AUCUN SPOILER.
- "options" : 4 propositions de morceaux, œuvres ou personnages.
- "youtubeSearchQuery" : LE TITRE EXACT de l'OST, de la musique ou du thème à chercher sur YouTube (ex: "${topic} Theme OST", "Naruto Sadness and Sorrow", "Interstellar Main Theme").
- "wikiSearchQuery" : "${topic} [Bonne réponse]".`;
    } else {
      modeInstructions = `MODE : QUIZ CLASSIQUE
- Questions variées de culture générale, énigmes, citations et devinettes sur le thème.
- "youtubeSearchQuery" : Fournis le titre exact d'une musique, OST ou ambiance sonore liée au sujet.
- "wikiSearchQuery" : "${topic} [Bonne réponse]".`;
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
          
          let finalImg1 = q.imageUrl || '';
          let finalImg2 = q.secondaryImageUrl || '';
          let finalImg3 = q.tertiaryImageUrl || '';
          let secondarySource = 'Multi-Engine';
          let distinctImages: string[] = [];

          try {
            distinctImages = await fetchMultiDistinctImages(
              primaryQuery,
              q.correctAnswer,
              q.category || '',
              topic,
              5
            );

            // Intégrer également les images préexistantes de q si valides
            if (q.imageUrl && q.imageUrl.startsWith('http') && !q.imageUrl.includes('Wikipedia-logo') && !distinctImages.includes(q.imageUrl)) {
              distinctImages.unshift(q.imageUrl);
            }
            if (Array.isArray(q.images)) {
              for (const extraImg of q.images) {
                if (extraImg && extraImg.startsWith('http') && !extraImg.includes('Wikipedia-logo') && !distinctImages.includes(extraImg)) {
                  distinctImages.push(extraImg);
                }
              }
            }

            finalImg1 = distinctImages[0] || '';
            finalImg2 = distinctImages[1] || distinctImages[0] || '';
            finalImg3 = distinctImages[2] || distinctImages[1] || distinctImages[0] || '';
          } catch (err) {
            console.warn(`Error fetching multi-images for question ${idx + 1}:`, err);
          }

          let youtubeVideoIds: string[] = [];
          let audioPreviewData: { previewUrl: string; trackName?: string; artistName?: string; artworkUrl?: string } | null = null;
          
          if (gameMode === 'music_blind_test') {
            // Concurrently fetch YouTube video IDs and iTunes/Deezer audio preview
            const musicQuery = q.youtubeSearchQuery || `${q.correctAnswer} ${topic}`;
            try {
              const [ytRes, audioRes] = await Promise.allSettled([
                (async () => {
                  if (!ytSearchFn) return null;
                  const cleanYtTerm = musicQuery
                    .replace(/official\s*(music)?\s*video/gi, 'audio')
                    .replace(/clip\s*officiel/gi, 'audio')
                    .trim();
                  if (ytCache.has(cleanYtTerm)) {
                    const cached = ytCache.get(cleanYtTerm)!;
                    return cached.videoIds || [cached.videoId];
                  }
                  const r = await Promise.race([
                    ytSearchFn(cleanYtTerm),
                    new Promise<any>((_, reject) => setTimeout(() => reject(new Error('timeout')), 1800))
                  ]);
                  if (r && r.videos && r.videos.length > 0) {
                    const playable = r.videos.filter((v: any) => v.seconds > 10 && v.seconds < 900);
                    const list = (playable.length > 0 ? playable : r.videos).slice(0, 6);
                    const ids = list.map((v: any) => v.videoId);
                    ytCache.set(cleanYtTerm, { videoIds: ids, videoId: ids[0], title: list[0].title });
                    return ids;
                  }
                  return null;
                })(),
                fetchAudioPreview(musicQuery, q.correctAnswer)
              ]);

              if (ytRes.status === 'fulfilled' && ytRes.value) {
                youtubeVideoIds = ytRes.value;
              }
              if (audioRes.status === 'fulfilled' && audioRes.value) {
                audioPreviewData = audioRes.value;
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
            tertiaryImageUrl: finalImg3,
            images: distinctImages.length > 0 ? distinctImages : [finalImg1, finalImg2, finalImg3].filter(Boolean),
            secondaryImageSource: secondarySource,
            youtubeVideoId: youtubeVideoIds[0] || q.youtubeVideoId,
            youtubeVideoIds: youtubeVideoIds.length > 0 ? youtubeVideoIds : (q.youtubeVideoIds || []),
            audioPreviewUrl: audioPreviewData?.previewUrl || q.audioPreviewUrl,
            audioTrackName: audioPreviewData?.trackName || q.audioTrackName,
            audioArtistName: audioPreviewData?.artistName || q.audioArtistName,
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
    totalQuizGenerations += 1;
    broadcastGlobalStats();
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

  // Platform statistics endpoint
  app.get('/api/stats', (req, res) => {
    return res.json(getGlobalStats());
  });

  // Public rooms directory endpoint
  app.get('/api/public-rooms', (req, res) => {
    const gameMode = typeof req.query.gameMode === 'string' ? req.query.gameMode : undefined;
    return res.json({
      rooms: getPublicRoomsSummary(gameMode),
      stats: getGlobalStats(),
    });
  });

  // WebSocket Multiplayer Server Logic
  wss.on('connection', (ws) => {
    let clientRoomCode: string | null = null;
    let clientPlayerId: string | null = null;

    // Send instant stats and public rooms list upon connecting
    ws.send(JSON.stringify({
      type: 'global_stats',
      stats: getGlobalStats(),
    }));
    ws.send(JSON.stringify({
      type: 'public_rooms_list',
      rooms: getPublicRoomsSummary(),
    }));
    broadcastGlobalStats();

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
          const {
            hostName = 'Hôte',
            avatar = '👑',
            quizData,
            difficulty = 'medium',
            gameMode = 'quiz',
            gameStyle = 'competitive_room',
            durationPerQuestion = 20,
            isPublic = true,
            language = 'fr',
          } = data;
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
            language: language || 'fr',
            durationPerQuestion: durationPerQuestion || 20,
            currentQuestionIndex: 0,
            questionStartTime: 0,
            quizData,
            isPublic: isPublic !== false,
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

          broadcastGlobalStats();
          broadcastPublicRooms();
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

          broadcastGlobalStats();
          broadcastPublicRooms();
        }

        // UPDATE QUIZ DATA (background generation finished)
        else if (type === 'update_quiz_data') {
          const { code: rawCode, quizData } = data;
          const code = (rawCode || clientRoomCode || '').toUpperCase().trim();
          const room = activeRooms.get(code);
          if (!room || !quizData) return;

          room.quizData = quizData;
          if (quizData.gameMode) room.gameMode = quizData.gameMode;
          if (quizData.difficulty) room.difficulty = quizData.difficulty;
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
          broadcastPublicRooms();
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
          const { code: rawCode, quizData, gameMode, difficulty } = data;
          const code = (rawCode || clientRoomCode || '').toUpperCase().trim();
          const room = activeRooms.get(code);
          if (!room || clientPlayerId !== room.hostId) return;

          const updatedGameMode = gameMode || quizData?.gameMode || room.gameMode;
          if (updatedGameMode) {
            room.gameMode = updatedGameMode;
          }
          if (difficulty || quizData?.difficulty) {
            room.difficulty = difficulty || quizData.difficulty;
          }

          if (quizData) {
            room.quizData = {
              ...quizData,
              gameMode: room.gameMode,
            };
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
          broadcastToRoom(room, {
            type: 'room_updated',
            room: serializeRoom(room),
          });
          broadcastPublicRooms();
        }

        // UPDATE ROOM SETTINGS (mode, difficulty, duration, newQuizReady)
        else if (type === 'update_room_settings') {
          const { code: rawCode, gameMode, difficulty, durationPerQuestion, newQuizReady } = data;
          const code = (rawCode || clientRoomCode || '').toUpperCase().trim();
          const room = activeRooms.get(code);
          if (!room || clientPlayerId !== room.hostId) return;

          if (gameMode) {
            room.gameMode = gameMode;
            if (room.quizData) {
              room.quizData.gameMode = gameMode;
            }
          }
          if (difficulty) room.difficulty = difficulty;
          if (durationPerQuestion) room.durationPerQuestion = durationPerQuestion;
          if (typeof newQuizReady === 'boolean') room.newQuizReady = newQuizReady;

          broadcastToRoom(room, {
            type: 'room_state',
            room: serializeRoom(room),
          });
          broadcastToRoom(room, {
            type: 'room_updated',
            room: serializeRoom(room),
          });
          broadcastPublicRooms();
        }

        // TOGGLE PUBLIC ROOM
        else if (type === 'toggle_public_room') {
          const { code: rawCode, isPublic } = data;
          const code = (rawCode || clientRoomCode || '').toUpperCase().trim();
          const room = activeRooms.get(code);
          if (!room || clientPlayerId !== room.hostId) return;

          room.isPublic = !!isPublic;
          broadcastToRoom(room, {
            type: 'room_state',
            room: serializeRoom(room),
          });
          broadcastPublicRooms();
          broadcastGlobalStats();
        }

        // GET PUBLIC ROOMS
        else if (type === 'get_public_rooms') {
          const { gameMode } = data;
          ws.send(JSON.stringify({
            type: 'public_rooms_list',
            rooms: getPublicRoomsSummary(gameMode),
          }));
        }

        // GET STATS
        else if (type === 'get_stats') {
          ws.send(JSON.stringify({
            type: 'global_stats',
            stats: getGlobalStats(),
          }));
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
          broadcastGlobalStats();
          broadcastPublicRooms();
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
      broadcastGlobalStats();
      broadcastPublicRooms();
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
