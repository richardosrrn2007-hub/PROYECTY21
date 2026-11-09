// Reel "Comprar tarde" con la estética del video de referencia: cámara de Leo en tarjeta redondeada arriba,
// lienzo gris claro con gráfica minimalista abajo, botones 3D con mano, "?" 3D, caja TP/SL, campo de comentario.
// Al inicio, pantalla estilo MT5 con la pérdida. renderAt(t) dibuja el fotograma del segundo t.
const W = 1080, H = 1920, svg = document.getElementById("stage");
const F1 = "Inter Display", F2 = "Inter";
const CL = { bg0: "#F1F1F2", bg1: "#D6D7DA", up: "#22B35E", dn: "#E5484D", gold: "#D8B26E", blue: "#2F7DF6", ink: "#15171C", grey: "#8A8F98", tp: "#9CCBF2", sl: "#F4AFAF" };
const WD = TL.words, K = ENT, D = REAL.H4.map((r) => ({ t: r[0], o: r[1], h: r[2], l: r[3], c: r[4] })), ND = D.length;
const norm = (s) => s.toLowerCase().replace(/[¿?¡!.,"«»]/g, "");
function wt(rx, nth = 0) { let c = 0; for (const w of WD) if (new RegExp(rx, "i").test(norm(w[2]))) { if (c === nth) return w[0]; c++; } throw new Error("palabra " + rx); }
const T = {
  subio: wt("^subió$"), perdiendo: wt("^perdiendo$"), dinero: wt("^dinero$"), como: wt("^cómo$"), mostrarte: wt("^mostrarte$"), mira: wt("^mira$"), maximos: wt("^máximos$"), minimos: wt("^mínimos$"), altos: wt("^altos$"),
  piensas: wt("^piensas$"), comprar: wt("^comprar$"), escape: wt("^escape$"), error: wt("^error$"), compraria: wt("^compraría$"), esperaria: wt("^esperaría$"), zona1: wt("^zona$"), pienso: wt("^piénsalo$"),
  c0: TL.count[0], c1: TL.count[1], ahora: wt("^ahora$"), compraste: wt("^compraste$"), stop1: wt("^stop$"), minimo: wt("^mínimo$"), retrocedio: wt("^retrocedió$"), sacando: wt("^sacando$"), subio2: wt("^subió$", 1),
  idea: wt("^idea$"), correcta: wt("^correcta$"), entrada1: wt("^entrada$"), stop3: wt("^stop$", 2), correctos: wt("^correctos$"), poreso: wt("^eso$"), primero: wt("^primero$"), estructura2: wt("^estructura$", 1),
  marco: wt("^marco$"), zona2: wt("^zona$", 1), trazo: wt("^trazo$"), fibo: wt("^fibonacci$"), coincide: wt("^coincide$"), esperando: wt("^esperando$"), regrese: wt("^regrese$"), entrada2: wt("^entrada$", 1),
  tocar: wt("^tocar$"), perseguir: wt("^perseguir$"), porque2: wt("^porque$", 1), quieres: wt("^quieres$"), sigueme: wt("^sígueme$"), comenta: wt("^comenta$"), zonasW: wt("^zonas$", 1), gratuita: wt("^gratuita$"),
  outro: TL.outro, total: TL.total,
};
T.siVa = T.tocar - 1.3; T.chart = T.mostrarte - 0.1;

// ---------- capas ----------
const defs = el("defs", {}, svg);
const grad = (id, a, b, vert = true) => { const g = el("linearGradient", { id, x1: 0, y1: 0, x2: vert ? 0 : 1, y2: vert ? 1 : 0 }, defs); el("stop", { offset: "0%", "stop-color": a }, g); el("stop", { offset: "100%", "stop-color": b }, g); };
grad("bgG", CL.bg0, CL.bg1); grad("btnG", "#3DDC7E", "#1E9E52"); grad("btnR", "#F26A6E", "#C9363B"); grad("btnB", "#5C9BFF", "#2462D8"); grad("q3d", "#FFFFFF", "#BFC3CA"); grad("mt5", "#1B1D22", "#101114");
const shf = el("filter", { id: "sh", x: "-20%", y: "-20%", width: "140%", height: "160%" }, defs); el("feDropShadow", { dx: 0, dy: 14, stdDeviation: 16, "flood-color": "#000", "flood-opacity": 0.28 }, shf);
const sht = el("filter", { id: "sht", x: "-20%", y: "-40%", width: "140%", height: "190%" }, defs); el("feDropShadow", { dx: 0, dy: 4, stdDeviation: 5, "flood-color": "#000", "flood-opacity": 0.65 }, sht);
const glow = el("filter", { id: "glow", x: "-30%", y: "-30%", width: "160%", height: "160%" }, defs); el("feGaussianBlur", { stdDeviation: 6 }, glow);
el("rect", { width: W, height: H, fill: "url(#bgG)" }, svg);
const chartG = el("g", {}, svg), ovG = el("g", {}, svg), fxG = el("g", {}, svg), mtG = el("g", {}, svg), camG = el("g", {}, svg), capG = el("g", {}, svg), topG = el("g", {}, svg), outG = el("g", {}, svg);
const cl = el("clipPath", { id: "camClip" }, defs), camRect = el("rect", { rx: 38 }, cl);
const camShadow = el("rect", { rx: 38, fill: "#000", filter: "url(#sh)", opacity: 0.35 }, camG);
const camIn = el("g", { "clip-path": "url(#camClip)" }, camG);
const camMov = el("g", {}, camIn);
const camImg = el("image", { x: 0, y: 0, width: 1080, height: 700, preserveAspectRatio: "xMidYMid slice" }, camMov);
grad("camFade", "rgba(0,0,0,0)", "rgba(0,0,0,0.55)");
const camFade = el("rect", { fill: "url(#camFade)" }, camIn);
let camHref = "";

// ---------- utilidades de dibujo ----------
function btn3d(p, x, y, w, h, label, kind = "G", press = 0, s = 1) {
  const g = el("g", { transform: `translate(${x},${y}) scale(${s})` }, p);
  const base = { G: "#167A3F", R: "#982328", B: "#1A4BA8" }[kind];
  el("rect", { x: -w / 2, y: -h / 2 + 10, width: w, height: h, rx: 18, fill: base, filter: "url(#sh)" }, g);
  el("rect", { x: -w / 2, y: -h / 2 + press * 8, width: w, height: h, rx: 18, fill: `url(#btn${kind})` }, g);
  el("rect", { x: -w / 2 + 8, y: -h / 2 + 6 + press * 8, width: w - 16, height: h * 0.32, rx: 12, fill: "#fff", opacity: 0.22 }, g);
  el("text", { x: 0, y: h * 0.17 + press * 8, "text-anchor": "middle", "font-family": F1, "font-weight": 800, "font-size": h * 0.46, fill: "#fff" }, g, label);
  return g;
}
function hand(p, x, y, s = 1, press = 0) {
  const g = el("g", { transform: `translate(${x},${y + press * 10}) scale(${s * (1 - press * 0.08)})` }, p);
  el("path", { d: "M0 0 C0 -10 14 -10 14 0 V34 C14 26 28 26 28 36 V40 C28 32 42 32 42 42 V46 C42 38 56 38 56 48 V78 C56 100 44 112 24 112 H8 C-6 112 -14 104 -20 94 L-40 60 C-46 50 -34 42 -26 50 L0 70 Z", fill: "#fff", stroke: CL.ink, "stroke-width": 5, "stroke-linejoin": "round", filter: "url(#sht)" }, g);
}
function q3d(p, x, y, size, k, ch = "?") {
  if (k <= 0) return;
  const g = el("g", { transform: `translate(${x},${y}) scale(${E.backBig(clamp(k)).toFixed(3)}) rotate(${Math.sin(k * 6) * 4})` }, p);
  for (let i = 10; i > 0; i--) el("text", { x: i * 1.2, y: i * 1.4, "text-anchor": "middle", "font-family": F1, "font-weight": 900, "font-size": size, fill: "#9AA0A8" }, g, ch);
  el("text", { x: 0, y: 0, "text-anchor": "middle", "font-family": F1, "font-weight": 900, "font-size": size, fill: "url(#q3d)", stroke: "#fff", "stroke-width": 2 }, g, ch);
}
function pill(p, x, y, txt, col, k = 1, anchor = "middle", size = 30, fg = "#fff") {
  if (k <= 0) return;
  const g = el("g", { transform: `translate(${x},${y}) scale(${E.backBig(clamp(k)).toFixed(3)})` }, p);
  const m = el("text", { "font-family": F1, "font-weight": 800, "font-size": size }, g, txt); const w = m.getComputedTextLength() + size * 1.1; m.remove();
  const x0 = anchor === "end" ? -w : anchor === "middle" ? -w / 2 : 0;
  el("rect", { x: x0, y: -size * 0.95, width: w, height: size * 1.9, rx: size * 0.5, fill: col, filter: "url(#sht)" }, g);
  el("text", { x: x0 + w / 2, y: size * 0.36, "text-anchor": "middle", "font-family": F1, "font-weight": 800, "font-size": size, fill: fg }, g, txt);
}
function burst(p, x, y, tt, n = 16, r = 160, seed = 1) {
  if (tt < 0 || tt > 0.7) return;
  const k = E.out(clamp(tt / 0.7)), cols = [CL.gold, CL.blue, CL.up, "#fff"];
  for (let i = 0; i < n; i++) { const a = ((Math.sin(i * 12.9 + seed) * 43758.5) % 1) * Math.PI * 2, d = r * (0.5 + 0.5 * Math.abs(Math.sin(i * 7.1 + seed))) * k;
    el("rect", { x: -6, y: -4, width: 12, height: 8, rx: 2, fill: cols[i % 4], opacity: (1 - k).toFixed(3), transform: `translate(${(x + Math.cos(a) * d).toFixed(1)},${(y + Math.sin(a) * d + k * k * 50).toFixed(1)}) rotate(${(tt * 600 * (i % 2 ? 1 : -1)).toFixed(0)})` }, p); }
}

// ---------- gráfica minimalista ----------
let PR = { x: 70, y: 780, w: 860, h: 980 };
const hiOf = (a, b) => Math.max(...D.slice(a, b + 1).map((c) => c.h));
const gTop = Math.max(...K.ghost.map((g) => g[2]));
const V = {
  A: { i0: 0, i1: K.H + 22, pmin: K.sl - 0.0022, pmax: hiOf(0, K.H) + 0.0032 },
  G: { i0: 0, i1: K.H + 22, pmin: K.sl - 0.0022, pmax: gTop + 0.003 },
  B: { i0: 14, i1: ND + 2, pmin: K.sl - 0.0022, pmax: hiOf(0, ND - 1) + 0.003 },
};
const mixV = (a, b, k) => ({ i0: lerp(a.i0, b.i0, k), i1: lerp(a.i1, b.i1, k), pmin: lerp(a.pmin, b.pmin, k), pmax: lerp(a.pmax, b.pmax, k) });
const kfl = (t, keys) => kf(t, keys, E.lin);
const REV1 = [[T.mira - 0.1, 28], [T.maximos, K.zz[1][0]], [T.minimos, K.zz[2][0]], [T.altos - 0.3, K.zz[3][0]], [T.altos + 0.3, K.H]];
const REV2 = [[T.retrocedio - 0.3, K.H], [T.sacando, K.slHit], [T.subio2 - 0.3, K.touch], [T.subio2 + 1.0, Math.min(ND - 1, K.tpHit + 12)]];
const REV3 = [[T.regrese, K.H], [T.entrada2 + 0.2, K.tpHit + 3]];
function uptoAt(t) {
  if (t < T.mira - 0.1) return 28;
  if (t < T.retrocedio - 0.3) return kfl(t, REV1);
  if (t < T.poreso - 0.4) return kfl(t, REV2);
  if (t < T.poreso + 0.8) return lerp(kfl(T.poreso - 0.41, REV2), K.H, E.inOut(P(t, T.poreso - 0.4, 1.2, E.lin)));
  if (t < T.regrese) return K.H;
  if (t < T.siVa) return kfl(t, REV3);
  return K.H;
}
function viewAt(t) {
  let v;
  if (t < T.retrocedio) v = V.A;
  else if (t < T.poreso - 0.4) v = mixV(V.A, V.B, P(t, T.subio2 - 0.6, 1.0, E.inOut));
  else if (t < T.regrese) v = mixV(V.B, V.A, P(t, T.poreso - 0.4, 1.2, E.inOut));
  else if (t < T.siVa) v = mixV(V.A, V.B, P(t, T.regrese + 0.4, 1.2, E.inOut) * 0.6);
  else v = mixV(mixV(V.A, V.B, 0.6), V.G, P(t, T.siVa, 0.6, E.inOut));
  const u = uptoAt(t); return { ...v, upto: Math.floor(u), uptoK: u - Math.floor(u) };
}
let X, Y;
function drawCandles(p, v, data, colUp = CL.up, colDn = CL.dn, ghost = null) {
  X = (i) => PR.x + ((i + 0.5 - v.i0) / (v.i1 - v.i0)) * PR.w; Y = (pr) => PR.y + (1 - (pr - v.pmin) / (v.pmax - v.pmin)) * PR.h;
  const cw = Math.max(2, (PR.w / (v.i1 - v.i0)) * 0.6);
  for (let i = Math.max(0, Math.floor(v.i0)); i <= Math.min(data.length - 1, Math.ceil(v.i1), v.upto ?? 1e9); i++) {
    let c = data[i];
    if (i === v.upto && v.uptoK != null && v.uptoK < 1) { const k = v.uptoK, cc = c.o + (c.c - c.o) * k; c = { o: c.o, c: cc, h: Math.max(c.o, cc) + (c.h - Math.max(c.o, c.c)) * k, l: Math.min(c.o, cc) - (Math.min(c.o, c.c) - c.l) * k }; }
    const col = c.c >= c.o ? colUp : colDn, x = X(i);
    el("line", { x1: x, x2: x, y1: Y(c.h), y2: Y(c.l), stroke: col, "stroke-width": 2 }, p);
    el("rect", { x: x - cw / 2, y: Y(Math.max(c.o, c.c)), width: cw, height: Math.max(2, Y(Math.min(c.o, c.c)) - Y(Math.max(c.o, c.c))), fill: col, rx: 1 }, p);
  }
  if (ghost) { const g = el("g", { opacity: 0.55 }, p); ghost.arr.slice(0, ghost.n).forEach((r, k) => { const c = { o: r[1], h: r[2], l: r[3], c: r[4] }, x = X(ghost.from + k + 1);
    el("line", { x1: x, x2: x, y1: Y(c.h), y2: Y(c.l), stroke: CL.blue, "stroke-width": 2, "stroke-dasharray": "4 3" }, g);
    el("rect", { x: x - cw / 2, y: Y(Math.max(c.o, c.c)), width: cw, height: Math.max(2, Y(Math.min(c.o, c.c)) - Y(Math.max(c.o, c.c))), fill: c.c >= c.o ? "#BFD6FF" : CL.blue, stroke: CL.blue, "stroke-width": 1.5, "stroke-dasharray": "4 3" }, g); }); }
}
function hl(p, y, x0, x1, col, k = 1, dash = "", w = 3) { el("line", { x1: x0, x2: lerp(x0, x1, clamp(k)), y1: y, y2: y, stroke: col, "stroke-width": w, "stroke-dasharray": dash }, p); }
function xMark(p, x, y, k, r = 22) { if (k <= 0) return; const s = E.backBig(clamp(k)) * r; el("circle", { cx: x, cy: y, r: s * 1.25, fill: CL.dn, filter: "url(#sht)" }, p); el("path", { d: `M${x - s * 0.55} ${y - s * 0.55} L${x + s * 0.55} ${y + s * 0.55} M${x + s * 0.55} ${y - s * 0.55} L${x - s * 0.55} ${y + s * 0.55}`, stroke: "#fff", "stroke-width": 6, "stroke-linecap": "round" }, p); }
function vMark(p, x, y, k, r = 22) { if (k <= 0) return; const s = E.backBig(clamp(k)) * r; el("circle", { cx: x, cy: y, r: s * 1.25, fill: CL.up, filter: "url(#sht)" }, p); el("path", { d: `M${x - s * 0.55} ${y} L${x - s * 0.1} ${y + s * 0.45} L${x + s * 0.6} ${y - s * 0.5}`, stroke: "#fff", "stroke-width": 6, fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" }, p); }

// ---------- pantalla estilo MT5 con la pérdida (inicio) ----------
const LOT = 1, PIP = 100000 * LOT, LOSS = -(K.entryLate - K.slLate) * PIP, BAL0 = 10000;
function drawMT5(t, a) {
  if (a <= 0) return;
  const g = el("g", { opacity: a.toFixed(3) }, mtG);
  const bx = 40, by = 700, bw = 1000, bh = 1120, s = 1 - 0.06 * (1 - a);
  const w = el("g", { transform: `translate(540,${by + bh / 2}) scale(${s}) translate(-540,${-(by + bh / 2)})` }, g);
  el("rect", { x: bx, y: by, width: bw, height: bh, rx: 26, fill: "url(#mt5)", filter: "url(#sh)" }, w);
  el("rect", { x: bx, y: by, width: bw, height: 64, rx: 26, fill: "#2A2D33" }, w); el("rect", { x: bx, y: by + 40, width: bw, height: 24, fill: "#2A2D33" }, w);
  [["#FF5F57", 0], ["#FEBC2E", 1], ["#28C840", 2]].forEach(([c, i]) => el("circle", { cx: bx + 34 + i * 30, cy: by + 32, r: 9, fill: c }, w));
  el("text", { x: 540, y: by + 41, "text-anchor": "middle", "font-family": F2, "font-weight": 700, "font-size": 24, fill: "#C9CDD4" }, w, "MetaTrader 5  —  EURUSD, H4");
  // gráfica (los mismos datos reales)
  const keep = PR; PR = { x: bx + 30, y: by + 110, w: bw - 160, h: 600 };
  const up = kfl(t, [[0.2, 74], [T.subio + 0.8, K.H], [T.perdiendo - 0.4, K.H + 2], [T.dinero + 0.2, K.slHit], [T.como + 0.9, Math.min(ND - 1, K.tpHit + 3)]]);
  const v = { i0: 70, i1: K.tpHit + 6, pmin: Math.min(...D.slice(70, K.tpHit + 5).map((c) => c.l)) - 0.0008, pmax: hiOf(70, K.tpHit + 4) + 0.0008, upto: Math.floor(up), uptoK: up - Math.floor(up) };
  const cg = el("g", {}, w);
  for (let k = 0; k < 6; k++) el("line", { x1: PR.x, x2: PR.x + PR.w, y1: PR.y + k * PR.h / 5, y2: PR.y + k * PR.h / 5, stroke: "#2A2D33", "stroke-width": 1.5, "stroke-dasharray": "3 5" }, cg);
  drawCandles(cg, v, D, "#26A69A", "#EF5350");
  const yE = Y(K.entryLate), yS = Y(K.slLate);
  const tOpen = T.subio + 0.8, kOpen = P(t, tOpen, 0.4, E.lin);
  if (t >= tOpen) {
    hl(w, yE, PR.x, PR.x + PR.w, "#26A69A", 1, "8 6", 2.5); hl(w, yS, PR.x, PR.x + PR.w, "#EF5350", 1, "8 6", 2.5);
    el("text", { x: PR.x + 8, y: yE - 10, "font-family": F2, "font-weight": 700, "font-size": 22, fill: "#26A69A", opacity: kOpen }, w, "#4815 buy 1.00");
    el("text", { x: PR.x + 8, y: yS + 28, "font-family": F2, "font-weight": 700, "font-size": 22, fill: "#EF5350", opacity: kOpen }, w, "#4815 sl");
  }
  // eje de precios
  const lastI = Math.min(v.upto, ND - 1), last = D[lastI].c;
  el("rect", { x: PR.x + PR.w + 8, y: Y(last) - 16, width: 108, height: 32, rx: 4, fill: last >= D[Math.max(0, lastI - 1)].c ? "#26A69A" : "#EF5350" }, w);
  el("text", { x: PR.x + PR.w + 62, y: Y(last) + 8, "text-anchor": "middle", "font-family": F2, "font-weight": 700, "font-size": 20, fill: "#fff" }, w, last.toFixed(5));
  PR = keep;
  // caja de herramientas: operación y saldo
  const ty = by + 760;
  el("rect", { x: bx, y: ty, width: bw, height: bh - 760, fill: "#15171B" }, w);
  el("text", { x: bx + 30, y: ty + 50, "font-family": F2, "font-weight": 800, "font-size": 26, fill: "#C9CDD4" }, w, "Operaciones");
  const hdr = ["Símbolo", "Tipo", "Volumen", "Precio", "S/L", "Beneficio"], xs = [bx + 30, bx + 210, bx + 340, bx + 500, bx + 680, bx + 860];
  hdr.forEach((h, i) => el("text", { x: xs[i], y: ty + 100, "font-family": F2, "font-weight": 600, "font-size": 21, fill: "#7C828C" }, w, h));
  const hit = t >= T.dinero + 0.2;
  const curP = hit ? LOSS : t >= tOpen ? (D[Math.max(K.H, Math.min(v.upto, K.slHit))].c - K.entryLate) * PIP : 0;
  if (t >= tOpen) {
    const rowY = ty + 150, flash = hit ? 0.25 + 0.25 * Math.max(0, Math.sin((t - T.dinero) * 10)) * Math.exp(-(t - T.dinero) * 1.2) : 0;
    el("rect", { x: bx + 10, y: rowY - 34, width: bw - 20, height: 50, rx: 8, fill: "#EF5350", opacity: flash }, w);
    [["EURUSD", "#E6E8EB"], ["buy", "#4DA3FF"], ["1.00", "#E6E8EB"], [K.entryLate.toFixed(5), "#E6E8EB"], [K.slLate.toFixed(5), "#EF5350"], [(curP >= 0 ? "" : "−") + Math.abs(curP).toFixed(2), curP >= 0 ? "#26A69A" : "#EF5350"]].forEach(([s, c], i) =>
      el("text", { x: xs[i], y: rowY, "font-family": F2, "font-weight": i === 5 ? 800 : 600, "font-size": i === 5 ? 26 : 22, fill: c }, w, s));
  }
  const bal = BAL0 + (hit ? LOSS * E.out(P(t, T.dinero + 0.2, 0.8, E.lin)) : 0);
  el("text", { x: bx + 30, y: ty + 260, "font-family": F2, "font-weight": 600, "font-size": 24, fill: "#7C828C" }, w, "Balance:");
  el("text", { x: bx + 150, y: ty + 260, "font-family": F2, "font-weight": 800, "font-size": 30, fill: hit ? "#EF5350" : "#E6E8EB" }, w, bal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " USD");
  // aviso de stop loss
  if (hit) {
    const k = E.backBig(P(t, T.dinero + 0.25, 0.35, E.lin)), n = el("g", { transform: `translate(540,${by + 160}) scale(${k.toFixed(3)})` }, w);
    el("rect", { x: -380, y: -70, width: 760, height: 140, rx: 22, fill: "#2A2D33", stroke: "#EF5350", "stroke-width": 4, filter: "url(#sh)" }, n);
    el("text", { x: 0, y: -14, "text-anchor": "middle", "font-family": F2, "font-weight": 800, "font-size": 30, fill: "#EF5350" }, n, "STOP LOSS ACTIVADO");
    el("text", { x: 0, y: 34, "text-anchor": "middle", "font-family": F2, "font-weight": 700, "font-size": 26, fill: "#E6E8EB" }, n, `EURUSD buy 1.00  ·  −${Math.abs(LOSS).toFixed(2)} USD`);
  }
  if (t >= T.como - 0.1) q3d(w, 880, by + 300, 260, P(t, T.como - 0.1, 0.4, E.lin));
}

// ---------- cámara (tarjeta redondeada) ----------
function camLayout(t) {
  const big = P(t, T.quieres - 0.2, 0.8, E.inOut);
  return { x: 30, y: 36, w: 1020, h: lerp(600, 1040, big), r: 38 };
}
const SENT = [0, ...WD.filter((w, i) => i > 0 && /[.?!]$/.test(WD[i - 1][2]) && w[0] - WD[i - 1][1] < 3).map((w) => w[0] - 0.05)];
const PUNCH = [T.subio, T.perdiendo, T.como, T.escape, T.error, T.sacando, T.correcta, T.correctos, T.fibo, T.perseguir, T.zonasW];
function drawCam(t, L) {
  for (const r of [camRect, camShadow]) { r.setAttribute("x", L.x); r.setAttribute("y", L.y); r.setAttribute("width", L.w); r.setAttribute("height", L.h); }
  camFade.setAttribute("x", L.x); camFade.setAttribute("y", L.y + L.h * 0.55); camFade.setAttribute("width", L.w); camFade.setAttribute("height", L.h * 0.45);
  const lvl = SENT.reduce((a, s0, i) => (t >= s0 ? i : a), 0), lv = (i) => (i % 2 ? 1.18 : 1.03), kk = E.out(P(t, SENT[lvl] ?? 0, 0.18, E.lin));
  let sc = lerp(lv(Math.max(0, lvl - 1)), lv(lvl), lvl === 0 ? 1 : kk) + 0.025 * Math.sin(t * 0.35);
  sc += PUNCH.reduce((a, tw) => a + (t >= tw - 0.05 ? 0.08 * Math.exp(-(t - tw + 0.05) / 0.35) * clamp((t - tw + 0.05) / 0.08) : 0), 0);
  const shake = [T.error, T.sacando, T.correctos].reduce((a, ts) => a + (t >= ts && t < ts + 0.5 ? Math.sin((t - ts) * 70) * 8 * (1 - (t - ts) / 0.5) : 0), 0);
  // la imagen cubre la tarjeta (1080×700 → alto de la tarjeta) y se acerca a la cara
  const cover = Math.max(L.w / 1080, L.h / 700), cx = 600, cy = 360;
  const tx = L.x + L.w / 2 + shake + Math.sin(t * 0.21) * 18, ty = L.y + L.h * 0.5 + Math.sin(t * 0.17 + 1) * 10;
  camMov.setAttribute("transform", `translate(${tx.toFixed(1)},${ty.toFixed(1)}) scale(${(cover * sc).toFixed(4)}) translate(${-cx},${-cy})`);
}

// ---------- subtítulos sobre la tarjeta (1–2 palabras) ----------
const CH = [];
{ let cur = []; const flush = () => { if (cur.length) CH.push(cur); cur = []; };
  WD.forEach((w) => { const txt = w[2].replace(/[.,!¡]/g, ""); const chars = cur.reduce((a, o) => a + o.w.length + 1, 0) + txt.length;
    if (cur.length && (cur.length >= 2 || chars > 13 || w[0] - cur[cur.length - 1].t1 > 0.3)) flush(); cur.push({ w: txt, t0: w[0], t1: w[1] }); if (/[.,?!]$/.test(w[2])) flush(); });
  flush(); CH.forEach((c, i) => { const nx = CH[i + 1]; c.from = c[0].t0 - 0.05; c.to = nx && nx[0].t0 - c[c.length - 1].t1 < 0.6 ? nx[0].t0 - 0.05 : c[c.length - 1].t1 + 0.35; }); }
function drawCaption(t, L) {
  const c = CH.find((c) => t >= c.from && t < c.to); if (!c) return;
  const txt = c.filter((o) => t >= o.t0 - 0.05).map((o) => o.w).join(" "); if (!txt) return;
  const k = clamp((t - c.from) / 0.18), y = L.y + L.h - 52;
  const g = el("g", { transform: `translate(540,${y}) scale(${(0.85 + 0.15 * E.backBig(k)).toFixed(3)})`, opacity: clamp(k * 3).toFixed(3) }, capG);
  el("text", { x: 0, y: 0, "text-anchor": "middle", "font-family": F1, "font-weight": 800, "font-size": 70, fill: "#fff", filter: "url(#sht)" }, g, txt.charAt(0).toUpperCase() + txt.slice(1));
}

// ---------- explicación sobre la gráfica ----------
function drawLesson(t, v) {
  const RX = PR.x + PR.w;
  // estructura: Máx / Mín como en la referencia + zigzag dorado
  const zzOn = (t >= T.mira - 0.1 && t < T.retrocedio + 0.5) || (t >= T.primero && t < T.siVa);
  if (zzOn) {
    const fade = t >= T.primero ? 1 : 1 - P(t, T.retrocedio, 0.5);
    const pts = K.zz.filter((z) => z[0] <= v.upto), n = t >= T.primero ? Math.max(1, Math.ceil(pts.length * P(t, T.primero, 1.2, E.lin))) : pts.length, sel = pts.slice(0, n);
    if (sel.length > 1) el("polyline", { points: sel.map((z) => `${X(z[0])},${Y(z[1])}`).join(" "), fill: "none", stroke: CL.gold, "stroke-width": 4, "stroke-linejoin": "round", opacity: fade }, ovG);
    sel.forEach((z) => { const hi = z[2][0] === "H" || z[2] === "HH", y = Y(z[1]); hl(ovG, y, X(z[0]), X(z[0]) + 170, hi ? CL.up : CL.dn, fade, "", 3);
      pill(ovG, X(z[0]) + 200, y, hi ? "Máx" : "Mín", hi ? CL.up : CL.dn, fade, "start", 24); });
  }
  // compra tardía
  if (t >= T.comprar && t < T.poreso - 0.4) {
    const kb = P(t, T.comprar + 0.25, 0.35, E.lin), xE = X(K.H), yE = Y(K.entryLate);
    hl(ovG, yE, xE, RX, CL.ink, kb, "10 7", 3); pill(ovG, xE - 18, yE - 40, "Compra", CL.up, kb, "end", 24);
    el("circle", { cx: xE, cy: yE, r: 12, fill: t > T.error && t < T.pienso ? CL.dn : CL.up, stroke: "#fff", "stroke-width": 4 }, ovG);
    if (t >= T.esperaria && t < T.ahora) { const kz = P(t, T.esperaria, 0.8, E.inOut), yz = Y((K.zone[0] + K.zone[1]) / 2);
      el("path", { d: `M${xE + 10} ${yE + 16} Q${xE + 90} ${(yE + yz) / 2} ${xE + 40} ${lerp(yE + 16, yz - 12, kz)}`, stroke: CL.blue, "stroke-width": 5, fill: "none", "stroke-dasharray": "12 8" }, ovG); }
    if (t >= T.stop1 - 0.2) { const ks = P(t, T.stop1 - 0.2, 0.5, E.lin), yS = Y(K.slLate), xM = X(K.minor);
      hl(ovG, yS, xM, RX, CL.dn, ks, "10 7", 3); pill(ovG, RX, yS + 34, "Stop loss", CL.dn, ks, "end", 22);
      if (t >= T.minimo - 0.2) el("circle", { cx: xM, cy: Y(D[K.minor].l), r: 22 * E.backBig(P(t, T.minimo - 0.2, 0.35, E.lin)), fill: "none", stroke: CL.dn, "stroke-width": 4 }, ovG);
      if (v.upto >= K.slHit) { burst(ovG, X(K.slHit), yS, (t - T.sacando) * 0.8, 16, 90, 4); pill(ovG, X(K.slHit) + 20, yS + 80, "Stop ✗  −$", CL.dn, P(t, T.sacando, 0.4, E.lin), "start", 24); }
      if (t >= T.entrada1) xMark(ovG, xE + 30, yE - 30, P(t, T.entrada1, 0.3, E.lin));
      if (t >= T.stop3) xMark(ovG, xM + 40, yS, P(t, T.stop3, 0.3, E.lin)); }
    if (t >= T.idea && v.upto > K.touch) { const ka = P(t, T.idea, 0.8, E.inOut), e2 = Math.min(v.upto, K.tpHit + 10), x0 = X(K.touch), y0 = Y(D[K.touch].l) + 12, x1 = X(e2), y1 = Y(hiOf(K.touch, e2)) - 12;
      el("path", { d: `M${x0} ${y0} L${lerp(x0, x1, ka)} ${lerp(y0, y1, ka)}`, stroke: CL.up, "stroke-width": 10, "stroke-linecap": "round", opacity: 0.9 }, ovG);
      if (ka > 0.9) pill(ovG, x1 - 20, y1 + 56, "✓ Dirección", CL.up, P(t, T.correcta - 0.1, 0.35, E.lin), "end", 24); }
  }
  // zona de interés
  const zA = win(t, T.esperaria, T.poreso - 0.4, 0.4, 0.4), zB = t >= T.marco ? 1 : 0;
  if (zA > 0 || zB) { const x0 = X(K.base[0]) - 6, dr = zB ? P(t, T.marco, 0.9, E.inOut) : 1, y0 = Y(K.zone[1]), y1 = Y(K.zone[0]);
    const g = el("g", { opacity: zB ? 1 : zA }, ovG);
    el("rect", { x: x0, y: y0, width: (RX - x0) * dr, height: y1 - y0, fill: CL.blue, opacity: 0.16 + (t > T.coincide ? 0.08 * Math.sin(t * 5) : 0) }, g);
    el("rect", { x: x0, y: y0, width: (RX - x0) * dr, height: y1 - y0, fill: "none", stroke: CL.blue, "stroke-width": 3 }, g);
    if (dr > 0.9) el("text", { x: x0 + 14, y: y0 - 12, "font-family": F1, "font-weight": 800, "font-size": 26, fill: CL.blue }, g, zB ? "Zona de interés" : "Mi zona"); }
  // Fibonacci
  if (t >= T.trazo && t < T.siVa + 0.2) {
    const kl = P(t, T.trazo, 0.6, E.inOut), xa = X(K.L), ya = Y(D[K.L].l), xb = X(K.top), yb = Y(D[K.top].h), yOf = (l) => Y(D[K.top].h - l * (D[K.top].h - D[K.L].l));
    el("line", { x1: xa, y1: ya, x2: lerp(xa, xb, kl), y2: lerp(ya, yb, kl), stroke: CL.grey, "stroke-width": 2.5, "stroke-dasharray": "6 5" }, ovG);
    const kb = P(t, T.fibo + 0.1, 0.5, E.out);
    if (kb > 0) el("rect", { x: xa, y: yOf(0.705), width: (RX - xa) * kb, height: yOf(0.79) - yOf(0.705), fill: CL.gold, opacity: t >= T.coincide ? 0.4 + 0.15 * Math.sin(t * 6) : 0.32 }, ovG);
    [["0", 0], ["0.5", 0.5], ["0.618", 0.618], ["0.705", 0.705], ["0.79", 0.79], ["1", 1]].forEach(([s, l], i) => { const k = P(t, T.fibo - 0.2 + i * 0.08, 0.35, E.out); if (k <= 0) return; const gold = l > 0.6 && l < 0.8;
      hl(ovG, yOf(l), xa, RX, gold ? "#B8862B" : "#A3A8B0", k, gold ? "" : "5 5", gold ? 3 : 2);
      el("text", { x: xa - 8, y: yOf(l) + 7, "text-anchor": "end", "font-family": F2, "font-weight": 700, "font-size": 20, fill: gold ? "#B8862B" : CL.grey, opacity: k }, ovG, s); });
    if (t >= T.coincide) pill(ovG, (xa + RX) / 2 + 100, yOf(0.79) + 50, "✓ Coincide con la zona", CL.up, P(t, T.coincide, 0.35, E.lin), "middle", 24);
  }
  // posición correcta (TP azul / SL rojo, como en la referencia)
  if (t >= T.esperando && t < T.outro) {
    const kp = P(t, T.esperando, 0.6, E.out), x0 = X(K.H) + 8, w = (RX - x0) * kp, yE = Y(K.entry), yT = Y(K.tp), yS = Y(K.sl);
    el("rect", { x: x0, y: yT, width: w, height: yE - yT, fill: CL.tp, opacity: 0.6 }, ovG); el("rect", { x: x0, y: yE, width: w, height: yS - yE, fill: CL.sl, opacity: 0.6 }, ovG);
    pill(ovG, RX - 8, yT + 34, "TP", CL.blue, kp, "end", 22); pill(ovG, RX - 8, yS - 34, "SL", CL.dn, kp, "end", 22);
    pill(ovG, x0 + 10, yE, t >= T.siVa ? "Pendiente" : "Entrada", CL.ink, kp, "start", 22);
    if (t >= T.regrese && t < T.siVa && v.upto >= K.fill) vMark(ovG, X(K.fill), yE, P(t, T.regrese + 0.6, 0.3, E.lin), 18);
    if (t >= T.regrese && t < T.siVa && v.upto >= K.tpHit) { vMark(ovG, X(K.tpHit), yT, P(t, T.entrada2, 0.3, E.lin), 24); burst(ovG, X(K.tpHit), yT, t - T.entrada2, 18, 120, 6); }
  }
}
// elementos grandes que flotan sobre la gráfica (botones 3D, "?", ✗)
function drawFx(t) {
  const cy = 1180;
  // "voy a comprar": botones Compras / Ventas y la mano pulsa Compras
  const kb = win(t, T.piensas, T.comprar + 1.0, 0.3, 0.3);
  if (kb > 0) { const press = t > T.comprar - 0.1 && t < T.comprar + 0.25 ? 1 : 0, s = E.backBig(clamp(kb));
    btn3d(fxG, 540, cy - 70, 380, 110, "Compras", "G", press, s); btn3d(fxG, 540, cy + 80, 340, 96, "Ventas", "R", 0, s);
    hand(fxG, lerp(720, 600, P(t, T.piensas + 0.3, 0.6, E.inOut)), lerp(1300, cy - 60, P(t, T.piensas + 0.3, 0.6, E.inOut)), 1.1, press); }
  // "error"
  if (t >= T.error - 0.05 && t < T.error + 1.0) { const k = P(t, T.error - 0.05, 0.3, E.lin), sh = Math.sin(t * 60) * 10 * Math.max(0, 1 - (t - T.error) / 0.5);
    q3d(fxG, 540 + sh, cy + 90, 300, k, "!"); pill(fxG, 540 + sh, cy + 170, "Error", CL.dn, k, "middle", 44); }
  // pregunta A / B
  if (t >= T.compraria && t < T.c1) { const s1 = P(t, T.compraria, 0.35, E.lin), s2 = P(t, T.esperaria, 0.35, E.lin);
    if (s1 > 0) btn3d(fxG, 300, cy + 120, 420, 104, "A · Comprar aquí", "G", 0, E.backBig(clamp(s1)) * 0.9);
    if (s2 > 0) btn3d(fxG, 780, cy + 120, 440, 104, "B · Esperar zona", "B", 0, E.backBig(clamp(s2)) * 0.9); }
  if (t >= T.pienso - 0.1 && t < T.c1) q3d(fxG, 540, cy - 90, 280, P(t, T.pienso - 0.1, 0.4, E.lin));
  // cuenta atrás minimalista (anillo fino)
  if (t >= T.c0 - 0.2 && t < T.c1) { const e = Math.max(0, t - T.c0), n = Math.max(1, 3 - Math.floor(e)), k = 1 - (e % 1);
    const g = el("g", { transform: `translate(540,${cy - 300})` }, fxG); el("circle", { r: 92, fill: "#fff", opacity: 0.85, filter: "url(#sh)" }, g);
    el("circle", { r: 78, fill: "none", stroke: "#E2E4E8", "stroke-width": 6 }, g);
    el("circle", { r: 78, fill: "none", stroke: CL.ink, "stroke-width": 6, "stroke-dasharray": `${(2 * Math.PI * 78 * k).toFixed(1)} 999`, transform: "rotate(-90)", "stroke-linecap": "round" }, g);
    el("text", { y: 30, "text-anchor": "middle", "font-family": F1, "font-weight": 300, "font-size": 92, fill: CL.ink }, g, String(n));
    pill(fxG, 540, cy - 160, "Comenta A o B", CL.ink, P(t, T.c0, 0.4, E.lin), "middle", 30); }
  // stop / no eran correctos / perseguir
  if (t >= T.correctos && t < T.correctos + 1.0) q3d(fxG, 540, cy + 60, 300, P(t, T.correctos, 0.3, E.lin), "✗");
  if (t >= T.perseguir - 0.1 && t < T.perseguir + 1.3) { const k = P(t, T.perseguir - 0.1, 0.3, E.lin); q3d(fxG, 860, cy - 40, 240, k, "✗"); pill(fxG, 860, cy + 40, "No la persigo", CL.dn, k, "middle", 32); }
  // la entrada correcta: la mano pulsa "Comprar" cuando el precio llega a la zona
  if (t >= T.regrese - 0.2 && t < T.entrada2 + 0.8) { const k = win(t, T.regrese - 0.2, T.entrada2 + 0.8, 0.3, 0.3), press = t > T.regrese + 0.6 && t < T.regrese + 0.9 ? 1 : 0;
    btn3d(fxG, 820, cy + 260, 300, 96, "Comprar", "G", press, E.backBig(clamp(k)) * 0.95); hand(fxG, 860, cy + 250, 0.9, press); }
  // pasos
  const STEPS = [[T.primero - 0.2, "1 · Estructura"], [T.marco - 0.2, "2 · Zona de interés"], [T.trazo - 0.2, "3 · Fibonacci"], [T.esperando - 0.2, "4 · Espero mi entrada"]];
  if (t >= T.primero - 0.2 && t < T.quieres - 0.3) { const s = STEPS.filter((x) => t >= x[0]).pop(); pill(fxG, 540, 700, s[1], CL.ink, P(t, s[0], 0.4, E.lin), "middle", 34); }
  // rebobinado
  const rw = win(t, T.poreso - 0.4, T.poreso + 0.9, 0.15, 0.25);
  if (rw > 0) { const g = el("g", { opacity: rw }, fxG); el("rect", { x: PR.x - 20, y: PR.y - 20, width: PR.w + 40, height: PR.h + 40, rx: 20, fill: "#fff", opacity: 0.35 }, g); q3d(g, 540, cy + 60, 240, rw, "⏪"); }
  // comentario final (campo de texto como en la referencia)
  if (t >= T.comenta - 0.2) {
    const k = E.backBig(P(t, T.comenta - 0.2, 0.45, E.lin)), typed = "ZONAS".slice(0, Math.max(0, Math.floor((t - T.zonasW + 0.1) / 0.09)));
    const g = el("g", { transform: `translate(540,1520) scale(${k.toFixed(3)})` }, fxG);
    el("rect", { x: -400, y: -60, width: 800, height: 120, rx: 60, fill: "#fff", filter: "url(#sh)" }, g);
    el("circle", { cx: -330, cy: 0, r: 38, fill: "#C9CDD4" }, g); el("circle", { cx: -330, cy: -10, r: 14, fill: "#fff" }, g); el("path", { d: "M-356 26 C-350 6 -310 6 -304 26 Z", fill: "#fff" }, g);
    el("text", { x: -270, y: 18, "font-family": F1, "font-weight": 800, "font-size": 48, fill: typed ? CL.ink : "#A3A8B0" }, g, typed || "Añade un comentario…");
    if (typed && Math.floor(t * 2.5) % 2 === 0 && typed.length < 5) el("rect", { x: -270 + typed.length * 34, y: -24, width: 4, height: 48, fill: CL.blue }, g);
    el("circle", { cx: 340, cy: 0, r: 40, fill: typed.length === 5 ? CL.blue : "#C9D6F2" }, g); el("path", { d: "M322 0 H354 M342 -12 L356 0 L342 12", stroke: "#fff", "stroke-width": 6, fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" }, g);
    if (t >= T.sigueme) pill(fxG, 540, 1700, "+ Seguir a Leo", CL.blue, P(t, T.sigueme, 0.4, E.lin), "middle", 36);
  }
}

// ---------- cierre con el logo LFX ----------
function drawOutro(tt) {
  if (tt < 0) return;
  const a = clamp(tt / 0.35), up = (d) => { const k = E.out(clamp((tt - d) / 0.6)); return { transform: `translate(0,${((1 - k) * 90).toFixed(1)})`, opacity: k.toFixed(3) }; };
  el("rect", { width: W, height: H, fill: "#0A0B0E", opacity: a }, outG);
  for (let r = 0; r < 9; r++) for (let c = 0; c < 3; c++) el("text", { x: 180 + c * 360 + (r % 2) * 180, y: 160 + r * 220, "text-anchor": "middle", "font-family": F1, "font-weight": 900, "font-size": 40, fill: "#fff", opacity: 0.05 * a }, outG, "LEONARDO LFX");
  el("image", { href: "logo-lfx.png", x: 197, y: 694, width: 686, height: 251 }, el("g", up(0.1), outG));
  el("text", { x: 540, y: 1110, "text-anchor": "middle", "font-family": F1, "font-weight": 900, "font-size": 58, fill: "#fff" }, el("g", up(0.45), outG), "COMENTA «ZONAS»");
  el("text", { x: 540, y: 1180, "text-anchor": "middle", "font-family": F2, "font-weight": 700, "font-size": 38, fill: CL.blue }, el("g", up(0.7), outG), "Te mando la información gratis");
}

// ---------- fotograma ----------
window.renderAt = function (t) {
  for (const g of [chartG, ovG, fxG, mtG, capG, topG, outG]) g.textContent = "";
  const L = camLayout(t);
  // la gráfica sube un poco cuando la cámara crece al final
  const big = P(t, T.quieres - 0.2, 0.8, E.inOut); PR = { x: 70, y: lerp(800, 1150, big), w: 860, h: lerp(960, 560, big) };
  const chartA = P(t, T.chart, 0.6, E.inOut);
  const v = viewAt(t);
  if (chartA > 0) {
    const g = el("g", { opacity: chartA.toFixed(3), transform: `translate(0,${((1 - chartA) * 60).toFixed(1)})` }, chartG);
    drawCandles(g, v, D, CL.up, CL.dn, t >= T.siVa ? { from: K.H, arr: K.ghost, n: Math.floor(lerp(0, K.ghost.length, P(t, T.siVa + 0.3, 1.6, E.lin))) } : null);
    ovG.setAttribute("opacity", chartA.toFixed(3)); drawLesson(t, v);
  }
  drawMT5(t, 1 - P(t, T.chart - 0.1, 0.5, E.inOut));
  if (t >= T.chart - 0.4) drawFx(t);
  drawCam(t, L); drawCaption(t, L);
  // barra de progreso
  el("rect", { x: 0, y: 0, width: W * (t / T.total), height: 8, fill: CL.blue }, topG);
  drawOutro(t - T.outro);
  camG.setAttribute("opacity", (1 - clamp((t - T.outro) / 0.35)).toFixed(3));
  const href = `cam/f_${String(CAMMAP[Math.min(CAMMAP.length - 1, Math.round(t * 30))]).padStart(5, "0")}.jpg`;
  if (href !== camHref) { camHref = href; const pr = new Promise((r) => { camImg.onload = r; camImg.onerror = r; }); camImg.setAttribute("href", href); return pr; }
};
window.READY = true;
