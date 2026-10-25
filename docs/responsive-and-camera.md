# Responsive Camera & Viewport Scaling

This document details the responsive viewport scaling system, zoom multiplier controller, hardcover board overhang geometry, and dynamic centering offsets in **Lumina & Form**.

---

## 1. Viewport Fit & Auto-Scaling System

Because the 3D book has fixed physical design dimensions (`760px × 540px`), it must scale responsively across all screens (from mobile viewports to 4K desktop monitors) without clipping, overflowing, or requiring scrollbars.

The `BookResponsive` controller in `js/responsive.js` dynamically computes the CSS variable `--book-scale`:

```javascript
updateScale() {
  const availWidth = window.innerWidth;
  const availHeight = window.innerHeight;

  // Utilize viewport dimensions (HUDs removed)
  const scaleX = (availWidth * 0.94) / this.targetWidth;
  const scaleY = (availHeight * 0.92) / this.targetHeight;
  
  // Calculate zoomed scale with generous bounds
  let finalScale = Math.min(scaleX, scaleY) * this.zoom;
  finalScale = Math.min(this.maxScale, Math.max(this.minScale, finalScale));

  document.documentElement.style.setProperty('--book-scale', finalScale.toFixed(3));
}
```

### Key Scaling Parameters

| Parameter | Default Value | Description |
| :--- | :--- | :--- |
| `targetWidth` | `840` | Base reference width (760px book width + 64px tab clearance + stage margins). |
| `targetHeight` | `600` | Base reference height (540px book height + drop shadow clearance). |
| `zoom` | `1.15` | Default zoom multiplier selected for optimal visual presence without edge clipping. |
| `minScale` | `0.55` | Floor boundary preventing the book from becoming illegibly tiny on small devices. |
| `maxScale` | `2.50` | Ceiling boundary preventing clamp clipping on high-resolution displays. |

### Viewport Space Utilization
Following the complete removal of top navigation bars, Table of Contents drawers, and bottom scrubber docks, the viewport calculation was upgraded:
* Horizontal budget: **94%** (`availWidth * 0.94`)
* Vertical budget: **92%** (`availHeight * 0.92`)

---

## 2. Dynamic Runtime Zoom Control

The zoom level can be modified programmatically at any time without re-instantiating the application:

### In Source Code (`js/main.js:20`)
```javascript
// Set custom default zoom on instantiation
this.responsive = new BookResponsive({ zoom: 1.15 });
```

### Live in Browser DevTools Console
```javascript
// Test different zoom factors in real time
window.bookApp.responsive.setZoom(1.20);
```

---

## 3. Hardcover Overhang ("Squares") Geometry

In authentic bookbinding, the hardcover casing (boards) extends slightly beyond the text block (the paper leaves) to protect the edges of the pages. This margin is traditionally known as the **"squares"** of the binding.

In `css/variables.css`:
```css
--book-width: 760px;
--page-width: 380px;
--cover-overhang: 16px;
--cover-width: calc(var(--page-width) + var(--cover-overhang)); /* 396px */
--book-height: 540px;
```

### Element Sizing Hierarchy

```
       Spine (0px)
        |
        |--- Inner Paper Sheets (Sheets 1 to 28) ---| 380px
        |
        |------ Hardcover Boards (Sheet 0 & 29) ------| 396px (+16px Overhang)
        |
        |---------------- Fore-Edge Markers ----------------| 412px (Protrudes 16px past Cover)
```

* **Inner Paper Sheets** (Sheets 1–28): Fixed width of `--page-width: 380px`.
* **Hardcover Boards** (`#sheet-0` and `#sheet-29`): Width of `--cover-width: 396px`.
* **Page Markers**: Protrude to $380\text{px} + 32\text{px} = 412\text{px}$, leaving $412 - 396 = 16\text{px}$ of each tab visible beyond the leather cover edge when closed.

---

## 4. Centering Math & Offset Compensation

When the book opens and closes, its physical center of mass shifts:
* **Closed Front**: Only the right half (front cover) exists.
* **Open**: Both left and right pages exist around the central spine.
* **Closed Back**: Only the left half (back cover) exists.

To keep the visible volume visually centered in the user's viewport, the `.book` container applies translation offsets:

### Dynamic Centering Formulas

$$\text{Shift}_{closed-front} = -\frac{\text{cover-width}}{2} = -\frac{396\text{px}}{2} = -198\text{px}$$

$$\text{Shift}_{open} = 0\text{px}$$

$$\text{Shift}_{closed-back} = +\frac{\text{cover-width}}{2} = +\frac{396\text{px}}{2} = +198\text{px}$$

### CSS Rules in `css/book-3d.css`
```css
.book.state-closed-front {
  transform: scale(var(--book-scale)) translateX(calc(var(--cover-width) / -2));
}

.book.state-open {
  transform: scale(var(--book-scale)) translateX(0);
}

.book.state-closed-back {
  transform: scale(var(--book-scale)) translateX(calc(var(--cover-width) / 2));
}
```

### Desk Shadow Shift Equation
The drop shadow beneath the book shifts concurrently at half the displacement:
```css
.book.state-closed-front ~ .book-desk-shadow {
  transform: translate(calc(-50% + calc(var(--cover-width) / 4)), calc(-50% + 270px)) scaleX(0.55) scaleY(0.45);
}

.book.state-closed-back ~ .book-desk-shadow {
  transform: translate(calc(-50% - calc(var(--cover-width) / 4)), calc(-50% + 270px)) scaleX(0.55) scaleY(0.45);
}
```
