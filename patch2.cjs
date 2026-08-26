const fs = require('fs');
let code = fs.readFileSync('src/services/soundEngine.ts', 'utf8');

code = code.replace(/public playStreak\(streakCount: number\) \{[\s\S]*?\}\);\n  \}/, `public playStreak(streakCount: number) {
    this.initContext();
    this.playSoundFileOrFallback(\`streak\${Math.min(streakCount, 5)}.mp3\`, () => {
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
  }`);

fs.writeFileSync('src/services/soundEngine.ts', code);
