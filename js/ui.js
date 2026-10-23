/**
 * LUMINA & FORM — UI & INTERACTION CONTROLLER
 * Manages buttons, slider scrubber, TOC drawer, keyboard shortcuts, and auto-play.
 */

export class BookUI {
  constructor({ engine, audio }) {
    this.engine = engine;
    this.audio = audio;

    // DOM Elements
    this.prevStageBtn = document.getElementById('prevStageBtn');
    this.nextStageBtn = document.getElementById('nextStageBtn');
    this.dockPrevBtn = document.getElementById('dockPrevBtn');
    this.dockNextBtn = document.getElementById('dockNextBtn');
    this.pageSlider = document.getElementById('pageSlider');
    this.locationBadge = document.getElementById('locationBadge');
    this.pagesTotalLabel = document.getElementById('pagesTotalLabel');
    this.soundToggleBtn = document.getElementById('soundToggleBtn');
    this.autoPlayBtn = document.getElementById('autoPlayBtn');
    this.tocToggleBtn = document.getElementById('tocToggleBtn');
    this.tocCloseBtn = document.getElementById('tocCloseBtn');
    this.tocDrawer = document.getElementById('tocDrawer');
    this.tocList = document.getElementById('tocList');

    this.autoPlayTimer = null;

    // Spread metadata
    this.spreadNames = [
      'Cover',
      'Title • Ex Libris',
      'Prologue • Study',
      'Chapter I: Memory',
      'Chapter II: Space',
      'Epilogue • Finis',
      'Back Cover'
    ];

    this.init();
  }

  init() {
    this.bindEvents();
    this.render(this.engine.currentLocation);
  }

  render(location) {
    const atStart = location === 0;
    const atEnd = location === this.engine.maxLocation;

    // Navigation buttons disabled states
    if (this.prevStageBtn) this.prevStageBtn.disabled = atStart;
    if (this.dockPrevBtn) this.dockPrevBtn.disabled = atStart;
    if (this.nextStageBtn) this.nextStageBtn.disabled = atEnd;
    if (this.dockNextBtn) this.dockNextBtn.disabled = atEnd;

    // Labels & slider
    if (this.locationBadge) {
      this.locationBadge.textContent = this.spreadNames[location] || `Spread ${location}`;
    }
    if (this.pagesTotalLabel) {
      this.pagesTotalLabel.textContent = `Sheet ${location} of ${this.engine.maxLocation}`;
    }
    if (this.pageSlider) {
      this.pageSlider.value = location;
    }

    // TOC Active State
    if (this.tocList) {
      const items = this.tocList.querySelectorAll('li');
      items.forEach(item => {
        const targetPage = parseInt(item.getAttribute('data-target-page'), 10);
        if (targetPage === location) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
    }
  }

  bindEvents() {
    // Navigation Button Clicks
    if (this.prevStageBtn) this.prevStageBtn.addEventListener('click', () => this.engine.flipBackward());
    if (this.nextStageBtn) this.nextStageBtn.addEventListener('click', () => this.engine.flipForward());
    if (this.dockPrevBtn) this.dockPrevBtn.addEventListener('click', () => this.engine.flipBackward());
    if (this.dockNextBtn) this.dockNextBtn.addEventListener('click', () => this.engine.flipForward());

    // Slider Scrubber
    if (this.pageSlider) {
      this.pageSlider.addEventListener('input', (e) => {
        const target = parseInt(e.target.value, 10);
        this.engine.goToLocation(target);
      });
    }

    // Direct Clicks on Page Sheets
    this.engine.sheets.forEach((sheet, index) => {
      sheet.addEventListener('click', (e) => {
        if (e.target.closest('.toc-drawer')) return;

        // Click right page -> flip forward
        if (index === this.engine.currentLocation) {
          this.engine.flipForward();
        }
        // Click left page -> flip backward
        else if (index === this.engine.currentLocation - 1) {
          this.engine.flipBackward();
        }
      });
    });

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        this.engine.flipForward();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        this.engine.flipBackward();
      } else if (e.key === 'Home') {
        e.preventDefault();
        this.engine.goToLocation(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        this.engine.goToLocation(this.engine.maxLocation);
      }
    });

    // Sound Toggle
    if (this.soundToggleBtn && this.audio) {
      this.soundToggleBtn.addEventListener('click', () => {
        const enabled = this.audio.toggleSound();
        const onIcon = this.soundToggleBtn.querySelector('.sound-on-icon');
        const offIcon = this.soundToggleBtn.querySelector('.sound-off-icon');

        if (enabled) {
          if (onIcon) onIcon.classList.remove('hidden');
          if (offIcon) offIcon.classList.add('hidden');
          this.soundToggleBtn.classList.remove('active-state');
        } else {
          if (onIcon) onIcon.classList.add('hidden');
          if (offIcon) offIcon.classList.remove('hidden');
          this.soundToggleBtn.classList.add('active-state');
        }
      });
    }

    // Auto-Play Toggle
    if (this.autoPlayBtn) {
      this.autoPlayBtn.addEventListener('click', () => this.toggleAutoPlay());
    }

    // TOC Toggle
    if (this.tocToggleBtn) {
      this.tocToggleBtn.addEventListener('click', () => this.openTOC());
    }
    if (this.tocCloseBtn) {
      this.tocCloseBtn.addEventListener('click', () => this.closeTOC());
    }

    // TOC Item Selection
    if (this.tocList) {
      this.tocList.addEventListener('click', (e) => {
        const li = e.target.closest('li');
        if (!li) return;
        const targetPage = parseInt(li.getAttribute('data-target-page'), 10);
        this.engine.goToLocation(targetPage);
        this.closeTOC();
      });
    }

    // Close TOC on clicking outside
    document.addEventListener('click', (e) => {
      if (this.tocDrawer &&
          this.tocDrawer.classList.contains('open') &&
          !this.tocDrawer.contains(e.target) &&
          this.tocToggleBtn &&
          !this.tocToggleBtn.contains(e.target)) {
        this.closeTOC();
      }
    });
  }

  openTOC() {
    if (this.tocDrawer) {
      this.tocDrawer.classList.add('open');
      this.tocDrawer.setAttribute('aria-hidden', 'false');
    }
  }

  closeTOC() {
    if (this.tocDrawer) {
      this.tocDrawer.classList.remove('open');
      this.tocDrawer.setAttribute('aria-hidden', 'true');
    }
  }

  toggleAutoPlay() {
    if (this.autoPlayTimer) {
      clearInterval(this.autoPlayTimer);
      this.autoPlayTimer = null;
      if (this.autoPlayBtn) {
        this.autoPlayBtn.classList.remove('active-state');
        const playIcon = this.autoPlayBtn.querySelector('.play-icon');
        const pauseIcon = this.autoPlayBtn.querySelector('.pause-icon');
        if (playIcon) playIcon.classList.remove('hidden');
        if (pauseIcon) pauseIcon.classList.add('hidden');
      }
    } else {
      if (this.autoPlayBtn) {
        this.autoPlayBtn.classList.add('active-state');
        const playIcon = this.autoPlayBtn.querySelector('.play-icon');
        const pauseIcon = this.autoPlayBtn.querySelector('.pause-icon');
        if (playIcon) playIcon.classList.add('hidden');
        if (pauseIcon) pauseIcon.classList.remove('hidden');
      }

      this.autoPlayTimer = setInterval(() => {
        if (this.engine.currentLocation >= this.engine.maxLocation) {
          this.engine.goToLocation(0);
        } else {
          this.engine.flipForward();
        }
      }, 3400);
    }
  }
}
