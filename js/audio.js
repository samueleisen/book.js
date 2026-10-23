/**
 * LUMINA & FORM — AUDIO SYNTHESIZER
 * Procedural paper flick and page rustle synthesis via Web Audio API.
 * 100% offline, zero external audio assets.
 */

export class BookAudio {
  constructor() {
    this.audioCtx = null;
    this.soundEnabled = true;
    this.setupUserGestureListener();
  }

  setupUserGestureListener() {
    const initAudioContext = () => {
      if (!this.audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
          this.audioCtx = new AudioContextClass();
        }
      } else if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
    };

    window.addEventListener('click', initAudioContext, { once: true });
    window.addEventListener('keydown', initAudioContext, { once: true });
  }

  playFlipSound(direction = 'forward') {
    if (!this.soundEnabled || !this.audioCtx) return;

    try {
      const ctx = this.audioCtx;
      const now = ctx.currentTime;

      // 1. White noise generator for paper friction
      const bufferSize = Math.floor(ctx.sampleRate * 0.18); // 180ms
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.7;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      // 2. Bandpass filter to isolate paper frequency (1200Hz - 2800Hz)
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      const centerFreq = direction === 'forward' ? 2100 : 1850;
      filter.frequency.setValueAtTime(centerFreq, now);
      filter.frequency.exponentialRampToValueAtTime(1400, now + 0.16);
      filter.Q.setValueAtTime(1.8, now);

      // 3. Gain envelope (attack & smooth exponential decay)
      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0.001, now);
      gainNode.gain.linearRampToValueAtTime(0.24, now + 0.025);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.17);

      // 4. Subtle low-frequency woosh (simulates air displacement of page sheet)
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(65, now + 0.15);
      oscGain.gain.setValueAtTime(0.001, now);
      oscGain.gain.linearRampToValueAtTime(0.12, now + 0.02);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      // Connect noise path
      whiteNoise.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      // Connect air woosh path
      osc.connect(oscGain);
      oscGain.connect(ctx.destination);

      // Fire audio nodes
      whiteNoise.start(now);
      whiteNoise.stop(now + 0.18);
      osc.start(now);
      osc.stop(now + 0.16);
    } catch (e) {
      // Audio playback fails silently if restricted
    }
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    return this.soundEnabled;
  }

  setSoundEnabled(enabled) {
    this.soundEnabled = !!enabled;
  }
}
