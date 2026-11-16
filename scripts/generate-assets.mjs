/**
 * AURA — gerador de renders ilustrativos.
 *
 * Produz as imagens de produto e editoriais da demonstração a partir de SVG
 * (texto convertido em contornos com opentype.js) e rasteriza em WebP com sharp.
 *
 * Estes renders são SUBSTITUTOS de fotografia. Para usar fotos reais, basta
 * substituir os arquivos em src/assets mantendo os mesmos nomes e proporções
 * (ver src/data/product-images.ts).
 *
 * Uso: npm run assets
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import opentype from "opentype.js";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const fontDir = (pkg) => path.join(root, "node_modules", "@fontsource", pkg, "files");
const loadFont = (pkg, file) =>
  opentype.parse(fs.readFileSync(path.join(fontDir(pkg), file)).buffer);

const fonts = {
  serif: loadFont("bodoni-moda", "bodoni-moda-latin-500-normal.woff"),
  serifItalic: loadFont("bodoni-moda", "bodoni-moda-latin-400-italic.woff"),
  sans: loadFont("jost", "jost-latin-400-normal.woff"),
  sansMedium: loadFont("jost", "jost-latin-500-normal.woff"),
};

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */

function text(fontKey, str, size, { x, y, anchor = "middle", tracking = 0, fill, opacity = 1 }) {
  const font = fonts[fontKey];
  const scale = size / font.unitsPerEm;
  const glyphs = font.stringToGlyphs(str);
  const advances = glyphs.map((g, i) => {
    const kern = i < glyphs.length - 1 ? font.getKerningValue(g, glyphs[i + 1]) * scale : 0;
    return g.advanceWidth * scale + kern + (i < glyphs.length - 1 ? tracking * size : 0);
  });
  const width = advances.reduce((a, b) => a + b, 0);
  let cx = anchor === "middle" ? x - width / 2 : anchor === "end" ? x - width : x;
  let d = "";
  glyphs.forEach((g, i) => {
    d += g.getPath(cx, y, size).toPathData(2);
    cx += advances[i];
  });
  return `<path d="${d}" fill="${fill}" opacity="${opacity}"/>`;
}

const hexToRgb = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const rgbToHex = (rgb) =>
  "#" + rgb.map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0")).join("");
const mix = (a, b, t) => {
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  return rgbToHex(A.map((v, i) => v + (B[i] - v) * t));
};
const shade = (hex, t) => (t < 0 ? mix(hex, "#120c0a", -t) : mix(hex, "#ffffff", t));

/** Gradiente horizontal que simula um cilindro com luz suave à esquerda. */
function cylinder(id, base, x1, x2, { gloss = 0.24, rim = 0.06 } = {}) {
  const stops = [
    [0, shade(base, -0.3)],
    [0.08, shade(base, -0.12)],
    [0.26, shade(base, gloss)],
    [0.36, shade(base, gloss * 0.45)],
    [0.55, base],
    [0.8, shade(base, -0.1)],
    [0.92, shade(base, -0.2)],
    [0.97, shade(base, rim)],
    [1, shade(base, -0.32)],
  ];
  return `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${x1}" y1="0" x2="${x2}" y2="0">${stops
    .map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`)
    .join("")}</linearGradient>`;
}

const CACAU = "#3b2621";
const INK = "#3a2520";
const IVORY = "#efe7de";

/* ------------------------------------------------------------------ */
/* produtos                                                            */
/* ------------------------------------------------------------------ */

const products = {
  cleanse: {
    name: "Cleanse",
    desc: "Gel de limpeza facial",
    size: "150 ml",
    body: "#d6c9b9",
    aura: "#b3b29d",
    bg: ["#e5e1d9", "#d2cdc2"],
    ritualBg: ["#cfc9bd", "#b9b2a4"],
    texture: { kind: "gel", bg: ["#d6d5c6", "#b9b8a3"], tone: "#e2e2d2" },
    shape: "tube",
    studioScale: 1.12,
  },
  hydrate: {
    name: "Hydrate",
    desc: "Sérum hidratante",
    size: "30 ml",
    body: "#e1c1b6",
    aura: "#d9a092",
    bg: ["#eee3dd", "#dccac1"],
    ritualBg: ["#dcc4ba", "#c3a69a"],
    texture: { kind: "drops", bg: ["#e2bfb3", "#c99a8c"], tone: "#f3dcd3" },
    shape: "dropper",
    studioScale: 1.18,
  },
  balance: {
    name: "Balance",
    desc: "Hidratante facial",
    size: "50 ml",
    body: "#d2bd9c",
    aura: "#d3b07c",
    bg: ["#ece3d5", "#d9cbb6"],
    ritualBg: ["#d8c7ad", "#bea98a"],
    texture: { kind: "cream", bg: ["#dccbb0", "#c2ab88"], tone: "#f2e8da" },
    shape: "pump",
    studioScale: 1.14,
  },
  restore: {
    name: "Restore",
    desc: "Creme noturno",
    size: "50 g",
    body: "#4d302a",
    lid: "#d8cec3",
    ink: IVORY,
    aura: "#8d5862",
    bg: ["#3e2a26", "#271a17"],
    ritualBg: ["#4a332e", "#2c1e1b"],
    texture: { kind: "balm", bg: ["#5a3a3c", "#2f1f1f"], tone: "#ead6cd" },
    shape: "jar",
    studioScale: 1.42,
  },
  protect: {
    name: "Protect",
    desc: "Proteção diária",
    size: "50 ml",
    body: "#e5cfac",
    aura: "#e3a971",
    bg: ["#f0e6d9", "#e1d0b9"],
    ritualBg: ["#e2cdb0", "#c9ab85"],
    texture: { kind: "fluid", bg: ["#e9c49c", "#d29d6c"], tone: "#f6e9d6" },
    shape: "flip",
    studioScale: 1.16,
  },
};

/** Texto impresso na embalagem — mesma hierarquia em toda a linha. */
function label(p, { top, bottom, ink = p.ink ?? INK, compact = false }) {
  const parts = [
    text("serif", "AURA", compact ? 30 : 34, { x: 300, y: top, tracking: 0.34, fill: ink }),
    text("serifItalic", p.name, compact ? 27 : 31, { x: 300, y: top + (compact ? 36 : 44), fill: ink }),
  ];
  if (compact) {
    parts.push(text("sans", `${p.desc}  ${p.size}`, 13, { x: 300, y: bottom, tracking: 0.08, fill: ink, opacity: 0.85 }));
  } else {
    parts.push(text("sans", p.desc, 13.5, { x: 300, y: bottom, tracking: 0.08, fill: ink, opacity: 0.85 }));
    parts.push(text("sans", p.size, 13, { x: 300, y: bottom + 22, tracking: 0.1, fill: ink, opacity: 0.7 }));
  }
  return parts.join("");
}

function shadowUnder(cx, y, rx) {
  return `
    <ellipse cx="${cx}" cy="${y + 2}" rx="${rx * 1.25}" ry="${rx * 0.12}" fill="#1a100d" opacity="0.18" filter="url(#softShadow)"/>
    <ellipse cx="${cx}" cy="${y}" rx="${rx}" ry="${rx * 0.06}" fill="#1a100d" opacity="0.42" filter="url(#contactShadow)"/>`;
}

const shapeDefs = `
  <filter id="contactShadow" x="-50%" y="-200%" width="200%" height="500%"><feGaussianBlur stdDeviation="5"/></filter>
  <filter id="softShadow" x="-50%" y="-300%" width="200%" height="700%"><feGaussianBlur stdDeviation="16"/></filter>
  <filter id="specBlur" x="-50%" y="-10%" width="200%" height="120%"><feGaussianBlur stdDeviation="5"/></filter>`;

/** Desenha o produto num quadro 600×900 com base em y=840. */
function productShape(slug) {
  const p = products[slug];
  const b = p.body;
  switch (p.shape) {
    case "tube":
      return {
        defs: `${cylinder("tBody", b, 198, 402)}${cylinder("tCap", CACAU, 232, 368, { gloss: 0.18 })}${cylinder(
          "tCrimp",
          shade(b, -0.05),
          192,
          408,
        )}`,
        body: `
          ${shadowUnder(300, 840, 72)}
          <rect x="232" y="772" width="136" height="68" rx="8" fill="url(#tCap)"/>
          <rect x="240" y="764" width="120" height="14" rx="3" fill="${shade(CACAU, -0.3)}"/>
          <path d="M240,768 C236,700 214,620 205,520 L198,200 L198,168 L402,168 L402,200 L395,520 C386,620 364,700 360,768 Z" fill="url(#tBody)"/>
          <rect x="192" y="118" width="216" height="56" rx="3" fill="url(#tCrimp)"/>
          ${Array.from({ length: 26 }, (_, i) => `<line x1="${198 + i * 8}" y1="124" x2="${198 + i * 8}" y2="168" stroke="${shade(b, -0.35)}" stroke-width="1" opacity="0.28"/>`).join("")}
          <rect x="192" y="168" width="216" height="5" fill="${shade(b, -0.25)}" opacity="0.5"/>
          <rect x="250" y="210" width="16" height="520" rx="8" fill="#fff" opacity="0.22" filter="url(#specBlur)"/>
          ${label(p, { top: 300, bottom: 640 })}`,
      };
    case "dropper": {
      const bodyPath =
        "M235,840 Q205,840 205,810 L205,478 Q205,440 243,432 L270,428 L270,400 L330,400 L330,428 L357,432 Q395,440 395,478 L395,810 Q395,840 365,840 Z";
      return {
        defs: `${cylinder("dBody", b, 205, 395, { gloss: 0.3, rim: 0.12 })}${cylinder("dLiquid", shade(b, -0.14), 205, 395)}${cylinder(
          "dBulb",
          CACAU,
          262,
          338,
          { gloss: 0.2 },
        )}${cylinder("dCollar", CACAU, 252, 348, { gloss: 0.16 })}<clipPath id="dClip"><path d="${bodyPath}"/></clipPath>`,
        body: `
          ${shadowUnder(300, 840, 96)}
          <path d="${bodyPath}" fill="url(#dBody)" opacity="0.96"/>
          <g clip-path="url(#dClip)">
            <rect x="200" y="572" width="200" height="280" fill="url(#dLiquid)" opacity="0.55"/>
            <rect x="200" y="572" width="200" height="3" fill="#fff" opacity="0.35"/>
            <rect x="292" y="404" width="16" height="398" rx="8" fill="#fff" opacity="0.26"/>
            <rect x="295" y="600" width="10" height="196" rx="5" fill="${shade(b, -0.25)}" opacity="0.45"/>
            <rect x="240" y="452" width="14" height="360" rx="7" fill="#fff" opacity="0.32" filter="url(#specBlur)"/>
            <rect x="372" y="470" width="6" height="330" rx="3" fill="#fff" opacity="0.18"/>
          </g>
          <rect x="252" y="352" width="96" height="60" rx="6" fill="url(#dCollar)"/>
          ${Array.from({ length: 6 }, (_, i) => `<line x1="254" y1="${360 + i * 8}" x2="346" y2="${360 + i * 8}" stroke="#000" stroke-width="1" opacity="0.14"/>`).join("")}
          <path d="M264,356 L264,252 Q264,172 300,170 Q336,172 336,252 L336,356 Z" fill="url(#dBulb)"/>
          <rect x="276" y="196" width="9" height="140" rx="4.5" fill="#fff" opacity="0.12" filter="url(#specBlur)"/>
          ${label(p, { top: 530, bottom: 752 })}`,
      };
    }
    case "pump":
      return {
        defs: `${cylinder("pBody", b, 218, 382)}${cylinder("pCap", CACAU, 232, 368, { gloss: 0.16 })}${cylinder(
          "pHead",
          CACAU,
          248,
          352,
          { gloss: 0.18 },
        )}`,
        body: `
          ${shadowUnder(300, 840, 86)}
          <rect x="218" y="330" width="164" height="510" rx="18" fill="url(#pBody)"/>
          <rect x="218" y="330" width="164" height="14" rx="4" fill="${shade(b, -0.22)}" opacity="0.6"/>
          <rect x="248" y="350" width="14" height="470" rx="7" fill="#fff" opacity="0.2" filter="url(#specBlur)"/>
          <rect x="232" y="282" width="136" height="54" rx="6" fill="url(#pCap)"/>
          <rect x="290" y="252" width="20" height="34" fill="${shade(CACAU, -0.25)}"/>
          <path d="M248,262 L248,214 Q248,200 262,200 L338,200 Q352,200 352,214 L352,232 L418,232 Q428,232 428,241 Q428,254 418,254 L352,254 L352,262 Z" fill="url(#pHead)"/>
          ${label(p, { top: 440, bottom: 752 })}`,
      };
    case "jar": {
      const lid = p.lid;
      return {
        defs: `${cylinder("jBody", b, 150, 450, { gloss: 0.3, rim: 0.18 })}${cylinder("jLid", lid, 142, 458, { gloss: 0.16 })}`,
        body: `
          ${shadowUnder(300, 840, 160)}
          <path d="M170,840 Q150,840 150,818 L150,672 Q150,652 170,650 L430,650 Q450,652 450,672 L450,818 Q450,840 430,840 Z" fill="url(#jBody)"/>
          <rect x="176" y="664" width="18" height="160" rx="9" fill="#fff" opacity="0.16" filter="url(#specBlur)"/>
          <rect x="166" y="636" width="268" height="18" fill="${shade(b, -0.3)}"/>
          <rect x="142" y="540" width="316" height="104" rx="16" fill="url(#jLid)"/>
          <rect x="150" y="544" width="300" height="6" rx="3" fill="#fff" opacity="0.35"/>
          ${Array.from({ length: 38 }, (_, i) => `<line x1="${150 + i * 8}" y1="560" x2="${150 + i * 8}" y2="636" stroke="#000" stroke-width="1" opacity="0.05"/>`).join("")}
          ${label(p, { top: 712, bottom: 802, compact: true })}`,
      };
    }
    case "flip":
      return {
        defs: `${cylinder("fBody", b, 222, 378)}${cylinder("fCap", CACAU, 246, 354, { gloss: 0.18 })}`,
        body: `
          ${shadowUnder(300, 840, 82)}
          <path d="M234,840 Q222,840 222,826 L222,432 Q222,372 268,364 L332,364 Q378,372 378,432 L378,826 Q378,840 366,840 Z" fill="url(#fBody)"/>
          <rect x="250" y="400" width="14" height="420" rx="7" fill="#fff" opacity="0.2" filter="url(#specBlur)"/>
          <rect x="246" y="262" width="108" height="108" rx="14" fill="url(#fCap)"/>
          <rect x="246" y="300" width="108" height="2" fill="#000" opacity="0.28"/>
          <rect x="286" y="296" width="28" height="8" rx="4" fill="${shade(CACAU, -0.3)}"/>
          ${label(p, { top: 480, bottom: 752 })}`,
      };
  }
  throw new Error(`forma desconhecida: ${p.shape}`);
}

/* ------------------------------------------------------------------ */
/* cenas                                                               */
/* ------------------------------------------------------------------ */

const grainFilter = (opacity = 0.07) => `
  <filter id="grain" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="7" result="n"/>
    <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.5  0 0 0 0 0.45  0 0 0 0 0.42  0 0 0 ${opacity * 3} 0"/>
  </filter>`;

const SHAPE_TOP = { tube: 118, dropper: 170, pump: 200, jar: 540, flip: 262 };
/** Escala para que o produto ocupe `height` px, limitada por `max`. */
const fitScale = (slug, height, max = 2.4) => Math.min(max, height / (840 - SHAPE_TOP[products[slug].shape]));

function placeProduct(slug, { cx, floor, scale }) {
  const shape = productShape(slug);
  const tx = cx - 300 * scale;
  const ty = floor - 840 * scale;
  return { defs: shape.defs, g: `<g transform="translate(${tx} ${ty}) scale(${scale})">${shape.body}</g>` };
}

function cutoutSvg(slug) {
  const s = productShape(slug);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="900" viewBox="0 0 600 900"><defs>${shapeDefs}${s.defs}</defs>${s.body}</svg>`;
}

function studioSvg(slug) {
  const p = products[slug];
  const W = 1200;
  const H = 1500;
  const floor = 1290;
  const prod = placeProduct(slug, { cx: 600, floor, scale: fitScale(slug, 930, 2.1) });
  const dark = slug === "restore";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    ${shapeDefs}${prod.defs}${grainFilter(dark ? 0.05 : 0.06)}
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.bg[0]}"/><stop offset="1" stop-color="${p.bg[1]}"/></linearGradient>
    <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${shade(p.bg[1], dark ? 0.06 : 0.12)}"/><stop offset="1" stop-color="${shade(p.bg[1], dark ? -0.2 : -0.06)}"/></linearGradient>
    <radialGradient id="aura" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${shade(p.aura, 0.25)}" stop-opacity="0.95"/><stop offset="0.45" stop-color="${p.aura}" stop-opacity="0.7"/><stop offset="1" stop-color="${p.aura}" stop-opacity="0"/></radialGradient>
    <radialGradient id="vig" cx="0.5" cy="0.45" r="0.75"><stop offset="0.6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#140c0a" stop-opacity="${dark ? 0.35 : 0.14}"/></radialGradient>
    <filter id="auraBlur" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="46"/></filter>
    <filter id="horizon" x="-10%" y="-50%" width="120%" height="200%"><feGaussianBlur stdDeviation="22"/></filter>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <ellipse cx="600" cy="${floor - 360}" rx="430" ry="470" fill="url(#aura)" filter="url(#auraBlur)"/>
  <ellipse cx="560" cy="${floor - 470}" rx="180" ry="200" fill="${shade(p.aura, 0.4)}" opacity="0.45" filter="url(#auraBlur)"/>
  <rect x="-100" y="${floor - 70}" width="${W + 200}" height="${H}" fill="url(#floor)" filter="url(#horizon)"/>
  ${prod.g}
  <rect width="${W}" height="${H}" fill="url(#vig)"/>
  <rect width="${W}" height="${H}" filter="url(#grain)"/>
</svg>`;
}

function ritualSvg(slug) {
  const p = products[slug];
  const W = 1200;
  const H = 1500;
  const top = 1130;
  const scale = fitScale(slug, 760, 1.75);
  const prod = placeProduct(slug, { cx: 560, floor: top + 6, scale });
  const dark = slug === "restore";
  const stone = dark ? "#6d5a52" : shade(p.ritualBg[1], -0.04);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    ${shapeDefs}${prod.defs}${grainFilter(0.06)}
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${p.ritualBg[0]}"/><stop offset="1" stop-color="${p.ritualBg[1]}"/></linearGradient>
    <radialGradient id="aura" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${shade(p.aura, 0.2)}" stop-opacity="0.85"/><stop offset="1" stop-color="${p.aura}" stop-opacity="0"/></radialGradient>
    <filter id="auraBlur" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="54"/></filter>
    <filter id="beam" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="40"/></filter>
    <filter id="castBlur" x="-30%" y="-100%" width="160%" height="300%"><feGaussianBlur stdDeviation="14"/></filter>
    <filter id="stone" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.004 0.05" numOctaves="5" seed="${slug.length * 13}" result="noise"/>
      <feDiffuseLighting in="noise" surfaceScale="4" diffuseConstant="0.98" lighting-color="${stone}" result="lit"><feDistantLight azimuth="210" elevation="58"/></feDiffuseLighting>
      <feComposite in="lit" in2="SourceAlpha" operator="in"/>
    </filter>
    <linearGradient id="faceShade" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0.1"/><stop offset="0.6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.22"/></linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <polygon points="-200,-100 520,-100 980,1500 260,1500" fill="#fff" opacity="${dark ? 0.06 : 0.16}" filter="url(#beam)"/>
  <ellipse cx="520" cy="${top - 330}" rx="360" ry="400" fill="url(#aura)" filter="url(#auraBlur)"/>
  <rect x="120" y="${top}" width="1180" height="${H - top}" fill="#000" filter="url(#stone)"/>
  <rect x="120" y="${top}" width="1180" height="${H - top}" fill="url(#faceShade)"/>
  <rect x="120" y="${top}" width="1180" height="2" fill="#fff" opacity="0.35"/>
  <rect x="120" y="${top + 2}" width="1180" height="40" fill="#000" opacity="0.07"/>
  <path d="M${560 + 30 * scale},${top + 6} L1180,${top - 4} L1180,${top + 44} L${560 + 10 * scale},${top + 30} Z" fill="#1a100d" opacity="0.26" filter="url(#castBlur)"/>
  ${prod.g}
  <rect width="${W}" height="${H}" filter="url(#grain)"/>
</svg>`;
}

const glossFilter = (id, { light = [380, 180, 520], blur = 16, scale = 7, exp = 26 } = {}) => `
  <filter id="${id}" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB">
    <feGaussianBlur in="SourceAlpha" stdDeviation="${blur}" result="blur"/>
    <feDiffuseLighting in="blur" surfaceScale="${scale}" diffuseConstant="1.15" lighting-color="#ffffff" result="diff"><feDistantLight azimuth="235" elevation="50"/></feDiffuseLighting>
    <feComposite in="diff" in2="SourceAlpha" operator="in" result="diffIn"/>
    <feBlend in="SourceGraphic" in2="diffIn" mode="multiply" result="shaded"/>
    <feSpecularLighting in="blur" surfaceScale="${scale}" specularConstant="0.85" specularExponent="${exp}" lighting-color="#ffffff" result="spec"><fePointLight x="${light[0]}" y="${light[1]}" z="${light[2]}"/></feSpecularLighting>
    <feComposite in="spec" in2="SourceAlpha" operator="in" result="specIn"/>
    <feComposite in="shaded" in2="specIn" operator="arithmetic" k1="0" k2="1" k3="0.9" k4="0"/>
  </filter>`;

function textureSvg(slug) {
  const p = products[slug];
  const t = p.texture;
  const W = 1200;
  const H = 1500;
  let art = "";
  let extra = "";
  // pseudo-aleatório determinístico
  let seed = slug.length * 977;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

  switch (t.kind) {
    case "gel": {
      extra = glossFilter("g", { blur: 22, scale: 9, exp: 30 });
      art = `
        <path d="M250,720 C230,520 420,380 620,400 C840,420 990,560 960,760 C930,960 760,1110 560,1090 C350,1070 270,900 250,720 Z" fill="#0e0a08" opacity="0.18" transform="translate(26 40)" filter="url(#drop)"/>
        <g filter="url(#g)" opacity="0.92">
          <path d="M250,720 C230,520 420,380 620,400 C840,420 990,560 960,760 C930,960 760,1110 560,1090 C350,1070 270,900 250,720 Z" fill="${t.tone}" fill-opacity="0.78"/>
          ${Array.from({ length: 18 }, () => {
            const x = 330 + rnd() * 560;
            const y = 480 + rnd() * 540;
            const r = 6 + rnd() * 18;
            return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="${shade(t.tone, 0.2)}"/>`;
          }).join("")}
        </g>`;
      break;
    }
    case "drops": {
      extra = glossFilter("g", { blur: 10, scale: 6, exp: 34, light: [420, 160, 380] });
      const drops = Array.from({ length: 34 }, () => {
        const x = 120 + rnd() * 960;
        const y = 140 + rnd() * 1220;
        const r = 14 + Math.pow(rnd(), 2.2) * 120;
        return { x, y, r };
      });
      art = `
        ${drops.map((d) => `<ellipse cx="${(d.x + d.r * 0.18).toFixed(1)}" cy="${(d.y + d.r * 0.28).toFixed(1)}" rx="${d.r.toFixed(1)}" ry="${(d.r * 0.92).toFixed(1)}" fill="#3a1d16" opacity="0.16" filter="url(#drop)"/>`).join("")}
        <g filter="url(#g)">
          ${drops.map((d) => `<ellipse cx="${d.x.toFixed(1)}" cy="${d.y.toFixed(1)}" rx="${d.r.toFixed(1)}" ry="${(d.r * 0.94).toFixed(1)}" fill="${t.tone}" fill-opacity="0.82"/>`).join("")}
        </g>`;
      break;
    }
    case "cream":
    case "balm": {
      extra = glossFilter("g", { blur: t.kind === "balm" ? 20 : 18, scale: 10, exp: t.kind === "balm" ? 18 : 22 });
      const swirl =
        t.kind === "cream"
          ? "M260,1040 C200,820 340,560 600,560 C820,560 900,760 790,880 C690,990 520,930 540,800 C556,700 690,700 700,780"
          : "M300,980 C240,760 380,560 610,580 C830,600 910,800 800,920 C700,1020 520,960 520,830 C520,740 640,720 680,790";
      art = `
        <path d="${swirl}" fill="none" stroke="#120806" stroke-width="150" stroke-linecap="round" opacity="0.2" transform="translate(30 46)" filter="url(#drop)"/>
        <g filter="url(#g)">
          <path d="${swirl}" fill="none" stroke="${t.tone}" stroke-width="150" stroke-linecap="round"/>
          <path d="${swirl}" fill="none" stroke="${shade(t.tone, -0.06)}" stroke-width="30" stroke-linecap="round" opacity="0.6" transform="translate(-10 -8)"/>
        </g>`;
      break;
    }
    case "fluid": {
      extra = glossFilter("g", { blur: 14, scale: 7, exp: 24 });
      const smear = "M170,1150 C360,1110 470,940 620,800 C760,670 900,600 1030,560";
      art = `
        <path d="${smear}" fill="none" stroke="#2b140a" stroke-width="170" stroke-linecap="round" opacity="0.16" transform="translate(26 44)" filter="url(#drop)"/>
        <g filter="url(#g)">
          <path d="${smear}" fill="none" stroke="${t.tone}" stroke-width="170" stroke-linecap="round"/>
          <path d="${smear}" fill="none" stroke="${shade(t.tone, 0.3)}" stroke-width="60" stroke-linecap="round" opacity="0.55" transform="translate(-14 -18)"/>
        </g>`;
      break;
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    ${grainFilter(0.07)}${extra}
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${t.bg[0]}"/><stop offset="1" stop-color="${t.bg[1]}"/></linearGradient>
    <radialGradient id="glow" cx="0.38" cy="0.3" r="0.7"><stop offset="0" stop-color="#fff" stop-opacity="0.32"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
    <filter id="drop" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="22"/></filter>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  ${art}
  <rect width="${W}" height="${H}" filter="url(#grain)"/>
</svg>`;
}

/* ------------------------------------------------------------------ */
/* editoriais                                                          */
/* ------------------------------------------------------------------ */

/** Natureza-morta editorial: três fórmulas sobre pedra, em profundidades diferentes. */
function ensembleSvg() {
  const W = 1200;
  const H = 1500;
  const top = 1060;
  const back1 = placeProduct("hydrate", { cx: 430, floor: top + 30, scale: fitScale("hydrate", 560) });
  const back2 = placeProduct("cleanse", { cx: 790, floor: top + 20, scale: fitScale("cleanse", 690) });
  const front = placeProduct("restore", { cx: 600, floor: top + 190, scale: 1.25 });
  const cast = (x, y, len, w) =>
    `<path d="M${x},${y} L${x + len},${y - 14} L${x + len},${y + w} L${x},${y + 10} Z" fill="#1a100d" opacity="0.24" filter="url(#castBlur)"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    ${shapeDefs}${back1.defs}${back2.defs}${front.defs}${grainFilter(0.06)}
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ddd0c4"/><stop offset="1" stop-color="#b9a597"/></linearGradient>
    <radialGradient id="aura" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#e4b1a3" stop-opacity="0.9"/><stop offset="1" stop-color="#d69e90" stop-opacity="0"/></radialGradient>
    <filter id="auraBlur" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="60"/></filter>
    <filter id="beam" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="46"/></filter>
    <filter id="castBlur" x="-30%" y="-100%" width="160%" height="300%"><feGaussianBlur stdDeviation="16"/></filter>
    <filter id="stone" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.0045 0.04" numOctaves="5" seed="17" result="noise"/>
      <feDiffuseLighting in="noise" surfaceScale="4" diffuseConstant="0.98" lighting-color="#c9b8aa" result="lit"><feDistantLight azimuth="210" elevation="58"/></feDiffuseLighting>
      <feComposite in="lit" in2="SourceAlpha" operator="in"/>
    </filter>
    <linearGradient id="faceShade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0.12"/><stop offset="1" stop-color="#2a1915" stop-opacity="0.35"/></linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <polygon points="-260,-100 460,-100 1000,1500 220,1500" fill="#fff6ee" opacity="0.22" filter="url(#beam)"/>
  <ellipse cx="610" cy="${top - 380}" rx="440" ry="470" fill="url(#aura)" filter="url(#auraBlur)"/>
  <rect x="0" y="${top}" width="${W}" height="${H - top}" fill="#000" filter="url(#stone)"/>
  <rect x="0" y="${top}" width="${W}" height="${H - top}" fill="url(#faceShade)"/>
  <rect x="0" y="${top}" width="${W}" height="2" fill="#fff" opacity="0.35"/>
  ${cast(470, top + 26, 380, 30)}${cast(830, top + 16, 370, 34)}
  ${back1.g}${back2.g}
  ${cast(700, top + 186, 500, 46)}
  ${front.g}
  <rect width="${W}" height="${H}" filter="url(#grain)"/>
</svg>`;
}

function ogSvg() {
  const W = 1200;
  const H = 630;
  const prod = placeProduct("hydrate", { cx: 860, floor: 600, scale: 0.68 });
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    ${shapeDefs}${prod.defs}${grainFilter(0.05)}
    <radialGradient id="aura" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#e6b4a7" stop-opacity="0.95"/><stop offset="1" stop-color="#d9a092" stop-opacity="0"/></radialGradient>
    <filter id="blur" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="40"/></filter>
  </defs>
  <rect width="${W}" height="${H}" fill="#ece6e0"/>
  <ellipse cx="860" cy="330" rx="300" ry="300" fill="url(#aura)" filter="url(#blur)"/>
  ${prod.g}
  ${text("serif", "AURA", 30, { x: 90, y: 120, anchor: "start", tracking: 0.34, fill: INK })}
  ${text("serif", "Sua essência,", 74, { x: 86, y: 330, anchor: "start", tracking: -0.02, fill: "#201b19" })}
  ${text("serifItalic", "em cada cuidado.", 74, { x: 86, y: 418, anchor: "start", tracking: -0.01, fill: "#201b19" })}
  ${text("sans", "Skincare & Beauty — projeto conceitual", 22, { x: 90, y: 530, anchor: "start", tracking: 0.02, fill: "#5c4a44" })}
  <rect width="${W}" height="${H}" filter="url(#grain)"/>
</svg>`;
}

function iconSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#3a2520"/>
  ${text("serif", "A", 44, { x: 32, y: 47, fill: "#efe7de" })}
</svg>`;
}

/* ------------------------------------------------------------------ */
/* saída                                                               */
/* ------------------------------------------------------------------ */

async function write(svg, out, { width, quality = 82, format = "webp", alpha = false }) {
  fs.mkdirSync(path.dirname(out), { recursive: true });
  let img = sharp(Buffer.from(svg), { density: 144 }).resize({ width });
  if (format === "webp") img = img.webp({ quality, alphaQuality: alpha ? 90 : 100, effort: 5 });
  if (format === "jpg") img = img.jpeg({ quality, mozjpeg: true });
  if (format === "png") img = img.png();
  await img.toFile(out);
  const kb = (fs.statSync(out).size / 1024).toFixed(0);
  console.log(`  ${path.relative(root, out)}  ${kb} KB`);
}

const productsOut = path.join(root, "src", "assets", "products");
const editorialOut = path.join(root, "src", "assets", "editorial");

// `npm run assets -- editorial` gera só as imagens editoriais.
const onlyEditorial = process.argv[2] === "editorial";

console.log("Gerando renders AURA…");
if (!onlyEditorial) {
  for (const slug of Object.keys(products)) {
    await write(cutoutSvg(slug), path.join(productsOut, `${slug}-cutout.webp`), { width: 1000, quality: 88, alpha: true });
    await write(studioSvg(slug), path.join(productsOut, `${slug}-studio.webp`), { width: 1500 });
    await write(ritualSvg(slug), path.join(productsOut, `${slug}-ritual.webp`), { width: 1500 });
    await write(textureSvg(slug), path.join(productsOut, `${slug}-texture.webp`), { width: 1500 });
  }
}
await write(ensembleSvg(), path.join(editorialOut, "ritual-set.webp"), { width: 1500 });
await write(ogSvg(), path.join(root, "public", "og.jpg"), { width: 1200, format: "jpg", quality: 86 });
fs.writeFileSync(path.join(root, "src", "app", "icon.svg"), iconSvg());
console.log("  src/app/icon.svg");
console.log("Pronto.");
