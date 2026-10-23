# API Reference Specification

This document provides the complete API specification for all classes, methods, parameters, and properties in the **Lumina & Form** JavaScript engine.

---

## 1. Class: `BookApp` (`js/main.js`)

The top-level application coordinator.

### Properties
| Property | Type | Description |
| :--- | :--- | :--- |
| `bookElement` | `HTMLElement` | Reference to `<div class="book" id="book">`. |
| `sheets` | `NodeListOf<HTMLElement>` | Collection of all `.page-sheet` elements. |
| `audio` | `BookAudio` | Instance of the procedural audio synthesis engine. |
| `engine` | `FlipEngine` | Instance of the core 3D flip physics engine. |
| `responsive` | `BookResponsive` | Instance of the responsive viewport auto-scaler. |
| `ui` | `BookUI` | Instance of the UI controls and keyboard binder. |

### Global Accessors
- `window.bookApp`: Primary reference to the `BookApp` instance.
- `window.bookInstance`: Alias pointing directly to `window.bookApp.engine`.

---

## 2. Class: `FlipEngine` (`js/flip-engine.js`)

Manages spatial 3D state, rotation classes, z-index hierarchy, and face shading.

### Constructor
```javascript
new FlipEngine({
  bookElement,
  sheets,
  audio = null,
  flipDuration = 920,
  onChange = null
});
```
- `bookElement` (`HTMLElement`, required): The master `.book` container.
- `sheets` (`Array<HTMLElement> | NodeList`, required): Array of all `.page-sheet` elements.
- `audio` (`BookAudio`, optional): Audio instance to receive flip cues.
- `flipDuration` (`number`, optional): Flip transition duration in milliseconds (defaults to `920`).
- `onChange` (`Function(newLocation)`, optional): Callback fired whenever spread location changes.

### Properties
| Property | Type | Description |
| :--- | :--- | :--- |
| `currentLocation` | `number` | Index of the active spread ($0 \dots \text{maxLocation}$). |
| `totalSheets` | `number` | Total count of `.page-sheet` elements ($N$). |
| `maxLocation` | `number` | Maximum reachable location ($N$). |
| `isFlipping` | `boolean` | Lock flag preventing overlapping animations during a turn. |
| `flipDuration` | `number` | Transition time in milliseconds. |

### Methods

#### `flipForward(): boolean`
Turns the current right-hand sheet to the left.
- **Returns**: `true` if flip initiated; `false` if already at the back cover or currently flipping.

#### `flipBackward(): boolean`
Turns the current left-hand sheet back to the right.
- **Returns**: `true` if flip initiated; `false` if already at the front cover or currently flipping.

#### `goToLocation(targetLocation: number): void`
Navigates to an arbitrary location ($0 \le \text{target} \le \text{maxLocation}$).
- If adjacent ($|\Delta| = 1$), triggers standard smooth animation.
- If multiple pages away, executes a rapid cascade flip with dynamically compressed intervals.

#### `updateZIndices(): void`
Recalculates resting stacking order across both piles:
- Left pile ($i < \text{currentLocation}$): `zIndex = i + 1`
- Right pile ($i \ge \text{currentLocation}$): `zIndex = totalSheets - i`

#### `updateBookCentering(): void`
Toggles `.state-closed-front`, `.state-open`, or `.state-closed-back` on `.book` to center the visible pages.

#### `updatePointerEvents(): void`
Sets `pointer-events: auto` exclusively on the visible top pages of the left and right stacks, disabling click capture on covered pages.

---

## 3. Class: `BookAudio` (`js/audio.js`)

Procedural paper flick sound synthesizer using the Web Audio API.

### Properties
| Property | Type | Description |
| :--- | :--- | :--- |
| `audioCtx` | `AudioContext` | Internal Web Audio context (initialized lazily). |
| `soundEnabled` | `boolean` | Mute toggle state (defaults to `true`). |

### Methods

#### `playFlipSound(direction = 'forward'): void`
Synthesizes a realistic paper flick sound:
- Generates an $180\text{ms}$ buffer of white noise.
- Passes buffer through a resonant Biquad Bandpass filter ($2100\text{Hz}$ forward, $1850\text{Hz}$ backward).
- Applies a $25\text{ms}$ attack and $145\text{ms}$ exponential decay envelope.
- Sweeps a sub-bass sine oscillator ($160\text{Hz} \to 65\text{Hz}$) for air displacement.

#### `toggleSound(): boolean`
Inverts audio mute state and returns the new `soundEnabled` value.

#### `setSoundEnabled(enabled: boolean): void`
Sets audio playback state explicitly.

---

## 4. Class: `BookUI` (`js/ui.js`)

Controls user interaction, DOM widgets, and input events.

### Constructor
```javascript
new BookUI({ engine, audio });
```

### Methods

#### `render(location: number): void`
Updates UI controls to reflect the given location:
- Disables navigation buttons at boundary conditions.
- Updates the location badge (`Cover`, `Chapter I`, etc.).
- Updates sheet counters (`Sheet X of Y`).
- Syncs the scrub range slider value.
- Highlights active entry in the Table of Contents.

#### `openTOC(): void`
Slides open the Table of Contents drawer.

#### `closeTOC(): void`
Slides shut the Table of Contents drawer.

#### `toggleAutoPlay(): void`
Toggles automatic page turning loop ($3.4\text{s}$ interval).

---

## 5. Class: `BookResponsive` (`js/responsive.js`)

Maintains proportional scaling across viewport sizes.

### Constructor
```javascript
new BookResponsive({ targetWidth = 840, targetHeight = 640 });
```

### Methods

#### `updateScale(): void`
Calculates optimal scale ratio based on available window dimensions:
$$\text{Scale} = \min\left(1.05, \max\left(0.48, \min\left(\frac{W \times 0.92}{840}, \frac{H \times 0.72}{640}\right)\right)\right)$$
Sets the computed value on `:root` as `--book-scale`.
