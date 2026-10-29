// Reto POI v3 — cada palabra clave trae su animación detrás (siempre en la franja bajo la gráfica,
// para que la gráfica siga siendo la protagonista), lista de criterios, entrada de los pasos,
// Leo de cuerpo entero que asoma para señalar, corazones en "like".
const v6G = el("g", {}, svg);
const GREEN = "#2FD39A", CREAM = "#F5F1E6";
const leoFull = createLeo(el("g", {}, svg));
const leoFullG = leoFull ? svg.lastChild : null;

// ---------- Animaciones detrás de la palabra (centradas en 0,0; tt en segundos) ----------
const ART = {
  TIEMPO(g, tt, dur) {
    const k = clamp(tt / dur), flip = 180 * (1 - E.inOut(clamp(tt / 0.3)));
    const ring = el("g", { transform: `rotate(${(tt * 60).toFixed(1)})` }, g);
    for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; el("path", { d: `M${Math.cos(a) * 175} ${Math.sin(a) * 120} L${Math.cos(a) * 200} ${Math.sin(a) * 137}`, stroke: YEL, "stroke-width": 8, "stroke-linecap": "round" }, ring); }
    const h = el("g", { transform: `translate(-330,0) rotate(${flip.toFixed(1)})` }, g);
    const s2 = el("g", { transform: `translate(330,0) rotate(${(-flip).toFixed(1)})` }, g);
    for (const q of [h, s2]) {
      el("rect", { x: -95, y: -142, width: 190, height: 18, rx: 6, fill: "#B5803A" }, q); el("rect", { x: -95, y: 124, width: 190, height: 18, rx: 6, fill: "#B5803A" }, q);
      el("path", { d: "M-78 -124 L78 -124 L6 0 L78 124 L-78 124 L-6 0 Z", fill: "#FFFFFF", opacity: 0.18, stroke: "#fff", "stroke-width": 5, "stroke-linejoin": "round" }, q);
      const yb = -110 * (1 - k * 0.85), xw = 72 * (-yb / 124);
      el("path", { d: `M${-xw} ${yb} L${xw} ${yb} L0 -4 Z`, fill: YEL }, q);
      el("path", { d: `M-70 120 L70 120 L0 ${(120 - 95 * k).toFixed(1)} Z`, fill: YEL }, q);
      el("line", { x1: 0, y1: 0, x2: 0, y2: 118, stroke: YEL, "stroke-width": 4, "stroke-dasharray": "8 6", "stroke-dashoffset": (-tt * 120).toFixed(1) }, q);
    }
  },
  VELAS(g, tt) {
    const cl = [40, -30, 10, -60, -20, -90, -50, -120]; // cierres: cada vela abre en el cierre anterior
    for (let i = 1; i < cl.length; i++) {
      const k = E.backBig(clamp((tt - (i - 1) * 0.07) / 0.25)); if (k <= 0) continue;
      const o = cl[i - 1], c = cl[i], up = c < o, x = -420 + (i - 1) * 140;
      const top = Math.min(o, c), bot = Math.max(o, c);
      const q = el("g", { transform: `translate(${x},${o}) scale(1,${k.toFixed(3)}) translate(0,${-o})` }, g);
      el("line", { x1: 0, x2: 0, y1: top - 40, y2: bot + 34, stroke: up ? "#fff" : "#8A8F98", "stroke-width": 6 }, q);
      el("rect", { x: -34, y: top, width: 68, height: Math.max(8, bot - top), rx: 6, fill: up ? "#fff" : "#5B6170", stroke: up ? "#fff" : "#8A8F98", "stroke-width": 3 }, q);
    }
  },
  DISPUTAS(g, tt, dur, top, w) {
    const hit = 0.22, ki = E.in(clamp(tt / hit)), back = tt > hit ? Math.sin(clamp((tt - hit) / 0.25) * Math.PI) * 30 : 0;
    const sh = tt > hit ? Math.sin(tt * 80) * 6 * Math.max(0, 1 - (tt - hit) / 0.4) : 0;
    if (tt > hit) {
      const k = clamp((tt - hit) / 0.35);
      el("path", { d: "M0 -150 L36 -60 L130 -80 L60 -10 L150 50 L40 40 L20 140 L-20 50 L-130 90 L-60 0 L-150 -60 L-40 -50 Z", fill: YEL, opacity: (1 - k * 0.6).toFixed(3), transform: `scale(${(0.5 + E.out(k) * 0.9).toFixed(3)})` }, g);
      for (let i = 0; i < 14; i++) { const a = (i / 14) * Math.PI * 2, r0 = 60 + k * 120, r1 = r0 + 50 * (1 - k); el("path", { d: `M${Math.cos(a) * r0} ${Math.sin(a) * r0 * 0.7} L${Math.cos(a) * r1} ${Math.sin(a) * r1 * 0.7}`, stroke: "#fff", "stroke-width": 6, "stroke-linecap": "round", opacity: (1 - k).toFixed(3) }, g); }
    }
    const ex = w / 2 + 70;
    bull(top, lerp(-640, -ex, ki) - back + sh, 0, 1.15);
    bear(top, lerp(640, ex, ki) + back + sh, 0, 1.15);
  },
  PASADO(g, tt) {
    const c = el("g", { transform: "translate(-300,0)" }, g);
    el("circle", { r: 138, fill: CREAM, stroke: BLUE2, "stroke-width": 12 }, c);
    for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; el("line", { x1: Math.cos(a) * 108, y1: Math.sin(a) * 108, x2: Math.cos(a) * 124, y2: Math.sin(a) * 124, stroke: "#15171C", "stroke-width": i % 3 ? 4 : 8 }, c); }
    el("line", { x1: 0, y1: 0, x2: 0, y2: -96, stroke: "#15171C", "stroke-width": 9, "stroke-linecap": "round", transform: `rotate(${(-tt * 1100).toFixed(1)})` }, c);
    el("line", { x1: 0, y1: 0, x2: 0, y2: -62, stroke: RED, "stroke-width": 11, "stroke-linecap": "round", transform: `rotate(${(-tt * 140).toFixed(1)})` }, c);
    el("circle", { r: 10, fill: "#15171C" }, c);
    el("path", { d: "M150 -70 A170 170 0 0 0 -40 -165", stroke: YEL, "stroke-width": 12, fill: "none", "stroke-linecap": "round" }, c);
    el("path", { d: "M-62 -186 L-40 -165 L-66 -146", stroke: YEL, "stroke-width": 12, fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" }, c);
    for (let i = 0; i < 4; i++) {
      const k = clamp((tt - i * 0.12) / 0.7); if (k <= 0) continue;
      const q = el("g", { transform: `translate(${lerp(420, -40, E.out(k))},${-60 + i * 30 - Math.sin(k * Math.PI) * 60}) rotate(${(-k * 40 + i * 6).toFixed(1)})`, opacity: (1 - k * 0.7).toFixed(3) }, g);
      el("rect", { x: -60, y: -70, width: 120, height: 130, rx: 10, fill: "#fff" }, q); el("rect", { x: -60, y: -70, width: 120, height: 34, rx: 10, fill: RED }, q);
      el("text", { x: 0, y: 36, "text-anchor": "middle", "font-family": FONTP, "font-weight": 900, "font-size": 54, fill: "#15171C" }, q, String(28 - i * 7));
    }
  },
  REACCIONES(g, tt) {
    el("rect", { x: -400, y: 88, width: 800, height: 50, rx: 8, fill: "#BFD0FF", opacity: 0.5 }, g);
    const d = "M-400 -175 L-260 -60 L-180 -110 L-60 100 L60 -20 L150 30 L340 -185";
    const L = 1400, k = E.inOut(clamp(tt / 0.6));
    el("path", { d, stroke: YEL, "stroke-width": 13, fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-dasharray": `${(L * k).toFixed(1)} 3000` }, g);
    if (k > 0.98) el("path", { d: "M300 -187 L340 -185 L332 -147", stroke: YEL, "stroke-width": 13, fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" }, g);
    const kh = clamp((tt - 0.28) / 0.4);
    if (kh > 0) { el("circle", { cx: -60, cy: 100, r: 20 + kh * 60, fill: "none", stroke: "#fff", "stroke-width": 6, opacity: (1 - kh).toFixed(3) }, g); el("circle", { cx: -60, cy: 100, r: 14, fill: "#fff" }, g); }
  },
  CANDIDATA(g, tt) {
    const t0 = el("g", { transform: `translate(330,0) scale(${E.backBig(clamp(tt / 0.25)).toFixed(3)})` }, g);
    const hit = 0.32, wob = tt > hit ? Math.sin((tt - hit) * 40) * 5 * Math.max(0, 1 - (tt - hit) / 0.4) : 0;
    const tg = el("g", { transform: `rotate(${wob.toFixed(2)})` }, t0);
    [[150, "#E9ECF2"], [118, BLUE2], [86, "#E9ECF2"], [54, BLUE2], [22, YEL]].forEach(([r, f]) => el("circle", { r, fill: f }, tg));
    const kd = E.in(clamp(tt / hit)), dx = lerp(420, 0, kd), dy = lerp(-260, 0, kd);
    const dart = el("g", { transform: `translate(${dx},${dy}) rotate(-32)` }, t0);
    el("line", { x1: 0, y1: 0, x2: 150, y2: 0, stroke: "#15171C", "stroke-width": 10, "stroke-linecap": "round" }, dart);
    el("path", { d: "M120 0 L170 -32 L160 0 L170 32 Z", fill: RED }, dart);
    el("path", { d: "M0 0 L22 -8 L22 8 Z", fill: "#8A8F98" }, dart);
    const ks = clamp((tt - hit) / 0.35); if (ks > 0) for (let i = 0; i < 10; i++) { const a = (i / 10) * Math.PI * 2, r0 = 30 + ks * 140; el("path", { d: `M${Math.cos(a) * r0} ${Math.sin(a) * r0} L${Math.cos(a) * (r0 + 30)} ${Math.sin(a) * (r0 + 30)}`, stroke: YEL, "stroke-width": 7, "stroke-linecap": "round", opacity: (1 - ks).toFixed(3) }, t0); }
  },
  OBSERVAR(g, tt, dur, top) {
    const x = lerp(-380, 380, E.inOut(clamp(tt / dur))), lens = el("g", { transform: `translate(${x.toFixed(1)},-10)` }, top);
    el("circle", { r: 118, fill: "#BFD0FF", opacity: 0.22 }, lens);
    el("circle", { r: 118, fill: "none", stroke: YEL, "stroke-width": 16 }, lens);
    el("path", { d: "M-70 -40 A80 80 0 0 1 -30 -84", stroke: "#fff", "stroke-width": 10, fill: "none", "stroke-linecap": "round", opacity: 0.8 }, lens);
    el("line", { x1: 84, y1: 84, x2: 170, y2: 170, stroke: "#B5803A", "stroke-width": 30, "stroke-linecap": "round" }, lens);
  },
  AUTOMÁTICA(g, tt, dur, top, w) {
    const press = tt > 0.3 && tt < 0.42 ? 8 : 0;
    el("rect", { x: -w / 2 - 50, y: -82, width: w + 100, height: 168, rx: 34, fill: "#9E1F2C" }, g);
    el("rect", { x: -w / 2 - 50, y: -96 + press, width: w + 100, height: 168, rx: 34, fill: RED }, g);
    const kc = E.out(clamp(tt / 0.3)), cur = el("g", { transform: `translate(${lerp(w / 2 + 260, w / 2 - 40, kc)},${lerp(260, 50, kc)})` }, top);
    el("path", { d: "M0 0 L0 62 L16 48 L28 74 L40 68 L28 44 L50 44 Z", fill: "#fff", stroke: "#15171C", "stroke-width": 4, "stroke-linejoin": "round" }, cur);
    const kx = E.out(clamp((tt - 0.45) / 0.25));
    if (kx > 0) for (const [a, b] of [[[-w / 2 - 60, -110], [w / 2 + 60, 110]], [[w / 2 + 60, -110], [-w / 2 - 60, 110]]]) {
      const xe = lerp(a[0], b[0], kx), ye = lerp(a[1], b[1], kx);
      el("line", { x1: a[0], y1: a[1], x2: xe, y2: ye, stroke: "#15171C", "stroke-width": 34, "stroke-linecap": "round" }, top);
      el("line", { x1: a[0], y1: a[1], x2: xe, y2: ye, stroke: "#fff", "stroke-width": 20, "stroke-linecap": "round" }, top);
    }
  },
};

// palabra clave con su animación detrás
function drawPunch(word, tt, y, dur = 1.1) {
  if (tt < 0 || tt > dur) return;
  const kin = E.backBig(clamp(tt / 0.2)), kout = 1 - E.in(clamp((tt - dur + 0.16) / 0.16));
  const shake = Math.sin(tt * 70) * 6 * Math.max(0, 1 - tt / 0.4);
  let size = 128;
  const meas = el("text", { "font-family": FONTP, "font-weight": 900, "font-size": size }, v6G, word);
  let w = meas.getComputedTextLength(); meas.remove();
  const maxW = word === "DISPUTAS" ? 560 : 860;
  if (w > maxW) { size *= maxW / w; w = maxW; }
  const root = el("g", { transform: `translate(540,${y})`, opacity: kout.toFixed(3) }, v6G);
  const art = el("g", { transform: `scale(${E.backBig(clamp(tt / 0.25)).toFixed(3)})` }, root);
  const top = el("g", {}, root);
  const fn = ART[word];
  const wordG = el("g", { transform: `translate(${shake.toFixed(1)},0) rotate(-3) scale(${(kin * (1 + 0.03 * Math.sin(tt * 9))).toFixed(4)})`, filter: "url(#txtSh)" }, root);
  root.appendChild(top);
  if (fn) fn(art, tt, dur, top, w);
  el("text", { x: 0, y: size * 0.36, "text-anchor": "middle", "font-family": FONTP, "font-weight": 900, "font-size": size, fill: "#fff", stroke: "#05060A", "stroke-width": 18, "paint-order": "stroke", "stroke-linejoin": "round" }, wordG, word);
  el("rect", { x: -w / 2, y: size * 0.5, width: w * E.out(clamp((tt - 0.1) / 0.3)), height: 12, rx: 6, fill: BLUE2 }, wordG);
}

// toro y oso pequeños que empujan a los lados de "COMPRAS Y VENTAS"
function drawFlank(k, tt, y) {
  if (k <= 0) return;
  const push = Math.sin(tt * 10) * 10, s = 0.72 * E.backBig(clamp(k));
  const g = el("g", { opacity: clamp(k * 2).toFixed(3) }, v6G);
  bull(g, 95 + push, y - 20, s); bear(g, 985 - push, y - 20, s);
}

// lista de criterios (a la derecha del círculo)
function drawChecklist(st) {
  const c = st.check; if (!c || c.k <= 0) return;
  const g = el("g", { transform: `translate(${lerp(1200, 0, E.out(clamp(c.k))).toFixed(1)},0)` }, v6G);
  const done = c.items.every((it) => it.on >= 1);
  el("rect", { x: 390, y: 1478, width: 660, height: 300, rx: 30, fill: "#0E1220", stroke: done ? GREEN : "#2B3350", "stroke-width": done ? 6 : 3, filter: "url(#txtSh)" }, g);
  el("text", { x: 420, y: 1528, "font-family": FONTP, "font-weight": 900, "font-size": 28, fill: "#8A90A0", "letter-spacing": 2 }, g, "CHECKLIST LFX");
  c.items.forEach((it, i) => {
    const y = 1590 + i * 70, on = clamp(it.on);
    el("rect", { x: 420, y: y - 26, width: 52, height: 52, rx: 12, fill: on > 0 ? GREEN : "none", stroke: on > 0 ? GREEN : "#5B6170", "stroke-width": 4 }, g);
    if (on > 0) el("path", { d: `M${432} ${y} L${443} ${y + 12} L${462} ${y - 12}`, stroke: "#05060A", "stroke-width": 7, fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-dasharray": `${(50 * E.out(on)).toFixed(1)} 100` }, g);
    const sc = on > 0 && on < 1 ? 1 + Math.sin(on * Math.PI) * 0.12 : 1;
    el("text", { x: 492, y: y + 13, "font-family": FONTP, "font-weight": 900, "font-size": 38, fill: on > 0 ? "#fff" : "#6B7180", transform: `translate(492,${y}) scale(${sc.toFixed(3)}) translate(-492,${-y})` }, g, it.txt);
  });
}

// corazones al decir "like"
function drawHearts(tt) {
  if (tt < 0 || tt > 1.8) return;
  for (let i = 0; i < 9; i++) {
    const k = clamp((tt - i * 0.07) / 1.2); if (k <= 0 || k >= 1) continue;
    const x = 640 + ((i * 53) % 300) + Math.sin(k * 6 + i) * 20, y = 1300 - k * 420, s = 0.8 + (i % 3) * 0.3;
    el("path", { d: "M0 18 C-26 0 -22 -20 -10 -20 C-4 -20 0 -14 0 -10 C0 -14 4 -20 10 -20 C22 -20 26 0 0 18 Z", fill: i % 2 ? RED : "#FF6B81", opacity: (1 - k).toFixed(3), transform: `translate(${x},${y}) scale(${s})` }, v6G);
  }
}

const render5 = window.renderState;
window.renderState = function (st) {
  const punch = st.punch; st.punch = null;
  render5(st);
  v6G.textContent = "";
  // entrada de cada paso: la píldora crece con rebote
  if (st.stepK != null && st.stepK < 1) titleG.setAttribute("transform", `translate(540,160) scale(${(0.2 + 0.8 * E.backBig(clamp(st.stepK))).toFixed(4)}) translate(-540,-160)`);
  else titleG.removeAttribute("transform");
  // Leo de cuerpo entero asoma junto al círculo para señalar la gráfica
  const lo = st.leoOut ?? 0;
  if (leoFullG) leoFullG.style.display = lo > 0 ? "" : "none";
  if (lo > 0) {
    leoFull.update({ t: st.t ?? 0, x: 215, y: 2250 + (1 - E.backBig(clamp(lo))) * 700, scale: 1.05, ...POSE.pointUp, handR: "point", handL: "fist", mouth: st.mouth ?? 0, smile: 0.9, brow: 0.6, lookX: 0.4, lookY: -0.8, blink: st.blink ?? 0 });
    pipG.setAttribute("transform", (pipG.getAttribute("transform") || "") + ` translate(${PIP.x},${PIP.y}) scale(${(1 - clamp(lo)).toFixed(3)}) translate(${-PIP.x},${-PIP.y})`);
  }
  if (st.outro4 != null && st.outro4 !== false && st.outro4 > 0.35) return;
  drawChecklist(st);
  if (st.flank) drawFlank(st.flank, st.t ?? 0, st.kinY ?? 1300);
  if (st.hearts != null) drawHearts(st.hearts);
  if (punch) { kinG.textContent = ""; drawPunch(punch.w, punch.tt, punch.y ?? 1290, punch.dur); }
};
