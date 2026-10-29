// Reto POI v2 — más ritmo: subtítulos con marcador y entradas variadas, palabras clave gigantes,
// toro contra oso, rebobinado, etiquetas del revelado, sello, contador de reacciones,
// barrido entre temporalidades, golpes de zoom, círculo que late con la voz y emojis de reacción.
const v5G = el("g", {}, svg);
const YEL = "#FFD45C", RED = "#F23645";
{
  const d = el("defs", {}, svg);
  const f = el("filter", { id: "whip", x: "-10%", y: "-10%", width: "120%", height: "120%" }, d);
  window.whipBlur = el("feGaussianBlur", { stdDeviation: "0 0" }, f);
  const s = el("filter", { id: "txtSh", x: "-20%", y: "-40%", width: "140%", height: "190%" }, d);
  el("feDropShadow", { dx: 0, dy: 8, stdDeviation: 6, "flood-color": "#000", "flood-opacity": 0.55 }, s);
}
// punto de la gráfica (vela i, precio p) → coordenadas del fotograma
function chartPt(i, p) {
  const m = window.LASTMAP; if (!m) return null;
  const pt = new DOMPoint(m.toX(i), m.toY(p)).matrixTransform(scr.getScreenCTM());
  return { x: pt.x, y: pt.y };
}

// ----- Subtítulos v2: marcador azul detrás de las palabras clave, sombra y entradas variadas -----
function kinetic(words, active, y = 1290, cxAll = 540, size = 70, pop = 1) {
  kinG.textContent = "";
  const gap = size * 0.42;
  const meas = el("text", { "font-family": FONTP, "font-weight": 900, "font-size": size }, kinG);
  const ws = words.map((o) => { meas.textContent = o.w; return meas.getComputedTextLength(); });
  meas.remove();
  const pad = size * 0.22, wsx = ws.map((w, i) => w + (words[i].blue ? pad * 2 : 0));
  const total = wsx.reduce((a, b) => a + b, 0) + gap * (words.length - 1);
  let x = cxAll - total / 2;
  words.forEach((o, i) => {
    const cx = x + wsx[i] / 2; x += wsx[i] + gap;
    if (i > active) return;
    const k = clamp(i === active ? pop : 1), mode = (o.w.length + i) % 3;
    let tr = "";
    if (mode === 0) { const s = 0.3 + 0.7 * E.backBig(k); tr = `translate(${cx},${y}) scale(${s}) translate(${-cx},${-y})`; }
    else if (mode === 1) tr = `translate(0,${(-(1 - E.backBig(k)) * 70).toFixed(1)}) rotate(${((1 - E.out(k)) * -12).toFixed(2)},${cx},${y})`;
    else tr = `translate(${(-(1 - E.backBig(k)) * 90).toFixed(1)},0) skewX(${((1 - E.out(k)) * -18).toFixed(2)})`;
    const g = el("g", { transform: tr, opacity: clamp(k * 3).toFixed(3), filter: "url(#txtSh)" }, kinG);
    if (o.blue) {
      const wk = E.out(clamp((k - 0.1) / 0.5));
      el("rect", { x: cx - wsx[i] / 2, y: y - size * 0.82, width: wsx[i] * wk, height: size * 1.08, rx: size * 0.18, fill: BLUE2, transform: `rotate(-2,${cx},${y})` }, g);
    }
    el("text", { x: cx, y, "text-anchor": "middle", "font-family": FONTP, "font-weight": 900, "font-size": size, fill: "#FFFFFF", stroke: o.blue ? "none" : "#05060A", "stroke-width": 12, "paint-order": "stroke", "stroke-linejoin": "round" }, g, o.w);
    if (o.icon) { const ik = E.backBig(clamp((k - 0.3) / 0.5)); icon4(g, o.icon, cx + wsx[i] / 2 - 6, y - size * 1.05, 0.85 * ik * size / 70); }
  });
}

// ----- Palabra clave gigante -----
function drawPunch(word, tt, y) {
  if (tt < 0 || tt > 0.8) return;
  const kin = E.backBig(clamp(tt / 0.22)), kout = 1 - E.in(clamp((tt - 0.6) / 0.2));
  const shake = Math.sin(tt * 70) * 7 * Math.max(0, 1 - tt / 0.45);
  let size = 170;
  const meas = el("text", { "font-family": FONTP, "font-weight": 900, "font-size": size }, v5G, word);
  const w0 = meas.getComputedTextLength(); meas.remove();
  if (w0 > 900) size = (size * 900) / w0;
  const w = Math.min(900, w0);
  const g = el("g", { transform: `translate(${540 + shake},${y}) rotate(-4) scale(${(kin * kout * (1 + 0.04 * Math.sin(tt * 9))).toFixed(4)})`, opacity: kout.toFixed(3) }, v5G);
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2, r0 = w / 2 + 40, r1 = r0 + 60 * kin; el("path", { d: `M${Math.cos(a) * r0 * 0.75} ${Math.sin(a) * r0 * 0.4} L${Math.cos(a) * r1 * 0.75} ${Math.sin(a) * r1 * 0.4}`, stroke: YEL, "stroke-width": 9, "stroke-linecap": "round", opacity: 0.9 }, g); }
  el("rect", { x: -w / 2 - 34, y: -size * 0.78, width: w + 68, height: size * 1.05, rx: 26, fill: BLUE2, filter: "url(#txtSh)" }, g);
  el("text", { x: 0, y: size * 0.12, "text-anchor": "middle", "font-family": FONTP, "font-weight": 900, "font-size": size, fill: "#fff" }, g, word);
}

// ----- Toro contra oso sobre la zona -----
function bull(parent, x, y, s) {
  const g = el("g", { transform: `translate(${x},${y}) scale(${s})` }, parent);
  el("path", { d: "M-46 -38 C-80 -60 -86 -86 -70 -100 C-70 -78 -58 -64 -36 -54 Z M46 -38 C80 -60 86 -86 70 -100 C70 -78 58 -64 36 -54 Z", fill: "#F5F1E6" }, g);
  el("path", { d: "M-50 -50 C-50 -78 50 -78 50 -50 L44 18 C40 52 -40 52 -44 18 Z", fill: "#2962FF" }, g);
  el("ellipse", { cx: 0, cy: 28, rx: 34, ry: 22, fill: "#9DB6FF" }, g);
  el("circle", { cx: -12, cy: 28, r: 5, fill: "#1B2A6B" }, g); el("circle", { cx: 12, cy: 28, r: 5, fill: "#1B2A6B" }, g);
  el("path", { d: "M-30 -24 L-12 -16 M30 -24 L12 -16", stroke: "#0B1640", "stroke-width": 7, "stroke-linecap": "round" }, g);
  el("circle", { cx: -20, cy: -8, r: 7, fill: "#fff" }, g); el("circle", { cx: 20, cy: -8, r: 7, fill: "#fff" }, g);
  el("circle", { cx: -18, cy: -7, r: 3.5, fill: "#0B1640" }, g); el("circle", { cx: 18, cy: -7, r: 3.5, fill: "#0B1640" }, g);
  el("path", { d: "M-10 46 A10 10 0 0 0 10 46", stroke: YEL, "stroke-width": 5, fill: "none" }, g);
  return g;
}
function bear(parent, x, y, s) {
  const g = el("g", { transform: `translate(${x},${y}) scale(${s})` }, parent);
  el("circle", { cx: -42, cy: -42, r: 20, fill: "#3A3F48" }, g); el("circle", { cx: 42, cy: -42, r: 20, fill: "#3A3F48" }, g);
  el("circle", { cx: -42, cy: -42, r: 10, fill: "#8A8F98" }, g); el("circle", { cx: 42, cy: -42, r: 10, fill: "#8A8F98" }, g);
  el("circle", { r: 54, fill: "#3A3F48" }, g);
  el("ellipse", { cx: 0, cy: 20, rx: 26, ry: 20, fill: "#C9CCD2" }, g); el("ellipse", { cx: 0, cy: 12, rx: 9, ry: 6, fill: "#15171C" }, g);
  el("path", { d: "M-30 -22 L-12 -14 M30 -22 L12 -14", stroke: "#15171C", "stroke-width": 7, "stroke-linecap": "round" }, g);
  el("circle", { cx: -19, cy: -4, r: 7, fill: "#fff" }, g); el("circle", { cx: 19, cy: -4, r: 7, fill: "#fff" }, g);
  el("circle", { cx: -17, cy: -3, r: 3.5, fill: "#15171C" }, g); el("circle", { cx: 17, cy: -3, r: 3.5, fill: "#15171C" }, g);
  return g;
}
function drawTug(k, tt, zi0, zi1) {
  const a = chartPt((zi0 + zi1) / 2, ZONES.C.lo), b = chartPt((zi0 + zi1) / 2, ZONES.C.hi);
  if (!a || k <= 0) return;
  const push = Math.sin(tt * 9) * 8, s = 1.25 * E.backBig(clamp(k));
  const g = el("g", { opacity: clamp(k * 2).toFixed(3) }, v5G);
  el("path", { d: `M${a.x - 120} ${a.y + 70 - push} L${a.x - 120} ${a.y + 10 - push} m-16 18 l16 -18 l16 18`, stroke: "#2962FF", "stroke-width": 9, fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" }, g);
  el("path", { d: `M${b.x + 120} ${b.y - 70 + push} L${b.x + 120} ${b.y - 10 + push} m-16 -18 l16 18 l16 -18`, stroke: "#3A3F48", "stroke-width": 9, fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" }, g);
  bull(g, a.x - 40, a.y + 100 - push, s);
  bear(g, b.x + 40, b.y - 96 + push, s);
  const lab = (x, y, t, c) => { const q = el("g", { transform: `translate(${x},${y})` }, g); el("rect", { x: -78, y: -22, width: 156, height: 44, rx: 22, fill: c }, q); el("text", { x: 0, y: 11, "text-anchor": "middle", "font-family": FONTP, "font-weight": 900, "font-size": 26, fill: "#fff" }, q, t); };
  lab(a.x + 110, a.y + 112 - push, "COMPRAS", "#2962FF"); lab(b.x - 110, b.y - 108 + push, "VENTAS", "#3A3F48");
}

// ----- Rebobinado -----
function drawRewind(k, tt) {
  const r = monG.getBoundingClientRect(); if (k <= 0) return;
  const g = el("g", { opacity: k.toFixed(3) }, v5G);
  el("rect", { x: r.x, y: r.y, width: r.width, height: r.height, fill: "#0A1640", opacity: 0.18 }, g);
  for (let i = 0; i < 14; i++) { const y = r.y + ((i * 97 + tt * 900) % r.height); el("rect", { x: r.x, y, width: r.width, height: 3 + (i % 3) * 3, fill: "#fff", opacity: 0.35 }, g); }
  const cx = r.x + r.width / 2, cy = r.y + r.height / 2;
  const q = el("g", { transform: `translate(${cx},${cy}) scale(${E.backBig(clamp(k * 1.5)).toFixed(3)})` }, g);
  el("rect", { x: -190, y: -80, width: 380, height: 160, rx: 30, fill: "#05060A", opacity: 0.75 }, q);
  el("path", { d: "M-40 -40 L-110 0 L-40 40 Z M30 -40 L-40 0 L30 40 Z", fill: "#fff" }, q);
  el("text", { x: 50, y: 22, "font-family": FONTP, "font-weight": 900, "font-size": 60, fill: "#fff" }, q, "x20");
  el("text", { x: 0, y: 130, "text-anchor": "middle", "font-family": FONTP, "font-weight": 900, "font-size": 40, fill: "#fff", stroke: "#05060A", "stroke-width": 8, "paint-order": "stroke" }, q, "VIAJE AL PASADO");
}

// ----- Etiquetas del revelado (junto a cada zona, en la gráfica) -----
function drawTags(k, from) {
  if (k <= 0) return;
  const items = [["A", from.A, "PASÓ RÁPIDO", "#5B6170"], ["B", from.B, "SIN HISTORIA", "#5B6170"], ["C", from.C, "✓ CON HISTORIA", "#2962FF"]];
  items.forEach(([z, i0, txt, col], n) => {
    const p = chartPt(i0, (ZONES[z].lo + ZONES[z].hi) / 2); if (!p) return;
    const kk = E.backBig(clamp((k - n * 0.25) / 0.5)); if (kk <= 0) return;
    const g = el("g", { transform: `translate(${p.x - 14},${p.y}) scale(${kk.toFixed(3)})` }, v5G);
    const meas = el("text", { "font-family": FONTP, "font-weight": 900, "font-size": 26 }, g, txt); const w = meas.getComputedTextLength() + 36; meas.remove();
    el("rect", { x: -w, y: -24, width: w, height: 48, rx: 24, fill: col, filter: "url(#txtSh)" }, g);
    el("path", { d: "M-2 -10 L12 0 L-2 10 Z", fill: col }, g);
    el("text", { x: -w / 2, y: 9, "text-anchor": "middle", "font-family": FONTP, "font-weight": 900, "font-size": 26, fill: "#fff" }, g, txt);
  });
}

// ----- Sello "entrada automática" -----
function drawStamp(tt) {
  if (tt < 0 || tt > 2.2) return;
  const r = monG.getBoundingClientRect(), cx = r.x + r.width / 2, cy = r.y + r.height * 0.42;
  const s = 1 + (1 - E.out(clamp(tt / 0.18))) * 1.4, a = Math.min(clamp(tt / 0.12), 1 - clamp((tt - 1.9) / 0.3));
  const g = el("g", { transform: `translate(${cx},${cy}) rotate(-8) scale(${s.toFixed(3)})`, opacity: a.toFixed(3) }, v5G);
  el("rect", { x: -330, y: -78, width: 660, height: 156, rx: 22, fill: "#fff", opacity: 0.92 }, g);
  el("rect", { x: -320, y: -68, width: 640, height: 136, rx: 18, fill: "none", stroke: RED, "stroke-width": 10 }, g);
  el("text", { x: 0, y: -8, "text-anchor": "middle", "font-family": FONTP, "font-weight": 900, "font-size": 46, fill: RED }, g, "NO ES UNA ENTRADA");
  el("text", { x: 0, y: 46, "text-anchor": "middle", "font-family": FONTP, "font-weight": 900, "font-size": 46, fill: RED }, g, "AUTOMÁTICA");
  el("path", { d: "M-280 26 L280 26", stroke: RED, "stroke-width": 8, "stroke-dasharray": `${(560 * E.out(clamp((tt - 0.3) / 0.3))).toFixed(1)} 2000`, "stroke-linecap": "round" }, g);
}

// ----- Contador de reacciones -----
function drawCounter(n, kn, k) {
  if (k <= 0) return;
  const g = el("g", { transform: `translate(540,300) scale(${E.backBig(clamp(k)).toFixed(3)})` }, v5G);
  el("rect", { x: -230, y: -40, width: 460, height: 80, rx: 40, fill: "#0E1220", stroke: BLUE2, "stroke-width": 4 }, g);
  el("text", { x: -40, y: 14, "text-anchor": "middle", "font-family": FONTP, "font-weight": 900, "font-size": 36, fill: "#fff" }, g, "REACCIONES");
  const b = el("g", { transform: `translate(160,0) scale(${(1 + (1 - E.out(clamp(kn))) * 0.6).toFixed(3)})` }, g);
  el("circle", { r: 32, fill: BLUE2 }, b);
  el("text", { x: 0, y: 15, "text-anchor": "middle", "font-family": FONTP, "font-weight": 900, "font-size": 44, fill: "#fff" }, b, String(n));
}

// ----- Emoji de reacción junto al círculo -----
function drawEmoji(ch, tt) {
  if (tt < 0 || tt > 1.6) return;
  const k = E.backBig(clamp(tt / 0.3)), a = 1 - clamp((tt - 1.3) / 0.3);
  const g = el("g", { transform: `translate(${PIP.x + 130},${PIP.y - 120 - tt * 20}) rotate(${Math.sin(tt * 6) * 8}) scale(${k.toFixed(3)})`, opacity: a.toFixed(3) }, v5G);
  el("circle", { r: 54, fill: "#fff", filter: "url(#txtSh)" }, g);
  el("path", { d: "M-30 36 L-48 64 L-6 46 Z", fill: "#fff" }, g);
  el("text", { x: 0, y: 22, "text-anchor": "middle", "font-family": "Noto Color Emoji", "font-size": 60 }, g, ch);
}

const render4 = window.renderState;
window.renderState = function (st) {
  // barrido entre temporalidades
  const wh = st.whip ?? 0;
  monG.setAttribute("filter", Math.abs(wh) > 0.02 ? "url(#whip)" : "");
  window.whipBlur.setAttribute("stdDeviation", `${(Math.abs(wh) * 26).toFixed(1)} 0`);
  render4(st);
  monG.setAttribute("transform", `translate(${(wh * 140).toFixed(1)},0)`);
  // golpe de zoom
  const kick = st.kick ?? 0;
  if (kick) camG.setAttribute("transform", `translate(540,760) scale(${(1 + kick).toFixed(4)}) translate(-540,-760) ` + camG.getAttribute("transform"));
  // el círculo late con la voz
  if (pipG.style.display !== "none") {
    const m = st.mouth ?? 0;
    pipRing.setAttribute("stroke-width", (8 + m * 8).toFixed(1));
    pipG.setAttribute("transform", pipG.getAttribute("transform") + ` translate(${PIP.x},${PIP.y}) scale(${(1 + m * 0.035).toFixed(4)}) translate(${-PIP.x},${-PIP.y})`);
    pipIn.setAttribute("transform", `translate(0,${(Math.sin((st.t ?? 0) * 3.1) * 5).toFixed(1)}) rotate(${(Math.sin((st.t ?? 0) * 1.7) * 2.5).toFixed(2)},${PIP.x},${PIP.y + 100})`);
  }
  v5G.textContent = "";
  if (st.outro4 != null && st.outro4 !== false && st.outro4 > 0.35) return;
  if (st.tug) drawTug(st.tug, st.t ?? 0, st.tugI0, st.tugI1);
  if (st.rewind) drawRewind(st.rewind, st.t ?? 0);
  if (st.tags) drawTags(st.tags, st.tagFrom);
  if (st.stamp != null) drawStamp(st.stamp);
  if (st.counter) drawCounter(st.counter.n, st.counter.kn, st.counter.k);
  if (st.emoji) drawEmoji(st.emoji.ch, st.emoji.tt);
  if (st.punch) { kinG.textContent = ""; drawPunch(st.punch.w, st.punch.tt, st.punch.y ?? 1290); }
};
