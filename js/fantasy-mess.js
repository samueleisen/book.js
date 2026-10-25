/**
 * LUMINA & FORM — FANTASY MESS & ARCANE GLYPHS GENERATOR
 * Generates chaotic, layered arcane scribbles, occult sigils, alchemy symbols,
 * compass scratch marks, ink splatters, and struck-out formulas across all skipped sheets.
 */

const ALCHEMY_GLYPHS = [
  '🜂', '🜄', '🜁', '🜃', '🜍', '🜕', '🝤', '🝯', '🜔', '🜚', '🜛', '🜞', '🜟',
  '☉', '☽', '☿', '♀', '♂', '♃', '♄', '♅', '♆', '♇',
  '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓',
  'ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚺ', 'ᚾ', 'ᛁ', 'ᛃ', 'ᛇ', 'ᛈ', 'ᛉ', 'ᛋ', 'ᛏ', 'ᛒ', 'ᛖ', 'ᛗ', 'ᛚ', 'ᛜ', 'ᛞ', 'ᛟ',
  '⚝', '⚚', '⚛', '✦', '✧', '✶', '✷', '✸', '✹', '✺', '❖', '❦', '❧', '☩', '☬', '☸'
];

const SCRIBBLINGS = [
  'NON LVX SED TENEBRAE',
  'V.I.T.R.I.O.L. 🜕 🜔',
  'IGNIS 🜂 AER 🜁 AQVA 🜄 TERRA 🜃',
  'SOLVE ET COAGULA',
  'ΔE / Δt = ∞ • [CORRUPTIO]',
  'ᚦᚱᚨᚲᛋ ⇋ 0x9B4F • CAVEAT',
  'ordo ab chao ☉ ☽ ☿',
  '♄ (Saturnus) → ♃ (Jupiter) 1.618033',
  'azoth fluxus: ∑ 🝤 = 🜍 + 🜕',
  'trans-mutatio caduca [ERRATUM]',
  'ᛟᛞᛗᛖ • SECTIO AUREA • 72°',
  'limen umbrae: ∇ × B ≠ 0',
  'quinta essentia: 🝤 🝤 🝤',
  'anathema sit ❦ ❖',
  'dΩ / dt ≠ 0 • caduceus balance',
  'nigredo → albedo → rubedo 🜍',
  'circulus clausus [REJECTED]',
  'occultum lapidem invenies',
  'ᚱᛖᛞᚨᚲᛏᛖᛞ • ARCHIVE SEAL',
  'ignis ardens non consumitur',
  'prima materia: 🜔 + ☿',
  'coagulum fractum est!',
  'tabula smaragdina • HERMES',
  'as above, so below ☉ ☽',
  'arcana arcanorum ⚚ ☿',
  'mysterium cosmographicum',
  'clavis aurea: 🜕 ⇋ 🜂',
  'sigillum secretum • NON TANGERE'
];

const INK_COLORS = [
  '#2c3e50', // dark mystical slate/charcoal
  '#8b3a2b', // alchemy crimson / cinnabar
  '#d4af37', // antique gold
  '#8b7355', // sepia ink
  '#4a3e30', // bistre brown
  '#1a2430'  // midnight ink
];

function rand(min, max) {
  return min + Math.random() * (max - min);
}

function randInt(min, max) {
  return Math.floor(rand(min, max + 1));
}

function choice(array) {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Generates an SVG path for an N-pointed regular star or polygon.
 */
function makeStarPath(cx, cy, rOuter, rInner, points) {
  let path = '';
  const step = Math.PI / points;
  for (let i = 0; i < 2 * points; i++) {
    const r = i % 2 === 0 ? rOuter : rInner;
    const angle = i * step - Math.PI / 2;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    path += (i === 0 ? `M${x.toFixed(1)},${y.toFixed(1)}` : ` L${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return path + ' Z';
}

/**
 * Generates chaotic multi-layered fantasy SVG markup for a single page face.
 */
export function generateFantasyMessSVG() {
  const width = 380;
  const height = 532;
  const elements = [];

  // 1. Compass scratch arcs & chaotic construction lines
  const numScratches = randInt(4, 8);
  for (let i = 0; i < numScratches; i++) {
    const sx = rand(30, width - 30);
    const sy = rand(40, height - 40);
    const sr = rand(60, 180);
    const startAngle = rand(0, 360);
    const endAngle = startAngle + rand(40, 140);
    const rad1 = (startAngle * Math.PI) / 180;
    const rad2 = (endAngle * Math.PI) / 180;
    const x1 = sx + sr * Math.cos(rad1);
    const y1 = sy + sr * Math.sin(rad1);
    const x2 = sx + sr * Math.cos(rad2);
    const y2 = sy + sr * Math.sin(rad2);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    elements.push(
      `<path d="M${x1.toFixed(1)},${y1.toFixed(1)} A${sr.toFixed(1)},${sr.toFixed(1)} 0 ${largeArc},1 ${x2.toFixed(1)},${y2.toFixed(1)}" stroke="#8b7355" stroke-width="${rand(0.5, 0.9).toFixed(1)}" stroke-dasharray="${choice(['2 3', '4 2', '1 2', 'none'])}" opacity="${rand(0.25, 0.55).toFixed(2)}" fill="none"/>`
    );
  }

  // 2. Main Arcane Sigil / Magic Summoning Array
  const sigilCx = rand(140, 240);
  const sigilCy = rand(180, 320);
  const mainR = rand(70, 115);
  const numRings = randInt(2, 4);

  for (let r = 0; r < numRings; r++) {
    const ringRadius = mainR - r * rand(12, 22);
    if (ringRadius > 15) {
      const ringStroke = choice(['#2c3e50', '#8b7355', '#d4af37']);
      const ringDash = choice(['none', '3 2', '6 3 2 3', '1 2']);
      elements.push(
        `<circle cx="${sigilCx.toFixed(1)}" cy="${sigilCy.toFixed(1)}" r="${ringRadius.toFixed(1)}" stroke="${ringStroke}" stroke-width="${rand(0.7, 1.4).toFixed(1)}" stroke-dasharray="${ringDash}" opacity="${rand(0.4, 0.85).toFixed(2)}" fill="none"/>`
      );
    }
  }

  // Star polygon inside sigil
  const starPoints = choice([5, 6, 7, 8]);
  const innerR = mainR * rand(0.35, 0.55);
  const starPath = makeStarPath(sigilCx, sigilCy, mainR * 0.85, innerR, starPoints);
  const starColor = choice(['#d4af37', '#8b3a2b', '#2c3e50']);
  elements.push(
    `<path d="${starPath}" stroke="${starColor}" stroke-width="${rand(0.8, 1.5).toFixed(1)}" opacity="${rand(0.45, 0.85).toFixed(2)}" fill="${starColor}" fill-opacity="${rand(0.02, 0.06).toFixed(3)}"/>`
  );

  // Circumference Glyphs around Sigil
  const numSigilGlyphs = randInt(8, 14);
  for (let g = 0; g < numSigilGlyphs; g++) {
    const angle = (g * 2 * Math.PI) / numSigilGlyphs + rand(-0.1, 0.1);
    const glyphR = mainR * rand(0.9, 1.05);
    const gx = sigilCx + glyphR * Math.cos(angle);
    const gy = sigilCy + glyphR * Math.sin(angle);
    const rot = (angle * 180) / Math.PI + 90 + rand(-15, 15);
    const glyph = choice(ALCHEMY_GLYPHS);
    elements.push(
      `<text x="${gx.toFixed(1)}" y="${gy.toFixed(1)}" font-family="'Cinzel', serif" font-size="${randInt(11, 16)}" fill="${choice(INK_COLORS)}" opacity="${rand(0.5, 0.9).toFixed(2)}" transform="rotate(${rot.toFixed(1)}, ${gx.toFixed(1)}, ${gy.toFixed(1)})" text-anchor="middle" dominant-baseline="central">${glyph}</text>`
    );
  }

  // Interlocking Secondary Orbital Circle
  const secCx = sigilCx + rand(-55, 55);
  const secCy = sigilCy + rand(-60, 60);
  const secR = mainR * rand(0.45, 0.7);
  elements.push(
    `<circle cx="${secCx.toFixed(1)}" cy="${secCy.toFixed(1)}" r="${secR.toFixed(1)}" stroke="#d4af37" stroke-width="0.9" stroke-dasharray="4 2" opacity="0.6" fill="none"/>`
  );

  // Radiating Tangent / Sector Rays across the page
  const numRays = randInt(4, 8);
  for (let i = 0; i < numRays; i++) {
    const angle = rand(0, 360) * (Math.PI / 180);
    const len = rand(180, 320);
    const x2 = sigilCx + len * Math.cos(angle);
    const y2 = sigilCy + len * Math.sin(angle);
    elements.push(
      `<line x1="${sigilCx.toFixed(1)}" y1="${sigilCy.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${choice(['#d4af37', '#8b7355', '#2c3e50'])}" stroke-width="${rand(0.5, 1.1).toFixed(1)}" stroke-dasharray="${choice(['none', '3 2', '6 3'])}" opacity="${rand(0.35, 0.75).toFixed(2)}"/>`
    );
  }

  // 3. Constellation Node Network
  const nodeCount = randInt(4, 7);
  const nodes = [];
  for (let i = 0; i < nodeCount; i++) {
    nodes.push({
      x: rand(40, width - 40),
      y: rand(45, height - 45)
    });
  }
  for (let i = 0; i < nodes.length - 1; i++) {
    elements.push(
      `<line x1="${nodes[i].x.toFixed(1)}" y1="${nodes[i].y.toFixed(1)}" x2="${nodes[i + 1].x.toFixed(1)}" y2="${nodes[i + 1].y.toFixed(1)}" stroke="#d4af37" stroke-width="0.8" stroke-dasharray="2 3" opacity="0.65"/>`
    );
  }
  nodes.forEach(n => {
    elements.push(
      `<circle cx="${n.x.toFixed(1)}" cy="${n.y.toFixed(1)}" r="${rand(2, 4.5).toFixed(1)}" fill="${choice(['#d4af37', '#8b3a2b', '#2c3e50'])}" opacity="0.8"/>`
    );
  });

  // 4. Random Scattered Alchemy Glyphs & Runes (Wild density)
  const numScattered = randInt(14, 26);
  for (let i = 0; i < numScattered; i++) {
    const rx = rand(30, width - 30);
    const ry = rand(40, height - 40);
    const rot = rand(-55, 55);
    const size = randInt(12, 28);
    const glyph = choice(ALCHEMY_GLYPHS);
    const col = choice(INK_COLORS);
    elements.push(
      `<text x="${rx.toFixed(1)}" y="${ry.toFixed(1)}" font-family="'Cinzel', serif" font-size="${size}" fill="${col}" opacity="${rand(0.4, 0.9).toFixed(2)}" transform="rotate(${rot.toFixed(1)}, ${rx.toFixed(1)}, ${ry.toFixed(1)})" text-anchor="middle">${glyph}</text>`
    );
  }

  // 5. Chaotic Handwritten Scribbles & Struck-Through Notes
  const numNotes = randInt(4, 7);
  for (let i = 0; i < numNotes; i++) {
    const text = choice(SCRIBBLINGS);
    const tx = rand(25, width - 180);
    const ty = rand(45, height - 35);
    const rot = rand(-24, 24);
    const fontSize = rand(8.5, 12).toFixed(1);
    const col = choice(INK_COLORS);
    const opacity = rand(0.55, 0.95).toFixed(2);

    elements.push(
      `<text x="${tx.toFixed(1)}" y="${ty.toFixed(1)}" font-family="'Cormorant Garamond', Georgia, serif" font-size="${fontSize}" font-style="italic" font-weight="600" fill="${col}" opacity="${opacity}" transform="rotate(${rot.toFixed(1)}, ${tx.toFixed(1)}, ${ty.toFixed(1)})" letter-spacing="0.5">${text}</text>`
    );

    // Strikethrough on some notes (messy crossed-out line)
    if (Math.random() < 0.45) {
      const textLen = text.length * 5.5;
      const lx1 = tx - 4;
      const ly1 = ty - 3;
      const lx2 = tx + textLen;
      const ly2 = ty - 3 + rand(-3, 3);
      elements.push(
        `<line x1="${lx1.toFixed(1)}" y1="${ly1.toFixed(1)}" x2="${lx2.toFixed(1)}" y2="${ly2.toFixed(1)}" stroke="${choice(['#8b3a2b', '#2c3e50'])}" stroke-width="${rand(1.2, 2.0).toFixed(1)}" opacity="0.8" transform="rotate(${rot.toFixed(1)}, ${tx.toFixed(1)}, ${ty.toFixed(1)})"/>`
      );
    }
  }

  // 6. Ink Splatters, Drips & Blotches
  const numSplatters = randInt(10, 22);
  for (let i = 0; i < numSplatters; i++) {
    const bx = rand(25, width - 25);
    const by = rand(30, height - 30);
    const br = rand(1.2, 5.5);
    const bColor = choice(['#8b3a2b', '#2c3e50', '#8b7355', '#1a2430']);
    elements.push(
      `<circle cx="${bx.toFixed(1)}" cy="${by.toFixed(1)}" r="${br.toFixed(1)}" fill="${bColor}" opacity="${rand(0.35, 0.85).toFixed(2)}"/>`
    );

    // Tiny satellite drop nearby
    if (Math.random() < 0.6) {
      const satDist = rand(5, 14);
      const satAngle = rand(0, 360) * (Math.PI / 180);
      const sx = bx + satDist * Math.cos(satAngle);
      const sy = by + satDist * Math.sin(satAngle);
      elements.push(
        `<circle cx="${sx.toFixed(1)}" cy="${sy.toFixed(1)}" r="${rand(0.6, 1.8).toFixed(1)}" fill="${bColor}" opacity="${rand(0.3, 0.7).toFixed(2)}"/>`
      );
    }
  }

  // 7. Margin Degree Coordinates & Arcane Numbers
  const numCoords = randInt(4, 7);
  for (let i = 0; i < numCoords; i++) {
    const cx = rand(20, width - 40);
    const cy = rand(25, height - 25);
    const coordStr = choice([
      'θ = ' + rand(12, 88).toFixed(1) + '°',
      'λ = ' + randInt(380, 720) + 'nm',
      'Φ = 1.618033',
      '§ ' + randInt(1, 99) + '.' + choice(['IV', 'VII', 'IX', 'XII', 'XVIII']),
      '0x' + Math.floor(Math.random() * 0xffff).toString(16).toUpperCase(),
      'Δ = ' + rand(0.1, 9.9).toFixed(2),
      '♄ ' + randInt(10, 90) + '°'
    ]);
    elements.push(
      `<text x="${cx.toFixed(1)}" y="${cy.toFixed(1)}" font-family="'Plus Jakarta Sans', sans-serif" font-size="7" fill="#8b7355" opacity="${rand(0.4, 0.75).toFixed(2)}" letter-spacing="1">${coordStr}</text>`
    );
  }

  return `<svg class="fantasy-mess-svg" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    ${elements.join('\n    ')}
  </svg>`;
}

/**
 * Builds the complete outer markup for a fantasy mess filler page.
 */
export function buildFantasyMessHTML(options = {}) {
  const sheetNum = options.sheetNum || '';
  const svg = generateFantasyMessSVG();

  return `
    <div class="fantasy-mess-layout" title="Arcane Grimoire Notes • Sheet ${sheetNum}">
      ${svg}
    </div>
  `;
}

/**
 * Populates all blank paper containers across skipped sheets with procedural fantasy mess & symbols.
 */
export function populateBlankPages(bookElement = document.getElementById('book')) {
  if (!bookElement) return;

  const blankContainers = bookElement.querySelectorAll('.page-sheet .face-paper .blank-page-layout');
  if (!blankContainers || blankContainers.length === 0) return;

  blankContainers.forEach((container) => {
    const sheet = container.closest('.page-sheet');
    const sheetNum = sheet ? sheet.getAttribute('data-sheet') : '';
    container.innerHTML = buildFantasyMessHTML({ sheetNum });
  });
}

// Global runtime hook for re-rolling the chaotic fantasy mess anytime
if (typeof window !== 'undefined') {
  window.randomizeFantasyMess = () => {
    populateBlankPages(document.getElementById('book'));
  };
  // Backward compatibility alias
  window.randomizeStudyGraphs = window.randomizeFantasyMess;
}
