# Customization & Extension Guide

This guide provides practical recipes and step-by-step instructions for customizing the **Lumina & Form** workspace to fit your own publications, catalogues, or presentations.

---

## Recipe 1: Adding a New Page Sheet

Adding pages to the book is straightforward. Each physical leaf represents one `.page-sheet` element containing a `.face.front` and a `.face.back`.

### Step 1: Add HTML in `index.html`
Place the new `.page-sheet` inside `<div class="book" id="book">`, maintaining sequential `data-sheet` numbering:

```html
<!-- SHEET 5: NEW CHAPTER -->
<div class="page-sheet" data-sheet="5" id="sheet-5">
  <!-- Front Face (Right page when opening this spread) -->
  <div class="face front face-paper">
    <div class="paper-content editorial-page-layout">
      <div class="running-head">
        <span class="running-head-left">CHAPTER III</span>
        <span class="running-head-center">NEW TITLE</span>
      </div>
      <div class="body-text">
        <p>Your custom content goes here...</p>
      </div>
      <div class="page-footer">
        <span class="folio-num">9</span>
      </div>
    </div>
    <div class="spine-shading right-spine"></div>
    <div class="corner-fold-hint right-hint"><span class="fold-triangle"></span></div>
    <div class="face-lighting-overlay"></div>
  </div>

  <!-- Back Face (Left page when turning to next spread) -->
  <div class="face back face-paper">
    <div class="paper-content editorial-page-layout">
      <div class="running-head">
        <span class="running-head-center">CONTINUED</span>
      </div>
      <div class="body-text">
        <p>Page content continues here...</p>
      </div>
      <div class="page-footer">
        <span class="folio-num">10</span>
      </div>
    </div>
    <div class="spine-shading left-spine"></div>
    <div class="corner-fold-hint left-hint"><span class="fold-triangle"></span></div>
    <div class="face-lighting-overlay"></div>
  </div>
</div>
```

### Step 2: Update Scrubber Slider Max in `index.html`
Update the `max` attribute on `#pageSlider` to match the new total number of sheets:
```html
<input type="range" id="pageSlider" min="0" max="7" value="0" step="1">
```

### Step 3: Add Table of Contents Entry
Add a corresponding `<li>` to `#tocList`:
```html
<li data-target-page="5">
  <span>Chapter III: New Title</span>
  <span class="toc-pg">9</span>
</li>
```

### Step 4: Update `spreadNames` in `js/ui.js`
Open `js/ui.js` and add the new spread's title to `this.spreadNames`:
```javascript
this.spreadNames = [
  'Cover',
  'Title • Ex Libris',
  'Prologue • Study',
  'Chapter I: Memory',
  'Chapter II: Space',
  'Chapter III: New Title', // <-- New Spread Added Here
  'Epilogue • Finis',
  'Back Cover'
];
```

---

## Recipe 2: Changing Book Dimensions

All geometric calculations derive from CSS custom properties in `css/variables.css`.

### Step 1: Adjust Variables in `css/variables.css`
```css
:root {
  /* For a square folio edition */
  --book-width: 800px;
  --page-width: 400px;  /* Always exactly half of --book-width */
  --book-height: 600px;
}
```

### Step 2: Update Centering Offsets in `css/book-3d.css`
When the book is closed, it shifts by half of `--page-width` ($200\text{px}$):
```css
.book.state-closed-front {
  transform: scale(var(--book-scale)) translateX(-200px); /* -page-width / 2 */
}

.book.state-closed-back {
  transform: scale(var(--book-scale)) translateX(200px);  /* +page-width / 2 */
}
```

---

## Recipe 3: Customizing the Visual Theme

### Leather Cover & Foil Colors
In `css/variables.css`:
```css
:root {
  /* Rich Emerald & Bronze Foil Theme */
  --cover-leather: #0d261d;
  --cover-border: #c49a45;
  --cover-foil: #e8c87b;
  
  /* Vintage Parchment Paper */
  --paper-cream: #f4ede1;
  --paper-text: #2c251f;
  --paper-accent: #1e4a38;
}
```

### Swapping Typography
Fonts are configured in `index.html` and referenced in `css/variables.css`:
```css
:root {
  --font-serif: 'EB Garamond', serif;
  --font-display: 'Playfair Display', serif;
  --font-sans: 'Inter', sans-serif;
}
```

---

## Recipe 4: Programmatic Control via JavaScript API

The engine is globally accessible via `window.bookApp`:

```javascript
// Flip to next page spread
window.bookApp.engine.flipForward();

// Flip to previous page spread
window.bookApp.engine.flipBackward();

// Jump directly to Spread 3
window.bookApp.engine.goToLocation(3);

// Read current location (0 = Cover, maxLocation = Back Cover)
console.log(window.bookApp.engine.currentLocation);

// Toggle sound synthesis on/off
const isSoundOn = window.bookApp.audio.toggleSound();
console.log('Audio enabled:', isSoundOn);

// Listen to page turns
window.bookApp.engine.onChange = (newLocation) => {
  console.log('User turned to spread:', newLocation);
};
```

---

## Recipe 5: Handling Single Page Mode on Mobile Devices

The responsive controller (`js/responsive.js`) scales the book smoothly across screen resolutions. For ultra-compact screens, you can adjust the minimum scale floor in `js/responsive.js`:

```javascript
// Allow deeper reduction on narrow mobile displays
if (finalScale < 0.38) finalScale = 0.38;
```
