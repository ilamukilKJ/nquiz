// sound.js - Web Audio API cute sound effects synthesizer
// Zero external assets required, 100% reliable, zero latency!

class SoundManager {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.volume = 0.7;

    try {
      const saved = localStorage.getItem('quiz_sound_muted');
      if (saved !== null) {
        this.muted = saved === 'true';
      }
    } catch (e) {}
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setMuted(muted) {
    this.muted = muted;
    try {
      localStorage.setItem('quiz_sound_muted', String(muted));
    } catch (e) {}
  }

  toggleMute() {
    this.setMuted(!this.muted);
    if (!this.muted) {
      this.playPop();
    }
    return this.muted;
  }

  playPop(freq = 440, duration = 0.08) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq * 1.6, t);
      osc.frequency.exponentialRampToValueAtTime(freq, t + duration);

      gain.gain.setValueAtTime(this.volume * 0.35, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + duration);
    } catch (e) {}
  }

  playClick() {
    this.playPop(520, 0.05);
  }

  playTile() {
    this.playPop(620, 0.09);
  }

  playCorrect() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;
      const notes = [
        { f: 523.25, time: 0.00, dur: 0.16 },
        { f: 659.25, time: 0.08, dur: 0.18 },
        { f: 783.99, time: 0.16, dur: 0.22 },
        { f: 1046.50, time: 0.24, dur: 0.38 }
      ];

      notes.forEach(n => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = t + n.time;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.f, startTime);

        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(this.volume * 0.3, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + n.dur);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + n.dur);
      });
    } catch (e) {}
  }

  playWrong() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;
      const notes = [
        { f: 280, time: 0.00, dur: 0.14 },
        { f: 210, time: 0.12, dur: 0.22 }
      ];

      notes.forEach(n => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = t + n.time;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(n.f, startTime);
        osc.frequency.exponentialRampToValueAtTime(n.f * 0.88, startTime + n.dur);

        gain.gain.setValueAtTime(this.volume * 0.25, startTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + n.dur);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + n.dur);
      });
    } catch (e) {}
  }

  playVictory() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;
      const fanfare = [
        { f: 392.00, time: 0.00, dur: 0.14 },
        { f: 523.25, time: 0.12, dur: 0.14 },
        { f: 659.25, time: 0.24, dur: 0.16 },
        { f: 783.99, time: 0.38, dur: 0.28 },
        { f: 1046.50, time: 0.54, dur: 0.65 }
      ];

      fanfare.forEach(n => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = t + n.time;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.f, startTime);

        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(this.volume * 0.35, startTime + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + n.dur);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + n.dur);
      });
    } catch (e) {}
  }
}

export const soundManager = new SoundManager();
