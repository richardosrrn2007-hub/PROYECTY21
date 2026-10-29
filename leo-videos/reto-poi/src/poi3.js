// Reto POI v2 — estudio de trading: pantalla grande con gráfica estilo TradingView, Leo tecleando en su portátil,
// fondo gris claro con la avenida de velas 3D. renderState(st) dibuja un fotograma.
const W = 1080, H = 1920;
const P2 = {
  bg: "#E6E8EC", ink: "#111318", ink2: "#3A3F48", grey: "#8A8F98", grid: "#F0F1F4",
  bull: "#FFFFFF", bullB: "#4A4E57", bear: "#15171C", wick: "#3E424A", blue: "#2962FF", band: "#BFD0FF",
};
const FONTP = "Inter Display", FONTP2 = "Inter";
const svg = document.getElementById("stage");

// ---------- Datos reales GBPJPY (Yahoo Finance, 1h agregado a 4h/D/W; cada vela abre en el cierre anterior) ----------
const ZONES = { C: { lo: REAL.zones.C[0], hi: REAL.zones.C[1] }, A: { lo: REAL.zones.A[0], hi: REAL.zones.A[1] }, B: { lo: REAL.zones.B[0], hi: REAL.zones.B[1] } };
const mk = (r) => ({ t: r[0], o: r[1], h: r[2], l: r[3], c: r[4] });
const TF = { H4: REAL.H4.map(mk), D1: REAL.D1.map(mk), W1: REAL.W1.map(mk) };
const N = TF.H4.length;
const IDX = { start: REAL.off - 10, acc0: REAL.idx.acc0, acc1: REAL.idx.acc1, bStart: REAL.idx.bStart, aCross: REAL.idx.aCross };
IDX.touch = REAL.idx.touch.map((i) => ({ i, p: TF.H4[i].l }));
const MES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
const fmtT = (t, tf) => { const d = new Date(t * 1000); return tf === "H4" ? (d.getUTCHours() === 0 ? String(d.getUTCDate()) : String(d.getUTCHours()).padStart(2, "0") + ":00") : tf === "D1" ? (d.getUTCDate() === 1 ? MES[d.getUTCMonth()] : String(d.getUTCDate())) : MES[d.getUTCMonth()]; };

// ---------- Escena ----------
el("rect", { width: W, height: H, fill: P2.bg }, svg);
const bgG = el("g", { opacity: 0.32 }, svg);
const city = createCity(bgG);
// versión clara de la avenida de velas
city.g.querySelector("rect").setAttribute("fill", "none");
city.g.querySelectorAll("line").forEach((l) => l.setAttribute("stroke", "#9AA0AA"));
city.g.querySelectorAll("ellipse").forEach((e) => e.setAttribute("opacity", 0));
const fogRect = [...city.g.querySelectorAll("rect")].pop(); fogRect.setAttribute("fill", P2.bg);
const vign = el("defs", {}, svg);
const rg = el("radialGradient", { id: "studioLight", cx: "50%", cy: "38%", r: "70%" }, vign);
el("stop", { offset: "0%", "stop-color": "#FFFFFF", "stop-opacity": 0.85 }, rg); el("stop", { offset: "100%", "stop-color": "#FFFFFF", "stop-opacity": 0 }, rg);
const glowG = el("radialGradient", { id: "screenGlow" }, vign);
el("stop", { offset: "0%", "stop-color": P2.blue, "stop-opacity": 0.28 }, glowG); el("stop", { offset: "100%", "stop-color": P2.blue, "stop-opacity": 0 }, glowG);
const glass = el("linearGradient", { id: "glass", x1: 0, y1: 0, x2: 1, y2: 1 }, vign);
el("stop", { offset: "0%", "stop-color": "#fff", "stop-opacity": 0.0 }, glass); el("stop", { offset: "45%", "stop-color": "#fff", "stop-opacity": 0.0 }, glass);
el("stop", { offset: "50%", "stop-color": "#fff", "stop-opacity": 0.16 }, glass); el("stop", { offset: "62%", "stop-color": "#fff", "stop-opacity": 0.0 }, glass);
const sh = el("filter", { id: "soft", x: "-20%", y: "-20%", width: "140%", height: "150%" }, vign);
el("feDropShadow", { dx: 0, dy: 24, stdDeviation: 26, "flood-color": "#1B2340", "flood-opacity": 0.28 }, sh);
el("rect", { width: W, height: H, fill: "url(#studioLight)" }, svg);

const dust = []; for (let i = 0; i < 34; i++) dust.push(el("circle", { r: 2 + (i % 4), fill: i % 3 ? "#FFFFFF" : P2.blue, opacity: 0.5 }, svg));
const camG = el("g", {}, svg);          // todo lo que la cámara mueve
const titleG = el("g", {}, svg);
const capG = el("g", {}, svg);

// Pantalla grande
const MON = { x: 50, y: 330, w: 980, h: 706 };
const monG = el("g", {}, camG);
const halo = el("ellipse", { cx: MON.x + MON.w / 2, cy: MON.y + MON.h / 2, rx: 640, ry: 520, fill: "url(#screenGlow)" }, monG);
el("rect", { x: MON.x - 18, y: MON.y - 18, width: MON.w + 36, height: MON.h + 36, rx: 28, fill: "#16181D", filter: "url(#soft)" }, monG);
el("rect", { x: MON.x - 18, y: MON.y - 18, width: MON.w + 36, height: MON.h + 36, rx: 28, fill: "none", stroke: "#2B2F37", "stroke-width": 3 }, monG);
el("rect", { x: 500, y: MON.y + MON.h + 18, width: 80, height: 70, fill: "#2B2F37" }, monG);
el("rect", { x: 400, y: MON.y + MON.h + 82, width: 280, height: 18, rx: 9, fill: "#2B2F37" }, monG);
const scr = el("svg", { x: MON.x, y: MON.y, width: MON.w, height: MON.h, viewBox: "0 0 1000 720", preserveAspectRatio: "none" }, monG);
const glassR = el("rect", { x: MON.x, y: MON.y, width: MON.w, height: MON.h, fill: "url(#glass)", "pointer-events": "none" }, monG);

// Contenido de la pantalla (estilo TradingView)
el("rect", { width: 1000, height: 720, fill: "#FFFFFF" }, scr);
const tb = el("g", {}, scr); // barra superior
el("rect", { width: 1000, height: 52, fill: "#F7F8FA" }, tb);
el("line", { x1: 0, x2: 1000, y1: 52, y2: 52, stroke: "#E1E3E8", "stroke-width": 2 }, tb);
el("text", { x: 22, y: 34, "font-family": FONTP2, "font-weight": 800, "font-size": 22, fill: P2.ink }, tb, "GBPJPY");
el("text", { x: 360, y: 33, "font-family": FONTP2, "font-weight": 600, "font-size": 16, fill: P2.grey }, tb, "Velas   ƒx Indicadores   ⊞ Plantillas   ⏰ Alerta");
const tfBtns = ["W", "D", "4H"].map((n, i) => {
  const g = el("g", { transform: `translate(${150 + i * 64},10)` }, tb);
  const r = el("rect", { width: 54, height: 32, rx: 6, fill: "none" }, g);
  const t = el("text", { x: 27, y: 23, "text-anchor": "middle", "font-family": FONTP2, "font-weight": 800, "font-size": 18, fill: P2.ink2 }, g, n);
  return { g, r, t, n };
});
el("text", { x: 978, y: 34, "text-anchor": "end", "font-family": FONTP2, "font-weight": 600, "font-size": 15, fill: P2.grey }, tb, "Datos reales · fines educativos");
const PLOT = { x: 54, y: 62, w: 846, h: 600 };
{ const side = el("g", {}, scr); el("rect", { x: 0, y: 53, width: 44, height: 667, fill: "#F7F8FA" }, side); el("line", { x1: 44, x2: 44, y1: 53, y2: 720, stroke: "#E1E3E8", "stroke-width": 2 }, side);
  const ic = ["M12 4v16M4 12h16", "M5 19 19 5", "M4 6h16v12H4z", "M6 18 18 6M6 6h4M14 18h4", "M7 4v16M17 4v16M4 9h6M14 15h6", "M4 7h16M7 7v10M12 7v10M17 7v10", "M12 3l9 9-9 9-9-9z", "M5 12a7 7 0 1 0 14 0a7 7 0 1 0-14 0"];
  ic.forEach((d, i) => { const g = el("g", { transform: `translate(10,${72 + i * 48}) scale(1)` }, side); el("path", { d, stroke: "#4A4E57", "stroke-width": 1.8, fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" }, g); });
  el("text", { x: 980, y: 712, "text-anchor": "end", "font-family": FONTP2, "font-weight": 600, "font-size": 14, fill: P2.grey }, scr, "UTC");
}
const cl = el("clipPath", { id: "scrClip" }, scr); el("rect", { x: PLOT.x, y: PLOT.y, width: PLOT.w, height: PLOT.h }, cl);
const gridG = el("g", {}, scr), bandG = el("g", { "clip-path": "url(#scrClip)" }, scr), candG = el("g", { "clip-path": "url(#scrClip)" }, scr);
const markG = el("g", { "clip-path": "url(#scrClip)" }, scr), axisG = el("g", {}, scr);
const cursor = el("g", {}, scr);
el("path", { d: "M0 0 L0 26 L7 20 L12 31 L17 29 L12 18 L21 18 Z", fill: "#111", stroke: "#fff", "stroke-width": 2 }, cursor);

function drawChart(v) {
  gridG.textContent = ""; bandG.textContent = ""; candG.textContent = ""; markG.textContent = ""; axisG.textContent = "";
  const data = TF[v.tf];
  const toX = (i) => PLOT.x + ((i - v.i0) / (v.i1 - v.i0)) * PLOT.w;
  const toY = (p) => PLOT.y + (1 - (p - v.pmin) / (v.pmax - v.pmin)) * PLOT.h;
  const step = v.pmax - v.pmin > 8 ? 2 : v.pmax - v.pmin > 4 ? 1 : 0.5;
  for (let p = Math.ceil(v.pmin / step) * step; p <= v.pmax; p += step) {
    const y = toY(p);
    el("line", { x1: PLOT.x, x2: PLOT.x + PLOT.w, y1: y, y2: y, stroke: P2.grid, "stroke-width": 1.5 }, gridG);
    el("text", { x: PLOT.x + PLOT.w + 10, y: y + 6, "font-family": FONTP2, "font-weight": 500, "font-size": 15, fill: P2.grey }, axisG, p.toFixed(3));
  }
  const span = v.i1 - v.i0, every = Math.max(1, Math.round(span / 7));
  for (let i = Math.ceil(v.i0 / every) * every; i < v.i1; i += every) {
    if (i < 0 || i >= data.length) continue;
    const x = toX(i + 0.5);
    el("line", { x1: x, x2: x, y1: PLOT.y, y2: PLOT.y + PLOT.h, stroke: P2.grid, "stroke-width": 1.5 }, gridG);
    el("text", { x, y: PLOT.y + PLOT.h + 28, "text-anchor": "middle", "font-family": FONTP2, "font-weight": 500, "font-size": 15, fill: P2.grey }, axisG, fmtT(data[i].t, v.tf));
  }
  // marca de agua y cabecera OHLC (como TradingView)
  el("text", { x: PLOT.x + PLOT.w / 2, y: PLOT.y + PLOT.h / 2 + 30, "text-anchor": "middle", "font-family": FONTP2, "font-weight": 800, "font-size": 92, fill: "#000", opacity: 0.04 }, gridG, `GBPJPY, ${v.tf === "W1" ? "1W" : v.tf === "D1" ? "1D" : "4h"}`);
  { const lc = data[Math.min(data.length - 1, Math.floor(v.i1) - 1)] || data[data.length - 1], up = lc.c >= lc.o, col = up ? "#089981" : "#F23645";
    const t = el("text", { x: PLOT.x + 6, y: PLOT.y + 22, "font-family": FONTP2, "font-weight": 600, "font-size": 15, fill: P2.ink2 }, axisG);
    el("tspan", {}, t, `Libra / Yen · ${v.tf === "W1" ? "1S" : v.tf === "D1" ? "1D" : "4h"} · FX   `);
    for (const [k, val] of [["O", lc.o], ["H", lc.h], ["L", lc.l], ["C", lc.c]]) { el("tspan", { fill: P2.ink2 }, t, k); el("tspan", { fill: col }, t, val.toFixed(3) + "  "); } }
  for (const k of ["A", "B", "C"]) {
    const z = v.zones?.[k]; if (!z || z.op <= 0) continue;
    const Z = ZONES[k], x0 = Math.max(PLOT.x, toX(z.from)), x1 = z.to != null ? toX(z.to) : PLOT.x + PLOT.w * (z.draw ?? 1) + (1 - (z.draw ?? 1)) * 0;
    const xe = x0 + (Math.min(x1, PLOT.x + PLOT.w) - x0) * (z.draw ?? 1);
    const y0 = toY(Z.hi), y1 = toY(Z.lo);
    const g = el("g", { opacity: z.op }, bandG);
    el("rect", { x: x0, y: y0, width: Math.max(0, xe - x0), height: y1 - y0, fill: P2.band, opacity: 0.9 }, g);
    if (z.strong) el("rect", { x: x0, y: y0, width: Math.max(0, xe - x0), height: y1 - y0, fill: "none", stroke: P2.blue, "stroke-width": 3.5 * z.strong }, g);
    if ((z.draw ?? 1) > 0.95) el("text", { x: (x0 + xe) / 2, y: (y0 + y1) / 2 + 9, "text-anchor": "middle", "font-family": FONTP, "font-weight": 900, "font-size": 26, fill: z.labCol ?? "#1B2A6B", opacity: z.labOp ?? 1 }, g, k);
    if (z.cursorAt) { cursor.setAttribute("transform", `translate(${xe - 2},${y1 - 2})`); }
  }
  const i0 = Math.max(0, Math.floor(v.i0)), i1 = Math.min(data.length - 1, Math.ceil(v.i1));
  const cw = Math.max(2, (PLOT.w / (v.i1 - v.i0)) * 0.62);
  for (let i = i0; i <= i1; i++) {
    const c = data[i], x = toX(i + 0.5), bull = c.c >= c.o;
    el("line", { x1: x, x2: x, y1: toY(c.h), y2: toY(c.l), stroke: bull ? P2.bullB : P2.bear, "stroke-width": 1.4 }, candG);
    const yt = toY(Math.max(c.o, c.c)), yb = toY(Math.min(c.o, c.c));
    el("rect", { x: x - cw / 2, y: yt, width: cw, height: Math.max(1.4, yb - yt), fill: bull ? P2.bull : P2.bear, stroke: bull ? P2.bullB : P2.bear, "stroke-width": 1.2 }, candG);
  }
  for (const m of v.marks ?? []) {
    const x = toX(m.i + 0.5), y = toY(m.p), k = m.k ?? 1;
    if (m.kind === "circle") el("circle", { cx: x, cy: y, r: (m.r ?? 22) * k, fill: "none", stroke: P2.blue, "stroke-width": 3 }, markG);
    if (m.kind === "arrow") { const g = el("g", { transform: `translate(${x},${y + 8})` }, markG); el("path", { d: "M0 44 L0 6 M-10 18 L0 4 L10 18", stroke: P2.blue, "stroke-width": 3.5, fill: "none", "stroke-linecap": "round" }, g); }
  }
  if (v.tf === "H4" && v.i1 >= N - 1) {
    const last = data[N - 1].c, y = toY(last);
    el("line", { x1: PLOT.x, x2: PLOT.x + PLOT.w, y1: y, y2: y, stroke: P2.grey, "stroke-width": 1.2, "stroke-dasharray": "2 5" }, candG);
    el("rect", { x: PLOT.x + PLOT.w + 4, y: y - 13, width: 82, height: 26, rx: 3, fill: P2.ink }, axisG);
    el("text", { x: PLOT.x + PLOT.w + 45, y: y + 6, "text-anchor": "middle", "font-family": FONTP2, "font-weight": 700, "font-size": 15, fill: "#fff" }, axisG, last.toFixed(3));
  }
  tfBtns.forEach((b) => { const on = b.n === (v.tf === "W1" ? "W" : v.tf === "D1" ? "D" : "4H"); b.r.setAttribute("fill", on ? P2.blue : "none"); b.t.setAttribute("fill", on ? "#fff" : P2.ink2); });
  cursor.style.display = v.cursor ? "" : "none";
  if (v.cursor && v.cursor !== true) cursor.setAttribute("transform", `translate(${v.cursor[0]},${v.cursor[1]})`);
}

// Escritorio, portátil y Leo
const deskG = el("g", {}, camG);
const leoG = el("g", {}, deskG);
const leo = createLeo(leoG);
const desk = el("g", { filter: "url(#soft)" }, deskG);
el("rect", { x: -20, y: 1720, width: 1120, height: 40, rx: 10, fill: "#F7F7F5" }, desk);
el("rect", { x: 0, y: 1760, width: 1080, height: 200, fill: "#D9DBE0" }, desk);
el("rect", { x: 0, y: 1760, width: 1080, height: 16, fill: "#C9CCD3" }, desk);
const lap = el("g", {}, deskG);
el("path", { d: "M200 1720 L218 1600 L442 1600 L460 1720 Z", fill: "#2A2E36" }, lap);
el("path", { d: "M208 1716 L224 1608 L436 1608 L452 1716 Z", fill: "#353A44" }, lap);
el("image", { href: "logo-lfx.png", x: 262, y: 1636, width: 136, height: 50, opacity: 0.9 }, lap);
el("rect", { x: 186, y: 1716, width: 288, height: 9, rx: 4, fill: "#1E2128" }, lap);
// segundo monitor con el semanal
const mon2 = el("g", { filter: "url(#soft)" }, deskG);
el("rect", { x: 640, y: 1430, width: 390, height: 240, rx: 14, fill: "#16181D" }, mon2);
el("rect", { x: 810, y: 1670, width: 50, height: 40, fill: "#2B2F37" }, mon2); el("rect", { x: 760, y: 1706, width: 150, height: 14, rx: 7, fill: "#2B2F37" }, mon2);
const scr2 = el("svg", { x: 652, y: 1442, width: 366, height: 216, viewBox: "0 0 366 216" }, mon2);
el("rect", { width: 366, height: 216, fill: "#fff" }, scr2);
el("text", { x: 10, y: 20, "font-family": FONTP2, "font-weight": 800, "font-size": 13, fill: P2.ink }, scr2, "GBPJPY · 1S");
{ const w1 = TF.W1, mn = Math.min(...w1.map((c) => c.l)), mx = Math.max(...w1.map((c) => c.h)); const Y = (p) => 30 + (1 - (p - mn) / (mx - mn)) * 176;
  el("rect", { x: 0, y: Y(ZONES.C.hi), width: 366, height: Y(ZONES.C.lo) - Y(ZONES.C.hi), fill: P2.band, opacity: 0.9 }, scr2);
  w1.forEach((c, i) => { const x = 8 + i * (350 / w1.length), bull = c.c >= c.o; el("line", { x1: x + 3, x2: x + 3, y1: Y(c.h), y2: Y(c.l), stroke: bull ? P2.bullB : P2.bear, "stroke-width": 1 }, scr2); el("rect", { x, y: Y(Math.max(c.o, c.c)), width: 6, height: Math.max(1, Y(Math.min(c.o, c.c)) - Y(Math.max(c.o, c.c))), fill: bull ? "#fff" : P2.bear, stroke: bull ? P2.bullB : P2.bear, "stroke-width": 1 }, scr2); }); }
// planta
const plant = el("g", { transform: "translate(60,1720)" }, deskG);
el("path", { d: "M-34 0 L34 0 L26 -70 L-26 -70 Z", fill: "#C9B79C" }, plant);
const leaves = [[-60, -150, -30], [-20, -190, -8], [30, -170, 14], [60, -130, 34], [0, -140, 0]].map(([x, y, r]) => el("path", { d: `M0 -70 Q${x * 0.4} ${(y - 70) / 2} ${x} ${y} Q${x * 0.9} ${(y - 70) / 2 + 20} 0 -70 Z`, fill: r % 2 ? "#3E8E5E" : "#2F7A4E" }, plant));
// lámpara de escritorio con luz cálida
const lamp = el("g", {}, deskG);
el("path", { d: "M520 1720 L540 1600 L600 1560", stroke: "#2B2F37", "stroke-width": 8, fill: "none", "stroke-linecap": "round" }, lamp);
el("path", { d: "M580 1540 L640 1560 L620 1600 L560 1580 Z", fill: "#2B2F37" }, lamp);
const lampLight = el("path", { d: "M600 1590 L520 1720 L720 1720 L630 1600 Z", fill: "#FFE7A8", opacity: 0.35 }, lamp);
// toro LFX en el escritorio
el("image", { href: "logo-lfx.png", x: 470, y: 1660, width: 150, height: 55, opacity: 0.95 }, deskG);
const mug = el("g", { transform: "translate(990,1662)" }, deskG);
el("rect", { x: -26, y: 0, width: 52, height: 60, rx: 8, fill: "#FFFFFF" }, mug);
el("path", { d: "M26 14 C46 14 46 40 26 40", stroke: "#FFFFFF", "stroke-width": 9, fill: "none" }, mug);
el("text", { x: 0, y: 40, "text-anchor": "middle", "font-family": FONTP, "font-weight": 900, "font-size": 20, fill: P2.blue }, mug, "LFX");

function drawUI(st) {
  titleG.textContent = ""; capG.textContent = "";
  const rich = (parent, parts, x, y, size, anchor = "middle") => { const t = el("text", { x, y, "text-anchor": anchor, "font-family": FONTP, "font-weight": 900, "font-size": size }, parent); for (const [s2, b] of parts) el("tspan", { fill: b ? P2.blue : P2.ink }, t, s2); return t; };
  if (st.title) { st.title.forEach((ln, i) => rich(titleG, ln, 540, 150 + i * 78, i ? 60 : 64)); }
  if (st.step) { el("rect", { x: 70, y: 110, width: 940, height: 100, rx: 50, fill: "#fff", filter: "url(#soft)" }, titleG); rich(titleG, st.step, 540, 177, 50); }
  if (st.cap) { const g = el("g", {}, capG); el("rect", { x: 580, y: 1300, width: 460, height: 150, rx: 30, fill: "#fff", filter: "url(#soft)" }, g); el("path", { d: "M600 1420 L556 1448 L630 1430 Z", fill: "#fff" }, g); st.cap.forEach((ln, i) => rich(g, ln, 810, 1363 + i * 54, 40)); }
  if (st.count != null) {
    const g = el("g", { transform: "translate(870,1180)" }, titleG);
    el("circle", { r: 78, fill: "#fff", filter: "url(#soft)" }, g);
    el("circle", { r: 64, fill: "none", stroke: "#E1E5F0", "stroke-width": 12 }, g);
    el("circle", { r: 64, fill: "none", stroke: P2.blue, "stroke-width": 12, "stroke-dasharray": `${2 * Math.PI * 64}`, "stroke-dashoffset": `${2 * Math.PI * 64 * st.countP}`, transform: "rotate(-90)", "stroke-linecap": "round" }, g);
    el("text", { x: 0, y: 24, "text-anchor": "middle", "font-family": FONTP, "font-weight": 900, "font-size": 68, fill: P2.ink }, g, String(st.count));
  }
  if (st.banner) { const g = el("g", {}, titleG); el("rect", { x: 170, y: 1100, width: 740, height: 92, rx: 46, fill: P2.blue, filter: "url(#soft)" }, g); el("text", { x: 540, y: 1160, "text-anchor": "middle", "font-family": FONTP, "font-weight": 900, "font-size": 42, fill: "#fff" }, g, st.banner); }
}

function renderState(st) {
  city.update(st.t ?? 5, {});
  const tt = st.t ?? 0;
  dust.forEach((d, i) => { const sp = 10 + (i % 5) * 6, x = (i * 197) % W, y = H - ((tt * sp + i * 131) % (H + 100)); d.setAttribute("cx", (x + Math.sin(tt * 0.7 + i) * 24).toFixed(1)); d.setAttribute("cy", y.toFixed(1)); d.setAttribute("opacity", (0.25 + 0.3 * Math.sin(tt * 1.3 + i) ** 2).toFixed(2)); });
  leaves.forEach((l, i) => l.setAttribute("transform", `rotate(${(Math.sin(tt * 1.2 + i) * 3).toFixed(2)},0,-70)`));
  lampLight.setAttribute("opacity", (0.3 + Math.sin(tt * 2) * 0.03).toFixed(3));
  drawChart(st.view);
  // cámara: 0 = plano general; 1 = la pantalla llena el ancho
  const z = st.zoom ?? 0;
  const s = 1 + z * 0.12, cy = MON.y + MON.h / 2;
  camG.setAttribute("transform", `translate(540,${cy}) scale(${s}) translate(-540,${-cy + z * 40})`);
  glassR.setAttribute("x", MON.x + ((st.t ?? 0) * 60) % 400 - 200);
  const typing = st.typing ? Math.sin((st.t ?? 0) * 20) * 6 : 0;
  leo.update({ t: st.t ?? 0, x: 330, y: 2150, scale: 1.18, ...POSE[st.leo ?? "rest"], ...(st.leo === "type" ? { shL: -22, elL: -70 + typing, shR: 22, elR: 70 - typing, tilt: 0, brow: 0.2, smile: 0.5 } : {}), handR: st.handR ?? "fist", handL: st.handL ?? "fist", mouth: st.mouth ?? 0, smile: st.smile ?? 0.6, brow: st.brow ?? 0.3, lookX: st.lookX ?? 0, lookY: st.lookY ?? 0 });
  drawUI(st);
}
POSE.type = { shL: -22, elL: -70, shR: 22, elR: 70, tilt: 0, brow: 0.2, smile: 0.5 };
window.renderState = renderState;
window.POIDATA = { N, IDX, ZONES, TF, PLOT };
