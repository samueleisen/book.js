# Lighting Simulation & Procedural Audio Engine

This document details the illumination model and the Web Audio API synthesis engine powering the realistic tactility in **Lumina & Form**.

---

## 1. Physics-Based Lighting Simulation

A common shortcoming of basic CSS 3D books is that pages appear rigid and artificial, like rotating wooden planks. Real book pages exhibit subtle curvature into the binding spine, catch cast shadows from turning leaves, and darken as their angle relative to the light source changes.

### 1.1 Gutter Spine Shading (The Crease)
At the center binding, paper curves steeply into the gutter. This curvature is rendered using directional gradients on every page face:

```css
/* Right-hand page: spine is on the LEFT */
.right-spine {
  left: 0;
  width: 50px;
  background: linear-gradient(
    to right,
    rgba(0, 0, 0, 0.28) 0%,
    rgba(0, 0, 0, 0.10) 15%,
    rgba(0, 0, 0, 0.02) 40%,
    transparent 100%
  );
}

/* Left-hand page: spine is on the RIGHT */
.left-spine {
  right: 0;
  width: 50px;
  background: linear-gradient(
    to left,
    rgba(0, 0, 0, 0.28) 0%,
    rgba(0, 0, 0, 0.10) 15%,
    rgba(0, 0, 0, 0.02) 40%,
    transparent 100%
  );
}
```

### 1.2 Central Spine Groove
Between the left and right stacks, a dedicated `.book-spine-crease` element creates physical depth:
```css
.book-spine-crease {
  position: absolute;
  top: 0;
  left: calc(50% - 4px);
  width: 8px;
  height: 100%;
  background: linear-gradient(
    to right,
    rgba(0, 0, 0, 0.45),
    rgba(20, 20, 20, 0.15) 50%,
    rgba(0, 0, 0, 0.45)
  );
  z-index: 5;
}
```

### 1.3 Dynamic Flip Shadow Overlay
As a page turns from $0^\circ$ to $-180^\circ$:
1. **$0^\circ \to -90^\circ$ (Lift-off)**: The front face tilts away from the viewer. The overlay ramps to $0.38$ opacity over the first $45\%$ of the flip duration.
2. **$-90^\circ \to -180^\circ$ (Touchdown)**: The back face enters the scene darkened at $0.38$ opacity, gradually fading to transparent ($0.0$) as it lands flush onto the left pile.

```
Front Face Opacity: 0.00 ───▲ (peaks at ~90°) ───► 0.00 (hidden)
Back Face Opacity:  (hidden) ───► 0.38 ───────────▼ 0.00 (lands)
Timeline:           0ms        450ms              920ms
```

### 1.4 Ambient Desk Occlusion Shadow
Beneath the book, `.book-desk-shadow` simulates ambient light occlusion on the table surface. As the book shifts between closed and open states, the desk shadow morphs in real time:
- **Full Spread (Open)**: Elliptical shadow width $780\text{px}$, centered beneath the spine.
- **Closed Front**: Scales down (`scaleX(0.55)`) and shifts right (`+95px`) under the front cover.
- **Closed Back**: Scales down (`scaleX(0.55)`) and shifts left (`-95px`) under the back cover.

---

## 2. Procedural Audio Engine (`BookAudio`)

Rather than relying on static MP3 or WAV audio recordings—which add HTTP latency, increase bundle weight, and can suffer from browser decode lag—the audio engine generates **100% synthesized physical paper sounds** via the browser's built-in **Web Audio API**.

### 2.1 The Audio Synthesis Graph

```
 [ White Noise Buffer ] ──► [ BiquadFilter (Bandpass) ] ──► [ GainNode (Decay) ] ──┐
                                                                                  ├──► [ Destination (Speakers) ]
 [ Sine Oscillator (Woosh) ] ─────────────────────────────► [ GainNode (Decay) ] ──┘
```

### 2.2 Paper Friction Synthesis (White Noise)
Paper friction consists of millions of microscopic fiber interactions. This is simulated by generating a buffer of uniform white noise:
```javascript
const bufferSize = Math.floor(ctx.sampleRate * 0.18); // 180ms
const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
const output = buffer.getChannelData(0);
for (let i = 0; i < bufferSize; i++) {
  output[i] = (Math.random() * 2 - 1) * 0.7;
}
```

### 2.3 Paper Resonance Filtering (Bandpass)
Raw white noise sounds like static television. Passing it through a narrow **Bandpass Filter** isolates the characteristic resonant frequencies of heavy book vellum:
- **Forward Flip Center Frequency**: Starts at $2100\text{Hz}$, ramping down to $1400\text{Hz}$.
- **Backward Flip Center Frequency**: Starts at $1850\text{Hz}$, ramping down to $1400\text{Hz}$.
- **Quality Factor ($Q$)**: $1.8$ (sharp resonance).

```javascript
const filter = ctx.createBiquadFilter();
filter.type = 'bandpass';
filter.frequency.setValueAtTime(centerFreq, now);
filter.frequency.exponentialRampToValueAtTime(1400, now + 0.16);
filter.Q.setValueAtTime(1.8, now);
```

### 2.4 Tactile Volume Envelope
The volume follows a natural percussive envelope:
- **Attack Phase ($25\text{ms}$)**: Quick ramp from silence ($0.001$) to peak amplitude ($0.24$).
- **Decay Phase ($145\text{ms}$)**: Smooth exponential decay back to silence ($0.001$).

### 2.5 Air Displacement Oscillator (Low-End Woosh)
As a large page moves quickly through the air, it displaces air mass. A sub-audible low-frequency sine sweep adds tactile weight:
```javascript
const osc = ctx.createOscillator();
osc.type = 'sine';
osc.frequency.setValueAtTime(160, now);
osc.frequency.exponentialRampToValueAtTime(65, now + 0.15); // 160Hz -> 65Hz
```

### 2.6 Autoplay Policy Compliance
Modern web browsers block audio playback until the user has performed an explicit interaction with the document. `BookAudio` registers one-time lightweight window listeners on `click` and `keydown` to resume or initialize the `AudioContext` without triggering console warnings or playback interruptions.
