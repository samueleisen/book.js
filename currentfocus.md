temporary context to remember for human

### Bilateral Page Skip Features:

1. **Front Cover <---> Title Page (Sheet 6)**:
   - **From Closed Front Cover (`currentLocation = 0`)**:
     - Clicking right page, clicking `#nextStageBtn` / `#dockNextBtn`, or pressing `ArrowRight` / `Space`
     - Immediately triggers `goToLocation(6)`, cascading through all 5 blank flyleaves forward to the Title Page.
   - **From Title Page (`currentLocation = 6`)**:
     - Clicking left page, clicking `#prevStageBtn` / `#dockPrevBtn`, or pressing `ArrowLeft`
     - Immediately triggers `goToLocation(0)`, cascading through all 5 blank flyleaves in reverse and cleanly closing the front cover.

2. **Epilogue (Sheet 10) <---> Closed Back Cover (`currentLocation = 17`)**:
   - **From Epilogue Spread (`currentLocation = 10`)**:
     - Clicking right page, clicking `#nextStageBtn` / `#dockNextBtn`, or pressing `ArrowRight` / `Space`
     - Immediately triggers `goToLocation(17)`, cascading through all closing blank flyleaves (Sheets 10–16) and cleanly closing the back cover.
   - **From Closed Back Cover (`currentLocation = 17`)**:
     - Clicking the back cover, clicking `#prevStageBtn` / `#dockPrevBtn`, or pressing `ArrowLeft`
     - Immediately triggers `goToLocation(10)`, cascading through all closing blank flyleaves in reverse directly back to the Epilogue spread.

3. **Input Guard During Cascades (`isCascading`)**:
   - While a multi-page skip cascade is active (~500ms), all counter-flips, keyboard shortcuts, stage buttons, marker clicks, and direct sheet clicks are ignored.
   - Prevents counter-input interrupts that could leave the reader stranded on intermediate blank flyleaves (Sheets 1–5 or 11–15).

4. **Everywhere Else**:
   - Normal 1-by-1 page flipping remains completely intact in both directions.

### Current 17-Sheet Layout Reference (Sheets 0 to 16):
- **Sheet 0**: Front Hardcover Board (Outside Front Cover / Inside Front Cover)
- **Sheets 1 to 5**: Opening flyleaves filled with chaotic fantasy mess & arcane symbols (Tier 1: Sheet 1, Tier 2: Sheet 2, Tier 3: Sheet 3, Untweaked: Sheets 4, 5)
- **Sheet 6**: Title Page (`#page-title`, `TITLE` marker) / Prologue Left (`#page-prologue-1`, Left Half of Panoramic Full-Spread Canvas)
- **Sheet 7**: Prologue Right (`#page-prologue-2`, Right Half of Panoramic Full-Spread Canvas) / Chapter I Left (`PROLOGUE` marker, with Fig. 1 Penumbra diagram)
- **Sheet 8**: Chapter I Right / Chapter II Left (`CHAPTER I` marker)
- **Sheet 9**: Chapter II Right / Epilogue & Colophon Left (`#page-epilogue`, `CHAPTER II` marker)
- **Sheet 10**: Epilogue Facing Sheet filled with chaotic fantasy mess & arcane symbols (`EPILOGUE` marker)
- **Sheets 11 to 15**: Closing flyleaves filled with chaotic fantasy mess & arcane symbols (Untweaked: Sheets 11, 12, Tier 3: Sheet 13, Tier 2: Sheet 14, Tier 1: Sheet 15)
- **Sheet 16**: Back Hardcover Board (Inside Back Cover / Outside Back Cover)

### Fore-Edge 3D Page Markers (Expanded Outward to 76px):
- **Outward Protrusion (`right: -85px; width: 85px;`)**:
  - The tabs expand outward into the open air/margin beyond the sheet's fore-edge (`right: calc(-1 * var(--marker-width, 85px))`), ensuring zero encroachment onto readable page text.
  - Content offset (`--marker-content-offset: 5px;`) translates typography and icons 5px outward towards the fore-edge on both sides (`+5px` on right stack front faces, `-5px` on left stack back faces).
  - Extends 61px beyond the 404px hardcover casing when the book is closed.
- **Full Unshortened Typography**:
  - No abbreviations necessary: displays `TITLE`, `PROLOGUE`, `CHAPTER I`, `CHAPTER II`, and `EPILOGUE` with icons.
  - Dual-faced 3D typography flips upright on both the right and left page stacks.
  - `targetWidth` adjusted to 920px in `BookResponsive` to prevent viewport edge clipping on all screens.

### Panoramic Full-Spread Canvas (Pages 2 & 3):
- **Continuous 760px × 532px Canvas**: Pages 2 & 3 (Sheet 6 Back and Sheet 7 Front) are united into a single, seamless rectangular canvas with "no middle part".
- **Zero Crease & Shadow in Middle**:
  - The central spine crease groove (`.book-spine-crease`) is automatically hidden via `.book.state-panoramic-spread`.
  - The gutter gradient shadows (`.spine-shading`) are eliminated via `.face.panoramic-canvas-face`.
- **Unified Outer Frame & Headers**:
  - Gold outer framing borders (`.panoramic-canvas-layout.panoramic-left` and `.panoramic-right`) meet seamlessly at the center spine line ($x = 0$) with corner bracket accents.
  - Aligned continuous running heads and footers allow content, diagrams, and text to flow across the spread as an unbroken drafting surface.

### Procedural Fantasy Mess & Arcane Symbols (`js/fantasy-mess.js`):
- Generates chaotic, layered arcane scribbles, occult summoning arrays, alchemy symbols (🜂, 🜄, 🜁, 🜃, 🜍, 🜕, 🝤, 🝯, 🜔, ☉, ☽, ☿, ♃, ♄), elder runes (᚛, ᚜, ᚠ, ᚢ, ᚦ, ᚨ, ᚱ, ᚲ, ᛟ), star polygons, concentric rings, compass scratch marks, ink splatters, and struck-out esoteric formulas.
- Populated across all skipped empty sheet faces (Sheets 1–5, Sheet 10, Sheets 11–15).
- Every single page face receives a uniquely generated chaotic layout.
- `window.randomizeFantasyMess()` (or `window.randomizeStudyGraphs()`) available to re-roll new chaotic compositions on command.
- Documentation: [docs/filler-sheets-and-fantasy-mess.md](docs/filler-sheets-and-fantasy-mess.md) documents purpose (filler to avoid empty paper), temporary PoC status, and replacement instructions.