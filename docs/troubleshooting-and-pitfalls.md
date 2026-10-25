# Troubleshooting & CSS 3D Pitfalls

This document documents hard-earned architectural insights, browser quirks, 3D rendering traps, and edge-case resolutions discovered during the development of **Lumina & Form**.

---

## 1. The CSS `filter` 3D Context Flattening Trap

### Symptoms
When hovering over `.page-marker` index tabs, the tab would vanish completely, flicker invisibly, or clip through other 3D layers.

### Root Cause
According to the W3C CSS Transforms Module Level 2 specification, applying any CSS `filter` (e.g., `filter: brightness(1.15)` or `filter: drop-shadow(...)`) to an element with `transform-style: preserve-3d` forces the browser's compositing engine to **flatten the entire 3D subtree into a 2D composite surface** before applying the filter effect.
* Any child elements utilizing `backface-visibility: hidden` fail because the 2D surface has no backface.
* 3D Z-depth separation is destroyed, collapsing child elements into coplanar collision.

### The Fix
Never apply `filter` properties to any element in the 3D hierarchy. Achieve hover highlights and glowing tabs using standard CSS styling on individual face elements:
```css
/* BAD: Destroys 3D rendering context */
.page-marker:hover .marker-tab {
  filter: brightness(1.2) drop-shadow(0 0 10px gold);
}

/* GOOD: Preserves 3D pipeline */
.page-marker:hover .marker-face {
  border-color: var(--accent-gold-light);
  box-shadow: 0 0 12px var(--accent-gold-glow), 0 4px 14px rgba(0, 0, 0, 0.5);
  background: linear-gradient(135deg, #263140 0%, #171f2c 100%);
}
```

---

## 2. The Inverted Z-Axis on Flipped Sheets

### Symptoms
When closing the back cover (`#sheet-16`), the leather cover appeared to "sink" behind the flipped paper pages, rendering inner pages in front of the outside back cover.

### Root Cause
When an element rotates around the Y-axis by $-180^\circ$ (`rotateY(-180deg)`), its local coordinate system inverts:
* Normal orientation: $+Z$ points **towards the camera**.
* Flipped orientation: Local $+Z$ points **away from the camera and into the screen**.

Writing:
```css
/* BAD: translateZ(1px) pushes the flipped sheet AWAY from the camera */
.book.state-closed-back #sheet-16 {
  transform: rotateY(-180deg) translateZ(1px);
}
```
Because the translation happened *after* the $-180^\circ$ rotation, it pushed the back cover into $-1\text{px}$ camera depth—behind the inner pages ($+0.5\text{px}$).

### The Fix
Apply the world-space translation **before** the rotation:
```css
/* GOOD: Translates +2px towards camera in parent space, then rotates */
.book.state-closed-back #sheet-16 {
  z-index: 120 !important;
  transform: translate3d(0, 0, 2px) rotateY(-180deg);
}
```

---

## 3. Rapid Multi-Page Flip Race Conditions

### Symptoms
Clicking rapidly or jumping between distant sections caused leaves to reverse mid-air, overlap unnaturally, or freeze in mid-flight.

### Root Cause
1. **Rigid Boolean Lock (`isFlipping`)**: Blocked all input while a single 920ms transition completed, creating unresponsive UI.
2. **Global Timer Overwrites**: A single global timeout ID meant triggering a second flip overwrote the cleanup timer of the first, leaving the earlier sheet with an elevated in-flight z-index permanently.

### The Fix
Implement concurrent tracking:
1. **`flippingSheets = new Set()`**: Every sheet tracks its own in-flight status.
2. **`sheetTimeouts = new Map()`**: Each sheet has its own cancelable `setTimeout` ID.
3. **Ascending In-Flight Z-Index**: `sheet.style.zIndex = 100 + (++this.inFlightCounter)`, ensuring later turning leaves always fly visibly over earlier turning leaves.

---

## 4. Fore-Edge Marker Clipping by `.face` Overflow

### Symptoms
Page markers placed inside `.face` were cut off at the edge of the sheet and could not protrude outward into the stage.

### Root Cause
All `.face` elements require `overflow: hidden` to clip leather corner textures, embossed borders, and dynamic gradient overlays. Any element inside `.face` cannot escape its bounding box.

### The Fix
Attach `.page-marker` directly to `.page-sheet` (as a sibling to `.face`), because `.page-sheet` has `overflow: visible` and `transform-style: preserve-3d`. This allows markers to protrude at `right: -32px` and naturally rotate with the sheet.

---

## 5. Web Audio Context Autoplay Restrictions

### Symptoms
Audio synthesis fails silently with console warnings about suspended `AudioContext`.

### Root Cause
Browser security policies require a direct user gesture (`click`, `keydown`) before an `AudioContext` can produce sound.

### The Fix
Register one-time listeners on `window` to unlock the audio context on the user's very first interaction:
```javascript
const initAudioContext = () => {
  if (!this.audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) this.audioCtx = new AudioContextClass();
  } else if (this.audioCtx.state === 'suspended') {
    this.audioCtx.resume();
  }
};

window.addEventListener('click', initAudioContext, { once: true });
window.addEventListener('keydown', initAudioContext, { once: true });
```
