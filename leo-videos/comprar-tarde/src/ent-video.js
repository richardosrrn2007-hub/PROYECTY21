// Reel "Comprar tarde" (voz real de Leo): renderAt(t) dibuja el fotograma del segundo t.
// Usa poi3–poi8 (estudio, gráfica estilo TradingView, capa viral) con datos reales EURUSD 4h (ent-data.js).
const WD = TL.words;
const norm = (s) => s.toLowerCase().replace(/[¿?¡!.,"«»]/g, "");
function wt(rx, nth = 0) { let c = 0; for (const w of WD) if (new RegExp(rx, "i").test(norm(w[2]))) { if (c === nth) return w[0]; c++; } throw new Error("palabra " + rx); }
const K = ENT, D = POIDATA.TF.H4, ND = D.length;
const T = {
  subio: wt("^subió$"), perdiendo: wt("^perdiendo$"), como: wt("^cómo$"), mostrarte: wt("^mostrarte$"), mira: wt("^mira$"), maximos: wt("^máximos$"), minimos: wt("^mínimos$"), altos: wt("^altos$"),
  piensas: wt("^piensas$"), comprar: wt("^comprar$"), escape: wt("^escape$"), justo2: wt("^justo$", 1), error: wt("^error$"), compraria: wt("^compraría$"), esperaria: wt("^esperaría$"),
  zona1: wt("^zona$"), pienso: wt("^piénsalo$"), c0: TL.count[0], c1: TL.count[1], ahora: wt("^ahora$"), compraste: wt("^compraste$"), stop1: wt("^stop$"), minimo: wt("^mínimo$"),
  retrocedio: wt("^retrocedió$"), sacando: wt("^sacando$"), subio2: wt("^subió$", 1), idea: wt("^idea$"), correcta: wt("^correcta$"), entrada1: wt("^entrada$"), stop3: wt("^stop$", 2),
  correctos: wt("^correctos$"), poreso: wt("^eso$"), primero: wt("^primero$"), estructura2: wt("^estructura$", 1), marco: wt("^marco$"), zona2: wt("^zona$", 1), dentro: wt("^dentro$"),
  trazo: wt("^trazo$"), fibo: wt("^fibonacci$"), coincide: wt("^coincide$"), esperando: wt("^esperando$"), regrese: wt("^regrese$"), entrada2: wt("^entrada$", 1), si3: wt("^tocar$"),
  perseguir: wt("^perseguir$"), porque2: wt("^porque$", 1), clara: wt("^clara$"), buena: wt("^buena$"), quieres: wt("^quieres$"), zonasQ: wt("^zonas$"), sigueme: wt("^sígueme$"),
  comenta: wt("^comenta$"), zonasW: wt("^zonas$", 1), gratuita: wt("^gratuita$"), outro: TL.outro, total: TL.total,
};
T.siVa = T.si3 - 1.3;

// ---------- Subtítulos ----------
const BLUE = new Set(["subió", "gráfico", "problema", "estructura", "máximos", "mínimos", "altos", "subiendo", "comprar", "escape", "punto", "zona", "segundos", "retrocedió", "dirección", "correcta", "interés", "reacción", "fibonacci", "coincide", "regrese", "clara", "zonas", "sígueme", "comenta", "gratuita", "tres"]);
const REDW = new Set(["perdiendo", "dinero", "error", "stop", "loss", "mínimo", "correctos", "perseguir", "sacando"]);
const ICON = { precio: "candle", subió: "up", dinero: "money", gráfico: "chart", estructura: "chart", máximos: "up", mínimos: "up", comprar: "cart", zona: "target", segundos: "clock", stop: "stop", dirección: "compass", fibonacci: "spiral", interés: "target", información: "info", gratuita: "gift", error: "warning", correcta: "check", retrocedió: "down", entrada: "target", sígueme: "user" };
const CHUNKS = [];
{
  let cur = [];
  const flush = () => { if (cur.length) CHUNKS.push(cur); cur = []; };
  WD.forEach((w) => {
    const txt = w[2].replace(/[.,!¡]/g, "").toUpperCase();
    const chars = cur.reduce((a, o) => a + o.w.length + 1, 0) + txt.length;
    if (cur.length && (cur.length >= 3 || chars > 15 || w[0] - cur[cur.length - 1].t1 > 0.35)) flush();
    const n = norm(w[2]);
    cur.push({ w: txt, t0: w[0], t1: w[1], blue: BLUE.has(n) || REDW.has(n), red: REDW.has(n), icon: ICON[n] });
    if (/[.,?!]$/.test(w[2])) flush();
  });
  flush();
  CHUNKS.forEach((c, i) => { const nx = CHUNKS[i + 1]; c.from = c[0].t0 - 0.06; c.to = nx && nx[0].t0 - c[c.length - 1].t1 < 0.7 ? nx[0].t0 - 0.06 : c[c.length - 1].t1 + 0.45; });
}
function captionAt(t) {
  if (t >= T.c0 - 0.3 && t < T.c1) return { kin: [{ w: "¿A" }, { w: "o" }, { w: "B?", blue: true, icon: "clock" }], kinActive: 2, kinPop: P(t, T.c0 - 0.3, 0.5, E.lin), kinX: 400, kinY: 1690, kinSize: 80 };
  const c = CHUNKS.find((c) => t >= c.from && t < c.to);
  if (!c) return {};
  let a = 0; c.forEach((o, i) => { if (t >= o.t0 - 0.06) a = i; });
  return { kin: c, kinActive: a, kinPop: clamp((t - c[a].t0 + 0.06) / 0.28) };
}

// ---------- Iconos nuevos para las palabras ----------
const _icon4 = icon4;
icon4 = function (parent, name, x, y, s = 1) {
  const known = ["clock", "candle", "group", "history", "target", "heart", "eye"];
  if (known.includes(name)) return _icon4(parent, name, x, y, s);
  const g = el("g", { transform: `translate(${x},${y}) scale(${s})` }, parent);
  const bg = { stop: RED, warning: "#fff", money: "#fff", check: GREEN, down: "#fff" }[name] ?? "#fff";
  el("circle", { r: 34, fill: bg }, g);
  const st = { stroke: BLUE2, "stroke-width": 5, fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" };
  if (name === "up") el("path", { d: "M-16 12 L-4 0 L4 8 L18 -8 M8 -8 H18 V2", ...st, stroke: GREEN }, g);
  if (name === "down") el("path", { d: "M-16 -10 L-4 2 L4 -6 L18 10 M8 10 H18 V0", ...st, stroke: RED }, g);
  if (name === "money") { el("circle", { r: 20, fill: YEL, stroke: "#B5803A", "stroke-width": 4 }, g); el("text", { y: 10, "text-anchor": "middle", "font-family": FONTP, "font-weight": 900, "font-size": 28, fill: "#7A5418" }, g, "$"); }
  if (name === "chart") { el("path", { d: "M-18 16 H18 M-18 16 V-18", ...st, stroke: "#8A8F98" }, g); el("path", { d: "M-12 8 L-3 -2 L4 4 L14 -12", ...st }, g); }
  if (name === "cart") { el("path", { d: "M-20 -12 H-12 L-6 8 H14 L18 -6 H-10", ...st }, g); el("circle", { cx: -4, cy: 15, r: 3.5, fill: BLUE2 }, g); el("circle", { cx: 12, cy: 15, r: 3.5, fill: BLUE2 }, g); }
  if (name === "stop") { el("path", { d: "M-9 -22 H9 L22 -9 V9 L9 22 H-9 L-22 9 V-9 Z", fill: "#fff" }, g); el("path", { d: "M-7 -17 H7 L17 -7 V7 L7 17 H-7 L-17 7 V-7 Z", fill: RED }, g); }
  if (name === "compass") { el("circle", { r: 20, ...st }, g); el("path", { d: "M0 -14 L6 0 L0 14 L-6 0 Z", fill: RED }, g); el("path", { d: "M0 -14 L6 0 L-6 0 Z", fill: BLUE2 }, g); }
  if (name === "spiral") el("path", { d: "M0 0 C4 -4 8 0 4 6 C-2 12 -12 6 -10 -4 C-8 -16 10 -18 16 -6 C22 8 10 22 -6 20", ...st, stroke: "#C98A00" }, g);
  if (name === "info") { el("circle", { r: 20, fill: BLUE2 }, g); el("text", { y: 11, "text-anchor": "middle", "font-family": "Georgia", "font-weight": 900, "font-size": 30, fill: "#fff" }, g, "i"); }
  if (name === "gift") { el("rect", { x: -18, y: -6, width: 36, height: 24, rx: 3, fill: BLUE2 }, g); el("rect", { x: -20, y: -14, width: 40, height: 10, rx: 3, fill: "#5B8CFF" }, g); el("path", { d: "M0 -14 V18", stroke: YEL, "stroke-width": 6 }, g); el("path", { d: "M0 -14 C-10 -26 -18 -14 0 -14 C18 -14 10 -26 0 -14", stroke: YEL, "stroke-width": 4, fill: "none" }, g); }
  if (name === "warning") { el("path", { d: "M0 -22 L22 18 H-22 Z", fill: YEL, stroke: "#15171C", "stroke-width": 3, "stroke-linejoin": "round" }, g); el("path", { d: "M0 -8 V6", stroke: "#15171C", "stroke-width": 5, "stroke-linecap": "round" }, g); el("circle", { cy: 12, r: 3, fill: "#15171C" }, g); }
  if (name === "check") el("path", { d: "M-14 0 L-4 10 L16 -12", stroke: "#fff", "stroke-width": 7, fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" }, g);
  if (name === "user") { el("circle", { cy: -8, r: 9, fill: BLUE2 }, g); el("path", { d: "M-16 18 C-14 2 14 2 16 18 Z", fill: BLUE2 }, g); el("path", { d: "M16 -16 V-4 M10 -10 H22", stroke: GREEN, "stroke-width": 5, "stroke-linecap": "round" }, g); }
  return g;
};

// ---------- Animaciones detrás de las palabras clave ----------
ART["SUBIÓ"] = (g, tt) => {
  const k = E.out(clamp(tt / 0.5));
  el("path", { d: `M-380 120 L-200 40 L-80 80 L120 -60 L${lerp(120, 360, k)} ${lerp(-60, -160, k)}`, stroke: GREEN, "stroke-width": 16, fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-dasharray": `${(1200 * k).toFixed(0)} 3000` }, g);
  if (k > 0.95) el("path", { d: "M300 -168 L360 -160 L345 -102", stroke: GREEN, "stroke-width": 16, fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" }, g);
};
ART["PERDIENDO"] = (g, tt) => {
  for (let i = 0; i < 7; i++) {
    const k = clamp((tt - i * 0.06) / 0.9); if (k <= 0) continue;
    const q = el("g", { transform: `translate(${-260 + i * 90 + Math.sin(k * 7 + i) * 30},${-60 + k * 260}) rotate(${(i % 2 ? 1 : -1) * k * 70})`, opacity: (1 - k * 0.8).toFixed(3) }, g);
    el("rect", { x: -44, y: -24, width: 88, height: 48, rx: 6, fill: "#9BD39B", stroke: "#3E8E5E", "stroke-width": 4 }, q);
    el("text", { y: 12, "text-anchor": "middle", "font-family": FONTP, "font-weight": 900, "font-size": 32, fill: "#2F6B45" }, q, "$");
  }
  el("path", { d: "M330 -150 V120 M290 80 L330 125 L370 80", stroke: RED, "stroke-width": 16, fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-dasharray": `${(330 * E.out(clamp(tt / 0.4))).toFixed(0)} 800` }, g);
};
ART["¿CÓMO"] = (g, tt) => {
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + tt * 2.4, k = E.backBig(clamp((tt - i * 0.05) / 0.3));
    el("text", { x: Math.cos(a) * 340, y: Math.sin(a) * 150 + 30, "text-anchor": "middle", "font-family": FONTP, "font-weight": 900, "font-size": 90 * k, fill: i % 2 ? YEL : "#fff", opacity: 0.9, transform: `rotate(${Math.sin(tt * 5 + i) * 15},${Math.cos(a) * 340},${Math.sin(a) * 150})` }, g, "?");
  }
};
ART["ESCAPE"] = (g, tt) => {
  const k = E.in(clamp(tt / 0.9)), x = lerp(-300, 520, k), y = lerp(120, -260, k);
  for (let i = 0; i < 8; i++) el("circle", { cx: x - 60 - i * 26, cy: y + 34 + i * 16, r: 16 - i * 1.5, fill: i % 2 ? YEL : "#FF9A3C", opacity: 0.8 - i * 0.08 }, g);
  const r = el("g", { transform: `translate(${x},${y}) rotate(-28)` }, g);
  el("path", { d: "M-50 -22 H30 C60 -22 80 0 80 0 C80 0 60 22 30 22 H-50 Z", fill: "#fff", stroke: "#15171C", "stroke-width": 4 }, r);
  el("circle", { cx: 20, r: 11, fill: BLUE2, stroke: "#15171C", "stroke-width": 3 }, r);
  el("path", { d: "M-50 -22 L-74 -44 L-34 -22 Z M-50 22 L-74 44 L-34 22 Z", fill: RED }, r);
  el("text", { x: -150, y: 150, "font-family": FONTP, "font-weight": 900, "font-size": 40, fill: GREEN, opacity: clamp(tt * 3) }, g, "+ + +");
};
ART["ERROR"] = (g, tt) => {
  const sh = Math.sin(tt * 60) * 8 * Math.max(0, 1 - tt / 0.6);
  for (const x of [-360, 360]) {
    const q = el("g", { transform: `translate(${x + sh},0) scale(${E.backBig(clamp(tt / 0.25)).toFixed(3)})` }, g);
    el("path", { d: "M0 -110 L105 80 H-105 Z", fill: YEL, stroke: "#15171C", "stroke-width": 8, "stroke-linejoin": "round" }, q);
    el("path", { d: "M0 -50 V20", stroke: "#15171C", "stroke-width": 16, "stroke-linecap": "round" }, q); el("circle", { cy: 52, r: 10, fill: "#15171C" }, q);
  }
  el("rect", { x: -560, y: -170, width: 1120, height: 340, fill: RED, opacity: (0.18 * Math.max(0, Math.sin(tt * 14))).toFixed(3) }, g);
};
ART["PIÉNSALO"] = (g, tt) => {
  const k = E.backBig(clamp(tt / 0.3));
  el("ellipse", { cx: 0, cy: -10, rx: 470 * k, ry: 150 * k, fill: "#fff", opacity: 0.12 }, g);
  for (const [x, y, r] of [[-430, 120, 22], [-470, 160, 13]]) el("circle", { cx: x, cy: y, r: r * k, fill: "#fff", opacity: 0.5 }, g);
  for (let i = 0; i < 3; i++) el("circle", { cx: 300 + i * 50, cy: -150, r: 14 * clamp((tt * 3 - i * 0.4) % 1.6), fill: YEL }, g);
};
ART["STOP"] = (g, tt) => {
  const k = E.backBig(clamp(tt / 0.25)), q = el("g", { transform: `translate(-330,0) rotate(${Math.sin(tt * 30) * 6 * Math.max(0, 1 - tt)}) scale(${k.toFixed(3)})` }, g);
  el("path", { d: "M-50 -120 H50 L120 -50 V50 L50 120 H-50 L-120 50 V-50 Z", fill: "#fff" }, q);
  el("path", { d: "M-44 -106 H44 L106 -44 V44 L44 106 H-44 L-106 44 V-44 Z", fill: RED }, q);
  el("text", { y: 22, "text-anchor": "middle", "font-family": FONTP, "font-weight": 900, "font-size": 62, fill: "#fff" }, q, "STOP");
  burst(g, -330, 0, tt - 0.05, 16, 260, 3);
};
ART["CORRECTA"] = (g, tt) => {
  const k = E.out(clamp(tt / 0.4));
  el("circle", { cx: 360, cy: 0, r: 120 * E.backBig(clamp(tt / 0.25)), fill: GREEN }, g);
  el("path", { d: "M300 0 L345 45 L425 -45", stroke: "#fff", "stroke-width": 26, fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-dasharray": `${(220 * k).toFixed(0)} 400` }, g);
};
ART["CORRECTOS"] = (g, tt, dur, top, w) => {
  const kx = E.out(clamp((tt - 0.25) / 0.25));
  if (kx > 0) for (const [a, b] of [[[-w / 2 - 40, -90], [w / 2 + 40, 90]], [[w / 2 + 40, -90], [-w / 2 - 40, 90]]])
    el("line", { x1: a[0], y1: a[1], x2: lerp(a[0], b[0], kx), y2: lerp(a[1], b[1], kx), stroke: RED, "stroke-width": 24, "stroke-linecap": "round", opacity: 0.9 }, top);
  el("text", { x: 0, y: -120, "text-anchor": "middle", "font-family": FONTP, "font-weight": 900, "font-size": 56, fill: RED, opacity: clamp(tt * 4) }, g, "NO ERAN");
};
ART["FIBONACCI"] = (g, tt) => {
  const k = E.out(clamp(tt / 0.8));
  let d = "M0 0", r = 4, a = 0;
  for (let i = 0; i < 120 * k; i++) { a += 0.12; r *= 1.028; d += ` L${(Math.cos(a) * r).toFixed(1)} ${(Math.sin(a) * r * 0.75).toFixed(1)}`; }
  el("path", { d, stroke: "#E9B53C", "stroke-width": 10, fill: "none", "stroke-linecap": "round", transform: `translate(300,0) rotate(${tt * 40})` }, g);
  [0, 0.382, 0.618, 0.786, 1].forEach((lv, i) => el("line", { x1: -480, x2: -480 + 360 * clamp((tt - i * 0.06) / 0.3), y1: -120 + lv * 240, y2: -120 + lv * 240, stroke: lv > 0.6 && lv < 0.8 ? YEL : "#8A8F98", "stroke-width": 6 }, g));
};
ART["PERSEGUIR"] = (g, tt) => {
  const run = Math.sin(tt * 22) * 26, x = lerp(-620, -455, E.out(clamp(tt / 0.6)));
  const p = el("g", { transform: `translate(${x},20) scale(0.85)` }, g);
  el("circle", { cy: -86, r: 24, fill: "#F5C9A8" }, p);
  el("path", { d: `M0 -60 L4 10 M4 10 L${-30 + run} 70 M4 10 L${30 - run} 70 M0 -40 L${-36 - run} -10 M0 -40 L${40 + run} -30`, stroke: "#fff", "stroke-width": 14, "stroke-linecap": "round", fill: "none" }, p);
  el("path", { d: "M80 40 L220 -60 L300 -10 L440 -150 M380 -150 H440 V-90", stroke: GREEN, "stroke-width": 14, fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" }, g);
  const kx = E.out(clamp((tt - 0.45) / 0.25));
  if (kx > 0) el("circle", { cx: x, cy: -20, r: 105, fill: "none", stroke: RED, "stroke-width": 16, "stroke-dasharray": `${(760 * kx).toFixed(0)} 900` }, g);
  if (kx > 0.9) el("line", { x1: x - 74, y1: 55, x2: x + 74, y2: -95, stroke: RED, "stroke-width": 16, "stroke-linecap": "round" }, g);
};
ART["ZONAS"] = ART["CANDIDATA"];
ART["GRATUITA"] = (g, tt) => {
  const k = E.backBig(clamp(tt / 0.3)), lid = E.out(clamp((tt - 0.3) / 0.3));
  const q = el("g", { transform: `translate(360,10) scale(${k.toFixed(3)})` }, g);
  el("rect", { x: -90, y: -40, width: 180, height: 130, rx: 10, fill: BLUE2 }, q);
  el("rect", { x: -100, y: -70 - lid * 60, width: 200, height: 40, rx: 10, fill: "#5B8CFF", transform: `rotate(${-lid * 18},-100,-50)` }, q);
  el("rect", { x: -14, y: -40, width: 28, height: 130, fill: YEL }, q);
  burst(g, 360, -60, tt - 0.3, 18, 240, 9);
};

// ---------- Vistas de la gráfica ----------
const hiOf = (a, b) => Math.max(...D.slice(a, b + 1).map((c) => c.h)), loOf = (a, b) => Math.min(...D.slice(a, b + 1).map((c) => c.l));
const gTop = Math.max(...K.ghost.map((g) => g[2]));
const V = {
  A: { tf: "H4", i0: 0, i1: K.H + 24, pmin: K.sl - 0.0025, pmax: hiOf(0, K.H) + 0.0035 },
  G: { tf: "H4", i0: 0, i1: K.H + 24, pmin: K.sl - 0.0025, pmax: gTop + 0.003 },
  B: { tf: "H4", i0: 14, i1: ND + 3, pmin: K.sl - 0.0025, pmax: hiOf(0, ND - 1) + 0.003 },
};
const mixV = (a, b, k) => ({ tf: "H4", i0: lerp(a.i0, b.i0, k), i1: lerp(a.i1, b.i1, k), pmin: lerp(a.pmin, b.pmin, k), pmax: lerp(a.pmax, b.pmax, k) });
const kfi = (t, keys) => kf(t, keys, E.lin);
const REV1 = [[T.mira - 0.1, 28], [T.maximos, K.zz[1][0]], [T.minimos, K.zz[2][0]], [T.altos - 0.3, K.zz[3][0]], [T.altos + 0.3, K.H]];
const REV2 = [[T.retrocedio - 0.3, K.H], [T.sacando, K.slHit], [T.subio2 - 0.3, K.touch], [T.subio2 + 1.0, Math.min(ND - 1, K.tpHit + 12)]];
const REV3 = [[T.regrese, K.H], [T.entrada2 + 0.2, K.tpHit + 3]];
function uptoAt(t) {
  if (t < T.mira - 0.1) return 28;
  if (t < T.retrocedio - 0.3) return kfi(t, REV1);
  if (t < T.poreso - 0.4) return kfi(t, REV2);
  if (t < T.poreso + 0.8) return lerp(kfi(T.poreso - 0.41, REV2), K.H, E.inOut(P(t, T.poreso - 0.4, 1.2, E.lin)));  // rebobinado
  if (t < T.regrese) return K.H;
  if (t < T.siVa) return kfi(t, REV3);
  return K.H;
}
function viewAt(t) {
  let v;
  if (t < T.retrocedio) v = V.A;
  else if (t < T.poreso - 0.4) v = mixV(V.A, V.B, P(t, T.subio2 - 0.6, 1.0, E.inOut));
  else if (t < T.regrese) v = mixV(V.B, V.A, P(t, T.poreso - 0.4, 1.2, E.inOut));
  else if (t < T.siVa) v = mixV(V.A, V.B, P(t, T.regrese + 0.4, 1.2, E.inOut) * 0.6);
  else v = mixV(mixV(V.A, V.B, 0.6), V.G, P(t, T.siVa, 0.6, E.inOut));
  v = { ...v };
  const u = uptoAt(t); v.upto = Math.floor(u); v.uptoK = u - Math.floor(u);
  // zona de interés: aparece como opción B y se marca en el paso 2
  const zA = win(t, T.esperaria, T.poreso - 0.4, 0.4, 0.4), zB = t >= T.marco ? 1 : 0;
  if (zA > 0 || zB) v.zones = { C: { from: K.base[0], op: zB ? 1 : zA * 0.9, draw: zB ? P(t, T.marco, 0.9, E.inOut) : 1, strong: zB ? 0.6 + 0.4 * Math.sin(t * 4) * (t > T.coincide ? 1 : 0) : 0.4, label: zB ? "ZONA DE INTERÉS" : "B", labCol: "#1B2A6B" } };
  if (t >= T.siVa) v.ghost = { from: K.H, arr: K.ghost, n: Math.floor(lerp(0, K.ghost.length, P(t, T.siVa + 0.3, 1.6, E.lin))), op: 0.6 };
  return v;
}

// ---------- Dibujos sobre la gráfica (en coordenadas de la pantalla) ----------
const ovG = el("g", { "clip-path": "url(#scrClip)" }, scr);
function O() { const m = window.LASTMAP; return { X: (i) => m.toX(i + 0.5), Y: (p) => m.toY(p) }; }
const R5 = (p) => p.toFixed(5);
function tag(x, y, txt, col, k = 1, anchor = "end", size = 17) {
  if (k <= 0) return;
  const g = el("g", { transform: `translate(${x},${y}) scale(${E.backBig(clamp(k)).toFixed(3)})` }, ovG);
  const m = el("text", { "font-family": FONTP, "font-weight": 900, "font-size": size }, g, txt); const w = m.getComputedTextLength() + 20; m.remove();
  const x0 = anchor === "end" ? -w : anchor === "middle" ? -w / 2 : 0;
  el("rect", { x: x0, y: -size * 0.85, width: w, height: size * 1.7, rx: 6, fill: col }, g);
  el("text", { x: x0 + w / 2, y: size * 0.35, "text-anchor": "middle", "font-family": FONTP, "font-weight": 900, "font-size": size, fill: "#fff" }, g, txt);
}
function hline(y, x0, x1, col, dash = "8 6", wdt = 2.5, k = 1) { el("line", { x1: x0, x2: lerp(x0, x1, clamp(k)), y1: y, y2: y, stroke: col, "stroke-width": wdt, "stroke-dasharray": dash }, ovG); }
function xMark(x, y, k, r = 16) {
  if (k <= 0) return; const s = E.backBig(clamp(k)) * r;
  el("circle", { cx: x, cy: y, r: s * 1.3, fill: RED }, ovG);
  el("path", { d: `M${x - s * 0.6} ${y - s * 0.6} L${x + s * 0.6} ${y + s * 0.6} M${x + s * 0.6} ${y - s * 0.6} L${x - s * 0.6} ${y + s * 0.6}`, stroke: "#fff", "stroke-width": 5, "stroke-linecap": "round" }, ovG);
}
function vMark(x, y, k, r = 16) {
  if (k <= 0) return; const s = E.backBig(clamp(k)) * r;
  el("circle", { cx: x, cy: y, r: s * 1.3, fill: GREEN }, ovG);
  el("path", { d: `M${x - s * 0.6} ${y} L${x - s * 0.1} ${y + s * 0.5} L${x + s * 0.7} ${y - s * 0.55}`, stroke: "#fff", "stroke-width": 5, fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" }, ovG);
}
function drawOverlay(t, v) {
  ovG.textContent = "";
  const { X, Y } = O(), RX = PLOT.x + PLOT.w;
  // 1) estructura: zigzag con HH / HL
  const zzOn = (t >= T.mira - 0.1 && t < T.retrocedio + 0.5) || (t >= T.primero && t < T.siVa);
  if (zzOn) {
    const fade = t >= T.primero ? 1 : 1 - P(t, T.retrocedio, 0.5);
    const kDraw = t >= T.primero ? P(t, T.primero, 1.2, E.lin) : 1;
    const pts = K.zz.filter((z) => z[0] <= v.upto);
    const nShow = t >= T.primero ? Math.max(1, Math.ceil(pts.length * kDraw)) : pts.length;
    const sel = pts.slice(0, nShow);
    if (sel.length > 1) el("polyline", { points: sel.map((z) => `${X(z[0])},${Y(z[1])}`).join(" "), fill: "none", stroke: BLUE2, "stroke-width": 3.5, "stroke-linejoin": "round", opacity: fade }, ovG);
    sel.forEach((z) => { if (z[2] === "HH" || z[2] === "HL") tag(X(z[0]), Y(z[1]) + (z[2] === "HH" ? -24 : 26), z[2], BLUE2, fade, "middle", 18); });
  }
  // 2) compra tardía: entrada + stop bajo el mínimo pequeño
  const lateOn = t >= T.comprar && t < T.poreso - 0.4;
  if (lateOn) {
    const kb = P(t, T.comprar, 0.35, E.lin), xE = X(K.H), yE = Y(K.entryLate);
    hline(yE, xE, RX, "#15171C", "8 6", 2.5, kb);
    tag(xE - 12, yE, "COMPRA", "#089981", kb);
    const pulse = t > T.error && t < T.pienso ? 1 + 0.25 * Math.abs(Math.sin((t - T.error) * 8)) : 1;
    el("circle", { cx: xE, cy: yE, r: 11 * pulse, fill: t > T.error && t < T.pienso ? RED : "#089981", stroke: "#fff", "stroke-width": 3 }, ovG);
    // pregunta A / B
    if (t >= T.compraria && t < T.ahora) { tag(xE - 24, yE - 36, "A · COMPRO AQUÍ", "#15171C", P(t, T.compraria, 0.35, E.lin), "end", 18); }
    if (t >= T.esperaria && t < T.ahora) {
      const kz = P(t, T.esperaria, 0.8, E.inOut), yz = Y((K.zone[0] + K.zone[1]) / 2);
      el("path", { d: `M${xE} ${yE + 14} Q${xE + 60} ${(yE + yz) / 2} ${xE + 30} ${lerp(yE + 14, yz - 10, kz)}`, stroke: BLUE2, "stroke-width": 4, fill: "none", "stroke-dasharray": "10 7" }, ovG);
      tag(xE - 10, yz - 40, "B · ESPERO MI ZONA", BLUE2, P(t, T.zona1 - 0.2, 0.35, E.lin), "end", 18);
    }
    if (t >= T.stop1 - 0.2) {
      const ks = P(t, T.stop1 - 0.2, 0.5, E.lin), yS = Y(K.slLate), xM = X(K.minor);
      hline(yS, xM, RX, RED, "8 6", 2.5, ks); tag(RX - 6, yS - 18, "STOP LOSS", RED, ks, "end", 16);
      if (t >= T.minimo - 0.2) el("circle", { cx: xM, cy: Y(D[K.minor].l), r: 18 * E.backBig(P(t, T.minimo - 0.2, 0.35, E.lin)), fill: "none", stroke: RED, "stroke-width": 3.5 }, ovG);
      // el stop salta
      if (v.upto >= K.slHit) {
        const kh = P(t, T.sacando, 0.6, E.lin), xh = X(K.slHit);
        burst(ovG, xh, yS, (t - T.sacando) * 0.8, 14, 70, 4);
        tag(xh + 14, yS + 30, "STOP ✗  −$", RED, kh, "start", 18);
      }
      if (t >= T.entrada1) xMark(xE + 26, yE - 26, P(t, T.entrada1, 0.3, E.lin));
      if (t >= T.stop3) xMark(xM + 30, yS, P(t, T.stop3, 0.3, E.lin));
    }
    // la dirección era correcta
    if (t >= T.idea && v.upto > K.touch) {
      const ka = P(t, T.idea, 0.8, E.inOut), x0 = X(K.touch), y0 = Y(D[K.touch].l) + 10, x1 = X(Math.min(v.upto, K.tpHit + 10)), y1 = Y(hiOf(K.touch, Math.min(v.upto, K.tpHit + 10))) - 10;
      el("path", { d: `M${x0} ${y0} L${lerp(x0, x1, ka)} ${lerp(y0, y1, ka)}`, stroke: GREEN, "stroke-width": 9, "stroke-linecap": "round", opacity: 0.85 }, ovG);
      if (ka > 0.9) { el("path", { d: `M${x1 - 26} ${y1 + 2} L${x1} ${y1} L${x1 - 6} ${y1 + 26}`, stroke: GREEN, "stroke-width": 9, fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" }, ovG); tag(x1 - 20, y1 + 50, "✓ DIRECCIÓN", "#089981", P(t, T.correcta - 0.1, 0.35, E.lin), "end", 18); }
    }
  }
  // 3) Fibonacci del impulso
  if (t >= T.trazo && t < T.siVa + 0.2) {
    const kl = P(t, T.trazo, 0.6, E.inOut), xa = X(K.L), ya = Y(D[K.L].l), xb = X(K.top), yb = Y(D[K.top].h);
    el("line", { x1: xa, y1: ya, x2: lerp(xa, xb, kl), y2: lerp(ya, yb, kl), stroke: "#8A8F98", "stroke-width": 2, "stroke-dasharray": "6 5" }, ovG);
    const lv = [["0", 0, "#8A8F98"], ["0.5", 0.5, "#8A8F98"], ["0.618", 0.618, "#C98A00"], ["0.705", 0.705, "#E9A400"], ["0.79", 0.79, "#E9A400"], ["1", 1, "#8A8F98"]];
    const f = K.fib, yOf = (l) => Y(D[K.top].h - l * (D[K.top].h - D[K.L].l));
    const kb = P(t, T.fibo + 0.1, 0.5, E.out);
    if (kb > 0) el("rect", { x: xa, y: yOf(0.705), width: (RX - xa) * kb, height: yOf(0.79) - yOf(0.705), fill: "#FFC94A", opacity: t >= T.coincide ? 0.35 + 0.15 * Math.sin(t * 6) : 0.28 }, ovG);
    lv.forEach(([s, l, c], i) => { const k = P(t, T.fibo - 0.2 + i * 0.08, 0.35, E.out); if (k <= 0) return; hline(yOf(l), xa, RX, c, l > 0.6 && l < 0.8 ? "" : "4 4", l > 0.6 && l < 0.8 ? 2.5 : 1.5, k);
      el("text", { x: xa - 6, y: yOf(l) + 5, "text-anchor": "end", "font-family": FONTP2, "font-weight": 800, "font-size": 14, fill: c, opacity: k }, ovG, s); });
    if (t >= T.coincide) tag((xa + RX) / 2 + 120, yOf(0.79) + 34, "✓ COINCIDE CON LA ZONA", "#089981", P(t, T.coincide, 0.35, E.lin), "middle", 18);
  }
  // 4) entrada correcta: posición larga (TP / SL)
  if (t >= T.esperando && t < T.porque2 + 3) {
    const kp = P(t, T.esperando, 0.6, E.out), x0 = X(K.H) + 6, w = (RX - x0) * kp, yE = Y(K.entry), yT = Y(K.tp), yS = Y(K.sl);
    el("rect", { x: x0, y: yT, width: w, height: yE - yT, fill: "#089981", opacity: 0.16 }, ovG);
    el("rect", { x: x0, y: yE, width: w, height: yS - yE, fill: RED, opacity: 0.14 }, ovG);
    hline(yE, x0, RX, "#15171C", "", 2.5, kp); hline(yT, x0, RX, "#089981", "", 2, kp); hline(yS, x0, RX, RED, "", 2, kp);
    tag(RX - 6, yT + 18, "TP " + R5(K.tp), "#089981", kp, "end", 15); tag(RX - 6, yE - 16, (t >= T.siVa ? "PENDIENTE · " : "ENTRADA · ") + R5(K.entry), "#15171C", kp, "end", 15); tag(RX - 6, yS - 16, "SL " + R5(K.sl), RED, kp, "end", 15);
    if (t >= T.regrese && t < T.siVa && v.upto >= K.fill) { vMark(X(K.fill), yE, P(t, T.regrese + 0.6, 0.3, E.lin), 14); }
    if (t >= T.regrese && t < T.siVa && v.upto >= K.tpHit) { vMark(X(K.tpHit), yT, P(t, T.entrada2, 0.3, E.lin), 18); burst(ovG, X(K.tpHit), yT, t - T.entrada2, 16, 90, 6); }
    if (t >= T.perseguir - 0.2 && t < T.porque2 + 3) tag((x0 + RX) / 2, yE + 34, "NO LA PERSIGO ✋", RED, P(t, T.perseguir - 0.2, 0.35, E.lin), "middle", 20);
  }
}

// ---------- Fotograma ----------
const xG = el("g", {}, svg);
function mouthAt(t) { const i = Math.floor(t * 60); return TL.env[Math.min(TL.env.length - 1, i)] ?? 0; }
function blinkAt(t) { const ph = (t + 0.7) % 3.4; return ph < 0.12 ? Math.sin((ph / 0.12) * Math.PI) : 0; }
const PL = [["SUBIÓ", T.subio], ["PERDIENDO", T.perdiendo], ["¿CÓMO", T.como], ["ESCAPE", T.escape], ["ERROR", T.error], ["PIÉNSALO", T.pienso], ["STOP", T.sacando + 0.6], ["CORRECTA", T.correcta], ["CORRECTOS", T.correctos], ["FIBONACCI", T.fibo], ["PERSEGUIR", T.perseguir], ["ZONAS", T.zonasW], ["GRATUITA", T.gratuita]];
window.renderAt = function (t) {
  const st = { t, mouth: mouthAt(t), blink: blinkAt(t), progress: t / T.total, pipK: 0 };
  // cámara: estudio → dentro del ordenador → estudio
  const tin = T.mostrarte - 0.2, tout = T.porque2 - 0.3;
  st.zoom = t < tin ? 0.25 * P(t, 0, 3, E.inOut) : t < tout ? 0 : 0.35 * P(t, tout, 0.8, E.inOut);
  st.fullK = t < tin ? 0 : t < tout ? P(t, tin, 1.1, E.inOut) : 1 - P(t, tout, 0.9, E.inOut);
  const FULLM = st.fullK > 0.5;
  st.view = viewAt(t);
  // título de entrada
  if (t > 0.5 && t < tin + 0.4) st.title = [[["SUBIÓ… ", 0], ["Y AUN ASÍ", 1]], [["PERDISTE", 1], [" 🤔", 0]]];
  // Leo
  if (t < T.perdiendo) { st.leo = "explainR"; st.handR = "open"; st.lookX = 0.3; }
  else if (t < T.mostrarte - 0.4) { st.leo = "shrug"; st.handR = "open"; st.handL = "open"; st.smile = 0.3; st.brow = 0.9; }
  else if (t < tout) { st.leo = "pointUp"; st.handR = "point"; st.smile = 0.8; st.lookX = 0.4; st.lookY = -0.6; }
  else if (t < T.quieres) { st.leo = "explainR"; st.handR = "open"; st.smile = 0.7; }
  else if (t < T.sigueme) { st.leo = "pointUp"; st.handR = "point"; st.smile = 0.9; }
  else { st.leo = "wave"; st.handR = "open"; st.smile = 0.95; st.over = { shR: -150 + Math.sin(t * 10) * 16, elR: -25 + Math.sin(t * 10 + 0.6) * 22 }; }
  // cuenta atrás de 3 s
  if (t >= T.c0 - 0.2 && t < T.c1) {
    const e = Math.max(0, t - T.c0); st.count = Math.max(1, 3 - Math.floor(e)); st.countP = e % 1; st.countAt = [880, 1680];
    st.sticker = "COMENTA:  ¿A o B?"; st.stickerX = 540; st.stickerY = 1845 + (1 - E.backBig(P(t, T.c0, 0.5, E.lin))) * 300;
  }
  // pasos
  const STEPS = [[T.primero - 0.2, [["1 · ", 1], ["ESTRUCTURA", 0]]], [T.marco - 0.2, [["2 · ", 1], ["ZONA DE INTERÉS", 0]]], [T.trazo - 0.2, [["3 · ", 1], ["FIBONACCI", 0]]], [T.esperando - 0.2, [["4 · ", 1], ["ESPERO MI ENTRADA", 0]]]];
  if (t >= T.primero - 0.2 && t < tout) { const s = STEPS.filter((x) => t >= x[0]).pop(); st.step = s[1]; if (t < s[0] + 0.45) st.stepK = (t - s[0]) / 0.45; }
  Object.assign(st, captionAt(t));
  if (st.kin && FULLM && st.kinY == null) { st.kinY = 1690; st.kinX = 540; st.kinSize = 70; }
  // palabras clave con animación
  PL.forEach(([w, tw0], n) => { const dur = Math.min(1.15, (PL[n + 1]?.[1] ?? 1e9) - tw0 - 0.02); if (t >= tw0 - 0.05 && t < tw0 - 0.05 + dur) st.punch = { w, tt: t - tw0 + 0.05, dur, y: FULLM ? 1700 : 1150 }; });
  window.PUNCHX = FULLM ? 540 : 560; window.PUNCHS = FULLM ? 1 : 0.82;
  // lista de pasos (abajo)
  if (t >= T.primero && t < tout) st.check = { k: Math.min((t - T.primero) / 0.5, 1 - clamp((t - tout + 0.5) / 0.4)), items: [
    { txt: "ESTRUCTURA", on: (t - T.estructura2) / 0.35 }, { txt: "ZONA", on: (t - T.zona2) / 0.35 }, { txt: "FIBONACCI", on: (t - T.coincide) / 0.35 }] };
  // ritmo
  st.whip = [[T.siVa, 1], [T.regrese, -0.6]].reduce((a, [ts, d]) => a + d * Math.exp(-(((t - ts) / 0.09) ** 2)), 0);
  st.kick = [T.comprar, T.error, T.sacando, T.idea, T.primero, T.marco, T.trazo, T.coincide, T.esperando, T.perseguir].reduce((a, tk) => a + (t >= tk ? 0.04 * Math.exp(-(t - tk) / 0.22) : 0), 0);
  st.rewind = win(t, T.poreso - 0.4, T.poreso + 0.9, 0.15, 0.25);
  if (t >= T.gratuita + 0.4) st.hearts = t - T.gratuita - 0.4;
  if (t >= T.outro) st.outro4 = t - T.outro;
  window.renderState(st);
  drawOverlay(t, st.view);
  xG.textContent = "";
  // en el cierre, burbuja de comentario con "ZONAS"
  if (t >= T.outro + 0.9) {
    const k = E.backBig(P(t, T.outro + 0.9, 0.5, E.lin)), g = el("g", { transform: `translate(540,${1360 + Math.sin(t * 3) * 8}) scale(${k.toFixed(3)})` }, xG);
    el("path", { d: "M-210 -70 H210 Q240 -70 240 -40 V40 Q240 70 210 70 H-60 L-110 120 L-100 70 H-210 Q-240 70 -240 40 V-40 Q-240 -70 -210 -70 Z", fill: "#fff", filter: "url(#txtSh)" }, g);
    el("text", { y: 22, "text-anchor": "middle", "font-family": FONTP, "font-weight": 900, "font-size": 64, fill: BLUE2 }, g, "ZONAS");
  }
};
window.READY = true;
