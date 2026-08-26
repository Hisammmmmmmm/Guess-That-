const fs = require('fs');
let code = fs.readFileSync('src/services/soundEngine.ts', 'utf8');

// Inject the audioBufferCache and playSoundFileOrFallback method
const injection = `
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
`;

code = code.replace('private isMusicMuted = false;', 'private isMusicMuted = false;' + injection);

code = code.replace(/public playClick\(\) \{[\s\S]*?osc\.stop\(t \+ 0\.08\);\n  \}/, `public playClick() {
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
  }`);

code = code.replace(/public playHover\(\) \{[\s\S]*?osc\.stop\(t \+ 0\.03\);\n  \}/, `public playHover() {
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
  }`);

code = code.replace(/public playCountdownTick\(isUrgent: boolean = false\) \{[\s\S]*?osc\.stop\(t \+ \(isUrgent \? 0\.09 : 0\.05\)\);\n  \}/, `public playCountdownTick(isUrgent: boolean = false) {
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
  }`);

code = code.replace(/public playCorrect\(\) \{[\s\S]*?\}\);\n  \}/, `public playCorrect() {
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
  }`);

code = code.replace(/public playWrong\(\) \{[\s\S]*?\}\);\n  \}/, `public playWrong() {
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
  }`);

// Make retro80s more dynamic
const newRetro80s = `
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
`;

code = code.replace(/case 'retro80s':[\s\S]*?break;\n      \}/, newRetro80s.trim());

fs.writeFileSync('src/services/soundEngine.ts', code);
