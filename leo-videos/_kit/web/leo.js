// Leo: personaje 2D semirrealista (sudadera LFX). Cabeza con pelo, ojos, cejas y labios animables;
// brazos con codo y manos con dedos. Origen del grupo = base del cuerpo, centrado.
// Ángulos de brazo: 0 = colgando. Brazo derecho (lado derecho de pantalla): negativo = arriba/fuera.
const HOOD = "#1E2A45", HOOD_L = "#2A3A5E", RIM = "#33456C";
const SKIN = "#EFCDB4", SKIN_D = "#D9AE93", SKIN_DD = "#C4917A", HAIR = "#2B1D16", HAIR_L = "#4A3427", LIP = "#C47F73";
const UPPER = 104, FORE = 90;

function createLeo(parent) {
  const root = el("g", {}, parent);
  const defs = el("defs", {}, root);
  const grad = (id, kind, stops, attrs = {}) => {
    const g = el(kind, { id, ...attrs }, defs);
    for (const [o, c, a] of stops) el("stop", { offset: o, "stop-color": c, "stop-opacity": a ?? 1 }, g);
  };
  grad("skinG", "radialGradient", [["0%", "#F6DCC6"], ["70%", SKIN], ["100%", SKIN_D]], { cx: "45%", cy: "40%", r: "65%" });
  grad("hoodG", "linearGradient", [["0%", "#2C3C62"], ["45%", HOOD], ["100%", "#141C30"]], { x1: 0, y1: 0, x2: 0, y2: 1 });
  grad("hairG", "linearGradient", [["0%", HAIR_L], ["60%", HAIR], ["100%", "#1E140F"]], { x1: 0, y1: 0, x2: 0, y2: 1 });
  grad("neckG", "linearGradient", [["0%", SKIN_DD], ["100%", SKIN_D]], { x1: 0, y1: 0, x2: 0, y2: 1 });
  grad("lipG", "linearGradient", [["0%", "#A86A5E"], ["100%", "#C08A7E"]], { x1: 0, y1: 0, x2: 0, y2: 1 });

  const shadow = el("ellipse", { cx: 0, cy: 8, rx: 130, ry: 18, fill: "#000", opacity: 0.45 }, root);
  const bodyG = el("g", {}, root);

  // Cuello (fijo al cuerpo), más ancho
  el("path", { d: "M-36 -360 L36 -360 L44 -296 L-44 -296 Z", fill: "url(#neckG)" }, bodyG);
  el("path", { d: "M-36 -330 C-12 -318 12 -318 36 -330 L40 -312 C12 -300 -12 -300 -40 -312 Z", fill: SKIN_DD, opacity: 0.5 }, bodyG);
  // Torso en V: hombros anchos, pecho marcado, cintura estrecha
  const body = el("g", {}, bodyG);
  el("path", { d: "M-108 0 C-102 -34 -94 -66 -98 -104 C-106 -160 -146 -204 -168 -240 C-178 -262 -160 -290 -118 -300 C-86 -308 -60 -312 -44 -314 L44 -314 C60 -312 86 -308 118 -300 C160 -290 178 -262 168 -240 C146 -204 106 -160 98 -104 C94 -66 102 -34 108 0 Z", fill: "url(#hoodG)", stroke: RIM, "stroke-width": 3 }, body);
  // pectorales y hombros
  el("path", { d: "M-150 -238 C-118 -196 -64 -184 -10 -196", stroke: "#0E1424", "stroke-width": 5, fill: "none", opacity: 0.55, "stroke-linecap": "round" }, body);
  el("path", { d: "M150 -238 C118 -196 64 -184 10 -196", stroke: "#0E1424", "stroke-width": 5, fill: "none", opacity: 0.55, "stroke-linecap": "round" }, body);
  el("path", { d: "M-140 -270 C-110 -250 -70 -240 -30 -250 M140 -270 C110 -250 70 -240 30 -250", stroke: "#3E4E74", "stroke-width": 5, fill: "none", opacity: 0.6, "stroke-linecap": "round" }, body);
  el("path", { d: "M-150 -238 C-130 -200 -112 -160 -102 -116 M150 -238 C130 -200 112 -160 102 -116", stroke: "#0E1424", "stroke-width": 4, fill: "none", opacity: 0.45 }, body);
  // pliegues en la cintura
  el("path", { d: "M-92 -86 C-60 -76 -30 -80 -8 -90 M92 -76 C64 -66 36 -70 16 -80 M-96 -54 C-66 -46 -40 -50 -22 -58", stroke: "#0E1424", "stroke-width": 3, fill: "none", opacity: 0.4, "stroke-linecap": "round" }, body);
  // puño elástico inferior
  el("path", { d: "M-108 0 C-104 -10 -102 -20 -102 -28 L102 -28 C102 -20 104 -10 108 0 Z", fill: "#141B2E" }, body);
  for (let x = -96; x <= 96; x += 12) el("path", { d: `M${x} -26 V-2`, stroke: "#22304E", "stroke-width": 2 }, body);
  // cremallera y cuello
  el("path", { d: "M-8 -314 L-6 -214 L6 -214 L8 -314 Z", fill: "#141B2E" }, body);
  el("path", { d: "M0 -312 V-216", stroke: "#9AA3B5", "stroke-width": 3, "stroke-dasharray": "3 3" }, body);
  el("rect", { x: -5, y: -246, width: 10, height: 26, rx: 3, fill: "#C9CED6" }, body);
  el("path", { d: "M-24 -330 L0 -300 L-4 -338 Z", fill: "#8E1F2B" }, body);
  el("path", { d: "M24 -330 L0 -300 L4 -338 Z", fill: "#A3263A" }, body);
  el("path", { d: "M-48 -312 C-56 -338 -50 -356 -38 -362 L-14 -326 C-24 -318 -36 -314 -48 -312 Z", fill: "#26334F", stroke: RIM, "stroke-width": 2 }, body);
  el("path", { d: "M48 -312 C56 -338 50 -356 38 -362 L14 -326 C24 -318 36 -314 48 -312 Z", fill: "#26334F", stroke: RIM, "stroke-width": 2 }, body);
  // logo bordado pequeño
  el("text", { x: 82, y: -238, "text-anchor": "middle", "font-family": "Inter", "font-weight": 900, "font-size": 22, fill: C.em, "letter-spacing": 1 }, body, "LFX");

  // Cabeza (pivote en el cuello)
  const head = el("g", {}, bodyG);
  const h = el("g", {}, head);
  // pelo de la nuca (detrás de la cara)
  el("path", { d: "M-78 -170 C-86 -240 -40 -280 4 -280 C52 -280 88 -244 80 -170 C80 -140 74 -120 70 -110 L-70 -110 C-74 -124 -80 -146 -78 -170 Z", fill: "url(#hairG)" }, h);
  // orejas
  for (const s of [-1, 1]) {
    el("path", { d: `M${s * 66} -150 C${s * 86} -162 ${s * 92} -128 ${s * 82} -108 C${s * 76} -98 ${s * 68} -100 ${s * 64} -106 Z`, fill: SKIN_D }, h);
    el("path", { d: `M${s * 70} -140 C${s * 80} -144 ${s * 82} -126 ${s * 76} -114`, stroke: SKIN_DD, "stroke-width": 3, fill: "none" }, h);
  }
  // cara
  el("path", { d: "M-68 -170 C-69 -120 -64 -90 -50 -68 C-38 -50 -20 -40 0 -40 C20 -40 38 -50 50 -68 C64 -90 69 -120 68 -170 C66 -228 36 -252 0 -252 C-36 -252 -66 -228 -68 -170 Z", fill: "url(#skinG)" }, h);
  // sombra lateral y de mandíbula
  el("path", { d: "M68 -170 C70 -116 60 -84 42 -62 C30 -48 18 -42 6 -40 C30 -60 48 -100 50 -170 Z", fill: SKIN_DD, opacity: 0.28 }, h);
  el("path", { d: "M-30 -48 C-14 -38 14 -38 30 -48 C18 -44 -18 -44 -30 -48 Z", fill: SKIN_DD, opacity: 0.5 }, h);
  // mejillas
  el("ellipse", { cx: -44, cy: -98, rx: 16, ry: 8, fill: "#E3A08F", opacity: 0.12 }, h);
  el("ellipse", { cx: 44, cy: -98, rx: 16, ry: 8, fill: "#E3A08F", opacity: 0.12 }, h);
  // nariz
  el("path", { d: "M-4 -146 C-6 -126 -12 -112 -12 -104 C-12 -97 -4 -95 2 -97", stroke: SKIN_DD, "stroke-width": 3.5, fill: "none", "stroke-linecap": "round" }, h);
  el("path", { d: "M-14 -101 C-10 -97 -6 -97 -4 -99 M6 -99 C8 -97 12 -97 15 -101", stroke: "#A97564", "stroke-width": 3, fill: "none", "stroke-linecap": "round" }, h);
  el("ellipse", { cx: 2, cy: -110, rx: 7, ry: 4, fill: "#fff", opacity: 0.25 }, h);
  // ojos
  const eyes = [];
  for (const s of [-1, 1]) {
    const cx = s * 31, cy = -146;
    const g = el("g", {}, h);
    const id = `eyeClip${s < 0 ? "L" : "R"}`;
    const cp = el("clipPath", { id }, g);
    const almond = `M${cx - 17} ${cy} C${cx - 10} ${cy - 11} ${cx + 10} ${cy - 11} ${cx + 17} ${cy} C${cx + 10} ${cy + 8} ${cx - 10} ${cy + 8} ${cx - 17} ${cy} Z`;
    el("path", { d: almond }, cp);
    el("path", { d: almond, fill: "#FBF7F2" }, g);
    const iris = el("g", { "clip-path": `url(#${id})` }, g);
    const irisIn = el("g", {}, iris);
    el("circle", { cx, cy: cy - 1, r: 9, fill: "#4A3022" }, irisIn);
    el("circle", { cx, cy: cy - 1, r: 4.5, fill: "#120B08" }, irisIn);
    el("circle", { cx: cx + 3, cy: cy - 4, r: 2.4, fill: "#fff" }, irisIn);
    const lid = el("path", { fill: SKIN_D }, g);
    el("path", { d: `M${cx - 18} ${cy + 1} C${cx - 10} ${cy - 12} ${cx + 10} ${cy - 12} ${cx + 18} ${cy - 1}`, stroke: "#1A110D", "stroke-width": 2.4, fill: "none", "stroke-linecap": "round" }, g);
    el("path", { d: `M${cx - 14} ${cy + 6} C${cx - 6} ${cy + 9} ${cx + 6} ${cy + 9} ${cx + 14} ${cy + 5}`, stroke: SKIN_DD, "stroke-width": 1.2, fill: "none", opacity: 0.45 }, g);
    eyes.push({ g, irisIn, lid, cx, cy, s });
  }
  const browL = el("path", { fill: HAIR }, h), browR = el("path", { fill: HAIR }, h);
  // boca
  const mouthIn = el("path", { fill: "#3A1612" }, h);
  const teeth = el("path", { fill: "#F7F3EE" }, h);
  const tongue = el("ellipse", { fill: "#C9605A" }, h);
  const lipU = el("path", { fill: "url(#lipG)" }, h);
  const lipL = el("path", { fill: "#C9978B" }, h);
  const mouthLine = el("path", { stroke: "#8E4E45", "stroke-width": 2.6, fill: "none", "stroke-linecap": "round" }, h);
  // pelo delantero: volumen y flequillo sobre la frente
  {
    // flequillo: mechones irregulares que caen sobre la frente, peinados hacia un lado
    const tips = [[72, -178], [58, -204], [46, -194], [32, -210], [18, -196], [4, -208], [-10, -190], [-24, -200], [-38, -178], [-52, -186], [-66, -160]];
    let d = "M76 -160 C86 -236 50 -274 2 -274 C-46 -274 -86 -234 -74 -160";
    let prev = [-74, -160];
    for (let i = tips.length - 1; i >= 0; i--) {
      const [x, y] = tips[i];
      const mx = (prev[0] + x) / 2 + 12, my = Math.min(prev[1], y) - 26;
      d += ` Q${mx} ${my} ${x} ${y}`;
      prev = [x, y];
    }
    d += " Q74 -176 76 -160 Z";
    el("path", { d, fill: "url(#hairG)" }, h);
  }
  el("path", { d: "M-74 -160 C-78 -140 -76 -128 -70 -118 C-68 -140 -66 -156 -60 -172 Z", fill: HAIR }, h);
  el("path", { d: "M76 -160 C80 -140 78 -128 72 -118 C70 -140 68 -156 62 -172 Z", fill: HAIR }, h);
  for (const d of ["M50 -262 C26 -252 4 -238 -12 -224", "M66 -242 C48 -234 32 -226 20 -216", "M16 -270 C-10 -260 -34 -246 -52 -228"])
    el("path", { d, stroke: HAIR_L, "stroke-width": 3.5, fill: "none", "stroke-linecap": "round", opacity: 0.65 }, h);
  el("path", { d: "M-10 -268 C14 -272 34 -266 50 -254", stroke: "#7A5A47", "stroke-width": 5, fill: "none", "stroke-linecap": "round", opacity: 0.35 }, h);

  // Brazos y manos
  function makeArm(side) {
    const sh = el("g", {}, bodyG);
    const upper = el("g", {}, sh);
    el("circle", { cx: 0, cy: 6, r: 44, fill: HOOD, stroke: RIM, "stroke-width": 3 }, upper); // deltoides
    el("path", { d: `M-34 10 C-44 40 -40 72 -26 ${UPPER} L26 ${UPPER} C36 72 40 40 34 10 Z`, fill: HOOD, stroke: RIM, "stroke-width": 3 }, upper);
    el("path", { d: `M${-side * 30} 30 C${-side * 40} 50 ${-side * 36} 72 ${-side * 24} ${UPPER - 6}`, stroke: "#3E4E74", "stroke-width": 5, fill: "none", "stroke-linecap": "round", opacity: 0.7 }, upper); // bíceps
    el("path", { d: `M${side * 20} 16 C${side * 30} 44 ${side * 28} 70 ${side * 18} ${UPPER - 4}`, stroke: "#0E1424", "stroke-width": 4, fill: "none", opacity: 0.5 }, upper);
    const fore = el("g", {}, upper);
    el("path", { d: `M-28 -4 C-32 30 -26 60 -20 ${FORE} L20 ${FORE} C26 60 32 30 28 -4 Z`, fill: HOOD, stroke: RIM, "stroke-width": 3 }, fore);
    el("circle", { cx: 0, cy: 0, r: 28, fill: HOOD }, fore);
    el("rect", { x: -22, y: FORE - 16, width: 44, height: 18, rx: 6, fill: "#141B2E" }, fore);
    for (let x = -16; x <= 16; x += 8) el("path", { d: `M${x} ${FORE - 14} V${FORE}`, stroke: "#22304E", "stroke-width": 2 }, fore);
    const hand = el("g", { transform: `translate(0,${FORE + 2}) scale(1.15)` }, fore);
    const finger = (x, len, w = 11, a = 0) => el("path", { d: `M${x} 18 L${(x + Math.sin(a) * len).toFixed(1)} ${(18 + Math.cos(a) * len).toFixed(1)}`, stroke: SKIN, "stroke-width": w, "stroke-linecap": "round" }, hand);
    const open = el("g", {}, hand), fist = el("g", {}, hand), point = el("g", {}, hand);
    // mano abierta
    for (const [x, l, a] of [[-14, 34, 0.25], [-4, 40, 0.08], [7, 38, -0.08], [16, 30, -0.25]]) open.appendChild(finger(x, l, 10, a));
    // puño
    el("rect", { x: -20, y: 12, width: 40, height: 22, rx: 10, fill: SKIN }, fist);
    el("path", { d: "M-12 30 V22 M0 31 V22 M12 30 V22", stroke: SKIN_DD, "stroke-width": 2.4, "stroke-linecap": "round" }, fist);
    // señalar (índice extendido)
    point.appendChild(finger(-4, 54, 11, 0));
    el("rect", { x: -16, y: 10, width: 34, height: 20, rx: 9, fill: SKIN }, point);
    el("path", { d: `M0 -2 C-16 -2 -24 10 -22 22 C-20 32 -10 36 0 36 C12 36 22 30 22 18 C22 6 14 -2 0 -2 Z`, fill: SKIN }, hand);
    const thumb = el("path", { d: "", stroke: SKIN, "stroke-width": 11, "stroke-linecap": "round" }, hand);
    el("path", { d: "M-14 22 C-6 28 6 28 14 22", stroke: SKIN_DD, "stroke-width": 2, fill: "none", opacity: 0.6 }, hand);
    return { sh, upper, fore, open, fist, point, thumb, side };
  }
  const armL = makeArm(-1), armR = makeArm(1);

  function update(s) {
    const sc = s.scale ?? 1;
    setT(root, s.x, s.y, sc);
    const jump = s.jump ?? 0, squash = s.squash ?? 0;
    shadow.setAttribute("rx", (150 * (1 - jump / 500)).toFixed(1));
    shadow.setAttribute("opacity", (0.45 * (1 - jump / 400)).toFixed(3));
    bodyG.setAttribute("transform", `translate(0,${(-jump).toFixed(2)}) scale(${(1 + squash * 0.05).toFixed(4)},${(1 - squash * 0.05).toFixed(4)})`);
    head.setAttribute("transform", `translate(0,${(-302 + (s.headY ?? 0)).toFixed(2)}) rotate(${((s.tilt ?? 0) * 0.8).toFixed(2)},0,-40) scale(0.92)`);
    // ojos: mirada y parpadeo
    const lx = clamp(s.lookX ?? 0, -1, 1) * 6, ly = clamp(s.lookY ?? 0, -1, 1) * 3;
    const bl = clamp(s.blink ?? 0);
    for (const e of eyes) {
      e.irisIn.setAttribute("transform", `translate(${lx.toFixed(2)},${ly.toFixed(2)})`);
      const yc = e.cy - 12 + bl * 20, x0 = e.cx - 18, x1 = e.cx + 18;
      e.lid.setAttribute("d", `M${x0} ${e.cy - 14} L${x1} ${e.cy - 14} L${x1} ${(e.cy - 2 + bl * 2).toFixed(1)} C${e.cx + 10} ${yc.toFixed(1)} ${e.cx - 10} ${yc.toFixed(1)} ${x0} ${(e.cy + bl * 2).toFixed(1)} Z`);
      e.lid.setAttribute("opacity", bl > 0.05 ? 1 : 0);
    }
    // cejas
    const b = s.brow ?? 0, think = s.mood === "think";
    const brow = (sgn, lift) => {
      const xi = sgn * 13, xo = sgn * 52, y = -168 - lift;
      return `M${xi} ${y + 4} C${sgn * 26} ${y - 6} ${sgn * 40} ${y - 7} ${xo} ${y - 1} L${xo} ${y + 5} C${sgn * 40} ${y - 1} ${sgn * 26} ${y + 1} ${xi} ${y + 11} Z`;
    };
    browL.setAttribute("d", brow(-1, b * 7 + (think ? 6 : 0)));
    browR.setAttribute("d", brow(1, b * 7 - (think ? 3 : 0)));
    // boca: apertura 0..1, sonrisa -1..1
    const o = clamp(s.mouth ?? 0), sm = clamp(s.smile ?? 0.5, -1, 1);
    const w = 17 + sm * 4 + o * 2, y0 = -72, corner = y0 - sm * 5;
    const openH = o * 22;
    const upY = y0 - 3, loY = y0 + 2 + openH + Math.max(0, sm) * 3;
    mouthIn.setAttribute("d", `M${-w} ${corner} C${-w * 0.5} ${upY} ${w * 0.5} ${upY} ${w} ${corner} C${w * 0.5} ${loY} ${-w * 0.5} ${loY} ${-w} ${corner} Z`);
    op(mouthIn, o > 0.06 ? 1 : 0);
    teeth.setAttribute("d", `M${-w * 0.7} ${upY + 1} C${-w * 0.3} ${upY - 1} ${w * 0.3} ${upY - 1} ${w * 0.7} ${upY + 1} L${w * 0.6} ${upY + 1 + Math.min(7, openH * 0.5)} C${w * 0.2} ${upY + 3 + Math.min(7, openH * 0.5)} ${-w * 0.2} ${upY + 3 + Math.min(7, openH * 0.5)} ${-w * 0.6} ${upY + 1 + Math.min(7, openH * 0.5)} Z`);
    op(teeth, o > 0.15 ? 1 : 0);
    tongue.setAttribute("cx", 0); tongue.setAttribute("cy", (loY - 4).toFixed(1)); tongue.setAttribute("rx", (w * 0.45).toFixed(1)); tongue.setAttribute("ry", (3 + o * 4).toFixed(1));
    op(tongue, o > 0.3 ? 1 : 0);
    lipU.setAttribute("d", `M${-w - 1} ${corner} C${-w * 0.6} ${upY - 4} ${-4} ${upY - 4} 0 ${upY - 2} C4 ${upY - 4} ${w * 0.6} ${upY - 4} ${w + 1} ${corner} C${w * 0.5} ${upY + 1} ${-w * 0.5} ${upY + 1} ${-w - 1} ${corner} Z`);
    lipL.setAttribute("d", `M${-w + 2} ${corner + 1} C${-w * 0.5} ${loY + 1} ${w * 0.5} ${loY + 1} ${w - 2} ${corner + 1} C${w * 0.5} ${loY + 6} ${-w * 0.5} ${loY + 6} ${-w + 2} ${corner + 1} Z`);
    mouthLine.setAttribute("d", o > 0.06 ? "" : `M${-w} ${corner} C${-w * 0.4} ${y0 + 1 + sm * 2} ${w * 0.4} ${y0 + 1 + sm * 2} ${w} ${corner}`);
    // brazos (hombros en ±108, -178)
    for (const [arm, shA, elb, hand] of [[armL, s.shL ?? 14, s.elL ?? -12, s.handL ?? "fist"], [armR, s.shR ?? -14, s.elR ?? 12, s.handR ?? "fist"]]) {
      arm.sh.setAttribute("transform", `translate(${arm.side * 146},-268) rotate(${shA.toFixed(2)})`);
      arm.fore.setAttribute("transform", `translate(0,${UPPER}) rotate(${elb.toFixed(2)})`);
      arm.open.style.display = hand === "open" ? "" : "none";
      arm.fist.style.display = hand === "fist" ? "" : "none";
      arm.point.style.display = hand === "point" ? "" : "none";
      const tx = -arm.side * 18;
      arm.thumb.setAttribute("d", hand === "open" ? `M${tx * 0.8} 14 L${tx * 1.6} 30` : `M${tx * 0.9} 12 L${tx * 0.7} 26`);
    }
  }
  return { root, update };
}

// Poses base (se mezclan con keyframes)
const POSE = {
  rest: { shL: 14, elL: -12, shR: -14, elR: 12, tilt: 0, brow: 0, smile: 0.5 },
  hips: { shL: 40, elL: -95, shR: -40, elR: 95, tilt: 0, brow: 0.2, smile: 0.6 },
  wave: { shL: 14, elL: -12, shR: -150, elR: -20, tilt: -4, brow: 0.6, smile: 0.9 },
  point: { shL: 14, elL: -12, shR: -128, elR: -12, tilt: -5, brow: 0.4, smile: 0.6 },
  pointUp: { shL: 14, elL: -12, shR: -165, elR: -5, tilt: -3, brow: 0.6, smile: 0.6 },
  present: { shL: 70, elL: 35, shR: -70, elR: -35, tilt: 0, brow: 0.5, smile: 0.7 },
  explainR: { shL: 14, elL: -12, shR: -75, elR: -60, tilt: 3, brow: 0.3, smile: 0.5 },
  explainL: { shL: 75, elL: 60, shR: -14, elR: 12, tilt: -3, brow: 0.3, smile: 0.5 },
  think: { shL: -60, elL: -104, shR: -14, elR: 12, tilt: 7, brow: -0.2, smile: -0.1 },
  cheer: { shL: 140, elL: 25, shR: -140, elR: -25, tilt: 0, brow: 1, smile: 1 },
  shrug: { shL: 55, elL: 70, shR: -55, elR: -70, tilt: 6, brow: 0.8, smile: 0 },
};
