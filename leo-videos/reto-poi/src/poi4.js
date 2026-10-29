// Capa viral sobre poi3.js: gancho, círculo con Leo (PiP), subtítulos palabra a palabra con iconos,
// cartel "Pausa y comenta", barra de progreso de la serie, reacción y cierre oscuro.
const BLUE2 = "#4D7CFF";
const fx4 = el("g", {}, svg);
const pipG = el("g", {}, svg);
const kinG = el("g", {}, svg);
const topBar = el("g", {}, svg);
const outro4 = el("g", {}, svg);

// ----- Círculo con Leo hablando -----
const PIP = { x: 190, y: 1610, r: 150 };
{
  const cp = el("clipPath", { id: "pipClip" }, svg);
  el("circle", { cx: PIP.x, cy: PIP.y, r: PIP.r }, cp);
}
el("circle", { cx: PIP.x, cy: PIP.y + 10, r: PIP.r + 14, fill: "#000", opacity: 0.35 }, pipG);
const pipBg = el("circle", { cx: PIP.x, cy: PIP.y, r: PIP.r, fill: "#16233F" }, pipG);
const pipIn = el("g", { "clip-path": "url(#pipClip)" }, pipG);
el("circle", { cx: PIP.x, cy: PIP.y - 30, r: 160, fill: "#22345C" }, pipIn);
const leoPip = createLeo(pipIn);
const pipRing = el("circle", { cx: PIP.x, cy: PIP.y, r: PIP.r, fill: "none", stroke: BLUE2, "stroke-width": 8 }, pipG);
const pipLive = el("g", {}, pipG);
el("rect", { x: PIP.x - 46, y: PIP.y + PIP.r - 18, width: 92, height: 36, rx: 18, fill: BLUE2 }, pipLive);
el("text", { x: PIP.x, y: PIP.y + PIP.r + 8, "text-anchor": "middle", "font-family": FONTP2, "font-weight": 800, "font-size": 20, fill: "#fff" }, pipLive, "LEO");

// ----- Iconos para palabras clave -----
function icon4(parent, name, x, y, s = 1) {
  const g = el("g", { transform: `translate(${x},${y}) scale(${s})` }, parent);
  el("circle", { r: 34, fill: "#fff" }, g);
  const st = { stroke: BLUE2, "stroke-width": 5, fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" };
  if (name === "clock") { el("circle", { r: 20, ...st }, g); el("path", { d: "M0 -11 V0 L9 6", ...st }, g); }
  if (name === "candle") { el("path", { d: "M-8 -22 V22 M10 -16 V18", ...st }, g); el("rect", { x: -14, y: -12, width: 12, height: 20, rx: 2, fill: BLUE2 }, g); el("rect", { x: 4, y: -6, width: 12, height: 14, rx: 2, fill: "#fff", stroke: BLUE2, "stroke-width": 4 }, g); }
  if (name === "group") { for (const [cx, cy] of [[-13, -6], [13, -6], [0, -12]]) el("circle", { cx, cy, r: 7, fill: BLUE2 }, g); el("path", { d: "M-24 18 C-22 4 22 4 24 18 Z", fill: BLUE2 }, g); }
  if (name === "history") { el("path", { d: "M-18 4 A18 18 0 1 0 -12 -14", ...st }, g); el("path", { d: "M-22 -18 L-12 -14 L-14 -4", ...st }, g); el("path", { d: "M0 -8 V2 L7 7", ...st }, g); }
  if (name === "target") { el("circle", { r: 20, ...st }, g); el("circle", { r: 9, ...st }, g); el("circle", { r: 2.5, fill: BLUE2 }, g); }
  return g;
}

// ----- Subtítulos palabra a palabra -----
function kinetic(words, active, y = 1290, cxAll = 540, size = 70) {
  // words: [{w, blue, icon}], active: índice de la palabra que acaba de entrar
  kinG.textContent = "";
  const gap = size * 0.45;
  const meas = el("text", { "font-family": FONTP, "font-weight": 900, "font-size": size }, kinG);
  const ws = words.map((o) => { meas.textContent = o.w; return meas.getComputedTextLength(); });
  meas.remove();
  const sc = words.map((o, i) => (i === active ? 1.12 : 1));
  const total = ws.reduce((a, b, i) => a + b * sc[i], 0) + gap * (words.length - 1);
  let x = cxAll - total / 2;
  words.forEach((o, i) => {
    const s = sc[i], cx = x + (ws[i] * s) / 2;
    const g = el("g", { transform: `translate(${cx},${y}) scale(${s}) translate(${-cx},${-y})` }, kinG);
    const t = el("text", { x: cx, y, "text-anchor": "middle", "font-family": FONTP, "font-weight": 900, "font-size": size, fill: o.blue ? BLUE2 : "#FFFFFF", stroke: "#05060A", "stroke-width": 10, "paint-order": "stroke", "stroke-linejoin": "round" }, g, o.w);
    if (o.blue) el("rect", { x: cx - ws[i] / 2, y: y + 14, width: ws[i], height: 8, rx: 4, fill: BLUE2 }, g);
    if (o.icon) icon4(g, o.icon, cx + ws[i] / 2 + 10, y - size, 0.9 * size / 70);
    x += ws[i] * s + gap;
  });
}

// ----- Barra de progreso de la serie -----
function drawTopBar(p) {
  topBar.textContent = "";
  el("rect", { x: 0, y: 0, width: W, height: 10, fill: "#1B2030" }, topBar);
  el("rect", { x: 0, y: 0, width: W * p, height: 10, fill: BLUE2 }, topBar);
  el("rect", { x: 40, y: 34, width: 230, height: 50, rx: 25, fill: "#0E1220", stroke: BLUE2, "stroke-width": 3 }, topBar);
  el("text", { x: 155, y: 67, "text-anchor": "middle", "font-family": FONTP2, "font-weight": 900, "font-size": 24, fill: "#fff", "letter-spacing": 2 }, topBar, "RETO LFX #02");
}

function sticker(text, x, y, rot = -5) {
  const g = el("g", { transform: `translate(${x},${y}) rotate(${rot})` }, fx4);
  el("rect", { x: -320, y: -50, width: 640, height: 100, rx: 22, fill: "#fff", stroke: BLUE2, "stroke-width": 5 }, g);
  const ic = el("g", { transform: "translate(-268,0)" }, g);
  el("path", { d: "M-24 -18 H24 V12 H-4 L-16 24 V12 H-24 Z", fill: BLUE2 }, ic);
  el("text", { x: 30, y: 13, "text-anchor": "middle", "font-family": FONTP, "font-weight": 900, "font-size": 34, fill: "#111318" }, g, text);
}

function drawOutro4(k) {
  outro4.textContent = "";
  el("rect", { width: W, height: H, fill: "#05060A", opacity: 0.55 }, outro4);
  for (let r = 0; r < 9; r++) for (let c = 0; c < 3; c++)
    el("text", { x: 180 + c * 360 + (r % 2) * 180, y: 160 + r * 220, "text-anchor": "middle", "font-family": FONTP, "font-weight": 900, "font-size": 40, fill: "#FFFFFF", opacity: 0.05 }, outro4, "LEONARDO LFX");
  const gg = el("radialGradient", { id: "logoHalo" }, outro4);
  el("stop", { offset: "0%", "stop-color": BLUE2, "stop-opacity": 0.45 }, gg); el("stop", { offset: "100%", "stop-color": BLUE2, "stop-opacity": 0 }, gg);
  el("circle", { cx: 540, cy: 820, r: 520, fill: "url(#logoHalo)" }, outro4);
  el("image", { href: "logo-lfx.png", x: 197, y: 694, width: 686, height: 251 }, outro4);
  el("text", { x: 540, y: 1110, "text-anchor": "middle", "font-family": FONTP, "font-weight": 900, "font-size": 56, fill: "#fff", "letter-spacing": 3 }, outro4, "COMUNIDAD GRATUITA LFX");
  el("text", { x: 540, y: 1180, "text-anchor": "middle", "font-family": FONTP2, "font-weight": 700, "font-size": 40, fill: BLUE2 }, outro4, "Link en mi descripción");
  el("path", { d: "M540 1440 L540 1260 M496 1304 L540 1256 L584 1304", stroke: BLUE2, "stroke-width": 12, fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" }, outro4);
}

const baseRender = window.renderState;
window.renderState = function (st) {
  baseRender(st);
  fx4.textContent = ""; kinG.textContent = ""; outro4.textContent = "";
  // modo círculo: la pantalla ocupa el centro y Leo pasa a la burbuja
  if (st.pip) {
    deskG.style.display = "none";
    camG.setAttribute("transform", `translate(540,${st.pipY ?? 760}) scale(1.07) translate(-540,${-(MON.y + MON.h / 2)})`);
    pipG.style.display = "";
    leoPip.update({ t: st.t ?? 0, x: PIP.x, y: PIP.y + 1060, scale: 1.65, ...POSE[st.pipPose ?? "rest"], mouth: st.mouth ?? 0.5, smile: st.smile ?? 0.7, brow: 0.5, lookX: 0.2, handR: "open" });
  } else { deskG.style.display = ""; pipG.style.display = "none"; }
  if (st.kin) { capG.textContent = ""; kinetic(st.kin, st.kinActive ?? st.kin.length - 1, st.kinY ?? (st.pip ? 1300 : 1330), st.kinX ?? (st.pip ? 540 : 790), st.kinSize ?? 70); }
  if (st.hook) {
    el("rect", { width: W, height: H, fill: "#05060A", opacity: 0.45 }, fx4);
    for (let i = 0; i < 14; i++) { const a = (i / 14) * Math.PI * 2; el("path", { d: `M${540 + Math.cos(a) * 250} ${700 + Math.sin(a) * 250} L${540 + Math.cos(a) * 380} ${700 + Math.sin(a) * 380}`, stroke: BLUE2, "stroke-width": 10, "stroke-linecap": "round", opacity: 0.8 }, fx4); }
    el("text", { x: 540, y: 740, "text-anchor": "middle", "font-family": FONTP, "font-weight": 900, "font-size": 150, fill: "#fff", stroke: "#05060A", "stroke-width": 14, "paint-order": "stroke" }, fx4, "¿A, B o C?");
  }
  if (st.sticker) sticker(st.sticker, st.stickerX ?? 665, st.stickerY ?? 1530);
  if (st.react) { // reacción de Leo en el revelado
    for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i - 4.5) * 0.25; el("path", { d: `M${330 + Math.cos(a) * 190} ${1420 + Math.sin(a) * 190} L${330 + Math.cos(a) * 235} ${1420 + Math.sin(a) * 235}`, stroke: "#FFD45C", "stroke-width": 8, "stroke-linecap": "round" }, fx4); }
  }
  if (st.progress != null) drawTopBar(st.progress); else topBar.textContent = "";
  if (st.outro4) { titleG.textContent = ""; capG.textContent = ""; camG.style.display = "none"; pipG.style.display = "none"; drawOutro4(1); } else camG.style.display = "";
};
