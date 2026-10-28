// Reto LFX 01 — escena completa. renderAt(t) dibuja el fotograma del segundo t.
const W = 1080, H = 1920;
const FONT = "Inter Display", FONT2 = "Inter";
const svg = document.getElementById("stage");
const S = TL.seg;

// ---------- Iconos (trazos 24x24 estilo lucide) ----------
const ICONS = {
  coins: ["M8 14a6 6 0 1 0 0-12a6 6 0 1 0 0 12", "M18.09 10.37A6 6 0 1 1 10.34 18", "M7 6h1v4", "m16.71 13.88.7.71-2.82 2.82"],
  calendar: ["M8 2v4", "M16 2v4", "M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z", "M3 10h18", "M8 14h.01", "M12 14h.01", "M16 14h.01", "M8 18h.01", "M12 18h.01"],
  zap: ["M13 2 3 14h9l-1 8 10-12h-9l1-8z"],
  user: ["M12 11a4 4 0 1 0 0-8a4 4 0 1 0 0 8", "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"],
  factory: ["M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z", "M17 18h1", "M12 18h1", "M7 18h1"],
  bank: ["M3 22h18", "M6 18v-7", "M10 18v-7", "M14 18v-7", "M18 18v-7", "M12 2 20 7H4z"],
  pie: ["M21.21 15.89A10 10 0 1 1 8 2.83", "M22 12A10 10 0 0 0 12 2v10z"],
  laptop: ["M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16"],
  check: ["M20 6 9 17l-5-5"],
  x: ["M18 6 6 18", "M6 6l12 12"],
  msg: ["M7.9 20A9 9 0 1 0 4 16.1L2 22Z"],
  wallet: ["M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1", "M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"],
  trend: ["M22 7 13.5 15.5 8.5 10.5 2 17", "M16 7h6v6"],
  hand: ["M18 11V6a2 2 0 0 0-4 0", "M14 10V4a2 2 0 0 0-4 0v2", "M10 10.5V6a2 2 0 0 0-4 0v8", "M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"],
  timer: ["M10 2h4", "M12 14l3-3", "M12 22a8 8 0 1 0 0-16a8 8 0 1 0 0 16"],
  help: ["M12 22a10 10 0 1 0 0-20a10 10 0 1 0 0 20", "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3", "M12 17h.01"],
};
function icon(parent, name, size = 64, color = C.white, sw = 2) {
  const g = el("g", {}, parent);
  const inner = el("g", { transform: `translate(${-size / 2},${-size / 2}) scale(${size / 24})` }, g);
  for (const d of ICONS[name]) el("path", { d, fill: "none", stroke: color, "stroke-width": sw, "stroke-linecap": "round", "stroke-linejoin": "round" }, inner);
  return g;
}

// ---------- Medición de texto ----------
const mctx = document.createElement("canvas").getContext("2d");
const mText = el("text", { x: -9999, y: -9999, opacity: 0 }, svg);
function measure(text, size, weight = 900, family = FONT) {
  // mide con el mismo motor SVG que dibuja (el canvas puede usar otra fuente)
  mText.setAttribute("font-family", family); mText.setAttribute("font-weight", weight); mText.setAttribute("font-size", size);
  mText.textContent = text === " " ? "a a" : text;
  const w = mText.getComputedTextLength();
  if (text === " ") { mText.textContent = "aa"; return w - mText.getComputedTextLength(); }
  return w;
}

// Texto cinético palabra a palabra, sincronizado con la voz
function Kinetic(parent, words, o) {
  const g = el("g", {}, parent);
  const size = o.size, weight = o.weight ?? 900, fam = o.family ?? FONT, lh = o.lh ?? size * 1.12;
  const space = Math.max(measure(" ", size, weight, fam), size * 0.36) + (o.extraGap ?? 0);
  const items = words.map((w) => ({ t: w[0], text: o.upper ? w[2].toUpperCase() : w[2], w: measure(o.upper ? w[2].toUpperCase() : w[2], size, weight, fam) }));
  const lines = [[]]; let lw = 0;
  for (const it of items) {
    if (lw > 0 && lw + space + it.w > o.width) { lines.push([]); lw = 0; }
    lines[lines.length - 1].push(it); lw += (lw > 0 ? space : 0) + it.w;
  }
  lines.forEach((ln, li) => {
    const total = ln.reduce((a, it) => a + it.w, 0) + space * (ln.length - 1);
    let x = o.align === "left" ? o.x : o.x - total / 2;
    for (const it of ln) {
      it.cx = x + it.w / 2; it.cy = o.y + li * lh - size * 0.35;
      it.g = el("g", {}, g);
      const hl = o.hl && o.hl(it.text);
      it.node = el("text", { x: it.cx, y: o.y + li * lh, "text-anchor": "middle", "font-family": fam, "font-weight": weight, "font-size": size, fill: hl ? C.em : (o.color ?? C.white) }, it.g, it.text);
      if (hl && o.hlBox) {
        it.box = el("rect", { x: it.cx - it.w / 2 - 14, y: it.cy - size * 0.62, width: it.w + 28, height: size * 1.12, rx: 16, fill: C.em, opacity: 0.16 }, it.g, null);
        it.g.insertBefore(it.box, it.node);
      }
      x += it.w + space;
    }
  });
  return {
    g, items, height: lines.length * lh,
    update(t, tOut = 1e9, tIn0 = null) {
      const out = P(t, tOut, 0.35, E.in);
      for (const it of items) {
        const ti = tIn0 ?? it.t;
        const k = P(t, ti - 0.06, 0.42, E.backBig);
        const a = clamp((t - ti + 0.06) / 0.12) * (1 - out);
        op(it.g, a);
        if (a > 0) it.g.setAttribute("transform", `translate(${it.cx},${it.cy + (1 - k) * 46 - out * 40}) scale(${0.55 + 0.45 * k}) translate(${-it.cx},${-it.cy})`);
        if (it.box) it.box.setAttribute("width", ((it.w + 28) * P(t, ti + 0.1, 0.35)).toFixed(1));
      }
    },
  };
}

// ---------- Fondo ----------
const bg = el("g", {}, svg);
{
  const defs = el("defs", {}, svg);
  const rg = el("radialGradient", { id: "bgGrad", cx: "50%", cy: "40%", r: "75%" }, defs);
  el("stop", { offset: "0%", "stop-color": "#121620" }, rg); el("stop", { offset: "100%", "stop-color": "#05060A" }, rg);
  const glow = el("radialGradient", { id: "glow" }, defs);
  el("stop", { offset: "0%", "stop-color": C.em, "stop-opacity": 0.32 }, glow); el("stop", { offset: "100%", "stop-color": C.em, "stop-opacity": 0 }, glow);
  const wg = el("linearGradient", { id: "whale", x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
  el("stop", { offset: "0%", "stop-color": "#36E0A6" }, wg); el("stop", { offset: "100%", "stop-color": "#139067" }, wg);
  el("rect", { width: W, height: H, fill: "url(#bgGrad)" }, bg);
}
const glows = [0, 1].map((i) => el("circle", { r: 520, fill: "url(#glow)" }, bg));
const grid = el("g", { opacity: 0.05 }, bg);
for (let i = 0; i < 13; i++) el("rect", { x: 0, y: 120 + i * 140, width: W, height: 1.5, fill: "#fff" }, grid);
for (let i = 0; i < 9; i++) el("rect", { x: 60 + i * 120, y: 0, width: 1.5, height: H, fill: "#fff" }, grid);
const candleBand = el("g", { opacity: 0.1 }, bg);
{
  let seed = 11; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  let p = 1250;
  for (let i = 0; i < 120; i++) {
    const o = p, c = p + (rnd() - 0.52) * 60 - (i % 40 < 20 ? 6 : -4);
    const x = i * 24, hi = Math.min(o, c) - rnd() * 26, lo = Math.max(o, c) + rnd() * 26;
    el("rect", { x: x + 7, y: hi, width: 2, height: lo - hi, fill: "#fff" }, candleBand);
    el("rect", { x, y: Math.min(o, c), width: 16, height: Math.max(4, Math.abs(c - o)), rx: 2, fill: c < o ? "#fff" : "#7b8290" }, candleBand);
    p = c;
  }
}
const dots = [];
for (let i = 0; i < 26; i++) dots.push(el("circle", { r: 2 + (i % 3), fill: i % 4 === 0 ? C.em : "#fff", opacity: 0.25 }, bg));
const city = createCity(bg);
glows.forEach((g) => (g.style.display = "none")); grid.style.display = "none"; candleBand.style.display = "none";
dots.forEach((d) => bg.appendChild(d));

function bgFx(t) {
  // reacciones del fondo: pulso en cada tic-tac, impulso verde en cada revelado, oscurecer al final del reloj
  let pulse = 0, pump = 0, dark = 0;
  for (const n of [1, 2, 3]) {
    const tc = S[`count${n}`].at, tr = S[`reveal${n}`].at;
    if (t >= tc && t < tr) { const ph = (t - tc) % 0.5; pulse = Math.exp(-ph * 9); }
    if (t >= tr) pump = Math.max(pump, Math.exp(-(t - tr) * 1.4));
    dark = Math.max(dark, win(t, tr - 2, tr + 0.1, 0.4, 0.15));
  }
  if (t >= res.tFinal) pump = Math.max(pump, Math.exp(-(t - res.tFinal) * 1.4));
  return { pulse, pump, dark };
}
function updateBg(t) {
  city.update(t, bgFx(t));
  glows[0].setAttribute("cx", 540 + Math.sin(t * 0.21) * 380); glows[0].setAttribute("cy", 520 + Math.cos(t * 0.17) * 260);
  glows[1].setAttribute("cx", 540 + Math.cos(t * 0.15) * 420); glows[1].setAttribute("cy", 1400 + Math.sin(t * 0.19) * 240);
  candleBand.setAttribute("transform", `translate(${-((t * 22) % 960)},0)`);
  dots.forEach((d, i) => {
    const sp = 18 + (i % 5) * 9, x = (i * 173) % W, y = (H + 200 - ((t * sp + i * 137) % (H + 400)));
    d.setAttribute("cx", (x + Math.sin(t * 0.6 + i) * 30).toFixed(1)); d.setAttribute("cy", y.toFixed(1));
  });
}

// ---------- Capas ----------
const tension = el("rect", { width: W, height: H, fill: "#000", opacity: 0 }, svg);
const cam = el("g", {}, svg);
const layer = { scenes: el("g", {}, cam) };
const hud = el("g", {}, cam);
layer.caption = el("g", {}, cam);
const leoLayer = el("g", {}, cam);
layer.fx = el("g", {}, cam);
layer.trans = el("g", {}, svg);
layer.outro = el("g", {}, svg);

// ---------- HUD (progreso) ----------
const hudPills = [], hudFill = [];
const hudChip = el("g", {}, hud);
el("rect", { x: 56, y: 104, width: 300, height: 64, rx: 32, fill: C.card, stroke: C.stroke, "stroke-width": 3 }, hudChip);
el("circle", { cx: 92, cy: 136, r: 9, fill: C.em }, hudChip);
el("text", { x: 114, y: 147, "font-family": FONT2, "font-weight": 800, "font-size": 30, fill: C.white, "letter-spacing": 3 }, hudChip, "RETO LFX · 01");
for (let i = 0; i < 3; i++) {
  hudPills.push(el("rect", { x: 760 + i * 92, y: 128, width: 80, height: 16, rx: 8, fill: "#262B34" }, hud));
  hudFill.push(el("rect", { x: 760 + i * 92, y: 128, width: 0, height: 16, rx: 8, fill: C.em }, hud));
}
const tick = el("g", {}, hud);
{
  const cp = el("clipPath", { id: "tickClip" }, hud);
  el("rect", { x: 376, y: 106, width: 360, height: 60, rx: 30 }, cp);
  el("rect", { x: 376, y: 106, width: 360, height: 60, rx: 30, fill: C.card, stroke: C.stroke, "stroke-width": 3 }, tick);
}
const tickIn = el("g", { "clip-path": "url(#tickClip)" }, tick);
const tickRow = el("g", {}, tickIn);
const PAIRS = ["EUR/USD", "GBP/USD", "XAU/USD", "USD/JPY", "AUD/USD", "US30", "NAS100", "USD/CAD"];
const tickItems = [];
{
  let x = 0;
  for (let r = 0; r < 3; r++) for (const pr of PAIRS) {
    const tx = el("text", { x, y: 147, "font-family": FONT2, "font-weight": 800, "font-size": 26, fill: C.grey }, tickRow, pr);
    const w = measure(pr, 26, 800, FONT2);
    const ar = el("text", { x: x + w + 10, y: 147, "font-family": FONT2, "font-weight": 900, "font-size": 24, fill: C.em }, tickRow, "▲");
    tickItems.push({ ar, i: tickItems.length });
    x += w + 60;
  }
  tickRow.dataset.w = x / 3;
}
function updateHud(t) {
  const loopW = +tickRow.dataset.w;
  tickRow.setAttribute("transform", `translate(${(396 - ((t * 70) % loopW)).toFixed(1)},0)`);
  const fx = bgFx(t);
  tickItems.forEach((it) => {
    const up = fx.pump > 0.3 || Math.sin(it.i * 2.7 + Math.floor(t / 1.5) * 1.3) > -0.2;
    it.ar.textContent = up ? "▲" : "▼";
    it.ar.setAttribute("fill", up ? C.em : "#8B919C");
  });
  const a = win(t, S.q1q.at + 0.9, TL.outro.at, 0.4, 0.3);
  op(hud, a);
  for (let i = 0; i < 3; i++) {
    const tr = S[`reveal${i + 1}`].at;
    hudFill[i].setAttribute("width", (80 * P(t, tr, 0.6, E.back)).toFixed(1));
    const active = t > S[`q${i + 1}q`].at && t < tr;
    hudPills[i].setAttribute("fill", active ? "#3A4250" : "#262B34");
  }
}

// ---------- Confeti ----------
const bursts = [];
function addBurst(t0, x, y, n = 80, spread = 1) {
  let seed = Math.floor(t0 * 1000) + 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const ps = [];
  const cols = [C.em, C.gold, C.white, C.cream, "#7CF2C8"];
  for (let i = 0; i < n; i++) {
    const a = rnd() * Math.PI * 2, sp = (500 + rnd() * 1100) * spread;
    const node = el(i % 3 ? "rect" : "circle", i % 3 ? { width: 16, height: 9, x: -8, y: -4.5, fill: cols[i % 5] } : { r: 6, fill: cols[i % 5] }, layer.fx);
    ps.push({ node, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 650 * spread, vr: (rnd() - 0.5) * 900, r0: rnd() * 360, life: 1.6 + rnd() * 0.9 });
  }
  bursts.push({ t0, x, y, ps });
}
function updateFx(t) {
  for (const b of bursts) for (const p of b.ps) {
    const age = t - b.t0;
    if (age < 0 || age > p.life) { p.node.style.display = "none"; continue; }
    p.node.style.display = "";
    const drag = Math.exp(-age * 1.6);
    const x = b.x + p.vx * (1 - drag) / 1.6, y = b.y + p.vy * (1 - drag) / 1.6 + 900 * age * age * 0.5;
    p.node.setAttribute("transform", `translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${(p.r0 + p.vr * age).toFixed(1)})`);
    p.node.setAttribute("opacity", clamp((p.life - age) / 0.4).toFixed(2));
  }
}

// ---------- Subtítulos karaoke ----------
function chunks(words, maxw = 4) {
  const out = []; let cur = [];
  for (const w of words) {
    const len = cur.reduce((n, x) => n + x[2].length + 1, 0);
    if (cur.length && len + w[2].length > 20) { out.push(cur); cur = []; }
    cur.push(w);
    if (cur.length >= maxw || /[.,?!]$/.test(w[2])) { out.push(cur); cur = []; }
  }
  if (cur.length) out.push(cur);
  return out;
}
function Captions(words, pos) {
  const g = el("g", {}, layer.caption);
  const bubble = pos.bubble ? el("g", {}, g) : null;
  if (bubble) {
    el("path", { d: `M${pos.x - pos.w / 2 + 30} ${pos.y + 60} L${pos.x - pos.w / 2 - 34} ${pos.y + 108} L${pos.x - pos.w / 2 + 70} ${pos.y + 82} Z`, fill: C.white }, bubble);
    el("rect", { x: pos.x - pos.w / 2, y: pos.y - 74, width: pos.w, height: 170, rx: 40, fill: C.white }, bubble);
  }
  const list = chunks(words).map((ws, i, arr) => {
    const cg = el("g", {}, g);
    const sz = pos.size ?? 50;
    const k = Kinetic(cg, ws, { extraGap: sz * 0.22, x: pos.x, y: pos.y + (pos.bubble ? 26 : 0), width: pos.w - 60, size: sz, weight: 900, family: FONT, lh: sz * 1.12, upper: true, color: pos.bubble ? C.ink : C.white });
    const nk = k.height > sz * 1.2 ? -sz * 0.56 : 0;
    k.g.setAttribute("transform", `translate(0,${nk})`);
    const t0 = ws[0][0] - 0.08, t1 = i < arr.length - 1 ? arr[i + 1][0][0] - 0.08 : ws[ws.length - 1][1] + 0.5;
    return { cg, k, ws, t0, t1 };
  });
  return {
    update(t) {
      const tStart = list[0].t0, tEnd = list[list.length - 1].t1;
      const a = win(t, tStart - 0.15, tEnd + 0.1, 0.2, 0.2);
      op(g, a);
      if (bubble) {
        const s = 0.6 + 0.4 * P(t, tStart - 0.15, 0.35, E.backBig);
        bubble.setAttribute("transform", `translate(${pos.x - pos.w / 2},${pos.y + 100}) scale(${s}) translate(${-(pos.x - pos.w / 2)},${-(pos.y + 100)})`);
      }
      for (const c of list) {
        const last = c === list[list.length - 1];
        const vis = t >= c.t0 && t < c.t1 + (last ? 0.3 : 0);
        c.cg.style.display = vis ? "" : "none";
        if (!vis) continue;
        c.k.update(t);
        for (let i = 0; i < c.ws.length; i++) {
          const w = c.ws[i], it = c.k.items[i];
          const active = t >= w[0] - 0.05 && t < w[1] + 0.05;
          it.node.setAttribute("fill", active ? (pos.bubble ? C.em2 : C.em) : (pos.bubble ? C.ink : C.white));
        }
      }
    },
  };
}

// ---------- Tarjetas de opción ----------
function Card(parent, o) {
  const g = el("g", {}, parent);
  const inner = el("g", {}, g);
  const w = 960, h = 140;
  const base = el("rect", { x: -w / 2, y: -h / 2, width: w, height: h, rx: 34, fill: C.card, stroke: C.stroke, "stroke-width": 3 }, inner);
  const clipId = "clip" + o.id;
  const cp = el("clipPath", { id: clipId }, inner);
  el("rect", { x: -w / 2, y: -h / 2, width: w, height: h, rx: 34 }, cp);
  const fill = el("rect", { x: -w / 2, y: -h / 2, width: 0, height: h, fill: C.emDark, "clip-path": `url(#${clipId})` }, inner);
  const border = el("rect", { x: -w / 2, y: -h / 2, width: w, height: h, rx: 34, fill: "none", stroke: C.em, "stroke-width": 5, opacity: 0 }, inner);
  const badge = el("circle", { cx: -w / 2 + 74, cy: 0, r: 40, fill: "#232933" }, inner);
  const letter = el("text", { x: -w / 2 + 74, y: 16, "text-anchor": "middle", "font-family": FONT, "font-weight": 900, "font-size": 44, fill: C.white }, inner, o.letter);
  el("circle", { cx: -w / 2 + 178, cy: 0, r: 46, fill: "#1A1F27" }, inner);
  const slot = el("g", {}, inner);
  const mini = o.illus ? IL[o.illus](slot) : null;
  const lsz = Math.min(44, Math.floor(44 * 590 / measure(o.label, 44, 800)));
  el("text", { x: -w / 2 + 236, y: 15, "font-family": FONT, "font-weight": 800, "font-size": lsz, fill: C.white }, inner, o.label);
  const chk = el("g", { transform: `translate(${w / 2 - 70},0)` }, inner);
  el("circle", { r: 34, fill: C.em }, chk);
  const ck = icon(chk, "check", 40, C.bg, 3.4);
  return {
    g, center: () => o,
    update(t, s) {
      // s: {tin, tr, correct, tmove, ymove, tout, tarrive}
      if (mini) {
        const ka = P(t, s.tarrive ?? s.tin, 0.3, E.backBig);
        op(slot, ka > 0 ? 1 : 0);
        slot.setAttribute("transform", `translate(${-w / 2 + 178},0) scale(${(0.3 * ka).toFixed(4)})`);
        mini.update(t);
      }
      const a = clamp((t - s.tin) / 0.15) * (1 - P(t, s.tout, 0.35, E.in));
      op(g, a);
      if (a <= 0) return;
      const kin = P(t, s.tin, 0.55, E.backBig);
      let x = o.x + (1 - kin) * 260, y = o.y, sc = 0.85 + 0.15 * kin, rot = (1 - kin) * 6;
      const rv = t >= s.tr;
      if (s.correct) {
        const pop = rv ? Math.sin(clamp((t - s.tr) / 0.45) * Math.PI) * 0.07 : 0;
        sc += pop;
        fill.setAttribute("width", (w * P(t, s.tr, 0.45, E.inOut)).toFixed(1));
        border.setAttribute("opacity", P(t, s.tr, 0.2).toFixed(2));
        badge.setAttribute("fill", rv ? C.em : "#232933");
        letter.setAttribute("fill", rv ? C.bg : C.white);
        const kc = P(t, s.tr + 0.15, 0.45, E.backBig);
        op(chk, kc > 0 ? 1 : 0);
        chk.setAttribute("transform", `translate(${w / 2 - 70},0) scale(${kc}) rotate(${(1 - kc) * -90})`);
        if (s.tmove) y = lerp(o.y, s.ymove, P(t, s.tmove, 0.6, E.inOut));
      } else {
        op(chk, 0);
        const sh = rv ? Math.sin((t - s.tr) * 60) * 14 * (1 - clamp((t - s.tr) / 0.45)) : 0;
        x += sh;
        const dim = P(t, s.tr + 0.1, 0.35);
        inner.setAttribute("opacity", (1 - 0.65 * dim).toFixed(2));
        sc *= 1 - 0.04 * dim;
        if (s.tmove) { const k = P(t, s.tmove, 0.45, E.in); x -= k * 1100; }
      }
      g.setAttribute("transform", `translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${rot.toFixed(2)}) scale(${sc.toFixed(4)})`);
    },
  };
}

// ---------- Reloj de cuenta atrás ----------
function Clock(parent, cx, cy) {
  const g = el("g", {}, parent);
  const body = el("g", {}, g);
  for (const s of [-1, 1]) {
    el("circle", { cx: s * 92, cy: -118, r: 34, fill: C.em }, body);
    el("path", { d: `M${s * 70} 120 L${s * 96} 160`, stroke: C.em, "stroke-width": 16, "stroke-linecap": "round" }, body);
  }
  el("rect", { x: -14, y: -168, width: 28, height: 26, rx: 6, fill: C.em }, body);
  el("circle", { r: 150, fill: C.card, stroke: C.em, "stroke-width": 12 }, body);
  for (let i = 0; i < 12; i++) {
    const a = (i * 30 * Math.PI) / 180;
    el("path", { d: `M${(Math.sin(a) * 118).toFixed(1)} ${(-Math.cos(a) * 118).toFixed(1)} L${(Math.sin(a) * (i % 3 ? 128 : 134)).toFixed(1)} ${(-Math.cos(a) * (i % 3 ? 128 : 134)).toFixed(1)}`, stroke: i % 3 ? C.dim : C.white, "stroke-width": i % 3 ? 4 : 7, "stroke-linecap": "round" }, body);
  }
  const ring = el("circle", { r: 100, fill: "none", stroke: C.em, "stroke-width": 12, "stroke-dasharray": `${2 * Math.PI * 100}`, transform: "rotate(-90)", opacity: 0.35 }, body);
  const num = el("text", { x: 0, y: 40, "text-anchor": "middle", "font-family": FONT, "font-weight": 900, "font-size": 120, fill: C.white }, body, "5");
  const hand = el("path", { d: "M0 12 L0 -112", stroke: C.gold, "stroke-width": 9, "stroke-linecap": "round" }, body);
  el("circle", { r: 13, fill: C.gold }, body);
  return {
    update(t, t0, t1) {
      const a = win(t, t0 - 0.4, t1 + 0.35, 0.05, 0.35);
      op(g, a);
      if (a <= 0) return;
      const kin = P(t, t0 - 0.4, 0.55, E.backBig), burst = P(t, t1, 0.35, E.out);
      const el5 = t - t0, sec = Math.floor(el5);
      const tickPhase = el5 - sec;
      const shake = el5 >= 0 && el5 < 5 ? Math.sin(tickPhase * Math.PI * 6) * 5 * Math.exp(-tickPhase * 6) : 0;
      const tense = 1 + 0.1 * P(t, t1 - 2, 0.4, E.backBig);
      g.setAttribute("transform", `translate(${cx},${cy - (tense - 1) * 60}) scale(${(kin * tense * (1 + burst * 0.35)).toFixed(4)}) rotate(${(shake * (tense > 1.05 ? 1.8 : 1)).toFixed(2)})`);
      const n = clamp(5 - sec, 1, 5);
      num.textContent = el5 < 0 ? "5" : String(n);
      const pulse = el5 >= 0 && el5 < 5 ? 1 + 0.18 * Math.exp(-tickPhase * 7) : 1;
      num.setAttribute("transform", `scale(${pulse.toFixed(3)})`);
      num.setAttribute("fill", n <= 2 && el5 >= 0 ? C.gold : C.white);
      const prog = clamp(el5 / 5);
      ring.setAttribute("stroke-dashoffset", (2 * Math.PI * 100 * prog).toFixed(1));
      const step = el5 < 0 ? 0 : Math.min(5, sec + E.backBig(clamp(tickPhase / 0.25)));
      hand.setAttribute("transform", `rotate(${(step * 72).toFixed(2)})`);
    },
  };
}

// ---------- Símbolos de cada pregunta ----------
function Hero(parent, n) {
  const g = el("g", {}, parent);
  const parts = {};
  if (n === 1) {
    for (let i = 0; i < 3; i++) parts["wave" + i] = el("path", { d: "", stroke: "#2A6F8F", "stroke-width": 6, fill: "none", "stroke-linecap": "round", opacity: 0.6 - i * 0.15 }, g);
    parts.bubbles = [];
    for (let i = 0; i < 7; i++) parts.bubbles.push(el("circle", { r: 6 + (i % 3) * 4, fill: "none", stroke: "#9BE9FF", "stroke-width": 3, opacity: 0.6 }, g));
    parts.whale = Whale(g); parts.whale.g.parentNode.insertBefore(el("g"), parts.whale.g);
  } else if (n === 2) {
    parts.bars = [];
    for (let i = 0; i < 7; i++) parts.bars.push(el("rect", { x: -210 + i * 62, y: 0, width: 44, height: 10, rx: 10, fill: i === 6 ? C.em : i % 2 ? "#3A4250" : "#5A6270" }, g));
    parts.base = el("rect", { x: -240, y: 92, width: 480, height: 6, rx: 3, fill: C.dim }, g);
    parts.syms = ["€", "$", "¥", "£"].map((s) => el("text", { "text-anchor": "middle", "font-family": FONT, "font-weight": 900, "font-size": 64, fill: C.gold }, g, s));
    parts.lab = el("text", { x: 0, y: 160, "text-anchor": "middle", "font-family": FONT2, "font-weight": 800, "font-size": 34, fill: C.grey, "letter-spacing": 10 }, g, "VOLUMEN");
  } else {
    parts.spot = el("ellipse", { cx: 0, cy: 120, rx: 170, ry: 30, fill: C.em, opacity: 0.18 }, g);
    parts.cone = el("path", { d: "M-60 -240 L60 -240 L190 120 L-190 120 Z", fill: C.em, opacity: 0.07 }, g);
    parts.person = el("g", {}, g);
    ilDefs2(); parts.human = ilHuman(parts.person, { shirt: "url(#ilShirtG)" }); parts.human.p.setAttribute("transform", "translate(0,-20) scale(1.5)"); parts.person.setAttribute("filter", "url(#ilShadow)");
    parts.q = el("text", { x: 120, y: -60, "text-anchor": "middle", "font-family": FONT, "font-weight": 900, "font-size": 110, fill: C.em }, g, "?");
    parts.side = [["fund", -310], ["bank", 310]].map(([nm, x]) => { const s = el("g", {}, g); el("circle", { r: 74, fill: C.card, stroke: C.stroke, "stroke-width": 3 }, s); const a = IL[nm](s); a.g.setAttribute("transform", "scale(0.4)"); return { s, x, a }; });
  }
  return {
    update(t, t0, t1) {
      const a = win(t, t0, t1, 0.2, 0.3);
      op(g, a);
      if (a <= 0) return;
      const kin = P(t, t0, 0.7, E.backBig), out = P(t, t1 - 0.35, 0.35, E.in);
      g.setAttribute("transform", `translate(540,${390 + out * -40}) scale(${(kin * (1 - out * 0.5)).toFixed(4)})`);
      if (n === 1) {
        const wv = parts.whale;
        wv.g.setAttribute("transform", `translate(${Math.sin(t * 1.4) * 22},${Math.sin(t * 2.2) * 12}) rotate(${Math.sin(t * 2.2 + 0.6) * 4})`);
        wv.update(t);
        for (let i = 0; i < 3; i++) {
          let d = `M-300 ${110 + i * 26}`;
          for (let x = -300; x <= 300; x += 30) d += ` L${x} ${(110 + i * 26 + Math.sin(x / 45 + t * 3 + i) * 8).toFixed(1)}`;
          parts["wave" + i].setAttribute("d", d);
        }
        parts.bubbles.forEach((b, i) => {
          const ph = (t * 0.7 + i / 7) % 1;
          b.setAttribute("cx", (-220 + i * 70 + Math.sin(t * 2 + i) * 10).toFixed(1)); b.setAttribute("cy", (100 - ph * 300).toFixed(1));
          b.setAttribute("opacity", (Math.sin(ph * Math.PI) * 0.7).toFixed(2));
        });
      } else if (n === 2) {
        parts.bars.forEach((b, i) => {
          const h = 40 + (i + 1) * 18 + Math.abs(Math.sin(t * 4 + i * 0.9)) * 60;
          b.setAttribute("y", (90 - h).toFixed(1)); b.setAttribute("height", h.toFixed(1));
        });
        parts.syms.forEach((s, i) => {
          const a = t * 1.2 + (i * Math.PI) / 2;
          s.setAttribute("x", (Math.cos(a) * 300).toFixed(1)); s.setAttribute("y", (Math.sin(a) * 90 - 20 + 20).toFixed(1));
          s.setAttribute("opacity", (0.45 + 0.55 * (Math.sin(a) + 1) / 2).toFixed(2));
        });
      } else {
        parts.person.setAttribute("transform", `translate(0,${Math.sin(t * 2) * 6})`);
        parts.human.arms([-30, 70], [40 + Math.sin(t * 2) * 6, 10 + Math.sin(t * 3) * 10]); parts.human.blink(t, 0.2);
        parts.human.head.setAttribute("transform", `rotate(${(Math.sin(t * 1.2) * 8).toFixed(2)})`);
        const qk = 1 + Math.sin(t * 5) * 0.08;
        parts.q.setAttribute("transform", `translate(120,-60) rotate(${Math.sin(t * 3) * 10}) scale(${qk}) translate(-120,60)`);
        parts.side.forEach(({ s, x, a }, i) => { s.setAttribute("transform", `translate(${x},${Math.sin(t * 2 + i * 2) * 14})`); a.update(t); });
      }
    },
  };
}

// ---------- Infografías de explicación ----------
function wt(words, re, nth = 0) { // tiempo de la palabra que cumple re
  let c = 0;
  for (const w of words) if (re.test(w[2])) { if (c === nth) return w[0]; c++; }
  return words[0][0];
}
function Info1(parent, ws) {
  const g = el("g", {}, parent);
  const panel = el("g", {}, g);
  el("rect", { x: 80, y: 430, width: 920, height: 560, rx: 40, fill: C.card, stroke: C.stroke, "stroke-width": 3 }, panel);
  const tLab = el("text", { x: 130, y: 500, "font-family": FONT2, "font-weight": 800, "font-size": 30, fill: C.grey, "letter-spacing": 6 }, panel, "PRECIO");
  const candles = [];
  for (let i = 0; i < 11; i++) {
    const cg = el("g", {}, panel);
    candles.push({ cg, wick: el("rect", { x: 0, y: 0, width: 4, height: 0, fill: "#fff" }, cg), body: el("rect", { x: -14, y: 0, width: 32, height: 0, rx: 4, fill: "#fff" }, cg), x: 160 + i * 74 });
  }
  const arrow = el("g", {}, panel);
  el("path", { d: "M0 70 L0 -60", stroke: C.em, "stroke-width": 16, "stroke-linecap": "round" }, arrow);
  el("path", { d: "M-44 -20 L0 -70 L44 -20", stroke: C.em, "stroke-width": 16, fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" }, arrow);
  const upLab = el("text", { x: 0, y: 140, "text-anchor": "middle", "font-family": FONT, "font-weight": 900, "font-size": 46, fill: C.em }, arrow, "INFLUYE");
  const whale = Whale(g);
  // mercado
  const mk = el("g", {}, g);
  el("circle", { cx: 0, cy: 0, r: 300, fill: "#0F1319", stroke: C.stroke, "stroke-width": 4 }, mk);
  const mdots = [];
  let seed = 5; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  el("circle", { cx: 0, cy: 0, r: 296, fill: "url(#sea)" }, mk);
  for (let i = 0; i < 46; i++) {
    const f = el("g", {}, mk), sz = 0.7 + rnd() * 0.6, col = ["#8FA3B5", "#C9D3DB", "#6E8BA3", "#E9B53C"][i % 4];
    el("path", { d: "M14 0 C8 -9 -8 -9 -14 0 C-8 9 8 9 14 0 Z", fill: col }, f);
    el("path", { d: "M-12 0 L-24 -9 L-22 0 L-24 9 Z", fill: col }, f);
    el("circle", { cx: 8, cy: -2, r: 1.8, fill: "#111" }, f);
    mdots.push({ f, r: 60 + rnd() * 200, a0: rnd() * Math.PI * 2, sp: (0.25 + rnd() * 0.35) * (i % 2 ? 1 : -1), sz });
  }
  const bigdot = el("g", {}, mk); const mwh = Whale(bigdot); mwh.g.setAttribute("transform", "scale(0.42)");
  el("text", { x: 0, y: -330, "text-anchor": "middle", "font-family": FONT2, "font-weight": 800, "font-size": 34, fill: C.grey, "letter-spacing": 10 }, mk, "MERCADO");
  const stamp = el("g", {}, g);
  el("rect", { x: -400, y: -70, width: 800, height: 140, rx: 24, fill: C.bg, stroke: C.white, "stroke-width": 8 }, stamp);
  icon(stamp, "x", 70, C.white, 3.4).setAttribute("transform", "translate(-320,0)");
  el("text", { x: 45, y: 20, "text-anchor": "middle", "font-family": FONT, "font-weight": 900, "font-size": 52, fill: C.white }, stamp, "NO LO CONTROLA TODO");
  const tA = ws[0][0], tW = wt(ws, /ballena/), tP = wt(ws, /influir/), tM = wt(ws, /Pero/), tN = wt(ws, /controla/);
  return {
    update(t, t0, t1) {
      const a = win(t, t0, t1, 0.25, 0.35);
      op(g, a);
      if (a <= 0) return;
      const ph2 = P(t, tM, 0.5, E.inOut);
      op(panel, (1 - ph2) * P(t, t0, 0.4));
      panel.setAttribute("transform", `translate(540,710) scale(${(0.8 + 0.2 * P(t, t0, 0.5, E.backBig)) * (1 - 0.15 * ph2)}) translate(-540,-710)`);
      // Serie continua: cada vela abre exactamente en el cierre de la anterior (y menor = precio mayor).
      const grow = P(t, tP - 0.2, 1.1, E.out);
      const side = [34, -48, 30, -42, 36, -24];           // lateral: alternan alcistas y bajistas
      const rally = [-58, -66, -44, -70, -56];            // impulso alcista cuando entra la ballena
      const wickUp = [16, 22, 14, 20, 18, 15, 24, 14, 20, 12, 18], wickDn = [18, 14, 22, 16, 15, 20, 10, 16, 12, 14, 10];
      let close = 840;
      candles.forEach((c, i) => {
        const open = close;
        const d = i < side.length ? side[i] : lerp(side[i % side.length] * 0.5, rally[i - side.length], grow);
        close = open + d;
        const top = Math.min(open, close), bot = Math.max(open, close);
        const bull = close < open, hi = top - wickUp[i], lo = bot + wickDn[i];
        c.body.setAttribute("y", top.toFixed(1)); c.body.setAttribute("height", Math.max(4, bot - top).toFixed(1));
        c.wick.setAttribute("y", hi.toFixed(1)); c.wick.setAttribute("height", (lo - hi).toFixed(1));
        const col = i >= side.length && bull && grow > 0.15 ? C.em : bull ? "#fff" : "#6B7380";
        c.body.setAttribute("fill", col); c.wick.setAttribute("fill", col);
        c.cg.setAttribute("transform", `translate(${c.x},0)`);
        op(c.cg, P(t, t0 + 0.05 * i, 0.3));
      });
      const ka = P(t, tP, 0.5, E.backBig);
      op(arrow, ka > 0 ? 1 : 0);
      arrow.setAttribute("transform", `translate(330,${640 - ka * 40}) scale(${ka})`);
      // ballena cruzando
      const sw = P(t, tW - 0.3, 1.4, E.inOut);
      const wx = lerp(-300, 360, sw) + (t > tW + 1.1 ? Math.sin(t * 1.5) * 15 : 0);
      const ws2 = 0.62 * (1 - ph2) + 0.0001;
      op(whale.g, (1 - ph2) * (sw > 0 ? 1 : 0));
      whale.g.setAttribute("transform", `translate(${wx},${1000 + Math.sin(t * 2.4) * 10}) scale(${ws2}) rotate(${Math.sin(t * 2.4 + 0.5) * 4})`);
      whale.update(t); op(whale.spout, 0);
      // fase mercado
      const km = P(t, tM, 0.6, E.backBig);
      op(mk, km > 0 ? 1 : 0);
      mk.setAttribute("transform", `translate(540,780) scale(${(km * 0.95).toFixed(4)}) rotate(${(1 - km) * -20})`);
      mdots.forEach((d, i) => {
        op(d.f, P(t, tM + 0.1 + i * 0.012, 0.25));
        const a = d.a0 + t * d.sp, x = Math.cos(a) * d.r, y = Math.sin(a) * d.r * 0.85;
        d.f.setAttribute("transform", `translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${(a * 180 / Math.PI + (d.sp > 0 ? 90 : -90)).toFixed(1)}) scale(${d.sz.toFixed(2)},${(d.sz * (1 + Math.sin(t * 9 + i) * 0.08)).toFixed(2)})`);
      });
      const kw = P(t, tM + 0.5, 0.6, E.backBig);
      bigdot.setAttribute("transform", `translate(${(-30 + Math.sin(t * 0.8) * 40).toFixed(1)},${(20 + Math.cos(t * 0.8) * 20).toFixed(1)}) scale(${kw.toFixed(3)})`);
      mwh.update(t); op(mwh.spout, 0);
      const ks = P(t, tN, 0.4, E.backBig);
      op(stamp, ks > 0 ? 1 : 0);
      stamp.setAttribute("transform", `translate(540,1150) rotate(-6) scale(${(2.2 - 1.2 * ks).toFixed(3)})`);
      stamp.setAttribute("opacity", clamp(ks * 1.5).toFixed(2));
    },
  };
}
function Info2(parent, ws) {
  const g = el("g", {}, parent);
  el("text", { x: 540, y: 470, "text-anchor": "middle", "font-family": FONT2, "font-weight": 800, "font-size": 34, fill: C.grey, "letter-spacing": 8 }, g, "VOLUMEN EN FOREX");
  const rows = [
    { lab: "Bancos e instituciones", ic: "bank", v: 1, col: C.em, re: /Bancos/ },
    { lab: "Empresas", ic: "factory", v: 0.42, col: "#5D6575", re: /empresas/ },
    { lab: "Traders individuales", ic: "user", v: 0.24, col: "#5D6575", re: /traders/ },
  ].map((r, i) => {
    const rg = el("g", {}, g);
    const y = 600 + i * 210;
    el("circle", { cx: 130, cy: y + 30, r: 52, fill: C.card, stroke: i === 0 ? C.em : C.stroke, "stroke-width": 4 }, rg);
    const art = IL[{ bank: "bank", factory: "company", user: "trader" }[r.ic]](rg); art.g.setAttribute("transform", `translate(130,${y + 34}) scale(0.3)`); r.art = art;
    el("text", { x: 210, y: y + 4, "font-family": FONT, "font-weight": 800, "font-size": 42, fill: C.white }, rg, r.lab);
    el("rect", { x: 210, y: y + 34, width: 780, height: 40, rx: 20, fill: "#1A1F27" }, rg);
    const bar = el("rect", { x: 210, y: y + 34, width: 0, height: 40, rx: 20, fill: r.col }, rg);
    return { rg, bar, ...r, art: r.art, t: wt(ws, r.re) };
  });
  return {
    update(t, t0, t1) {
      const a = win(t, t0, t1, 0.25, 0.35);
      op(g, a);
      if (a <= 0) return;
      rows.forEach((r, i) => {
        const ta = Math.min(r.t, t0 + 0.4 + i * 0.25);
        const k = P(t, ta, 0.4, E.backBig);
        op(r.rg, clamp((t - ta) / 0.2));
        r.rg.setAttribute("transform", `translate(${(1 - k) * 120},0)`); r.art.update(t);
        const kb = P(t, r.t, 1.0, E.out);
        const wob = i === 0 ? Math.sin(t * 3) * 6 * kb : 0;
        r.bar.setAttribute("width", Math.max(0, 780 * r.v * kb + wob).toFixed(1));
      });
    },
  };
}
function Info3(parent, ws) {
  const g = el("g", {}, parent);
  const card = el("g", {}, g);
  el("circle", { cx: 0, cy: 0, r: 190, fill: C.card, stroke: C.em, "stroke-width": 6 }, card);
  const tr3 = IL.retail(card); tr3.g.setAttribute("transform", "translate(10,-6) scale(0.95)");
  card.addEventListener && (card._art = tr3);
  const tag1 = el("g", {}, g);
  el("rect", { x: -250, y: -50, width: 500, height: 100, rx: 50, fill: C.em }, tag1);
  el("text", { x: 0, y: 18, "text-anchor": "middle", "font-family": FONT, "font-weight": 900, "font-size": 48, fill: C.bg }, tag1, "CUENTA PROPIA");
  const wallet = el("g", {}, g);
  el("circle", { r: 80, fill: C.card, stroke: C.gold, "stroke-width": 5 }, wallet);
  icon(wallet, "wallet", 86, C.gold, 2);
  const coins = [];
  for (let i = 0; i < 6; i++) coins.push(el("circle", { r: 18, fill: C.gold, stroke: "#B8861E", "stroke-width": 4 }, g));
  const tag2 = el("g", {}, g);
  el("rect", { x: -270, y: -46, width: 540, height: 92, rx: 46, fill: "none", stroke: C.gold, "stroke-width": 5 }, tag2);
  el("text", { x: 0, y: 16, "text-anchor": "middle", "font-family": FONT, "font-weight": 900, "font-size": 44, fill: C.gold }, tag2, "SU PROPIO DINERO");
  const tP = wt(ws, /persona/), tC = wt(ws, /cuenta/), tD = wt(ws, /dinero/), tS = wt(ws, /propio$/);
  return {
    update(t, t0, t1) {
      const a = win(t, t0, t1, 0.25, 0.35);
      op(g, a);
      if (a <= 0) return;
      const k = P(t, Math.min(tP, t0 + 0.6), 0.6, E.backBig);
      card.setAttribute("transform", `translate(540,${700 + Math.sin(t * 2) * 6}) scale(${k})`);
      card._art.update(t);
      const k1 = P(t, tC - 0.1, 0.45, E.backBig);
      op(tag1, k1 > 0 ? 1 : 0); tag1.setAttribute("transform", `translate(540,950) scale(${k1})`);
      const kw = P(t, tS - 0.3, 0.45, E.backBig);
      op(wallet, kw > 0 ? 1 : 0); wallet.setAttribute("transform", `translate(${540 - 300},1160) scale(${kw})`);
      coins.forEach((c, i) => {
        const ph = (t - tS - 0.1 - i * 0.18);
        const vis = ph > 0 && t < t1 - 0.3;
        c.style.display = vis ? "" : "none";
        if (!vis) return;
        const pp = (ph % 1.2) / 1.2;
        const x = lerp(240, 540, pp), y = lerp(1160, 760, pp) - Math.sin(pp * Math.PI) * 120;
        c.setAttribute("cx", x.toFixed(1)); c.setAttribute("cy", y.toFixed(1));
        c.setAttribute("opacity", Math.sin(pp * Math.PI).toFixed(2));
      });
      const k2 = P(t, tD - 0.2, 0.45, E.backBig);
      op(tag2, k2 > 0 ? 1 : 0); tag2.setAttribute("transform", `translate(${640},1170) scale(${k2})`);
    },
  };
}

// ---------- Transición "PREGUNTA N" ----------
function Interstitial(n) {
  const g = el("g", {}, layer.trans);
  const wick = el("rect", { x: 532, y: 0, width: 16, height: 0, rx: 8, fill: C.em }, g);
  const body = el("rect", { x: 220, y: 960, width: 640, height: 0, rx: 40, fill: C.em }, g);
  const shine = el("rect", { x: 250, y: 960, width: 60, height: 0, rx: 30, fill: "#fff", opacity: 0.18 }, g);
  const lab = el("text", { x: 540, y: 640, "text-anchor": "middle", "font-family": FONT2, "font-weight": 900, "font-size": n === 3 ? 46 : 54, fill: C.bg, "letter-spacing": 12 }, g, n === 3 ? "ÚLTIMA PREGUNTA" : "PREGUNTA");
  const num = el("text", { x: 540, y: 1150, "text-anchor": "middle", "font-family": FONT, "font-weight": 900, "font-size": 460, fill: C.bg }, g, String(n));
  const of = el("text", { x: 540, y: 1290, "text-anchor": "middle", "font-family": FONT2, "font-weight": 800, "font-size": 44, fill: C.bg, opacity: 0.6, "letter-spacing": 8 }, g, "DE 3");
  return {
    update(t, t0) {
      const t1 = t0 + 1.2;
      if (t < t0 || t > t1 + 0.5) { g.style.display = "none"; return; }
      g.style.display = "";
      const kw = P(t, t0, 0.3, E.out);                 // la mecha sube
      wick.setAttribute("y", (1920 * (1 - kw)).toFixed(1)); wick.setAttribute("height", (1920 * kw).toFixed(1));
      const kb = P(t, t0 + 0.12, 0.45, E.backBig);     // el cuerpo crece desde el centro
      const bh = 1500 * kb, open = P(t, t1, 0.45, E.inOut); // y se abre a pantalla completa
      const bw = lerp(640, 1300, open), bx = 540 - bw / 2;
      const bh2 = lerp(bh, 2200, open);
      body.setAttribute("x", bx.toFixed(1)); body.setAttribute("width", bw.toFixed(1));
      body.setAttribute("y", (960 - bh2 / 2).toFixed(1)); body.setAttribute("height", bh2.toFixed(1));
      shine.setAttribute("x", (bx + 40).toFixed(1)); shine.setAttribute("y", (960 - bh2 / 2 + 40).toFixed(1)); shine.setAttribute("height", Math.max(0, bh2 - 80).toFixed(1));
      const fade = 1 - P(t, t1 + 0.15, 0.3);
      g.setAttribute("opacity", fade.toFixed(3));
      const kn = P(t, t0 + 0.3, 0.5, E.backBig);
      num.setAttribute("transform", `translate(540,1000) scale(${(kn * (1 + open * 0.6)).toFixed(4)}) rotate(${((1 - kn) * -25).toFixed(2)}) translate(-540,-1000)`);
      op(num, clamp((t - t0 - 0.3) / 0.1) * (1 - open));
      const kl = P(t, t0 + 0.4, 0.4, E.backBig);
      lab.setAttribute("transform", `translate(0,${((1 - kl) * 40).toFixed(1)})`); op(lab, kl * (1 - open));
      op(of, P(t, t0 + 0.5, 0.3) * 0.6 * (1 - open));
    },
  };
}

// ---------- Construcción de escenas ----------
const Q = [
  { n: 1, correct: 0, illus: ["coins", "calendar", "swarm"], hl: /ballena/i, icons: ["coins", "calendar", "zap"], labels: ["Mucho capital", "Operaciones de meses", "Muchas operaciones pequeñas"], info: Info1 },
  { n: 2, correct: 2, illus: ["trader", "company", "bank"], hl: /volumen|forex/i, icons: ["user", "factory", "bank"], labels: ["Traders individuales", "Empresas", "Bancos y fondos"], info: Info2 },
  { n: 3, correct: 1, illus: ["fund", "retail", "bankClients"], hl: /trader|retail/i, icons: ["pie", "user", "bank"], labels: ["Un fondo de inversión", "Una persona", "Un banco"], info: Info3 },
];
const CARD_Y = [840, 1010, 1180];
for (const q of Q) {
  const k = q.n;
  q.g = el("g", {}, layer.scenes);
  q.tq = S[`q${k}q`].at; q.tc = S[`count${k}`].at; q.tr = S[`reveal${k}`].at; q.ta = S[`q${k}a`].at; q.te = S[`q${k}a`].end;
  q.tnext = k < 3 ? S[`q${k + 1}q`].at : S.res.at;
  const qw = TL.words[`q${k}q`];
  const qText = qw.slice(qw.findIndex((w) => /pregunta\.$/i.test(w[2])) + 1);
  // La pregunta debe caber en 2 líneas: reduce el tamaño hasta que quepa
  for (let sz = 70; sz >= 50; sz -= 2) {
    if (q.kin) q.kin.g.remove();
    q.kin = Kinetic(q.g, qText, { x: 540, y: 640, width: 980, size: sz, lh: sz * 1.25, hl: (s) => q.hl.test(s), hlBox: true });
    if (q.kin.height <= sz * 1.25 * 2 + 1) break;
  }
  q.hero = Hero(q.g, k);
  q.clock = Clock(q.g, 540, 395);
  const ow = TL.words[`q${k}o`];
  q.optT = ["A.", "B.", "C."].map((L) => ow.find((w) => w[2] === L)[0]);
  q.cards = [0, 1, 2].map((i) => Card(q.g, { id: `${k}${i}`, x: 540, y: CARD_Y[i], letter: "ABC"[i], icon: q.icons[i], label: q.labels[i], illus: q.illus[i] }));
  q.optEnd = [q.optT[1], q.optT[2], S[`q${k}o`].end + 0.05];
  q.flyers = [0, 1, 2].map((i) => {
    const fg = el("g", {}, q.g);
    const halo = el("circle", { r: 190, fill: C.em, opacity: 0.12 }, fg);
    el("circle", { r: 168, fill: "none", stroke: C.em, "stroke-width": 4, opacity: 0.4, "stroke-dasharray": "14 18" }, fg);
    const art = IL[q.illus[i]](fg);
    const badge = el("g", { transform: "translate(-150,-130)" }, fg);
    el("circle", { r: 46, fill: C.em }, badge);
    el("text", { x: 0, y: 17, "text-anchor": "middle", "font-family": FONT, "font-weight": 900, "font-size": 50, fill: C.bg }, badge, "ABC"[i]);
    return { fg, art, halo, badge, t0: q.optT[i] - 0.1, tf: q.optEnd[i] - 0.5 };
  });
  q.infoObj = q.info(q.g, TL.words[`q${k}a`]);
  q.inter = Interstitial(k);
  q.caps = Captions(TL.words[`q${k}a`], { x: 760, y: 1470, w: 560, bubble: true, size: 44 });
  // gran letra correcta al revelar
  q.big = el("g", {}, q.g);
  el("circle", { r: 150, fill: C.em }, q.big);
  el("circle", { r: 172, fill: "none", stroke: C.em, "stroke-width": 6, opacity: 0.5 }, q.big);
  el("text", { x: 0, y: 62, "text-anchor": "middle", "font-family": FONT, "font-weight": 900, "font-size": 190, fill: C.bg }, q.big, "ABC"[q.correct]);
  addBurst(q.tr + 0.05, 540, CARD_Y[q.correct], 70, 0.9);
  addBurst(q.tr + 0.1, 540, 395, 50, 0.7);
  addBurst(q.tr + 0.2, 90, 1250, 40, 0.8); addBurst(q.tr + 0.2, 360, 1250, 40, 0.8);
}
function updateQuestion(q, t) {
  q.inter.update(t, q.tq - 0.15);
  q.caps.update(t);
  const vis = t >= q.tq && t < q.tnext + 0.5;
  q.g.style.display = vis ? "" : "none";
  if (!vis) return;
  const tIn = q.tq + 1.0, tOut = q.tnext - 0.05;
  q.hero.update(t, tIn, q.optT[0] - 0.05);
  q.flyers.forEach((f, i) => {
    const kin = P(t, f.t0, 0.5, E.backBig), kf2 = P(t, f.tf, 0.5, E.inOut);
    const vis2 = t >= f.t0 && t < f.tf + 0.5;
    f.fg.style.display = vis2 ? "" : "none";
    if (!vis2) return;
    f.art.update(t);
    const tx = lerp(540, 238, kf2), ty = lerp(400, CARD_Y[i], kf2) - Math.sin(kf2 * Math.PI) * 120;
    const sc = lerp(1.25 * kin, 0.3, kf2);
    f.fg.setAttribute("transform", `translate(${tx.toFixed(1)},${(ty + Math.sin(t * 2.4) * 8 * (1 - kf2)).toFixed(1)}) scale(${sc.toFixed(4)}) rotate(${((1 - kin) * -20 + kf2 * 360).toFixed(2)})`);
    op(f.halo, 0.12 * (1 - kf2)); op(f.badge, 1 - kf2);
  });
  q.kin.update(t, q.ta - 0.1);
  q.clock.update(t, q.tc, q.tr);
  q.cards.forEach((c, i) => c.update(t, {
    tin: q.optT[i] - 0.12, tr: q.tr, correct: i === q.correct, tarrive: q.flyers[i].tf + 0.45,
    tmove: q.ta - 0.1, ymove: 270, tout: i === q.correct ? tOut - 0.35 : 1e9,
  }));
  const kb = P(t, q.tr, 0.5, E.backBig), kbo = P(t, q.ta - 0.3, 0.35, E.in);
  op(q.big, kb > 0 && kbo < 1 ? 1 - kbo : 0);
  q.big.setAttribute("transform", `translate(540,395) scale(${(kb * (1 - kbo * 0.6)).toFixed(4)}) rotate(${((1 - kb) * 30).toFixed(2)})`);
  q.infoObj.update(t, q.ta + 0.35, tOut);
}

// ---------- Intro ----------
const intro = { g: el("g", {}, layer.scenes) };
{
  const g = intro.g;
  intro.badge = el("g", {}, g);
  el("rect", { x: -190, y: -42, width: 380, height: 84, rx: 42, fill: "none", stroke: C.em, "stroke-width": 4 }, intro.badge);
  el("text", { x: 0, y: 14, "text-anchor": "middle", "font-family": FONT2, "font-weight": 900, "font-size": 36, fill: C.em, "letter-spacing": 6 }, intro.badge, "RETO LFX · 01");
  const titleWords = [["PON", 0.25], ["A", 0.38], ["PRUEBA", 0.5], ["LO", 0.75], ["QUE", 0.87], ["APRENDISTE", 1.05]].map(([w, d]) => [S.intro.at + d, 0, w]);
  intro.t1 = Kinetic(g, titleWords.slice(0, 3), { x: 540, y: 430, width: 1000, size: 120 });
  intro.t2 = Kinetic(g, titleWords.slice(3), { x: 540, y: 560, width: 1000, size: 120, hl: (s) => s === "APRENDISTE" });
  intro.chips = [["help", "3 PREGUNTAS", /Tres/], ["timer", "5 SEGUNDOS", /Cinco/]].map(([ic, txt, re], i) => {
    const c = el("g", {}, g);
    el("rect", { x: -200, y: -55, width: 400, height: 110, rx: 55, fill: C.card, stroke: C.stroke, "stroke-width": 3 }, c);
    icon(c, ic, 52, C.em, 2.2).setAttribute("transform", "translate(-130,0)");
    el("text", { x: 30, y: 15, "text-anchor": "middle", "font-family": FONT, "font-weight": 900, "font-size": 40, fill: C.white }, c, txt);
    return { c, x: 300 + i * 480, t: wt(TL.words.intro, re) };
  });
  intro.caps = Captions(TL.words.intro, { x: 540, y: 960, w: 960, size: 54 });
}
function updateIntro(t) {
  const end = S.q1q.at + 0.3;
  intro.caps.update(t);
  const vis = t < end;
  intro.g.style.display = vis ? "" : "none";
  if (!vis) return;
  const kb = P(t, 0.1, 0.5, E.backBig);
  intro.badge.setAttribute("transform", `translate(540,${290 - (1 - kb) * 40}) scale(${kb})`);
  op(intro.badge, kb > 0 ? 1 : 0);
  intro.t1.update(t, end - 0.3); intro.t2.update(t, end - 0.3);
  intro.chips.forEach((c) => {
    const k = P(t, c.t - 0.1, 0.5, E.backBig);
    op(c.c, k > 0 ? 1 : 0);
    c.c.setAttribute("transform", `translate(${c.x},${770 + Math.sin(t * 2 + c.x) * 6}) scale(${k}) rotate(${(1 - k) * -10})`);
  });
}

// ---------- Resultado ----------
const res = { g: el("g", {}, layer.scenes) };
{
  const g = res.g, ws = TL.words.res;
  res.kin = Kinetic(g, ws.slice(0, 2), { x: 540, y: 420, width: 900, size: 116, lh: 128, upper: true, hl: (s) => /ACERTASTE/.test(s) });
  res.comment = el("g", {}, g);
  el("rect", { x: -400, y: -60, width: 800, height: 120, rx: 60, fill: C.card, stroke: C.em, "stroke-width": 4 }, res.comment);
  icon(res.comment, "msg", 60, C.em, 2.2).setAttribute("transform", "translate(-320,0)");
  el("text", { x: 45, y: 15, "text-anchor": "middle", "font-family": FONT, "font-weight": 900, "font-size": 42, fill: C.white }, res.comment, "COMENTA TU RESULTADO");
  res.tCom = wt(ws, /comentarios/);
  const tUna = wt(ws, /^Una/), tDos = wt(ws, /^dos/), tTres = wt(ws, /^tres$/), tTres2 = wt(ws, /^tres\./);
  res.btns = ["1/3", "2/3", "3/3"].map((s, i) => {
    const b = el("g", {}, g);
    const r = el("rect", { x: -130, y: -90, width: 260, height: 180, rx: 44, fill: C.card, stroke: C.stroke, "stroke-width": 4 }, b);
    const tx = el("text", { x: 0, y: 30, "text-anchor": "middle", "font-family": FONT, "font-weight": 900, "font-size": 84, fill: C.white }, b, s);
    return { b, r, tx, x: 220 + i * 320, t: [tUna, tDos, tTres][i] };
  });
  res.tFinal = tTres2;
  res.cursor = el("g", {}, g);
  el("circle", { r: 0, fill: C.white, opacity: 0.3 }, res.cursor);
  icon(res.cursor, "hand", 110, C.white, 1.8);
  res.ripple = el("circle", { r: 0, fill: "none", stroke: C.em, "stroke-width": 6 }, g);
  res.caps = Captions(ws.slice(2), { x: 760, y: 1470, w: 560, bubble: true, size: 44 });
  addBurst(tTres2 + 0.05, 860, 980, 70, 0.9);
}
function updateResult(t) {
  res.caps.update(t);
  const t0 = S.res.at - 0.2, t1 = TL.outro.at + 0.2;
  const vis = t >= t0 && t < t1;
  res.g.style.display = vis ? "" : "none";
  if (!vis) return;
  res.kin.update(t, TL.outro.at - 0.2);
  const kc = P(t, res.tCom - 0.1, 0.5, E.backBig);
  op(res.comment, kc > 0 ? 1 - P(t, TL.outro.at - 0.3, 0.3) : 0);
  res.comment.setAttribute("transform", `translate(540,${700 + Math.sin(t * 3) * 6}) scale(${kc})`);
  let cx = 1200, cy = 1300, last = null;
  res.btns.forEach((b, i) => {
    const k = P(t, b.t - 0.1, 0.45, E.backBig);
    op(b.b, k > 0 ? 1 - P(t, TL.outro.at - 0.3, 0.3) : 0);
    const tap = t > b.t + 0.15 ? Math.sin(clamp((t - b.t - 0.15) / 0.25) * Math.PI) * -0.08 : 0;
    b.b.setAttribute("transform", `translate(${b.x},980) scale(${(k + tap).toFixed(4)})`);
    const done = i === 2 && t > res.tFinal;
    b.r.setAttribute("fill", done ? C.em : C.card); b.r.setAttribute("stroke", done ? C.em : t > b.t ? "#4A5260" : C.stroke);
    b.tx.setAttribute("fill", done ? C.bg : C.white);
    if (t > b.t - 0.4) last = b;
  });
  if (last) {
    const i = res.btns.indexOf(last);
    const prev = i > 0 ? res.btns[i - 1] : { x: 1100, t: last.t - 0.6 };
    const k = P(t, last.t - 0.4, 0.4, E.inOut);
    cx = lerp(prev.x + 40, last.x + 40, k); cy = 1060 - Math.sin(k * Math.PI) * 60;
  }
  op(res.cursor, last ? 1 - P(t, res.tFinal + 0.6, 0.3) : 0);
  res.cursor.setAttribute("transform", `translate(${cx},${cy + 40}) rotate(-20)`);
  const rp = clamp((t - res.tFinal) / 0.6);
  res.ripple.setAttribute("cx", 860); res.ripple.setAttribute("cy", 980);
  res.ripple.setAttribute("r", (rp > 0 && rp < 1 ? 120 + rp * 160 : 0).toFixed(1));
  res.ripple.setAttribute("opacity", (1 - rp).toFixed(2));
}

// ---------- Cierre LFX (4 s) ----------
const outro = el("g", {}, layer.outro);
const outBg = el("rect", { width: W, height: H, fill: "#0A0B10" }, outro);
const outLogo = el("image", { href: "logo-lfx.png", x: 205, y: 705, width: 686, height: 251 }, outro);
const outT1 = el("text", { x: 540, y: 1100, "text-anchor": "middle", "font-family": FONT2, "font-weight": 900, "font-size": 50, fill: C.white, "letter-spacing": 5 }, outro, "COMUNIDAD GRATUITA LFX");
const outT2 = el("text", { x: 540, y: 1168, "text-anchor": "middle", "font-family": FONT2, "font-weight": 600, "font-size": 38, fill: C.em }, outro, "Link en mi descripción");
const outGlowG = el("radialGradient", { id: "outGlow" }, outro);
el("stop", { offset: "0%", "stop-color": C.em, "stop-opacity": 0.35 }, outGlowG); el("stop", { offset: "100%", "stop-color": C.em, "stop-opacity": 0 }, outGlowG);
const outGlow = el("circle", { cx: 540, cy: 830, r: 0, fill: "url(#outGlow)" }, outro);
outro.insertBefore(outGlow, outLogo);
const outRing = el("circle", { cx: 540, cy: 830, r: 0, fill: "none", stroke: C.em, "stroke-width": 4, opacity: 0 }, outro);
const outSweepClip = el("clipPath", { id: "logoClip" }, outro);
el("rect", { x: 205, y: 705, width: 686, height: 251 }, outSweepClip);
const outSweep = el("rect", { x: 0, y: 690, width: 90, height: 290, fill: "#fff", opacity: 0.22, transform: "skewX(-18)", "clip-path": "url(#logoClip)" }, outro);
function updateOutro(t) {
  const t0 = TL.outro.at;
  if (t < t0 - 0.05) { outro.style.display = "none"; return; }
  outro.style.display = "";
  op(outBg, P(t, t0, 0.35));
  const up = (d, el2, dist = 160) => { const k = P(t, t0 + d, 0.8, E.out); op(el2, P(t, t0 + d, 0.4)); el2.setAttribute("transform", `translate(0,${((1 - k) * dist).toFixed(1)})`); };
  const kL = P(t, t0 + 0.2, 0.9, E.backBig);
  op(outLogo, P(t, t0 + 0.2, 0.35));
  outLogo.setAttribute("transform", `translate(548,830) scale(${(0.7 + 0.3 * kL).toFixed(4)}) translate(-548,-830)`);
  outGlow.setAttribute("r", (520 * P(t, t0 + 0.2, 1.2, E.out)).toFixed(1));
  const kr = P(t, t0 + 0.3, 1.1, E.out);
  outRing.setAttribute("r", (200 + 600 * kr).toFixed(1)); outRing.setAttribute("opacity", (0.6 * (1 - kr)).toFixed(2));
  const ks = P(t, t0 + 1.1, 0.9, E.inOut);
  outSweep.setAttribute("x", (150 + ks * 1000).toFixed(1)); op(outSweep, ks > 0 && ks < 1 ? 0.22 : 0);
  up(0.7, outT1, 80); up(0.85, outT2, 80);
}

// ---------- Leo ----------
const leo = createLeo(leoLayer);
const LEFT = { x: 225, y: 2075, s: 1.02 }, CENTER = { x: 540, y: 2120, s: 1.25 };
const poseKeys = []; // [t, nombre, mano der, mano izq]
const posKeys = [];
const jumps = [];
function pk(t, name, hr = "fist", hl = "fist") { poseKeys.push([t, name, hr, hl]); }
{
  const iw = TL.words.intro;
  pk(0, "rest"); pk(0.5, "wave", "open"); pk(wt(iw, /Listo/) - 0.1, "explainR", "open");
  pk(wt(iw, /Tres/) - 0.15, "present", "open", "open"); pk(wt(iw, /Vamos/) - 0.15, "cheer");
  jumps.push([wt(iw, /Vamos/) - 0.05, 120, 0.45]);
  posKeys.push([0, CENTER], [S.q1q.at - 0.3, CENTER], [S.q1q.at - 0.05, { ...CENTER, x: -420 }]);
  for (const q of Q) {
    pk(q.tq - 0.1, "rest"); pk(q.tq + 1.0, "wave", "open"); pk(q.tq + 1.9, "pointUp", "point");
    if (q.n > 1) posKeys.push([q.tq - 0.4, LEFT], [q.tq - 0.05, { ...LEFT, x: -320 }]);
    posKeys.push([q.tq + 1.0, { ...LEFT, x: -320 }], [q.tq + 1.55, LEFT]);
    q.optT.forEach((ot, i) => pk(ot - 0.15, i % 2 ? "explainR" : "point", i % 2 ? "open" : "point"));
    pk(q.tc - 0.3, "think"); pk(q.tr, "cheer"); jumps.push([q.tr + 0.02, 160, 0.42], [q.tr + 0.5, 90, 0.36]);
    const aw = TL.words[`q${q.n}a`];
    pk(q.ta + 0.5, "explainR", "open");
    const mid = aw[Math.floor(aw.length / 2)][0];
    pk(mid, "present", "open", "open");
    pk(q.te - 0.2, "rest");
  }
  const rw = TL.words.res;
  pk(S.res.at - 0.1, "shrug", "open", "open"); pk(wt(rw, /Escríbelo/) - 0.1, "explainR", "open");
  pk(wt(rw, /^Una/) - 0.2, "point", "point"); pk(res.tFinal, "cheer"); jumps.push([res.tFinal, 140, 0.45]);
  pk(wt(rw, /Nos/) - 0.1, "wave", "open");
  posKeys.push([TL.outro.at - 0.1, LEFT], [TL.outro.at + 0.5, { ...LEFT, y: 2600 }]);
}
const blinkT = []; { let b = 1.3, s = 3; while (b < TL.total) { blinkT.push(b); s = (s * 16807) % 2147483647; b += 2.4 + (s % 1000) / 600; } }
function leoState(t) {
  let i = 0; while (i < poseKeys.length - 1 && poseKeys[i + 1][0] <= t) i++;
  const cur = poseKeys[i], prev = poseKeys[Math.max(0, i - 1)];
  const k = i === 0 ? 1 : P(t, cur[0], 0.35, E.inOut);
  const A = POSE[prev[1]], B = POSE[cur[1]];
  const s = {};
  for (const key of ["shL", "elL", "shR", "elR", "tilt", "brow", "smile"]) s[key] = lerp(A[key], B[key], k);
  s.handR = k > 0.5 ? cur[2] : prev[2]; s.handL = k > 0.5 ? cur[3] : prev[3];
  const name = cur[1];
  const env = TL.env[Math.min(TL.env.length - 1, Math.round(t * 60))] || 0;
  const env2 = TL.env[Math.min(TL.env.length - 1, Math.round(t * 60) + 2)] || 0;
  const talk = Math.max(env, env2);
  if (name === "wave") s.elR += Math.sin(t * 13) * 24 * k;
  if (name === "cheer") { s.shL += Math.sin(t * 15) * 9; s.shR -= Math.sin(t * 15) * 9; s.mood = "happy"; }
  if (name === "think") { s.mood = "think"; s.lookX = Math.sin(t * 1.6) * 0.9; s.lookY = -0.5; }
  if (name === "pointUp" || name === "point") { s.lookX = 0.5; s.lookY = -0.6; }
  s.shR += Math.sin(t * 5.2) * 6 * talk; s.elR += Math.sin(t * 7.1) * 8 * talk;
  s.shL += Math.sin(t * 4.3 + 1) * 4 * talk;
  s.tilt += Math.sin(t * 2.3) * 2 + Math.sin(t * 6.1) * 2.5 * talk;
  s.headY = -Math.abs(Math.sin(t * 9)) * 4 * talk;
  s.brow += Math.sin(t * 4.7) * 0.5 * talk; s.t = t;
  s.mouth = name === "cheer" && talk < 0.1 ? 0.35 : Math.pow(talk, 0.9) * (0.75 + 0.25 * Math.sin(t * 31));
  s.blink = 0; for (const b of blinkT) { const d = t - b; if (d >= 0 && d < 0.16) s.blink = Math.sin((d / 0.16) * Math.PI); }
  s.ear = Math.sin(t * 2.7) * 4;
  // posición
  posKeys.sort((a, b) => a[0] - b[0]);
  const pos = kf(t, posKeys.map(([tt, v]) => [tt, { x: v.x, y: v.y, s: v.s }]), E.inOut);
  const drop = t < 0.65 ? -2100 * (1 - E.in(clamp(t / 0.65))) : 0; // cae desde arriba
  pos.y += drop;
  let jump = 0, squash = 0;
  if (t >= 0.65 && t < 0.95) squash += Math.sin(((t - 0.65) / 0.3) * Math.PI) * 2.2;
  for (const [j0, hgt, d] of jumps) {
    const u = (t - j0) / d;
    if (u >= 0 && u <= 1) jump += 4 * hgt * u * (1 - u);
    if (u > 1 && u < 1 + 0.25 / d) squash += Math.sin(((u - 1) * d / 0.25) * Math.PI) * 1.2;
    if (u >= -0.12 / d && u < 0) squash += Math.sin(((u * d + 0.12) / 0.12) * Math.PI) * 0.8;
  }
  const breath = Math.sin(t * 2.4) * 0.35;
  if (name === "think") { const ph = (t - S.count1.at) % 1; squash += Math.max(0, Math.sin(ph * Math.PI * 2)) * 0.4; }
  Object.assign(s, { x: pos.x, y: pos.y, scale: pos.s, jump, squash: squash + breath });
  return s;
}
// signos de interrogación al pensar
const thinkMarks = [0, 1, 2].map((i) => el("text", { "text-anchor": "middle", "font-family": FONT, "font-weight": 900, "font-size": 70, fill: C.em }, leoLayer, "?"));

function camera(t) {
  let sc = 1, cx = 540, cy = 960, dx = 0, dy = 0;
  for (const q of Q) {
    // temblor cuando cae el número de la pregunta
    const sh = t - (q.tq + 0.15);
    if (sh > 0 && sh < 0.45) { const a = 14 * Math.exp(-sh * 9); dx += Math.sin(sh * 70) * a; dy += Math.cos(sh * 55) * a; }
    // zoom rápido a la tarjeta correcta en el revelado
    const pz = win(t, q.tr, q.ta - 0.1, 0.12, 0.45);
    if (pz > 0) { sc *= 1 + 0.08 * E.out(pz); cy = lerp(cy, CARD_Y[q.correct], E.out(pz)); }
    // zoom lento durante la explicación
    if (t > q.ta && t < q.te + 0.4) sc *= 1 + 0.035 * clamp((t - q.ta) / (q.te - q.ta));
  }
  cam.setAttribute("transform", `translate(${(cx + dx).toFixed(2)},${(cy + dy).toFixed(2)}) scale(${sc.toFixed(4)}) translate(${-cx},${-cy})`);
  tension.setAttribute("opacity", (bgFx(t).dark * 0.35).toFixed(3));
}
function renderAt(t) {
  updateBg(t);
  camera(t);
  updateHud(t);
  updateIntro(t);
  for (const q of Q) updateQuestion(q, t);
  updateResult(t);
  updateFx(t);
  const st = leoState(t);
  leo.update(st);
  const thinking = Q.find((q) => t > q.tc - 0.2 && t < q.tr);
  thinkMarks.forEach((m, i) => {
    if (!thinking) { m.style.display = "none"; return; }
    const ph = ((t - thinking.tc) * 0.8 + i / 3) % 1;
    m.style.display = "";
    m.setAttribute("x", (st.x + 120 + i * 60 + Math.sin(t * 3 + i) * 10).toFixed(1));
    m.setAttribute("y", (st.y - 850 * st.scale - ph * 120).toFixed(1));
    m.setAttribute("opacity", Math.sin(ph * Math.PI).toFixed(2));
    m.setAttribute("font-size", 50 + i * 16);
  });
  updateOutro(t);
}
window.renderAt = renderAt;
