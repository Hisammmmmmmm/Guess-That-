import { AmbientSoundType } from '../types';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private musicGain: GainNode | null = null;

  private currentAmbienceType: AmbientSoundType | null = null;
  private customMusicSource: AudioBufferSourceNode | null = null;
  private ambienceNodes: {
    oscillators: OscillatorNode[];
    gains: GainNode[];
    intervalId?: number;
  } | null = null;

  private masterVol = 0.8;
  private sfxVol = 1.7;
  private musicVol = 0.6;
  private isSfxMuted = false;
  private isMusicMuted = false;
  private audioBufferCache: Record<string, AudioBuffer | null> = {};

  private async playSoundFileOrFallback(filename: string, fallback: () => void, gainNode: GainNode | null) {
    if (!this.ctx || !gainNode || (gainNode === this.sfxGain && this.isSfxMuted) || (gainNode === this.musicGain && this.isMusicMuted)) return;

    if (this.audioBufferCache[filename] === null) {
      fallback();
      return;
    }

    if (this.audioBufferCache[filename]) {
      const source = this.ctx.createBufferSource();
      source.buffer = this.audioBufferCache[filename] as AudioBuffer;
      source.connect(gainNode);
      source.start();
      return;
    }

    try {
      const response = await fetch('/sounds/' + filename);
      if (!response.ok) {
        this.audioBufferCache[filename] = null;
        fallback();
        return;
      }
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.ctx.decodeAudioData(arrayBuffer);
      this.audioBufferCache[filename] = audioBuffer;

      const source = this.ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(gainNode);
      source.start();
    } catch (e) {
      this.audioBufferCache[filename] = null;
      fallback();
    }
  }

  // --- NEW EVENTS ---
  public playQuestionTransition() {
    this.initContext();
    this.playSoundFileOrFallback('transition.mp3', () => {
      if (!this.ctx || !this.sfxGain || this.isSfxMuted) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, t);
      osc.frequency.exponentialRampToValueAtTime(150, t + 0.5);
      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 0.5);
    }, this.sfxGain);
  }

  public playLevelUp() {
    this.initContext();
    this.playSoundFileOrFallback('levelup.mp3', () => {
      if (!this.ctx || !this.sfxGain || this.isSfxMuted) return;
      this.playFanfare();
    }, this.sfxGain);
  }

  public playStartGame() {
    this.initContext();
    this.playSoundFileOrFallback('startgame.mp3', () => {
      if (!this.ctx || !this.sfxGain || this.isSfxMuted) return;
      const t = this.ctx.currentTime;
      [440, 554.37, 659.25, 880].forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t + idx * 0.1);
        gain.gain.setValueAtTime(0.2, t + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.1 + 0.3);
        osc.connect(gain);
        gain.connect(this.sfxGain!);
        osc.start(t + idx * 0.1);
        osc.stop(t + idx * 0.1 + 0.3);
      });
    }, this.sfxGain);
  }

  public playGameOver() {
    this.initContext();
    this.playSoundFileOrFallback('gameover.mp3', () => {
      if (!this.ctx || !this.sfxGain || this.isSfxMuted) return;
      this.playTimeUp(); // Reuse timeUp as fallback for now
    }, this.sfxGain);
  }

  public playMenuSelect() {
    this.initContext();
    this.playSoundFileOrFallback('menuselect.mp3', () => {
      if (!this.ctx || !this.sfxGain || this.isSfxMuted) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(300, t);
      osc.frequency.exponentialRampToValueAtTime(600, t + 0.1);
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 0.2);
    }, this.sfxGain);
  }


  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.masterVol;
      this.masterGain.connect(this.ctx.destination);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = this.isSfxMuted ? 0 : this.sfxVol;
      this.sfxGain.connect(this.masterGain);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.value = this.isMusicMuted ? 0 : this.musicVol;
      this.musicGain.connect(this.masterGain);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public unlockAudio() {
    this.initContext();
  }

  public setMasterVolume(val: number) {
    this.masterVol = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.masterVol, this.ctx.currentTime, 0.05);
    }
  }

  public setSfxVolume(val: number) {
    this.sfxVol = Math.max(0, Math.min(1, val)) * 2; // Made much louder by default
    if (this.sfxGain && this.ctx && !this.isSfxMuted) {
      this.sfxGain.gain.setTargetAtTime(this.sfxVol, this.ctx.currentTime, 0.05);
    }
  }

  public setMusicVolume(val: number) {
    this.musicVol = Math.max(0, Math.min(1, val));
    if (this.musicGain && this.ctx && !this.isMusicMuted) {
      this.musicGain.gain.setTargetAtTime(this.musicVol, this.ctx.currentTime, 0.05);
    }
  }

  public setSfxMuted(muted: boolean) {
    this.isSfxMuted = muted;
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setTargetAtTime(muted ? 0 : this.sfxVol, this.ctx.currentTime, 0.05);
    }
  }

  public setMusicMuted(muted: boolean) {
    this.isMusicMuted = muted;
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setTargetAtTime(muted ? 0 : this.musicVol, this.ctx.currentTime, 0.05);
    }
  }

  // --- SOUND EFFECTS ---

  public playClick() {
    this.initContext();
    this.playSoundFileOrFallback('click.mp3', () => {
      if (!this.ctx || !this.sfxGain || this.isSfxMuted) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, t);
      osc.frequency.exponentialRampToValueAtTime(880, t + 0.04);
      osc.frequency.exponentialRampToValueAtTime(220, t + 0.08);
      gain.gain.setValueAtTime(0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 0.08);
    }, this.sfxGain);
  }

  public playHover() {
    this.initContext();
    this.playSoundFileOrFallback('hover.mp3', () => {
      if (!this.ctx || !this.sfxGain || this.isSfxMuted) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, t);
      osc.frequency.exponentialRampToValueAtTime(1200, t + 0.03);
      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 0.03);
    }, this.sfxGain);
  }

  public playCountdownTick(isUrgent: boolean = false) {
    this.initContext();
    const filename = isUrgent ? 'tick_urgent.mp3' : 'tick.mp3';
    this.playSoundFileOrFallback(filename, () => {
      if (!this.ctx || !this.sfxGain || this.isSfxMuted) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      if (isUrgent) {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(620, t);
        osc.frequency.exponentialRampToValueAtTime(320, t + 0.07);
        gain.gain.setValueAtTime(0.4, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
        const subOsc = this.ctx.createOscillator();
        const subGain = this.ctx.createGain();
        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(110, t);
        subOsc.frequency.exponentialRampToValueAtTime(55, t + 0.12);
        subGain.gain.setValueAtTime(0.5, t);
        subGain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
        subOsc.connect(subGain);
        subGain.connect(this.sfxGain);
        subOsc.start(t);
        subOsc.stop(t + 0.12);
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(520, t);
        osc.frequency.exponentialRampToValueAtTime(420, t + 0.04);
        gain.gain.setValueAtTime(0.18, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
      }
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + (isUrgent ? 0.09 : 0.05));
    }, this.sfxGain);
  }

  public playCorrect() {
    this.initContext();
    this.playSoundFileOrFallback('correct.mp3', () => {
      if (!this.ctx || !this.sfxGain || this.isSfxMuted) return;
      const t = this.ctx.currentTime;
      const freqs = [523.25, 659.25, 783.99, 1046.5];
      freqs.forEach((freq, idx) => {
        if (!this.ctx || !this.sfxGain) return;
        const noteTime = t + idx * 0.07;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, noteTime);
        gain.gain.setValueAtTime(0.28, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.35);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(noteTime);
        osc.stop(noteTime + 0.35);
      });
    }, this.sfxGain);
  }

  public playWrong() {
    this.initContext();
    this.playSoundFileOrFallback('wrong.mp3', () => {
      if (!this.ctx || !this.sfxGain || this.isSfxMuted) return;
      const t = this.ctx.currentTime;
      const notes = [220, 185];
      notes.forEach((freq, idx) => {
        if (!this.ctx || !this.sfxGain) return;
        const noteTime = t + idx * 0.12;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, noteTime);
        gain.gain.setValueAtTime(0.22, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.22);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(noteTime);
        osc.stop(noteTime + 0.22);
      });
    }, this.sfxGain);
  }

  public playStreak(streakCount: number) {
    this.initContext();
    this.playSoundFileOrFallback(`streak${Math.min(streakCount, 5)}.mp3`, () => {
      if (!this.ctx || !this.sfxGain || this.isSfxMuted) return;
      const t = this.ctx.currentTime;
      const baseFreq = 440 * Math.pow(1.15, Math.min(streakCount, 8));
      const freqs = [baseFreq, baseFreq * 1.25, baseFreq * 1.5, baseFreq * 2];
      freqs.forEach((freq, idx) => {
        if (!this.ctx || !this.sfxGain) return;
        const noteTime = t + idx * 0.05;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteTime);
        gain.gain.setValueAtTime(0.25, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.4);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(noteTime);
        osc.stop(noteTime + 0.4);
      });
    }, this.sfxGain);
  }

  public playTimeUp() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isSfxMuted) return;

    const t = this.ctx.currentTime;

    // 1. Harsh Game-Show Buzzer Impact
    const buzzerOsc = this.ctx.createOscillator();
    const buzzerGain = this.ctx.createGain();
    buzzerOsc.type = 'sawtooth';
    buzzerOsc.frequency.setValueAtTime(130, t);
    buzzerOsc.frequency.linearRampToValueAtTime(80, t + 0.35);

    buzzerGain.gain.setValueAtTime(0.45, t);
    buzzerGain.gain.exponentialRampToValueAtTime(0.001, t + 0.38);

    buzzerOsc.connect(buzzerGain);
    buzzerGain.connect(this.sfxGain);
    buzzerOsc.start(t);
    buzzerOsc.stop(t + 0.38);

    // 2. Descending Sad Defeat Trombone Notes ("Womp-womp-womp-woooomp")
    const sadNotes = [
      { f: 233.08, dur: 0.22, delay: 0.18 }, // Bb3
      { f: 220.00, dur: 0.22, delay: 0.42 }, // A3
      { f: 207.65, dur: 0.22, delay: 0.66 }, // Ab3
      { f: 196.00, dur: 0.65, delay: 0.90, slideTo: 145 }, // G3 sliding down with vibrato
    ];

    sadNotes.forEach((note) => {
      if (!this.ctx || !this.sfxGain) return;
      const noteStart = t + note.delay;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(note.f, noteStart);

      if (note.slideTo) {
        osc.frequency.exponentialRampToValueAtTime(note.slideTo, noteStart + note.dur);
      }

      // Add low-pass filter for brass trombone character
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(550, noteStart);
      filter.frequency.exponentialRampToValueAtTime(300, noteStart + note.dur);

      gain.gain.setValueAtTime(0.35, noteStart);
      gain.gain.exponentialRampToValueAtTime(0.001, noteStart + note.dur);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(noteStart);
      osc.stop(noteStart + note.dur);
    });
  }

  public playFanfare() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isSfxMuted) return;

    const t = this.ctx.currentTime;
    const melody = [
      { f: 523.25, d: 0.12 }, // C5
      { f: 523.25, d: 0.12 }, // C5
      { f: 523.25, d: 0.12 }, // C5
      { f: 659.25, d: 0.28 }, // E5
      { f: 587.33, d: 0.14 }, // D5
      { f: 783.99, d: 0.45 }, // G5
      { f: 1046.5, d: 0.7 },  // C6
    ];

    let cursor = t;
    melody.forEach((note) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.f, cursor);

      gain.gain.setValueAtTime(0.3, cursor);
      gain.gain.exponentialRampToValueAtTime(0.001, cursor + note.d);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(cursor);
      osc.stop(cursor + note.d);

      cursor += note.d * 0.9;
    });
  }

  public playAudioClue(notes?: number[]) {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isSfxMuted) return;

    const pattern = notes && notes.length > 0
      ? notes
      : [330, 392, 440, 523, 659, 587, 440]; // Default melodic mystery jingle

    const t = this.ctx.currentTime;
    pattern.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const noteTime = t + idx * 0.14;
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, noteTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1500, noteTime);
      filter.frequency.exponentialRampToValueAtTime(500, noteTime + 0.35);

      gain.gain.setValueAtTime(0.35, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.35);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(noteTime);
      osc.stop(noteTime + 0.35);
    });
  }

  // --- AMBIENT SOUNDSCAPES (GENERATIVE WEB AUDIO) ---

  public startAmbience(type: AmbientSoundType) {
    this.initContext();
    if (!this.ctx || !this.musicGain) return;

    if (this.currentAmbienceType === type && this.ambienceNodes) {
      return; // Already playing this ambience
    }

    this.stopAmbience();
    this.currentAmbienceType = type;

    const oscillators: OscillatorNode[] = [];
    const gains: GainNode[] = [];

    const t = this.ctx.currentTime;

    switch (type) {
      case 'synthwave': {
        // Warm dual-saw pad with slow filter modulation + retro pulse
        const chords = [130.81, 164.81, 196.0, 246.94]; // C3, E3, G3, B3
        chords.forEach((freq) => {
          if (!this.ctx || !this.musicGain) return;
          const osc1 = this.ctx.createOscillator();
          const osc2 = this.ctx.createOscillator();
          const filter = this.ctx.createBiquadFilter();
          const gain = this.ctx.createGain();

          osc1.type = 'sawtooth';
          osc1.frequency.setValueAtTime(freq, t);
          osc2.type = 'sawtooth';
          osc2.frequency.setValueAtTime(freq * 1.006, t); // Detuned

          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(450, t);

          gain.gain.setValueAtTime(0.001, t);
          gain.gain.linearRampToValueAtTime(0.07, t + 2);

          osc1.connect(filter);
          osc2.connect(filter);
          filter.connect(gain);
          gain.connect(this.musicGain);

          osc1.start(t);
          osc2.start(t);
          oscillators.push(osc1, osc2);
          gains.push(gain);
        });

        // Arpeggiator interval
        const arpFreqs = [261.63, 329.63, 392.0, 493.88, 523.25];
        let step = 0;
        const intervalId = window.setInterval(() => {
          if (!this.ctx || !this.musicGain || this.isMusicMuted) return;
          const now = this.ctx.currentTime;
          const osc = this.ctx.createOscillator();
          const g = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(arpFreqs[step % arpFreqs.length], now);
          g.gain.setValueAtTime(0.04, now);
          g.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
          osc.connect(g);
          g.connect(this.musicGain);
          osc.start(now);
          osc.stop(now + 0.35);
          step++;
        }, 360);

        this.ambienceNodes = { oscillators, gains, intervalId };
        break;
      }

      case 'cinema': {
        // Deep cinematic drone & sub-harmonics
        const freqs = [65.41, 98.0, 130.81, 196.0]; // C2, G2, C3, G3
        freqs.forEach((freq, idx) => {
          if (!this.ctx || !this.musicGain) return;
          const osc = this.ctx.createOscillator();
          const filter = this.ctx.createBiquadFilter();
          const gain = this.ctx.createGain();

          osc.type = idx === 0 ? 'sine' : 'triangle';
          osc.frequency.setValueAtTime(freq, t);

          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(320, t);

          gain.gain.setValueAtTime(0.001, t);
          gain.gain.linearRampToValueAtTime(0.1, t + 2.5);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(this.musicGain);

          osc.start(t);
          oscillators.push(osc);
          gains.push(gain);
        });

        // Occasional deep brass chime
        const intervalId = window.setInterval(() => {
          if (!this.ctx || !this.musicGain || this.isMusicMuted) return;
          const now = this.ctx.currentTime;
          const osc = this.ctx.createOscillator();
          const g = this.ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(130.81, now);
          osc.frequency.exponentialRampToValueAtTime(65.41, now + 1.2);
          g.gain.setValueAtTime(0.08, now);
          g.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
          osc.connect(g);
          g.connect(this.musicGain);
          osc.start(now);
          osc.stop(now + 1.2);
        }, 4500);

        this.ambienceNodes = { oscillators, gains, intervalId };
        break;
      }

      case 'fantasy': {
        // Ethereal crystal arpeggios & airy pads
        const padFreqs = [174.61, 220.0, 261.63, 329.63]; // F3, A3, C4, E4
        padFreqs.forEach((freq) => {
          if (!this.ctx || !this.musicGain) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, t);

          gain.gain.setValueAtTime(0.001, t);
          gain.gain.linearRampToValueAtTime(0.06, t + 2);

          osc.connect(gain);
          gain.connect(this.musicGain);

          osc.start(t);
          oscillators.push(osc);
          gains.push(gain);
        });

        const chimes = [523.25, 659.25, 783.99, 880.0, 1046.5, 1318.5];
        const intervalId = window.setInterval(() => {
          if (!this.ctx || !this.musicGain || this.isMusicMuted) return;
          const now = this.ctx.currentTime;
          const osc = this.ctx.createOscillator();
          const g = this.ctx.createGain();
          const randomNote = chimes[Math.floor(Math.random() * chimes.length)];
          osc.type = 'sine';
          osc.frequency.setValueAtTime(randomNote, now);
          g.gain.setValueAtTime(0.05, now);
          g.gain.exponentialRampToValueAtTime(0.0001, now + 1.5);
          osc.connect(g);
          g.connect(this.musicGain);
          osc.start(now);
          osc.stop(now + 1.5);
        }, 900);

        this.ambienceNodes = { oscillators, gains, intervalId };
        break;
      }

      case 'retro80s':
      case 'electro': {
        // More dynamic synthwave with a kick drum & fast arpeggiator
        const baseFreq = type === 'electro' ? 110 : 98;
        const seq = [baseFreq, baseFreq * 1.5, baseFreq * 1.25, baseFreq * 2];
        const kickInterval = 0.5; // 120 BPM
        
        let sIdx = 0;
        let kickIdx = 0;
        const intervalId = window.setInterval(() => {
          if (!this.ctx || !this.musicGain || this.isMusicMuted) return;
          const now = this.ctx.currentTime;
          
          // Fast Bass Arp (every 125ms = 1/16th note)
          const o = this.ctx.createOscillator();
          const g = this.ctx.createGain();
          o.type = 'sawtooth';
          o.frequency.setValueAtTime(seq[sIdx % seq.length] * (sIdx % 2 === 0 ? 1 : 2), now);
          
          const f = this.ctx.createBiquadFilter();
          f.type = 'lowpass';
          f.frequency.setValueAtTime(800, now);
          f.frequency.exponentialRampToValueAtTime(100, now + 0.1);
          
          g.gain.setValueAtTime(0.08, now);
          g.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
          
          o.connect(f);
          f.connect(g);
          g.connect(this.musicGain);
          o.start(now);
          o.stop(now + 0.1);
          
          // Kick Drum (every 500ms = 1/4 note)
          if (sIdx % 4 === 0) {
            const kickOsc = this.ctx.createOscillator();
            const kickGain = this.ctx.createGain();
            kickOsc.type = 'sine';
            kickOsc.frequency.setValueAtTime(150, now);
            kickOsc.frequency.exponentialRampToValueAtTime(0.01, now + 0.3); // Pitch drop
            kickGain.gain.setValueAtTime(0.5, now);
            kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
            kickOsc.connect(kickGain);
            kickGain.connect(this.musicGain);
            kickOsc.start(now);
            kickOsc.stop(now + 0.3);
            
            // Open Hat on off-beats
            if (kickIdx % 2 !== 0) {
              const hatOsc = this.ctx.createOscillator();
              const hatGain = this.ctx.createGain();
              const hatFilter = this.ctx.createBiquadFilter();
              hatOsc.type = 'square';
              hatOsc.frequency.setValueAtTime(5000, now);
              hatFilter.type = 'highpass';
              hatFilter.frequency.setValueAtTime(4000, now);
              hatGain.gain.setValueAtTime(0.03, now);
              hatGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
              hatOsc.connect(hatFilter);
              hatFilter.connect(hatGain);
              hatGain.connect(this.musicGain);
              hatOsc.start(now);
              hatOsc.stop(now + 0.1);
            }
            kickIdx++;
          }
          
          sIdx++;
        }, 125);

        this.ambienceNodes = { oscillators: [], gains: [], intervalId };
        break;
      }

      case 'jazzy': {
        // Lush Major 7th & 9th electric piano chords
        const jazzChords = [
          [261.63, 329.63, 392.0, 493.88], // Cmaj7
          [220.0, 261.63, 329.63, 392.0],  // Am7
          [174.61, 220.0, 261.63, 329.63], // Fmaj7
          [196.0, 246.94, 293.66, 349.23], // G7
        ];
        let chordIdx = 0;

        const playChord = () => {
          if (!this.ctx || !this.musicGain || this.isMusicMuted) return;
          const now = this.ctx.currentTime;
          const chord = jazzChords[chordIdx % jazzChords.length];
          chord.forEach((freq) => {
            if (!this.ctx || !this.musicGain) return;
            const o = this.ctx.createOscillator();
            const g = this.ctx.createGain();
            o.type = 'triangle';
            o.frequency.setValueAtTime(freq, now);
            g.gain.setValueAtTime(0.04, now);
            g.gain.exponentialRampToValueAtTime(0.001, now + 3.8);
            o.connect(g);
            g.connect(this.musicGain);
            o.start(now);
            o.stop(now + 3.8);
          });
          chordIdx++;
        };

        playChord();
        const intervalId = window.setInterval(playChord, 3800);
        this.ambienceNodes = { oscillators, gains, intervalId };
        break;
      }

      case 'nature':
      case 'space':
      default: {
        // Deep calming meditative cosmic drone with twinkling stars
        const spaceFreqs = [110, 164.81, 220, 329.63];
        spaceFreqs.forEach((freq) => {
          if (!this.ctx || !this.musicGain) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, t);
          gain.gain.setValueAtTime(0.001, t);
          gain.gain.linearRampToValueAtTime(0.05, t + 2);
          osc.connect(gain);
          gain.connect(this.musicGain);
          osc.start(t);
          oscillators.push(osc);
          gains.push(gain);
        });

        const starNotes = [659.25, 783.99, 987.77, 1174.66, 1318.51];
        const intervalId = window.setInterval(() => {
          if (!this.ctx || !this.musicGain || this.isMusicMuted) return;
          const now = this.ctx.currentTime;
          const o = this.ctx.createOscillator();
          const g = this.ctx.createGain();
          const note = starNotes[Math.floor(Math.random() * starNotes.length)];
          o.type = 'sine';
          o.frequency.setValueAtTime(note, now);
          g.gain.setValueAtTime(0.03, now);
          g.gain.exponentialRampToValueAtTime(0.0001, now + 2.0);
          o.connect(g);
          g.connect(this.musicGain);
          o.start(now);
          o.stop(now + 2.0);
        }, 1400);

        this.ambienceNodes = { oscillators, gains, intervalId };
        break;
      }
    }
  }

  public async startMenuMusic() {
    this.initContext();
    if (!this.ctx || !this.musicGain || this.isMusicMuted) return false;

    // If menu music is already playing (custom buffer or synthetic ambience), keep playing seamlessly
    if (this.customMusicSource || (this.currentAmbienceType === 'retro80s' && this.ambienceNodes)) {
      return true;
    }

    // Check if custom menu.mp3 exists
    const paths = ['/sounds/menu.mp3', '/menu.mp3'];
    for (const path of paths) {
      if (this.audioBufferCache[path] === null) continue;
      try {
        let buffer = this.audioBufferCache[path];
        if (!buffer) {
          const res = await fetch(path);
          if (!res.ok) {
            this.audioBufferCache[path] = null;
            continue;
          }
          const arrayBuffer = await res.arrayBuffer();
          buffer = await this.ctx.decodeAudioData(arrayBuffer);
          this.audioBufferCache[path] = buffer;
        }

        if (buffer && this.ctx && this.musicGain) {
          this.stopCustomMusic();
          const src = this.ctx.createBufferSource();
          src.buffer = buffer;
          src.loop = true;
          src.connect(this.musicGain);
          src.start();
          this.customMusicSource = src;
          return true; // Successfully playing custom mp3
        }
      } catch {
        this.audioBufferCache[path] = null;
      }
    }

    // Fallback to synth ambient
    this.startAmbience('retro80s');
    return false;
  }

  public stopCustomMusic() {
    if (this.customMusicSource) {
      try {
        this.customMusicSource.stop();
        this.customMusicSource.disconnect();
      } catch {
        // ignore
      }
      this.customMusicSource = null;
    }
  }

  public stopAmbience() {
    this.stopCustomMusic();
    if (this.ambienceNodes) {
      if (this.ambienceNodes.intervalId) {
        clearInterval(this.ambienceNodes.intervalId);
      }
      if (this.ctx) {
        const t = this.ctx.currentTime;
        this.ambienceNodes.gains.forEach((g) => {
          try {
            g.gain.linearRampToValueAtTime(0.0001, t + 0.6);
          } catch {
            // ignore
          }
        });
        const nodesToStop = this.ambienceNodes;
        setTimeout(() => {
          nodesToStop?.oscillators.forEach((o) => {
            try {
              o.stop();
              o.disconnect();
            } catch {
              // ignore
            }
          });
        }, 700);
      }
      this.ambienceNodes = null;
    }
    this.currentAmbienceType = null;
  }
}

export const soundEngine = new SoundEngine();
