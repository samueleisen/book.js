# Customization & Extension Cookbook

This guide provides practical, step-by-step instructions for customizing the **Lumina & Form** book, including adding or removing pages, attaching fore-edge markers, modifying dimensions, adjusting typography, and styling themes.

---

## 1. Adding a New Page Sheet

Each page sheet in `index.html` represents a physical leaf with two faces (Front and Back).

### Step 1: Add HTML Markup
Insert the new `.page-sheet` element within `.book`. Ensure sequential `data-sheet` indexing:

```html
<div class="page-sheet" data-sheet="17" id="sheet-17">
  <!-- Front Face (Right page when spread is reached) -->
  <div class="face front face-paper" id="page-new-chapter">
    <div class="paper-content editorial-page-layout">
      <div class="running-head">
        <span class="running-head-left">CHAPTER III</span>
        <span class="running-head-center">LUMINA &amp; FORM</span>
      </div>
      <div class="body-text">
        <p class="lead-paragraph">
          <span class="drop-cap">A</span>rchitectural space begins not with materials, but with void.
        </p>
        <p>Your chapter body content goes here...</p>
      </div>
      <div class="page-footer">
        <span class="folio-num">7</span>
      </div>
    </div>
    <div class="spine-shading right-spine"></div>
    <div class="corner-fold-hint right-hint" title="Next page">
      <span class="fold-triangle"></span>
    </div>
    <div class="face-lighting-overlay"></div>
  </div>

  <!-- Back Face (Left page when next leaf is turned) -->
  <div class="face back face-paper">
    <div class="paper-content blank-page-layout"></div>
    <div class="spine-shading left-spine"></div>
    <div class="corner-fold-hint left-hint" title="Previous page">
      <span class="fold-triangle"></span>
    </div>
    <div class="face-lighting-overlay"></div>
  </div>
</div>
```

### Step 2: Update Sequential Sheet Numbers
If you insert a sheet into the middle of the book, increment the `data-sheet` attributes and `id="sheet-N"` IDs for all subsequent sheets up to the back cover.

> [!NOTE]
> `FlipEngine` automatically queries all `.page-sheet` elements via `querySelectorAll('.page-sheet')` on startup. You do not need to update any hardcoded sheet count in JavaScript!

---

## 2. Attaching a Fore-Edge Page Marker (Index Tab)

To attach an interactive 3D index tab to any sheet:

### Step 1: Add the `.page-marker` Element
Place the `.page-marker` element directly inside the `.page-sheet` container (not inside `.face`):

```html
<div class="page-marker" data-target-page="17" style="--marker-top: 370px;" title="Jump to Epilogue">
  <div class="marker-tab">
    <!-- Front Face (Right Stack) -->
    <div class="marker-face marker-front">
      <span class="marker-icon">✦</span>
      <span class="marker-text">EPIL</span>
    </div>
    <!-- Back Face (Left Stack - Flipped) -->
    <div class="marker-face marker-back">
      <span class="marker-icon">✦</span>
      <span class="marker-text">EPIL</span>
    </div>
  </div>
</div>
```

### Guidelines for Markers
* **`data-target-page`**: Set to the sheet index you want the book to flip to when clicked.
* **`--marker-top`**: Space tabs at 60px increments to avoid vertical overlaps:
  * Tab 1: `--marker-top: 130px;` (TITL)
  * Tab 2: `--marker-top: 190px;` (PROL)
  * Tab 3: `--marker-top: 250px;` (CH.I)
  * Tab 4: `--marker-top: 310px;` (CH.II)
  * Tab 5: `--marker-top: 370px;` (EPIL)
* **Text Length**: Keep tab labels to 4 uppercase characters (`TITL`, `PROL`, `CH.I`, `CH.II`, `EPIL`) for optimal typography fit.

---

## 3. Customizing Dimensions & Cover Overhang

All geometry tokens are centralized in `css/variables.css`:

```css
:root {
  /* Book Geometry & Dimensions */
  --book-width: 760px;
  --page-width: 380px;
  --cover-overhang: 16px;      /* Hardcover board overhang past paper leaves */
  --cover-width: calc(var(--page-width) + var(--cover-overhang)); /* 396px */
  --book-height: 540px;
}
```

* **Increase Cover Overhang**: Change `--cover-overhang` (e.g., `8px`, `12px`, `16px`). Centering and desk shadows automatically update via CSS `calc()`.
* **Make Book Larger/Smaller**: Change `--book-height` and `--book-width`. Ensure `--page-width` is exactly half of `--book-width`.

---

## 4. Customizing Theme, Leather & Foil

In `css/variables.css`, edit the design tokens:

### Dark Leather & Gold Foil (Default)
```css
--cover-leather: #141b25;           /* Midnight deep navy leather */
--cover-border: #d4af37;            /* Antique gold foil border */
--cover-foil: #f5df88;              /* Radiant gold foil text */
--paper-cream: #faf7f2;             /* Archival cream paper background */
--paper-text: #242220;              /* Carbon print typography */
--paper-accent: #8b3a2b;            /* Madder red callout / section accents */
```

### Alternative: Burgundy & Rose Gold Theme
```css
--cover-leather: #2b1219;
--cover-border: #d48375;
--cover-foil: #f7bfa9;
--paper-cream: #fbf8f5;
--paper-text: #2c1e22;
--paper-accent: #9c2d42;
```

---

## 5. Adjusting Flip Speed & Easing Physics

To make page turns faster or slower, adjust the animation physics tokens in `css/variables.css`:

```css
:root {
  /* Animation Physics */
  --flip-duration: 0.92s;  /* Change to 0.70s for faster turns, 1.2s for slow luxury */
  --flip-easing: cubic-bezier(0.25, 0.85, 0.35, 1.0); /* Deceleration curve */
}
```

And in `js/main.js`:
```javascript
this.engine = new FlipEngine({
  bookElement: this.bookElement,
  sheets: this.sheets,
  audio: this.audio,
  flipDuration: 920, // Match milliseconds to --flip-duration
  ...
});
```
