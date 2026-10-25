/**
 * LUMINA & FORM — RESPONSIVE CONTROLLER
 * Auto-calculates --book-scale to ensure optimal viewport fit without clipping.
 */

export class BookResponsive {
  constructor({
    targetWidth = 840,
    targetHeight = 600,
    zoom = 1.15,
    minScale = 0.55,
    maxScale = 2.50
  } = {}) {
    this.targetWidth = targetWidth;
    this.targetHeight = targetHeight;
    this.zoom = zoom;
    this.minScale = minScale;
    this.maxScale = maxScale;
    this.init();
  }

  init() {
    this.updateScale();
    window.addEventListener('resize', () => this.updateScale());
  }

  setZoom(newZoom) {
    this.zoom = newZoom;
    this.updateScale();
  }

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
}

