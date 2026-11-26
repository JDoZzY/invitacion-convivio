/* =====================================================================
   DECORACIÓN · Ilustraciones SVG generadas (ligeras y reutilizables)
   Ramas de pino, sello de lacre, guirnalda de luces, esferas, corona,
   bosque, destellos y partículas del sello.
   ===================================================================== */
(function (PSC) {
  "use strict";

  /* Generador pseudoaleatorio con semilla: mismo dibujo en cada visita */
  function rng(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const f = (n) => Math.round(n * 10) / 10;
  const quad = (p0, p1, p2, t) => [
    (1 - t) * (1 - t) * p0[0] + 2 * (1 - t) * t * p1[0] + t * t * p2[0],
    (1 - t) * (1 - t) * p0[1] + 2 * (1 - t) * t * p1[1] + t * t * p2[1],
  ];

  const NEEDLE_GREENS = ["#06331a", "#0a4520", "#0e5626", "#13692d", "#1d7c38"];

  /** Agujas de pino a lo largo de una curva; devuelve segmentos agrupados por color. */
  function needles(buckets, curve, opts, rand) {
    const { steps, len, spread = 0.95 } = opts;
    for (let i = 1; i <= steps; i++) {
      const s = i / steps;
      const p = curve(s);
      const q = curve(Math.min(1, s + 0.01));
      const dir = Math.atan2(q[1] - p[1], q[0] - p[0]);
      for (const side of [-1, 1]) {
        const a = dir + side * (spread * 0.55 + rand() * spread * 0.45);
        const l = len * (1 - 0.5 * s) * (0.8 + rand() * 0.4);
        const c = Math.floor(rand() * NEEDLE_GREENS.length);
        buckets[c].push(`M${f(p[0])} ${f(p[1])}l${f(Math.cos(a) * l)} ${f(Math.sin(a) * l)}`);
      }
    }
  }
  const bucketsToPaths = (buckets, width) =>
    buckets
      .map((d, i) => `<path d="${d.join("")}" stroke="${NEEDLE_GREENS[i]}" stroke-width="${width}" stroke-linecap="round" fill="none"/>`)
      .join("");

  /** Rama de pino con piña y bayas (símbolo #s-pino). */
  function pineSymbol() {
    const rand = rng(11);
    const buckets = NEEDLE_GREENS.map(() => []);
    const P0 = [8, 30], P1 = [190, 70], P2 = [392, 168];
    const stem = (t) => quad(P0, P1, P2, t);
    let twigs = "";

    [0.14, 0.27, 0.4, 0.53, 0.66, 0.79].forEach((t, i) => {
      const base = stem(t);
      const nxt = stem(t + 0.01);
      const dir = Math.atan2(nxt[1] - base[1], nxt[0] - base[0]);
      const side = i % 2 ? 1 : -1;
      const ang = dir + side * (0.5 + rand() * 0.25);
      const L = 120 * (1 - 0.55 * t);
      const end = [base[0] + Math.cos(ang) * L, base[1] + Math.sin(ang) * L];
      const ctrl = [base[0] + Math.cos(ang - side * 0.25) * L * 0.5, base[1] + Math.sin(ang - side * 0.25) * L * 0.5];
      twigs += `M${f(base[0])} ${f(base[1])}Q${f(ctrl[0])} ${f(ctrl[1])} ${f(end[0])} ${f(end[1])}`;
      needles(buckets, (s) => quad(base, ctrl, end, s), { steps: 26, len: 27 }, rand);
    });
    needles(buckets, stem, { steps: 70, len: 36 }, rand);

    const cone = (x, y, r) => {
      let scales = "";
      for (let k = 0; k < 5; k++) scales += `<path d="M${x - 9 + k * 0.4} ${y - 14 + k * 7}q9 5 18 0" stroke="#a0662a" stroke-width="1.6" fill="none"/>`;
      return `<g transform="rotate(${r} ${x} ${y})"><ellipse cx="${x}" cy="${y}" rx="11" ry="20" fill="#5a2f0e"/>${scales}</g>`;
    };
    const berries = (x, y) =>
      `<circle cx="${x}" cy="${y}" r="7" fill="url(#g-red)"/><circle cx="${x + 11}" cy="${y + 3}" r="6.5" fill="url(#g-red)"/><circle cx="${x + 4}" cy="${y + 12}" r="6.5" fill="url(#g-red)"/>`;
    const sp = stem(0.46);

    return `<symbol id="s-pino" viewBox="0 0 400 200">
      <path d="M${P0.join(" ")}Q${P1.join(" ")} ${P2.join(" ")}${twigs}" stroke="#3b200a" stroke-width="3.2" fill="none" stroke-linecap="round"/>
      ${bucketsToPaths(buckets, 2.3)}
      ${cone(f(sp[0] + 4), f(sp[1] + 30), -18)}
      ${berries(f(stem(0.3)[0] - 6), f(stem(0.3)[1] + 6))}
    </symbol>`;
  }

  /** Sello de lacre dorado (símbolo #s-sello). */
  function sealSymbol() {
    const pts = [];
    for (let i = 0; i < 90; i++) {
      const a = (i / 90) * Math.PI * 2;
      const r = 47 + 2.1 * Math.sin(a * 9) + 1.2 * Math.sin(a * 5 + 1.3);
      pts.push(`${f(50 + Math.cos(a) * r)} ${f(50 + Math.sin(a) * r)}`);
    }
    let dots = "";
    for (let i = 0; i < 24; i++) {
      const a = (i / 24) * Math.PI * 2;
      dots += `<circle cx="${f(50 + Math.cos(a) * 40.5)}" cy="${f(50 + Math.sin(a) * 40.5)}" r=".9"/>`;
    }
    return `<symbol id="s-sello" viewBox="0 0 100 100">
      <path d="M${pts.join("L")}Z" fill="url(#g-seal)"/>
      <circle cx="50" cy="50" r="36" fill="none" stroke="#8a6114" stroke-width="1.8" opacity=".75"/>
      <circle cx="50.6" cy="50.6" r="34" fill="none" stroke="#fff1c0" stroke-width=".9" opacity=".7"/>
      <g fill="#8a6114" opacity=".7">${dots}</g>
      <use href="#s-belen" x="30.8" y="30.8" width="40" height="40" fill="#fff3c4" opacity=".55"/>
      <use href="#s-belen" x="30" y="30" width="40" height="40" fill="#9a6d15"/>
    </symbol>`;
  }

  /** Destellos dorados distribuidos al azar. */
  function sparkles(container, count, seed) {
    const rand = rng(seed);
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const s = document.createElement("span");
      s.className = "sparkle" + (rand() < 0.45 ? " sparkle--dot" : "");
      const size = 4 + rand() * 12;
      s.style.cssText = `left:${f(rand() * 100)}%;top:${f(rand() * 100)}%;--s:${f(size)}px;--t:${f(3 + rand() * 4)}s;--delay:${f(-rand() * 6)}s;--o:${f(0.4 + rand() * 0.6)}`;
      frag.appendChild(s);
    }
    container.appendChild(frag);
  }

  /** Guirnalda de luces navideñas. */
  function garland(container) {
    const W = 1200, anchors = [-30, 270, 600, 930, 1230], sag = 92, top = 6;
    const colors = [
      ["#ff3b30", "#d00000"], ["#ffe08a", "#d4af37"], ["#5ee07a", "#008000"], ["#fff4d6", "#f3dc8c"],
    ];
    let defs = "", wire = `M${anchors[0]} ${top}`, bulbs = "", k = 0;
    colors.forEach(([c1], i) => {
      defs += `<radialGradient id="g-bulb-${i}"><stop offset="0" stop-color="${c1}" stop-opacity=".9"/><stop offset="1" stop-color="${c1}" stop-opacity="0"/></radialGradient>`;
    });
    for (let s = 0; s < anchors.length - 1; s++) {
      const p0 = [anchors[s], top], p2 = [anchors[s + 1], top];
      const p1 = [(p0[0] + p2[0]) / 2, top + sag];
      wire += `Q${p1[0]} ${p1[1]} ${p2[0]} ${p2[1]}`;
      [0.12, 0.31, 0.5, 0.69, 0.88].forEach((t) => {
        const [x, y] = quad(p0, p1, p2, t);
        const [x2, y2] = quad(p0, p1, p2, t + 0.01);
        const rot = f((Math.atan2(y2 - y, x2 - x) * 180) / Math.PI * 0.4);
        const [c1, c2] = colors[k % colors.length];
        const delay = f(((k * 0.37) % 3.2) - 3.2);
        bulbs += `<g transform="translate(${f(x)} ${f(y)}) rotate(${rot})">
          <circle class="bulb-glow" style="--delay:${delay}s" cx="0" cy="13" r="24" fill="url(#g-bulb-${k % colors.length})"/>
          <rect x="-3.6" y="0" width="7.2" height="6" rx="1.4" fill="url(#g-gold)"/>
          <ellipse cx="0" cy="14" rx="5.6" ry="8.6" fill="${c2}"/>
          <ellipse cx="-1.8" cy="11" rx="1.6" ry="3.2" fill="${c1}" opacity=".9"/>
        </g>`;
        k++;
      });
    }
    container.innerHTML = `<svg viewBox="0 0 ${W} 150" preserveAspectRatio="xMidYMin slice" aria-hidden="true">
      <defs>${defs}</defs>
      <path d="${wire}" fill="none" stroke="#14240f" stroke-width="2.4"/>
      <path d="${wire}" fill="none" stroke="#d4af37" stroke-width=".7" opacity=".5" transform="translate(0 -1)"/>
      ${bulbs}
    </svg>`;
  }

  /** Esferas colgantes con balanceo suave. */
  function ornaments(container) {
    const list = [
      { left: "3%", len: 64, size: 50, fill: "g-red", t: 5.5, drop: 0.2, band: true },
      { left: "13%", len: 128, size: 34, fill: "g-goldball", t: 6.6, drop: 0.45, hideSm: true },
      { left: "calc(88% - 40px)", len: 112, size: 40, fill: "g-green", t: 6, drop: 0.35, hideSm: true, band: true },
      { left: "calc(97% - 44px)", len: 54, size: 44, fill: "g-goldball", t: 5, drop: 0.55 },
    ];
    container.innerHTML = list
      .map((o) => {
        const H = o.len + 70;
        const cy = o.len + 34;
        const band = o.band
          ? `<path d="M5 ${cy - 4}Q30 ${cy + 6} 55 ${cy - 4}" stroke="url(#g-gold)" stroke-width="3" fill="none"/><path d="M6 ${cy + 6}Q30 ${cy + 16} 54 ${cy + 6}" stroke="url(#g-gold)" stroke-width="1.2" fill="none" opacity=".8"/>`
          : "";
        return `<div class="ornament${o.hideSm ? " ornament--sm-hide" : ""}" style="left:${o.left};--size:${o.size}px;--t:${o.t}s;--drop:${o.drop}s">
          <div class="ornament__swing"><svg viewBox="0 0 60 ${H}">
            <line x1="30" y1="0" x2="30" y2="${o.len}" stroke="#d4af37" stroke-width="1" opacity=".8"/>
            <rect x="24" y="${o.len}" width="12" height="8" rx="2" fill="url(#g-gold)"/>
            <circle cx="30" cy="${cy}" r="26" fill="url(#${o.fill})"/>
            ${band}
            <ellipse cx="21" cy="${cy - 10}" rx="6" ry="9" fill="#fff" opacity=".28" transform="rotate(30 21 ${cy - 10})"/>
          </svg></div>
        </div>`;
      })
      .join("");
  }

  /** Corona navideña con acebo y moño rojo. */
  function wreath(container) {
    const rand = rng(23);
    const buckets = NEEDLE_GREENS.map(() => []);
    for (let i = 0; i < 120; i++) {
      const a = (i / 120) * Math.PI * 2;
      for (const r of [58, 68, 78]) {
        const rr = r + (rand() - 0.5) * 6;
        const x = 100 + Math.cos(a) * rr, y = 100 + Math.sin(a) * rr;
        const ang = a + Math.PI / 2 + (rand() - 0.5) * 1.6;
        const l = 13 + rand() * 9;
        const c = Math.floor(rand() * NEEDLE_GREENS.length);
        buckets[c].push(`M${f(x)} ${f(y)}l${f(Math.cos(ang) * l)} ${f(Math.sin(ang) * l)}`);
      }
    }
    let holly = "";
    [200, 250, 300, 340, 20, 70, 120, 160].forEach((deg, i) => {
      const a = (deg * Math.PI) / 180;
      const x = 100 + Math.cos(a) * 70, y = 100 + Math.sin(a) * 70;
      holly += `<use href="#s-acebo" x="${f(x - 20)}" y="${f(y - 12)}" width="40" height="24" transform="rotate(${deg + 90 + (i % 2 ? 20 : -20)} ${f(x)} ${f(y)})"/>`;
    });
    container.innerHTML = `<svg viewBox="0 0 200 200" aria-hidden="true">
      ${bucketsToPaths(buckets, 2.4)}
      ${holly}
      <g transform="translate(100 172)">
        <path d="M-2 2 L-22 36 L-14 33 L-10 42 L4 6Z" fill="#9a0000"/>
        <path d="M2 2 L22 36 L14 33 L10 42 L-4 6Z" fill="#b00000"/>
        <path d="M0 0 C-14 -20 -40 -16 -36 0 C-33 12 -12 10 0 0Z" fill="url(#g-red)"/>
        <path d="M0 0 C14 -20 40 -16 36 0 C33 12 12 10 0 0Z" fill="url(#g-red)"/>
        <path d="M0 0 C-14 -20 -40 -16 -36 0 M0 0 C14 -20 40 -16 36 0" fill="none" stroke="#f3dc8c" stroke-width=".8" opacity=".7"/>
        <ellipse cx="0" cy="0" rx="7" ry="6.5" fill="#8f0000" stroke="url(#g-gold)" stroke-width="1.2"/>
      </g>
    </svg>`;
  }

  /** Bosque de pinos en silueta (cierre). */
  function forest(container) {
    const rand = rng(5);
    const tree = (x, base, h) => {
      const w = h * 0.42;
      let d = "";
      for (let k = 0; k < 4; k++) {
        const top = base - h + k * h * 0.2;
        const bot = top + h * 0.36;
        const hw = w * (0.28 + k * 0.2);
        d += `M${f(x)} ${f(top)}L${f(x + hw)} ${f(bot)}L${f(x - hw)} ${f(bot)}Z`;
      }
      d += `M${f(x - 4)} ${f(base - h * 0.06)}h8V${base}h-8Z`;
      return d;
    };
    let far = "", near = "";
    for (let i = 0; i < 26; i++) {
      const x = i * 48 + rand() * 30, h = 90 + rand() * 90;
      far += tree(x, 290, h);
    }
    for (let i = 0; i < 15; i++) {
      const x = i * 86 + rand() * 50, h = 130 + rand() * 140;
      if (x > 430 && x < 770 && h > 190) continue; // claro central
      near += tree(x, 304, h);
    }
    container.innerHTML = `<svg viewBox="0 0 1200 300" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <path d="${far}" fill="#0c3a1b"/>
      <path d="M0 300 V270 Q300 250 600 266 T1200 262 V300Z" fill="#06200f"/>
      <path d="${near}" fill="#031208"/>
      <path d="M0 300 V286 Q600 270 1200 288 V300Z" fill="#020b05"/>
    </svg>`;
  }

  /** Partículas doradas que salen al romperse el sello. */
  function burst(container, count = 16) {
    const rand = rng(3);
    let html = "";
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2 + rand() * 0.4;
      const d = 50 + rand() * 70;
      html += `<i style="--x:${f(Math.cos(a) * d)}px;--y:${f(Math.sin(a) * d)}px;--s:${f(3 + rand() * 6)}px"></i>`;
    }
    container.innerHTML = html;
  }

  function init() {
    const sprite = document.querySelector(".sprite");
    sprite.insertAdjacentHTML("beforeend", pineSymbol() + sealSymbol());

    document.querySelectorAll("[data-sparkles]").forEach((el, i) => sparkles(el, +el.dataset.sparkles || 16, 40 + i));
    document.querySelectorAll("[data-garland]").forEach(garland);
    document.querySelectorAll("[data-ornaments]").forEach(ornaments);
    document.querySelectorAll("[data-wreath]").forEach(wreath);
    document.querySelectorAll("[data-forest]").forEach(forest);
    document.querySelectorAll(".seal__burst").forEach((el) => burst(el));
  }

  PSC.decor = { init };
})(window.PSC = window.PSC || {});
