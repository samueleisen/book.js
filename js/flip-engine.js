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
    this.isFlipping = false;

    this.init();
  }

  init() {
    this.updateZIndices();
    this.updateBookCentering();
    this.updatePointerEvents();
  }

  flipForward() {
    if (this.currentLocation >= this.maxLocation || this.isFlipping) return false;

    this.isFlipping = true;
    const sheetIndex = this.currentLocation;
    const sheet = this.sheets[sheetIndex];

    if (this.audio) {
      this.audio.playFlipSound('forward');
    }

    // 1. Elevate flipping sheet above all others during turn
    sheet.style.zIndex = '50';

    // 2. Animate shading on faces
    this.animateFaceShadow(sheet, 'forward');

    // 3. Apply 3D rotation transform
    sheet.classList.add('flipped');
    this.currentLocation++;

    // 4. Update centering & pointer events immediately
    this.updateBookCentering();
    this.updatePointerEvents();
    if (this.onChange) this.onChange(this.currentLocation);

    // 5. Finalize z-index rest order upon transition completion
    setTimeout(() => {
      this.updateZIndices();
      this.isFlipping = false;
    }, this.flipDuration);

    return true;
  }

  flipBackward() {
    if (this.currentLocation <= 0 || this.isFlipping) return false;

    this.isFlipping = true;
    const sheetIndex = this.currentLocation - 1;
    const sheet = this.sheets[sheetIndex];

    if (this.audio) {
      this.audio.playFlipSound('backward');
    }

    // 1. Elevate flipping sheet above all others during turn
    sheet.style.zIndex = '50';

    // 2. Animate shading on faces
    this.animateFaceShadow(sheet, 'backward');

    // 3. Remove 3D rotation transform
    sheet.classList.remove('flipped');
    this.currentLocation--;

    // 4. Update centering & pointer events immediately
    this.updateBookCentering();
    this.updatePointerEvents();
    if (this.onChange) this.onChange(this.currentLocation);

    // 5. Finalize z-index rest order upon transition completion
    setTimeout(() => {
      this.updateZIndices();
      this.isFlipping = false;
    }, this.flipDuration);

    return true;
  }

  goToLocation(targetLocation) {
    if (targetLocation === this.currentLocation || this.isFlipping) return;
    targetLocation = Math.max(0, Math.min(targetLocation, this.maxLocation));

    const step = targetLocation > this.currentLocation ? 1 : -1;
    const distance = Math.abs(targetLocation - this.currentLocation);

    if (distance === 1) {
      if (step === 1) this.flipForward();
      else this.flipBackward();
    } else {
      // Multi-page flip cascade
      let currentStep = 0;
      const intervalMs = Math.max(80, Math.floor(400 / distance));

      const cascadeInterval = setInterval(() => {
        if (this.currentLocation === targetLocation || currentStep >= distance) {
          clearInterval(cascadeInterval);
          return;
        }

        const sIdx = step === 1 ? this.currentLocation : this.currentLocation - 1;
        const sheet = this.sheets[sIdx];

        if (step === 1) {
          sheet.classList.add('flipped');
          this.currentLocation++;
        } else {
          sheet.classList.remove('flipped');
          this.currentLocation--;
        }

        this.updateZIndices();
        this.updateBookCentering();
        this.updatePointerEvents();
        if (this.onChange) this.onChange(this.currentLocation);
        if (this.audio) this.audio.playFlipSound(step === 1 ? 'forward' : 'backward');

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
