# 3D Flip Mechanics & Stacking Engine

This guide provides a comprehensive mathematical and geometric breakdown of the 3D page-flip engine implemented in **Lumina & Form**.

---

## 1. 3D Spatial Geometry & Stage Setup

The realistic 3D book illusion relies on CSS 3D transforms operating in a Euclidean 3D coordinate space.

```
                  -Z (into screen)
                     ▲
                     │
    -X (left) ◄──────┼──────► +X (right)
                     │
                     ▼
                  +Z (toward viewer)
```

### 1.1 The Viewing Frustum (`perspective`)
```css
.book-stage {
  perspective: 2400px;
  perspective-origin: 50% 50%;
}
```
- `perspective: 2400px`: Defines the distance between the user's eye and the $Z=0$ projection plane. A focal length of $2400\text{px}$ avoids excessive wide-angle fisheye distortion while retaining genuine depth cues as pages arch towards the viewer during a turn.
- `perspective-origin: 50% 50%`: Centers the vanishing point directly in the middle of the viewport.

### 1.2 Preserving 3D Space (`transform-style`)
```css
.book, .page-sheet {
  transform-style: preserve-3d;
  -webkit-transform-style: preserve-3d;
}
```
Without `preserve-3d`, child elements are flattened into the 2D plane of their immediate parent. Setting this property on `.book` and `.page-sheet` ensures all child faces inhabit a unified 3D coordinate space.

---

## 2. Anatomical Dimensions & The Central Pivot

In an open two-page spread, the book has a total width of $760\text{px}$ and a height of $540\text{px}$:
- **Left Page Spread**: From $X = 0\text{px}$ to $X = 380\text{px}$.
- **Spine (Binding Gutter)**: Exactly at $X = 380\text{px}$ (i.e., `50%` of book width).
- **Right Page Spread**: From $X = 380\text{px}$ to $X = 760\text{px}$.

```
┌───────────────────────────────┬───────────────────────────────┐
│                               │                               │
│       LEFT PAGE SPREAD        │       RIGHT PAGE SPREAD       │
│         (380px wide)          │         (380px wide)          │
│                               │                               │
└───────────────────────────────┴───────────────────────────────┘
                                ▲
                          Central Spine
                             (left: 50%)
```

### The Anchor Pivot
Every `.page-sheet` element is positioned at `left: 50%`:
```css
.page-sheet {
  position: absolute;
  top: 0;
  left: 50%;
  width: 380px;
  height: 540px;
  transform-origin: left center; /* Pivot anchored along spine */
  transition: transform var(--flip-duration) var(--flip-easing);
}
```
- When `rotateY(0deg)` (un-flipped): The sheet extends from `50%` to `100%`, resting on the **right** side of the book.
- When `rotateY(-180deg)` (flipped): The sheet rotates around its left edge (the central spine) and swings through the $Z>0$ space toward the viewer, landing from `0%` to `50%` on the **left** side of the book.

---

## 3. Double-Sided Faces & Backface Visibility

Each sheet contains two distinct DOM nodes:
1. `.face.front` — The right-hand page when resting un-flipped.
2. `.face.back` — The left-hand page revealed once turned over.

```css
.face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  transform: translate3d(0, 0, 0);
}

.face.back {
  transform: rotateY(180deg) translateZ(0.5px);
}
```

### Why `translateZ(0.5px)` Matters
When a 3D leaf is rendered on modern GPUs, two coplanar surfaces located at identical $Z$ coordinates can cause **z-fighting** (flickering pixel artifacts where the renderer cannot determine which face is on top). Offsetting `.face.back` by a microscopic $+0.5\text{px}$ along its local $Z$-axis guarantees deterministic depth resolution with zero visual seam.

---

## 4. The Mathematical Z-Index Stacking Hierarchy

In physical book pagination, the top page of the right stack must cover all pages below it, while the top page of the left stack must cover all pages accumulated beneath it. 

### 4.1 Resting Stacks Formula
For a book with $N$ total sheets, currently at state $L$ ($0 \le L \le N$ sheets turned to the left):

$$
\text{zIndex}(i) = 
\begin{cases} 
i + 1 & \text{if } i < L \quad (\text{Sheet resting on Left pile}) \\
N - i & \text{if } i \ge L \quad (\text{Sheet resting on Right pile})
\end{cases}
$$

#### Example with $N = 6$ sheets at Location $L = 2$:
- **Left Pile** (Sheets 0 and 1 turned):
  - Sheet 0: $z\text{-index} = 0 + 1 = 1$ (Bottom of left pile)
  - Sheet 1: $z\text{-index} = 1 + 1 = 2$ (Top of left pile — visible to user)
- **Right Pile** (Sheets 2, 3, 4, 5 un-turned):
  - Sheet 2: $z\text{-index} = 6 - 2 = 4$ (Top of right pile — visible to user)
  - Sheet 3: $z\text{-index} = 6 - 3 = 3$
  - Sheet 4: $z\text{-index} = 6 - 4 = 2$
  - Sheet 5: $z\text{-index} = 6 - 5 = 1$ (Bottom of right pile)

### 4.2 In-Flight Transition Elevation
When a sheet flips, it passes through the $Z$ plane over both the left and right piles. If its z-index remained at its resting value, it would visually clip through sheets higher in the stack mid-turn.

**The Solution:**
```javascript
// Elevate to maximum priority prior to transform
sheet.style.zIndex = '50';
sheet.classList.add('flipped');

// Reset to resting stack hierarchy once animation concludes
setTimeout(() => {
  this.updateZIndices();
  this.isFlipping = false;
}, this.flipDuration);
```

---

## 5. Dynamic Spread Centering

A closed book has the width of a single page ($380\text{px}$), whereas an open book has the width of two pages ($760\text{px}$). Without dynamic centering, a closed book would appear shifted off to one side of the screen.

The master `.book` element applies an automated positional shift:

| State | CSS Class | Transform Applied | Visual Result |
| :--- | :--- | :--- | :--- |
| **Front Cover** | `.state-closed-front` | `translateX(-190px)` | Centers the right-hand front cover in the viewport. |
| **Open Spreads** | `.state-open` | `translateX(0)` | Centers the spine directly in the middle of the screen. |
| **Back Cover** | `.state-closed-back` | `translateX(190px)` | Centers the left-hand back cover in the viewport. |

All three states transition smoothly via:
```css
.book {
  transition: transform 0.85s cubic-bezier(0.25, 0.85, 0.35, 1.0);
}
```

---

## 6. Multi-Page Cascade Fast-Scrubbing

When the user moves the bottom scrubber or selects a distant chapter in the Table of Contents (e.g., from Page 0 directly to Page 5), flipping all intermediate pages at standard speed ($920\text{ms}$) would feel sluggish.

The `goToLocation(target)` algorithm handles this:
1. Calculates step direction ($\Delta = \text{target} - \text{current}$).
2. If $|\Delta| = 1$: executes a single smooth transition.
3. If $|\Delta| > 1$: dynamically compresses the interval:
   $$\text{Interval} = \max\left(80\text{ms}, \left\lfloor\frac{400\text{ms}}{|\Delta|}\right\rfloor\right)$$
4. Turns intermediate leaves in a rapid cascade, playing scaled audio cues until reaching the target destination.
