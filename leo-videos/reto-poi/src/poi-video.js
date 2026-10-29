// Reto POI — animación completa: renderAt(t) dibuja el fotograma del segundo t.
// Usa poi3.js (escena y gráfica), poi4.js (capa viral) y timeline-poi.js (voz y palabras).
const WD = TL.words;
const norm = (s) => s.toLowerCase().replace(/[¿?¡!.,]/g, "");
function wt(rx, nth = 0) { let c = 0; for (const w of WD) if (new RegExp(rx, "i").test(norm(w[2]))) { if (c === nth) return w[0]; c++; } throw new Error("palabra " + rx); }
const T = {
  mira: wt("^mira$"), tienes: wt("^tienes$"), c0: TL.count[0], c1: TL.count[1], laC: wt("^c$"), vamos: wt("^vamos$"),
  primero: wt("^primero$"), semanal: wt("^semanal$"), diario: wt("^diario$"), cuatro: wt("^cuatro$"),
  buscamos: wt("^buscamos$"), acumulando: wt("^acumulando$"), interaccion: wt("^interacción$"), compras: wt("^compras$"), ventas: wt("^ventas$"),
  marcamos: wt("^marcamos$"), revisamos2: wt("^revisamos$", 1), disputas: wt("^disputas$"), reacciones: wt("^reacciones$"), candidata: wt("^candidata$"),
  eso: wt("^eso$"), observar: wt("^observar$"), entrada: wt("^entrada$"), acertaste: wt("^acertaste$"), velas: wt("^velas$"), automatica: wt("^automática$"), like: wt("^like$"), comunidad: wt("^comunidad$"),
  outro: TL.outro, total: TL.total, tiempo: wt("^tiempo$"), pasado: wt("^pasado$", 1),
};

// ---------- Subtítulos: grupos de 1 a 3 palabras ----------
const BLUE = new Set(["punto", "interés", "lfx", "cinco", "c", "comprobar", "temporalidades", "semanal", "diario", "horas", "zona", "tiempo", "velas", "compras", "ventas", "pasado", "disputas", "reacciones", "candidata", "observar", "automática", "like", "comunidad", "gratuita", "marcamos", "descripción", "zonas"]);
const ICON = { interés: "target", segundos: "clock", velas: "candle", pasado: "history", reacciones: "history", like: "heart", observar: "eye", comunidad: "group", zonas: "target", horas: "clock" };
const CHUNKS = [];
{
  let cur = [];
  const flush = () => { if (cur.length) CHUNKS.push(cur); cur = []; };
  WD.forEach((w, i) => {
    const txt = w[2].replace(/[.,!¡]/g, "").toUpperCase();
    const chars = cur.reduce((a, o) => a + o.w.length + 1, 0) + txt.length;
    if (cur.length && (cur.length >= 3 || chars > 15 || w[0] - cur[cur.length - 1].t1 > 0.35)) flush();
    const n = norm(w[2]);
    cur.push({ w: txt, t0: w[0], t1: w[1], blue: BLUE.has(n), icon: ICON[n] });
    if (/[.,?!]$/.test(w[2])) flush();
  });
  flush();
  CHUNKS.forEach((c, i) => { const nx = CHUNKS[i + 1]; c.from = c[0].t0 - 0.06; c.to = nx && nx[0].t0 - c[c.length - 1].t1 < 0.7 ? nx[0].t0 - 0.06 : c[c.length - 1].t1 + 0.45; });
}
function captionAt(t) {
  if (t >= T.c0 - 0.3 && t < T.c1) return { kin: [{ w: "¿A," }, { w: "B" }, { w: "o C?", blue: true, icon: "clock" }], kinActive: 2, kinPop: P(t, T.c0 - 0.3, 0.5, E.lin), kinX: 400, kinY: 1690, kinSize: 76 };
  const c = CHUNKS.find((c) => t >= c.from && t < c.to);
  if (!c) return {};
  let a = 0; c.forEach((o, i) => { if (t >= o.t0 - 0.06) a = i; });
  return { kin: c, kinActive: a, kinPop: clamp((t - c[a].t0 + 0.06) / 0.28) };
}

// ---------- Vistas de la gráfica ----------
const { N: NN, IDX: I, TF: TFD } = POIDATA;
const rng = (tf, a, b) => { const d = TFD[tf].slice(Math.max(0, Math.floor(a)), Math.ceil(b)); return [Math.min(...d.map((c) => c.l)), Math.max(...d.map((c) => c.h))]; };
const mkView = (tf, i0, i1, padLo = 0.4, padHi = 0.6) => { const [lo, hi] = rng(tf, i0, i1); return { tf, i0, i1, pmin: lo - padLo, pmax: hi + padHi }; };
const V = {
  full: mkView("H4", I.start, NN + 8),
  acc: mkView("H4", I.acc0 - 22, I.acc1 + 10, 0.5, 0.7),
  past: mkView("H4", I.start - 2, I.acc0 + 12, 0.3, 0.3),
  W1: mkView("W1", TFD.W1.length - 30, TFD.W1.length + 1.5, 0.5, 0.5),
  D1: mkView("D1", TFD.D1.length - 70, TFD.D1.length + 3, 0.5, 0.5),
};
// interacciones dentro de la acumulación actual: mínimo (compras), máximo (ventas) y otro mínimo
const accR = TFD.H4.slice(I.acc0, I.acc1 + 1);
const iLow = I.acc0 + accR.reduce((b, c, i) => (c.l < accR[b].l ? i : b), 0);
const iHigh = I.acc0 + accR.reduce((b, c, i) => (c.h > accR[b].h ? i : b), 0);
const half = Math.floor(accR.length / 2), side = iLow - I.acc0 < half ? [half, accR.length] : [0, half];
const iLow2 = I.acc0 + side[0] + accR.slice(side[0], side[1]).reduce((b, c, i) => (c.l < accR[side[0] + b].l ? i : b), 0);
const mixV = (a, b, k) => ({ tf: k < 0.5 ? a.tf : b.tf, i0: lerp(a.i0, b.i0, k), i1: lerp(a.i1, b.i1, k), pmin: lerp(a.pmin, b.pmin, k), pmax: lerp(a.pmax, b.pmax, k) });
function chartAt(t) {
  let v;
  if (t < T.semanal) v = V.full;
  else if (t < T.diario) v = V.W1;
  else if (t < T.cuatro) v = V.D1;
  else if (t < T.buscamos) v = V.full;
  else if (t < T.marcamos) v = mixV(V.full, V.acc, P(t, T.buscamos, 0.9, E.inOut));
  else if (t < T.revisamos2) v = mixV(V.acc, V.full, P(t, T.marcamos, 0.7, E.inOut));
  else if (t < T.eso - 0.1) v = mixV(V.full, V.past, P(t, T.revisamos2, 1.1, E.inOut));
  else v = mixV(V.past, V.full, P(t, T.eso - 0.1, 0.9, E.inOut));
  v = { ...v };
  // zonas
  const rev = P(t, T.laC, 0.5), fadeAB = t < T.primero ? 1 : 1 - P(t, T.primero, 0.6);
  const Z = {};
  if (v.tf === "H4") {
    if (fadeAB > 0) { Z.A = { from: I.aCross, op: (1 - rev * 0.55) * fadeAB, labOp: 1 - rev * 0.6 }; Z.B = { from: I.bStart, op: (1 - rev * 0.55) * fadeAB, labOp: 1 - rev * 0.6 }; }
    const pulse = t > T.candidata && t < T.candidata + 1.2 ? Math.sin((t - T.candidata) * Math.PI / 1.2) * 0.8 : 0;
    Z.C = { from: I.acc0, op: 1, strong: rev + pulse, labCol: rev > 0.5 ? "#2962FF" : undefined };
    if (t >= T.marcamos) Z.C = { ...Z.C, from: I.start - 10, draw: P(t, T.marcamos, 0.8, E.inOut) };
    if (t >= T.marcamos && Z.C.draw < 1) Z.Cold = true;
  } else Z.C = { from: 0, op: 1, strong: 0.6 };
  v.zones = Z;
  // la franja actual sigue visible mientras se dibuja la extendida
  if (Z.Cold) v.zones = { ...Z, B: undefined, A: undefined };
  // marcas
  const M = [], pop = (t0) => E.backBig(clamp((t - t0) / 0.35));
  if (t >= T.interaccion && t < T.marcamos + 0.3) {
    M.push({ kind: "circle", i: iLow2, p: TFD.H4[iLow2].l, k: pop(T.interaccion), r: 16 });
    if (t >= T.compras) M.push({ kind: "circle", i: iLow, p: TFD.H4[iLow].l, k: pop(T.compras), r: 16 }, { kind: "arrow", i: iLow, p: TFD.H4[iLow].l - 0.08 });
    if (t >= T.ventas) M.push({ kind: "circle", i: iHigh, p: TFD.H4[iHigh].h, k: pop(T.ventas), r: 16 });
  }
  if (t >= T.disputas) {
    M.push({ kind: "circle", i: I.touch[0].i, p: I.touch[0].p, k: pop(T.disputas) }, { kind: "arrow", i: I.touch[0].i, p: I.touch[0].p - 0.25 });
    if (t >= T.reacciones) M.push({ kind: "circle", i: I.touch[1].i, p: I.touch[1].p, k: pop(T.reacciones) }, { kind: "arrow", i: I.touch[1].i, p: I.touch[1].p - 0.25 });
  }
  v.marks = M;
  // cursor que pulsa W / D / 4H
  const btn = (n) => [150 + 27 + n * 64 - 4, 10 + 20];
  if (t > T.semanal - 0.6 && t < T.buscamos) {
    const k1 = P(t, T.semanal - 0.6, 0.5), k2 = P(t, T.diario - 0.5, 0.4), k3 = P(t, T.cuatro - 0.5, 0.4);
    const a = [lerp(560, btn(0)[0], k1), lerp(400, btn(0)[1], k1)];
    const b = [lerp(a[0], btn(1)[0], k2), a[1]]; const c = [lerp(b[0], btn(2)[0], k3), b[1]];
    v.cursor = c;
  }
  return v;
}

// ---------- Fotograma ----------
const xG = el("g", {}, svg);
function pill(parent, parts, y, size = 50, w = 940) {
  el("rect", { x: 540 - w / 2, y, width: w, height: 100, rx: 50, fill: "#fff", filter: "url(#soft)" }, parent);
  const t = el("text", { x: 540, y: y + 67, "text-anchor": "middle", "font-family": FONTP, "font-weight": 900, "font-size": size }, parent);
  for (const [s, b] of parts) el("tspan", { fill: b ? P2.blue : P2.ink }, t, s);
}
function mouthAt(t) { const i = Math.floor(t * 60); return TL.env[Math.min(TL.env.length - 1, i)] ?? 0; }
function blinkAt(t) { const ph = (t + 0.7) % 3.4; return ph < 0.12 ? Math.sin((ph / 0.12) * Math.PI) : 0; }

window.renderAt = function (t) {
  const st = { t, mouth: mouthAt(t), blink: blinkAt(t), progress: t / T.total };
  // cámara: plano general → pantalla → círculo
  st.zoom = t < T.mira ? 0 : P(t, T.mira, 1.0, E.inOut);
  const pin = P(t, T.tienes, 0.8, E.inOut), pout = P(t, T.c1, 0.6, E.inOut), pin2 = P(t, T.primero - 0.4, 0.7, E.inOut), pout2 = P(t, T.acertaste - 0.3, 0.7, E.inOut);
  st.pipK = t < T.c1 ? pin : t < T.primero - 0.4 ? 1 - pout : 1 - pout2 + 0 * pin2;
  if (t >= T.primero - 0.4 && t < T.acertaste - 0.3) st.pipK = pin2;
  if (t >= T.acertaste - 0.3) st.pipK = 1 - pout2;
  if (t >= T.acertaste - 0.3) st.zoom = 1 - 0.6 * P(t, T.acertaste - 0.3, 0.8, E.inOut);
  st.pipK = 0;
  st.fullK = t < T.mira - 0.1 ? 0 : t < T.c1 ? P(t, T.mira - 0.1, 1.1, E.inOut) : t < T.primero - 0.4 ? 1 - P(t, T.c1, 0.7, E.inOut) : t < T.acertaste - 0.3 ? P(t, T.primero - 0.4, 0.9, E.inOut) : 1 - P(t, T.acertaste - 0.3, 0.8, E.inOut);
  const FULLM = st.fullK > 0.5;
  st.view = chartAt(t);
  // título
  if (t > 1.0 && t < T.primero - 0.3) {
    const k = P(t, 1.0, 0.5);
    st.title = k > 0 ? [[["¿CUÁL ES EL ", 0], ["PUNTO", 1]], [["DE INTERÉS?", 1], ["  A · B · C", 0]]] : null;
  }
  // Leo en el escritorio
  if (t < T.mira) { st.leo = "wave"; st.handR = "open"; st.smile = 0.95; st.over = { tilt: Math.sin(t * 2) * 3, shR: -150 + Math.sin(t * 10) * 16, elR: -25 + Math.sin(t * 10 + 0.6) * 22 }; }
  else if (t < T.tienes) { st.leo = "explainR"; st.handR = "open"; st.lookX = 0.5; st.lookY = -0.2; }
  else if (t < T.vamos + 1) { st.leo = "cheer"; st.smile = 1; st.handR = "open"; st.handL = "open"; st.jump = Math.max(0, Math.sin(clamp((t - T.laC) / 0.5) * Math.PI)) * 40; }
  else { st.leo = t < T.like + 0.6 ? "pointUp" : "present"; st.handR = t < T.like + 0.6 ? "point" : "open"; st.smile = 0.9; }
  // Leo en el círculo
  if (t >= T.c0 - 0.4 && t < T.c1) { st.pipPose = "think"; st.mood = "think"; st.smile = 0.2; st.lookX = 0.4; st.lookY = -0.6; st.handR = "fist"; }
  else { st.pipPose = Math.floor(t / 2.6) % 2 ? "explainR" : "present"; st.smile = st.smile ?? 0.75; }
  // gancho

  // cuenta atrás
  if (t >= T.c0 - 0.2 && t < T.c1) {
    const e = Math.max(0, t - T.c0); st.count = Math.max(1, 5 - Math.floor(e)); st.countP = e % 1; st.countAt = [880, 1680];
    st.sticker = "PAUSA Y COMENTA TU LETRA"; st.stickerX = 540; st.stickerY = 1845 + (1 - E.backBig(P(t, T.c0, 0.5, E.lin))) * 300;
  }
  // revelado
  if (t >= T.c1 && t < T.primero - 0.4) { st.banner = "C · VAMOS A COMPROBARLA"; st.react = win(t, T.c1 + 0.2, T.primero - 0.5, 0.25, 0.3); }
  // pasos
  if (t >= T.primero - 0.3 && t < T.buscamos - 0.2) st.step = [["1 · ", 1], ["CONTEXTO MAYOR", 0]];
  else if (t >= T.buscamos - 0.2 && t < T.marcamos - 0.2) st.step = [["2 · ", 1], ["LOCALIZA LA ZONA", 0]];
  else if (t >= T.marcamos - 0.2 && t < T.eso - 0.1) st.step = [["3 · ", 1], ["REVISA SU HISTORIA", 0]];
  else if (t >= T.eso - 0.1 && t < T.acertaste - 0.3) st.step = [["PUNTO ", 0], ["DE INTERÉS", 1]];
  Object.assign(st, captionAt(t));
  if (st.kin && FULLM && st.kinY == null) { st.kinY = 1690; st.kinX = 540; st.kinSize = 70; }
  if (t >= T.outro) st.outro4 = t - T.outro;
  // ---- v2: ritmo ----
  st.whip = [[T.semanal, 1], [T.diario, -1], [T.cuatro, 1]].reduce((a, [ts, d]) => a + d * Math.exp(-(((t - ts) / 0.09) ** 2)), 0);
  st.kick = [T.buscamos, T.interaccion, T.marcamos, T.disputas, T.reacciones, T.candidata, T.eso].reduce((a, tk) => a + (t >= tk ? 0.045 * Math.exp(-(t - tk) / 0.22) : 0), 0);
  const PL = [["TIEMPO", T.tiempo], ["VELAS", T.velas], ["PASADO", T.pasado], ["DISPUTAS", T.disputas], ["REACCIONES", T.reacciones], ["CANDIDATA", T.candidata], ["OBSERVAR", T.observar], ["AUTOMÁTICA", T.automatica]];
  PL.forEach(([w, tw0], n) => { const dur = Math.min(1.15, (PL[n + 1]?.[1] ?? 1e9) - tw0 - 0.02); if (t >= tw0 - 0.05 && t < tw0 - 0.05 + dur) st.punch = { w, tt: t - tw0 + 0.05, dur, y: 1700 }; });
  if (t > T.compras - 0.2 && t < T.marcamos - 0.2) st.flank = Math.min(clamp((t - T.compras + 0.2) / 0.3), 1 - clamp((t - T.marcamos + 0.45) / 0.25));
  // lista de criterios
  if (t >= T.buscamos && t < T.acertaste - 0.3) st.check = { k: Math.min((t - T.buscamos) / 0.5, 1 - clamp((t - T.acertaste + 0.7) / 0.4)), items: [
    { txt: "PASÓ TIEMPO", on: (t - T.tiempo) / 0.35 }, { txt: "INTERACCIÓN", on: (t - T.interaccion) / 0.35 }, { txt: "TIENE HISTORIA", on: (t - T.reacciones) / 0.35 }] };
  // entrada de cada paso
  for (const ts of [T.primero - 0.3, T.buscamos - 0.2, T.marcamos - 0.2, T.eso - 0.1]) if (t >= ts && t < ts + 0.45) st.stepK = (t - ts) / 0.45;
  // Leo asoma de cuerpo entero para señalar la gráfica
  if (t >= T.like - 0.1) st.hearts = t - T.like + 0.1;
  st.rewind = win(t, T.revisamos2, T.revisamos2 + 1.3, 0.15, 0.25);
  if (t > T.c1 + 0.3 && t < T.primero - 0.45) { st.tags = t - T.c1 - 0.3; st.tagFrom = { A: I.aCross, B: I.bStart, C: I.acc0 }; }
  if (t >= T.disputas && t < T.eso - 0.1) { const two = t >= T.reacciones; st.counter = { n: two ? 2 : 1, kn: (t - (two ? T.reacciones : T.disputas)) / 0.3, k: (t - T.disputas) / 0.3 }; }
  window.renderState(st);
  // capa extra: cadena de temporalidades y "zona con historia"
  xG.textContent = "";
  if (t >= T.primero && t < T.buscamos - 0.2) {
    const items = [["SEMANAL", T.semanal], ["DIARIO", T.diario], ["H4", T.cuatro]];
    const g = el("g", { opacity: P(t, T.primero, 0.4).toFixed(3) }, xG);
    items.forEach(([s, ta], i) => {
      const x = 230 + i * 310, on = t >= ta, k = E.backBig(clamp((t - ta) / 0.35));
      const b = el("g", { transform: `translate(${x},1860) scale(${on ? 0.9 + 0.1 * k : 0.9})` }, g);
      el("rect", { x: -120, y: -36, width: 240, height: 72, rx: 36, fill: on ? P2.blue : "#1B2030", stroke: on ? "#fff" : "#3A4258", "stroke-width": 3 }, b);
      el("text", { x: 0, y: 14, "text-anchor": "middle", "font-family": FONTP, "font-weight": 900, "font-size": 34, fill: on ? "#fff" : "#8A90A0" }, b, s);
      if (i < 2) el("path", { d: `M${x + 128} 1860 l26 0 m-10 -10 l10 10 l-10 10`, stroke: t >= items[i + 1][1] ? BLUE2 : "#3A4258", "stroke-width": 6, fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" }, g);
    });
  }
  if (t >= T.eso - 0.1 && t < T.acertaste - 0.3) {
    const k = E.backBig(P(t, T.eso, 0.4, E.lin));
    const g = el("g", { transform: `translate(860,${MON.y + 120}) scale(${(0.8 * k).toFixed(3)})` }, xG);
    el("rect", { x: -200, y: -34, width: 400, height: 68, rx: 34, fill: P2.blue }, g);
    el("text", { x: 0, y: 13, "text-anchor": "middle", "font-family": FONTP, "font-weight": 900, "font-size": 34, fill: "#fff" }, g, "ZONA CON HISTORIA");
  }
};
window.READY = true;
