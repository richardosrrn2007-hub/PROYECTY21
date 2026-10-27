// Leo: toro LFX articulado (cuerpo, cabeza, ojos, cejas, boca, brazos con codo y manos).
// Origen del grupo = base del cuerpo, centrado. Ángulos de brazo: 0 = colgando hacia abajo.
// Brazo derecho (lado derecho de la pantalla): negativo = hacia fuera/arriba. Izquierdo: positivo.
const HOOD = "#1B1F26", HOOD_L = "#2A303A", RIM = "#3C4450", MUZ = "#E8D9BF", GOLD_D = "#C08F22";
const UPPER = 84, FORE = 74;

function createLeo(parent) {
  const root = el("g", {}, parent);
  const shadow = el("ellipse", { cx: 0, cy: 8, rx: 150, ry: 18, fill: "#000", opacity: 0.45 }, root);
  const bodyG = el("g", {}, root);

  // Brazos detrás del cuerpo no hacen falta: se dibujan delante para que se lean bien.
  const body = el("g", {}, bodyG);
  el("path", { d: "M-150 0 C-150 -120 -140 -185 -95 -205 L0 -178 L95 -205 C140 -185 150 -120 150 0 Z", fill: HOOD, stroke: RIM, "stroke-width": 5 }, body);
  el("path", { d: "M-95 -205 L0 -178 L95 -205 L80 -214 L0 -192 L-80 -214 Z", fill: HOOD_L }, body);
  el("path", { d: "M-16 -170 L-16 -105", stroke: C.em, "stroke-width": 6, "stroke-linecap": "round" }, body);
  el("path", { d: "M16 -170 L16 -112", stroke: C.em, "stroke-width": 6, "stroke-linecap": "round" }, body);
  el("text", { x: 0, y: -40, "text-anchor": "middle", "font-family": "Inter", "font-weight": 900, "font-size": 46, fill: C.em, "letter-spacing": 2 }, body, "LFX");

  // Cabeza (pivote en el cuello)
  const head = el("g", {}, bodyG);
  const h = el("g", { transform: "translate(-300,-430)" }, head);
  // cuernos
  el("path", { d: "M205 215 C150 205 110 160 118 95 C122 70 140 62 146 80 C150 120 175 160 230 175 Z", fill: C.gold }, h);
  el("path", { d: "M395 215 C450 205 490 160 482 95 C478 70 460 62 454 80 C450 120 425 160 370 175 Z", fill: C.gold }, h);
  el("path", { d: "M146 80 C150 120 175 160 230 175 L222 190 C175 180 150 150 146 80 Z", fill: GOLD_D, opacity: 0.55 }, h);
  el("path", { d: "M454 80 C450 120 425 160 370 175 L378 190 C425 180 450 150 454 80 Z", fill: GOLD_D, opacity: 0.55 }, h);
  // orejas (giran un poco)
  const earL = el("g", {}, h), earR = el("g", {}, h);
  el("path", { d: "M190 270 C150 250 105 262 85 290 C110 315 160 318 200 300 Z", fill: C.cream }, earL);
  el("path", { d: "M182 280 C152 270 122 276 108 291 C130 303 160 304 186 296 Z", fill: MUZ }, earL);
  el("path", { d: "M410 270 C450 250 495 262 515 290 C490 315 440 318 400 300 Z", fill: C.cream }, earR);
  el("path", { d: "M418 280 C448 270 478 276 492 291 C470 303 440 304 414 296 Z", fill: MUZ }, earR);
  // cara
  el("path", { d: "M300 170 C385 170 420 225 418 300 C416 360 400 395 392 420 C380 480 340 500 300 500 C260 500 220 480 208 420 C200 395 184 360 182 300 C180 225 215 170 300 170 Z", fill: C.cream }, h);
  el("path", { d: "M262 176 C275 150 300 140 318 152 C330 140 352 150 345 178 C330 168 312 172 300 182 C288 172 275 170 262 176 Z", fill: C.gold }, h);
  el("path", { d: "M300 186 L292 202 L300 216 L308 202 Z", fill: C.em }, h);
  el("ellipse", { cx: 300, cy: 420, rx: 98, ry: 66, fill: MUZ }, h);
  el("ellipse", { cx: 266, cy: 408, rx: 12, ry: 16, fill: C.ink, opacity: 0.85 }, h);
  el("ellipse", { cx: 334, cy: 408, rx: 12, ry: 16, fill: C.ink, opacity: 0.85 }, h);
  const cheekL = el("ellipse", { cx: 216, cy: 372, rx: 22, ry: 12, fill: "#F0A9A0", opacity: 0.45 }, h);
  const cheekR = el("ellipse", { cx: 384, cy: 372, rx: 22, ry: 12, fill: "#F0A9A0", opacity: 0.45 }, h);
  // ojos
  const eyes = [];
  for (const cx of [248, 352]) {
    const g = el("g", {}, h);
    el("circle", { cx, cy: 300, r: 31, fill: "#fff" }, g);
    const pupil = el("g", {}, g);
    el("circle", { cx, cy: 304, r: 18, fill: C.ink }, pupil);
    el("circle", { cx: cx + 6, cy: 297, r: 6, fill: "#fff" }, pupil);
    const lid = el("rect", { x: cx - 34, y: 266, width: 68, height: 0, fill: C.cream }, g);
    eyes.push({ g, pupil, lid, cx });
  }
  const browL = el("path", { stroke: C.ink, "stroke-width": 10, fill: "none", "stroke-linecap": "round" }, h);
  const browR = el("path", { stroke: C.ink, "stroke-width": 10, fill: "none", "stroke-linecap": "round" }, h);
  // boca
  const mouth = el("path", { fill: C.ink }, h);
  const tongue = el("ellipse", { fill: "#E86A6A" }, h);

  // Brazos
  function makeArm(side) {
    const sh = el("g", {}, bodyG);
    const upper = el("g", {}, sh);
    el("path", { d: `M0 0 L0 ${UPPER}`, stroke: RIM, "stroke-width": 60, "stroke-linecap": "round" }, upper);
    el("path", { d: `M0 0 L0 ${UPPER}`, stroke: HOOD, "stroke-width": 50, "stroke-linecap": "round" }, upper);
    const fore = el("g", {}, upper);
    el("path", { d: `M0 0 L0 ${FORE}`, stroke: RIM, "stroke-width": 56, "stroke-linecap": "round" }, fore);
    el("path", { d: `M0 0 L0 ${FORE}`, stroke: HOOD, "stroke-width": 46, "stroke-linecap": "round" }, fore);
    el("rect", { x: -26, y: FORE - 16, width: 52, height: 14, rx: 7, fill: C.em }, fore); // puño de la manga
    const hand = el("g", {}, fore);
    const finger = el("path", { d: `M0 ${FORE + 20} L0 ${FORE + 66}`, stroke: C.cream, "stroke-width": 20, "stroke-linecap": "round" }, hand);
    const fingers = el("g", {}, hand);
    for (const a of [-40, -14, 12, 38]) {
      const r = (a * Math.PI) / 180;
      el("path", { d: `M0 ${FORE + 26} L${(Math.sin(-r) * 44).toFixed(1)} ${(FORE + 26 + Math.cos(r) * 44).toFixed(1)}`, stroke: C.cream, "stroke-width": 15, "stroke-linecap": "round" }, fingers);
    }
    el("circle", { cx: 0, cy: FORE + 26, r: 30, fill: C.cream }, hand);
    el("path", { d: `M-20 ${FORE + 36} Q0 ${FORE + 52} 20 ${FORE + 36}`, stroke: "#DCD4C3", "stroke-width": 4, fill: "none" }, hand);
    return { sh, upper, fore, finger, fingers, side };
  }
  const armL = makeArm(-1), armR = makeArm(1);

  function update(s) {
    // s: {x,y,scale,flip,jump,squash,shL,elL,shR,elR,handL,handR,tilt,lookX,lookY,blink,brow,mouth,smile,mood}
    const sc = s.scale ?? 1;
    setT(root, s.x, s.y, sc);
    root.setAttribute("transform", root.getAttribute("transform") + (s.flip ? " scale(-1,1)" : ""));
    const jump = s.jump ?? 0, squash = s.squash ?? 0;
    shadow.setAttribute("rx", (150 * (1 - jump / 500)).toFixed(1));
    shadow.setAttribute("opacity", (0.45 * (1 - jump / 400)).toFixed(3));
    bodyG.setAttribute("transform", `translate(0,${(-jump).toFixed(2)}) scale(${(1 + squash * 0.06).toFixed(4)},${(1 - squash * 0.06).toFixed(4)})`);
    head.setAttribute("transform", `translate(0,-196) rotate(${(s.tilt ?? 0).toFixed(2)}) translate(0,${(s.headY ?? 0).toFixed(2)})`);
    earL.setAttribute("transform", `rotate(${(s.ear ?? 0).toFixed(2)},190,285)`);
    earR.setAttribute("transform", `rotate(${(-(s.ear ?? 0)).toFixed(2)},410,285)`);
    // ojos
    const lx = clamp(s.lookX ?? 0, -1, 1) * 9, ly = clamp(s.lookY ?? 0, -1, 1) * 8;
    const blink = clamp(s.blink ?? 0);
    for (const e of eyes) {
      e.pupil.setAttribute("transform", `translate(${lx.toFixed(2)},${ly.toFixed(2)})`);
      e.lid.setAttribute("height", (blink * 68).toFixed(1));
    }
    const b = s.brow ?? 0; // + sube, - frunce
    const think = s.mood === "think";
    browL.setAttribute("d", `M222 ${252 - b * 10 + (think ? 6 : 0)} Q248 ${238 - b * 14} 274 ${250 - b * 10 + (think ? 8 : 0)}`);
    browR.setAttribute("d", `M326 ${250 - b * 10 - (think ? 6 : 0)} Q352 ${238 - b * 14 - (think ? 8 : 0)} 378 ${252 - b * 10}`);
    // boca: apertura 0..1 y sonrisa -1..1
    const o = clamp(s.mouth ?? 0), sm = s.smile ?? 0.6;
    const w = 34 + o * 4 + sm * 6, y0 = 448 - sm * 4;
    const up = y0 + 4 - sm * 2, lo = y0 + 8 + sm * 10 + o * 46;
    mouth.setAttribute("d", `M${300 - w} ${y0} Q300 ${up} ${300 + w} ${y0} Q300 ${lo} ${300 - w} ${y0} Z`);
    if (o < 0.08) mouth.setAttribute("d", `M${300 - w} ${y0} Q300 ${y0 + 10 + sm * 16} ${300 + w} ${y0} Q300 ${y0 + 4 + sm * 12} ${300 - w} ${y0} Z`);
    tongue.setAttribute("cx", 300); tongue.setAttribute("cy", (y0 + 6 + o * 34).toFixed(1));
    tongue.setAttribute("rx", (18 * o).toFixed(1)); tongue.setAttribute("ry", (9 * o).toFixed(1));
    const ch = s.mood === "happy" ? 0.7 : 0.45;
    cheekL.setAttribute("opacity", ch); cheekR.setAttribute("opacity", ch);
    // brazos (hombros en ±108, -178)
    for (const [arm, sh, elb, hand] of [[armL, s.shL ?? 14, s.elL ?? -12, s.handL ?? "fist"], [armR, s.shR ?? -14, s.elR ?? 12, s.handR ?? "fist"]]) {
      arm.sh.setAttribute("transform", `translate(${arm.side * 108},-178) rotate(${sh.toFixed(2)})`);
      arm.fore.setAttribute("transform", `translate(0,${UPPER}) rotate(${elb.toFixed(2)})`);
      arm.finger.style.display = hand === "point" ? "" : "none";
      arm.fingers.style.display = hand === "open" ? "" : "none";
    }
  }
  return { root, update };
}

// Poses base (se mezclan con keyframes)
const POSE = {
  rest: { shL: 14, elL: -12, shR: -14, elR: 12, tilt: 0, brow: 0, smile: 0.6 },
  hips: { shL: 40, elL: -95, shR: -40, elR: 95, tilt: 0, brow: 0.2, smile: 0.7 },
  wave: { shL: 14, elL: -12, shR: -150, elR: -20, tilt: -4, brow: 0.6, smile: 1 },
  point: { shL: 14, elL: -12, shR: -128, elR: -12, tilt: -5, brow: 0.4, smile: 0.7 },
  pointUp: { shL: 14, elL: -12, shR: -165, elR: -5, tilt: -3, brow: 0.6, smile: 0.7 },
  present: { shL: 70, elL: 35, shR: -70, elR: -35, tilt: 0, brow: 0.5, smile: 0.8 },
  explainR: { shL: 14, elL: -12, shR: -75, elR: -60, tilt: 3, brow: 0.3, smile: 0.6 },
  explainL: { shL: 75, elL: 60, shR: -14, elR: 12, tilt: -3, brow: 0.3, smile: 0.6 },
  think: { shL: -25, elL: -150, shR: -14, elR: 12, tilt: 7, brow: -0.2, smile: -0.2 },
  cheer: { shL: 140, elL: 25, shR: -140, elR: -25, tilt: 0, brow: 1, smile: 1 },
  shrug: { shL: 55, elL: 70, shR: -55, elR: -70, tilt: 6, brow: 0.8, smile: -0.1 },
};
