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
- **Sheet 6**: Title Page (`#page-title`, `TITL` marker) / Prologue Left
- **Sheet 7**: Prologue Right / Chapter I Left (`PROL` marker, with original Fig. 1 Penumbra diagram)
- **Sheet 8**: Chapter I Right / Chapter II Left (`CH.I` marker)
- **Sheet 9**: Chapter II Right / Epilogue & Colophon Left (`#page-epilogue`, `CH.II` marker)
- **Sheet 10**: Epilogue Facing Sheet filled with chaotic fantasy mess & arcane symbols (`EPIL` marker)
- **Sheets 11 to 15**: Closing flyleaves filled with chaotic fantasy mess & arcane symbols (Untweaked: Sheets 11, 12, Tier 3: Sheet 13, Tier 2: Sheet 14, Tier 1: Sheet 15)
- **Sheet 16**: Back Hardcover Board (Inside Back Cover / Outside Back Cover)

### Procedural Fantasy Mess & Arcane Symbols (`js/fantasy-mess.js`):
- Generates chaotic, layered arcane scribbles, occult summoning arrays, alchemy symbols (🜂, 🜄, 🜁, 🜃, 🜍, 🜕, 🝤, 🝯, 🜔, ☉, ☽, ☿, ♃, ♄), elder runes (᚛, ᚜, ᚠ, ᚢ, ᚦ, ᚨ, ᚱ, ᚲ, ᛟ), star polygons, concentric rings, compass scratch marks, ink splatters, and struck-out esoteric formulas.
- Populated across all skipped empty sheet faces (Sheets 1–5, Sheet 10, Sheets 11–15).
- Every single page face receives a uniquely generated chaotic layout.
- `window.randomizeFantasyMess()` (or `window.randomizeStudyGraphs()`) available to re-roll new chaotic compositions on command.
- Documentation: [docs/filler-sheets-and-fantasy-mess.md](docs/filler-sheets-and-fantasy-mess.md) documents purpose (filler to avoid empty paper), temporary PoC status, and replacement instructions.