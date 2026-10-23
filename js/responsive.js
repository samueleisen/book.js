/**
 * LUMINA & FORM — RESPONSIVE CONTROLLER
 * Auto-calculates --book-scale to ensure optimal viewport fit without clipping.
 */

export class BookResponsive {
  constructor({ targetWidth = 840, targetHeight = 640 } = {}) {
    this.targetWidth = targetWidth;
    this.targetHeight = targetHeight;
    this.init();
  }

  init() {
    this.updateScale();
    window.addEventListener('resize', () => this.updateScale());
  }

  updateScale() {
    const availWidth = window.innerWidth;
    const availHeight = window.innerHeight;

    const scaleX = (availWidth * 0.92) / this.targetWidth;
    const scaleY = (availHeight * 0.72) / this.targetHeight;
    let finalScale = Math.min(1.05, Math.min(scaleX, scaleY));

    // Floor at 0.48 for legibility
    if (finalScale < 0.48) finalScale = 0.48;

    document.documentElement.style.setProperty('--book-scale', finalScale.toFixed(3));
  }
}
