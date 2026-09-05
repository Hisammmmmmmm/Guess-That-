import { RoomState, RoomPlayer, DetailedPlatformStats } from '../types';

export type MultiplayerListener = (data: any) => void;

export function getOrCreateDeviceId(): string {
  try {
    let id = localStorage.getItem('guess_that_device_id');
    if (!id || typeof id !== 'string' || !id.trim()) {
      id = `dev_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
      localStorage.setItem('guess_that_device_id', id);
    }
    // Mirror to cookie so it stays resilient across tabs
    try {
      document.cookie = `guessthat_device_id=${encodeURIComponent(id)}; path=/; max-age=31536000; SameSite=Lax`;
    } catch {}
    return id;
  } catch {
    return `dev_${Math.random().toString(36).substring(2, 11)}`;
  }
}

class MultiplayerService {
  private ws: WebSocket | null = null;
  private listeners: Map<string, Set<MultiplayerListener>> = new Map();
  private pingInterval: any = null;
  private currentRoomCode: string | null = null;
  private currentPlayerId: string | null = null;
  private pendingQuizData: any = null;
  private isConnecting: boolean = false;
  private listenersBound: boolean = false;

  constructor() {
    this.bindWindowLifecycle();
  }

  private bindWindowLifecycle() {
    if (typeof window === 'undefined' || this.listenersBound) return;
    this.listenersBound = true;

    const handleResumeOrWake = () => {
      if (document.visibilityState === 'visible' || document.hasFocus()) {
        if (!this.isConnected()) {
          this.connect().then((connected) => {
            if (connected) {
              if (this.currentRoomCode) {
                this.refreshRoom(this.currentRoomCode);
              }
              this.requestPublicRooms();
              this.requestStats();
            }
          });
        } else {
          if (this.currentRoomCode) {
            this.refreshRoom(this.currentRoomCode);
          }
          this.requestPublicRooms();
          this.requestStats();
        }
      }
    };

    window.addEventListener('visibilitychange', handleResumeOrWake);
    window.addEventListener('focus', handleResumeOrWake);
    window.addEventListener('online', handleResumeOrWake);
    window.addEventListener('pageshow', handleResumeOrWake);

    const handleBeforeUnload = () => {
      if (this.currentRoomCode && this.ws && this.ws.readyState === WebSocket.OPEN) {
        try {
          this.ws.send(JSON.stringify({
            type: 'leave_room',
            code: this.currentRoomCode,
            playerId: this.currentPlayerId,
          }));
        } catch {}
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pagehide', handleBeforeUnload);
  }

  public getDeviceId(): string {
    return getOrCreateDeviceId();
  }

  public getCurrentRoomCode(): string | null {
    return this.currentRoomCode;
  }

  public getCurrentPlayerId(): string | null {
    return this.currentPlayerId;
  }

  public isConnected(): boolean {
    return !!(this.ws && this.ws.readyState === WebSocket.OPEN);
  }

  public connect(): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
        return resolve(true);
      }

      this.isConnecting = true;
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}`;

      try {
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          this.isConnecting = false;
          this.startHeartbeat();
          if (this.currentRoomCode) {
            this.refreshRoom(this.currentRoomCode);
          }
          this.requestPublicRooms();
          this.requestStats();
          resolve(true);
        };

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type) {
              if (data.type === 'ping') {
                if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                  this.ws.send(JSON.stringify({ type: 'pong' }));
                }
                return;
              }

              // Automatically sync active room code and player ID
              if (data.code) {
                this.currentRoomCode = data.code;
              }
              if (data.playerId) {
                this.currentPlayerId = data.playerId;
              }

              // Flush pending quiz data update if room was just confirmed
              if (
                (data.type === 'room_created' || data.type === 'room_joined' || data.type === 'joined_room') &&
                this.pendingQuizData &&
                this.currentRoomCode
              ) {
                const pending = this.pendingQuizData;
                this.pendingQuizData = null;
                this.updateQuizData(this.currentRoomCode, pending);
              }

              const callbacks = this.listeners.get(data.type);
              if (callbacks) {
                callbacks.forEach((cb) => cb(data));
              }
              // Also trigger catch-all listener
              const allCallbacks = this.listeners.get('*');
              if (allCallbacks) {
                allCallbacks.forEach((cb) => cb(data));
              }
            }
          } catch (err) {
            console.error('WS parse error', err);
          }
        };

        this.ws.onerror = (err) => {
          console.warn('WS error', err);
          this.isConnecting = false;
          resolve(false);
        };

        this.ws.onclose = () => {
          this.isConnecting = false;
          this.stopHeartbeat();
          const callbacks = this.listeners.get('disconnected');
          if (callbacks) {
            callbacks.forEach((cb) => cb({}));
          }
        };
      } catch (err) {
        this.isConnecting = false;
        console.error('Failed to create WebSocket', err);
        resolve(false);
      }
    });
  }

  private startHeartbeat() {
    this.stopHeartbeat();
    this.pingInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'ping' }));
      }
    }, 12000);
  }

  private stopHeartbeat() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  public on(type: string, callback: MultiplayerListener) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(callback);
  }

  public off(type: string, callback: MultiplayerListener) {
    const callbacks = this.listeners.get(type);
    if (callbacks) {
      callbacks.delete(callback);
    }
  }

  public send(payload: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(payload));
    } else {
      this.connect().then((ok) => {
        if (ok && this.ws && this.ws.readyState === WebSocket.OPEN) {
          this.ws.send(JSON.stringify(payload));
        }
      });
    }
  }

  public async createRoom(params: {
    hostName: string;
    avatar: string;
    quizData: any;
    difficulty: string;
    gameMode: string;
    language: string;
    durationPerQuestion: number;
    isPublic?: boolean;
  }) {
    await this.connect();
    this.send({
      type: 'create_room',
      ...params,
      deviceId: getOrCreateDeviceId(),
    });
  }

  public async joinRoom(params: {
    code: string;
    playerName: string;
    avatar: string;
    playerId?: string;
  }) {
    await this.connect();
    this.send({
      type: 'join_room',
      ...params,
      deviceId: getOrCreateDeviceId(),
    });
  }

  public updateQuizData(code?: string, quizData?: any) {
    const targetCode = code || this.currentRoomCode;
    if (targetCode && quizData) {
      this.send({ type: 'update_quiz_data', code: targetCode, quizData });
    } else if (quizData) {
      this.pendingQuizData = quizData;
    }
  }

  public startGame(code: string) {
    this.send({ type: 'start_game', code, playerId: this.currentPlayerId });
  }

  public updatePlayer(params: { code?: string; name?: string; avatar?: string }) {
    const targetCode = params.code || this.currentRoomCode;
    this.send({
      type: 'update_player',
      code: targetCode,
      playerId: this.currentPlayerId,
      name: params.name,
      avatar: params.avatar,
      deviceId: getOrCreateDeviceId(),
    });
  }

  public requestStatsDetails() {
    this.send({ type: 'get_stats_details' });
  }

  public async fetchStatsDetails(): Promise<DetailedPlatformStats | null> {
    try {
      const res = await fetch('/api/stats/details');
      if (res.ok) {
        return await res.json();
      }
      return null;
    } catch (e) {
      console.warn('Failed to fetch stats details', e);
      return null;
    }
  }

  public toggleReady(code: string, isReady: boolean) {
    this.send({ type: 'toggle_ready', code, isReady, playerId: this.currentPlayerId });
  }

  public submitAnswer(code: string, questionIndex: number, selectedOption: string, timeSpent: number) {
    this.send({
      type: 'submit_answer',
      code,
      questionIndex,
      selectedOption,
      timeSpent,
      playerId: this.currentPlayerId,
    });
  }

  public revealQuestion(code: string) {
    this.send({ type: 'reveal_question', code, playerId: this.currentPlayerId });
  }

  public nextQuestion(code: string) {
    this.send({ type: 'next_question', code, playerId: this.currentPlayerId });
  }

  public sendReaction(code: string, emoji: string) {
    this.send({ type: 'send_reaction', code, emoji });
  }

  public refreshRoom(code?: string) {
    const targetCode = code || this.currentRoomCode;
    if (targetCode) {
      this.send({
        type: 'refresh_room',
        code: targetCode,
        playerId: this.currentPlayerId,
      });
    }
  }

  public updateRoomSettings(params: {
    code?: string;
    gameMode?: string;
    difficulty?: string;
    durationPerQuestion?: number;
    newQuizReady?: boolean;
  }) {
    const targetCode = params.code || this.currentRoomCode;
    if (targetCode) {
      this.send({
        type: 'update_room_settings',
        code: targetCode,
        playerId: this.currentPlayerId,
        ...params,
      });
    }
  }

  public restartRoom(code: string) {
    this.send({ type: 'restart_room', code });
  }

  public restartWithQuiz(code: string, quizData: any, options?: { gameMode?: string; difficulty?: string }) {
    this.send({
      type: 'restart_with_quiz',
      code,
      quizData,
      gameMode: options?.gameMode,
      difficulty: options?.difficulty,
    });
  }

  public leaveRoom(code: string) {
    this.send({ type: 'leave_room', code });
    this.currentRoomCode = null;
    this.currentPlayerId = null;
  }

  public togglePublicRoom(code: string, isPublic: boolean) {
    this.send({
      type: 'toggle_public_room',
      code,
      playerId: this.currentPlayerId,
      isPublic,
    });
  }

  public requestPublicRooms(language?: string, gameMode?: string) {
    this.send({
      type: 'get_public_rooms',
      language,
      gameMode,
    });
  }

  public requestStats() {
    this.send({ type: 'get_stats' });
  }
}

export const multiplayerService = new MultiplayerService();
