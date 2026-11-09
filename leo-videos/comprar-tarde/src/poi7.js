// Reto POI v4 — plano continuo: la cámara entra en el ordenador hasta que la gráfica llena la pantalla
// (st.fullK 0..1), sale para el revelado y para el final. Sin círculo: en pantalla completa solo la gráfica,
// subtítulos y animaciones abajo, checklist en una fila.
const MON0 = { ...MON };
const FULL = { x: -12, y: 250, w: 1104, h: 1290 };
const monKids = monG.children; // halo, marco, borde, pie, base, pantalla, brillo
const scrBg = scr.querySelector('rect[width="1000"][height="720"]');
const sideRect = scr.querySelector('rect[x="0"][y="53"]'), sideLine = scr.querySelector('line[x1="44"]');
const utcTxt = [...scr.querySelectorAll("text")].find((t) => t.textContent === "UTC");
const neon = el("rect", { fill: "none", stroke: BLUE2, "stroke-width": 6, rx: 10, opacity: 0 }, monG);
{ const f = el("filter", { id: "neonGlow", x: "-10%", y: "-10%", width: "120%", height: "120%" }, el("defs", {}, svg)); el("feGaussianBlur", { stdDeviation: 9 }, f); }
const neonGlow = el("rect", { fill: "none", stroke: "#5B8CFF", "stroke-width": 16, rx: 14, opacity: 0, filter: "url(#neonGlow)" }, monG);

function setMon(x, y, w, h, full) {
  MON.x = x; MON.y = y; MON.w = w; MON.h = h;
  const VH = (1000 * h) / w;
  scr.setAttribute("x", x); scr.setAttribute("y", y); scr.setAttribute("width", w); scr.setAttribute("height", h); scr.setAttribute("viewBox", `0 0 1000 ${VH.toFixed(2)}`);
  PLOT.h = VH - 62 - 58;
  scrBg.setAttribute("height", VH);
  scr.querySelector("#scrClip rect").setAttribute("height", PLOT.h);
  sideRect.setAttribute("height", VH - 53); sideLine.setAttribute("y2", VH); utcTxt.setAttribute("y", VH - 8);
  monKids[0].setAttribute("cx", x + w / 2); monKids[0].setAttribute("cy", y + h / 2);
  for (const r of [monKids[1], monKids[2]]) { r.setAttribute("x", x - 18); r.setAttribute("y", y - 18); r.setAttribute("width", w + 36); r.setAttribute("height", h + 36); }
  monKids[3].setAttribute("y", y + h + 18); monKids[4].setAttribute("y", y + h + 82);
  monKids[3].setAttribute("opacity", 1 - full); monKids[4].setAttribute("opacity", 1 - full);
  for (const r of [neon, neonGlow]) { r.setAttribute("x", x + 4); r.setAttribute("y", y + 4); r.setAttribute("width", w - 8); r.setAttribute("height", h - 8); }
  neon.setAttribute("opacity", (full * 0.9).toFixed(3)); neonGlow.setAttribute("opacity", (full * (0.55 + 0.25 * Math.sin(performance.now() * 0))).toFixed(3));
  glassR.setAttribute("y", y); glassR.setAttribute("width", w); glassR.setAttribute("height", h);
}

// checklist en una fila (abajo)
function drawChecklist(st) {
  const c = st.check; if (!c || c.k <= 0) return;
  const g = el("g", { transform: `translate(0,${((1 - E.out(clamp(c.k))) * 200).toFixed(1)})`, opacity: clamp(c.k * 2).toFixed(3) }, v6G);
  c.items.forEach((it, i) => {
    const x = 190 + i * 350, y = 1860, on = clamp(it.on), pop = on > 0 && on < 1 ? 1 + Math.sin(on * Math.PI) * 0.18 : 1;
    const q = el("g", { transform: `translate(${x},${y}) scale(${pop.toFixed(3)})` }, g);
    el("rect", { x: -165, y: -32, width: 330, height: 64, rx: 32, fill: on > 0 ? "#0E2A22" : "#121626", stroke: on > 0 ? GREEN : "#2B3350", "stroke-width": 4 }, q);
    el("circle", { cx: -128, cy: 0, r: 20, fill: on > 0 ? GREEN : "none", stroke: on > 0 ? GREEN : "#5B6170", "stroke-width": 4 }, q);
    if (on > 0) el("path", { d: "M-138 0 L-131 8 L-118 -8", stroke: "#05060A", "stroke-width": 6, fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-dasharray": `${(40 * E.out(on)).toFixed(1)} 100` }, q);
    el("text", { x: 14, y: 11, "text-anchor": "middle", "font-family": FONTP, "font-weight": 900, "font-size": 30, fill: on > 0 ? "#fff" : "#6B7180" }, q, it.txt);
  });
}
// contador de reacciones: pequeño, en la esquina de la gráfica
function drawCounter(n, kn, k) {
  if (k <= 0) return;
  const g = el("g", { transform: `translate(860,${MON.y + 120}) scale(${(0.8 * E.backBig(clamp(k))).toFixed(3)})` }, v5G);
  el("rect", { x: -230, y: -40, width: 460, height: 80, rx: 40, fill: "#0E1220", stroke: BLUE2, "stroke-width": 4, filter: "url(#txtSh)" }, g);
  el("text", { x: -40, y: 14, "text-anchor": "middle", "font-family": FONTP, "font-weight": 900, "font-size": 36, fill: "#fff" }, g, "REACCIONES");
  const b = el("g", { transform: `translate(160,0) scale(${(1 + (1 - E.out(clamp(kn))) * 0.6).toFixed(3)})` }, g);
  el("circle", { r: 32, fill: BLUE2 }, b);
  el("text", { x: 0, y: 15, "text-anchor": "middle", "font-family": FONTP, "font-weight": 900, "font-size": 44, fill: "#fff" }, b, String(n));
}

const render6 = window.renderState;
window.renderState = function (st) {
  const f = clamp(st.fullK ?? 0), e = E.inOut(f), tt = st.t ?? 0;
  // rectángulo de la pantalla en el fotograma: del estudio (con el zoom de cámara) a pantalla completa
  const z = st.zoom ?? 0, s = 1 + z * 0.12, cy0 = MON0.y + MON0.h / 2;
  const R0 = { x: 540 + s * (MON0.x - 540), y: cy0 + s * (MON0.y - cy0 + z * 40), w: MON0.w * s, h: MON0.h * s };
  const R = { x: lerp(R0.x, FULL.x, e), y: lerp(R0.y, FULL.y, e), w: lerp(R0.w, FULL.w, e), h: lerp(R0.h, FULL.h, e) };
  // a coordenadas locales de la cámara
  setMon(540 + (R.x - 540) / s, cy0 + (R.y - cy0) / s - z * 40, R.w / s, R.h / s, e);
  render6(st);
  if (f > 0) {
    // el escritorio y Leo se quedan atrás mientras la cámara entra
    deskG.setAttribute("opacity", (1 - E.out(clamp(f * 1.6))).toFixed(3));
    deskG.setAttribute("transform", `translate(540,1500) scale(${(1 + e * 0.6).toFixed(3)}) translate(-540,${(-1500 + e * 700).toFixed(1)})`);
    bgG.setAttribute("transform", `translate(540,800) scale(${(1 + e * 0.3).toFixed(3)}) translate(-540,-800)`);
    // movimiento de cámara suave dentro de la pantalla
    const dr = `translate(${(Math.sin(tt * 0.9) * 6 * e).toFixed(2)},${(Math.sin(tt * 0.7 + 1) * 5 * e).toFixed(2)}) rotate(${(Math.sin(tt * 0.5) * 0.35 * e).toFixed(3)},540,900)`;
    camG.setAttribute("transform", dr + " " + camG.getAttribute("transform"));
  } else { bgG.removeAttribute("transform"); }
};
