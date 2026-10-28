// Leo — personaje de kit vectorial plano (cuerpo completo, sombreado a dos tonos).
// Look de la foto: pelo oscuro con flequillo de lado, sudadera azul marino de media cremallera,
// cuello rojo de camisa, pantalón oscuro. Complexión delgada y atlética, proporciones reales.
// Origen = entre los pies (y = 0). Ángulos de brazo: 0 = colgando; derecho negativo = arriba/fuera.
const LF = {
  skin: "#F1C7A5", skinS: "#DCA582", hair: "#22170F", hairS: "#3A2A1F",
  top: "#22305A", topS: "#18223F", topL: "#2D3E70", collar: "#A32A3A",
  pants: "#2F333B", pantsS: "#24272D", shoe: "#F2F2F2", shoeS: "#C9CDD3", sole: "#3A3F47",
};
const UA = 118, FA = 106; // largo de brazo y antebrazo

function createLeo(parent) {
  const root = el("g", {}, parent);
  const shadow = el("ellipse", { cx: 0, cy: 4, rx: 110, ry: 16, fill: "#000", opacity: 0.4 }, root);
  const bodyG = el("g", {}, root);

  // Piernas
  const legs = [-1, 1].map((sd) => {
    const g = el("g", {}, bodyG);
    el("path", { d: `M${sd * 4} -336 L${sd * 60} -336 L${sd * 52} -30 L${sd * 14} -30 Z`, fill: LF.pants }, g);
    el("path", { d: `M${sd * 38} -336 L${sd * 60} -336 L${sd * 52} -30 L${sd * 38} -30 Z`, fill: sd > 0 ? LF.pantsS : LF.pants }, g);
    el("path", { d: `M${sd * 30} -330 L${sd * 32} -200`, stroke: "#3A3F48", "stroke-width": 2, opacity: 0.8 }, g); // raya del pantalón
    el("path", { d: `M${sd * 12} -46 L${sd * 52} -46 L${sd * 52} -30 L${sd * 14} -30 Z`, fill: LF.pantsS }, g); // bajo
    el("path", { d: `M${sd * 10} -34 L${sd * 54} -34 C${sd * 70} -30 ${sd * 82} -16 ${sd * 82} 0 L${sd * 6} 0 Z`, fill: LF.shoe }, g);
    el("path", { d: `M${sd * 30} -32 L${sd * 34} -22 M${sd * 38} -30 L${sd * 42} -20 M${sd * 46} -28 L${sd * 50} -18`, stroke: LF.shoeS, "stroke-width": 2.4 }, g); // cordones
    el("path", { d: `M${sd * 20} -14 C${sd * 40} -10 ${sd * 60} -16 ${sd * 74} -8`, stroke: C.em, "stroke-width": 4, fill: "none", "stroke-linecap": "round" }, g); // franja
    el("path", { d: `M${sd * 6} -6 L${sd * 82} -6 L${sd * 82} 0 L${sd * 6} 0 Z`, fill: LF.sole }, g);
    return g;
  });

  const upper = el("g", { transform: "translate(0,56)" }, bodyG);
  // Torso (sudadera ajustada, cintura algo más estrecha que el pecho, sin caja ancha)
  const torso = el("g", {}, upper);
  el("path", { d: "M-64 -380 C-62 -420 -60 -440 -64 -470 C-70 -510 -90 -540 -96 -566 C-100 -586 -88 -600 -64 -606 C-48 -610 -32 -610 -22 -614 L22 -614 C32 -610 48 -610 64 -606 C88 -600 100 -586 96 -566 C90 -540 70 -510 64 -470 C60 -440 62 -420 64 -380 Z", fill: LF.top }, torso);
  el("path", { d: "M40 -608 C72 -602 100 -586 96 -566 C90 -540 70 -510 64 -470 C60 -440 62 -420 64 -380 L38 -380 C44 -430 48 -480 58 -528 C64 -560 58 -592 40 -608 Z", fill: LF.topS }, torso);
  el("path", { d: "M-74 -596 C-62 -572 -48 -560 -26 -556 C-50 -550 -70 -560 -86 -576 Z", fill: LF.topL, opacity: 0.75 }, torso); // brillo
  el("path", { d: "M-82 -546 C-58 -524 -28 -522 -6 -532 M82 -546 C58 -524 28 -522 6 -532", stroke: "#131B33", "stroke-width": 3.5, fill: "none", "stroke-linecap": "round" }, torso); // pectorales
  el("path", { d: "M-56 -470 C-40 -462 -24 -462 -10 -468 M50 -452 C36 -446 22 -446 12 -452 M-52 -428 C-36 -420 -20 -422 -8 -428", stroke: "#131B33", "stroke-width": 2.5, fill: "none", "stroke-linecap": "round", opacity: 0.8 }, torso); // pliegues
  el("path", { d: "M-64 -380 L64 -380 L66 -362 L-66 -362 Z", fill: LF.topS }, torso); // puño elástico
  for (let x = -58; x <= 58; x += 8) el("path", { d: `M${x} -378 V-364`, stroke: "#141C34", "stroke-width": 1.6 }, torso);
  // cremallera y cuello
  el("path", { d: "M-3 -596 L-3 -520 L3 -520 L3 -596 Z", fill: "#141C34" }, torso);
  el("rect", { x: -3, y: -540, width: 6, height: 14, rx: 2, fill: "#C9CED6" }, torso);
  el("path", { d: "M-16 -606 L0 -586 L-3 -614 Z", fill: LF.collar }, torso);
  el("path", { d: "M16 -606 L0 -586 L3 -614 Z", fill: "#8A2130" }, torso);
  el("path", { d: "M-30 -594 C-36 -610 -32 -624 -24 -628 L-8 -604 C-14 -598 -22 -596 -30 -594 Z", fill: LF.topL }, torso);
  el("path", { d: "M30 -594 C36 -610 32 -624 24 -628 L8 -604 C14 -598 22 -596 30 -594 Z", fill: LF.topS }, torso);
  el("text", { x: 30, y: -560, "text-anchor": "middle", "font-family": "Inter", "font-weight": 900, "font-size": 15, fill: C.em }, torso, "LFX");

  // Cuello y cabeza
  el("path", { d: "M-18 -652 L18 -652 L22 -604 L-22 -604 Z", fill: LF.skin }, upper);
  el("path", { d: "M4 -652 L18 -652 L22 -604 L6 -604 Z", fill: LF.skinS }, upper);
  el("path", { d: "M-18 -620 C-8 -612 8 -612 18 -620", stroke: LF.skinS, "stroke-width": 3, fill: "none" }, upper);
  const head = el("g", {}, upper);
  const h = el("g", {}, head);
  el("path", { d: "M-46 -716 C-50 -770 50 -770 46 -716 L46 -690 L-46 -690 Z", fill: LF.hair }, h); // nuca
  for (const sd of [-1, 1]) { el("ellipse", { cx: sd * 44, cy: -700, rx: 9, ry: 13, fill: LF.skin }, h); el("ellipse", { cx: sd * 45, cy: -700, rx: 4, ry: 7, fill: LF.skinS }, h); }
  el("path", { d: "M-42 -722 C-44 -680 -36 -654 -18 -644 C-10 -640 10 -640 18 -644 C36 -654 44 -680 42 -722 C40 -760 -40 -760 -42 -722 Z", fill: LF.skin }, h);
  el("path", { d: "M14 -760 C34 -752 44 -738 42 -722 C44 -680 36 -654 18 -644 C12 -641 6 -640 2 -640 C24 -660 32 -700 14 -760 Z", fill: LF.skinS, opacity: 0.55 }, h);
  el("ellipse", { cx: -24, cy: -682, rx: 8, ry: 5, fill: "#E89C8E", opacity: 0.35 }, h);
  el("ellipse", { cx: 24, cy: -682, rx: 8, ry: 5, fill: "#E89C8E", opacity: 0.35 }, h);
  const eyes = [-1, 1].map((sd) => {
    const g = el("g", {}, h);
    const pupil = el("ellipse", { cx: sd * 16, cy: -704, rx: 4.6, ry: 6, fill: "#1B120C" }, g);
    const shine = el("circle", { cx: sd * 16 + 1.6, cy: -706, r: 1.6, fill: "#fff" }, g);
    return { g, pupil, shine, sd };
  });
  const browL = el("path", { stroke: LF.hair, "stroke-width": 4.5, "stroke-linecap": "round", fill: "none" }, h);
  const browR = el("path", { stroke: LF.hair, "stroke-width": 4.5, "stroke-linecap": "round", fill: "none" }, h);
  el("path", { d: "M2 -700 L-3 -684 L4 -682", stroke: LF.skinS, "stroke-width": 3, fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" }, h);
  const mouth = el("path", { fill: "#6B2A24" }, h);
  const teeth = el("path", { fill: "#fff" }, h);
  const mline = el("path", { stroke: "#8A4A40", "stroke-width": 3, fill: "none", "stroke-linecap": "round" }, h);
  // flequillo de lado (mechones con picos, como en la foto)
  el("path", { d: "M-48 -712 C-58 -770 -20 -790 12 -786 C44 -784 60 -762 50 -712 L44 -730 L38 -716 L30 -738 L18 -722 L10 -744 L-2 -726 L-12 -746 L-22 -728 L-32 -742 L-40 -722 Z", fill: LF.hair }, h);
  el("path", { d: "M-30 -778 C-6 -790 24 -788 40 -772", stroke: LF.hairS, "stroke-width": 5, fill: "none", "stroke-linecap": "round" }, h);
  el("path", { d: "M-20 -764 C-12 -752 -10 -740 -14 -730 M8 -772 C16 -760 18 -748 12 -736 M30 -764 C36 -754 38 -744 34 -734", stroke: LF.hairS, "stroke-width": 3, fill: "none", "stroke-linecap": "round", opacity: 0.8 }, h);
  el("path", { d: "M-44 -718 L-42 -696 L-38 -712 Z M44 -718 L42 -696 L38 -712 Z", fill: LF.hair }, h); // patillas
  el("path", { d: "M-14 -646 C-6 -642 6 -642 14 -646", stroke: LF.skinS, "stroke-width": 2.5, fill: "none", "stroke-linecap": "round", opacity: 0.8 }, h); // barbilla
  el("path", { d: "M-4 -786 L-16 -800 L4 -792 L12 -804 L18 -786 Z", fill: LF.hair }, h);

  // Brazos
  function makeArm(sd) {
    const sh = el("g", {}, upper);
    const up = el("g", {}, sh);
    el("path", { d: `M-26 -4 C-30 26 -28 64 -18 ${UA} L18 ${UA} C26 64 30 26 26 -4 Z`, fill: LF.top }, up);
    el("path", { d: `M${-sd * 6} 22 C${-sd * 32} 38 ${-sd * 32} 82 ${-sd * 16} ${UA - 4} L${-sd * 4} ${UA - 4} C${-sd * 10} 80 ${-sd * 8} 46 ${-sd * 6} 22 Z`, fill: LF.topL, opacity: 0.7 }, up); // bíceps
    el("path", { d: `M${sd * 6} -4 C${sd * 12} 40 ${sd * 12} 80 ${sd * 8} ${UA} L${sd * 18} ${UA} C${sd * 26} 64 ${sd * 30} 26 ${sd * 26} -4 Z`, fill: LF.topS }, up);
    el("circle", { cx: 0, cy: 4, r: 26, fill: LF.top }, up); // deltoides
    el("path", { d: `M${-sd * 20} 10 C${-sd * 10} -10 ${sd * 10} -14 ${sd * 22} 4`, stroke: LF.topL, "stroke-width": 4, fill: "none", opacity: 0.6, "stroke-linecap": "round" }, up);
    const fo = el("g", {}, up);
    el("circle", { cx: 0, cy: 0, r: 19, fill: LF.top }, fo);
    el("path", { d: `M-20 0 C-23 34 -19 70 -14 ${FA} L14 ${FA} C19 70 23 34 20 0 Z`, fill: LF.top }, fo);
    el("path", { d: `M${sd * 4} 0 C${sd * 8} 40 ${sd * 8} 70 ${sd * 6} ${FA} L${sd * 14} ${FA} C${sd * 19} 70 ${sd * 23} 34 ${sd * 20} 0 Z`, fill: LF.topS }, fo);
    el("path", { d: `M-10 6 C-4 12 4 12 10 6`, stroke: "#131B33", "stroke-width": 2.5, fill: "none", "stroke-linecap": "round" }, fo); // pliegue del codo
    el("rect", { x: -15, y: FA - 14, width: 30, height: 14, rx: 3, fill: LF.topS }, fo);
    for (let x = -10; x <= 10; x += 5) el("path", { d: `M${x} ${FA - 12} V${FA - 2}`, stroke: "#141C34", "stroke-width": 1.4 }, fo);
    const hand = el("g", { transform: `translate(0,${FA + 2}) scale(1.12)` }, fo);
    const fist = el("g", {}, hand), open = el("g", {}, hand), point = el("g", {}, hand);
    el("path", { d: "M-12 0 C-15 12 -13 26 0 28 C13 26 15 12 12 0 Z", fill: LF.skin }, fist);
    el("path", { d: "M-12 0 C-16 18 -14 34 -8 44 L-4 44 L-4 26 L0 46 L5 46 L5 26 L9 44 L13 42 L12 20 C14 12 14 6 12 0 Z", fill: LF.skin }, open);
    el("path", { d: "M-12 0 C-15 12 -13 24 -2 26 L-2 50 C-2 54 4 54 4 50 L4 26 C13 24 15 12 12 0 Z", fill: LF.skin }, point);
    const thumb = el("path", { d: `M${-sd * 11} 6 C${-sd * 20} 12 ${-sd * 22} 20 ${-sd * 18} 24`, stroke: LF.skin, "stroke-width": 8, "stroke-linecap": "round", fill: "none" }, hand);
    return { sh, up, fo, fist, open, point, thumb, sd };
  }
  const armL = makeArm(-1), armR = makeArm(1);

  function update(s) {
    setT(root, s.x, s.y, s.scale ?? 1);
    const jump = s.jump ?? 0, sq = s.squash ?? 0;
    shadow.setAttribute("rx", (110 * (1 - jump / 600)).toFixed(1));
    bodyG.setAttribute("transform", `translate(0,${(-jump).toFixed(2)}) scale(${(1 + sq * 0.03).toFixed(4)},${(1 - sq * 0.03).toFixed(4)})`);
    // peso del cuerpo: ligera oscilación de piernas
    const sway = Math.sin((s.t ?? 0) * 1.6) * 1.5;
    legs[0].setAttribute("transform", `rotate(${sway.toFixed(2)},-30,-336)`); legs[1].setAttribute("transform", `rotate(${(-sway).toFixed(2)},30,-336)`);
    head.setAttribute("transform", `translate(0,${(s.headY ?? 0).toFixed(2)}) rotate(${((s.tilt ?? 0) * 0.9).toFixed(2)},0,-640)`);
    const lx = clamp(s.lookX ?? 0, -1, 1) * 3, ly = clamp(s.lookY ?? 0, -1, 1) * 2;
    const bl = clamp(s.blink ?? 0);
    for (const e of eyes) {
      e.g.setAttribute("transform", `translate(${lx.toFixed(2)},${ly.toFixed(2)}) translate(0,-704) scale(1,${(1 - bl * 0.9).toFixed(3)}) translate(0,704)`);
    }
    const b = s.brow ?? 0, think = s.mood === "think";
    browL.setAttribute("d", `M-24 ${(-716 - b * 4 - (think ? 2 : 0)).toFixed(1)} Q-16 ${(-720 - b * 5).toFixed(1)} -8 ${(-716 - b * 4).toFixed(1)}`);
    browR.setAttribute("d", `M8 ${(-716 - b * 4).toFixed(1)} Q16 ${(-720 - b * 5 - (think ? 4 : 0)).toFixed(1)} 24 ${(-716 - b * 4 + (think ? 2 : 0)).toFixed(1)}`);
    const o = clamp(s.mouth ?? 0), sm = clamp(s.smile ?? 0.5, -1, 1);
    const w = 10 + sm * 3, y0 = -664 - sm * 1.5, lo = y0 + 2 + o * 13 + Math.max(0, sm) * 3;
    if (o > 0.08) {
      mouth.setAttribute("d", `M${-w} ${y0} Q0 ${y0 - 2} ${w} ${y0} Q0 ${lo + 3} ${-w} ${y0} Z`);
      teeth.setAttribute("d", `M${-w * 0.7} ${y0} Q0 ${y0 - 1.5} ${w * 0.7} ${y0} L${w * 0.6} ${y0 + 3} Q0 ${y0 + 4} ${-w * 0.6} ${y0 + 3} Z`);
      mline.setAttribute("d", "");
    } else {
      mouth.setAttribute("d", ""); teeth.setAttribute("d", "");
      mline.setAttribute("d", `M${-w} ${y0} Q0 ${(y0 + 1 + sm * 5).toFixed(1)} ${w} ${y0}`);
    }
    for (const [arm, sA, eA, hd] of [[armL, s.shL ?? 14, s.elL ?? -12, s.handL ?? "fist"], [armR, s.shR ?? -14, s.elR ?? 12, s.handR ?? "fist"]]) {
      arm.sh.setAttribute("transform", `translate(${arm.sd * 74},-578) rotate(${sA.toFixed(2)})`);
      arm.fo.setAttribute("transform", `translate(0,${UA}) rotate(${eA.toFixed(2)})`);
      arm.fist.style.display = hd === "fist" ? "" : "none"; arm.open.style.display = hd === "open" ? "" : "none"; arm.point.style.display = hd === "point" ? "" : "none";
      arm.thumb.style.display = hd === "fist" ? "none" : "";
    }
  }
  return { root, update };
}

const POSE = {
  rest: { shL: 8, elL: -6, shR: -8, elR: 6, tilt: 0, brow: 0, smile: 0.5 },
  wave: { shL: 8, elL: -6, shR: -150, elR: -25, tilt: -4, brow: 0.6, smile: 0.9 },
  point: { shL: 8, elL: -6, shR: -125, elR: -10, tilt: -5, brow: 0.4, smile: 0.6 },
  pointUp: { shL: 8, elL: -6, shR: -165, elR: -5, tilt: -3, brow: 0.6, smile: 0.6 },
  present: { shL: 60, elL: 40, shR: -60, elR: -40, tilt: 0, brow: 0.5, smile: 0.7 },
  explainR: { shL: 8, elL: -6, shR: -55, elR: -75, tilt: 3, brow: 0.3, smile: 0.5 },
  explainL: { shL: 55, elL: 75, shR: -8, elR: 6, tilt: -3, brow: 0.3, smile: 0.5 },
  think: { shL: -35, elL: -150, shR: -5, elR: 103, tilt: 7, brow: -0.2, smile: -0.1 },
  cheer: { shL: 150, elL: 20, shR: -150, elR: -20, tilt: 0, brow: 1, smile: 1 },
  shrug: { shL: 45, elL: 80, shR: -45, elR: -80, tilt: 6, brow: 0.8, smile: 0 },
};
