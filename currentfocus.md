temporary context to remember for human

### Bilateral Page Skip Features:

1. **Front Cover <---> Title Page (Sheet 8)**:
   - **From Closed Front Cover (`currentLocation = 0`)**:
     - Clicking right page, clicking `#nextStageBtn` / `#dockNextBtn`, or pressing `ArrowRight` / `Space`
     - Immediately triggers `goToLocation(8)`, cascading through all 7 blank flyleaves forward to the Title Page.
   - **From Title Page (`currentLocation = 8`)**:
     - Clicking left page, clicking `#prevStageBtn` / `#dockPrevBtn`, or pressing `ArrowLeft`
     - Immediately triggers `goToLocation(0)`, cascading through all 7 blank flyleaves in reverse and cleanly closing the front cover.

2. **Epilogue (Sheet 12) <---> Closed Back Cover (`currentLocation = 20`)**:
   - **From Epilogue Spread (`currentLocation = 12`)**:
     - Clicking right page, clicking `#nextStageBtn` / `#dockNextBtn`, or pressing `ArrowRight` / `Space`
     - Immediately triggers `goToLocation(20)`, cascading through all closing blank flyleaves (Sheets 12–19) and cleanly closing the back cover.
   - **From Closed Back Cover (`currentLocation = 20`)**:
     - Clicking the back cover, clicking `#prevStageBtn` / `#dockPrevBtn`, or pressing `ArrowLeft`
     - Immediately triggers `goToLocation(12)`, cascading through all closing blank flyleaves in reverse directly back to the Epilogue spread.

3. **Everywhere Else**:
   - Normal 1-by-1 page flipping remains completely intact in both directions.

### Current 20-Sheet Layout Reference (Sheets 0 to 19):
- **Sheet 0**: Front Hardcover Board (Outside Front Cover / Inside Front Cover)
- **Sheets 1 to 7**: Blank opening flyleaves (Tier 1: Sheet 1, Tier 2: Sheet 2, Tier 3: Sheet 3)
- **Sheet 8**: Title Page (`#page-title`, `TITL` marker) / Prologue Left
- **Sheet 9**: Prologue Right / Chapter I Left (`PROL` marker)
- **Sheet 10**: Chapter I Right / Chapter II Left (`CH.I` marker)
- **Sheet 11**: Chapter II Right / Epilogue & Colophon Left (`#page-epilogue`, `CH.II` marker)
- **Sheet 12**: Blank Right Page (`EPIL` marker)
- **Sheets 13 to 18**: Blank closing flyleaves (Tier 3: Sheet 16, Tier 2: Sheet 17, Tier 1: Sheet 18)
- **Sheet 19**: Back Hardcover Board (Inside Back Cover / Outside Back Cover)