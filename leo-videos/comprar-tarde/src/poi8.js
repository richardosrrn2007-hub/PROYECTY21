// Reto POI v4 — pulido: toro blanco y oso negro, líneas de velocidad al entrar/salir del ordenador,
// destello de luz, partículas continuas abajo, estallido en cada palabra clave y en cada ✓.
const v8G = el("g", {}, svg), v8Back = el("g", {}, svg);
svg.insertBefore(v8Back, camG); // detrás de la pantalla
const rnd = (i, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };

// ---------- Toro blanco y oso negro ----------
function bull(parent, x, y, s) {
  const g = el("g", { transform: `translate(${x},${y}) scale(${s})` }, parent);
  el("path", { d: "M-46 -38 C-84 -58 -92 -88 -72 -104 C-72 -80 -58 -66 -36 -54 Z M46 -38 C84 -58 92 -88 72 -104 C72 -80 58 -66 36 -54 Z", fill: YEL, stroke: "#15171C", "stroke-width": 4, "stroke-linejoin": "round" }, g);
  el("path", { d: "M-52 -50 C-52 -80 52 -80 52 -50 L46 18 C42 54 -42 54 -46 18 Z", fill: "#FFFFFF", stroke: "#15171C", "stroke-width": 5 }, g);
  el("path", { d: "M-40 -40 C-30 -60 0 -64 10 -60 C-10 -50 -30 -30 -40 -40 Z", fill: "#E4E6EB" }, g);
  el("ellipse", { cx: 0, cy: 28, rx: 35, ry: 23, fill: "#F2C9C0", stroke: "#15171C", "stroke-width": 4 }, g);
  el("ellipse", { cx: -12, cy: 28, rx: 5, ry: 6, fill: "#15171C" }, g); el("ellipse", { cx: 12, cy: 28, rx: 5, ry: 6, fill: "#15171C" }, g);
  el("path", { d: "M-32 -26 L-12 -16 M32 -26 L12 -16", stroke: "#15171C", "stroke-width": 8, "stroke-linecap": "round" }, g);
  el("circle", { cx: -20, cy: -6, r: 8, fill: "#15171C" }, g); el("circle", { cx: 20, cy: -6, r: 8, fill: "#15171C" }, g);
  el("circle", { cx: -17, cy: -9, r: 2.5, fill: "#fff" }, g); el("circle", { cx: 23, cy: -9, r: 2.5, fill: "#fff" }, g);
  el("path", { d: "M-11 48 A11 11 0 0 0 11 48", stroke: YEL, "stroke-width": 5, fill: "none" }, g);
  return g;
}
function bear(parent, x, y, s) {
  const g = el("g", { transform: `translate(${x},${y}) scale(${s})` }, parent);
  for (const sx of [-1, 1]) { el("circle", { cx: sx * 42, cy: -42, r: 21, fill: "#0B0C10", stroke: "#8A8F98", "stroke-width": 4 }, g); el("circle", { cx: sx * 42, cy: -42, r: 10, fill: "#3A3F48" }, g); }
  el("circle", { r: 55, fill: "#0B0C10", stroke: "#8A8F98", "stroke-width": 4 }, g);
  el("ellipse", { cx: 0, cy: 21, rx: 27, ry: 20, fill: "#3A3F48" }, g); el("ellipse", { cx: 0, cy: 12, rx: 10, ry: 7, fill: "#000" }, g);
  el("path", { d: "M-31 -23 L-12 -14 M31 -23 L12 -14", stroke: "#8A8F98", "stroke-width": 7, "stroke-linecap": "round" }, g);
  el("circle", { cx: -19, cy: -4, r: 8, fill: "#fff" }, g); el("circle", { cx: 19, cy: -4, r: 8, fill: "#fff" }, g);
  el("circle", { cx: -17, cy: -3, r: 4, fill: "#000" }, g); el("circle", { cx: 17, cy: -3, r: 4, fill: "#000" }, g);
  return g;
}

// ---------- Estallido de partículas ----------
function burst(parent, x, y, tt, n = 16, r = 220, seed = 1) {
  if (tt < 0 || tt > 0.7) return;
  const k = E.out(clamp(tt / 0.7)), cols = [YEL, BLUE2, "#fff", GREEN];
  for (let i = 0; i < n; i++) {
    const a = rnd(i, seed) * Math.PI * 2, d = r * (0.45 + 0.55 * rnd(i, seed + 3)) * k, s = 7 + rnd(i, seed + 5) * 9;
    el("rect", { x: -s / 2, y: -s / 2, width: s, height: s * 0.6, rx: 2, fill: cols[i % 4], opacity: (1 - k).toFixed(3), transform: `translate(${(x + Math.cos(a) * d).toFixed(1)},${(y + Math.sin(a) * d * 0.7 + k * k * 60).toFixed(1)}) rotate(${(tt * 720 * (rnd(i, seed + 7) - 0.5)).toFixed(1)})` }, parent);
  }
}
const _dp = window.drawPunch;
window.drawPunch = function (word, tt, y, dur) {
  burst(v6G, 540, y, tt - 0.05, 22, 430, word.length);
  _dp(word, tt, y, dur);
};
const _dc = window.drawChecklist;
window.drawChecklist = function (st) {
  _dc(st);
  const c = st.check; if (!c || c.k <= 0) return;
  c.items.forEach((it, i) => burst(v6G, 190 + i * 350 - 128, 1860, it.on * 0.35, 10, 90, i + 11));
};

// ---------- Líneas de velocidad al entrar o salir del ordenador ----------
function speedLines(k, tt) {
  if (k <= 0.01) return;
  const g = el("g", { opacity: k.toFixed(3) }, v8G);
  for (let i = 0; i < 46; i++) {
    const a = rnd(i, 2) * Math.PI * 2, r0 = 300 + rnd(i, 4) * 420 + ((tt * 2600 + i * 90) % 700), len = 120 + rnd(i, 6) * 260;
    el("line", { x1: 540 + Math.cos(a) * r0, y1: 900 + Math.sin(a) * r0 * 1.4, x2: 540 + Math.cos(a) * (r0 + len), y2: 900 + Math.sin(a) * (r0 + len) * 1.4, stroke: i % 5 ? "#fff" : BLUE2, "stroke-width": 4 + rnd(i, 8) * 6, "stroke-linecap": "round", opacity: 0.55 + rnd(i, 9) * 0.45 }, g);
  }
}

// ---------- Ambiente continuo en la franja de abajo (pantalla completa) ----------
function ambient(k, tt) {
  if (k <= 0.01) return;
  const g = el("g", { opacity: k.toFixed(3) }, v8Back);
  const gr = el("linearGradient", { id: "botGlow", x1: 0, y1: 0, x2: 0, y2: 1 }, g);
  el("stop", { offset: "0%", "stop-color": BLUE2, "stop-opacity": 0 }, gr); el("stop", { offset: "100%", "stop-color": BLUE2, "stop-opacity": 0.32 }, gr);
  el("rect", { x: 0, y: 1520, width: W, height: 400, fill: "url(#botGlow)" }, g);
  const gt = el("linearGradient", { id: "topGlow", x1: 0, y1: 1, x2: 0, y2: 0 }, g);
  el("stop", { offset: "0%", "stop-color": "#7A4DFF", "stop-opacity": 0 }, gt); el("stop", { offset: "100%", "stop-color": "#7A4DFF", "stop-opacity": 0.28 }, gt);
  el("rect", { x: 0, y: 0, width: W, height: 260, fill: "url(#topGlow)" }, g);
  for (let i = 0; i < 26; i++) {
    const sp = 40 + rnd(i, 1) * 70, x = rnd(i, 2) * W + Math.sin(tt * 0.8 + i) * 20, y = 1940 - ((tt * sp + rnd(i, 3) * 500) % 460);
    if (i % 3 === 0) { // velita
      const up = i % 2 === 0, h = 22 + rnd(i, 4) * 26;
      el("line", { x1: x, x2: x, y1: y - h * 0.8, y2: y + h * 0.8, stroke: up ? "#fff" : "#8A8F98", "stroke-width": 2, opacity: 0.5 }, g);
      el("rect", { x: x - 6, y: y - h / 2, width: 12, height: h, rx: 2, fill: up ? "#fff" : "#3A3F48", opacity: 0.5 }, g);
    } else el("circle", { cx: x, cy: y, r: 2 + rnd(i, 5) * 4, fill: i % 2 ? BLUE2 : "#fff", opacity: 0.25 + rnd(i, 6) * 0.4 }, g);
  }
}

let lastFull = 0, lastT = -1;
const render7 = window.renderState;
window.renderState = function (st) {
  const tt = st.t ?? 0;
  window.NOW = tt;
  render7(st);
  v8G.textContent = ""; v8Back.textContent = "";
  const f = clamp(st.fullK ?? 0);
  ambient(f, tt);
  // fuerza de las líneas: máxima a mitad de la transición
  speedLines(f > 0 && f < 1 ? Math.sin(f * Math.PI) : 0, tt);
  // destello al atravesar la pantalla
  if (f > 0.75 && f < 1) el("rect", { width: W, height: H, fill: "#BFD0FF", opacity: (Math.sin(((f - 0.75) / 0.25) * Math.PI) * 0.22).toFixed(3) }, v8G);
};
