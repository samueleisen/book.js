/**
 * LUMINA & FORM — 3D FLIP ENGINE
 * Core 3D transformation, physics easing, and z-index scheduling.
 */

export class FlipEngine {
  constructor({ bookElement, sheets, audio, flipDuration = 920, onChange = null }) {
    this.book = bookElement;
    this.sheets = Array.from(sheets);
    this.totalSheets = this.sheets.length;
    this.maxLocation = this.totalSheets;
    this.audio = audio;
    this.flipDuration = flipDuration;
    this.onChange = onChange;

    this.currentLocation = 0; // 0 = Cover, maxLocation = Back Cover

    // Multi-page rapid flip tracking
    this.flippingSheets = new Set();
    this.sheetTimeouts = new Map();
    this.inFlightCounter = 0;

    this.init();
  }

  get isFlipping() {
    return this.flippingSheets.size > 0;
  }

  init() {
    this.updateZIndices();
    this.updateBookCentering();
    this.updatePointerEvents();
  }

  flipForward() {
    if (this.currentLocation >= this.maxLocation) return false;

    const sheetIndex = this.currentLocation;
    const sheet = this.sheets[sheetIndex];
    if (!sheet) return false;

    if (this.audio) {
      this.audio.playFlipSound('forward');
    }

    // 1. Elevate flipping sheet above resting stacks in chronological turn order
    this.flippingSheets.add(sheet);
    sheet.style.zIndex = `${100 + (++this.inFlightCounter)}`;

    // 2. Clear any pending settle timer on this sheet (e.g. if reversing mid-turn)
    if (this.sheetTimeouts.has(sheet)) {
      clearTimeout(this.sheetTimeouts.get(sheet));
    }

    // 3. Animate shading on faces
    this.animateFaceShadow(sheet, 'forward');

    // 4. Apply 3D rotation transform
    sheet.classList.add('flipped');
    this.currentLocation++;

    // 5. Update centering & pointer events immediately
    this.updateBookCentering();
    this.updatePointerEvents();
    if (this.onChange) this.onChange(this.currentLocation);

    // 6. Schedule rest order when this sheet completes its transition
    const timerId = setTimeout(() => {
      this.flippingSheets.delete(sheet);
      this.sheetTimeouts.delete(sheet);

      if (this.flippingSheets.size === 0) {
        this.inFlightCounter = 0;
      }

      this.updateZIndices();
      this.updatePointerEvents();
    }, this.flipDuration);

    this.sheetTimeouts.set(sheet, timerId);
    return true;
  }

  flipBackward() {
    if (this.currentLocation <= 0) return false;

    const sheetIndex = this.currentLocation - 1;
    const sheet = this.sheets[sheetIndex];
    if (!sheet) return false;

    if (this.audio) {
      this.audio.playFlipSound('backward');
    }

    // 1. Elevate flipping sheet above resting stacks in chronological turn order
    this.flippingSheets.add(sheet);
    sheet.style.zIndex = `${100 + (++this.inFlightCounter)}`;

    // 2. Clear any pending settle timer on this sheet (e.g. if reversing mid-turn)
    if (this.sheetTimeouts.has(sheet)) {
      clearTimeout(this.sheetTimeouts.get(sheet));
    }

    // 3. Animate shading on faces
    this.animateFaceShadow(sheet, 'backward');

    // 4. Remove 3D rotation transform
    sheet.classList.remove('flipped');
    this.currentLocation--;

    // 5. Update centering & pointer events immediately
    this.updateBookCentering();
    this.updatePointerEvents();
    if (this.onChange) this.onChange(this.currentLocation);

    // 6. Schedule rest order when this sheet completes its transition
    const timerId = setTimeout(() => {
      this.flippingSheets.delete(sheet);
      this.sheetTimeouts.delete(sheet);

      if (this.flippingSheets.size === 0) {
        this.inFlightCounter = 0;
      }

      this.updateZIndices();
      this.updatePointerEvents();
    }, this.flipDuration);

    this.sheetTimeouts.set(sheet, timerId);
    return true;
  }

  goToLocation(targetLocation) {
    if (this.cascadeInterval) {
      clearInterval(this.cascadeInterval);
      this.cascadeInterval = null;
    }

    if (targetLocation === this.currentLocation) return;
    targetLocation = Math.max(0, Math.min(targetLocation, this.maxLocation));

    const step = targetLocation > this.currentLocation ? 1 : -1;
    const distance = Math.abs(targetLocation - this.currentLocation);

    if (distance === 1) {
      if (step === 1) this.flipForward();
      else this.flipBackward();
    } else {
      // Multi-page flip cascade
      let currentStep = 0;
      const intervalMs = Math.max(70, Math.floor(350 / distance));

      this.cascadeInterval = setInterval(() => {
        if (this.currentLocation === targetLocation || currentStep >= distance) {
          clearInterval(this.cascadeInterval);
          this.cascadeInterval = null;
          return;
        }

        if (step === 1) {
          this.flipForward();
        } else {
          this.flipBackward();
        }

        currentStep++;
      }, intervalMs);
    }
  }

  animateFaceShadow(sheet, direction) {
    const frontOverlay = sheet.querySelector('.face.front .face-lighting-overlay');
    const backOverlay = sheet.querySelector('.face.back .face-lighting-overlay');

    if (!frontOverlay || !backOverlay) return;

    if (direction === 'forward') {
      frontOverlay.style.transition = `opacity ${this.flipDuration * 0.45}ms ease-in`;
      frontOverlay.style.opacity = '0.38';

      setTimeout(() => {
        frontOverlay.style.opacity = '0';
      }, this.flipDuration * 0.48);

      backOverlay.style.opacity = '0.38';
      setTimeout(() => {
        backOverlay.style.transition = `opacity ${this.flipDuration * 0.45}ms ease-out`;
        backOverlay.style.opacity = '0';
      }, this.flipDuration * 0.5);
    } else {
      backOverlay.style.transition = `opacity ${this.flipDuration * 0.45}ms ease-in`;
      backOverlay.style.opacity = '0.38';

      setTimeout(() => {
        backOverlay.style.opacity = '0';
      }, this.flipDuration * 0.48);

      frontOverlay.style.opacity = '0.38';
      setTimeout(() => {
        frontOverlay.style.transition = `opacity ${this.flipDuration * 0.45}ms ease-out`;
        frontOverlay.style.opacity = '0';
      }, this.flipDuration * 0.5);
    }
  }

  updateZIndices() {
    this.sheets.forEach((sheet, index) => {
      // Do not overwrite z-index of sheets that are currently turning in mid-air
      if (this.flippingSheets && this.flippingSheets.has(sheet)) {
        return;
      }

      if (index < this.currentLocation) {
        sheet.style.zIndex = index + 1;
      } else {
        sheet.style.zIndex = this.totalSheets - index;
      }
    });
  }

  updateBookCentering() {
    this.book.classList.remove('state-closed-front', 'state-open', 'state-closed-back');

    if (this.currentLocation === 0) {
      this.book.classList.add('state-closed-front');
    } else if (this.currentLocation === this.maxLocation) {
      this.book.classList.add('state-closed-back');
    } else {
      this.book.classList.add('state-open');
    }
  }

  updatePointerEvents() {
    this.sheets.forEach((sheet, idx) => {
      // While a sheet is in-flight, disable pointer events so clicks cleanly target resting pages underneath
      if (this.flippingSheets && this.flippingSheets.has(sheet)) {
        sheet.style.pointerEvents = 'none';
        return;
      }

      const isVisibleLeft = idx === this.currentLocation - 1;
      const isVisibleRight = idx === this.currentLocation;

      if (isVisibleLeft || isVisibleRight) {
        sheet.style.pointerEvents = 'auto';
      } else {
        sheet.style.pointerEvents = 'none';
      }
    });
  }
}
