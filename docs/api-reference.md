# API Reference Specification

This document provides a complete technical reference for all JavaScript classes, methods, properties, and runtime hooks in **Lumina & Form**.

---

## 1. Class: `BookApp` (`js/main.js`)

The top-level application coordinator that instantiates singletons and binds system components together.

### Constructor
```javascript
new BookApp()
```
* **Properties**:
  * `bookElement` (`HTMLElement`): Reference to `#book`.
  * `sheets` (`NodeList`): Array-like collection of `.page-sheet` elements.
  * `audio` (`BookAudio`): Audio synthesizer instance.
  * `responsive` (`BookResponsive`): Viewport auto-scaler instance.
  * `engine` (`FlipEngine`): 3D page flip engine instance.
  * `ui` (`BookUI`): UI controller instance.

---

## 2. Class: `FlipEngine` (`js/flip-engine.js`)

Core 3D transformation controller managing leaf rotation, concurrent in-flight flip sets, and dynamic mathematical z-index scheduling.

### Constructor Options
```javascript
new FlipEngine({
  bookElement,            // HTMLElement: Master .book container
  sheets,                 // NodeList | HTMLElement[]: All .page-sheet leaves
  audio = null,           // BookAudio instance (optional)
  flipDuration = 920,     // Number: Transition duration in ms (default 920)
  onChange = null         // Function: Callback invoked with new location index
})
```

### Public Properties
| Property | Type | Description |
| :--- | :--- | :--- |
| `currentLocation` | `number` | Integer index representing the active spread ($0 \le \text{location} \le \text{maxLocation}$). |
| `totalSheets` | `number` | Total count of `.page-sheet` elements (30). |
| `maxLocation` | `number` | Maximum reachable location index (equals `totalSheets` = 30). |
| `isFlipping` | `boolean` | Read-only getter; `true` if any sheets are currently in mid-air (`flippingSheets.size > 0`). |
| `flippingSheets` | `Set<HTMLElement>` | Set tracking all sheets actively rotating in 3D space. |
| `sheetTimeouts` | `Map<HTMLElement, number>`| Map storing active settle timer IDs for in-flight sheets. |
| `cascadeInterval` | `number \| null` | Timer ID for multi-page jump cascades. |

### Public Methods

#### `flipForward(): boolean`
Turns the current right-hand sheet forward by 1 step.
* Returns `false` if already at `maxLocation` (back cover closed).
* Elevates the leaf's z-index (`100 + inFlightCounter`), animates dynamic shadow overlays, triggers Web Audio synthesis, and schedules resting settle order.

#### `flipBackward(): boolean`
Turns the current left-hand sheet backward by 1 step.
* Returns `false` if already at `0` (front cover closed).

#### `goToLocation(targetLocation: number): void`
Animates a rapid non-blocking multi-page cascade to `targetLocation`.
* Automatically cancels any active cascade interval.
* If distance is 1, delegates directly to `flipForward()` or `flipBackward()`.
* If distance $> 1$, executes a rapid step cascade at `Math.max(70, Math.floor(350 / distance))` ms per leaf.

#### `updateZIndices(): void`
Recalculates resting stacking order for all sheets on left and right stacks.
* Skips any sheet currently inside `this.flippingSheets`.
* Left stack ($i < \text{currentLocation}$): `zIndex = index + 1`.
* Right stack ($i \ge \text{currentLocation}$): `zIndex = totalSheets - index`.

#### `updateBookCentering(): void`
Synchronizes the `.book` CSS state class based on `currentLocation`:
* `0`: Adds `.state-closed-front`
* `maxLocation`: Adds `.state-closed-back`
* Otherwise: Adds `.state-open`

#### `updatePointerEvents(): void`
Enables `pointer-events: auto` for active surface leaves and disables it for buried inner leaves to prevent unintended clicks.

---

## 3. Class: `BookAudio` (`js/audio.js`)

Procedural paper flick and rustle synthesizer powered by the Web Audio API.

### Public Methods

#### `playFlipSound(direction: 'forward' | 'backward' = 'forward'): void`
Synthesizes a realistic paper turn sound:
* Generates an 180ms white-noise friction burst.
* Applies a bandpass filter (sweeping 2100Hz -> 1400Hz forward, or 1850Hz -> 1400Hz backward).
* Adds a subtle 160Hz -> 65Hz sine wave air displacement woosh.

#### `toggleSound(): boolean`
Toggles `soundEnabled` and returns the new boolean state.

#### `setSoundEnabled(enabled: boolean): void`
Explicitly sets whether audio synthesis is enabled.

---

## 4. Class: `BookResponsive` (`js/responsive.js`)

Calculates and injects the `--book-scale` CSS variable to fit the 3D book to the user's viewport without clipping.

### Constructor Options
```javascript
new BookResponsive({
  targetWidth = 840,    // Number: Base book width + clearance
  targetHeight = 600,   // Number: Base book height + clearance
  zoom = 1.15,          // Number: Default zoom multiplier
  minScale = 0.55,      // Number: Minimum scale clamp
  maxScale = 2.50       // Number: Maximum scale clamp
})
```

### Public Methods

#### `updateScale(): void`
Measures `window.innerWidth` and `window.innerHeight`, calculates fit scale, multiplies by `this.zoom`, clamps within `[minScale, maxScale]`, and sets `--book-scale` on `document.documentElement`.

#### `setZoom(newZoom: number): void`
Updates `this.zoom` and immediately invokes `updateScale()`.

---

## 5. Class: `BookUI` (`js/ui.js`)

Manages interaction bindings, cover cascade opening, keyboard shortcuts, and page marker active states.

### Public Methods

#### `getTitlePageLocation(): number`
Dynamically inspects the DOM for `#page-title`'s parent sheet and returns its integer sheet index (default `13`).

#### `handleForward(): void`
Executed on right page clicks, next stage button clicks, or ArrowRight/Space keys:
* If at closed front cover (`currentLocation === 0`), triggers `goToLocation(13)` to cascade to the Title Page.
* Otherwise, turns one page forward via `flipForward()`.

#### `render(location: number): void`
Updates stage arrow disabled states and toggles the `.active` class on `.page-marker` elements corresponding to the current spread.

---

## 6. Global Developer Debugging Hooks

The application attaches primary controller instances directly to the `window` namespace:

```javascript
window.bookApp          // Complete BookApp instance
window.bookInstance     // Alias to BookApp.engine (FlipEngine)
```

### Console Debugging Snippets
```javascript
// Check current location and state
console.log(window.bookApp.engine.currentLocation);

// Jump directly to Chapter I
window.bookApp.engine.goToLocation(15);

// Turn off sound
window.bookApp.audio.setSoundEnabled(false);

// Zoom in to 1.35x
window.bookApp.responsive.setZoom(1.35);
```
