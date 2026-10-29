// Reto LFX · ¿Puedes encontrar el punto de interés? — gráfica blanca, zonas A/B/C, explicación paso a paso.
// renderState(st) dibuja un fotograma a partir de un estado explícito (vista, textos, marcas...).
const W = 1080, H = 1920;
const PC = {
  bg: "#FFFFFF", ink: "#111318", ink2: "#3A3F48", grey: "#9A9FA8", grid: "#ECEEF2",
  bull: "#A3A8B0", bear: "#14161B", blue: "#2962FF", zone: "#2962FF", zoneOp: 0.18,
};
const FONTP = "Inter Display", FONTP2 = "Inter";
const svg = document.getElementById("stage");

// ---------- Datos: serie H4 continua (cada vela abre en el cierre de la anterior) ----------
const ZONES = {
  C: { lo: 206.05, hi: 206.7 },
  A: { lo: 207.55, hi: 207.95 },
  B: { lo: 209.6, hi: 210.05 },
};
function genSeries() {
  let seed = 4242; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const gauss = () => (rnd() + rnd() + rnd() - 1.5) * 0.8;
  const out = []; let close = 207.6;
  const seg = (n, target, vol, band = null) => {
    for (let i = 0; i < n; i++) {
      const open = close;
      let c;
      if (band) { const mid = (band[0] + band[1]) / 2; c = open + (mid - open) * 0.35 + gauss() * vol; c = Math.min(band[1], Math.max(band[0], c)); }
      else { const left = n - i; c = open + (target - open) / left + gauss() * vol; }
      const hi = Math.max(open, c) + rnd() * vol * 0.9, lo = Math.min(open, c) - rnd() * vol * 0.9;
      out.push({ o: open, c, h: hi, l: lo });
      close = c;
    }
  };
  // Prehistoria (para semanal y diario): rango 203–209.2, toca C varias veces en temporalidad mayor
  seg(120, 205.2, 0.2); seg(90, 207.9, 0.2); seg(100, 206.3, 0.2); seg(60, 208.7, 0.2); seg(110, 204.4, 0.22);
  seg(90, 206.4, 0.2); seg(80, 208.5, 0.2); seg(70, 206.9, 0.2);
  const PRE = out.length;
  // Historia visible en H4 con reacciones en C
  seg(14, 206.35, 0.18);                  // cae a C
  const H1 = out.length; seg(4, 0, 0.1, [206.12, 206.6]);   // interacción 1
  seg(10, 208.6, 0.2);                    // reacción al alza
  seg(10, 206.5, 0.18);                   // vuelve a C
  const H2 = out.length; seg(4, 0, 0.1, [206.15, 206.62]);  // interacción 2
  seg(9, 208.4, 0.2);                     // reacción
  seg(7, 207.1, 0.16); seg(4, 206.45, 0.14);
  const ACC0 = out.length;
  seg(14, 0, 0.09, [206.1, 206.66]);      // acumulación actual en C
  const IMP0 = out.length;
  seg(4, 208.3, 0.12);                    // impulso: atraviesa A rápido
  seg(6, 209.75, 0.16);
  const B0 = out.length;
  seg(9, 0, 0.08, [209.62, 210.0]);       // acumulación reciente B (territorio nuevo)
  seg(4, 209.3, 0.1);
  return { h4: out, PRE, H1, H2, ACC0, IMP0, B0 };
}
const D = genSeries();
function agg(src, k, from = 0) {
  const r = [];
  for (let i = from; i + k <= src.length; i += k) {
    const s = src.slice(i, i + k);
    r.push({ o: s[0].o, c: s[s.length - 1].c, h: Math.max(...s.map((x) => x.h)), l: Math.min(...s.map((x) => x.l)) });
  }
  return r;
}
const TF = { H4: D.h4, D1: agg(D.h4, 6, D.h4.length % 6), W1: agg(D.h4, 30, D.h4.length % 30) };
const N = D.h4.length;
// índices de interés (H4)
const IDX = {
  start: D.PRE - 4, h1: D.H1, h2: D.H2, acc0: D.ACC0, acc1: D.IMP0 - 1, imp: D.IMP0, bStart: D.B0, aCross: D.IMP0 + 1,
};
// mínimo de cada interacción pasada (para marcarla)
IDX.touch = [D.H1, D.H2].map((a) => { let k = a, m = 1e9; for (let i = a; i < a + 4; i++) if (D.h4[i].l < m) { m = D.h4[i].l; k = i; } return { i: k, p: m }; });

// ---------- Elementos fijos ----------
el("rect", { width: W, height: H, fill: PC.bg }, svg);
const chartG = el("g", {}, svg);
const PLOT = { x: 40, y: 360, w: 900, h: 880 }; // área de la gráfica; eje de precios a la derecha
const clip = el("clipPath", { id: "plotClip" }, svg);
el("rect", { x: PLOT.x, y: PLOT.y, width: PLOT.w, height: PLOT.h }, clip);
const gridG = el("g", {}, chartG);
const zonesG = el("g", { "clip-path": "url(#plotClip)" }, chartG);
const candlesG = el("g", { "clip-path": "url(#plotClip)" }, chartG);
const marksG = el("g", { "clip-path": "url(#plotClip)" }, chartG);
const axisG = el("g", {}, chartG);
const tfLabel = el("text", { x: PLOT.x + 6, y: PLOT.y - 14, "font-family": FONTP2, "font-weight": 800, "font-size": 30, fill: PC.ink2 }, chartG, "GBPJPY · H4");

const topG = el("g", {}, svg);
const ui = el("g", {}, svg);
const leoG = el("g", {}, svg);
const outroG = el("g", {}, svg);

// ---------- Dibujo de la gráfica ----------
function drawChart(v) {
  // v: {tf, i0, i1, pmin, pmax, zones:{A,B,C:{op, lab, strong}}, marks:[{i,p,kind}], bandFrom}
  gridG.textContent = ""; zonesG.textContent = ""; candlesG.textContent = ""; marksG.textContent = ""; axisG.textContent = "";
  const data = TF[v.tf];
  const toX = (i) => PLOT.x + ((i - v.i0) / (v.i1 - v.i0)) * PLOT.w;
  const toY = (p) => PLOT.y + (1 - (p - v.pmin) / (v.pmax - v.pmin)) * PLOT.h;
  // cuadrícula y eje de precios
  const step = (v.pmax - v.pmin) > 6 ? 1 : 0.5;
  for (let p = Math.ceil(v.pmin / step) * step; p <= v.pmax; p += step) {
    const y = toY(p);
    el("line", { x1: PLOT.x, x2: PLOT.x + PLOT.w, y1: y, y2: y, stroke: PC.grid, "stroke-width": 2 }, gridG);
    el("text", { x: PLOT.x + PLOT.w + 10, y: y + 9, "font-family": FONTP2, "font-weight": 600, "font-size": 24, fill: PC.grey }, axisG, p.toFixed(1));
  }
  // zonas (franjas desde su vela de inicio hasta el borde derecho)
  for (const k of ["A", "B", "C"]) {
    const z = v.zones?.[k]; if (!z || z.op <= 0) continue;
    const Z = ZONES[k];
    const x0 = Math.max(PLOT.x, toX(z.from)), y0 = toY(Z.hi), y1 = toY(Z.lo);
    const g = el("g", { opacity: z.op }, zonesG);
    el("rect", { x: x0, y: y0, width: PLOT.x + PLOT.w - x0, height: y1 - y0, fill: PC.zone, opacity: PC.zoneOp }, g);
    if (z.strong) el("rect", { x: x0, y: y0, width: PLOT.x + PLOT.w - x0, height: y1 - y0, fill: "none", stroke: PC.blue, "stroke-width": 5 * z.strong, rx: 4 }, g);
    if (z.lab !== false) {
      const lx = Math.min(PLOT.x + PLOT.w - 70, Math.max(PLOT.x + 10, x0 + 12)), ly = (y0 + y1) / 2;
      const tg = el("g", { opacity: z.labOp ?? 1 }, marksG);
      el("rect", { x: lx, y: ly - 24, width: 48, height: 48, rx: 12, fill: PC.blue }, tg);
      el("text", { x: lx + 24, y: ly + 12, "text-anchor": "middle", "font-family": FONTP, "font-weight": 900, "font-size": 32, fill: "#fff" }, tg, k);
    }
  }
  // velas
  const i0 = Math.max(0, Math.floor(v.i0)), i1 = Math.min(data.length - 1, Math.ceil(v.i1));
  const cw = (PLOT.w / (v.i1 - v.i0)) * 0.66;
  for (let i = i0; i <= i1; i++) {
    if (v.upto != null && i > v.upto) break;
    const c = data[i], x = toX(i + 0.5), bull = c.c >= c.o, col = bull ? PC.bull : PC.bear;
    el("line", { x1: x, x2: x, y1: toY(c.h), y2: toY(c.l), stroke: col, "stroke-width": Math.max(1.2, cw * 0.14) }, candlesG);
    const yt = toY(Math.max(c.o, c.c)), yb = toY(Math.min(c.o, c.c));
    el("rect", { x: x - cw / 2, y: yt, width: cw, height: Math.max(1.5, yb - yt), fill: col }, candlesG);
  }
  // marcas (círculos finos y flechas)
  for (const m of v.marks ?? []) {
    const x = toX(m.i + 0.5), y = toY(m.p), k = m.k ?? 1;
    if (m.kind === "circle") el("circle", { cx: x, cy: y, r: (m.r ?? 34) * k, fill: "none", stroke: PC.blue, "stroke-width": 4, opacity: Math.min(1, k * 1.5) }, marksG);
    if (m.kind === "arrow") { const g = el("g", { transform: `translate(${x},${y}) scale(${k})` }, marksG); el("path", { d: "M0 70 L0 14 M-14 30 L0 12 L14 30", stroke: PC.blue, "stroke-width": 5, fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" }, g); }
    if (m.kind === "bracket") { const x2 = toX(m.i2 + 0.5), yb = toY(m.p) + 40; el("path", { d: `M${x} ${yb - 12} L${x} ${yb} L${x2} ${yb} L${x2} ${yb - 12}`, stroke: PC.blue, "stroke-width": 4, fill: "none", opacity: k }, marksG); }
  }
  // línea del precio actual
  if (v.tf === "H4" && v.i1 >= N - 1) {
    const last = data[N - 1].c, y = toY(last);
    el("line", { x1: PLOT.x, x2: PLOT.x + PLOT.w, y1: y, y2: y, stroke: PC.grey, "stroke-width": 1.5, "stroke-dasharray": "4 6" }, candlesG);
    el("rect", { x: PLOT.x + PLOT.w + 2, y: y - 16, width: 96, height: 32, rx: 4, fill: PC.ink }, axisG);
    el("text", { x: PLOT.x + PLOT.w + 50, y: y + 8, "text-anchor": "middle", "font-family": FONTP2, "font-weight": 700, "font-size": 22, fill: "#fff" }, axisG, last.toFixed(2));
  }
  tfLabel.textContent = `GBPJPY · ${v.tf === "W1" ? "SEMANAL" : v.tf === "D1" ? "DIARIO" : "H4"}`;
}

// ---------- Textos y UI ----------
function T(parent, txt, x, y, size, opts = {}) {
  return el("text", { x, y, "text-anchor": opts.anchor ?? "middle", "font-family": opts.fam ?? FONTP, "font-weight": opts.w ?? 900, "font-size": size, fill: opts.fill ?? PC.ink, "letter-spacing": opts.ls ?? 0 }, parent, txt);
}
function rich(parent, parts, x, y, size, anchor = "middle") {
  // parts: [[texto, azul?], ...] en una línea
  const t = el("text", { x, y, "text-anchor": anchor, "font-family": FONTP, "font-weight": 900, "font-size": size }, parent);
  for (const [s2, blue] of parts) el("tspan", { fill: blue ? PC.blue : PC.ink }, t, s2);
  return t;
}
function drawUI(st) {
  topG.textContent = ""; ui.textContent = ""; outroG.textContent = "";
  if (st.title) {
    rich(topG, st.title[0], 540, 150, 64);
    if (st.title[1]) rich(topG, st.title[1], 540, 230, st.titleSub ?? 56);
  }
  if (st.step) {
    const g = el("g", {}, topG);
    el("rect", { x: 60, y: 96, width: 960, height: 104, rx: 22, fill: "#F2F5FF", stroke: PC.blue, "stroke-width": 3 }, g);
    rich(g, st.step, 540, 166, 52);
  }
  if (st.tfChips) {
    const names = ["SEMANAL", "DIARIO", "H4"];
    names.forEach((n, i) => {
      const x = 170 + i * 370, on = st.tfChips === n;
      el("rect", { x: x - 120, y: 255, width: 240, height: 66, rx: 33, fill: on ? PC.blue : "#fff", stroke: on ? PC.blue : PC.grey, "stroke-width": 3 }, topG);
      T(topG, n, x, 300, 32, { fill: on ? "#fff" : PC.ink2, w: 800 });
      if (i < 2) T(topG, "→", x + 185, 302, 40, { fill: PC.blue });
    });
  }
  if (st.count != null) {
    const k = st.count; // segundos restantes (5..1) y progreso 0..1
    el("rect", { x: 60, y: 1268, width: 880, height: 14, rx: 7, fill: PC.grid }, ui);
    el("rect", { x: 60, y: 1268, width: 880 * (1 - st.countP), height: 14, rx: 7, fill: PC.blue }, ui);
    el("circle", { cx: 990, cy: 1275, r: 46, fill: "#fff", stroke: PC.blue, "stroke-width": 6 }, ui);
    T(ui, String(k), 990, 1294, 52, { fill: PC.blue });
  }
  if (st.cap) {
    // subtítulo: máximo dos líneas, negro con palabras clave en azul
    st.cap.forEach((line, i) => rich(ui, line, st.capX ?? 700, (st.capY ?? 1520) + i * 62, 46));
  }
  if (st.banner) {
    const g = el("g", {}, ui);
    el("rect", { x: 160, y: 1290, width: 760, height: 96, rx: 48, fill: PC.blue }, g);
    T(g, st.banner, 540, 1352, 44, { fill: "#fff" });
  }
}

// ---------- Cierre (fondo blanco, logo original sobre tarjeta oscura, marca de agua) ----------
function drawOutro(k) {
  outroG.textContent = "";
  el("rect", { width: W, height: H, fill: "#fff" }, outroG);
  for (let r = 0; r < 9; r++) for (let c = 0; c < 3; c++)
    T(outroG, "LEONARDO LFX", 180 + c * 360 + (r % 2) * 180, 160 + r * 220, 40, { fill: "#EEF0F3", w: 900 });
  const up = (d) => (1 - Math.min(1, Math.max(0, k - d) / 0.6)) * 120;
  const g1 = el("g", { transform: `translate(0,${up(0.1)})` }, outroG);
  el("rect", { x: 170, y: 640, width: 740, height: 360, rx: 40, fill: "#0A0B10" }, g1);
  el("image", { href: "logo-lfx.png", x: 197, y: 694, width: 686, height: 251 }, g1);
  const g2 = el("g", { transform: `translate(0,${up(0.35)})` }, outroG);
  T(g2, "COMUNIDAD GRATUITA LFX", 540, 1110, 54, { w: 900, ls: 3 });
  T(g2, "Link en mi descripción", 540, 1180, 40, { fill: PC.blue, w: 700, fam: FONTP2 });
  const g3 = el("g", { transform: `translate(0,${up(0.5)})` }, outroG);
  el("path", { d: "M540 1420 L540 1260 M500 1300 L540 1256 L580 1300", stroke: PC.blue, "stroke-width": 10, fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" }, g3);
}

// ---------- Leo (presentador pequeño, abajo a la izquierda) ----------
const leo = createLeo(leoG);
function drawLeo(st) {
  if (!st.leo) { leoG.style.display = "none"; return; }
  leoG.style.display = "";
  leo.update({ t: st.t ?? 0, x: 190, y: 2010, scale: 0.82, ...POSE[st.leo], handR: st.leo === "point" || st.leo === "pointUp" ? "point" : st.leo === "think" ? "fist" : "open", handL: st.leo === "present" ? "open" : "fist", mouth: st.mouth ?? 0, smile: 0.7, brow: 0.4, lookX: 0.4, lookY: -0.3 });
}

function renderState(st) {
  if (st.outro != null) { chartG.style.display = "none"; topG.textContent = ""; ui.textContent = ""; leoG.style.display = "none"; drawOutro(st.outro); return; }
  chartG.style.display = ""; outroG.textContent = "";
  drawChart(st.view);
  drawUI(st);
  drawLeo(st);
}
window.renderState = renderState;
window.POIDATA = { N, IDX, ZONES, TF };
