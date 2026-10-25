/**
 * LUMINA & FORM — MAIN ORCHESTRATOR
 * Initializes audio, 3D flip engine, responsive scaler, and UI controllers.
 */

import { BookAudio } from './audio.js';
import { FlipEngine } from './flip-engine.js';
import { BookResponsive } from './responsive.js';
import { BookUI } from './ui.js';
import { populateBlankPages } from './fantasy-mess.js';

export class BookApp {
  constructor() {
    this.bookElement = document.getElementById('book');
    this.sheets = document.querySelectorAll('.page-sheet');

    // 0. Populate skipped flyleaves with chaotic fantasy mess & arcane symbols
    populateBlankPages(this.bookElement);

    // 1. Audio synthesis
    this.audio = new BookAudio();

    // 2. Responsive scaling
    this.responsive = new BookResponsive({ zoom: 1.15 });

    // 3. UI Controller reference (initialized right after engine)
    this.ui = null;

    // 4. Core 3D Flip Engine
    this.engine = new FlipEngine({
      bookElement: this.bookElement,
      sheets: this.sheets,
      audio: this.audio,
      flipDuration: 920,
      onChange: (location) => {
        if (this.ui) this.ui.render(location);
      }
    });

    // 5. Connect UI
    this.ui = new BookUI({
      engine: this.engine,
      audio: this.audio
    });
  }
}

// Auto-initialize when DOM is ready
function bootstrap() {
  window.bookApp = new BookApp();
  // Maintain backward-compatible alias for bookInstance
  window.bookInstance = window.bookApp.engine;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}
