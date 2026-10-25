# Lumina & Form — 3D Book Experience

An interactive 3D book experience built with vanilla HTML5, CSS 3D transforms, and lightweight JavaScript.

## Features & Highlights

- **Physics-Accurate 3D Page Flip**:
  - CSS `transform: rotateY(-180deg)` with custom cubic-bezier easing (`cubic-bezier(0.25, 0.85, 0.35, 1.0)`).
  - Centered spine pivot (`transform-origin: left center`).
  - Dynamic stacking order (`z-index`) scheduling to ensure flipped and un-flipped leaves never clip or overlap improperly during transitions.
  - Subpixel translateZ separation to eliminate GPU z-fighting.

- **Dynamic Shading & Lighting**:
  - Gutter shadow gradients (`.left-spine` and `.right-spine`) recreating the curvature of bound pages.
  - Dynamic opacity lighting overlay responding to flip angle to simulate page shadow and ambient light deflection.
  - Desk drop shadow adjusting width and position as the book transitions between closed-front, open-spread, and closed-back.

- **Dynamic Book Centering**:
  - **Cover (closed)**: Shifts left (`translateX(-190px)`) so the single front cover is centered in the viewport.
  - **Open spread**: Centers the spine (`translateX(0)`).
  - **Back Cover (closed)**: Shifts right (`translateX(190px)`) to center the single back cover.

- **Built-in Physical Audio Synthesis (Web Audio API)**:
  - Procedural paper flick/rustle generated with white noise filtered through a bandpass filter and exponential decay gain envelope.
  - Zero external sound files or network dependencies required.

- **Navigation & Controls**:
  - Direct click on page sheets (click right page -> flip next; click left page -> flip prev).
  - Tactile corner fold hint on hover.
  - Floating stage navigation arrows.
  - Bottom dock with scrub slider and spread location badge.
  - Keyboard navigation: `Left Arrow` (Prev), `Right Arrow` or `Space` (Next), `Home` (Cover), `End` (Back Cover).
  - Table of Contents slideout drawer with instant spread jumping.
  - Auto-play presentation mode.

## Project Architecture & Modular Structure

The codebase is organized into modular files for focused, friction-free workflows:

```
book.js/
├── index.html            # Main markup and 3D leaf structure
├── book.js               # Root module entry point (forwards to js/main.js)
├── styles.css            # Unified stylesheet import hub
├── css/
│   ├── variables.css     # Design tokens, color palette, book dimensions & easing curves
│   ├── base.css          # Resets, ambient background & scene lighting
│   ├── book-3d.css       # 3D stage, perspective, sheets, flip transforms & spine shadows
│   ├── book-content.css  # Leather cover foil, marbled endpapers & editorial typography
│   └── ui.css            # Navigation controls, bottom dock, TOC drawer & responsive rules
└── js/
    ├── audio.js          # Web Audio API paper rustle & flip audio synthesis
    ├── flip-engine.js    # 3D rotation, dynamic z-index scheduling & face lighting
    ├── responsive.js     # Viewport auto-scaler (--book-scale)
    ├── ui.js             # UI controls, scrub slider, TOC drawer, keyboard & auto-play
    └── main.js           # Main application coordinator & initialization
```

## Documentation

Detailed workspace documentation and technical guides are available in the **[`docs/`](docs/README.md)** directory:

- 📖 **[Architecture & Workspace Design](docs/architecture.md)**: System topology, modular boundaries, lifecycle & data flow.
- 📐 **[3D Flip Mechanics & Physics Engine](docs/flip-mechanics-3d.md)**: 3D geometry, pivot anchoring, and mathematical z-index scheduling.
- 🔖 **[Fore-Edge 3D Page Markers](docs/page-markers-3d.md)**: Geometry of protruding tabs, upright double-sided 3D typography, and hover elevation.
- 💡 **[Lighting Simulation & Procedural Audio](docs/lighting-and-audio.md)**: Dynamic shading models and Web Audio API synthesis.
- 🔍 **[Responsive Camera & Viewport Scaling](docs/responsive-and-camera.md)**: Auto-scaling algorithm, zoom multiplier (`1.15`), and cover overhang geometry.
- 🛠 **[Customization & Extension Cookbook](docs/customization-guide.md)**: Adding pages, modifying dimensions, and theme customization.
- 📚 **[API Reference Specification](docs/api-reference.md)**: Complete class methods, properties, and parameters.
- ⚠️ **[Troubleshooting & CSS 3D Pitfalls](docs/troubleshooting-and-pitfalls.md)**: Edge-case resolutions (CSS `filter` context flattening, inverted Z-axes).

## Running Locally

To run the local HTTP server:
```bash
python3 -m http.server 3088
```
Then navigate to: [http://localhost:3088](http://localhost:3088) in your browser.

