# Lumina & Form — Workspace Documentation

Welcome to the comprehensive documentation for the **Lumina & Form 3D Book Experience**. This workspace provides a high-performance, physics-accurate 3D interactive book interface constructed entirely with vanilla HTML5, CSS3 3D Transforms, and ES6 JavaScript.

---

## 📚 Documentation Index

| Document | Description |
| :--- | :--- |
| **[Architecture & Workspace Overview](architecture.md)** | System topology, modular component relationships, bootstrap lifecycle, and directory layout. |
| **[3D Flip Mechanics & Stacking Engine](flip-mechanics-3d.md)** | Geometry of 3D transforms, rotation axes, mathematical z-index scheduling, and viewport centering. |
| **[Lighting & Audio Synthesis](lighting-and-audio.md)** | Physics-based illumination (gutter shadows, dynamic flip overlays, desk occlusion) and Web Audio API synthesis. |
| **[Customization & Extension Guide](customization-guide.md)** | Step-by-step instructions for adding new pages, altering dimensions, changing themes, and dynamic data loading. |
| **[API Reference](api-reference.md)** | Complete developer specification for `FlipEngine`, `BookAudio`, `BookUI`, `BookResponsive`, and `BookApp`. |

---

## 🗂 Workspace Anatomy at a Glance

```
book.js/
├── index.html                  # Master HTML markup & semantic page sheets
├── book.js                     # Root ES6 module entry point
├── styles.css                  # Unified CSS import hub
├── README.md                   # Repository overview & quickstart
│
├── css/                        # Modular stylesheet architecture
│   ├── variables.css           # Design tokens, color palette, dimensions & easing curves
│   ├── base.css                # CSS reset, body styles, ambient background & scene lighting
│   ├── book-3d.css             # 3D stage, perspective, sheets, transforms, spine & lighting
│   ├── book-content.css        # Hardcover leather texture, gold foil, endpapers & typography
│   └── ui.css                  # Top navigation, floating arrows, bottom dock scrubber & TOC drawer
│
├── js/                         # Decoupled ES6 application modules
│   ├── audio.js                # Web Audio API procedural paper rustle & woosh synthesizer
│   ├── flip-engine.js          # Core 3D rotation, dynamic z-index hierarchy & face shading
│   ├── responsive.js           # Viewport auto-scaler calculating --book-scale
│   ├── ui.js                   # Event bindings for controls, slider scrubber, keyboard & TOC
│   └── main.js                 # Orchestrator assembling and bootstrapping the application
│
└── docs/                       # Comprehensive workspace documentation suite
    ├── README.md               # Documentation directory index (this file)
    ├── architecture.md         # Architecture, design philosophy & data flow
    ├── flip-mechanics-3d.md    # 3D transforms, pivot geometry & stacking algorithms
    ├── lighting-and-audio.md   # Dynamic shadow overlays & Web Audio synthesis
    ├── customization-guide.md  # How to add pages, resize, retheme & customize
    └── api-reference.md        # Class methods, parameters, options & callbacks
```

---

## ⚡ Quick Start

### 1. Launch the Local Dev Server
The project requires a local HTTP server to satisfy standard browser security policies for ES6 modules and Web Audio API:

```bash
# Python 3
python3 -m http.server 3088
```

### 2. Open in Browser
Visit **[http://localhost:3088](http://localhost:3088)** in any modern browser (Chrome, Edge, Safari, Firefox).

### 3. Core Interactions
- **Click Page Edge / Corners**: Turns forward on the right page, backward on the left page.
- **Stage Navigation**: Floating `<` and `>` arrow buttons.
- **Bottom Dock Scrubber**: Drag or click the range slider to fast-scrub between spreads.
- **Keyboard Shortcuts**:
  - `→` / `Space`: Flip forward
  - `←`: Flip backward
  - `Home`: Jump directly to Front Cover
  - `End`: Jump directly to Back Cover
- **Table of Contents**: Click `Contents` in the top header to slide open chapter index.
- **Auto-Play**: Click `Auto` to activate hands-free page turning every 3.4 seconds.
- **Audio Toggle**: Click `Sound` to toggle the procedural paper flick sound effect.
