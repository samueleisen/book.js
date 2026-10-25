# Fore-Edge 3D Page Markers (Index Tabs)

This document specifies the technical design, geometry, 3D typography, interaction model, and CSS 3D context preservation for the **Fore-Edge Page Markers** (interactive index tabs) in **Lumina & Form**.

---

## 1. Physical Concept & Placement

In fine bookbinding, fore-edge index tabs project beyond the outer vertical cut of the text block to provide instant navigation to major divisions.

```
       Spine (0px)                     Fore-Edge (380px)
        |                                       |
        +---------------------------------------+----[ TITL ] (right: -32px)
        |                                       |
        |               PAGE SHEET              |----[ PROL ]
        |                                       |
        |                                       |----[ CH.I ]
        |                                       |
        +---------------------------------------+
```

### Protrusion Geometry
* **Leaf Width**: `--page-width: 380px`
* **Tab Dimensions**: `width: 32px`, `height: 44px`
* **Static Position**: `right: -32px` (extends 32px past the sheet's outer edge into the open stage)
* **Vertical Positioning**: Configurable per marker via `--marker-top` CSS variable (e.g., `130px`, `190px`, `250px`, `310px`, `370px`).

---

## 2. Upright Double-Sided Typography in 3D Space

When a sheet flips $-180^\circ$ from the right stack over to the left stack, all child elements undergo a physical mirror inversion in 3D space. Plain text would display backwards (mirrored).

### Dual-Face Architecture
Each `.page-marker` houses two discrete 3D backface-hidden surfaces:

```html
<div class="page-marker" data-target-page="13" style="--marker-top: 130px;">
  <div class="marker-tab">
    <!-- Front Face (visible on right stack) -->
    <div class="marker-face marker-front">
      <span class="marker-icon">❧</span>
      <span class="marker-text">TITL</span>
    </div>
    <!-- Back Face (visible on left stack) -->
    <div class="marker-face marker-back">
      <span class="marker-icon">❧</span>
      <span class="marker-text">TITL</span>
    </div>
  </div>
</div>
```

### Transform Math
```css
.marker-face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

/* Front Face: Facing viewer when sheet is on right stack */
.marker-face.marker-front {
  border-left: none;
  border-radius: 0 5px 5px 0;
  transform: translateZ(1px);
}

/* Back Face: Rotated 180deg to face viewer upright when sheet is flipped */
.marker-face.marker-back {
  border-right: none;
  border-radius: 5px 0 0 5px;
  transform: rotateY(180deg) translateZ(1px);
}
```

1. **When Sheet is on Right Stack ($0^\circ$)**:
   * `.marker-front` faces the camera at $0^\circ$ ($+1\text{px}$ Z). Visible and upright.
   * `.marker-back` is facing away at $+180^\circ$. Culled by `backface-visibility: hidden`.
2. **When Sheet Flips to Left Stack ($-180^\circ$)**:
   * The parent sheet rotates by $-180^\circ$.
   * `.marker-front` rotates $-180^\circ$ (now facing backwards). Culled.
   * `.marker-back` had a local rotation of $+180^\circ$. Net world rotation:
     $$\Theta_{world} = -180^\circ + 180^\circ = 0^\circ$$
   * Result: `.marker-back` faces the viewer **completely upright and un-mirrored** on the left stack!

---

## 3. The CSS `filter` 3D-Flattening Trap

> [!CAUTION]
> **Critical Browser Bug / Spec Behavior**:
> Applying any CSS `filter` (such as `filter: brightness(1.15)` or `filter: drop-shadow(...)`) to an element that has or contains `transform-style: preserve-3d` forces the browser's composite engine to **flatten the entire 3D subtree into a 2D bitmap layer**.
>
> When flattened:
> - `backface-visibility: hidden` stops functioning properly.
> - Elements separated along the Z-axis collide into a single 2D plane.
> - On hover, child faces vanish completely or flicker invisibly!

### The Correct Implementation
Never apply `filter` to `.page-marker` or `.marker-tab`. Apply visual lighting and hover glow directly to individual `.marker-face` elements using pure CSS properties (`border-color`, `box-shadow`, `background` gradients):

```css
/* CORRECT: Preserves 3D pipeline without context flattening */
.page-marker:hover .marker-face {
  border-color: var(--accent-gold-light);
  box-shadow: 0 0 12px var(--accent-gold-glow), 0 4px 14px rgba(0, 0, 0, 0.5);
  background: linear-gradient(135deg, #263140 0%, #171f2c 100%);
}
```

---

## 4. Stacking Order & Cover Overhang

Page markers must interact cleanly with the hardcover casing:

1. **Resting Inside Sheet**: `.page-marker { z-index: 16; }`
   * Renders above sheet fold hints (`z-index: 15`) and lighting overlays (`z-index: 10`).
2. **On Hover**: `.page-marker:hover { z-index: 24; }`
   * Pops forward over neighboring tabs on the same stack.
3. **Cover Dominance**:
   * When closed, `#sheet-0` and `#sheet-29` have `z-index: 120 !important;` and `transform: translate3d(0, 0, 2px)`.
   * With `--cover-overhang: 16px`, the cover board is 396px wide, while paper sheets are 380px.
   * Tabs extend to $380 + 32 = 412\text{px}$.
   * Therefore, $412 - 396 = 16\text{px}$ of each tab protrudes cleanly beyond the leather cover board when closed.

---

## 5. Interaction & Event Delegation

Tab interactions are bound via delegated click listener in `js/ui.js`:

```javascript
bookEl.addEventListener('click', (e) => {
  const marker = e.target.closest('.page-marker');
  if (!marker) return;

  const parentSheet = marker.closest('.page-sheet');
  if (this.engine.flippingSheets && this.engine.flippingSheets.has(parentSheet)) {
    return; // Guard: Ignore clicks while leaf is in-flight
  }

  e.stopPropagation();
  e.preventDefault();

  const targetPage = parseInt(marker.getAttribute('data-target-page'), 10);
  if (!isNaN(targetPage)) {
    if (this.audio) this.audio.playFlipSound(targetPage > this.engine.currentLocation ? 'forward' : 'backward');
    this.engine.goToLocation(targetPage);
  }
});
```

### Active Marker State Highlighting
When the book reaches a section, `BookUI.render(location)` toggles the `.active` class:
```javascript
const markers = document.querySelectorAll('.page-marker');
markers.forEach(marker => {
  const targetPage = parseInt(marker.getAttribute('data-target-page'), 10);
  if (targetPage === location || (location > 0 && targetPage === location - 1)) {
    marker.classList.add('active');
  } else {
    marker.classList.remove('active');
  }
});
```
Active markers display a brilliant gold accent border and ambient glow (`--accent-gold`).
